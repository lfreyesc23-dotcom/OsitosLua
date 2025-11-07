import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { protect, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Ver mis órdenes (protegido)
router.get('/my-orders', protect as any, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ message: 'Error al obtener órdenes' });
  }
});

// Crear orden y sesión de pago de Stripe (protegido o invitado)
router.post('/checkout', async (req: express.Request, res: Response) => {
  try {
    const { 
      items, 
      esInvitado = false, 
      emailInvitado, 
      nombreInvitado,
      direccion,
      ciudad,
      region,
      codigoPostal,
      costoEnvio = 0,
      couponId,
      descuento = 0
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    // Si es invitado, validar campos obligatorios
    if (esInvitado) {
      if (!emailInvitado || !nombreInvitado || !direccion || !ciudad || !region) {
        return res.status(400).json({ 
          message: 'Email, nombre y dirección completa son requeridos para compras como invitado' 
        });
      }
    }

    // Obtener userId si está autenticado
    const authHeader = req.headers.authorization;
    let userId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const jwt = require('jsonwebtoken');
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        userId = decoded.id;
      } catch (err) {
        // Token inválido, continuar como invitado
      }
    }

    // Obtener productos del carrito
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Validar stock
    for (const item of items) {
      const product = products.find((p: any) => p.id === item.productId);
      if (!product) {
        return res.status(404).json({ message: `Producto ${item.productId} no encontrado` });
      }
      if (product.stock < item.cantidad) {
        return res.status(400).json({
          message: `Stock insuficiente para ${product.nombre}`,
        });
      }
    }

    // Calcular total
    let total = 0;
    const orderItems = items.map((item: any) => {
      const product = products.find((p: any) => p.id === item.productId)!;
      total += product.precio * item.cantidad;
      return {
        productId: product.id,
        cantidad: item.cantidad,
      };
    });

    // Aplicar descuento de cupón
    const descuentoAplicado = descuento || 0;
    total -= descuentoAplicado;

    // Agregar costo de envío al total
    total += costoEnvio;

    // Si hay cupón, actualizar su contador de usos
    if (couponId) {
      await prisma.coupon.update({
        where: { id: couponId },
        data: {
          usosActuales: {
            increment: 1
          }
        }
      });
    }

    // Crear orden en estado PENDING
    const orderData: any = {
      total,
      status: 'PENDING',
      esInvitado,
      direccion,
      ciudad,
      region,
      codigoPostal,
      costoEnvio,
      descuento: descuentoAplicado,
      orderItems: {
        create: orderItems,
      },
    };

    // Asociar cupón si existe
    if (couponId) {
      orderData.couponId = couponId;
    }

    if (esInvitado) {
      orderData.emailInvitado = emailInvitado;
      orderData.nombreInvitado = nombreInvitado;
    } else if (userId) {
      orderData.userId = userId;
    }

    const order = await prisma.order.create({
      data: orderData,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Crear sesión de pago de Stripe
    const lineItems = order.orderItems.map((item: any) => ({
      price_data: {
        currency: 'clp', // Peso chileno
        product_data: {
          name: item.product.nombre,
          description: item.product.descripcion,
          images: item.product.imagenes.slice(0, 1),
        },
        unit_amount: Math.round(item.product.precio), // CLP no usa centavos
      },
      quantity: item.cantidad,
    }));

    // Agregar costo de envío como línea adicional si existe
    if (costoEnvio > 0) {
      lineItems.push({
        price_data: {
          currency: 'clp',
          product_data: {
            name: '📦 Envío',
            description: `Envío a ${ciudad}, ${region}`,
            images: [],
          },
          unit_amount: Math.round(costoEnvio),
        },
        quantity: 1,
      });
    }

    // Agregar descuento como línea negativa si existe
    if (descuentoAplicado > 0) {
      lineItems.push({
        price_data: {
          currency: 'clp',
          product_data: {
            name: '🎟️ Descuento aplicado',
            description: 'Cupón de descuento',
            images: [],
          },
          unit_amount: -Math.round(descuentoAplicado), // Monto negativo para descuento
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      customer_email: esInvitado ? emailInvitado : undefined,
      metadata: {
        orderId: order.id,
        esInvitado: esInvitado.toString(),
        ciudad: ciudad || '',
        region: region || '',
      },
    });

    // Guardar el sessionId en la orden
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error en checkout:', error);
    res.status(500).json({ message: 'Error al procesar el pago' });
  }
});

export default router;

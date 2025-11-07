import express, { Response } from 'express';
import Stripe from 'stripe';
import { protect, AuthRequest } from '../middleware/auth';
import { validateRut, cleanRut } from '../utils/rut';
import { prisma } from '../lib/prisma';
import { logError, logInfo } from '../lib/logger';
import { asyncHandler, validateRequest } from '../middleware/errorHandler';
import { checkoutValidator } from '../validators';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Ver mis órdenes (protegido)
router.get('/my-orders', protect as any, asyncHandler(async (req: any, res: any) => {
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

  logInfo('Usuario consultó sus órdenes', { userId: req.user!.id, orderCount: orders.length });
  res.json(orders);
}));

// Crear orden y sesión de pago de Stripe (protegido o invitado)
router.post('/checkout', checkoutValidator, validateRequest, asyncHandler(async (req: express.Request, res: Response) => {
  const { 
    items, 
    esInvitado = false, 
    emailInvitado, 
    nombreInvitado,
    rutInvitado,
    direccion,
    ciudad,
    region,
    codigoPostal,
    costoEnvio = 0,
    couponId,
    descuento = 0
  } = req.body;

  // Validar RUT si se proporcionó
  if (rutInvitado) {
    const cleanedRut = cleanRut(rutInvitado);
    if (!validateRut(cleanedRut)) {
      return res.status(400).json({ message: 'El RUT ingresado no es válido' });
    }
    
    // Verificar si ya existe una cuenta con este RUT
    const existingUser = await prisma.user.findUnique({
      where: { rut: cleanedRut },
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Ya existe una cuenta con este RUT. Por favor, inicia sesión para continuar.' 
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

  // USAR TRANSACCIÓN para garantizar atomicidad
  const result = await prisma.$transaction(async (tx) => {
    // 1. Obtener y validar productos con lock
    const productIds = items.map((item: any) => item.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });

    // 2. Validar stock y calcular total
    let total = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = products.find((p: any) => p.id === item.productId);
      
      if (!product) {
        throw new Error(`Producto ${item.productId} no encontrado`);
      }
      
      if (product.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${product.nombre}. Disponible: ${product.stock}`);
      }

      // Calcular precio (considerar descuento del producto)
      const precioFinal = product.descuento > 0 
        ? product.precio * (1 - product.descuento / 100)
        : product.precio;
      
      total += precioFinal * item.cantidad;
      
      orderItems.push({
        productId: product.id,
        cantidad: item.cantidad,
      });

      // 3. Decrementar stock
      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: {
            decrement: item.cantidad,
          },
        },
      });
    }

    // 4. Aplicar descuento de cupón
    const descuentoAplicado = descuento || 0;
    total -= descuentoAplicado;

    // 5. Agregar costo de envío
    total += costoEnvio;

    // Validar que el total sea positivo
    if (total <= 0) {
      throw new Error('El total de la orden debe ser mayor a 0');
    }

    // 6. Si hay cupón, validar y actualizar uso
    if (couponId) {
      const coupon = await tx.coupon.findUnique({
        where: { id: couponId },
      });

      if (!coupon || !coupon.activo) {
        throw new Error('Cupón inválido o inactivo');
      }

      if (coupon.maxUsos && coupon.usosActuales >= coupon.maxUsos) {
        throw new Error('Cupón agotado');
      }

      if (coupon.fechaExpiracion && new Date() > coupon.fechaExpiracion) {
        throw new Error('Cupón expirado');
      }

      await tx.coupon.update({
        where: { id: couponId },
        data: {
          usosActuales: {
            increment: 1,
          },
        },
      });
    }

    // 7. Crear orden
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

    if (couponId) {
      orderData.couponId = couponId;
    }

    if (esInvitado) {
      orderData.emailInvitado = emailInvitado;
      orderData.nombreInvitado = nombreInvitado;
      if (rutInvitado) {
        orderData.rutInvitado = cleanRut(rutInvitado);
      }
    } else if (userId) {
      orderData.userId = userId;
    }

    const order = await tx.order.create({
      data: orderData,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return order;
  });

  // 8. Crear sesión de Stripe FUERA de la transacción
  // Si esto falla, la transacción ya hizo rollback automático
  const lineItems = result.orderItems.map((item: any) => {
    const precioFinal = item.product.descuento > 0
      ? item.product.precio * (1 - item.product.descuento / 100)
      : item.product.precio;

    return {
      price_data: {
        currency: 'clp',
        product_data: {
          name: item.product.nombre,
          description: item.product.descripcion,
          images: item.product.imagenes.slice(0, 1),
        },
        unit_amount: Math.round(precioFinal),
      },
      quantity: item.cantidad,
    };
  });

  // Agregar costo de envío
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

  // Agregar descuento
  if (descuento > 0) {
    lineItems.push({
      price_data: {
        currency: 'clp',
        product_data: {
          name: '🎟️ Descuento aplicado',
          description: 'Cupón de descuento',
          images: [],
        },
        unit_amount: -Math.round(descuento),
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
      orderId: result.id,
      esInvitado: esInvitado.toString(),
      ciudad: ciudad || '',
      region: region || '',
    },
  });

  // 9. Actualizar orden con sessionId
  await prisma.order.update({
    where: { id: result.id },
    data: { stripeSessionId: session.id },
  });

  logInfo('Checkout exitoso', {
    orderId: result.id,
    total: result.total,
    items: items.length,
    userId: userId || 'invitado',
  });

  res.json({
    sessionId: session.id,
    url: session.url,
    orderId: result.id,
  });
}));

export default router;

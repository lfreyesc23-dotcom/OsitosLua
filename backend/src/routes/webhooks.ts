import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { sendOrderConfirmationEmail } from '../utils/email';

const router = express.Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Webhook de Stripe (ruta pública)
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).send('No se encontró la firma de Stripe');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error('Error al verificar webhook:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Manejar el evento
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error('No se encontró orderId en los metadatos');
        return res.status(400).send('orderId faltante');
      }

      try {
        // Obtener la orden con sus items
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            user: true,
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        });

        if (!order) {
          console.error('Orden no encontrada:', orderId);
          return res.status(404).send('Orden no encontrada');
        }

        // Actualizar el estado de la orden a COMPLETED
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'COMPLETED' },
        });

        // Reducir el stock de los productos
        for (const item of order.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.cantidad,
              },
            },
          });
        }

        // Determinar el email del cliente (usuario registrado o invitado)
        const customerEmail = order.esInvitado 
          ? order.emailInvitado! 
          : order.user?.email;

        if (!customerEmail) {
          console.error('No se encontró email para la orden:', orderId);
          return res.status(400).send('Email no encontrado');
        }

        // Enviar email de confirmación con dirección de envío
        await sendOrderConfirmationEmail(
          customerEmail,
          order.id,
          order.total,
          order.orderItems,
          {
            direccion: order.direccion,
            ciudad: order.ciudad,
            region: order.region,
            codigoPostal: order.codigoPostal,
            costoEnvio: order.costoEnvio,
          }
        );

        console.log(`✅ Orden ${orderId} completada exitosamente`);
      } catch (error) {
        console.error('Error al procesar orden:', error);
        return res.status(500).send('Error al procesar la orden');
      }
    }

    res.json({ received: true });
  }
);

export default router;

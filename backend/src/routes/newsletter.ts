import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, admin, AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

const router = Router();
const prisma = new PrismaClient();

// POST /api/newsletter/subscribe - Suscribirse al newsletter (público)
router.post('/subscribe', [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Verificar si ya existe
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      // Si existe pero está inactivo, reactivar
      if (!existing.activo) {
        await prisma.newsletter.update({
          where: { email },
          data: { activo: true },
        });
        return res.json({ 
          message: '¡Bienvenido de vuelta! Tu suscripción ha sido reactivada.',
          reactivated: true 
        });
      }
      return res.status(400).json({ message: 'Este email ya está suscrito' });
    }

    // Crear nueva suscripción
    await prisma.newsletter.create({
      data: { email },
    });

    res.status(201).json({ 
      message: '¡Gracias por suscribirte! Recibirás nuestras mejores ofertas.' 
    });
  } catch (error) {
    console.error('Error al suscribir al newsletter:', error);
    res.status(500).json({ message: 'Error al procesar tu suscripción' });
  }
});

// POST /api/newsletter/unsubscribe - Desuscribirse (público)
router.post('/unsubscribe', [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const subscription = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Email no encontrado en la lista' });
    }

    // Marcar como inactivo en lugar de eliminar (GDPR compliance)
    await prisma.newsletter.update({
      where: { email },
      data: { activo: false },
    });

    res.json({ message: 'Te has desuscrito exitosamente. Lamentamos verte partir.' });
  } catch (error) {
    console.error('Error al desuscribir del newsletter:', error);
    res.status(500).json({ message: 'Error al procesar tu desuscripción' });
  }
});

// --- RUTAS DE ADMINISTRACIÓN ---

// GET /api/newsletter/admin/subscribers - Obtener todos los suscriptores (admin)
router.get('/admin/subscribers', protect, admin, async (req: any, res: any) => {
  try {
    const { activo } = req.query;

    const where = activo !== undefined 
      ? { activo: activo === 'true' }
      : {};

    const subscribers = await prisma.newsletter.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const stats = {
      total: await prisma.newsletter.count(),
      activos: await prisma.newsletter.count({ where: { activo: true } }),
      inactivos: await prisma.newsletter.count({ where: { activo: false } }),
    };

    res.json({ subscribers, stats });
  } catch (error) {
    console.error('Error al obtener suscriptores:', error);
    res.status(500).json({ message: 'Error al obtener suscriptores' });
  }
});

// DELETE /api/newsletter/admin/:id - Eliminar suscriptor permanentemente (admin)
router.delete('/admin/:id', protect, admin, async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const subscription = await prisma.newsletter.findUnique({
      where: { id },
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Suscriptor no encontrado' });
    }

    await prisma.newsletter.delete({
      where: { id },
    });

    res.json({ message: 'Suscriptor eliminado permanentemente' });
  } catch (error) {
    console.error('Error al eliminar suscriptor:', error);
    res.status(500).json({ message: 'Error al eliminar suscriptor' });
  }
});

// POST /api/newsletter/admin/export - Exportar emails para campaña (admin)
router.get('/admin/export', protect, admin, async (req: any, res: any) => {
  try {
    const subscribers = await prisma.newsletter.findMany({
      where: { activo: true },
      select: { email: true },
    });

    const emails = subscribers.map((s: { email: string }) => s.email);

    res.json({ 
      emails,
      count: emails.length,
      csvFormat: emails.join(','),
      listFormat: emails.join('\n'),
    });
  } catch (error) {
    console.error('Error al exportar emails:', error);
    res.status(500).json({ message: 'Error al exportar emails' });
  }
});

export default router;

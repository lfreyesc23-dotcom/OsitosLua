import { Router, Request, Response } from 'express';
import { protect, admin } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { logError } from '../lib/logger';

const router = Router();

// Obtener todas las sugerencias (solo admin)
router.get('/', protect, admin, async (req: Request, res: Response): Promise<void> => {
  try {
    const sugerencias = await prisma.suggestion.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(sugerencias);
  } catch (error) {
    console.error('Error al obtener sugerencias:', error);
    res.status(500).json({ error: 'Error al obtener sugerencias' });
  }
});

// Marcar sugerencia como leída
router.patch('/:id/leido', protect, admin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const sugerencia = await prisma.suggestion.update({
      where: { id },
      data: { leido: true },
    });

    res.json(sugerencia);
  } catch (error) {
    console.error('Error al marcar como leída:', error);
    res.status(500).json({ error: 'Error al actualizar sugerencia' });
  }
});

// Marcar sugerencia como respondida
router.patch('/:id/respondido', protect, admin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const sugerencia = await prisma.suggestion.update({
      where: { id },
      data: { respondido: true, leido: true },
    });

    res.json(sugerencia);
  } catch (error) {
    console.error('Error al marcar como respondida:', error);
    res.status(500).json({ error: 'Error al actualizar sugerencia' });
  }
});

// Eliminar sugerencia
router.delete('/:id', protect, admin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.suggestion.delete({
      where: { id },
    });

    res.json({ message: 'Sugerencia eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar sugerencia:', error);
    res.status(500).json({ error: 'Error al eliminar sugerencia' });
  }
});

export default router;

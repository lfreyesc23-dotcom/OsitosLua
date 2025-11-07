import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, admin, AuthRequest } from '../middleware/auth';
import { body, param, validationResult } from 'express-validator';

const router = Router();
const prisma = new PrismaClient();

// Validaciones
const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating debe ser entre 1 y 5'),
  body('comentario').trim().isLength({ min: 10, max: 1000 }).withMessage('Comentario debe tener entre 10 y 1000 caracteres'),
  body('productId').isUUID().withMessage('ID de producto inválido'),
];

// POST /api/reviews - Crear review (requiere autenticación)
router.post('/', protect, reviewValidation, async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comentario, productId } = req.body;
    const userId = req.user!.id;

    // Verificar que el producto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar si ya existe una review del usuario para este producto
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Ya has dejado una review para este producto' });
    }

    // Crear la review
    const review = await prisma.review.create({
      data: {
        rating,
        comentario,
        userId,
        productId,
      },
      include: {
        user: {
          select: {
            nombre: true,
          },
        },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error al crear review:', error);
    res.status(500).json({ message: 'Error al crear review' });
  }
});

// GET /api/reviews/product/:productId - Obtener reviews aprobadas de un producto (público)
router.get('/product/:productId', [
  param('productId').isUUID().withMessage('ID de producto inválido'),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        aprobado: true,
      },
      include: {
        user: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calcular estadísticas
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews
      : 0;

    const ratingDistribution = {
      5: reviews.filter((r: any) => r.rating === 5).length,
      4: reviews.filter((r: any) => r.rating === 4).length,
      3: reviews.filter((r: any) => r.rating === 3).length,
      2: reviews.filter((r: any) => r.rating === 2).length,
      1: reviews.filter((r: any) => r.rating === 1).length,
    };

    res.json({
      reviews,
      stats: {
        totalReviews,
        averageRating: parseFloat(averageRating.toFixed(1)),
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error('Error al obtener reviews:', error);
    res.status(500).json({ message: 'Error al obtener reviews' });
  }
});

// GET /api/reviews/my-reviews - Obtener reviews del usuario autenticado
router.get('/my-reviews', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const reviews = await prisma.review.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          select: {
            id: true,
            nombre: true,
            imagen: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error al obtener reviews del usuario:', error);
    res.status(500).json({ message: 'Error al obtener reviews' });
  }
});

// PUT /api/reviews/:id - Editar propia review
router.put('/:id', protect, [
  param('id').isUUID().withMessage('ID de review inválido'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating debe ser entre 1 y 5'),
  body('comentario').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Comentario debe tener entre 10 y 1000 caracteres'),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { rating, comentario } = req.body;
    const userId = req.user!.id;

    // Verificar que la review existe y pertenece al usuario
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return res.status(404).json({ message: 'Review no encontrada' });
    }

    if (review.userId !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta review' });
    }

    // Actualizar review (vuelve a estado no aprobado si fue modificada)
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating }),
        ...(comentario && { comentario }),
        aprobado: false, // Requiere nueva aprobación
      },
      include: {
        user: {
          select: {
            nombre: true,
          },
        },
        product: {
          select: {
            nombre: true,
          },
        },
      },
    });

    res.json(updatedReview);
  } catch (error) {
    console.error('Error al editar review:', error);
    res.status(500).json({ message: 'Error al editar review' });
  }
});

// DELETE /api/reviews/:id - Eliminar propia review
router.delete('/:id', protect, [
  param('id').isUUID().withMessage('ID de review inválido'),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.user!.id;

    // Verificar que la review existe y pertenece al usuario
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return res.status(404).json({ message: 'Review no encontrada' });
    }

    if (review.userId !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta review' });
    }

    await prisma.review.delete({
      where: { id },
    });

    res.json({ message: 'Review eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar review:', error);
    res.status(500).json({ message: 'Error al eliminar review' });
  }
});

// --- RUTAS DE ADMINISTRACIÓN ---

// GET /api/reviews/admin/pending - Obtener reviews pendientes de aprobación
router.get('/admin/pending', protect, admin, async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        aprobado: false,
      },
      include: {
        user: {
          select: {
            nombre: true,
            email: true,
          },
        },
        product: {
          select: {
            nombre: true,
            imagen: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error al obtener reviews pendientes:', error);
    res.status(500).json({ message: 'Error al obtener reviews pendientes' });
  }
});

// GET /api/reviews/admin/all - Obtener todas las reviews (aprobadas y pendientes)
router.get('/admin/all', protect, admin, async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            nombre: true,
            email: true,
          },
        },
        product: {
          select: {
            nombre: true,
            imagen: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Estadísticas generales
    const stats = {
      total: reviews.length,
      aprobadas: reviews.filter((r: any) => r.aprobado).length,
      pendientes: reviews.filter((r: any) => !r.aprobado).length,
      promedioGeneral: reviews.length > 0
        ? parseFloat((reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1))
        : 0,
    };

    res.json({ reviews, stats });
  } catch (error) {
    console.error('Error al obtener todas las reviews:', error);
    res.status(500).json({ message: 'Error al obtener reviews' });
  }
});

// PUT /api/reviews/admin/:id/approve - Aprobar review
router.put('/admin/:id/approve', protect, admin, [
  param('id').isUUID().withMessage('ID de review inválido'),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return res.status(404).json({ message: 'Review no encontrada' });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        aprobado: true,
      },
      include: {
        user: {
          select: {
            nombre: true,
          },
        },
        product: {
          select: {
            nombre: true,
          },
        },
      },
    });

    res.json(updatedReview);
  } catch (error) {
    console.error('Error al aprobar review:', error);
    res.status(500).json({ message: 'Error al aprobar review' });
  }
});

// PUT /api/reviews/admin/:id/reject - Rechazar/eliminar review
router.put('/admin/:id/reject', protect, admin, [
  param('id').isUUID().withMessage('ID de review inválido'),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return res.status(404).json({ message: 'Review no encontrada' });
    }

    await prisma.review.delete({
      where: { id },
    });

    res.json({ message: 'Review rechazada y eliminada correctamente' });
  } catch (error) {
    console.error('Error al rechazar review:', error);
    res.status(500).json({ message: 'Error al rechazar review' });
  }
});

export default router;

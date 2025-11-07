import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { logError } from '../lib/logger';
import { asyncHandler, validateRequest } from '../middleware/errorHandler';
import { paginationValidator, searchValidator, productIdValidator } from '../validators';

const router = express.Router();

// Obtener todos los productos (ruta pública con paginación)
router.get('/', paginationValidator, searchValidator, validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;
  
  const search = req.query.q as string;
  const categoria = req.query.categoria as string;
  const minPrecio = parseFloat(req.query.minPrecio as string);
  const maxPrecio = parseFloat(req.query.maxPrecio as string);

  // Construir filtros
  const where: any = {};
  
  if (search) {
    where.OR = [
      { nombre: { contains: search, mode: 'insensitive' } },
      { descripcion: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  if (categoria) {
    where.categoria = categoria;
  }
  
  if (!isNaN(minPrecio) || !isNaN(maxPrecio)) {
    where.precio = {};
    if (!isNaN(minPrecio)) where.precio.gte = minPrecio;
    if (!isNaN(maxPrecio)) where.precio.lte = maxPrecio;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + limit < total,
    },
  });
}));

// Obtener un producto por ID (ruta pública)
router.get('/:id', productIdValidator, validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        where: { aprobado: true },
        include: {
          user: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  // Calcular rating promedio
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  res.json({
    ...product,
    avgRating: Math.round(avgRating * 10) / 10,
    reviewCount: product.reviews.length,
  });
}));

export default router;

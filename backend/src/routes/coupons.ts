import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Validar un cupón (público)
router.post('/validate', [
  body('codigo').trim().notEmpty().withMessage('El código del cupón es requerido'),
  body('total').isFloat({ min: 0 }).withMessage('El total debe ser un número válido')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { codigo, total } = req.body;

    const coupon = await prisma.coupon.findUnique({
      where: { codigo: codigo.toUpperCase() }
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Cupón no encontrado' });
    }

    // Validaciones
    if (!coupon.activo) {
      return res.status(400).json({ message: 'Este cupón no está activo' });
    }

    const now = new Date();
    if (coupon.fechaInicio && new Date(coupon.fechaInicio) > now) {
      return res.status(400).json({ message: 'Este cupón aún no está disponible' });
    }

    if (coupon.fechaExpiracion && new Date(coupon.fechaExpiracion) < now) {
      return res.status(400).json({ message: 'Este cupón ha expirado' });
    }

    if (coupon.maxUsos && coupon.usosActuales >= coupon.maxUsos) {
      return res.status(400).json({ message: 'Este cupón ha alcanzado su límite de usos' });
    }

    if (total < coupon.minCompra) {
      return res.status(400).json({ 
        message: `Este cupón requiere una compra mínima de $${coupon.minCompra.toLocaleString('es-CL')}` 
      });
    }

    // Calcular descuento
    let descuento = 0;
    if (coupon.tipo === 'PERCENTAGE') {
      descuento = (total * coupon.valor) / 100;
    } else {
      descuento = coupon.valor;
    }

    // No permitir descuento mayor al total
    descuento = Math.min(descuento, total);

    res.json({
      valid: true,
      coupon: {
        id: coupon.id,
        codigo: coupon.codigo,
        tipo: coupon.tipo,
        valor: coupon.valor,
        descuento: Math.round(descuento)
      }
    });
  } catch (error) {
    console.error('Error validando cupón:', error);
    res.status(500).json({ message: 'Error al validar el cupón' });
  }
});

// ========================================
// RUTAS DE ADMINISTRADOR
// ========================================

// Listar todos los cupones
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });

    res.json(coupons);
  } catch (error) {
    console.error('Error obteniendo cupones:', error);
    res.status(500).json({ message: 'Error al obtener los cupones' });
  }
});

// Crear nuevo cupón
router.post('/', authenticateToken, requireAdmin, [
  body('codigo').trim().notEmpty().withMessage('El código es requerido'),
  body('tipo').isIn(['PERCENTAGE', 'FIXED']).withMessage('Tipo de cupón inválido'),
  body('valor').isFloat({ min: 0 }).withMessage('El valor debe ser positivo'),
  body('minCompra').optional().isFloat({ min: 0 }),
  body('maxUsos').optional().isInt({ min: 1 }),
  body('fechaExpiracion').optional().isISO8601()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { codigo, tipo, valor, minCompra, maxUsos, fechaExpiracion, activo } = req.body;

    // Validar porcentaje
    if (tipo === 'PERCENTAGE' && valor > 100) {
      return res.status(400).json({ message: 'El porcentaje no puede ser mayor a 100%' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        codigo: codigo.toUpperCase(),
        tipo,
        valor: parseFloat(valor),
        minCompra: minCompra ? parseFloat(minCompra) : 0,
        maxUsos: maxUsos ? parseInt(maxUsos) : null,
        fechaExpiracion: fechaExpiracion ? new Date(fechaExpiracion) : null,
        activo: activo !== false
      }
    });

    res.status(201).json(coupon);
  } catch (error: any) {
    console.error('Error creando cupón:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Ya existe un cupón con ese código' });
    }
    res.status(500).json({ message: 'Error al crear el cupón' });
  }
});

// Actualizar cupón
router.put('/:id', authenticateToken, requireAdmin, [
  body('tipo').optional().isIn(['PERCENTAGE', 'FIXED']),
  body('valor').optional().isFloat({ min: 0 }),
  body('minCompra').optional().isFloat({ min: 0 }),
  body('maxUsos').optional().isInt({ min: 1 }),
  body('fechaExpiracion').optional().isISO8601(),
  body('activo').optional().isBoolean()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { tipo, valor, minCompra, maxUsos, fechaExpiracion, activo } = req.body;

    const updateData: any = {};
    if (tipo !== undefined) updateData.tipo = tipo;
    if (valor !== undefined) {
      if (tipo === 'PERCENTAGE' && valor > 100) {
        return res.status(400).json({ message: 'El porcentaje no puede ser mayor a 100%' });
      }
      updateData.valor = parseFloat(valor);
    }
    if (minCompra !== undefined) updateData.minCompra = parseFloat(minCompra);
    if (maxUsos !== undefined) updateData.maxUsos = maxUsos ? parseInt(maxUsos) : null;
    if (fechaExpiracion !== undefined) updateData.fechaExpiracion = fechaExpiracion ? new Date(fechaExpiracion) : null;
    if (activo !== undefined) updateData.activo = activo;

    const coupon = await prisma.coupon.update({
      where: { id },
      data: updateData
    });

    res.json(coupon);
  } catch (error: any) {
    console.error('Error actualizando cupón:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Cupón no encontrado' });
    }
    res.status(500).json({ message: 'Error al actualizar el cupón' });
  }
});

// Eliminar cupón
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el cupón tiene órdenes asociadas
    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Cupón no encontrado' });
    }

    if (coupon._count.orders > 0) {
      // Si tiene órdenes, mejor desactivarlo en lugar de eliminarlo
      const updated = await prisma.coupon.update({
        where: { id },
        data: { activo: false }
      });
      return res.json({ 
        message: 'El cupón tiene órdenes asociadas, se ha desactivado en su lugar',
        coupon: updated
      });
    }

    await prisma.coupon.delete({
      where: { id }
    });

    res.json({ message: 'Cupón eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando cupón:', error);
    res.status(500).json({ message: 'Error al eliminar el cupón' });
  }
});

// Estadísticas de un cupón
router.get('/:id/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        orders: {
          select: {
            total: true,
            descuento: true,
            createdAt: true
          }
        }
      }
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Cupón no encontrado' });
    }

    const stats = {
      codigo: coupon.codigo,
      usosActuales: coupon.usosActuales,
      maxUsos: coupon.maxUsos,
      totalDescuentos: coupon.orders.reduce((sum, order) => sum + order.descuento, 0),
      totalVentas: coupon.orders.reduce((sum, order) => sum + order.total, 0),
      ultimoUso: coupon.orders.length > 0 ? coupon.orders[0].createdAt : null
    };

    res.json(stats);
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

export default router;

import express, { Response } from 'express';
import { protect, admin, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { logError } from '../lib/logger';

const router = express.Router();

// Todas las rutas de admin requieren autenticación y rol de administrador
router.use(protect as any);
router.use(admin as any);

// Obtener reportes
router.get('/reportes', async (req: any, res: any) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    
    const completedOrders = await prisma.order.findMany({
      where: { status: 'COMPLETED' },
      select: { total: true },
    });

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            nombre: true,
            email: true,
          },
        },
      },
    });

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ message: 'Error al obtener reportes' });
  }
});

// Crear producto
router.post('/products', async (req: any, res: any) => {
  try {
    const { nombre, descripcion, precio, stock, imagenes, categoria } = req.body;

    if (!nombre || !descripcion || !precio || !stock || !categoria) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const product = await prisma.product.create({
      data: {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        imagenes: imagenes || [],
        categoria,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
});

// Actualizar producto
router.put('/products/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, imagenes, categoria } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(descripcion && { descripcion }),
        ...(precio && { precio: parseFloat(precio) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(imagenes && { imagenes }),
        ...(categoria && { categoria }),
      },
    });

    res.json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
});

// Eliminar producto
router.delete('/products/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
});

// Ver todas las órdenes
router.get('/orders', async (req: any, res: any) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            nombre: true,
            email: true,
          },
        },
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

// Actualizar estado de orden
router.patch('/orders/:id/status', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'COMPLETED', 'SHIPPED'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json(order);
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ message: 'Error al actualizar estado de la orden' });
  }
});

export default router;

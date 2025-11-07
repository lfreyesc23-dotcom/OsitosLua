import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, admin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Obtener reportes y estadísticas (solo admin)
router.get('/', protect, admin, async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Ventas totales
    const ordenes = await prisma.order.findMany({
      where: {
        status: 'COMPLETED',
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    const ventasTotales = ordenes.reduce((sum, order) => sum + order.total, 0);
    const numeroVentas = ordenes.length;

    // 2. Productos más vendidos
    const productosVendidos: { [key: string]: { nombre: string; cantidad: number; ingresos: number } } = {};

    ordenes.forEach((order) => {
      order.orderItems.forEach((item) => {
        const productId = item.productId;
        if (!productosVendidos[productId]) {
          productosVendidos[productId] = {
            nombre: item.product.nombre,
            cantidad: 0,
            ingresos: 0,
          };
        }
        productosVendidos[productId].cantidad += item.cantidad;
        productosVendidos[productId].ingresos += item.cantidad * item.product.precio;
      });
    });

    const productosMasVendidos = Object.entries(productosVendidos)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10);

    // 3. Productos con stock bajo (menos de 5 unidades)
    const productosBajoStock = await prisma.product.findMany({
      where: {
        stock: {
          lt: 5,
        },
      },
      orderBy: {
        stock: 'asc',
      },
    });

    // 4. Ventas por día (últimos 30 días)
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const ventasRecientes = await prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: hace30Dias,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const ventasPorDia: { [key: string]: number } = {};
    ventasRecientes.forEach((order) => {
      const fecha = order.createdAt.toISOString().split('T')[0];
      if (!ventasPorDia[fecha]) {
        ventasPorDia[fecha] = 0;
      }
      ventasPorDia[fecha] += order.total;
    });

    // 5. Órdenes pendientes y enviadas
    const ordenesPendientes = await prisma.order.count({
      where: { status: 'PENDING' },
    });

    const ordenesEnviadas = await prisma.order.count({
      where: { status: 'SHIPPED' },
    });

    // 6. Total de productos en catálogo
    const totalProductos = await prisma.product.count();

    // 7. Valor del inventario
    const productos = await prisma.product.findMany();
    const valorInventario = productos.reduce((sum, p) => sum + p.precio * p.stock, 0);

    // 8. Órdenes de invitados vs usuarios registrados
    const ordenesInvitados = await prisma.order.count({
      where: { esInvitado: true },
    });

    const ordenesRegistrados = await prisma.order.count({
      where: { esInvitado: false },
    });

    // 9. Costos de envío generados
    const costoEnvioTotal = ordenes.reduce((sum, order) => sum + (order.costoEnvio || 0), 0);

    res.json({
      resumen: {
        ventasTotales,
        numeroVentas,
        ordenesPendientes,
        ordenesEnviadas,
        totalProductos,
        valorInventario,
        costoEnvioTotal,
      },
      productosMasVendidos,
      productosBajoStock,
      ventasPorDia,
      tipoClientes: {
        invitados: ordenesInvitados,
        registrados: ordenesRegistrados,
      },
    });
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

export default router;

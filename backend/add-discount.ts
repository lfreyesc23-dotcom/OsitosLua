import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Actualizar Llama Alpaca Multicolor con 10% de descuento
    const updated = await prisma.product.updateMany({
      where: {
        nombre: {
          contains: 'Llama Alpaca',
          mode: 'insensitive'
        }
      },
      data: {
        descuento: 10
      }
    });

    console.log(`✅ Producto actualizado con 10% de descuento!`);
    console.log(`Productos afectados: ${updated.count}`);

    // Verificar el producto actualizado
    const product = await prisma.product.findFirst({
      where: {
        nombre: {
          contains: 'Llama Alpaca',
          mode: 'insensitive'
        }
      }
    });

    if (product) {
      console.log('\n📦 Producto actualizado:');
      console.log(`ID: ${product.id}`);
      console.log(`Nombre: ${product.nombre}`);
      console.log(`Precio: $${product.precio}`);
      console.log(`Descuento: ${product.descuento}%`);
      console.log(`Precio final: $${product.precio * (1 - product.descuento / 100)}`);
    }
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

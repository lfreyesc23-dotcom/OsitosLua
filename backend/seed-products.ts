import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productos = [
  {
    nombre: 'Oso Panda Gigante',
    descripcion: 'Adorable oso panda de peluche suave y esponjoso, perfecto para abrazar. Material de alta calidad premium.',
    precio: 18990,
    stock: 15,
    categoria: 'Osos',
    imagenes: [
      'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=600',
      'https://images.unsplash.com/photo-1527736947477-2790e28f3443?w=600'
    ]
  },
  {
    nombre: 'Conejo Rosa Kawaii',
    descripcion: 'Tierno conejo de peluche en color rosa pastel, estilo kawaii japonés. Orejas largas y suaves, ideal para decoración o regalo.',
    precio: 12990,
    stock: 25,
    categoria: 'Conejos',
    imagenes: [
      'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=600',
      'https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=600'
    ]
  },
  {
    nombre: 'Unicornio Arcoíris',
    descripcion: 'Mágico unicornio de peluche con melena arcoíris y cuerno dorado. Perfecto para niñas que aman las criaturas fantásticas.',
    precio: 15990,
    stock: 20,
    categoria: 'Fantasia',
    imagenes: [
      'https://images.unsplash.com/photo-1587402092301-725e37c70fd8?w=600',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'
    ]
  },
  {
    nombre: 'Gatito Gris Dormilón',
    descripcion: 'Peluche de gatito gris en posición dormida, súper realista y suave al tacto. Perfecto compañero para dormir.',
    precio: 9990,
    stock: 30,
    categoria: 'Gatos',
    imagenes: [
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600'
    ]
  },
  {
    nombre: 'Dinosaurio Verde T-Rex',
    descripcion: 'Feroz pero adorable T-Rex de peluche en color verde brillante. Dientes suaves y brazos abrazables para los amantes de los dinosaurios.',
    precio: 16990,
    stock: 12,
    categoria: 'Dinosaurios',
    imagenes: [
      'https://images.unsplash.com/photo-1551419762-4a3d998f6292?w=600',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600'
    ]
  },
  {
    nombre: 'Perrito Golden Retriever',
    descripcion: 'Fiel compañero de peluche tipo Golden Retriever con pelo dorado suave. Expresión amigable y tamaño mediano.',
    precio: 13990,
    stock: 18,
    categoria: 'Perros',
    imagenes: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600'
    ]
  },
  {
    nombre: 'Pulpo Reversible Emociones',
    descripcion: 'Innovador pulpo de peluche reversible que muestra diferentes emociones (feliz/triste). Viral en redes sociales, perfecto para expresar tu estado de ánimo.',
    precio: 8990,
    stock: 40,
    categoria: 'Marinos',
    imagenes: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600'
    ]
  },
  {
    nombre: 'Elefante Bebé Azul',
    descripcion: 'Tierno elefante bebé en tono azul pastel con orejas grandes y suaves. Ideal para recién nacidos y decoración de cuarto infantil.',
    precio: 11990,
    stock: 22,
    categoria: 'Animales',
    imagenes: [
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600'
    ]
  },
  {
    nombre: 'Llama Alpaca Multicolor',
    descripcion: 'Adorable llama/alpaca de peluche con lana multicolor esponjosa. Sonrisa encantadora y decoración tipo pompones.',
    precio: 14990,
    stock: 16,
    categoria: 'Animales',
    imagenes: [
      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'
    ]
  },
  {
    nombre: 'Dragón Chino Rojo',
    descripcion: 'Majestuoso dragón chino de peluche en rojo tradicional con detalles dorados. Símbolo de buena suerte y prosperidad.',
    precio: 19990,
    stock: 10,
    categoria: 'Fantasia',
    imagenes: [
      'https://images.unsplash.com/photo-1578898886191-22b1605b4e18?w=600',
      'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=600'
    ]
  }
];

async function seed() {
  console.log('🌱 Iniciando seed de productos...');

  try {
    // Crear productos (sin eliminar los existentes)
    let creados = 0;
    let omitidos = 0;

    for (const producto of productos) {
      // Verificar si el producto ya existe
      const existe = await prisma.product.findFirst({
        where: { nombre: producto.nombre }
      });

      if (existe) {
        console.log(`⚠️  Ya existe: ${producto.nombre}`);
        omitidos++;
      } else {
        const created = await prisma.product.create({
          data: producto
        });
        console.log(`✅ Creado: ${created.nombre} - $${created.precio.toLocaleString('es-CL')}`);
        creados++;
      }
    }

    console.log('\n🎉 Seed completado exitosamente!');
    console.log(`📦 Productos creados: ${creados}`);
    console.log(`⏭️  Productos omitidos (ya existían): ${omitidos}`);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();

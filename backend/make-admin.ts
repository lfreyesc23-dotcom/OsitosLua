import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.error('❌ Debes proporcionar un email');
      console.log('Uso: npx ts-node make-admin.ts tu@email.com');
      process.exit(1);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ Usuario con email ${email} no encontrado`);
      process.exit(1);
    }

    if (user.role === 'ADMIN') {
      console.log(`✅ El usuario ${email} ya es ADMIN`);
      process.exit(0);
    }

    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });

    console.log(`✅ Usuario ${email} actualizado a ADMIN exitosamente`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();

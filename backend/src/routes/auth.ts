import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateRut, cleanRut } from '../utils/rut';

const router = express.Router();
const prisma = new PrismaClient();

// Registrar usuario
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, nombre, password, rut } = req.body;

    // Validar datos
    if (!email || !nombre || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Validar RUT si se proporcionó
    if (rut) {
      const cleanedRut = cleanRut(rut);
      if (!validateRut(cleanedRut)) {
        return res.status(400).json({ message: 'El RUT ingresado no es válido' });
      }

      // Verificar si el RUT ya existe
      const existingRut = await prisma.user.findUnique({
        where: { rut: cleanedRut },
      });

      if (existingRut) {
        return res.status(400).json({ message: 'El RUT ya está registrado' });
      }
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Contar usuarios para determinar si es el primero (será ADMIN)
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? 'ADMIN' : 'USER';

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        nombre,
        password: hashedPassword,
        role,
        rut: rut ? cleanRut(rut) : undefined,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        role: true,
      },
    });

    // Generar token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '30d',
    });

    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '30d',
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

export default router;

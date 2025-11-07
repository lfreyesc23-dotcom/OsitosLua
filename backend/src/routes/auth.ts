import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateRut, cleanRut } from '../utils/rut';
import { prisma } from '../lib/prisma';
import { logError, logInfo } from '../lib/logger';
import { registerValidator, loginValidator } from '../validators';
import { validateRequest, asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Registrar usuario
router.post('/register', registerValidator, validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const { email, nombre, password, rut } = req.body;

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

  logInfo('Nuevo usuario registrado', { userId: user.id, email: user.email, role: user.role });

  res.status(201).json({
    user,
    token,
  });
}));

// Login
router.post('/login', loginValidator, validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

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

  logInfo('Usuario inició sesión', { userId: user.id, email: user.email });

  res.json({
    user: {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      role: user.role,
    },
    token,
  });
}));

export default router;

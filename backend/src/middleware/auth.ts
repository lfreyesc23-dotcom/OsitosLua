import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends express.Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const protect = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    let token;

    const authorization = req.headers?.authorization || req.get('authorization');
    
    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'No autorizado, token no encontrado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'No autorizado, token inválido' });
  }
};

export const admin = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Solo administradores' });
  }
};

// Aliases para compatibilidad
export const authenticateToken = protect;
export const requireAdmin = admin;

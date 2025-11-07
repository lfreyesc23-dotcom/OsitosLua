import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { logError } from '../lib/logger';

/**
 * Middleware para validar resultados de express-validator
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Errores de validación',
      errors: errors.array().map(err => ({
        field: err.type === 'field' ? err.path : undefined,
        message: err.msg,
      })),
    });
  }
  
  next();
};

/**
 * Middleware de manejo de errores centralizado
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Loggear el error
  logError('Error no manejado', err, {
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    userId: (req as any).user?.id,
  });

  // Errores de validación de Prisma
  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({
      message: 'Error de validación en la base de datos',
    });
  }

  // Errores de Prisma (registros no encontrados, etc.)
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    // Violación de constraint único
    if (prismaError.code === 'P2002') {
      return res.status(409).json({
        message: 'Este registro ya existe',
        field: prismaError.meta?.target?.[0],
      });
    }
    
    // Registro no encontrado
    if (prismaError.code === 'P2025') {
      return res.status(404).json({
        message: 'Registro no encontrado',
      });
    }
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expirado',
    });
  }

  // Error de Multer (subida de archivos)
  if (err.name === 'MulterError') {
    return res.status(400).json({
      message: 'Error al subir archivo',
      details: err.message,
    });
  }

  // Error de Stripe
  if (err.name === 'StripeError') {
    return res.status(402).json({
      message: 'Error en el procesamiento del pago',
    });
  }

  // Errores personalizados con código de estado
  if ((err as any).statusCode) {
    return res.status((err as any).statusCode).json({
      message: err.message,
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack,
    }),
  });
};

/**
 * Middleware para rutas no encontradas (404)
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    message: 'Ruta no encontrada',
    path: req.path,
  });
};

/**
 * Wrapper para manejar errores asíncronos en rutas
 * Evita tener que usar try-catch en cada ruta
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Clase de error personalizada
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

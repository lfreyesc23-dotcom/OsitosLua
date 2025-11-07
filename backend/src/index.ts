import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

// Cargar variables de entorno PRIMERO
dotenv.config();

// Validar variables de entorno
import { validateEnv } from './lib/env';
import { logger, logInfo, logError } from './lib/logger';
import { prisma } from './lib/prisma';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Validar env antes de continuar
validateEnv();

// Importar rutas
import authRoutes from './routes/auth';
import productsRoutes from './routes/products';
import adminRoutes from './routes/admin';
import uploadRoutes from './routes/upload';
import ordersRoutes from './routes/orders';
import webhooksRoutes from './routes/webhooks';
import shippingRoutes from './routes/shipping';
import contactRoutes from './routes/contact';
import suggestionsRoutes from './routes/suggestions';
import reportsRoutes from './routes/reports';
import couponsRoutes from './routes/coupons';
import reviewsRoutes from './routes/reviews';
import newsletterRoutes from './routes/newsletter';

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// TRUST PROXY (para Railway, Render, etc.)
// ===============================
app.set('trust proxy', 1);

// ===============================
// SEGURIDAD - Headers HTTP seguros
// ===============================
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'"],
    },
  } : false,
  crossOriginEmbedderPolicy: false
}));

// ===============================
// COMPRESIÓN - Reducir tamaño de respuestas
// ===============================
app.use(compression());

// ===============================
// RATE LIMITING - Prevención de abuso
// ===============================

// Rate limiter general: 100 requests por 15 minutos
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de requests
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter estricto para autenticación: 5 intentos por 15 minutos
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de inicio de sesión, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para registro: 3 registros por hora
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3,
  message: 'Demasiados intentos de registro, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para contacto: 5 mensajes por hora
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Demasiados mensajes enviados, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplicar rate limiter general
app.use(generalLimiter);

// ===============================
// CORS - Configuración mejorada
// ===============================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ===============================
// HEALTH CHECK - Monitoreo
// ===============================
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a base de datos
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
    });
  } catch (error) {
    logError('Health check failed', error);
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
    });
  }
});

// Nota: El webhook de Stripe necesita el body sin procesar
// Por eso su middleware se aplica antes de express.json()
app.use('/api/webhooks', webhooksRoutes);

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas con rate limiters específicos
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/contact', contactLimiter);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/suggestions', suggestionsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🧸 OsitosLua API funcionando correctamente',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ===============================
// MANEJO DE ERRORES
// ===============================
app.use(notFoundHandler);
app.use(errorHandler);

// ===============================
// INICIAR SERVIDOR
// ===============================
const server = app.listen(PORT, () => {
  logInfo(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  logInfo(`📡 Frontend esperado en: ${process.env.FRONTEND_URL}`);
  logInfo(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  logInfo('SIGTERM recibido, cerrando servidor...');
  server.close(async () => {
    await prisma.$disconnect();
    logInfo('Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logInfo('SIGINT recibido, cerrando servidor...');
  server.close(async () => {
    await prisma.$disconnect();
    logInfo('Servidor cerrado correctamente');
    process.exit(0);
  });
});

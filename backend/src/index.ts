import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// SEGURIDAD - Headers HTTP seguros
// ===============================
app.use(helmet({
  contentSecurityPolicy: false, // Deshabilitado para desarrollo, habilitar en producción
  crossOriginEmbedderPolicy: false
}));

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

// Configurar CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Nota: El webhook de Stripe necesita el body sin procesar
// Por eso su middleware se aplica antes de express.json()
app.use('/api/webhooks', webhooksRoutes);

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  res.json({ message: '🧸 OsitosLua API funcionando correctamente' });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 Frontend esperado en: ${process.env.FRONTEND_URL}`);
});

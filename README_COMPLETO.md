# 🧸 OsitosLua - E-commerce Platform

Plataforma completa de e-commerce construida con React, Node.js, PostgreSQL y Stripe.

## 🚀 Características

### 👤 Autenticación y Usuarios
- ✅ Registro con validación de RUT chileno
- ✅ Sistema de roles (USER/ADMIN)
- ✅ El primer usuario registrado es automáticamente ADMIN
- ✅ Validación de contraseñas seguras (8+ caracteres, mayúsculas, minúsculas, números, caracteres especiales)
- ✅ JWT para autenticación
- ✅ Protección de rutas

### 🛍️ Productos y Catálogo
- ✅ Gestión completa de productos (CRUD)
- ✅ Categorías de productos
- ✅ Sistema de descuentos por producto
- ✅ Múltiples imágenes por producto (Cloudinary)
- ✅ Control de stock con decrementación automática
- ✅ Paginación y filtros de búsqueda
- ✅ Búsqueda por texto, categoría y rango de precios

### 🛒 Carrito y Checkout
- ✅ Carrito de compras persistente
- ✅ Compra como usuario autenticado o invitado
- ✅ Validación de RUT para invitados
- ✅ Cálculo automático de envío
- ✅ Aplicación de cupones de descuento
- ✅ Transacciones atómicas (ACID)
- ✅ Integración con Stripe para pagos
- ✅ Webhooks para confirmación de pago
- ✅ Emails de confirmación

### 🎟️ Sistema de Cupones
- ✅ Cupones de descuento (porcentaje o monto fijo)
- ✅ Monto mínimo de compra
- ✅ Límite de usos
- ✅ Fecha de expiración
- ✅ Validación en tiempo real

### ⭐ Reviews y Calificaciones
- ✅ Sistema de reviews con estrellas (1-5)
- ✅ Moderación por admin
- ✅ Un review por usuario por producto
- ✅ Cálculo de rating promedio
- ✅ Edición y eliminación de propias reviews

### 📊 Dashboard de Administración
- ✅ Reportes de ventas y estadísticas
- ✅ Gestión de productos
- ✅ Gestión de órdenes
- ✅ Moderación de reviews
- ✅ Gestión de cupones
- ✅ Visualización de sugerencias

### 📱 Características Adicionales
- ✅ Progressive Web App (PWA)
- ✅ SEO optimizado con metadatos dinámicos
- ✅ Datos estructurados (Schema.org)
- ✅ Analytics (Google Analytics 4, Facebook Pixel)
- ✅ Newsletter
- ✅ Formulario de contacto
- ✅ Productos vistos recientemente
- ✅ Lista de deseos
- ✅ Compartir en redes sociales
- ✅ Botón de WhatsApp

### 🔒 Seguridad y Rendimiento
- ✅ Helmet para headers HTTP seguros
- ✅ Rate limiting para prevenir abuso
- ✅ Validación de entrada con express-validator
- ✅ Logging profesional con Winston
- ✅ Singleton de PrismaClient (sin memory leaks)
- ✅ Transacciones para operaciones críticas
- ✅ Compresión gzip/brotli
- ✅ Índices de base de datos para rendimiento
- ✅ Health check endpoint
- ✅ Validación de variables de entorno
- ✅ Manejo centralizado de errores

---

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn
- Cuenta de Cloudinary (para imágenes)
- Cuenta de Stripe (para pagos)
- Cuenta de Gmail (para emails)

---

## 🛠️ Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/lfreyesc23-dotcom/OsitosLua.git
cd OsitosLua
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

#### Configurar Variables de Entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```bash
# Database
DATABASE_URL="postgresql://usuario:password@localhost:5432/ositoslua"

# JWT Secret (generar con: openssl rand -base64 32)
JWT_SECRET="tu-secreto-super-seguro-minimo-32-caracteres"

# Server
PORT=3000
NODE_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PUBLIC_KEY="pk_test_..."

# Email (Gmail)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="tu-email@gmail.com"
EMAIL_PASSWORD="tu-app-password-de-16-caracteres"
EMAIL_FROM="OsitosLua <noreply@ositoslua.cl>"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
```

#### Ejecutar Migraciones

```bash
npx prisma migrate dev
npx prisma generate
```

#### Poblar Base de Datos (Opcional)

```bash
npm run seed
```

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

#### Configurar Variables de Entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env`:

```bash
# Backend API
VITE_API_URL=http://localhost:3000/api

# Stripe Public Key
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Analytics (Opcional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_FB_PIXEL_ID=123456789
```

---

## 🚀 Ejecutar en Desarrollo

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

El backend estará en: `http://localhost:3000`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

El frontend estará en: `http://localhost:5173`

---

## 🔍 Endpoints Principales

### Públicos

- `GET /` - Info de la API
- `GET /health` - Health check
- `GET /api/products` - Listar productos (con paginación)
- `GET /api/products/:id` - Detalle de producto
- `GET /api/reviews/product/:productId` - Reviews de un producto
- `POST /api/auth/register` - Registrarse
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/contact` - Enviar mensaje de contacto
- `POST /api/newsletter/subscribe` - Suscribirse al newsletter
- `POST /api/coupons/validate` - Validar cupón

### Protegidos (Requieren autenticación)

- `GET /api/orders/my-orders` - Mis órdenes
- `POST /api/orders/checkout` - Crear orden y checkout
- `POST /api/reviews` - Crear review
- `PUT /api/reviews/:id` - Editar review
- `DELETE /api/reviews/:id` - Eliminar review

### Admin (Requieren rol ADMIN)

- `POST /api/admin/products` - Crear producto
- `PUT /api/admin/products/:id` - Actualizar producto
- `DELETE /api/admin/products/:id` - Eliminar producto
- `GET /api/admin/orders` - Listar todas las órdenes
- `PUT /api/admin/orders/:id/status` - Actualizar estado de orden
- `GET /api/reports` - Reportes y estadísticas
- `GET /api/reviews/pending` - Reviews pendientes de aprobación
- `PUT /api/reviews/:id/approve` - Aprobar review
- `DELETE /api/reviews/:id/reject` - Rechazar review
- `POST /api/coupons` - Crear cupón
- `PUT /api/coupons/:id` - Actualizar cupón
- `DELETE /api/coupons/:id` - Eliminar cupón

---

## 📦 Scripts Disponibles

### Backend

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Compilar TypeScript
npm start            # Ejecutar en producción
npm run seed         # Poblar base de datos
npm run sitemap      # Generar sitemap
npx prisma studio    # Abrir Prisma Studio
npx prisma migrate dev  # Crear migración
```

### Frontend

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
```

---

## 🗄️ Estructura de Base de Datos

### Modelos Principales

- **User** - Usuarios del sistema
- **Product** - Productos del catálogo
- **Order** - Órdenes de compra
- **OrderItem** - Items de cada orden
- **Coupon** - Cupones de descuento
- **Review** - Reviews de productos
- **Newsletter** - Suscriptores al newsletter
- **Suggestion** - Sugerencias/contactos

### Índices para Rendimiento

- Product: categoria, precio
- Order: status, userId, createdAt, emailInvitado
- Review: productId+aprobado, userId, aprobado
- Coupon: codigo, activo+fechaExpiracion
- Suggestion: leido, respondido

---

## 🧪 Testing

### Health Check

```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-11-07T14:30:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "version": "1.0.0"
}
```

### Paginación de Productos

```bash
# Primera página
curl "http://localhost:3000/api/products?page=1&limit=10"

# Con filtros
curl "http://localhost:3000/api/products?categoria=peluches&minPrecio=10000&maxPrecio=50000"

# Búsqueda
curl "http://localhost:3000/api/products?q=osito"
```

### Validación de Cupón

```bash
curl -X POST http://localhost:3000/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"codigo":"BIENVENIDO","total":50000}'
```

---

## 🔐 Primer Usuario (Admin)

El **primer usuario** que se registre automáticamente será **ADMIN**.

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@ositoslua.cl",
    "nombre":"Admin",
    "password":"Admin123!@",
    "rut":"11111111-1"
  }'
```

---

## 📊 Logs

Los logs se guardan en:
- `backend/logs/error.log` - Solo errores
- `backend/logs/combined.log` - Todos los logs

Los logs incluyen:
- Timestamps
- Nivel (error, warn, info, debug)
- Mensaje
- Metadata (userId, orderId, etc.)
- Stack traces (solo en desarrollo)

---

## 🚢 Deployment

### Preparación

1. ✅ Configurar variables de entorno de producción
2. ✅ Cambiar `NODE_ENV=production`
3. ✅ Usar claves de Stripe en modo producción (`sk_live_...`)
4. ✅ Configurar HTTPS
5. ✅ Activar CSP en helmet
6. ✅ Configurar dominio personalizado

### Backend (Railway/Render)

```bash
npm run build
npm start
```

Variables de entorno requeridas en el servidor:
- Todas las del `.env.example`
- `DATABASE_URL` apuntando a PostgreSQL de producción

### Frontend (Vercel/Netlify)

```bash
npm run build
```

Variables de entorno:
- `VITE_API_URL` - URL de tu backend en producción
- `VITE_STRIPE_PUBLIC_KEY` - Clave pública de Stripe producción

### Migraciones en Producción

```bash
npx prisma migrate deploy
```

---

## 🔧 Troubleshooting

### Error: "Too many connections"

**Causa:** Múltiples instancias de PrismaClient  
**Solución:** Ya está solucionado con el singleton en `lib/prisma.ts`

### Error: "Missing environment variables"

**Causa:** Variables de entorno no configuradas  
**Solución:** Revisar `.env` y copiar valores de `.env.example`

### Error de compilación TypeScript

```bash
# Limpiar y reconstruir
rm -rf node_modules dist
npm install
npm run build
```

### Base de datos desactualizada

```bash
# Aplicar migraciones pendientes
npx prisma migrate dev

# Regenerar Prisma Client
npx prisma generate
```

### Logs no se generan

Verificar que la carpeta `backend/logs` existe:
```bash
mkdir -p backend/logs
```

---

## 📚 Documentación Adicional

- [MEJORAS_IMPLEMENTADAS.md](./MEJORAS_IMPLEMENTADAS.md) - Changelog de mejoras
- [CODE_REVIEW.md](./CODE_REVIEW.md) - Análisis de código completo
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía de deployment
- [PWA_README.md](./PWA_README.md) - Progressive Web App
- [SEO_README.md](./SEO_README.md) - SEO y metadatos

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

---

## 👥 Autor

Luis Reyes - [@lfreyesc23-dotcom](https://github.com/lfreyesc23-dotcom)

---

## 🙏 Agradecimientos

- React Team
- Prisma Team
- Stripe
- Cloudinary
- Railway/Render
- Vercel/Netlify

---

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema
4. Incluye logs relevantes de `backend/logs/`

---

**¡Disfruta construyendo con OsitosLua! 🧸**

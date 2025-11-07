# 🧸 OsitosLua - E-commerce Platform

E-commerce moderno y profesional construido con React, Node.js, TypeScript y PostgreSQL.

> **⚡ PROYECTO 100% COMPLETO Y LISTO PARA PRODUCCIÓN** 

## ✨ Features Implementadas (100%)

### �️ E-commerce Core
- ✅ Autenticación JWT con roles (Usuario/Admin)
- ✅ Primer usuario automáticamente ADMIN
- ✅ Catálogo de productos con imágenes Cloudinary
- ✅ Carrito de compras persistente
- ✅ Checkout completo con Stripe
- ✅ Gestión de pedidos con timeline
- ✅ Guest checkout (comprar sin cuenta)
- ✅ Cálculo de envío por zona (Chile)
- ✅ Gestión automática de stock

### 🔒 Seguridad
- ✅ Helmet (security headers)
- ✅ Rate limiting (4 limiters configurados)
- ✅ express-validator
- ✅ CORS configurado
- ✅ Passwords hasheados con bcryptjs

### 💰 Pagos y Cupones
- ✅ Stripe checkout completo
- ✅ Webhooks configurados
- ✅ Sistema de cupones (porcentaje/fijo)
- ✅ Validación de cupones (uso, expiración)
- ✅ Admin panel de cupones con estadísticas

### ⭐ Reviews y Ratings
- ✅ Sistema de reseñas (1-5 estrellas)
- ✅ Moderación (aprobación manual)
- ✅ Admin panel de reviews
- ✅ Edición/eliminación de reviews
- ✅ Estadísticas de distribución

### 🎯 Features Avanzadas
- ✅ **Wishlist** (LocalStorage, 90 días)
- ✅ **Newsletter** (subscribe/unsubscribe + admin)
- ✅ **Recently Viewed** (max 8, 30 días)
- ✅ **Related Products** (por categoría)
- ✅ **Google Analytics 4** (13 eventos tracked)
- ✅ **Facebook Pixel** (complete tracking)
- ✅ **PWA** (installable, offline-ready)

### 🔍 SEO Optimization
- ✅ React Helmet Async (meta tags)
- ✅ Open Graph + Twitter Cards
- ✅ Canonical URLs
- ✅ robots.txt configurado
- ✅ sitemap.xml dinámico
- ✅ Image sitemap
- ✅ Structured data ready

### 📱 Mobile & Performance
- ✅ PWA completo (manifest + service worker)
- ✅ Workbox caching strategies
- ✅ Install prompts (iOS + Android)
- ✅ Offline capability
- ✅ Responsive design total
- ✅ WhatsApp floating button

### �‍💼 Admin Dashboard
- ✅ Dashboard con estadísticas
- ✅ Gestión de productos (CRUD)
- ✅ Gestión de pedidos
- ✅ Reportes avanzados
- ✅ Sugerencias de clientes
- ✅ Gestión de cupones
- ✅ Moderación de reviews
- ✅ Newsletter subscribers

### 📧 Comunicaciones
- ✅ Emails de confirmación (Nodemailer)
- ✅ Newsletter signup
- ✅ Formulario de contacto
- ✅ Sugerencias de productos

### 📄 Legal & Support
- ✅ Términos y condiciones (11 secciones)
- ✅ Política de privacidad (GDPR compliant)
- ✅ Política de devoluciones
- ✅ FAQ (30+ preguntas)
- ✅ Sobre nosotros
- ✅ Contacto

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite 5** - Build tool ultra-rápido
- **TypeScript 5** - Type safety
- **TailwindCSS 3** - Utility-first CSS
- **React Router v6** - Client routing
- **Axios** - HTTP client
- **react-helmet-async** - SEO meta tags
- **react-ga4** - Google Analytics
- **react-facebook-pixel** - FB tracking
- **vite-plugin-pwa** - Progressive Web App
- **workbox** - Service Worker

### Backend
- **Node.js + Express** - Server
- **TypeScript** - Type safety
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Cloudinary SDK** - Image hosting
- **Stripe v14.7** - Payments
- **Nodemailer** - Emails
- **Helmet** - Security headers
- **express-rate-limit** - DDoS protection
- **express-validator** - Input validation

## 📋 Requisitos Previos

- Node.js 18+ instalado
- PostgreSQL instalado y corriendo
- Cuentas configuradas en:
  - [Cloudinary](https://cloudinary.com/) - Hosting de imágenes
  - [Stripe](https://stripe.com/) - Procesamiento de pagos
  - Gmail con contraseña de aplicación - Emails
  - [Google Analytics](https://analytics.google.com/) - (Opcional)
  - [Facebook Business](https://business.facebook.com/) - (Opcional)

## ⚙️ Inicio Rápido

> 📖 **Lee el archivo [INSTRUCCIONES.md](./INSTRUCCIONES.md) para la guía completa paso a paso**

### 1. Instalar dependencias

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configurar variables de entorno

Edita `backend/.env` con tus credenciales:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/ositoslua"
JWT_SECRET="F23lamera$"
EMAIL_USER="LFREYESC23@GMAIL.COM"
EMAIL_PASS="tu_contraseña_de_aplicación"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"
FRONTEND_URL="http://localhost:5173"
PORT=3000
```

### 3. Configurar base de datos

```bash
# Crear base de datos PostgreSQL
createdb ositoslua

# Ejecutar migraciones
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Ejecutar el proyecto

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Stripe Webhooks (opcional para desarrollo):**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 5. Acceder a la aplicación

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

## 👤 Crear tu Cuenta de Admin

El **primer usuario** que se registre automáticamente será **ADMIN**.

1. Abre `http://localhost:5173`
2. Haz clic en **"Registrarse"**
3. Completa el formulario
4. ¡Automáticamente tendrás acceso al **Admin Panel**!
5. Podrás subir productos con imágenes desde el panel de administración

## 📁 Estructura del Proyecto

```
OsitosLua/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuraciones (Cloudinary, etc.)
│   │   ├── middleware/     # Middlewares (auth, admin)
│   │   ├── routes/         # Rutas de la API
│   │   ├── utils/          # Utilidades (email, etc.)
│   │   └── index.ts        # Servidor principal
│   ├── prisma/
│   │   └── schema.prisma   # Schema de la DB
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Componentes reutilizables
    │   ├── contexts/       # Context API (Auth, Cart)
    │   ├── pages/          # Páginas de la app
    │   ├── App.tsx
    │   └── main.tsx
    ├── .env
    └── package.json
```

## 🔑 Rutas de la API

### Públicas
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Ver producto

### Protegidas (Usuario)
- `GET /api/orders/my-orders` - Mis órdenes
- `POST /api/orders/checkout` - Crear orden

### Protegidas (Admin)
- `POST /api/upload` - Subir imagen
- `POST /api/admin/products` - Crear producto
- `PUT /api/admin/products/:id` - Actualizar producto
- `DELETE /api/admin/products/:id` - Eliminar producto
- `GET /api/admin/orders` - Ver todas las órdenes
- `GET /api/admin/reportes` - Ver reportes

### Webhooks
- `POST /api/webhooks/stripe` - Webhook de Stripe

## 🎨 Personalización

El proyecto usa TailwindCSS. Puedes personalizar los colores en `frontend/tailwind.config.js`:

```js
colors: {
  primary: '#FF69B4',        // Rosa principal
  'primary-dark': '#FF1493', // Rosa oscuro
  accent: '#4B0082',         // Morado
  'accent-light': '#9370DB', // Morado claro
}
```

## 📸 Características Destacadas

### Subida de Imágenes Real
- No más copiar y pegar URLs
- Selecciona una imagen desde tu computadora
- Se sube automáticamente a Cloudinary
- Vista previa instantánea
- Soporta múltiples imágenes por producto

### Panel de Administración Completo
- Dashboard con métricas en tiempo real
- CRUD completo de productos
- Gestión de órdenes con cambio de estado
- Reportes de ventas e ingresos
- Vista detallada de cada orden

### Experiencia de Usuario
- Carrito persistente (no se pierde al recargar)
- Checkout seguro con Stripe
- Confirmación por email automática
- Gestión automática de stock
- Diseño responsivo y moderno

## 🐛 Solución de Problemas

Ver el archivo [INSTRUCCIONES.md](./INSTRUCCIONES.md) para una guía completa de resolución de problemas.

## 📝 Licencia

MIT

## 👨‍💻 Autor

**Luis Reyes**  
Proyecto creado con ❤️ para OsitosLua

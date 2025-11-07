# 🚀 Deployment - OsitosLua

## Pre-Deployment Checklist

### 1. Environment Variables

#### Backend (.env)
```bash
DATABASE_URL="postgresql://user:password@host:5432/ositoslua"
JWT_SECRET="tu-secreto-super-seguro-aqui-minimo-32-caracteres"
PORT=3000

# Cloudinary
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"

# Stripe
STRIPE_SECRET_KEY="sk_live_..." # Usar live key en producción
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PUBLIC_KEY="pk_live_..."

# Email (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="tu-email@gmail.com"
EMAIL_PASSWORD="tu-app-password"
EMAIL_FROM="OsitosLua <noreply@ositoslua.cl>"

# Frontend URL
FRONTEND_URL="https://ositoslua.cl"
```

#### Frontend (.env)
```bash
VITE_API_URL="https://api.ositoslua.cl/api"
VITE_STRIPE_PUBLIC_KEY="pk_live_..."

# Analytics
VITE_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
VITE_FB_PIXEL_ID="1234567890123456"
```

### 2. Build Commands

```bash
# Backend
cd backend
npm run build
npm run prisma:generate

# Frontend
cd frontend
npm run build
```

### 3. Database Migration

```bash
cd backend
npx prisma migrate deploy  # Usar en producción, no migrate dev
```

### 4. Generate Sitemap

```bash
cd backend
npm run sitemap
```

## Deployment Options

### Option A: Vercel (Frontend) + Railway (Backend + DB)

#### 1. Frontend en Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod

# Configurar dominio
# vercel.app > Settings > Domains > ositoslua.cl
```

**vercel.json**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

#### 2. Backend en Railway
```bash
# railway.app > New Project > Deploy from GitHub
# Seleccionar repo OsitosLua
# Root Directory: /backend
```

**railway.json**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build && npx prisma generate"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 3. PostgreSQL en Railway
```bash
# Railway > New > Database > PostgreSQL
# Copiar DATABASE_URL a environment variables
```

### Option B: DigitalOcean App Platform

```yaml
# .do/app.yaml
name: ositoslua
region: nyc

databases:
  - name: postgres
    engine: PG
    version: "15"

services:
  - name: backend
    source:
      repo: github.com/usuario/OsitosLua
      branch: main
    dockerfile_path: backend/Dockerfile
    http_port: 3000
    routes:
      - path: /api
    envs:
      - key: DATABASE_URL
        scope: RUN_TIME
        value: ${postgres.DATABASE_URL}
    
  - name: frontend
    source:
      repo: github.com/usuario/OsitosLua
      branch: main
    dockerfile_path: frontend/Dockerfile
    http_port: 80
    routes:
      - path: /
```

### Option C: VPS (Ubuntu 22.04)

#### 1. Setup Server
```bash
# Conectar
ssh root@tu-servidor.com

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL 15
sudo apt install postgresql postgresql-contrib

# Instalar Nginx
sudo apt install nginx

# Instalar PM2
sudo npm install -g pm2
```

#### 2. Configure PostgreSQL
```bash
sudo -u postgres psql
CREATE DATABASE ositoslua;
CREATE USER ositoslua_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE ositoslua TO ositoslua_user;
\q
```

#### 3. Deploy Backend
```bash
cd /var/www/
git clone https://github.com/usuario/OsitosLua.git
cd OsitosLua/backend

# Install dependencies
npm install
npx prisma generate
npm run build

# Run migrations
npx prisma migrate deploy

# Seed products (optional)
npm run seed

# Generate sitemap
npm run sitemap

# Start with PM2
pm2 start dist/index.js --name ositoslua-backend
pm2 save
pm2 startup
```

#### 4. Deploy Frontend
```bash
cd /var/www/OsitosLua/frontend
npm install
npm run build

# Frontend build está en /dist
```

#### 5. Configure Nginx
```nginx
# /etc/nginx/sites-available/ositoslua

# Frontend
server {
    listen 80;
    server_name ositoslua.cl www.ositoslua.cl;
    
    root /var/www/OsitosLua/frontend/dist;
    index index.html;

    # SEO: robots.txt and sitemap.xml
    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    location = /sitemap.xml {
        allow all;
        log_not_found off;
        access_log off;
    }

    # PWA: Service Worker
    location /sw.js {
        add_header Cache-Control "no-cache";
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
        expires off;
        access_log off;
    }

    # Static assets with cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend API
server {
    listen 80;
    server_name api.ositoslua.cl;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $http_x_forwarded_for;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activar configuración
sudo ln -s /etc/nginx/sites-available/ositoslua /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. SSL con Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ositoslua.cl -d www.ositoslua.cl -d api.ositoslua.cl
```

## Post-Deployment Tasks

### 1. Configure Stripe Webhooks
```
https://dashboard.stripe.com/webhooks

Endpoint URL: https://api.ositoslua.cl/api/webhooks/stripe
Events:
  - checkout.session.completed
```

### 2. Submit Sitemap to Google
```
https://search.google.com/search-console

Sitemaps > Add sitemap
URL: https://ositoslua.cl/sitemap.xml
```

### 3. Configure Analytics
```bash
# Ya configurado con:
# - Google Analytics 4 (VITE_GA_MEASUREMENT_ID)
# - Facebook Pixel (VITE_FB_PIXEL_ID)
```

### 4. Test PWA Installation
- Abrir https://ositoslua.cl en móvil
- Verificar prompt de instalación
- Instalar y probar offline

### 5. Test Email Notifications
- Realizar orden de prueba
- Verificar email de confirmación
- Probar newsletter signup

### 6. Monitor Application
```bash
# PM2 monitoring
pm2 monit

# Logs
pm2 logs ositoslua-backend

# Status
pm2 status
```

## Performance Optimization

### 1. Enable Gzip
```nginx
# /etc/nginx/nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### 2. Configure CDN (Cloudflare)
```
1. Agregar dominio a Cloudflare
2. Cambiar nameservers
3. Activar:
   - Auto Minify (JS, CSS, HTML)
   - Brotli Compression
   - Rocket Loader
   - Polish (image optimization)
```

### 3. Database Connection Pooling
```typescript
// backend/src/index.ts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error'],
});
```

## Monitoring

### 1. Error Tracking (Sentry)
```bash
npm install @sentry/react @sentry/node

# Frontend
Sentry.init({
  dsn: "https://...@sentry.io/...",
  environment: "production",
  tracesSampleRate: 1.0,
});

# Backend
Sentry.init({
  dsn: "https://...@sentry.io/...",
  environment: "production",
});
```

### 2. Uptime Monitoring
- UptimeRobot: https://uptimerobot.com/
- Pingdom: https://www.pingdom.com/
- Better Stack: https://betterstack.com/

### 3. Application Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Backup Strategy

### 1. Database Backups
```bash
# Diario a las 3 AM
0 3 * * * pg_dump -U ositoslua_user ositoslua > /backups/db_$(date +\%Y\%m\%d).sql

# Retention: 7 días
find /backups -name "db_*.sql" -mtime +7 -delete
```

### 2. File Backups
```bash
# Imágenes en Cloudinary (ya respaldadas)
# Código en GitHub (ya respaldado)
```

## Scaling

### Horizontal Scaling (Multiple Instances)
```bash
# PM2 Cluster Mode
pm2 start dist/index.js -i max --name ositoslua-backend
```

### Database Read Replicas
```typescript
// Prisma supports read replicas
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Write
    },
    dbRead: {
      url: process.env.DATABASE_READ_URL, // Read
    },
  },
});
```

## Checklist Final

- [ ] Environment variables configuradas
- [ ] Backend deployed y corriendo
- [ ] Frontend deployed y corriendo
- [ ] Database migraciones aplicadas
- [ ] Sitemap generado y actualizado
- [ ] SSL certificates instalados
- [ ] Stripe webhooks configurados
- [ ] Analytics configurado (GA4 + FB Pixel)
- [ ] Email notifications funcionando
- [ ] PWA instalable en móvil
- [ ] robots.txt accesible
- [ ] sitemap.xml accesible
- [ ] Google Search Console configurado
- [ ] Monitoring configurado
- [ ] Backups automatizados
- [ ] DNS configurado correctamente

---

🚀 **Ready for Production!**

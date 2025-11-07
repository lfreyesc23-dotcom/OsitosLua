# Variables de Entorno - Checklist de Configuración

## 🎯 RENDER (Backend)
**URL**: https://ositoslua.onrender.com

### ✅ Variables Requeridas

Todas estas variables deben estar configuradas en Render Dashboard:

```bash
# Base de Datos
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]

# Seguridad
JWT_SECRET=[tu-clave-secreta-jwt]
NODE_ENV=production

# Servidor
PORT=10000

# Frontend
FRONTEND_URL=https://ositoslua.vercel.app

# Cloudinary (para imágenes)
CLOUDINARY_CLOUD_NAME=[tu-cloud-name]
CLOUDINARY_API_KEY=[tu-api-key]
CLOUDINARY_API_SECRET=[tu-api-secret]

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=[tu-email]
EMAIL_PASSWORD=[contraseña-de-aplicacion]
EMAIL_FROM=OsitosLua <noreply@ositoslua.cl>

# Stripe (Pagos)
STRIPE_PUBLIC_KEY=[tu-stripe-public-key]
STRIPE_SECRET_KEY=[tu-stripe-secret-key]
STRIPE_WEBHOOK_SECRET=[tu-webhook-secret]
```

**📌 Nota**: Los valores reales deben configurarse directamente en Render Dashboard, no en el código.

---

## 🚀 VERCEL (Frontend)
**URL**: https://ositoslua.vercel.app

### ✅ Variable Requerida

Solo necesitas una variable en Vercel:

```bash
VITE_API_URL=https://ositoslua.onrender.com/api
```

### 📝 Pasos para configurar en Vercel:

1. Ve a: https://vercel.com/[tu-usuario]/ositoslua/settings/environment-variables
2. Agrega la variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://ositoslua.onrender.com/api`
   - **Environment**: Production, Preview, Development (todas)
3. Haz clic en "Save"
4. **IMPORTANTE**: Redeploya la aplicación

---

## 🔄 Redesplegar

### En Vercel:
```bash
# Opción 1: Desde Git
git add .
git commit -m "Update configuration"
git push

# Opción 2: Desde Dashboard
# Ve a Deployments → Redeploy
```

### En Render:
- El redeploy es automático si detecta cambios
- O manualmente desde Dashboard → Manual Deploy

---

## 🧪 Verificación

### Script de verificación:
```bash
./verificar-produccion.sh
```

### Verificación manual:

**Backend Health:**
```bash
curl https://ositoslua.onrender.com/health
```

**API Productos:**
```bash
curl https://ositoslua.onrender.com/api/products
```

**Frontend:**
```
https://ositoslua.vercel.app
```

---

## 📊 Monitoreo

### Logs de Render (Backend):
```
https://dashboard.render.com/web/[tu-service-id]/logs
```

### Logs de Vercel (Frontend):
```
https://vercel.com/[tu-usuario]/ositoslua/logs
```

---

## ⚠️ Notas de Seguridad

1. **NUNCA** commitear archivos `.env` al repositorio
2. **NUNCA** compartir claves en archivos públicos
3. Usar contraseñas de aplicación para Gmail (no contraseña principal)
4. Las claves de Stripe en TEST mode para desarrollo
5. Rotar `JWT_SECRET` periódicamente

---

## 🆘 Problemas Comunes

### Error 500 en productos:
- ✅ Verificar `VITE_API_URL` en Vercel
- ✅ Verificar que apunte a `https://ositoslua.onrender.com/api`
- ✅ Redesplegar después de cambiar variables

### CORS Error:
- ✅ Verificar `FRONTEND_URL=https://ositoslua.vercel.app` en Render
- ✅ Verificar que el dominio coincida exactamente

### Backend no responde:
- ⏳ Primera petición tarda ~50 segundos (Render free tier)
- ✅ Verificar logs en Render Dashboard

### Variables no se aplican:
- ✅ Redesplegar después de cambiar variables
- ✅ Limpiar caché del navegador
- ✅ Verificar en consola: `console.log(import.meta.env.VITE_API_URL)`

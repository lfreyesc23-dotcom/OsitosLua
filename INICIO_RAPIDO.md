# 🚀 Guía de Inicio Rápido - OsitosLua

## Prerequisitos
- PostgreSQL instalado y corriendo
- Node.js v18+ instalado
- npm instalado

## 🎯 Opción 1: Script Bash (Recomendado para Mac/Linux)

### Iniciar ambos servicios con un solo comando:

```bash
./start-dev.sh
```

Este script:
- ✅ Verifica que PostgreSQL esté corriendo
- ✅ Inicia el backend en el puerto 3000
- ✅ Inicia el frontend en el puerto 5173
- ✅ Guarda los logs en `logs/backend.log` y `logs/frontend.log`
- ✅ Maneja la señal Ctrl+C para detener ambos servicios

### Ver logs en tiempo real:

```bash
# Backend
tail -f logs/backend.log

# Frontend
tail -f logs/frontend.log
```

## 🎯 Opción 2: NPM Scripts (Multiplataforma)

### Iniciar con concurrently:

```bash
npm run dev
```

Este comando inicia backend y frontend en paralelo con salida coloreada.

### Comandos adicionales:

```bash
# Instalar dependencias en todos los proyectos
npm run install:all

# Solo backend
npm run dev:backend

# Solo frontend
npm run dev:frontend

# Build de producción
npm run build
```

## 🎯 Opción 3: Manual (Dos terminales)

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## 📍 URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Docs:** http://localhost:3000/api

## 🛑 Detener los servicios

- **Script bash:** Presiona `Ctrl+C`
- **NPM concurrently:** Presiona `Ctrl+C`
- **Manual:** Presiona `Ctrl+C` en cada terminal

## ⚠️ Solución de Problemas

### PostgreSQL no está corriendo:
```bash
# Mac (Homebrew)
brew services start postgresql@14

# Mac (Postgres.app)
# Abre la aplicación Postgres

# Linux
sudo systemctl start postgresql
```

### Puerto ya en uso:
```bash
# Ver qué está usando el puerto 3000
lsof -i :3000

# Ver qué está usando el puerto 5173
lsof -i :5173

# Matar proceso en puerto específico
kill -9 $(lsof -t -i:3000)
```

### Variables de entorno no configuradas:
Verifica que existan los archivos:
- `backend/.env`
- `frontend/.env`

## 🔒 Variables de Entorno Actualizadas

El archivo `backend/.env` ahora incluye:
- ✅ JWT_SECRET con 32+ caracteres (seguro)
- ✅ NODE_ENV=development
- ✅ LOG_LEVEL=info
- ✅ Todas las configuraciones de email corregidas

## 📝 Notas

- El primer usuario registrado será automáticamente ADMIN
- Las imágenes se suben a Cloudinary
- Los pagos se procesan con Stripe (modo test)
- Los emails se envían vía Gmail SMTP

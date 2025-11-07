# 🔧 Solución a Problemas de Producción - OsitosLua

## 🐛 Problema: Página en blanco o error 500

### Causas identificadas:

1. ✅ **Variable de entorno mal configurada** - `VITE_API_URL` no apuntaba a producción
2. ✅ **Estructura de datos incorrecta** - API devuelve `{products: [...]}` no array directo
3. ✅ **Ruleta automática bloqueando** - Se mostraba automáticamente y podía causar errores

### ✅ Soluciones aplicadas:

#### 1. Variables de entorno corregidas

**Frontend (Vercel)**
```bash
VITE_API_URL=https://ositoslua.onrender.com/api
```

**Backend (Render)** - Ya configurado ✅
- Todas las variables están correctamente configuradas

#### 2. Código corregido

##### `frontend/src/pages/HomePage.tsx`
- ✅ Deshabilitada ruleta automática (solo manual con botón)
- ✅ Parseado correcto de `response.data.products`
- ✅ Mejor manejo de errores con console.error
- ✅ No bloquea UI si falla la carga

##### `frontend/src/components/DiscountWheel.tsx`
- ✅ Agregado try-catch global en `spinWheel()`
- ✅ Manejo de errores mejorado
- ✅ Cierre automático si hay error

#### 3. Variable `.env` local actualizada
```bash
VITE_API_URL=https://ositoslua.onrender.com/api
```

---

## 📋 Pasos para desplegar los cambios:

### 1️⃣ Confirmar Variable en Vercel

Ve a: https://vercel.com/lfreyesc23-dotcom/ositoslua/settings/environment-variables

Verifica que exista:
```
Name: VITE_API_URL
Value: https://ositoslua.onrender.com/api
Environments: Production, Preview, Development
```

### 2️⃣ Hacer commit y push

```bash
cd /Users/luisreyes/OsitosLua
git add .
git commit -m "fix: Solución a página en blanco - variables de entorno y manejo de errores"
git push origin main
```

### 3️⃣ Verificar despliegue

Vercel desplegará automáticamente cuando hagas push.

**Logs:**
- Vercel: https://vercel.com/lfreyesc23-dotcom/ositoslua/deployments
- Render: https://dashboard.render.com/web/srv-d46n5tadbo4c739cljng/logs

### 4️⃣ Probar la aplicación

Una vez desplegado:

1. **Limpiar caché del navegador** (Ctrl + Shift + R o Cmd + Shift + R)
2. Ir a: https://ositoslua.vercel.app
3. Abrir DevTools (F12) → Console
4. Verificar que no haya errores
5. Verificar que se carguen los productos

---

## 🧪 Testing

### Probar API directamente:
```bash
# Health check
curl https://ositoslua.onrender.com/health

# Productos
curl https://ositoslua.onrender.com/api/products
```

### Probar Frontend:
```bash
# Verificar variable de entorno
cat frontend/.env

# Debería mostrar:
# VITE_API_URL=https://ositoslua.onrender.com/api
```

### Script de verificación:
```bash
./verificar-produccion.sh
```

---

## 🎡 Sobre la Ruleta de Descuentos

### Estado actual:
- ✅ **Funcional** pero **NO automática**
- ✅ Solo se muestra si el usuario hace clic en el botón "🎰 Gira y Gana"
- ✅ Mejor manejo de errores

### Para reactivar modo automático:

En `frontend/src/pages/HomePage.tsx`, descomentar:

```typescript
useEffect(() => {
  const hasUsedWheel = localStorage.getItem('wheelUsed');
  if (!hasUsedWheel) {
    const timer = setTimeout(() => {
      setShowWheel(true);
    }, 2000);
    return () => clearTimeout(timer);
  }
}, []);
```

**⚠️ Recomendación:** Mantenerla manual hasta verificar que todo funcione correctamente.

---

## 🚨 Troubleshooting

### Problema: Aún no se ven productos

**Verificar:**
1. ✅ Variable `VITE_API_URL` en Vercel
2. ✅ Redesplegar después de cambiar variables
3. ✅ Limpiar caché del navegador
4. ✅ Verificar logs de consola (F12)

**Solución:**
```bash
# En DevTools Console, verificar:
console.log(import.meta.env.VITE_API_URL)
# Debería mostrar: https://ositoslua.onrender.com/api
```

### Problema: Error CORS

**Verificar en Render:**
- `FRONTEND_URL=https://ositoslua.vercel.app` ✅

**Verificar en backend logs:**
```
CORS allowed origins: https://ositoslua.vercel.app
```

### Problema: Backend no responde

**Primera petición tarda ~50 segundos**
- Render free tier "duerme" el servicio
- Es normal, solo la primera carga es lenta

**Verificar estado:**
```bash
curl https://ositoslua.onrender.com/health
```

---

## 📊 Monitoreo

### Logs en tiempo real:

**Render (Backend):**
```
https://dashboard.render.com/web/srv-d46n5tadbo4c739cljng/logs
```

**Vercel (Frontend):**
```
https://vercel.com/lfreyesc23-dotcom/ositoslua/logs
```

### Métricas:

- **Health**: https://ositoslua.onrender.com/health
- **Productos**: https://ositoslua.onrender.com/api/products
- **Frontend**: https://ositoslua.vercel.app

---

## ✅ Checklist de Deploy

- [x] Variable `VITE_API_URL` en Vercel
- [x] Variable `FRONTEND_URL` en Render
- [x] Código con manejo de errores
- [x] Ruleta deshabilitada automática
- [x] Parse correcto de `response.data.products`
- [ ] Commit y push de cambios
- [ ] Verificar deployment en Vercel
- [ ] Probar en navegador (limpiar caché)
- [ ] Verificar logs sin errores

---

## 🆘 Soporte

Si después de estos pasos aún tienes problemas:

1. Verifica los logs de Vercel y Render
2. Revisa la consola del navegador (F12)
3. Prueba la API directamente con curl
4. Limpia localStorage: `localStorage.clear()`
5. Prueba en modo incógnito

---

## 📝 Notas

- Los cambios están aplicados **localmente**
- Necesitas hacer **commit + push** para que se desplieguen
- Vercel despliega **automáticamente** en cada push
- Render ya está desplegado y funcionando ✅

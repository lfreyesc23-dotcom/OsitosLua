# 🔧 Troubleshooting - Variables de Entorno en Vercel

## ⚠️ Problema Común: Variables de entorno no se aplican

### 🎯 Causa:

Las variables de entorno en **Vite** (prefijo `VITE_`) se inyectan en **tiempo de BUILD**, no en tiempo de ejecución.

Esto significa que:
- ❌ Cambiar una variable en Vercel **NO actualiza automáticamente** la app
- ✅ Necesitas **REDEPLOY** después de cambiar variables

### ✅ Solución:

Después de agregar/modificar una variable `VITE_*` en Vercel:

#### Opción 1: Redeploy Manual (Dashboard)

1. Ve a: https://vercel.com/[tu-usuario]/ositoslua/deployments
2. Clic en el deployment más reciente
3. Clic en **"⋮"** (tres puntos) → **"Redeploy"**
4. **IMPORTANTE**: Desmarca **"Use existing Build Cache"**
5. Confirma

#### Opción 2: Redeploy desde Git

```bash
# Forzar nuevo deployment
git commit --allow-empty -m "chore: Redeploy con nuevas variables"
git push origin main
```

#### Opción 3: Desde CLI de Vercel

```bash
# Si tienes Vercel CLI instalado
vercel --prod --force
```

---

## 🔍 Verificar que la variable esté configurada:

### En Vercel Dashboard:

1. Ve a: Settings → Environment Variables
2. Verifica que exista:
   ```
   Name: VITE_API_URL
   Value: https://ositoslua.onrender.com/api
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

### Desde el navegador (después del redeploy):

1. Abre: https://ositoslua.vercel.app
2. Abre DevTools (F12) → Console
3. Escribe:
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```
4. Debería mostrar: `https://ositoslua.onrender.com/api`

Si muestra `undefined`, significa que el redeploy no incluyó la variable.

---

## 📋 Checklist de Deployment:

- [ ] Variable `VITE_API_URL` agregada en Vercel
- [ ] Environments seleccionados: Production, Preview, Development
- [ ] Redeploy manual O push a Git
- [ ] Esperar a que el deployment diga "Ready"
- [ ] **Limpiar caché del navegador** (Cmd/Ctrl + Shift + R)
- [ ] Verificar en consola que `import.meta.env.VITE_API_URL` no sea undefined

---

## 🐛 Debugging:

### Error: `e.map is not a function`

**Causa**: La variable `VITE_API_URL` está `undefined`, entonces la app intenta conectarse a una URL incorrecta y recibe una respuesta no válida.

**Solución**: 
1. Verificar que la variable esté en Vercel
2. Hacer redeploy sin caché
3. Limpiar caché del navegador

### La app muestra "Error al cargar productos"

**Verificar**:

```bash
# 1. Backend está funcionando
curl https://ositoslua.onrender.com/health

# 2. API de productos funciona
curl https://ositoslua.onrender.com/api/products

# 3. Frontend puede conectarse
# Abre la app y mira Network tab en DevTools
# ¿Las requests van a la URL correcta?
```

### La app carga pero productos no aparecen

**En DevTools → Console, busca**:
- `API Response:` → Debería mostrar `{products: Array(10), ...}`
- Si ves errores CORS → Verifica `FRONTEND_URL` en Render
- Si ves error 500 → Revisa logs de Render

---

## 📝 Diferencia entre variables locales y producción:

### Local (desarrollo):
```bash
# Archivo: frontend/.env
VITE_API_URL=https://ositoslua.onrender.com/api

# Vite lee este archivo automáticamente
npm run dev
```

### Producción (Vercel):
```
# Configurado en: Vercel Dashboard → Settings → Environment Variables
VITE_API_URL=https://ositoslua.onrender.com/api

# Inyectado durante el BUILD:
npm run build  ← Aquí se inyectan las variables
```

---

## ✅ Confirmación de éxito:

Sabrás que todo funciona cuando:

1. ✅ La página carga sin errores en consola
2. ✅ Los productos aparecen en el home
3. ✅ En DevTools → Console ves: `API Response: {products: [...]}`
4. ✅ En DevTools → Network ves requests a `https://ositoslua.onrender.com/api/*`

---

## 🆘 Si nada funciona:

1. **Verifica la variable en Vercel Dashboard** (Settings → Environment Variables)
2. **Haz redeploy SIN caché** (importante)
3. **Espera 2-3 minutos** a que termine el deployment
4. **Limpia caché del navegador** (Cmd + Shift + R)
5. **Prueba en modo incógnito** (para evitar caché)
6. **Revisa logs de deployment** en Vercel
7. **Compara con local**: Si local funciona pero producción no → problema de variables

---

## 🔗 Links Útiles:

- Vercel Dashboard: https://vercel.com/dashboard
- Variables de Entorno: https://vercel.com/[tu-usuario]/ositoslua/settings/environment-variables
- Deployments: https://vercel.com/[tu-usuario]/ositoslua/deployments
- Logs de Backend (Render): https://dashboard.render.com
- Documentación Vite Env: https://vitejs.dev/guide/env-and-mode.html

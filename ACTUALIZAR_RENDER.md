# 🔧 ACTUALIZAR FRONTEND_URL EN RENDER

## URGENTE: Corregir CORS

### Pasos:

1. Ve a: https://dashboard.render.com/web/srv-ctadpntumphs73c0jkug/env
   
2. Busca la variable: `FRONTEND_URL`

3. Cambia el valor de:
   ```
   https://ositolua-cgdg9whlu-lfreyesc23-7805s-projects.vercel.app
   ```
   
   A:
   ```
   https://ositoslua.vercel.app
   ```

4. Haz clic en "Save Changes"

5. Render redesplegará automáticamente (1-2 minutos)

### ¿Por qué es importante?

Sin esto, el frontend NO podrá comunicarse con el backend debido a CORS.
Los productos, carrito, login, TODO fallará.

### Verificar después:

```bash
curl -I https://ositoslua.onrender.com/api/products
```

Debe responder con status 200.

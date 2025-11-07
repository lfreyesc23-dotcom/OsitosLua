#!/bin/bash

# Script para verificar la configuración de producción
# OsitosLua - Diagnóstico de Conexiones

echo "🔍 VERIFICACIÓN DE PRODUCCIÓN - OsitosLua"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar Backend (Render)
echo "📡 1. Verificando Backend (Render)..."
echo "URL: https://ositoslua.onrender.com"
echo ""

BACKEND_HEALTH=$(curl -s -w "\n%{http_code}" https://ositoslua.onrender.com/health)
HTTP_CODE=$(echo "$BACKEND_HEALTH" | tail -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Backend funcionando correctamente${NC}"
    echo "$BACKEND_HEALTH" | head -n -1 | jq '.'
else
    echo -e "${RED}❌ Backend con problemas (HTTP $HTTP_CODE)${NC}"
fi

echo ""
echo "---"
echo ""

# 2. Verificar API de Productos
echo "🧸 2. Verificando API de Productos..."
echo "URL: https://ositoslua.onrender.com/api/products"
echo ""

PRODUCTS_RESPONSE=$(curl -s -w "\n%{http_code}" "https://ositoslua.onrender.com/api/products?limit=3")
PRODUCTS_HTTP_CODE=$(echo "$PRODUCTS_RESPONSE" | tail -1)

if [ "$PRODUCTS_HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ API de productos funcionando${NC}"
    PRODUCTS_COUNT=$(echo "$PRODUCTS_RESPONSE" | head -n -1 | jq '.pagination.total')
    echo "Total de productos: $PRODUCTS_COUNT"
else
    echo -e "${RED}❌ API de productos con problemas (HTTP $PRODUCTS_HTTP_CODE)${NC}"
fi

echo ""
echo "---"
echo ""

# 3. Verificar Variables de Entorno Frontend
echo "⚙️  3. Verificando Variables Frontend (local)..."
if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✅ Archivo .env encontrado${NC}"
    echo "Contenido:"
    cat frontend/.env
    
    # Verificar que apunte a producción
    if grep -q "ositoslua.onrender.com" frontend/.env; then
        echo -e "${GREEN}✅ Variable VITE_API_URL apunta a producción${NC}"
    else
        echo -e "${RED}❌ Variable VITE_API_URL NO apunta a producción${NC}"
        echo -e "${YELLOW}⚠️  Debería ser: VITE_API_URL=https://ositoslua.onrender.com/api${NC}"
    fi
else
    echo -e "${RED}❌ Archivo .env NO encontrado en frontend/${NC}"
fi

echo ""
echo "---"
echo ""

# 4. Verificar CORS
echo "🌐 4. Verificando CORS..."
CORS_TEST=$(curl -s -X OPTIONS \
  -H "Origin: https://ositoslua.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -I https://ositoslua.onrender.com/api/products | grep -i "access-control")

if [ -n "$CORS_TEST" ]; then
    echo -e "${GREEN}✅ CORS configurado${NC}"
    echo "$CORS_TEST"
else
    echo -e "${YELLOW}⚠️  No se detectaron headers CORS (puede ser normal en OPTIONS)${NC}"
fi

echo ""
echo "---"
echo ""

# 5. Verificar Frontend (Vercel)
echo "🚀 5. Verificando Frontend (Vercel)..."
echo "URL: https://ositoslua.vercel.app"
echo ""

FRONTEND_RESPONSE=$(curl -s -w "\n%{http_code}" https://ositoslua.vercel.app)
FRONTEND_HTTP_CODE=$(echo "$FRONTEND_RESPONSE" | tail -1)

if [ "$FRONTEND_HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Frontend accesible${NC}"
else
    echo -e "${RED}❌ Frontend con problemas (HTTP $FRONTEND_HTTP_CODE)${NC}"
fi

echo ""
echo "---"
echo ""

# 6. Test de conectividad Frontend -> Backend
echo "🔗 6. Test de Conectividad Frontend -> Backend..."
echo "Simulando petición desde Vercel..."
echo ""

VERCEL_TO_BACKEND=$(curl -s -w "\n%{http_code}" \
  -H "Origin: https://ositoslua.vercel.app" \
  -H "Referer: https://ositoslua.vercel.app" \
  https://ositoslua.onrender.com/api/products?limit=1)

CONNECT_HTTP_CODE=$(echo "$VERCEL_TO_BACKEND" | tail -1)

if [ "$CONNECT_HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Conectividad Frontend -> Backend OK${NC}"
else
    echo -e "${RED}❌ Problema en conectividad (HTTP $CONNECT_HTTP_CODE)${NC}"
    echo "Respuesta:"
    echo "$VERCEL_TO_BACKEND" | head -n -1
fi

echo ""
echo "=========================================="
echo "📋 RESUMEN DE DIAGNÓSTICO"
echo "=========================================="
echo ""

# Resumen
ALL_OK=true

if [ "$HTTP_CODE" != "200" ]; then
    echo -e "${RED}❌ Backend no responde correctamente${NC}"
    ALL_OK=false
fi

if [ "$PRODUCTS_HTTP_CODE" != "200" ]; then
    echo -e "${RED}❌ API de productos no responde${NC}"
    ALL_OK=false
fi

if ! grep -q "ositoslua.onrender.com" frontend/.env 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Variable VITE_API_URL necesita actualización${NC}"
    ALL_OK=false
fi

if [ "$CONNECT_HTTP_CODE" != "200" ]; then
    echo -e "${RED}❌ Problema de conectividad Frontend -> Backend${NC}"
    ALL_OK=false
fi

if [ "$ALL_OK" = true ]; then
    echo -e "${GREEN}✅ TODOS LOS TESTS PASARON${NC}"
    echo ""
    echo "Tu aplicación debería estar funcionando correctamente."
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
    echo "Si aún tienes problemas, verifica que en Vercel tengas configurada:"
    echo "  Variable: VITE_API_URL"
    echo "  Valor: https://ositoslua.onrender.com/api"
    echo ""
    echo "Luego haz un redeploy en Vercel."
else
    echo ""
    echo -e "${RED}⚠️  PROBLEMAS DETECTADOS${NC}"
    echo ""
    echo "Pasos para solucionar:"
    echo ""
    echo "1. En Vercel, agrega la variable de entorno:"
    echo "   VITE_API_URL=https://ositoslua.onrender.com/api"
    echo ""
    echo "2. Haz redeploy en Vercel:"
    echo "   https://vercel.com/lfreyesc23-dotcom/ositoslua"
    echo ""
    echo "3. Verifica logs de Render:"
    echo "   https://dashboard.render.com/web/srv-d46n5tadbo4c739cljng/logs"
    echo ""
    echo "4. Verifica logs de Vercel:"
    echo "   https://vercel.com/lfreyesc23-dotcom/ositoslua/logs"
fi

echo ""
echo "=========================================="
echo "🔗 LINKS ÚTILES"
echo "=========================================="
echo ""
echo "📊 Render Dashboard: https://dashboard.render.com"
echo "🚀 Vercel Dashboard: https://vercel.com/dashboard"
echo "🌐 Frontend: https://ositoslua.vercel.app"
echo "📡 Backend: https://ositoslua.onrender.com"
echo "🧸 API Productos: https://ositoslua.onrender.com/api/products"
echo ""

#!/bin/bash

# Script para iniciar Backend y Frontend en modo desarrollo
# OsitosLua E-commerce Platform

# Colores para mejor visualización
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

echo -e "${BLUE}🐻 Iniciando OsitosLua - E-commerce Platform${NC}\n"

# Verificar que estamos en el directorio correcto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: Este script debe ejecutarse desde la raíz del proyecto${NC}"
    exit 1
fi

# Verificar que PostgreSQL está corriendo
echo -e "${YELLOW}🔍 Verificando PostgreSQL...${NC}"
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo -e "${RED}❌ PostgreSQL no está corriendo. Por favor, inicia PostgreSQL primero.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL está activo${NC}\n"

# Función para manejar la señal de salida
cleanup() {
    echo -e "\n${YELLOW}🛑 Deteniendo servicios...${NC}"
    kill 0
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT SIGTERM

# Iniciar Backend
echo -e "${BLUE}🚀 Iniciando Backend en puerto 3000...${NC}"
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Esperar un momento para que el backend inicie
sleep 3

# Verificar que el backend está corriendo
if ! lsof -i :3000 > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: El backend no pudo iniciarse. Revisa logs/backend.log${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi
echo -e "${GREEN}✅ Backend iniciado correctamente${NC}\n"

# Iniciar Frontend
echo -e "${BLUE}🎨 Iniciando Frontend en puerto 5173...${NC}"
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Esperar un momento para que el frontend inicie
sleep 3

# Verificar que el frontend está corriendo
if ! lsof -i :5173 > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: El frontend no pudo iniciarse. Revisa logs/frontend.log${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi
echo -e "${GREEN}✅ Frontend iniciado correctamente${NC}\n"

# Mostrar información
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ OsitosLua está corriendo!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📦 Backend:${NC}  http://localhost:3000"
echo -e "${BLUE}🎨 Frontend:${NC} http://localhost:5173"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 Logs:${NC}"
echo -e "   Backend:  tail -f logs/backend.log"
echo -e "   Frontend: tail -f logs/frontend.log"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "\n${YELLOW}Presiona Ctrl+C para detener ambos servicios${NC}\n"

# Mantener el script corriendo
wait

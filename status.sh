#!/bin/bash

# Script simple para ver el estado de los servicios
# OsitosLua - Status Check

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🐻 OsitosLua - Estado de Servicios${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# PostgreSQL
echo -n "PostgreSQL (5432): "
if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Corriendo${NC}"
else
    echo -e "${RED}❌ No disponible${NC}"
fi

# Backend
echo -n "Backend (3000):    "
if lsof -i :3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Corriendo${NC}"
else
    echo -e "${RED}❌ No activo${NC}"
fi

# Frontend
echo -n "Frontend (5173):   "
if lsof -i :5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Corriendo${NC}"
else
    echo -e "${RED}❌ No activo${NC}"
fi

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}💡 Comandos útiles:${NC}"
echo -e "   ./start-dev.sh      - Iniciar servicios"
echo -e "   npm run dev         - Iniciar con concurrently"
echo -e "   ./status.sh         - Ver este estado"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

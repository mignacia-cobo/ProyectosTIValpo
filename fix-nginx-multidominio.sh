#!/bin/bash

# Script para configurar Nginx con múltiples dominios
# Ejecutar en el servidor como linuxuser

set -e

echo "================================================"
echo "  CONFIGURACIÓN NGINX MULTIDOMINIO"
echo "================================================"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[1/8] Deteniendo contenedor Nginx de conciertos...${NC}"
cd /var/www/conciertos.proyectostivalpo.com
docker compose stop nginx || true
docker compose rm -f nginx || true
echo -e "${GREEN}✓ Nginx de conciertos detenido${NC}"
echo ""

echo -e "${YELLOW}[2/8] Instalando Nginx en el servidor...${NC}"
sudo apt-get update
sudo apt-get install -y nginx
echo -e "${GREEN}✓ Nginx instalado${NC}"
echo ""

echo -e "${YELLOW}[3/8] Creando configuración para proyectostivalpo.com...${NC}"
sudo tee /etc/nginx/sites-available/proyectostivalpo.com > /dev/null <<'EOF'
# Configuración para proyectostivalpo.com (Portal Principal)
server {
    listen 80;
    listen [::]:80;
    server_name proyectostivalpo.com www.proyectostivalpo.com;

    # Logs
    access_log /var/log/nginx/proyectosti_access.log;
    error_log /var/log/nginx/proyectosti_error.log;

    # Frontend - React App
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts para API
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Archivos subidos (imágenes, documentos)
    location /uploads/ {
        proxy_pass http://localhost:5000/uploads/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "Portal OK\n";
        add_header Content-Type text/plain;
    }
}
EOF
echo -e "${GREEN}✓ Configuración de proyectostivalpo.com creada${NC}"
echo ""

echo -e "${YELLOW}[4/8] Creando configuración para conciertos.proyectostivalpo.com...${NC}"
sudo tee /etc/nginx/sites-available/conciertos.proyectostivalpo.com > /dev/null <<'EOF'
# Configuración para conciertos.proyectostivalpo.com
server {
    listen 80;
    listen [::]:80;
    server_name conciertos.proyectostivalpo.com;

    # Límite de tamaño de subida
    client_max_body_size 10M;

    # Logs
    access_log /var/log/nginx/conciertos_access.log;
    error_log /var/log/nginx/conciertos_error.log;

    # Frontend - Proxy al contenedor
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Actuator endpoints
    location /actuator/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "Conciertos OK\n";
        add_header Content-Type text/plain;
    }
}
EOF
echo -e "${GREEN}✓ Configuración de conciertos.proyectostivalpo.com creada${NC}"
echo ""

echo -e "${YELLOW}[5/8] Habilitando sitios...${NC}"
sudo ln -sf /etc/nginx/sites-available/proyectostivalpo.com /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/conciertos.proyectostivalpo.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
echo -e "${GREEN}✓ Sitios habilitados${NC}"
echo ""

echo -e "${YELLOW}[6/8] Verificando configuración de Nginx...${NC}"
sudo nginx -t
echo -e "${GREEN}✓ Configuración válida${NC}"
echo ""

echo -e "${YELLOW}[7/8] Reiniciando Nginx...${NC}"
sudo systemctl restart nginx
sudo systemctl enable nginx
echo -e "${GREEN}✓ Nginx reiniciado${NC}"
echo ""

echo -e "${YELLOW}[8/8] Actualizando docker-compose de conciertos...${NC}"
cd /var/www/conciertos.proyectostivalpo.com

# Crear backup del docker-compose actual
cp docker-compose.yml docker-compose.yml.backup

# Actualizar docker-compose para exponer puertos del frontend
sudo tee docker-compose.yml > /dev/null <<'DOCKEREOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: conciertos-postgres
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-conciertosdb}
      POSTGRES_USER: ${POSTGRES_USER:-conciertosuser}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-conciertospass}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - conciertos-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-conciertosuser}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    image: micobo/conciertos-backend:latest
    container_name: conciertos-backend
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/${POSTGRES_DB:-conciertosdb}
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-conciertosuser}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:-conciertospass}
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      SERVER_PORT: 8080
    ports:
      - "8080:8080"
    networks:
      - conciertos-network
    healthcheck:
      test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    image: micobo/conciertos-frontend:latest
    container_name: conciertos-frontend
    depends_on:
      - backend
    environment:
      VITE_API_URL: https://conciertos.proyectostivalpo.com/api
    ports:
      - "3001:80"
    networks:
      - conciertos-network
    healthcheck:
      test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  conciertos-network:
    driver: bridge

volumes:
  postgres_data:
DOCKEREOF

echo -e "${GREEN}✓ Docker Compose actualizado (sin contenedor Nginx)${NC}"
echo ""

echo -e "${YELLOW}Levantando contenedores actualizados...${NC}"
docker compose up -d
echo ""

echo "================================================"
echo -e "${GREEN}  ✓ CONFIGURACIÓN COMPLETADA${NC}"
echo "================================================"
echo ""
echo -e "${GREEN}ESTADO DE LOS SERVICIOS:${NC}"
echo ""
echo "📍 proyectostivalpo.com"
echo "   Frontend: http://localhost:3000 → Nginx → http://proyectostivalpo.com"
echo "   Backend:  http://localhost:5000 → Nginx → http://proyectostivalpo.com/api"
echo ""
echo "📍 conciertos.proyectostivalpo.com"
echo "   Frontend: http://localhost:3001 → Nginx → http://conciertos.proyectostivalpo.com"
echo "   Backend:  http://localhost:8080 → Nginx → http://conciertos.proyectostivalpo.com/api"
echo ""
echo -e "${YELLOW}VERIFICAR:${NC}"
echo "  curl -I http://proyectostivalpo.com"
echo "  curl -I http://conciertos.proyectostivalpo.com"
echo ""
echo -e "${YELLOW}VER LOGS:${NC}"
echo "  sudo tail -f /var/log/nginx/proyectosti_access.log"
echo "  sudo tail -f /var/log/nginx/conciertos_access.log"
echo ""

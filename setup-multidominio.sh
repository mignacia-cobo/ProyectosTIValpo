#!/bin/bash

# Script para configurar múltiples dominios en el servidor
# Ejecutar: bash setup-multidominio.sh

set -e

echo "================================================"
echo "  CONFIGURACIÓN DE MÚLTIPLES DOMINIOS"
echo "================================================"
echo ""

# Variables
DOMAIN_MAIN="proyectostivalpo.com"
DOMAIN_SUB="conciertos.proyectostivalpo.com"
IP_SERVER="64.176.16.195"

echo "Dominios a configurar:"
echo "  - $DOMAIN_MAIN (Portal principal)"
echo "  - $DOMAIN_SUB (Sistema de conciertos)"
echo ""

# Verificar que estamos en el servidor
if [ ! -f /etc/nginx/nginx.conf ]; then
    echo "❌ Error: Este script debe ejecutarse en el servidor"
    echo "Conéctate primero: ssh root@$IP_SERVER"
    exit 1
fi

echo "[1/6] Instalando Nginx si no está instalado..."
if ! command -v nginx &> /dev/null; then
    apt-get update
    apt-get install -y nginx
    echo "✅ Nginx instalado"
else
    echo "✅ Nginx ya está instalado"
fi

echo ""
echo "[2/6] Creando configuración de Nginx..."

cat > /etc/nginx/sites-available/proyectostivalpo.conf << 'EOF'
# Portal Principal - proyectostivalpo.com
server {
    listen 80;
    listen [::]:80;
    server_name proyectostivalpo.com www.proyectostivalpo.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size 10M;
    }

    location /uploads {
        alias /var/www/proyectostivalpo/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

# Sistema de Conciertos - conciertos.proyectostivalpo.com
server {
    listen 80;
    listen [::]:80;
    server_name conciertos.proyectostivalpo.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size 10M;
    }

    location /uploads {
        alias /var/www/conciertos/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

echo "✅ Configuración creada"

echo ""
echo "[3/6] Habilitando sitio..."
ln -sf /etc/nginx/sites-available/proyectostivalpo.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
echo "✅ Sitio habilitado"

echo ""
echo "[4/6] Verificando configuración de Nginx..."
if nginx -t; then
    echo "✅ Configuración válida"
else
    echo "❌ Error en la configuración de Nginx"
    exit 1
fi

echo ""
echo "[5/6] Recargando Nginx..."
systemctl reload nginx
echo "✅ Nginx recargado"

echo ""
echo "[6/6] Configurando firewall..."
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable
echo "✅ Firewall configurado"

echo ""
echo "================================================"
echo "  ✅ CONFIGURACIÓN COMPLETADA"
echo "================================================"
echo ""
echo "Estructura de directorios:"
echo "  /var/www/proyectostivalpo/     (Puerto 3000)"
echo "  /var/www/conciertos/            (Puerto 3001)"
echo ""
echo "Próximos pasos:"
echo ""
echo "1. Configurar DNS:"
echo "   A @ → $IP_SERVER"
echo "   A www → $IP_SERVER"
echo "   A conciertos → $IP_SERVER"
echo ""
echo "2. Verificar que los proyectos estén corriendo:"
echo "   cd /var/www/proyectostivalpo && docker compose ps"
echo "   cd /var/www/conciertos && docker compose ps"
echo ""
echo "3. Obtener certificados SSL (después de DNS):"
echo "   certbot --nginx -d $DOMAIN_MAIN -d www.$DOMAIN_MAIN"
echo "   certbot --nginx -d $DOMAIN_SUB"
echo ""
echo "4. Verificar en el navegador:"
echo "   http://$DOMAIN_MAIN"
echo "   http://$DOMAIN_SUB"
echo ""

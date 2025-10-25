#!/bin/bash

# Script de despliegue automático para ProyectosTI Valparaíso
# Ejecutar en el servidor: bash deploy.sh

set -e  # Detener si hay algún error

echo "======================================"
echo "  DESPLIEGUE PROYECTOSTI VALPARAÍSO"
echo "======================================"
echo ""

# Variables
DOMAIN="proyectostivalpo.com"
EMAIL="ma.cobo@profesor.duoc.cl"
PROJECT_DIR="/var/www/proyectostivalpo"

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

echo -e "${YELLOW}[1/8] Actualizando sistema...${NC}"
sudo apt-get update
sudo apt-get upgrade -y

echo -e "${YELLOW}[2/8] Instalando dependencias...${NC}"
# Instalar Docker si no está instalado
if ! command -v docker &> /dev/null; then
    echo "Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Instalar Docker Compose si no está instalado
if ! command -v docker compose &> /dev/null; then
    echo "Instalando Docker Compose..."
    sudo apt-get install docker-compose-plugin -y
fi

# Instalar Nginx si no está instalado
if ! command -v nginx &> /dev/null; then
    echo "Instalando Nginx..."
    sudo apt-get install nginx -y
fi

# Instalar Certbot para SSL
if ! command -v certbot &> /dev/null; then
    echo "Instalando Certbot..."
    sudo apt-get install certbot python3-certbot-nginx -y
fi

echo -e "${YELLOW}[3/8] Configurando firewall...${NC}"
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

echo -e "${YELLOW}[4/8] Creando directorio del proyecto...${NC}"
sudo mkdir -p $PROJECT_DIR
sudo chown -R linuxuser:linuxuser $PROJECT_DIR

echo -e "${YELLOW}[5/8] Configurando variables de entorno...${NC}"
if [ ! -f "$PROJECT_DIR/.env" ]; then
    cat > $PROJECT_DIR/.env << EOF
# Variables de producción
DB_USER=postgres
DB_PASSWORD=$(openssl rand -base64 32)
DB_NAME=proyectosti

JWT_SECRET=$(openssl rand -base64 64)

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=$EMAIL
SMTP_PASS=tu_contraseña_de_aplicacion_gmail
ADMIN_EMAIL=$EMAIL

NODE_ENV=production
EOF
    echo -e "${GREEN}✓ Archivo .env creado en $PROJECT_DIR/.env${NC}"
    echo -e "${RED}⚠ IMPORTANTE: Edita $PROJECT_DIR/.env y configura SMTP_PASS${NC}"
else
    echo -e "${GREEN}✓ Archivo .env ya existe${NC}"
fi

echo -e "${YELLOW}[6/8] Configurando Nginx...${NC}"
sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name proyectostivalpo.com www.proyectostivalpo.com;

    # Redirigir todo el tráfico HTTP a HTTPS (se activará después del SSL)
    # return 301 https://$server_name$request_uri;

    # Configuración temporal antes del SSL
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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Tamaño máximo de archivos subidos
        client_max_body_size 10M;
    }

    # Archivos estáticos (imágenes subidas)
    location /uploads {
        alias /var/www/proyectostivalpo/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Habilitar sitio
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx

echo -e "${GREEN}✓ Nginx configurado${NC}"

echo -e "${YELLOW}[7/8] Verificando estado de servicios...${NC}"
sudo systemctl enable nginx
sudo systemctl start nginx

echo -e "${YELLOW}[8/8] Resumen de instalación...${NC}"
echo -e "${GREEN}======================================"
echo -e "  ✓ INSTALACIÓN COMPLETADA"
echo -e "======================================${NC}"
echo ""
echo "Próximos pasos:"
echo ""
echo "1. Sube el código del proyecto a: $PROJECT_DIR"
echo "   Puedes usar Git: git clone [tu-repositorio] $PROJECT_DIR"
echo ""
echo "2. Edita las variables de entorno:"
echo "   nano $PROJECT_DIR/.env"
echo "   (Configura SMTP_PASS con tu contraseña de aplicación de Gmail)"
echo ""
echo "3. Desde el directorio del proyecto, inicia los contenedores:"
echo "   cd $PROJECT_DIR"
echo "   docker compose up -d"
echo ""
echo "4. Crea el usuario administrador:"
echo "   docker compose exec backend node src/scripts/createAdmin.js"
echo ""
echo "5. Obtén certificado SSL (DESPUÉS de configurar DNS):"
echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo -e "${RED}⚠ IMPORTANTE:${NC}"
echo "   - Asegúrate de que el DNS apunte a la IP: 64.176.16.195"
echo "   - Registros A necesarios:"
echo "     @ (root)  ->  64.176.16.195"
echo "     www       ->  64.176.16.195"
echo ""

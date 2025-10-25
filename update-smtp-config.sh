#!/bin/bash
# Script para actualizar la configuración del correo SMTP

echo "📧 Actualizando configuración de correo SMTP..."
echo "==============================================="

cd /var/www/proyectostivalpo

# Hacer backup del .env actual
echo "📦 Creando backup del .env actual..."
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Actualizar las variables de correo en el archivo .env
echo "✏️  Actualizando variables de correo..."

# Actualizar SMTP_USER
sed -i 's/^SMTP_USER=.*/SMTP_USER=contacto@proyectostivalpo.com/' .env

# Actualizar SMTP_PASS
sed -i 's/^SMTP_PASS=.*/SMTP_PASS=Proyectos.2025/' .env

# Actualizar ADMIN_EMAIL (correo donde llegarán los mensajes de contacto)
sed -i 's/^ADMIN_EMAIL=.*/ADMIN_EMAIL=contacto@proyectostivalpo.com/' .env

# Actualizar SMTP_HOST y PORT para el nuevo correo
sed -i 's/^SMTP_HOST=.*/SMTP_HOST=smtp.gmail.com/' .env
sed -i 's/^SMTP_PORT=.*/SMTP_PORT=587/' .env

echo ""
echo "📋 Configuración actualizada:"
echo "----------------------------"
grep "SMTP_" .env
grep "ADMIN_EMAIL" .env

echo ""
echo "🔄 Reiniciando backend para aplicar cambios..."
docker-compose restart backend

echo ""
echo "⏳ Esperando que el backend inicie..."
sleep 5

echo ""
echo "📋 Logs del backend:"
docker logs proyectosti_backend --tail 15

echo ""
echo "✅ Configuración de correo actualizada!"
echo ""
echo "Configuración actual:"
echo "  - SMTP_HOST: smtp.gmail.com"
echo "  - SMTP_PORT: 587"
echo "  - SMTP_USER: contacto@proyectostivalpo.com"
echo "  - SMTP_PASS: Proyectos.2025"
echo "  - ADMIN_EMAIL: contacto@proyectostivalpo.com"
echo ""
echo "⚠️  IMPORTANTE:"
echo "Si usas Gmail, asegúrate de:"
echo "1. Habilitar 'Acceso de aplicaciones menos seguras' o"
echo "2. Crear una 'Contraseña de aplicación' en la cuenta de Google"
echo ""
echo "Si usas otro proveedor de correo, puede que necesites ajustar SMTP_HOST y SMTP_PORT"

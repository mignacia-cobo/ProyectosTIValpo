#!/bin/bash
# Script para actualizar la configuración de la base de datos

cd /var/www/proyectostivalpo

# Hacer backup del .env actual
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Actualizar DB_NAME en el archivo .env
sed -i 's/^DB_NAME=.*/DB_NAME=readme_to_recover/' .env

echo "✅ Archivo .env actualizado"
echo "Contenido del .env:"
cat .env

# Reiniciar el contenedor backend para aplicar cambios
echo ""
echo "🔄 Reiniciando contenedor backend..."
docker restart proyectosti_backend

echo ""
echo "⏳ Esperando que el backend inicie..."
sleep 5

echo ""
echo "📋 Logs del backend:"
docker logs proyectosti_backend --tail 20

echo ""
echo "✅ Configuración actualizada!"
echo ""
echo "Puedes probar con:"
echo "  curl http://localhost:5000/api/projects"
echo "  curl http://localhost:5000/api/news?limit=3"

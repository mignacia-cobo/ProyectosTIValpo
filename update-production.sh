#!/bin/bash
# Script para actualizar el sistema ProyectosTI en producción

echo "🚀 Actualizando Portal ProyectosTI..."
echo "======================================"

# Navegar al directorio del proyecto
cd /var/www/proyectostivalpo

# 1. Hacer backup de la base de datos
echo ""
echo "📦 Creando backup de base de datos..."
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
docker exec proyectosti_db pg_dump -U postgres readme_to_recover > /tmp/backup_proyectosti_$BACKUP_DATE.sql
echo "✅ Backup creado: /tmp/backup_proyectosti_$BACKUP_DATE.sql"

# 2. Bajar las últimas imágenes de Docker Hub
echo ""
echo "📥 Descargando últimas imágenes..."
docker-compose pull

# 3. Detener y eliminar contenedores
echo ""
echo "🛑 Deteniendo contenedores..."
docker-compose down

# 4. Iniciar con las nuevas imágenes
echo ""
echo "🚀 Iniciando con las nuevas imágenes..."
docker-compose up -d

# 5. Esperar a que los servicios estén listos
echo ""
echo "⏳ Esperando que los servicios inicien..."
sleep 10

# 6. Verificar estado
echo ""
echo "📊 Estado de los servicios:"
docker-compose ps

# 7. Ver logs recientes del backend
echo ""
echo "📋 Logs recientes del backend:"
docker logs proyectosti_backend --tail 20

echo ""
echo "✅ Actualización completada!"
echo ""
echo "Para verificar el sitio:"
echo "  - Frontend: https://proyectostivalpo.com"
echo "  - API: https://proyectostivalpo.com/api/projects"
echo ""
echo "Para aplicar migraciones de base de datos:"
echo "  - Copia tu script SQL al servidor"
echo "  - Ejecuta: cat tu_script.sql | docker exec -i proyectosti_db psql -U postgres readme_to_recover"

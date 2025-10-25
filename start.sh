#!/bin/bash

# Script de inicio rápido para desarrollo local

echo "🚀 Iniciando Proyectos TI Valpo..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor, instala Docker primero."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor, instala Docker Compose primero."
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "⚠️  Por favor, edita el archivo .env con tus credenciales antes de continuar."
    echo "   Presiona Enter cuando hayas terminado..."
    read
fi

# Crear archivo .env del frontend si no existe
if [ ! -f frontend/.env ]; then
    echo "📝 Creando archivo .env del frontend..."
    cp frontend/.env.example frontend/.env
fi

# Construir y levantar contenedores
echo "🐳 Construyendo y levantando contenedores..."
docker-compose up -d --build

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado de los contenedores
echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "✅ ¡Aplicación iniciada!"
echo ""
echo "🌐 Acceder a:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5000/api"
echo "   - Panel Admin: http://localhost:3000/admin"
echo ""
echo "📝 Siguiente paso:"
echo "   Crear usuario administrador ejecutando:"
echo "   docker exec -it proyectosti_backend node src/scripts/createAdmin.js"
echo ""
echo "📋 Ver logs:"
echo "   docker-compose logs -f"
echo ""
echo "⛔ Detener aplicación:"
echo "   docker-compose down"
echo ""

#!/bin/bash

# Script para verificar el estado del servidor
# Ejecutar en el servidor: bash verificar-servidor.sh

echo "================================================"
echo "  VERIFICACIÓN DEL SERVIDOR"
echo "================================================"
echo ""

echo "1. Verificando directorios existentes:"
echo "--------------------------------------"
ls -la /var/www/ 2>/dev/null || echo "Directorio /var/www no existe"
echo ""

echo "2. Verificando contenedores Docker:"
echo "--------------------------------------"
docker ps -a
echo ""

echo "3. Verificando configuración de Nginx:"
echo "--------------------------------------"
ls -la /etc/nginx/sites-enabled/ 2>/dev/null || echo "No hay configuraciones de Nginx"
echo ""
echo "Contenido de configuraciones activas:"
for conf in /etc/nginx/sites-enabled/*; do
    if [ -f "$conf" ]; then
        echo "--- $conf ---"
        cat "$conf"
        echo ""
    fi
done

echo "4. Verificando puertos en uso:"
echo "--------------------------------------"
sudo netstat -tlnp | grep -E ":(80|443|3000|3001|5000|5001)" || echo "Netstat no disponible, intentando con ss:"
sudo ss -tlnp | grep -E ":(80|443|3000|3001|5000|5001)"
echo ""

echo "5. Verificando logs de Nginx:"
echo "--------------------------------------"
tail -n 20 /var/log/nginx/error.log 2>/dev/null || echo "No hay logs de Nginx"
echo ""

echo "================================================"
echo "  VERIFICACIÓN COMPLETADA"
echo "================================================"

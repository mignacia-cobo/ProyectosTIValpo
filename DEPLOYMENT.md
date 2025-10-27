# Guía de Despliegue en Servidor Ubuntu 22.04

Este documento describe los pasos para desplegar el sitio web en tu servidor.

## 📋 Requisitos Previos

- Servidor Ubuntu 22.04
- Docker y Docker Compose instalados
- Nginx instalado
- Certbot instalado (para SSL)
- Dominio apuntando al servidor (proyectostivalpo.com)

## 🚀 Pasos de Instalación

### 1. Conectar al servidor

```bash
ssh user@tu-servidor
```

### 2. Clonar el repositorio

```bash
cd /var/www/
git clone <tu-repositorio-url> proyectostivalpo
cd proyectostivalpo
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
nano .env
```

Editar con tus datos reales:
```env
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_SEGURO_AQUI
DB_NAME=readme_to_recover
JWT_SECRET=TU_JWT_SECRET_LARGO_Y_ALEATORIO
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
ADMIN_EMAIL=admin@proyectostivalpo.com
VITE_API_URL=https://proyectostivalpo.com/api
```

### 4. Crear archivo .env para frontend

```bash
cd frontend
cp .env.example .env
nano .env
```

Configurar:
```env
VITE_API_URL=https://proyectostivalpo.com/api
```

Volver al directorio raíz:
```bash
cd ..
```

### 5. Construir y levantar los contenedores

```bash
docker-compose up -d --build
```

Verificar que los contenedores estén corriendo:
```bash
docker-compose ps
```

### 6. Crear usuario administrador

```bash
docker exec -it proyectosti_backend node src/scripts/createAdmin.js
```

Ingresar:
- Nombre completo
- Email
- Contraseña (mínimo 6 caracteres)

### 7. Configurar Nginx

```bash
sudo cp nginx/proyectostivalpo.conf /etc/nginx/sites-available/proyectostivalpo.com
sudo ln -s /etc/nginx/sites-available/proyectostivalpo.com /etc/nginx/sites-enabled/
```

Verificar configuración:
```bash
sudo nginx -t
```

Si hay errores, revisar la configuración. Si todo está OK, recargar:
```bash
sudo systemctl reload nginx
```

### 8. Obtener certificado SSL con Certbot

```bash
sudo certbot --nginx -d proyectostivalpo.com -d www.proyectostivalpo.com
```

Seguir las instrucciones de Certbot. Seleccionar:
- Ingresar email
- Aceptar términos
- Opción 2: Redirigir HTTP a HTTPS (recomendado)

### 9. Verificar renovación automática de SSL

```bash
sudo certbot renew --dry-run
```

### 10. Verificar el sitio

Abrir en navegador:
- https://proyectostivalpo.com

Verificar:
- ✅ Página principal carga correctamente
- ✅ Proyectos se muestran
- ✅ Noticias se muestran
- ✅ Formulario de contacto funciona
- ✅ Panel de admin accesible en /admin

## 🔧 Comandos Útiles

### Ver logs de los contenedores

```bash
# Todos los contenedores
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend

# Solo base de datos
docker-compose logs -f db
```

### Reiniciar servicios

```bash
# Reiniciar todos
docker-compose restart

# Reiniciar solo uno
docker-compose restart backend
```

### Detener servicios

```bash
docker-compose down
```

### Actualizar el código

```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Backup de base de datos

```bash
docker exec proyectosti_db pg_dump -U postgres proyectosti > backup_$(date +%Y%m%d).sql
```

### Restaurar base de datos

```bash
cat backup_20231224.sql | docker exec -i proyectosti_db psql -U postgres proyectosti
```

## 📝 Configuración de Email (Gmail)

Si usas Gmail para enviar correos:

1. Ir a: https://myaccount.google.com/security
2. Habilitar "Verificación en 2 pasos"
3. Ir a "Contraseñas de aplicaciones"
4. Generar contraseña para "Correo"
5. Copiar la contraseña de 16 caracteres
6. Usar esa contraseña en `SMTP_PASS` del archivo `.env`

## 🔒 Seguridad

### Firewall (UFW)

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status
```

### Actualizar sistema

```bash
sudo apt update && sudo apt upgrade -y
```

## 🐛 Solución de Problemas

### Los contenedores no inician

```bash
docker-compose logs
```

### Error de conexión a base de datos

Verificar que el contenedor de DB esté corriendo:
```bash
docker ps | grep db
```

### El sitio no carga

Verificar Nginx:
```bash
sudo nginx -t
sudo systemctl status nginx
```

Verificar contenedores:
```bash
docker-compose ps
```

### Error 502 Bad Gateway

El backend probablemente no esté respondiendo:
```bash
docker-compose logs backend
docker-compose restart backend
```

### No se pueden subir imágenes

Verificar permisos del directorio uploads:
```bash
sudo chown -R 1000:1000 backend/uploads
sudo chmod -R 755 backend/uploads
```

## 📞 Soporte

Para más ayuda, revisar los logs detallados:
```bash
docker-compose logs -f --tail=100
```

## ✅ Checklist Post-Instalación

- [ ] Sitio accesible vía HTTPS
- [ ] Certificado SSL válido
- [ ] Usuario admin creado
- [ ] Formulario de contacto envía emails
- [ ] Se pueden subir imágenes
- [ ] Panel de admin funcional
- [ ] Proyectos se pueden crear/editar/eliminar
- [ ] Noticias se pueden crear/editar/eliminar
- [ ] Mensajes de contacto se reciben
- [ ] Backup automático configurado (opcional)

¡Felicidades! Tu sitio está desplegado y funcionando. 🎉

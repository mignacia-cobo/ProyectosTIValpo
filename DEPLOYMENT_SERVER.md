# 🚀 Guía de Despliegue en Servidor

## 📋 Información del Servidor

- **IP Pública**: 64.176.16.195
- **Dominio**: proyectostivalpo.com
- **Usuario**: root (o usuario con permisos sudo)

## 🔐 Paso 1: Conectarse al Servidor

### Desde Windows PowerShell:

```powershell
# Opción A: Si tienes SSH instalado en Windows
ssh root@64.176.16.195

# Opción B: Usar PuTTY (descargar de https://www.putty.org/)
# Host: 64.176.16.195
# Port: 22
# Connection Type: SSH
```

Contraseña: `J4c#[Ga2.D5oTxMt`

## 📦 Paso 2: Subir el Proyecto al Servidor

### Opción A: Usar Git (RECOMENDADO)

```bash
# En el servidor
cd /var/www
sudo git clone https://github.com/mignacia-cobo/ProyectosTIValpo.git proyectostivalpo
cd proyectostivalpo
```

### Opción B: Usar SCP desde tu PC (PowerShell)

```powershell
# Desde tu PC Windows, en la carpeta del proyecto
scp -r C:\Users\Maria\Documents\GitHub\RAOP_V2_DEV\ProyectosTIValpo root@64.176.16.195:/var/www/proyectostivalpo
```

### Opción C: Usar WinSCP (Interfaz Gráfica)

1. Descargar WinSCP: https://winscp.net/
2. Conectar:
   - Host: 64.176.16.195
   - Usuario: root
   - Contraseña: J4c#[Ga2.D5oTxMt
3. Subir la carpeta del proyecto a: `/var/www/proyectostivalpo`

## ⚙️ Paso 3: Ejecutar Script de Instalación Automática

```bash
# En el servidor, en la carpeta del proyecto
cd /var/www/proyectostivalpo
chmod +x deploy.sh
bash deploy.sh
```

Este script instalará:
- ✅ Docker y Docker Compose
- ✅ Nginx
- ✅ Certbot (SSL)
- ✅ Configuración del firewall
- ✅ Variables de entorno

## 🔧 Paso 4: Configurar Variables de Entorno

```bash
# Editar archivo .env
nano /var/www/proyectostivalpo/.env
```

**Importante**: Configura estas variables:

```env
# Contraseña para Gmail (crear en https://myaccount.google.com/apppasswords)
SMTP_PASS=tu_contraseña_de_aplicacion_de_16_caracteres

# Verificar estas están generadas (el script las crea automáticamente)
DB_PASSWORD=generada_automaticamente
JWT_SECRET=generado_automaticamente
```

Para crear contraseña de aplicación de Gmail:
1. Ve a: https://myaccount.google.com/apppasswords
2. Nombre: "ProyectosTI Server"
3. Copia la contraseña de 16 caracteres
4. Pégala en SMTP_PASS

Guardar: `Ctrl + O`, Enter, `Ctrl + X`

## 🌐 Paso 5: Configurar DNS del Dominio

En tu proveedor de dominio (donde compraste proyectostivalpo.com), crea estos registros:

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | @ | 64.176.16.195 | 3600 |
| A | www | 64.176.16.195 | 3600 |

**Tiempo de propagación**: 1-24 horas (usualmente 1-2 horas)

Para verificar que el DNS esté propagado:
```bash
# Desde tu PC
nslookup proyectostivalpo.com
# Debe mostrar: 64.176.16.195
```

## 🐳 Paso 6: Iniciar los Contenedores Docker

```bash
# En el servidor
cd /var/www/proyectostivalpo

# Crear archivo .env si no existe (el script deploy.sh lo crea)
# Asegúrate de que existe y tiene los valores correctos

# Iniciar todos los servicios
docker compose up -d

# Ver el estado de los contenedores
docker compose ps

# Ver los logs si hay algún problema
docker compose logs -f
```

## 👤 Paso 7: Crear Usuario Administrador

```bash
# Ejecutar el script dentro del contenedor backend
docker compose exec backend node src/scripts/createAdmin.js

# Ingresa los datos:
# Nombre completo: Tu Nombre
# Email: tu@email.com
# Contraseña: (mínimo 6 caracteres)
```

## 🔒 Paso 8: Obtener Certificado SSL (HTTPS)

**⚠️ IMPORTANTE**: Solo ejecutar DESPUÉS de que el DNS esté propagado

```bash
# Obtener certificado SSL gratuito de Let's Encrypt
sudo certbot --nginx -d proyectostivalpo.com -d www.proyectostivalpo.com

# Seguir las instrucciones:
# 1. Ingresa tu email: ma.cobo@profesor.duoc.cl
# 2. Acepta los términos: Y
# 3. ¿Compartir email? N (opcional)
# 4. ¿Redirigir HTTP a HTTPS? 2 (Sí, redirigir)
```

El certificado se renovará automáticamente cada 90 días.

## ✅ Paso 9: Verificar que Todo Funciona

### Verificar servicios:
```bash
# Estado de Docker
docker compose ps

# Estado de Nginx
sudo systemctl status nginx

# Logs del backend
docker compose logs backend

# Logs del frontend
docker compose logs frontend
```

### Acceder a la aplicación:
- **Sitio público**: https://proyectostivalpo.com
- **Panel admin**: https://proyectostivalpo.com/admin/login
- **API**: https://proyectostivalpo.com/api/health

## 🔄 Comandos Útiles para Mantenimiento

```bash
# Ver logs en tiempo real
docker compose logs -f

# Reiniciar todos los servicios
docker compose restart

# Detener todos los servicios
docker compose down

# Reiniciar solo el backend
docker compose restart backend

# Reiniciar solo el frontend
docker compose restart frontend

# Ver uso de recursos
docker stats

# Entrar al contenedor backend
docker compose exec backend sh

# Entrar a la base de datos
docker compose exec db psql -U postgres -d proyectosti

# Backup de la base de datos
docker compose exec db pg_dump -U postgres proyectosti > backup_$(date +%Y%m%d).sql

# Restaurar backup
cat backup_20231024.sql | docker compose exec -T db psql -U postgres proyectosti
```

## 🛠️ Solución de Problemas

### Si el sitio no carga:

```bash
# 1. Verificar que Nginx esté corriendo
sudo systemctl status nginx

# 2. Verificar configuración de Nginx
sudo nginx -t

# 3. Ver logs de Nginx
sudo tail -f /var/log/nginx/error.log

# 4. Verificar que Docker esté corriendo
docker compose ps

# 5. Ver logs de los contenedores
docker compose logs
```

### Si no se puede conectar a la base de datos:

```bash
# Verificar que el contenedor de DB esté corriendo
docker compose ps db

# Ver logs de la base de datos
docker compose logs db

# Reiniciar el contenedor de DB
docker compose restart db
```

### Si hay problemas con permisos de archivos:

```bash
# Dar permisos al directorio de uploads
sudo chown -R 1000:1000 /var/www/proyectostivalpo/backend/uploads
sudo chmod -R 755 /var/www/proyectostivalpo/backend/uploads
```

## 🔐 Seguridad Adicional

### Cambiar el puerto SSH (opcional pero recomendado):

```bash
sudo nano /etc/ssh/sshd_config
# Cambiar: Port 22
# Por: Port 2222 (o cualquier puerto > 1024)
sudo systemctl restart sshd

# Actualizar firewall
sudo ufw allow 2222/tcp
```

### Configurar firewall adicional:

```bash
# Permitir solo los puertos necesarios
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 22/tcp    # SSH (o 2222 si lo cambiaste)
sudo ufw enable
```

### Actualizar el sistema regularmente:

```bash
# Crear script de actualización automática
sudo crontab -e

# Agregar (ejecuta actualizaciones cada domingo a las 3 AM):
0 3 * * 0 apt-get update && apt-get upgrade -y && docker image prune -f
```

## 📊 Monitoreo

### Ver uso de recursos:

```bash
# CPU y memoria de contenedores
docker stats

# Espacio en disco
df -h

# Logs del sistema
sudo journalctl -f
```

## 🔄 Actualizar la Aplicación

Cuando hagas cambios en el código:

```bash
cd /var/www/proyectostivalpo

# Si usas Git
git pull origin main

# Reconstruir y reiniciar contenedores
docker compose down
docker compose up -d --build

# Ver logs para verificar
docker compose logs -f
```

## 📞 Contacto de Soporte

- **Email**: ma.cobo@profesor.duoc.cl
- **Repositorio**: https://github.com/mignacia-cobo/ProyectosTIValpo

## ✅ Checklist Final

- [ ] Servidor accesible vía SSH
- [ ] Proyecto subido al servidor
- [ ] Docker y Docker Compose instalados
- [ ] Nginx instalado y configurado
- [ ] Variables de entorno configuradas (.env)
- [ ] DNS configurado y propagado
- [ ] Contenedores Docker iniciados
- [ ] Usuario administrador creado
- [ ] Certificado SSL instalado
- [ ] Sitio accesible en https://proyectostivalpo.com
- [ ] Panel admin accesible y funcionando
- [ ] Formulario de contacto funcionando
- [ ] Subida de imágenes funcionando

# 🌐 Configuración de Múltiples Dominios

## 📋 Estructura de Proyectos

### Portal Principal - **proyectostivalpo.com**
- **Ubicación**: `/var/www/proyectostivalpo/`
- **Puertos**:
  - Frontend: `3000`
  - Backend API: `5000`
  - Base de datos: `5432`
- **Repositorio**: ProyectosTIValpo (este proyecto)

### Sistema de Conciertos - **conciertos.proyectostivalpo.com**
- **Ubicación**: `/var/www/conciertos/`
- **Puertos**:
  - Frontend: `3001`
  - Backend API: `5001`
  - Base de datos: `5433`
- **Repositorio**: (tu otro repositorio de conciertos)

---

## 🔧 Configuración en el Servidor

### 1. Copiar configuración de Nginx

```bash
# Conectarse al servidor
ssh linuxuser@64.176.16.195

# Copiar el archivo de configuración
sudo nano /etc/nginx/sites-available/proyectostivalpo.conf

# Pegar el contenido de nginx-multidominio.conf

# Habilitar el sitio
sudo ln -sf /etc/nginx/sites-available/proyectostivalpo.conf /etc/nginx/sites-enabled/

# Remover configuración por defecto si existe
sudo rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

---

## 🗂️ Organizar Proyectos en el Servidor

### Portal Principal (ya está configurado)

```bash
# Ya está en /var/www/proyectostivalpo/
# Usa puertos 3000 (frontend) y 5000 (backend)
cd /var/www/proyectostivalpo
docker compose ps  # Verificar que corre en puerto 3000
```

### Sistema de Conciertos (mover/configurar)

```bash
# Crear directorio
sudo mkdir -p /var/www/conciertos
cd /var/www/conciertos

# Clonar tu repositorio de conciertos
git clone https://github.com/tu-usuario/tu-repo-conciertos.git .

# Editar docker-compose.yml para cambiar puertos
nano docker-compose.yml
```

**Cambios necesarios en docker-compose.yml de conciertos:**

```yaml
services:
  db:
    ports:
      - "5433:5432"  # Cambiar de 5432 a 5433
  
  backend:
    ports:
      - "5001:5000"  # Cambiar de 5000 a 5001
  
  frontend:
    ports:
      - "3001:80"    # Cambiar de 3000 a 3001
```

```bash
# Iniciar servicios de conciertos
docker compose up -d
```

---

## 🌐 Configuración DNS

En tu proveedor de dominio (donde compraste proyectostivalpo.com):

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | @ | 64.176.16.195 | 3600 |
| A | www | 64.176.16.195 | 3600 |
| A | conciertos | 64.176.16.195 | 3600 |

**O alternativamente:**

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | @ | 64.176.16.195 | 3600 |
| CNAME | www | proyectostivalpo.com | 3600 |
| CNAME | conciertos | proyectostivalpo.com | 3600 |

---

## 🔒 Obtener Certificados SSL

### Después de que el DNS esté propagado:

```bash
# SSL para el dominio principal
sudo certbot --nginx -d proyectostivalpo.com -d www.proyectostivalpo.com

# SSL para el subdominio de conciertos
sudo certbot --nginx -d conciertos.proyectostivalpo.com
```

Certbot actualizará automáticamente la configuración de Nginx con HTTPS.

---

## ✅ Verificar que Todo Funciona

### Portal Principal
```bash
# HTTP
curl http://proyectostivalpo.com
curl http://www.proyectostivalpo.com

# Después de SSL
curl https://proyectostivalpo.com
```

### Sistema de Conciertos
```bash
# HTTP
curl http://conciertos.proyectostivalpo.com

# Después de SSL
curl https://conciertos.proyectostivalpo.com
```

### Ver puertos en uso
```bash
sudo netstat -tulpn | grep LISTEN
# Deberías ver:
# 3000 - Frontend portal
# 3001 - Frontend conciertos
# 5000 - Backend portal
# 5001 - Backend conciertos
# 5432 - DB portal
# 5433 - DB conciertos
```

---

## 📊 Resumen de Puertos

| Servicio | Puerto | Proyecto |
|----------|--------|----------|
| Frontend Portal | 3000 | proyectostivalpo.com |
| Backend Portal | 5000 | proyectostivalpo.com |
| DB Portal | 5432 | proyectostivalpo.com |
| Frontend Conciertos | 3001 | conciertos.proyectostivalpo.com |
| Backend Conciertos | 5001 | conciertos.proyectostivalpo.com |
| DB Conciertos | 5433 | conciertos.proyectostivalpo.com |
| Nginx HTTP | 80 | Proxy para ambos |
| Nginx HTTPS | 443 | Proxy para ambos |

---

## 🔄 Actualizar CI/CD del Proyecto de Conciertos

Si el proyecto de conciertos también tiene CI/CD, necesitas:

1. Actualizar `SERVER_PATH` en GitHub Secrets a `/var/www/conciertos`
2. Actualizar puertos en docker-compose.yml (3001, 5001, 5433)
3. Actualizar la URL base del frontend para apuntar al puerto 5001

---

## 🆘 Solución de Problemas

### Verificar que Nginx está sirviendo el dominio correcto:
```bash
# Ver qué sitios están habilitados
ls -la /etc/nginx/sites-enabled/

# Ver logs de Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Ver qué está corriendo en cada puerto:
```bash
# Portal principal
curl http://localhost:3000
curl http://localhost:5000/api/health

# Conciertos
curl http://localhost:3001
curl http://localhost:5001/api/health
```

### Reiniciar servicios:
```bash
# Portal
cd /var/www/proyectostivalpo
docker compose restart

# Conciertos
cd /var/www/conciertos
docker compose restart

# Nginx
sudo systemctl restart nginx
```

---

## 📞 Contacto

- Email: ma.cobo@profesor.duoc.cl
- Servidor: 64.176.16.195
- Usuario: linuxuser

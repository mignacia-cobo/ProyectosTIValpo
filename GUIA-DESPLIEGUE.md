# 🚀 Guía de Despliegue y Actualización - ProyectosTI

## 📋 Flujo actual de despliegue

### 1️⃣ Cuando haces cambios y push a GitHub:

```
Tu código → GitHub → GitHub Actions → Docker Hub → (⚠️ AQUÍ SE DETIENE)
```

**GitHub Actions automáticamente:**
- ✅ Compila el frontend
- ✅ Construye la imagen Docker
- ✅ Sube la imagen a Docker Hub (micobo/proyectosti-frontend:latest)
- ✅ Hace lo mismo con el backend

**❌ Lo que NO hace automáticamente:**
- Descargar las nuevas imágenes en el servidor
- Reiniciar los contenedores con las nuevas imágenes
- Aplicar cambios en la base de datos
- Actualizar variables de entorno

---

## 🔄 Cómo actualizar el servidor después de un push

### Opción A: Script automático (Recomendado) 🚀

1. **Copia el script al servidor** (solo una vez):
```bash
scp update-production.sh linuxuser@64.176.16.195:/home/linuxuser/
```

2. **Cada vez que hagas cambios, ejecuta**:
```bash
ssh linuxuser@64.176.16.195 "cd /home/linuxuser && chmod +x update-production.sh && ./update-production.sh"
```

### Opción B: Comandos manuales

```bash
# 1. Conectarse al servidor
ssh linuxuser@64.176.16.195

# 2. Ir al directorio del proyecto
cd /var/www/proyectostivalpo

# 3. Descargar las últimas imágenes
docker-compose pull

# 4. Reiniciar los servicios
docker-compose down
docker-compose up -d

# 5. Verificar que todo funciona
docker-compose ps
docker logs proyectosti_backend --tail 20
```

---

## 📊 Tipos de cambios y qué hacer

### 🎨 Cambios en el FRONTEND (React/Vite)

**Qué cambios aplican:**
- Diseño, estilos (CSS)
- Componentes React
- Lógica del cliente
- Assets (imágenes, íconos)

**Pasos:**
1. Hacer cambios en tu código local
2. Commit y push a GitHub
3. **Esperar 5-10 minutos** a que GitHub Actions termine
4. Ejecutar en el servidor:
```bash
ssh linuxuser@64.176.16.195
cd /var/www/proyectostivalpo
docker-compose pull frontend
docker-compose up -d frontend
```

### 🔧 Cambios en el BACKEND (Node.js/Express)

**Qué cambios aplican:**
- Controladores (lógica de negocio)
- Rutas de API
- Middlewares
- Configuración de Express

**Pasos:**
1. Hacer cambios en tu código local
2. Commit y push a GitHub
3. **Esperar 5-10 minutos** a que GitHub Actions termine
4. Ejecutar en el servidor:
```bash
ssh linuxuser@64.176.16.195
cd /var/www/proyectostivalpo
docker-compose pull backend
docker-compose restart backend
```

### 🗄️ Cambios en la BASE DE DATOS (PostgreSQL)

**Qué cambios aplican:**
- Nuevas tablas
- Nuevas columnas
- Modificar tipos de datos
- Agregar índices

**⚠️ IMPORTANTE: Los cambios en BD NO son automáticos**

**Pasos:**
1. Crear un script SQL con los cambios (ejemplo: `migration-001.sql`)
2. Copiar el script al servidor:
```bash
scp migration-001.sql linuxuser@64.176.16.195:/tmp/
```

3. Aplicar los cambios:
```bash
ssh linuxuser@64.176.16.195
cat /tmp/migration-001.sql | docker exec -i proyectosti_db psql -U postgres readme_to_recover
```

**Ejemplo de script de migración:**
```sql
-- migration-001.sql
-- Agregar campo 'featured' a proyectos

ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Marcar algunos proyectos como destacados
UPDATE projects SET featured = true WHERE id IN (1, 2);

-- Verificar
SELECT id, name, featured FROM projects;
```

### ⚙️ Cambios en VARIABLES DE ENTORNO

**Qué variables existen:**
- DB_NAME, DB_USER, DB_PASSWORD
- JWT_SECRET
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
- ADMIN_EMAIL

**Pasos:**
1. Editar el archivo `.env` en el servidor:
```bash
ssh linuxuser@64.176.16.195
cd /var/www/proyectostivalpo
nano .env
```

2. Modificar las variables necesarias

3. Reiniciar el backend (y frontend si usa variables):
```bash
docker-compose restart backend
```

---

## 🔐 Configuración del archivo .env

**Ubicación:** `/var/www/proyectostivalpo/.env`

```env
# Docker
DOCKER_USERNAME=micobo

# Base de datos
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=readme_to_recover

# Backend
JWT_SECRET=1/vyS0mFDvgnLf/EO+9RWC6IVG
NODE_ENV=production

# SMTP (Correo)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contacto@proyectostivalpo.com
SMTP_PASS=Proyectos.2025
ADMIN_EMAIL=contacto@proyectostivalpo.com
```

---

## 🎯 Flujo completo de desarrollo a producción

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DESARROLLO LOCAL                                         │
│    - Hacer cambios en el código                             │
│    - Probar localmente                                      │
│    - Commit                                                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. GITHUB                                                   │
│    - Push a la rama main                                    │
│    - GitHub Actions se activa automáticamente               │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. GITHUB ACTIONS (Automático)                              │
│    - Construye el proyecto                                  │
│    - Crea imagen Docker                                     │
│    - Sube a Docker Hub                                      │
│    ⏱️  Duración: 5-10 minutos                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. ACTUALIZAR SERVIDOR (⚠️ MANUAL)                         │
│    - ssh al servidor                                        │
│    - docker-compose pull                                    │
│    - docker-compose up -d                                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. MIGRACIONES DB (⚠️ MANUAL, si aplica)                   │
│    - Copiar script SQL al servidor                          │
│    - Ejecutar en la base de datos                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. VERIFICAR                                                │
│    - Abrir https://proyectostivalpo.com                     │
│    - Probar funcionalidades                                 │
│    - Revisar logs si hay problemas                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Comandos útiles para verificar el estado

```bash
# Ver estado de los contenedores
docker ps

# Ver logs del backend
docker logs proyectosti_backend --tail 50

# Ver logs del frontend
docker logs proyectosti_frontend --tail 50

# Ver logs de la base de datos
docker logs proyectosti_db --tail 50

# Reiniciar un servicio específico
docker-compose restart backend

# Ver qué imágenes están en uso
docker images | grep proyectosti

# Ver el contenido del .env (sin contraseñas)
grep -v "PASS\|SECRET" /var/www/proyectostivalpo/.env

# Verificar conectividad de la API
curl -s https://proyectostivalpo.com/api/projects | jq '.[:2]'
```

---

## 🚨 Solución de problemas comunes

### Problema: Los cambios no se ven después de actualizar

**Causa:** Navegador tiene cache del frontend

**Solución:**
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
O limpiar cache del navegador
```

### Problema: Error 502 Bad Gateway

**Causa:** Backend no está corriendo

**Solución:**
```bash
ssh linuxuser@64.176.16.195
cd /var/www/proyectostivalpo
docker-compose restart backend
docker logs proyectosti_backend --tail 30
```

### Problema: Cambios en la base de datos no aplicados

**Causa:** Los cambios en BD requieren aplicación manual

**Solución:**
- Crear script SQL
- Copiarlo al servidor
- Ejecutarlo manualmente (ver sección de Base de Datos)

---

## 📦 Backup antes de actualizar

**Siempre crear backup antes de cambios importantes:**

```bash
# Backup de base de datos
ssh linuxuser@64.176.16.195
docker exec proyectosti_db pg_dump -U postgres readme_to_recover > /tmp/backup_$(date +%Y%m%d_%H%M%S).sql

# Backup del .env
cp /var/www/proyectostivalpo/.env /var/www/proyectostivalpo/.env.backup.$(date +%Y%m%d_%H%M%S)
```

---

## ✅ Checklist de actualización

- [ ] Hacer cambios en el código local
- [ ] Probar localmente
- [ ] Commit y push a GitHub
- [ ] Esperar a que GitHub Actions termine (verificar en tab Actions de GitHub)
- [ ] Si hay cambios en BD: preparar script de migración
- [ ] Hacer backup de producción
- [ ] Ejecutar update-production.sh o comandos manuales
- [ ] Aplicar migraciones de BD si las hay
- [ ] Verificar que el sitio funciona
- [ ] Revisar logs por errores
- [ ] Probar funcionalidades clave (login, formularios, etc.)

---

## 🎓 Próximos pasos para automatizar más

Para hacer el proceso completamente automático, podrías:

1. **Configurar webhook** para que el servidor descargue automáticamente
2. **Usar herramientas CI/CD** como:
   - GitHub Actions con deploy automático
   - Portainer para gestión visual
   - Watchtower para actualización automática de contenedores

3. **Implementar migraciones automáticas** con herramientas como:
   - Prisma Migrate
   - TypeORM Migrations
   - Knex.js Migrations

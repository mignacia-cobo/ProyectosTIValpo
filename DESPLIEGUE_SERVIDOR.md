# 🚀 Instrucciones de Despliegue - Sistema de Respuestas

## 📋 Cambios Implementados

### Funcionalidades Nuevas:
1. ✅ **Responder mensajes por email** desde el panel de administrador
2. ✅ **Notas internas** para registrar conversaciones
3. ✅ **Botón para abrir Gmail** y ver respuestas del usuario
4. ✅ **Indicador de última revisión** de mensajes
5. ✅ **Sistema de tracking** de mensajes respondidos

---

## 🔧 Cambios en el Servidor (Producción)

### 1️⃣ Actualizar Variables de Entorno

Conectarse al servidor y editar el archivo `.env` del backend:

```bash
ssh root@64.176.16.195
cd /ruta/del/proyecto/backend
nano .env
```

**Agregar/Actualizar estas líneas:**

```env
# Configuración SMTP (Gmail con contraseña de aplicación)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contacto@proyectostivalpo.com
SMTP_PASS=yycfzzuvnuttqhbt
ADMIN_EMAIL=ma.cobo@profesor.duoc.cl
```

**IMPORTANTE**: La contraseña `yycfzzuvnuttqhbt` es la contraseña de aplicación de Google Workspace (sin espacios).

---

### 2️⃣ Aplicar Cambios en la Base de Datos

Ejecutar estos scripts SQL en el servidor:

#### Script 1: Agregar campos de respuesta

```bash
# Conectarse al contenedor de PostgreSQL
docker exec -i nombre-contenedor-postgres psql -U postgres -d proyectosti << 'EOF'

-- Agregar columnas para respuestas
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS replied BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS reply_message TEXT;

-- Verificar cambios
\d contact_messages;
EOF
```

#### Script 2: Agregar sistema de notas

```bash
docker exec -i nombre-contenedor-postgres psql -U postgres -d proyectosti << 'EOF'

-- Agregar columnas para notas y seguimiento
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS last_checked_by VARCHAR(255);

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_contact_last_checked ON contact_messages(last_checked_at);

-- Verificar cambios
\d contact_messages;
EOF
```

**O ejecutar todo junto:**

```bash
# Opción: Ejecutar scripts desde archivos
docker exec -i nombre-contenedor-postgres psql -U postgres -d proyectosti < add-reply-fields.sql
docker exec -i nombre-contenedor-postgres psql -U postgres -d proyectosti < add-notes-system.sql
```

---

### 3️⃣ Reconstruir y Desplegar Contenedores

```bash
# Ir al directorio del proyecto
cd /ruta/del/proyecto

# Pull de los últimos cambios desde GitHub
git pull origin main

# Reconstruir imágenes Docker
docker-compose build

# Reiniciar servicios
docker-compose down
docker-compose up -d

# Verificar que todo esté corriendo
docker-compose ps
docker-compose logs -f backend
```

---

## ✅ Verificación Post-Despliegue

### Checklist:

- [ ] Variables de entorno actualizadas en `.env`
- [ ] Scripts SQL ejecutados correctamente
- [ ] Columnas agregadas a la tabla `contact_messages`
- [ ] Backend reiniciado sin errores
- [ ] Frontend accesible desde el navegador
- [ ] Puedes acceder al panel de administrador
- [ ] Puedes ver mensajes de contacto
- [ ] Puedes responder un mensaje de prueba
- [ ] El correo se envía correctamente
- [ ] Puedes agregar notas internas
- [ ] El botón "Revisar en Gmail" funciona

---

## 🧪 Pruebas a Realizar

### 1. Probar envío de respuesta:
1. Ir a **Admin** → **Mensajes**
2. Seleccionar un mensaje
3. Hacer clic en **"Responder por correo"**
4. Escribir respuesta
5. Enviar
6. Verificar que llegue al correo del usuario

### 2. Probar notas internas:
1. En un mensaje, hacer clic en **"Agregar notas"**
2. Escribir notas
3. Guardar
4. Verificar que se guarden correctamente
5. Verificar que se muestre "Última revisión"

### 3. Probar botón Gmail:
1. Hacer clic en **"Revisar en Gmail"**
2. Verificar que abra Gmail en nueva pestaña
3. Verificar que filtre por el email del remitente

---

## 📝 Estructura de Tablas Actualizada

### Tabla `contact_messages`:

```sql
Column            | Type                        | Description
------------------+-----------------------------+----------------------------------
id                | integer                     | ID único
name              | character varying(255)      | Nombre del remitente
email             | character varying(255)      | Email del remitente
message           | text                        | Mensaje original
read              | boolean                     | Leído/No leído
created_at        | timestamp                   | Fecha de creación
replied           | boolean                     | ¿Se respondió?
replied_at        | timestamp                   | Fecha de respuesta
reply_message     | text                        | Mensaje de respuesta enviado
notes             | text                        | Notas internas del admin
last_checked_at   | timestamp                   | Última vez que se revisó
last_checked_by   | character varying(255)      | Quién lo revisó
```

---

## 🔒 Seguridad

### Variables Sensibles:
- **NO subir** el archivo `.env` a GitHub
- La contraseña `yycfzzuvnuttqhbt` es una contraseña de aplicación de Google
- Mantener el archivo `.env` solo en el servidor

### Archivos a NO subir (ya están en `.gitignore`):
```
.env
*.log
node_modules/
```

---

## 📧 Configuración de Gmail

### Contraseña de Aplicación:
- **Usuario**: `contacto@proyectostivalpo.com`
- **Contraseña de aplicación**: `yycfzzuvnuttqhbt` (sin espacios)
- **Tipo**: Google Workspace

### Si la contraseña expira:
1. Ir a: https://myaccount.google.com/
2. Seguridad → Contraseñas de aplicaciones
3. Generar nueva contraseña
4. Actualizar en el `.env` del servidor

---

## 🐛 Solución de Problemas

### Error: "Error al enviar correo"
**Solución**: Verificar que la contraseña de aplicación esté correcta en `.env`

### Error: "Column does not exist"
**Solución**: Ejecutar los scripts SQL nuevamente

### Los correos no llegan
**Solución**: 
1. Revisar carpeta de spam
2. Verificar variable `SMTP_USER` en `.env`
3. Revisar logs del backend: `docker logs nombre-contenedor-backend`

### No se guardan las notas
**Solución**: Verificar que la columna `notes` exista en la tabla

---

## 📞 Contacto

Para soporte técnico: ma.cobo@profesor.duoc.cl

---

**Última actualización**: Octubre 26, 2025  
**Versión**: 2.0

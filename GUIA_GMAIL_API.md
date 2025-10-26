# Guía de Configuración Gmail API con OAuth2

## 📋 Resumen
Esta guía te ayudará a configurar la integración con Gmail API para capturar automáticamente las respuestas de los usuarios a los correos enviados desde el sistema.

---

## 🔧 Paso 1: Crear Proyecto en Google Cloud Console

### 1.1 Acceder a Google Cloud Console
1. Ve a: https://console.cloud.google.com/
2. Inicia sesión con tu cuenta: **contacto@proyectostivalpo.com**

### 1.2 Crear Nuevo Proyecto
1. En la parte superior, haz clic en el selector de proyectos
2. Haz clic en **"Nuevo Proyecto"**
3. Nombre del proyecto: **ProyectosTI Gmail Integration**
4. Haz clic en **"Crear"**
5. Espera unos segundos a que se cree el proyecto
6. Asegúrate de que el proyecto esté seleccionado

---

## 🔌 Paso 2: Habilitar Gmail API

### 2.1 Acceder a APIs y Servicios
1. En el menú lateral (☰), ve a: **APIs y servicios** → **Biblioteca**
2. O accede directamente: https://console.cloud.google.com/apis/library

### 2.2 Buscar y Habilitar Gmail API
1. En el buscador, escribe: **Gmail API**
2. Haz clic en **"Gmail API"**
3. Haz clic en el botón **"Habilitar"**
4. Espera a que se habilite (puede tardar unos segundos)

---

## 🔐 Paso 3: Configurar Pantalla de Consentimiento OAuth

### 3.1 Acceder a Configuración OAuth
1. Ve a: **APIs y servicios** → **Pantalla de consentimiento de OAuth**
2. O accede directamente: https://console.cloud.google.com/apis/credentials/consent

### 3.2 Configurar Tipo de Usuario
1. Selecciona: **Externo** (a menos que tengas Google Workspace con acceso interno)
2. Haz clic en **"Crear"**

### 3.3 Información de la Aplicación
Completa el formulario con:

- **Nombre de la aplicación**: `ProyectosTI Admin Panel`
- **Correo del usuario**: `contacto@proyectostivalpo.com`
- **Logo de la aplicación**: (opcional, puedes omitir)
- **Dominios autorizados**: `proyectostivalpo.com`
- **Correo de contacto del desarrollador**: `contacto@proyectostivalpo.com`

Haz clic en **"Guardar y continuar"**

### 3.4 Ámbitos (Scopes)
1. Haz clic en **"Agregar o quitar ámbitos"**
2. Busca y selecciona estos ámbitos:
   - `https://www.googleapis.com/auth/gmail.readonly` - Leer emails
   - `https://www.googleapis.com/auth/gmail.send` - Enviar emails (ya lo tienes configurado)
   - `https://www.googleapis.com/auth/gmail.modify` - Modificar etiquetas

3. Haz clic en **"Actualizar"**
4. Haz clic en **"Guardar y continuar"**

### 3.5 Usuarios de Prueba
1. Haz clic en **"Agregar usuarios"**
2. Agrega: `contacto@proyectostivalpo.com`
3. Haz clic en **"Agregar"**
4. Haz clic en **"Guardar y continuar"**

### 3.6 Resumen
1. Revisa la información
2. Haz clic en **"Volver al panel"**

---

## 🔑 Paso 4: Crear Credenciales OAuth2

### 4.1 Crear ID de Cliente OAuth
1. Ve a: **APIs y servicios** → **Credenciales**
2. O accede directamente: https://console.cloud.google.com/apis/credentials
3. Haz clic en **"+ Crear credenciales"**
4. Selecciona: **ID de cliente de OAuth**

### 4.2 Configurar ID de Cliente
1. **Tipo de aplicación**: Selecciona **"Aplicación de escritorio"**
2. **Nombre**: `ProyectosTI Backend OAuth Client`
3. Haz clic en **"Crear"**

### 4.3 Descargar Credenciales
1. Aparecerá un modal con tu **ID de cliente** y **Secreto de cliente**
2. Haz clic en **"Descargar JSON"**
3. **IMPORTANTE**: Guarda este archivo como `credentials.json` en la carpeta `backend/config/`

El archivo descargado tendrá esta estructura:
```json
{
  "installed": {
    "client_id": "TU_CLIENT_ID.apps.googleusercontent.com",
    "project_id": "tu-proyecto",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "TU_CLIENT_SECRET",
    "redirect_uris": ["http://localhost"]
  }
}
```

---

## 📦 Paso 5: Instalar Dependencias

Ejecuta en la carpeta `backend`:

```powershell
cd backend
npm install googleapis nodemailer-gmail-oauth2
```

---

## 🗄️ Paso 6: Crear Tabla en Base de Datos

El script SQL ya está creado en: `add-gmail-replies-table.sql`

Ejecuta:
```powershell
Get-Content "add-gmail-replies-table.sql" | docker exec -i proyectosti_db psql -U postgres -d proyectosti
```

---

## ⚙️ Paso 7: Configurar Variables de Entorno

Agrega al archivo `backend/.env`:

```env
# Gmail API OAuth2
GMAIL_CLIENT_ID=tu_client_id_aqui
GMAIL_CLIENT_SECRET=tu_client_secret_aqui
GMAIL_REDIRECT_URI=http://localhost:5000/auth/gmail/callback
```

---

## 🔓 Paso 8: Autorizar la Aplicación (Primera Vez)

La primera vez que inicies el backend, necesitarás autorizar la aplicación:

1. El servidor mostrará en consola una URL
2. Copia la URL y ábrela en tu navegador
3. Inicia sesión con `contacto@proyectostivalpo.com`
4. Acepta los permisos solicitados
5. Copia el código de autorización que aparece
6. Pégalo en la terminal del backend
7. El sistema guardará automáticamente el token en `backend/config/token.json`

**NOTA**: Este proceso solo se hace UNA VEZ. Después, el sistema usará el token guardado.

---

## 🧪 Paso 9: Probar la Integración

### Desde el Panel de Admin:

1. Ve a **Mensajes**
2. Verás un nuevo botón: **"Sincronizar Respuestas"**
3. Haz clic para buscar nuevas respuestas desde Gmail
4. Las respuestas aparecerán debajo de cada mensaje original

### Automático:

El sistema sincronizará automáticamente cada 10 minutos.

---

## 🔍 Cómo Funciona

1. **Usuario recibe tu correo** → Enviado desde el panel
2. **Usuario responde** → La respuesta llega a `contacto@proyectostivalpo.com`
3. **Sistema sincroniza** → Busca emails nuevos usando Gmail API
4. **Asociación automática** → Encuentra respuestas por el email del remitente
5. **Guardado en BD** → Guarda la respuesta en `contact_replies`
6. **Visualización** → Muestra el hilo completo en el panel

---

## 🛡️ Seguridad y Límites

### Límites de Gmail API:
- **250 cuotas/segundo por usuario**
- **1 billón de cuotas/día por proyecto**
- Suficiente para miles de sincronizaciones diarias

### Seguridad:
- ✅ OAuth2 es más seguro que contraseñas de aplicación
- ✅ Los tokens se almacenan localmente
- ✅ Solo lectura de emails (no puede borrar ni modificar contenido)
- ✅ Acceso limitado a tu cuenta

### Archivos Sensibles (NO SUBIR A GIT):
- `backend/config/credentials.json`
- `backend/config/token.json`
- Agrégalos al `.gitignore`

---

## 🔧 Solución de Problemas

### Error: "invalid_grant"
**Solución**: El token expiró. Borra `token.json` y vuelve a autorizar.

### Error: "Access denied"
**Solución**: Verifica que el correo esté en "Usuarios de prueba" en Google Cloud Console.

### No encuentra respuestas
**Solución**: 
1. Verifica que el email del remitente coincida exactamente
2. Revisa que las respuestas estén en la bandeja de entrada (no spam)

### Error: "Daily Limit Exceeded"
**Solución**: Espera 24 horas o reduce la frecuencia de sincronización.

---

## 📝 Checklist de Implementación

- [ ] Proyecto creado en Google Cloud Console
- [ ] Gmail API habilitada
- [ ] Pantalla de consentimiento OAuth configurada
- [ ] Credenciales OAuth2 creadas
- [ ] `credentials.json` descargado y guardado en `backend/config/`
- [ ] Dependencias instaladas (`googleapis`)
- [ ] Tabla `contact_replies` creada en la base de datos
- [ ] Variables de entorno configuradas
- [ ] Primera autorización completada
- [ ] Token guardado en `token.json`
- [ ] Archivos sensibles agregados al `.gitignore`
- [ ] Sincronización manual probada
- [ ] Respuestas visibles en el panel

---

**Última actualización**: Octubre 2025  
**Soporte**: ma.cobo@profesor.duoc.cl

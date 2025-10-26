# Configuración de Gmail/Google Workspace para Respuestas Automáticas

## 🔐 Pasos para Generar Contraseña de Aplicación

Google Workspace requiere una **contraseña de aplicación** en lugar de tu contraseña normal para permitir que aplicaciones externas envíen correos.

### Paso 1: Acceder a tu Cuenta de Google
1. Ve a: https://myaccount.google.com/
2. Inicia sesión con: **contacto@proyectostivalpo.com**

### Paso 2: Habilitar Verificación en 2 Pasos
1. En el menú lateral, haz clic en **"Seguridad"**
2. Busca la sección **"Iniciar sesión en Google"**
3. Haz clic en **"Verificación en dos pasos"**
4. Si no está activada, actívala siguiendo las instrucciones
   - Te pedirá un número de teléfono
   - Recibirás un código de verificación
   - Confirma el código

### Paso 3: Generar Contraseña de Aplicación
1. Vuelve a **"Seguridad"**
2. En **"Iniciar sesión en Google"**, ahora verás **"Contraseñas de aplicaciones"**
3. Haz clic en **"Contraseñas de aplicaciones"**
4. Es posible que te pida verificar tu identidad nuevamente
5. En "Seleccionar app", elige **"Correo"**
6. En "Seleccionar dispositivo", elige **"Otro (nombre personalizado)"**
7. Escribe: **"ProyectosTI Backend"**
8. Haz clic en **"Generar"**
9. **IMPORTANTE**: Aparecerá una contraseña de 16 caracteres (ej: `abcd efgh ijkl mnop`)
10. **Copia esta contraseña** (la necesitarás para el siguiente paso)

### Paso 4: Actualizar Variables de Entorno

Abre el archivo `.env` del backend y actualiza la contraseña:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contacto@proyectostivalpo.com
SMTP_PASS=abcdefghijklmnop  # ← Pega aquí la contraseña de aplicación (sin espacios)
ADMIN_EMAIL=ma.cobo@profesor.duoc.cl
```

**NOTA**: Elimina los espacios de la contraseña cuando la pegues.

### Paso 5: Aplicar Cambios en Base de Datos

Ejecuta el script SQL para agregar las columnas necesarias:

```powershell
# Opción 1: Si tienes la BD en Docker local
docker exec -i proyectosti-db psql -U postgres -d proyectosti < add-reply-fields.sql

# Opción 2: Si usas psql directamente
psql -U postgres -d proyectosti -f add-reply-fields.sql
```

### Paso 6: Reiniciar el Backend

```powershell
# Si estás usando npm
cd backend
npm run dev

# Si estás usando Docker
docker-compose restart backend
```

---

## 📧 Cómo Usar la Funcionalidad

### Desde el Panel de Administración:

1. Ve a **Mensajes** en el panel de administrador
2. Verás todos los mensajes de contacto recibidos
3. Para responder un mensaje:
   - Haz clic en el botón **"Responder por correo"**
   - Se abrirá un modal con el mensaje original
   - Escribe tu respuesta en el área de texto
   - Puedes ver una vista previa de cómo se verá el correo
   - Haz clic en **"Enviar respuesta"**

### Características:

✅ **Envío automático**: El correo se envía automáticamente usando Gmail
✅ **Email profesional**: Incluye diseño HTML profesional con tu logo
✅ **Contexto completo**: Incluye el mensaje original del usuario
✅ **Tracking**: Marca automáticamente los mensajes como respondidos
✅ **Fecha de respuesta**: Registra cuándo se respondió cada mensaje
✅ **Vista previa**: Puedes ver cómo se verá el email antes de enviarlo

---

## 🎨 Ejemplo de Correo Enviado

El usuario recibirá un email con este formato:

```
┌─────────────────────────────────────┐
│   PROYECTOS TI VALPO (Logo)         │
└─────────────────────────────────────┘

Hola [Nombre del Usuario],

Gracias por contactarnos. A continuación, respondemos a tu mensaje:

┌─────────────────────────────────────┐
│ [Tu respuesta personalizada]        │
└─────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tu mensaje original:
[Mensaje original del usuario]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Si tienes más preguntas, no dudes en responder a este correo.

Saludos cordiales,
Equipo Proyectos TI Valpo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
© 2025 Proyectos TI Valpo
contacto@proyectostivalpo.com
```

---

## 🔍 Solución de Problemas

### Error: "Error al enviar correo de respuesta"

**Causa**: La contraseña de aplicación no es correcta o no está configurada.

**Solución**:
1. Verifica que generaste la contraseña de aplicación (Paso 3)
2. Asegúrate de copiarla sin espacios en el archivo `.env`
3. Reinicia el servidor backend

### Error: "SMTP authentication failed"

**Causa**: La verificación en 2 pasos no está activada.

**Solución**: Sigue el Paso 2 para activar la verificación en 2 pasos.

### Error: "Connection timeout"

**Causa**: El puerto 587 puede estar bloqueado.

**Solución**: 
1. Verifica que el firewall permite conexiones salientes al puerto 587
2. Prueba cambiar el puerto a 465 y `secure: true` en el código

### Los correos no llegan

**Solución**:
1. Revisa la carpeta de spam/correo no deseado
2. Verifica que `SMTP_USER` sea exactamente `contacto@proyectostivalpo.com`
3. Revisa los logs del backend para ver el error específico

---

## ✅ Checklist de Implementación

- [ ] Verificación en 2 pasos activada en Google
- [ ] Contraseña de aplicación generada
- [ ] Archivo `.env` actualizado con la contraseña
- [ ] Script SQL ejecutado en la base de datos
- [ ] Backend reiniciado
- [ ] Prueba enviando una respuesta a un mensaje de prueba
- [ ] Verificar que el correo llegó correctamente
- [ ] Verificar que el mensaje se marca como "respondido" en el panel

---

## 📝 Notas Adicionales

- **Seguridad**: Nunca compartas tu contraseña de aplicación públicamente
- **Límites**: Gmail tiene límites de envío (500 emails/día para cuentas gratuitas)
- **Logs**: Revisa los logs del backend si hay problemas
- **Backup**: Guarda la contraseña de aplicación en un lugar seguro

---

**Última actualización**: Octubre 2025
**Soporte**: ma.cobo@profesor.duoc.cl

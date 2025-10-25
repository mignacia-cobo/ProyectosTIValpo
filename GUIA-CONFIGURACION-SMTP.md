# 📧 Guía de Configuración de Correo SMTP

## ✅ Correo actualizado a: contacto@proyectostivalpo.com

## 🔧 Configuración actual aplicada:
- **SMTP_HOST**: smtp.gmail.com
- **SMTP_PORT**: 587
- **SMTP_USER**: contacto@proyectostivalpo.com
- **SMTP_PASS**: Proyectos.2025
- **ADMIN_EMAIL**: contacto@proyectostivalpo.com

## ⚠️ Problema detectado:
Gmail está rechazando la autenticación. Esto es normal por seguridad.

## 🔐 Soluciones según el proveedor de correo:

### Opción 1: Si es una cuenta de Gmail (@gmail.com)

**NO FUNCIONARÁ** con contraseña normal desde mayo de 2022. Debes:

1. **Habilitar verificación en 2 pasos** en tu cuenta Google
2. **Crear una contraseña de aplicación**:
   - Ve a: https://myaccount.google.com/apppasswords
   - Genera una contraseña específica para "Correo"
   - Usa esa contraseña de 16 caracteres en lugar de "Proyectos.2025"

### Opción 2: Si es un correo de dominio propio (@proyectostivalpo.com)

Necesitas configurar el servidor SMTP de tu proveedor:

#### Para cPanel / Hosting compartido:
```
SMTP_HOST=mail.proyectostivalpo.com
SMTP_PORT=587
SMTP_USER=contacto@proyectostivalpo.com
SMTP_PASS=Proyectos.2025
```

#### Para Office 365 / Outlook:
```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=contacto@proyectostivalpo.com
SMTP_PASS=Proyectos.2025
```

#### Para otros proveedores:
Consulta la documentación de tu proveedor de hosting/correo para obtener:
- Servidor SMTP (smtp.tuproveedor.com)
- Puerto (usualmente 587 o 465)

## 🛠️ Cómo actualizar la configuración:

### Método 1: Usando el script (recomendado)

1. Edita el script `update-smtp-config.sh` con los valores correctos:
```bash
# Para Gmail con contraseña de aplicación:
sed -i 's/^SMTP_PASS=.*/SMTP_PASS=tu_contraseña_app_16_chars/' .env

# Para otro proveedor:
sed -i 's/^SMTP_HOST=.*/SMTP_HOST=mail.tuproveedor.com/' .env
sed -i 's/^SMTP_PORT=.*/SMTP_PORT=587/' .env
```

2. Ejecuta en el servidor:
```bash
ssh linuxuser@64.176.16.195
cd /var/www/proyectostivalpo
chmod +x /tmp/update-smtp-config.sh
/tmp/update-smtp-config.sh
```

### Método 2: Manual

1. Conéctate al servidor:
```bash
ssh linuxuser@64.176.16.195
```

2. Edita el archivo .env:
```bash
cd /var/www/proyectostivalpo
nano .env
```

3. Modifica las líneas de SMTP:
```
SMTP_HOST=tu_servidor_smtp
SMTP_PORT=587
SMTP_USER=contacto@proyectostivalpo.com
SMTP_PASS=tu_contraseña_correcta
```

4. Reinicia el backend:
```bash
docker-compose restart backend
```

## ✅ Verificar que funciona:

1. Prueba enviando un mensaje desde el formulario de contacto en:
   https://proyectostivalpo.com

2. Verifica los logs del backend:
```bash
docker logs proyectosti_backend --tail 50 | grep -i "mail\|smtp\|error"
```

3. Si ves "Error al enviar correo", revisa:
   - Las credenciales son correctas
   - El servidor SMTP permite conexiones desde el servidor (IP: 64.176.16.195)
   - El puerto no está bloqueado por firewall

## 📞 Configuraciones comunes por proveedor:

### Gmail / Google Workspace:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com o @tudominio.com
SMTP_PASS=contraseña_de_aplicación_16_caracteres
```

### Outlook / Hotmail:
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo:
```
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=465 o 587
```

### SendGrid (API para aplicaciones):
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=tu_api_key_de_sendgrid
```

## 🆘 Alternativa: Usar un servicio SMTP transaccional

Si tienes problemas con proveedores convencionales, considera:
- **SendGrid** (100 emails gratis/día)
- **Mailgun** (5,000 emails gratis/mes)
- **Amazon SES** (Muy económico)

Estos servicios son más confiables para aplicaciones y evitan problemas de spam.

## 📝 Estado actual del sistema:

El backend está configurado pero **necesita las credenciales correctas** para funcionar.
Los mensajes del formulario se **guardarán en la base de datos** aunque el correo falle,
así que no se perderán los contactos.

Para verificar mensajes guardados:
```bash
docker exec proyectosti_db psql -U postgres readme_to_recover -c "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5;"
```

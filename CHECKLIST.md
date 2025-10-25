# ✅ Checklist de Verificación - Proyectos TI Valpo

## 📋 Pre-Despliegue (Desarrollo Local)

### Configuración Inicial
- [ ] Docker y Docker Compose instalados
- [ ] Git instalado
- [ ] Repositorio clonado
- [ ] Archivo `.env` creado desde `.env.example`
- [ ] Archivo `frontend/.env` creado desde `frontend/.env.example`
- [ ] Variables de entorno configuradas correctamente

### Variables de Entorno Verificadas
- [ ] DB_USER configurado
- [ ] DB_PASSWORD configurado (seguro, no default)
- [ ] DB_NAME configurado
- [ ] JWT_SECRET configurado (largo y aleatorio, mínimo 32 caracteres)
- [ ] SMTP_HOST configurado
- [ ] SMTP_PORT configurado
- [ ] SMTP_USER configurado
- [ ] SMTP_PASS configurado (app password si es Gmail)
- [ ] ADMIN_EMAIL configurado
- [ ] VITE_API_URL configurado

### Construcción y Ejecución
- [ ] `docker-compose up -d --build` ejecutado exitosamente
- [ ] Los 3 contenedores están corriendo (frontend, backend, db)
- [ ] No hay errores en los logs: `docker-compose logs`
- [ ] Usuario administrador creado
- [ ] Credenciales de admin guardadas de forma segura

### Pruebas Locales
- [ ] Frontend accesible en http://localhost:3000
- [ ] Backend API responde en http://localhost:5000/api/health
- [ ] Página principal carga correctamente
- [ ] Navbar funciona y enlaces scroll suave funcionan
- [ ] Footer se muestra correctamente

#### Funcionalidades Públicas
- [ ] Sección de proyectos visible (o mensaje si está vacío)
- [ ] Sección de noticias visible (o mensaje si está vacío)
- [ ] Formulario de contacto funciona
  - [ ] Campos validan correctamente
  - [ ] Mensaje se envía exitosamente
  - [ ] Mensaje se guarda en base de datos
  - [ ] Email de notificación llega al admin
  - [ ] Toast de confirmación aparece

#### Panel de Administración
- [ ] Login accesible en http://localhost:3000/admin/login
- [ ] Login funciona con credenciales correctas
- [ ] Login rechaza credenciales incorrectas
- [ ] Redirección al dashboard después de login
- [ ] Sidebar de navegación funciona

##### Dashboard
- [ ] Estadísticas se muestran correctamente
- [ ] Accesos rápidos funcionan
- [ ] Links a otras secciones funcionan

##### Gestión de Proyectos
- [ ] Lista de proyectos se muestra
- [ ] Botón "Nuevo Proyecto" abre modal
- [ ] Formulario de crear proyecto funciona
  - [ ] Campos validan
  - [ ] Subida de imagen funciona
  - [ ] Proyecto se crea exitosamente
  - [ ] Proyecto aparece en la lista
- [ ] Editar proyecto funciona
  - [ ] Modal se llena con datos existentes
  - [ ] Actualización guarda cambios
  - [ ] Cambiar imagen funciona
- [ ] Eliminar proyecto funciona
  - [ ] Confirmación aparece
  - [ ] Proyecto se elimina
- [ ] Toggle activo/inactivo funciona
- [ ] Proyecto nuevo aparece en página pública

##### Gestión de Noticias
- [ ] Lista de noticias se muestra
- [ ] Crear noticia funciona
  - [ ] Todos los campos funcionan
  - [ ] Subida de imagen funciona
  - [ ] Fecha de publicación funciona
- [ ] Editar noticia funciona
- [ ] Eliminar noticia funciona
- [ ] Noticia nueva aparece en página pública

##### Mensajes de Contacto
- [ ] Lista de mensajes se muestra
- [ ] Mensajes sin leer están marcados visualmente
- [ ] Filtros funcionan (todos, leídos, sin leer)
- [ ] Marcar como leído funciona
- [ ] Contador de mensajes sin leer actualiza
- [ ] Eliminar mensaje funciona
- [ ] Link "Responder por correo" funciona

#### Responsive Design
- [ ] Sitio se ve bien en desktop (1920x1080)
- [ ] Sitio se ve bien en tablet (768x1024)
- [ ] Sitio se ve bien en móvil (375x667)
- [ ] Menú hamburguesa funciona en móvil
- [ ] Sidebar admin se oculta/muestra en móvil
- [ ] Tablas son scrolleables en móvil
- [ ] Imágenes se adaptan correctamente

#### Performance
- [ ] Página principal carga en < 3 segundos
- [ ] Navegación entre páginas es fluida
- [ ] Imágenes cargan sin demora excesiva
- [ ] No hay errores en consola del navegador
- [ ] No hay warnings importantes en logs del servidor

---

## 🚀 Despliegue en Producción

### Preparación del Servidor
- [ ] Servidor Ubuntu 22.04 accesible
- [ ] Acceso root o sudo disponible
- [ ] Docker instalado en servidor
- [ ] Docker Compose instalado en servidor
- [ ] Nginx instalado en servidor
- [ ] Certbot instalado en servidor
- [ ] Dominio apunta al servidor (DNS configurado)
- [ ] Puertos 80 y 443 abiertos en firewall

### Transferencia de Código
- [ ] Código clonado en `/var/www/proyectostivalpo`
- [ ] Permisos correctos en directorio
- [ ] Archivo `.env` creado con datos de producción
- [ ] Variables de entorno de producción verificadas
  - [ ] DB_PASSWORD cambiado (no usar default)
  - [ ] JWT_SECRET cambiado (largo y único)
  - [ ] SMTP configurado correctamente
  - [ ] VITE_API_URL apunta a dominio real
- [ ] `frontend/.env` creado con URL de producción

### Construcción y Ejecución en Producción
- [ ] `docker-compose up -d --build` ejecutado
- [ ] Todos los contenedores corriendo
- [ ] Logs no muestran errores críticos
- [ ] Backend responde: `curl http://localhost:5000/api/health`
- [ ] Frontend responde: `curl http://localhost:3000`
- [ ] Usuario administrador creado en producción

### Configuración de Nginx
- [ ] Archivo nginx copiado a `/etc/nginx/sites-available/`
- [ ] Enlace simbólico creado en `/etc/nginx/sites-enabled/`
- [ ] Configuración verificada: `sudo nginx -t`
- [ ] Nginx recargado: `sudo systemctl reload nginx`
- [ ] Sitio accesible temporalmente por HTTP

### Certificado SSL
- [ ] Certbot ejecutado para dominio principal
- [ ] Certbot ejecutado para www (si aplica)
- [ ] Certificado instalado correctamente
- [ ] HTTPS funciona: https://proyectostivalpo.com
- [ ] HTTP redirige a HTTPS automáticamente
- [ ] Certificado válido (no warnings en navegador)
- [ ] Renovación automática configurada

### Verificación Post-Despliegue
- [ ] Sitio principal accesible vía HTTPS
- [ ] Todas las secciones cargan correctamente
- [ ] Imágenes se muestran (verificar URLs)
- [ ] API responde correctamente
- [ ] Login admin funciona
- [ ] CRUD de proyectos funciona en producción
- [ ] CRUD de noticias funciona en producción
- [ ] Formulario de contacto envía emails
- [ ] Emails llegan al administrador

### Seguridad en Producción
- [ ] Firewall (UFW) configurado
  - [ ] Puerto 22 (SSH) permitido
  - [ ] Puerto 80 (HTTP) permitido
  - [ ] Puerto 443 (HTTPS) permitido
  - [ ] Otros puertos bloqueados
- [ ] Credenciales de administrador seguras
- [ ] Variables de entorno protegidas
- [ ] Base de datos accesible solo desde contenedores
- [ ] Rate limiting funcionando
- [ ] Headers de seguridad presentes

### Performance en Producción
- [ ] Tiempo de carga < 3 segundos
- [ ] Imágenes optimizadas
- [ ] Gzip/Brotli activo
- [ ] Cache de assets configurado
- [ ] CDN configurado (opcional)

### Monitoreo
- [ ] Logs accesibles: `docker-compose logs -f`
- [ ] Logs de Nginx accesibles
- [ ] Espacio en disco suficiente
- [ ] CPU y RAM en niveles normales
- [ ] Backup de base de datos configurado

---

## 📊 Verificación de Funcionalidades

### Sitio Público
- [ ] Banner hero visible y atractivo
- [ ] Sección de características (3 cards)
- [ ] Proyectos listados correctamente
- [ ] Noticias mostradas (últimas 3)
- [ ] Formulario de contacto funcional
- [ ] Footer completo con información
- [ ] Links de redes sociales funcionan
- [ ] Navegación suave entre secciones

### Admin Panel
#### Autenticación
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Sesión persiste (token válido)
- [ ] Sesión expira correctamente
- [ ] Rutas protegidas redirigen a login

#### Proyectos
- [ ] Crear con imagen
- [ ] Crear sin imagen
- [ ] Editar manteniendo imagen
- [ ] Editar cambiando imagen
- [ ] Eliminar (imagen también se borra)
- [ ] Activar/desactivar
- [ ] Cambiar orden de visualización
- [ ] Proyecto inactivo no aparece en público

#### Noticias
- [ ] Crear con imagen
- [ ] Crear sin imagen
- [ ] Editar
- [ ] Eliminar
- [ ] Activar/desactivar
- [ ] Fecha de publicación respetada
- [ ] Noticia inactiva no aparece en público

#### Mensajes
- [ ] Ver todos los mensajes
- [ ] Filtrar por estado
- [ ] Marcar como leído
- [ ] Eliminar
- [ ] Responder por email (link funciona)

### Integración
- [ ] Proyecto creado aparece en home
- [ ] Noticia creada aparece en home
- [ ] Mensaje enviado llega al admin
- [ ] Cambios en admin se reflejan en público inmediatamente
- [ ] Imágenes subidas son accesibles públicamente

---

## 🔄 Mantenimiento Continuo

### Backups
- [ ] Script de backup de BD creado
- [ ] Backups se guardan en ubicación segura
- [ ] Restauración de backup probada
- [ ] Backups de imágenes `/uploads` incluidos
- [ ] Frecuencia de backup definida (diario recomendado)

### Actualizaciones
- [ ] Proceso de actualización documentado
- [ ] Git pull probado
- [ ] Rebuild de contenedores probado
- [ ] Rollback plan definido

### Monitoreo
- [ ] Logs revisados regularmente
- [ ] Espacio en disco monitoreado
- [ ] Rendimiento monitoreado
- [ ] Uptime monitoreado (opcional: UptimeRobot)

---

## 📝 Notas Finales

### Información a Guardar
- [ ] Credenciales de admin guardadas en gestor de contraseñas
- [ ] Variables de entorno guardadas de forma segura
- [ ] Credenciales SMTP guardadas
- [ ] Fecha de renovación de SSL anotada

### Documentación
- [ ] README.md leído
- [ ] DEPLOYMENT.md seguido
- [ ] DEVELOPMENT.md consultado si es necesario
- [ ] API_DOCUMENTATION.md disponible para referencia

### Comunicación
- [ ] Cliente/Usuario final informado de URLs
- [ ] Credenciales de admin compartidas de forma segura
- [ ] Contacto de soporte establecido
- [ ] Plan de mantenimiento acordado

---

## ✅ Firma de Aprobación

**Desarrollo Local Completado:**
- Fecha: _______________
- Por: __________________
- Notas: ________________

**Despliegue en Producción Completado:**
- Fecha: _______________
- Por: __________________
- URL: https://proyectostivalpo.com
- Notas: ________________

---

**IMPORTANTE:** No consideres el despliegue completo hasta que todos los ítems estén marcados. Cada punto es crítico para el funcionamiento correcto del sistema.

Si algún punto no se puede completar, documenta el motivo y busca solución antes de continuar.

---

¡Éxito con tu despliegue! 🚀

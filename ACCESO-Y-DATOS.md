# Portal ProyectosTI - Información de Acceso y Datos

## 🌐 URLs
- **Portal Principal**: https://proyectostivalpo.com
- **Sistema de Conciertos**: https://conciertos.proyectostivalpo.com

## 👤 Usuarios de Prueba

### Usuario Administrador
- **Email**: ma.cobo@profesor.duoc.cl
- **Contraseña**: mico1234
- **Rol**: admin
- **Estado**: ✅ Verificado y funcionando

### Usuarios Regulares (todos con contraseña: mico1234)
1. **Juan Pérez** - juan.perez@duocuc.cl
2. **María González** - maria.gonzalez@duocuc.cl
3. **Pedro Sánchez** - pedro.sanchez@duocuc.cl
4. **Ana Torres** - ana.torres@duocuc.cl

**Nota**: Todas las contraseñas han sido hasheadas correctamente con bcryptjs y verificadas.

## 📊 Datos de Ejemplo en la Base de Datos

### Proyectos (5 en total)
1. Portal ProyectosTI
2. Sistema de Gestión de Inventario
3. Aplicación de Delivery
4. Dashboard de Analytics
5. API de Gestión Bibliotecaria

### Noticias (6 en total)
1. Bienvenidos al Portal ProyectosTI
2. Nuevos proyectos disponibles
3. Sistema de gestión actualizado
4. Hackathon 2025
5. Nuevas tecnologías en el curriculum
6. Convenio con empresas tech

### Mensajes de Contacto (2 ejemplos)
- Carlos Ramírez (sin leer)
- Laura Fernández (leído)

## 🔧 API Endpoints Disponibles

### Públicos
- `GET /api/projects` - Listar proyectos activos
- `GET /api/news?limit=3` - Obtener últimas noticias
- `POST /api/contact` - Enviar mensaje de contacto
- `POST /api/auth/login` - Iniciar sesión

### Autenticados (requieren token JWT)
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/change-password` - Cambiar contraseña
- `GET /api/projects/admin` - Gestión de proyectos (admin)
- `GET /api/news/admin` - Gestión de noticias (admin)
- `GET /api/contact/messages` - Ver mensajes (admin)

## 🗄️ Base de Datos

- **Nombre**: readme_to_recover
- **Usuario**: postgres
- **Contraseña**: postgres
- **Puerto**: 5432 (expuesto en host)

### Tablas:
- `users` - Usuarios del sistema
- `projects` - Proyectos estudiantiles
- `news` - Noticias y anuncios
- `contact_messages` - Mensajes del formulario de contacto

## 🐳 Contenedores Docker

```bash
# Ver estado de contenedores
docker ps

# Contenedores del Portal ProyectosTI:
- proyectosti_frontend (puerto 3000 → 80)
- proyectosti_backend (puerto 5000)
- proyectosti_db (PostgreSQL, puerto 5432)

# Contenedores del Sistema de Conciertos:
- conciertos-frontend (puerto 3001 → 80)
- conciertos-backend (puerto 8080)
- conciertos-postgres
```

## 📝 Pruebas Sugeridas

1. **Probar el Portal**:
   - Abrir https://proyectostivalpo.com
   - Verificar que se vean los 5 proyectos
   - Verificar que se vean las últimas 3 noticias
   - Probar el formulario de contacto

2. **Probar Login**:
   - Iniciar sesión con el usuario admin
   - Verificar acceso a panel de administración
   - Probar cambio de contraseña

3. **Probar desde Móvil**:
   - Abrir desde celular
   - Verificar diseño responsivo
   - Verificar que todo funciona correctamente

4. **Probar API**:
   ```bash
   # Proyectos
   curl https://proyectostivalpo.com/api/projects
   
   # Noticias
   curl https://proyectostivalpo.com/api/news?limit=3
   
   # Login
   curl -X POST https://proyectostivalpo.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"ma.cobo@profesor.duoc.cl","password":"mico1234"}'
   ```

## 🔒 Variables de Entorno (.env)

Ubicación: `/var/www/proyectostivalpo/.env`

```env
DOCKER_USERNAME=micobo
DB_NAME=readme_to_recover
JWT_SECRET=1/vyS0mFDvgnLf/EO+9RWC6IVG
SMTP_HOST=smtp.gmail.com
SMTP_USER=ma.cobo@profesor.duoc.cl
SMTP_PASS=Amanda0814
NODE_ENV=production
```

## 🛠️ Comandos Útiles

```bash
# Reiniciar servicios
cd /var/www/proyectostivalpo
docker-compose restart

# Ver logs
docker logs proyectosti_backend --tail 50
docker logs proyectosti_frontend --tail 50

# Acceder a la base de datos
docker exec -it proyectosti_db psql -U postgres readme_to_recover

# Verificar Nginx
sudo nginx -t
sudo systemctl status nginx

# Ver certificados SSL
sudo certbot certificates
```

## ✅ Estado Actual

- ✅ Nginx configurado para ambos dominios
- ✅ Certificados SSL instalados (HTTPS funcionando)
- ✅ Base de datos inicializada con datos de ejemplo
- ✅ Usuario administrador creado
- ✅ API funcionando correctamente
- ✅ CORS configurado
- ✅ Tabla de contacto creada
- ✅ Múltiples usuarios de prueba creados
- ✅ URLs de imágenes corregidas

## 🚀 Próximos Pasos

- [ ] Actualizar GitHub Actions de conciertos para no sobrescribir docker-compose.yml
- [ ] Agregar imágenes reales a los proyectos (reemplazar placeholders)
- [ ] Configurar backup automático de base de datos
- [ ] Documentar proceso de deployment

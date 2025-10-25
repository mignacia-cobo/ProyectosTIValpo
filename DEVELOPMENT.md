# Desarrollo Local - Proyectos TI Valpo

Guía para desarrollar y probar el proyecto en tu máquina local.

## 📋 Requisitos

- Node.js 18+ (para desarrollo sin Docker)
- Docker y Docker Compose (método recomendado)
- PostgreSQL (si no usas Docker)
- Git

## 🚀 Opción 1: Desarrollo con Docker (Recomendado)

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio-url>
cd ProyectosTIValpo
```

### 2. Configurar variables de entorno

```bash
# Copiar archivos de ejemplo
cp .env.example .env
cp frontend/.env.example frontend/.env

# Editar con tus datos
# En Windows: notepad .env
# En Linux/Mac: nano .env
```

### 3. Iniciar con Docker Compose

```bash
# Linux/Mac
chmod +x start.sh
./start.sh

# Windows
start.bat

# O manualmente
docker-compose up -d --build
```

### 4. Crear usuario administrador

```bash
docker exec -it proyectosti_backend node src/scripts/createAdmin.js
```

Ingresar:
- Nombre: Admin
- Email: admin@proyectostivalpo.com
- Contraseña: (tu contraseña segura)

### 5. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000/api
- **Admin Panel**: http://localhost:3000/admin

### 6. Ver logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend
```

### 7. Detener

```bash
docker-compose down
```

---

## 🔧 Opción 2: Desarrollo sin Docker

### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar PostgreSQL local
# Crear base de datos 'proyectosti'
psql -U postgres
CREATE DATABASE proyectosti;
\q

# Ejecutar script de inicialización
psql -U postgres -d proyectosti -f init.sql

# Crear .env con tus datos locales
cp .env.example .env
# Editar DB_HOST=localhost

# Iniciar en modo desarrollo
npm run dev
```

Backend corriendo en: http://localhost:5000

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Crear .env
cp .env.example .env
# Configurar VITE_API_URL=http://localhost:5000/api

# Iniciar en modo desarrollo
npm run dev
```

Frontend corriendo en: http://localhost:3000

---

## 🧪 Desarrollo y Testing

### Estructura del Proyecto

```
ProyectosTIValpo/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Lógica de negocio
│   │   ├── routes/           # Rutas de la API
│   │   ├── middleware/       # Middlewares (auth, upload)
│   │   ├── config/           # Configuración (DB)
│   │   ├── scripts/          # Scripts útiles
│   │   └── server.js         # Punto de entrada
│   ├── uploads/              # Imágenes subidas
│   └── init.sql              # Inicialización de DB
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/            # Páginas
│   │   │   └── admin/        # Páginas de admin
│   │   ├── services/         # Servicios API
│   │   └── App.jsx           # Componente principal
│   └── public/               # Assets estáticos
├── nginx/                    # Configuración Nginx
└── docker-compose.yml        # Orquestación Docker
```

### Agregar nueva funcionalidad

1. **Backend**: Crear controller y ruta
2. **Frontend**: Crear servicio y componente
3. **Testing**: Probar manualmente

### Hot Reload

- **Backend**: Usa `nodemon` (se recarga automáticamente)
- **Frontend**: Usa Vite (se recarga automáticamente)

---

## 🗄️ Base de Datos

### Acceder a PostgreSQL (Docker)

```bash
docker exec -it proyectosti_db psql -U postgres -d proyectosti
```

### Comandos útiles de psql

```sql
-- Listar tablas
\dt

-- Ver estructura de tabla
\d projects
\d news
\d users
\d contact_messages

-- Ver datos
SELECT * FROM projects;
SELECT * FROM news;
SELECT * FROM users;
SELECT * FROM contact_messages;

-- Salir
\q
```

### Reset de base de datos

```bash
# Detener contenedores
docker-compose down

# Eliminar volumen de datos
docker volume rm proyectostivalpo_postgres_data

# Reiniciar
docker-compose up -d
```

---

## 📸 Subida de Imágenes

Las imágenes se guardan en `backend/uploads/` y son accesibles vía:
- Desarrollo: `http://localhost:5000/uploads/nombre-archivo.jpg`
- Producción: `https://proyectostivalpo.com/uploads/nombre-archivo.jpg`

Formatos permitidos: JPG, PNG, GIF, WebP
Tamaño máximo: 5MB

---

## 🔐 Autenticación

### Obtener token JWT

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@proyectostivalpo.com",
    "password": "tu_contraseña"
  }'
```

### Usar token en peticiones

```bash
curl http://localhost:5000/api/projects/admin/all \
  -H "Authorization: Bearer {tu_token}"
```

---

## 📧 Testing de Email

Para probar el envío de correos en desarrollo:

### Opción 1: Gmail
1. Crear cuenta de Gmail
2. Habilitar verificación en 2 pasos
3. Generar contraseña de aplicación
4. Configurar en `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=tu_email@gmail.com
   SMTP_PASS=tu_app_password
   ```

### Opción 2: Mailtrap (para testing)
1. Crear cuenta en https://mailtrap.io
2. Obtener credenciales SMTP
3. Configurar en `.env`:
   ```
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=tu_mailtrap_user
   SMTP_PASS=tu_mailtrap_pass
   ```

---

## 🐛 Solución de Problemas Comunes

### Puerto 3000 o 5000 ya en uso

```bash
# Ver qué proceso usa el puerto
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Matar proceso o cambiar puerto en docker-compose.yml
```

### Error de conexión a base de datos

```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Reiniciar servicio
docker-compose restart db
```

### Imágenes no se muestran

- Verificar que `backend/uploads/` existe
- Verificar permisos del directorio
- Verificar URL en el código frontend

### Error "Module not found"

```bash
# Reinstalar dependencias
cd backend && npm install
cd ../frontend && npm install
```

---

## 📚 Recursos Adicionales

- [Documentación de la API](./API_DOCUMENTATION.md)
- [Guía de despliegue](./DEPLOYMENT.md)
- [React + Vite](https://vitejs.dev/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [TailwindCSS](https://tailwindcss.com/docs)

---

## ✅ Checklist de Desarrollo

- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 3000
- [ ] Base de datos PostgreSQL activa
- [ ] Usuario administrador creado
- [ ] Puedo hacer login en /admin
- [ ] Puedo crear/editar proyectos
- [ ] Puedo crear/editar noticias
- [ ] Formulario de contacto envía mensajes
- [ ] Imágenes se suben correctamente
- [ ] Hot reload funciona (cambios se reflejan automáticamente)

---

¡Happy Coding! 🚀

Si encuentras algún problema, revisa los logs con `docker-compose logs -f` o abre un issue en el repositorio.

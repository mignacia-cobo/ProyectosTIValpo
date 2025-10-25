# Proyectos TI Valpo - Portal Principal

Portal web oficial de Proyectos TI Valpo, mostrando todos los proyectos desarrollados y mantenidos.

[![CI/CD Pipeline](https://github.com/mignacia-cobo/ProyectosTIValpo/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/mignacia-cobo/ProyectosTIValpo/actions/workflows/ci-cd.yml)
[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-proyectosti-blue)](https://hub.docker.com/u/mignaciacobo)

## 🚀 Características

- ✅ Sitio público con presentación de proyectos
- ✅ Sección de noticias/novedades
- ✅ Formulario de contacto con envío por correo
- ✅ Panel de administración con autenticación JWT
- ✅ CRUD completo de proyectos y noticias
- ✅ Subida de imágenes
- ✅ Diseño responsivo con TailwindCSS
- ✅ **CI/CD con GitHub Actions**
- ✅ **Deploy automático a producción**
- ✅ **Imágenes Docker en Docker Hub**
- ✅ Contenedorizado con Docker
- ✅ Base de datos PostgreSQL

## 🎯 Deployment Automático

Este proyecto utiliza **GitHub Actions** para CI/CD:

```
Git Push → GitHub Actions → Docker Hub → Servidor Producción
```

**Documentación:**
- 📘 [Guía Rápida CI/CD](QUICKSTART_CICD.md)
- 📗 [Setup Completo CI/CD](CICD_SETUP.md)
- 🚀 [Deployment al Servidor](DEPLOYMENT_SERVER.md)

## 📁 Estructura del Proyecto

```
ProyectosTIValpo/
├── backend/              # API Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── config/
│   ├── uploads/          # Imágenes subidas
│   ├── Dockerfile
│   └── package.json
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
├── nginx/                # Configuración Nginx
│   └── proyectostivalpo.conf
├── docker-compose.yml
└── .env
```

## 🔧 Instalación y Despliegue

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd ProyectosTIValpo
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Construir y levantar los contenedores

```bash
docker-compose up -d --build
```

### 4. Crear usuario administrador

```bash
docker exec -it proyectosti_backend node src/scripts/createAdmin.js
```

## 🌐 Configuración de Nginx en el Servidor

1. Copiar la configuración de Nginx:

```bash
sudo cp nginx/proyectostivalpo.conf /etc/nginx/sites-available/proyectostivalpo.com
sudo ln -s /etc/nginx/sites-available/proyectostivalpo.com /etc/nginx/sites-enabled/
```

2. Verificar la configuración:

```bash
sudo nginx -t
```

3. Obtener certificado SSL con Certbot:

```bash
sudo certbot --nginx -d proyectostivalpo.com -d www.proyectostivalpo.com
```

4. Recargar Nginx:

```bash
sudo systemctl reload nginx
```

## 🔑 Acceso al Panel de Administración

- URL: https://proyectostivalpo.com/admin
- Usuario por defecto: admin@proyectostivalpo.com
- Contraseña: Se genera al ejecutar el script createAdmin.js

## 📝 API Endpoints

### Públicos
- `GET /api/projects` - Lista de proyectos
- `GET /api/news` - Últimas noticias
- `POST /api/contact` - Enviar mensaje de contacto

### Autenticados (requieren JWT)
- `POST /api/auth/login` - Login
- `POST /api/projects` - Crear proyecto
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto
- `POST /api/news` - Crear noticia
- `PUT /api/news/:id` - Actualizar noticia
- `DELETE /api/news/:id` - Eliminar noticia
- `GET /api/contact/messages` - Ver mensajes de contacto

## 🛠️ Desarrollo Local

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📦 Tecnologías

- **Frontend**: React 18, Vite, TailwindCSS, React Router, Axios
- **Backend**: Node.js, Express, PostgreSQL, JWT, Multer, Nodemailer
- **Infraestructura**: Docker, Docker Compose, Nginx, Certbot

## 📧 Configuración de Email

Para el envío de correos desde el formulario de contacto, configura las variables SMTP en el archivo `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
ADMIN_EMAIL=admin@proyectostivalpo.com
```

**Nota**: Si usas Gmail, necesitas crear una "Contraseña de aplicación" desde tu cuenta de Google.

## � Documentación Completa

Este proyecto incluye documentación exhaustiva para todos los casos de uso:

- **[📖 INDEX.md](./INDEX.md)** - Índice de toda la documentación (empieza aquí)
- **[⚡ QUICKSTART.md](./QUICKSTART.md)** - Inicio rápido en 5 minutos
- **[💻 DEVELOPMENT.md](./DEVELOPMENT.md)** - Guía completa de desarrollo local
- **[🚀 DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía paso a paso de despliegue en producción
- **[📡 API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Documentación completa de la API REST
- **[🏗️ ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura técnica del sistema
- **[📝 CHANGES.md](./CHANGES.md)** - Resumen completo de funcionalidades implementadas
- **[✅ CHECKLIST.md](./CHECKLIST.md)** - Lista de verificación para despliegue

👉 **¿Primera vez aquí? Lee [INDEX.md](./INDEX.md) para orientarte**

---

## 👨‍💻 Autor

Proyectos TI Valpo

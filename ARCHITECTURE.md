# 🏗️ Arquitectura del Sistema - Proyectos TI Valpo

## 📊 Diagrama General

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USUARIO FINAL                               │
│                    (Browser: Chrome, Firefox, etc.)                  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTPS
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    SERVIDOR UBUNTU 22.04                             │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    NGINX (Reverse Proxy)                       │  │
│  │  - Puerto 80 → 443 (redirect)                                 │  │
│  │  - Puerto 443 (HTTPS con Certbot/Let's Encrypt)              │  │
│  │  - Proxy pass a frontend (puerto 3000)                        │  │
│  │  - Proxy pass a backend (puerto 5000)                         │  │
│  └─────────────┬────────────────────────────────┬─────────────────┘  │
│                │                                │                     │
│                ↓                                ↓                     │
│  ┌─────────────────────────┐    ┌─────────────────────────────────┐ │
│  │  FRONTEND CONTAINER     │    │   BACKEND CONTAINER              │ │
│  │  (proyectosti_frontend) │    │   (proyectosti_backend)          │ │
│  │                         │    │                                  │ │
│  │  - React 18             │    │   - Node.js 18                   │ │
│  │  - Vite                 │    │   - Express                      │ │
│  │  - TailwindCSS          │    │   - JWT Auth                     │ │
│  │  - React Router         │    │   - Multer (uploads)             │ │
│  │  - Axios                │    │   - Nodemailer (email)           │ │
│  │                         │    │   - bcrypt (passwords)           │ │
│  │  Puerto: 3000           │    │   Puerto: 5000                   │ │
│  │  Build: Nginx Alpine    │    │                                  │ │
│  └─────────────────────────┘    └──────────────┬───────────────────┘ │
│                                                 │                     │
│                                                 ↓                     │
│                                  ┌──────────────────────────────────┐ │
│                                  │  DATABASE CONTAINER               │ │
│                                  │  (proyectosti_db)                 │ │
│                                  │                                   │ │
│                                  │  - PostgreSQL 15                  │ │
│                                  │  - Puerto: 5432                   │ │
│                                  │  - Volume: postgres_data          │ │
│                                  │                                   │ │
│                                  │  Tablas:                          │ │
│                                  │  - users                          │ │
│                                  │  - projects                       │ │
│                                  │  - news                           │ │
│                                  │  - contact_messages               │ │
│                                  └───────────────────────────────────┘ │
│                                                                         │
│  Red Docker: proyectosti_network                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos

### 1️⃣ Usuario Público Visita el Sitio

```
Usuario
  │
  ├─→ GET https://proyectostivalpo.com
  │
  ↓
Nginx (puerto 443)
  │
  ├─→ Proxy pass → Frontend Container (puerto 3000)
  │
  ↓
React App carga
  │
  ├─→ GET /api/projects (lista de proyectos)
  ├─→ GET /api/news?limit=3 (últimas noticias)
  │
  ↓
Nginx
  │
  ├─→ Proxy pass → Backend Container (puerto 5000)
  │
  ↓
Express API
  │
  ├─→ SELECT * FROM projects WHERE active = true
  ├─→ SELECT * FROM news WHERE active = true LIMIT 3
  │
  ↓
PostgreSQL
  │
  ├─→ Retorna datos
  │
  ↓
Usuario ve proyectos y noticias en la página
```

### 2️⃣ Usuario Envía Formulario de Contacto

```
Usuario llena formulario
  │
  ├─→ POST /api/contact
  │   Body: { name, email, message }
  │
  ↓
Nginx → Backend
  │
  ↓
Express API
  │
  ├─→ Validación de datos
  ├─→ Rate limiting (max 5 por IP/15 min)
  ├─→ INSERT INTO contact_messages (name, email, message)
  │
  ↓
PostgreSQL guarda mensaje
  │
  ↓
Nodemailer envía email al admin
  │
  ├─→ SMTP Server (Gmail/otro)
  │
  ↓
Admin recibe notificación por email
  │
  ↓
Usuario ve confirmación en pantalla
```

### 3️⃣ Admin Gestiona Proyectos

```
Admin accede a /admin/login
  │
  ├─→ POST /api/auth/login
  │   Body: { email, password }
  │
  ↓
Express API
  │
  ├─→ SELECT * FROM users WHERE email = ?
  ├─→ bcrypt.compare(password, hash)
  ├─→ jwt.sign({ id, email, name })
  │
  ↓
Admin recibe token JWT
  │
  ├─→ localStorage.setItem('token', token)
  │
  ↓
Admin navega a /admin/projects
  │
  ├─→ GET /api/projects/admin/all
  │   Header: Authorization: Bearer {token}
  │
  ↓
Express verifica JWT
  │
  ├─→ jwt.verify(token, secret)
  │
  ↓
PostgreSQL retorna todos los proyectos
  │
  ↓
Admin ve lista y puede editar
  │
  ├─→ POST /api/projects (con imagen)
  │   FormData: name, description, url, image
  │
  ↓
Multer procesa imagen → /uploads/
  │
  ↓
PostgreSQL guarda registro con image_url
  │
  ↓
Admin ve nuevo proyecto en la lista
```

---

## 🔐 Capas de Seguridad

```
┌──────────────────────────────────────────────┐
│  1. NGINX                                    │
│  - SSL/TLS (Certbot)                        │
│  - Rate limiting                             │
│  - Headers de seguridad                      │
└──────────────┬───────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────┐
│  2. BACKEND (Express)                        │
│  - JWT Authentication                        │
│  - Helmet (security headers)                 │
│  - CORS configurado                          │
│  - Express Rate Limit                        │
│  - Validación de inputs                      │
└──────────────┬───────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────┐
│  3. MIDDLEWARE                               │
│  - authenticateToken (JWT verify)            │
│  - Multer file validation                    │
│  - Express-validator                         │
└──────────────┬───────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────┐
│  4. DATABASE                                 │
│  - Queries parametrizadas (SQL injection)    │
│  - Passwords hasheadas (bcrypt)              │
│  - Índices para performance                  │
└──────────────────────────────────────────────┘
```

---

## 📦 Contenedores Docker

### Frontend Container
```yaml
Imagen base: node:18-alpine (build)
            nginx:alpine (producción)
Puertos: 3000:80
Volúmenes: Ninguno (todo en imagen)
Red: proyectosti_network
Dependencias: backend (espera a que inicie)
```

### Backend Container
```yaml
Imagen base: node:18-alpine
Puertos: 5000:5000
Volúmenes: ./backend/uploads:/app/uploads
Red: proyectosti_network
Dependencias: db (espera a PostgreSQL)
Variables de entorno: DB_*, JWT_SECRET, SMTP_*
```

### Database Container
```yaml
Imagen: postgres:15-alpine
Puertos: 5432:5432
Volúmenes: 
  - postgres_data (persistente)
  - ./backend/init.sql (inicialización)
Red: proyectosti_network
Variables de entorno: POSTGRES_*
```

---

## 🌐 Rutas y Endpoints

### Frontend Routes (React Router)
```
Públicas:
  /                    → Home (página principal)

Admin (protegidas):
  /admin/login         → Login
  /admin               → Dashboard
  /admin/projects      → Gestión de proyectos
  /admin/news          → Gestión de noticias
  /admin/messages      → Mensajes de contacto
```

### Backend Routes (Express)
```
Autenticación:
  POST   /api/auth/login          → Login
  GET    /api/auth/verify         → Verificar token
  POST   /api/auth/change-password → Cambiar contraseña

Proyectos:
  GET    /api/projects            → Listar (públicos)
  GET    /api/projects/:id        → Ver uno
  GET    /api/projects/admin/all  → Listar todos (admin)
  POST   /api/projects            → Crear (admin)
  PUT    /api/projects/:id        → Actualizar (admin)
  DELETE /api/projects/:id        → Eliminar (admin)

Noticias:
  GET    /api/news                → Últimas (públicas)
  GET    /api/news/:id            → Ver una
  GET    /api/news/admin/all      → Listar todas (admin)
  POST   /api/news                → Crear (admin)
  PUT    /api/news/:id            → Actualizar (admin)
  DELETE /api/news/:id            → Eliminar (admin)

Contacto:
  POST   /api/contact             → Enviar mensaje
  GET    /api/contact/messages    → Listar (admin)
  PATCH  /api/contact/messages/:id/read → Marcar leído (admin)
  DELETE /api/contact/messages/:id → Eliminar (admin)

Archivos:
  GET    /uploads/*               → Imágenes subidas
```

---

## 💾 Estructura de Base de Datos

```
┌─────────────────────────┐
│        users            │
├─────────────────────────┤
│ id (PK)                 │
│ email (UNIQUE)          │
│ password (HASHED)       │
│ name                    │
│ created_at              │
│ updated_at              │
└─────────────────────────┘

┌─────────────────────────┐
│       projects          │
├─────────────────────────┤
│ id (PK)                 │
│ name                    │
│ description             │
│ url                     │
│ image_url               │
│ order_index             │
│ active                  │
│ created_at              │
│ updated_at              │
└─────────────────────────┘

┌─────────────────────────┐
│         news            │
├─────────────────────────┤
│ id (PK)                 │
│ title                   │
│ content                 │
│ summary                 │
│ image_url               │
│ published_date          │
│ active                  │
│ created_at              │
│ updated_at              │
└─────────────────────────┘

┌─────────────────────────┐
│   contact_messages      │
├─────────────────────────┤
│ id (PK)                 │
│ name                    │
│ email                   │
│ message                 │
│ read                    │
│ created_at              │
└─────────────────────────┘
```

---

## 🔄 Ciclo de Vida de la Aplicación

### Desarrollo
```
1. Desarrollador modifica código
2. Hot reload detecta cambios
3. Frontend/Backend se recargan automáticamente
4. Desarrollador prueba en localhost
```

### Build
```
1. docker-compose build
2. Frontend: npm run build → optimiza y minifica
3. Backend: copia código y node_modules
4. Imágenes Docker creadas
```

### Despliegue
```
1. docker-compose up -d
2. Contenedores inician en orden (db → backend → frontend)
3. PostgreSQL corre init.sql
4. Backend conecta a DB
5. Frontend sirve archivos estáticos
6. Nginx enruta tráfico
```

### Producción
```
Usuario → Nginx:443 → Frontend:3000 (UI)
                   → Backend:5000 (API) → PostgreSQL:5432 (DB)
```

---

## 📊 Performance y Optimización

### Frontend
- ✅ Build optimizado de Vite
- ✅ Code splitting automático
- ✅ Assets minificados
- ✅ Gzip compression (Nginx)
- ✅ Cache de assets (1 año)
- ✅ Lazy loading de imágenes

### Backend
- ✅ Conexión pool a PostgreSQL
- ✅ Índices en tablas
- ✅ Queries optimizadas
- ✅ Rate limiting
- ✅ Compresión de respuestas

### Base de Datos
- ✅ Índices en campos frecuentes
- ✅ Conexiones pooled (max 20)
- ✅ Timeout configurado
- ✅ Volumen persistente

---

## 🔍 Monitoreo y Logs

```
Docker Logs:
  docker-compose logs -f

Logs individuales:
  docker-compose logs -f backend
  docker-compose logs -f frontend
  docker-compose logs -f db

Nginx Logs:
  /var/log/nginx/proyectostivalpo_access.log
  /var/log/nginx/proyectostivalpo_error.log

Database Logs:
  docker exec proyectosti_db psql -U postgres -d proyectosti
```

---

## 🎯 Escalabilidad Futura

### Horizontal Scaling
- Múltiples instancias de backend con load balancer
- Redis para sesiones compartidas
- CDN para assets estáticos

### Vertical Scaling
- Aumentar recursos de contenedores
- Optimizar queries con EXPLAIN
- Implementar cache (Redis/Memcached)

### Mejoras Adicionales
- Implementar CI/CD (GitHub Actions)
- Monitoring (Prometheus + Grafana)
- Logging centralizado (ELK Stack)
- Backups automatizados

---

Este documento describe la arquitectura completa del sistema. Para detalles de implementación, consulta los otros archivos de documentación.

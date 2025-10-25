# API Documentation - Proyectos TI Valpo

## Base URL

- Desarrollo: `http://localhost:5000/api`
- Producción: `https://proyectostivalpo.com/api`

## Autenticación

La API utiliza JSON Web Tokens (JWT) para autenticación. Para endpoints protegidos, incluir el token en el header:

```
Authorization: Bearer {token}
```

---

## Endpoints

### 🔐 Autenticación

#### POST /auth/login
Iniciar sesión y obtener token JWT.

**Request Body:**
```json
{
  "email": "admin@proyectostivalpo.com",
  "password": "tu_contraseña"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "admin@proyectostivalpo.com",
    "name": "Administrador"
  }
}
```

#### GET /auth/verify
Verificar si el token es válido (requiere autenticación).

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "admin@proyectostivalpo.com",
    "name": "Administrador"
  }
}
```

#### POST /auth/change-password
Cambiar contraseña del usuario (requiere autenticación).

**Request Body:**
```json
{
  "currentPassword": "contraseña_actual",
  "newPassword": "nueva_contraseña"
}
```

---

### 📁 Proyectos

#### GET /projects
Obtener todos los proyectos activos (público).

**Response:**
```json
[
  {
    "id": 1,
    "name": "Sistema de Exámenes",
    "description": "Plataforma para gestión de exámenes en línea",
    "url": "https://examenes.proyectostivalpo.com",
    "image_url": "/uploads/proyecto1.jpg",
    "order_index": 0,
    "active": true,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

#### GET /projects/:id
Obtener un proyecto específico por ID (público).

#### GET /projects/admin/all
Obtener todos los proyectos incluyendo inactivos (requiere autenticación).

#### POST /projects
Crear nuevo proyecto (requiere autenticación).

**Request:** multipart/form-data
- `name` (string, requerido)
- `description` (string, requerido)
- `url` (string, requerido)
- `order_index` (number, opcional)
- `active` (boolean, opcional)
- `image` (file, opcional)

#### PUT /projects/:id
Actualizar proyecto (requiere autenticación).

**Request:** multipart/form-data (mismo formato que POST)

#### DELETE /projects/:id
Eliminar proyecto (requiere autenticación).

---

### 📰 Noticias

#### GET /news?limit=3
Obtener últimas noticias activas (público).

**Query Params:**
- `limit` (number, opcional, default: 3)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Lanzamiento del nuevo portal",
    "content": "Hoy presentamos nuestro nuevo portal web...",
    "summary": "Nuevo portal web disponible",
    "image_url": "/uploads/noticia1.jpg",
    "published_date": "2024-01-20T10:00:00Z",
    "active": true,
    "created_at": "2024-01-20T09:00:00Z",
    "updated_at": "2024-01-20T09:00:00Z"
  }
]
```

#### GET /news/:id
Obtener una noticia específica (público).

#### GET /news/admin/all
Obtener todas las noticias (requiere autenticación).

#### POST /news
Crear nueva noticia (requiere autenticación).

**Request:** multipart/form-data
- `title` (string, requerido)
- `content` (string, requerido)
- `summary` (string, opcional)
- `published_date` (datetime, opcional)
- `active` (boolean, opcional)
- `image` (file, opcional)

#### PUT /news/:id
Actualizar noticia (requiere autenticación).

#### DELETE /news/:id
Eliminar noticia (requiere autenticación).

---

### 📧 Contacto

#### POST /contact
Enviar mensaje de contacto (público, limitado a 5 mensajes por IP cada 15 minutos).

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "message": "Me gustaría obtener más información sobre sus servicios."
}
```

**Response:**
```json
{
  "message": "Mensaje enviado exitosamente",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "message": "Me gustaría obtener más información...",
    "read": false,
    "created_at": "2024-01-20T15:30:00Z"
  }
}
```

#### GET /contact/messages
Obtener todos los mensajes de contacto (requiere autenticación).

**Response:**
```json
[
  {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "message": "Me gustaría obtener más información...",
    "read": false,
    "created_at": "2024-01-20T15:30:00Z"
  }
]
```

#### PATCH /contact/messages/:id/read
Marcar mensaje como leído (requiere autenticación).

#### DELETE /contact/messages/:id
Eliminar mensaje (requiere autenticación).

---

## Códigos de Estado

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Errores

Formato de respuesta de error:
```json
{
  "error": "Mensaje descriptivo del error"
}
```

## Rate Limiting

- Formulario de contacto: máximo 5 mensajes cada 15 minutos por IP
- Otros endpoints: sin límite (considera implementar según necesidades)

## Ejemplos con cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@proyectostivalpo.com","password":"admin123"}'
```

### Obtener proyectos
```bash
curl http://localhost:5000/api/projects
```

### Crear proyecto (con autenticación)
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer {tu_token}" \
  -F "name=Nuevo Proyecto" \
  -F "description=Descripción del proyecto" \
  -F "url=https://proyecto.com" \
  -F "image=@/ruta/a/imagen.jpg"
```

### Enviar mensaje de contacto
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Juan Pérez",
    "email":"juan@example.com",
    "message":"Hola, me interesa su servicio"
  }'
```

---

Para más información, consulta el código fuente en `/backend/src/routes/`.

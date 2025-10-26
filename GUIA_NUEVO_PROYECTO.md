# Guía Completa: Nuevo Proyecto con CI/CD y Subdominio

## 📋 Índice
1. [Preparación del Entorno](#preparación-del-entorno)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Configuración de Base de Datos](#configuración-de-base-de-datos)
4. [Variables de Entorno](#variables-de-entorno)
5. [Docker y Contenedores](#docker-y-contenedores)
6. [Nginx y Subdominios](#nginx-y-subdominios)
7. [CI/CD con GitHub Actions](#cicd-con-github-actions)
8. [SSL y Certificados](#ssl-y-certificados)
9. [Monitoreo y Logs](#monitoreo-y-logs)
10. [Checklist Final](#checklist-final)

---

## 🚀 Preparación del Entorno

### 1.1 Servidor (64.176.16.195)
```bash
# Verificar Docker y Docker Compose
docker --version
docker-compose --version

# Verificar Nginx
nginx -v
systemctl status nginx

# Verificar Certbot (para SSL)
certbot --version
```

### 1.2 Desarrollo Local
```bash
# Instalar dependencias necesarias
npm install -g @angular/cli  # Si es Angular
npx create-react-app         # Si es React
npm install -g @vue/cli      # Si es Vue

# Docker Desktop instalado y funcionando
docker --version
docker-compose --version
```

---

## 🏗️ Estructura del Proyecto

### 2.1 Estructura Recomendada
```
mi-nuevo-proyecto/
├── backend/
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   └── docker-compose.yml
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   └── nginx.conf
├── database/
│   ├── init.sql
│   ├── migrations/
│   └── docker-compose.yml
├── docker-compose.yml          # Desarrollo local
├── docker-compose.prod.yml     # Producción
├── .github/
│   └── workflows/
│       ├── backend-ci.yml
│       └── frontend-ci.yml
├── nginx/
│   ├── nginx.conf
│   └── ssl/
└── README.md
```

### 2.2 Ejemplo de docker-compose.yml para desarrollo local
```yaml
version: '3.8'

services:
  # Base de datos PostgreSQL
  postgres:
    image: postgres:15
    container_name: mi-proyecto-db
    environment:
      POSTGRES_DB: mi_proyecto_db
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
    ports:
      - "5433:5432"  # Puerto diferente para evitar conflictos
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - mi-proyecto-network

  # Backend (Node.js/Spring Boot/etc.)
  backend:
    build: ./backend
    container_name: mi-proyecto-backend
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=mi_proyecto_db
      - DB_USER=admin
      - DB_PASSWORD=admin123
      - JWT_SECRET=mi-super-secreto-local
      - PORT=8080
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - mi-proyecto-network

  # Frontend (React/Angular/Vue)
  frontend:
    build: ./frontend
    container_name: mi-proyecto-frontend
    environment:
      - VITE_API_URL=http://localhost:8080/api  # Para desarrollo local
      - VITE_APP_NAME=Mi Proyecto
    ports:
      - "3001:3000"  # Puerto diferente para evitar conflictos
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    networks:
      - mi-proyecto-network

volumes:
  postgres_data:

networks:
  mi-proyecto-network:
    driver: bridge
```

---

## 🗄️ Configuración de Base de Datos

### 3.1 Script de Inicialización (database/init.sql)
```sql
-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de configuración del sitio
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(255) DEFAULT 'Mi Proyecto',
    site_description TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    facebook_url VARCHAR(255),
    instagram_url VARCHAR(255),
    twitter_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos iniciales
INSERT INTO site_settings (site_name, site_description, contact_email) 
VALUES ('Mi Proyecto', 'Descripción de mi proyecto', 'contacto@miproyecto.com')
ON CONFLICT DO NOTHING;

-- Usuario administrador inicial (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role)
VALUES (
    'admin@miproyecto.com',
    '$2b$10$rGVZvQKrv8Wn7KZq1YcxaOxGHJgBxLq0xvP5BQrEzQwRtYvP5BQrE',  -- admin123
    'Admin',
    'Sistema',
    'ADMIN'
) ON CONFLICT (email) DO NOTHING;
```

### 3.2 Migraciones de Base de Datos
```bash
# Crear carpeta de migraciones
mkdir -p database/migrations

# Ejemplo de migración: 001_create_initial_tables.sql
# Ejemplo de migración: 002_add_user_profile.sql
# etc.
```

---

## 🔐 Variables de Entorno

### 4.1 Backend (.env.example)
```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mi_proyecto_db
DB_USER=admin
DB_PASSWORD=admin123

# Configuración de la aplicación
NODE_ENV=development
PORT=8080
JWT_SECRET=tu-super-secreto-jwt-aqui
JWT_EXPIRES_IN=24h

# Configuración de CORS
CORS_ORIGIN=http://localhost:3001,https://miproyecto.proyectostivalpo.com

# Configuración de email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password-de-app

# Configuración de archivos (opcional)
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760  # 10MB

# URLs y dominios
API_BASE_URL=https://miproyecto.proyectostivalpo.com/api
FRONTEND_URL=https://miproyecto.proyectostivalpo.com
```

### 4.2 Frontend (.env.example)
```env
# URL del API
VITE_API_URL=http://localhost:8080/api
# Para producción: VITE_API_URL=https://miproyecto.proyectostivalpo.com/api

# Configuración de la aplicación
VITE_APP_NAME=Mi Proyecto
VITE_APP_DESCRIPTION=Descripción de mi proyecto
VITE_APP_VERSION=1.0.0

# URLs externas
VITE_SUPPORT_EMAIL=soporte@miproyecto.com
VITE_COMPANY_WEBSITE=https://proyectostivalpo.com

# Configuración de analytics (opcional)
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Configuración de mapas (opcional)
VITE_GOOGLE_MAPS_API_KEY=tu-api-key-aqui

# Feature flags (opcional)
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_DARK_MODE=true
```

### 4.3 Archivos de Entorno por Ambiente
```bash
# Desarrollo local
.env.development

# Producción
.env.production

# Testing
.env.test
```

---

## 🐳 Docker y Contenedores

### 5.1 Dockerfile del Backend (Node.js)
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Cambiar permisos
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# Exponer puerto
EXPOSE 8080

# Comando de inicio
CMD ["npm", "start"]
```

### 5.2 Dockerfile del Frontend (React/Vite)
```dockerfile
# frontend/Dockerfile
# Etapa de construcción
FROM node:18-alpine as builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
```

### 5.3 Configuración de Nginx para Frontend (frontend/nginx.conf)
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen 3000;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
    }
}
```

### 5.4 Docker Compose para Producción
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: mi-proyecto-db-prod
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - mi-proyecto-network
    restart: unless-stopped

  backend:
    image: tuusuario/mi-proyecto-backend:latest
    container_name: mi-proyecto-backend-prod
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - PORT=8080
    depends_on:
      - postgres
    networks:
      - mi-proyecto-network
    restart: unless-stopped

  frontend:
    image: tuusuario/mi-proyecto-frontend:latest
    container_name: mi-proyecto-frontend-prod
    networks:
      - mi-proyecto-network
    restart: unless-stopped

volumes:
  postgres_prod_data:

networks:
  mi-proyecto-network:
    driver: bridge
```

---

## 🌐 Nginx y Subdominios

### 6.1 Configuración de Nginx en el Servidor
```bash
# Crear archivo de configuración
sudo nano /etc/nginx/sites-available/miproyecto.proyectostivalpo.com
```

```nginx
# /etc/nginx/sites-available/miproyecto.proyectostivalpo.com
server {
    listen 80;
    server_name miproyecto.proyectostivalpo.com;
    
    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name miproyecto.proyectostivalpo.com;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/miproyecto.proyectostivalpo.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/miproyecto.proyectostivalpo.com/privkey.pem;
    
    # Configuración SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy para el API (backend)
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "https://miproyecto.proyectostivalpo.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://miproyecto.proyectostivalpo.com";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain charset=UTF-8';
            add_header Content-Length 0;
            return 204;
        }
    }

    # Frontend estático
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Logs
    access_log /var/log/nginx/miproyecto.access.log;
    error_log /var/log/nginx/miproyecto.error.log;
}
```

### 6.2 Activar el Sitio
```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/miproyecto.proyectostivalpo.com /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

---

## 🔄 CI/CD con GitHub Actions

### 7.1 Workflow para Backend (.github/workflows/backend-ci.yml)
```yaml
name: Backend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'backend/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'backend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
    
    - name: Install dependencies
      working-directory: ./backend
      run: npm ci
    
    - name: Run tests
      working-directory: ./backend
      run: npm test
      env:
        NODE_ENV: test
        DB_HOST: localhost
        DB_PORT: 5432
        DB_NAME: test_db
        DB_USER: postgres
        DB_PASSWORD: postgres

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: ./backend
        push: true
        tags: ${{ secrets.DOCKER_USERNAME }}/mi-proyecto-backend:latest
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: |
          cd /path/to/project
          docker-compose -f docker-compose.prod.yml pull backend
          docker-compose -f docker-compose.prod.yml up -d backend
          docker system prune -f
```

### 7.2 Workflow para Frontend (.github/workflows/frontend-ci.yml)
```yaml
name: Frontend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'frontend/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'frontend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install dependencies
      working-directory: ./frontend
      run: npm ci
    
    - name: Run linter
      working-directory: ./frontend
      run: npm run lint
    
    - name: Run tests
      working-directory: ./frontend
      run: npm test
    
    - name: Build application
      working-directory: ./frontend
      run: npm run build
      env:
        VITE_API_URL: https://miproyecto.proyectostivalpo.com/api

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: ./frontend
        push: true
        tags: ${{ secrets.DOCKER_USERNAME }}/mi-proyecto-frontend:latest
        build-args: |
          VITE_API_URL=https://miproyecto.proyectostivalpo.com/api
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: |
          cd /path/to/project
          docker-compose -f docker-compose.prod.yml pull frontend
          docker-compose -f docker-compose.prod.yml up -d frontend
          docker system prune -f
```

### 7.3 Secretos de GitHub necesarios
```
DOCKER_USERNAME=tuusuario
DOCKER_PASSWORD=tu-token-de-docker-hub
SERVER_HOST=64.176.16.195
SERVER_USER=root
SERVER_SSH_KEY=contenido-de-tu-clave-privada-ssh
```

---

## 🔒 SSL y Certificados

### 8.1 Generar Certificado SSL
```bash
# Instalar Certbot si no está instalado
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Generar certificado para el nuevo subdominio
sudo certbot --nginx -d miproyecto.proyectostivalpo.com

# Verificar renovación automática
sudo certbot renew --dry-run

# Agregar al crontab para renovación automática (si no existe)
sudo crontab -e
# Agregar línea: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 8.2 Configurar DNS
```bash
# En tu proveedor de DNS (ej: Cloudflare, GoDaddy, etc.)
# Agregar registro A:
# Nombre: miproyecto
# Tipo: A
# Valor: 64.176.16.195
# TTL: Automático o 300
```

---

## 📊 Monitoreo y Logs

### 9.1 Script de Monitoreo (scripts/monitor.sh)
```bash
#!/bin/bash
# scripts/monitor.sh

echo "=== Estado de Contenedores ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n=== Uso de Recursos ==="
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo -e "\n=== Logs Recientes del Backend ==="
docker logs --tail 10 mi-proyecto-backend-prod

echo -e "\n=== Logs Recientes del Frontend ==="
docker logs --tail 10 mi-proyecto-frontend-prod

echo -e "\n=== Estado de Nginx ==="
sudo systemctl status nginx --no-pager

echo -e "\n=== Certificados SSL ==="
sudo certbot certificates
```

### 9.2 Configuración de Logs
```bash
# Configurar logrotate para logs de Docker
sudo nano /etc/logrotate.d/docker

# Contenido:
/var/lib/docker/containers/*/*.log {
    daily
    missingok
    rotate 7
    compress
    notifempty
    create 0644 root root
    postrotate
        /bin/kill -USR1 $(cat /var/run/docker.pid 2> /dev/null) 2> /dev/null || true
    endscript
}
```

---

## ✅ Checklist Final

### 10.1 Antes del Despliegue
- [ ] Código en repositorio GitHub
- [ ] Variables de entorno configuradas
- [ ] Dockerfile creados y probados localmente
- [ ] Docker Compose funciona en local
- [ ] Tests pasando
- [ ] Build de producción funciona

### 10.2 Configuración del Servidor
- [ ] DNS configurado (registro A apuntando al servidor)
- [ ] Nginx configurado para el nuevo subdominio
- [ ] Certificado SSL generado con Certbot
- [ ] Puertos necesarios disponibles
- [ ] Docker images construidas y subidas a Docker Hub

### 10.3 CI/CD
- [ ] GitHub Actions configurado
- [ ] Secretos de GitHub configurados
- [ ] Pipeline de backend funciona
- [ ] Pipeline de frontend funciona
- [ ] Despliegue automático probado

### 10.4 Post-Despliegue
- [ ] Aplicación accesible desde el subdominio
- [ ] HTTPS funcionando correctamente
- [ ] API endpoints respondiendo
- [ ] Base de datos conectada
- [ ] Logs sin errores críticos
- [ ] Monitoreo configurado

---

## 🚀 Comandos Rápidos de Despliegue

### Desarrollo Local
```bash
# Clonar proyecto
git clone https://github.com/tuusuario/mi-nuevo-proyecto.git
cd mi-nuevo-proyecto

# Copiar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Levantar todo el stack
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### Producción
```bash
# En el servidor
cd /path/to/project
git pull origin main
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Monitoreo
```bash
# Ver estado
./scripts/monitor.sh

# Ver logs específicos
docker logs -f mi-proyecto-backend-prod
docker logs -f mi-proyecto-frontend-prod
```

---

## 📝 Notas Adicionales

1. **Puertos**: Asegúrate de usar puertos únicos para cada proyecto
2. **Base de Datos**: Cada proyecto debe tener su propia BD
3. **Secretos**: Nunca subas archivos .env al repositorio
4. **Backup**: Configura backup automático de la BD
5. **Monitoreo**: Considera usar herramientas como Grafana + Prometheus
6. **Seguridad**: Mantén Docker y dependencias actualizadas

---

*Guía creada basada en la experiencia con ProyectosTIValpo y Conciertos*
*Fecha: Octubre 2025*
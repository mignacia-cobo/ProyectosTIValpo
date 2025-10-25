# 📚 Índice de Documentación - Proyectos TI Valpo

Bienvenido al proyecto del portal web de Proyectos TI Valpo. Este documento te guiará a través de toda la documentación disponible.

---

## 📖 Documentos Principales

### 1. [README.md](./README.md) - **EMPIEZA AQUÍ**
**Descripción general del proyecto**
- Características principales
- Tecnologías utilizadas
- Estructura del proyecto
- Instalación básica
- Configuración inicial
- Comandos principales

👉 **Lee esto primero si es tu primera vez con el proyecto**

---

### 2. [QUICKSTART.md](./QUICKSTART.md) - **Inicio Rápido**
**Para empezar en 5 minutos**
- Comandos de inicio rápido
- URLs importantes
- Credenciales iniciales
- Comandos útiles más comunes

👉 **Perfecto si quieres arrancar rápidamente sin leer todo**

---

### 3. [DEVELOPMENT.md](./DEVELOPMENT.md) - **Guía de Desarrollo**
**Para desarrolladores que trabajarán en el código**
- Instalación detallada (con y sin Docker)
- Estructura del proyecto explicada
- Cómo agregar nuevas funcionalidades
- Testing y debugging
- Acceso a base de datos
- Solución de problemas comunes
- Configuración de email para desarrollo

👉 **Lee esto si vas a modificar o extender el código**

---

### 4. [DEPLOYMENT.md](./DEPLOYMENT.md) - **Guía de Despliegue**
**Para desplegar en producción (servidor Ubuntu)**
- Requisitos del servidor
- Paso a paso del despliegue
- Configuración de Nginx
- Certificados SSL con Certbot
- Backups de base de datos
- Comandos de mantenimiento
- Seguridad y firewall
- Solución de problemas en producción

👉 **Lee esto cuando vayas a subir el proyecto a tu servidor**

---

### 5. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - **Documentación de API**
**Para integrar con el backend o desarrollar el frontend**
- Listado completo de endpoints
- Autenticación JWT
- Ejemplos de peticiones y respuestas
- Códigos de estado HTTP
- Rate limiting
- Ejemplos con cURL

👉 **Consulta esto cuando necesites hacer peticiones a la API**

---

### 6. [CHANGES.md](./CHANGES.md) - **Resumen de Cambios**
**Documentación de todo lo implementado**
- Funcionalidades completadas
- Archivos creados (lista completa)
- Stack tecnológico
- Base de datos
- Seguridad implementada
- Características avanzadas

👉 **Lee esto para entender qué incluye el proyecto completo**

---

### 7. [ARCHITECTURE.md](./ARCHITECTURE.md) - **Arquitectura del Sistema**
**Diagrama y explicación técnica de la arquitectura**
- Diagrama general del sistema
- Flujo de datos
- Capas de seguridad
- Contenedores Docker
- Rutas y endpoints
- Estructura de base de datos
- Escalabilidad futura

👉 **Consulta esto para entender cómo está estructurado técnicamente**

---

### 8. [CHECKLIST.md](./CHECKLIST.md) - **Lista de Verificación**
**Checklist completo para desarrollo y despliegue**
- Pre-despliegue (desarrollo local)
- Despliegue en producción
- Verificación de funcionalidades
- Mantenimiento continuo
- Firma de aprobación

👉 **Usa esto como guía paso a paso para no olvidar nada**

---

## 📁 Archivos de Configuración

### [.env.example](./.env.example)
Variables de entorno de ejemplo. Copiar a `.env` y configurar con valores reales.

### [docker-compose.yml](./docker-compose.yml)
Configuración de Docker Compose con los 3 servicios (frontend, backend, db).

### [seed.sql](./seed.sql)
Datos de prueba para popular la base de datos.

### [start.sh](./start.sh) / [start.bat](./start.bat)
Scripts de inicio rápido para Linux/Mac y Windows.

---

## 🗂️ Estructura de Directorios

```
ProyectosTIValpo/
│
├── 📂 backend/              # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── routes/          # Rutas de la API
│   │   ├── middleware/      # Autenticación, uploads
│   │   ├── config/          # Configuración de BD
│   │   └── scripts/         # Scripts útiles
│   ├── uploads/             # Imágenes subidas
│   ├── Dockerfile           # Imagen Docker
│   └── init.sql             # Inicialización de BD
│
├── 📂 frontend/             # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas
│   │   │   ├── Home.jsx     # Página pública
│   │   │   └── admin/       # Panel de admin
│   │   └── services/        # Servicios de API
│   ├── public/              # Assets estáticos
│   └── Dockerfile           # Imagen Docker
│
└── 📂 nginx/                # Configuración Nginx
    └── proyectostivalpo.conf # Reverse proxy para producción
```

---

## 🎯 Flujos de Trabajo Comunes

### 🆕 **Primera vez usando el proyecto**
1. Lee [README.md](./README.md)
2. Sigue [QUICKSTART.md](./QUICKSTART.md)
3. Explora el sitio en http://localhost:3000

### 💻 **Desarrollo local**
1. Lee [DEVELOPMENT.md](./DEVELOPMENT.md)
2. Configura tu entorno
3. Consulta [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) cuando necesites

### 🚀 **Desplegar en producción**
1. Lee [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Usa [CHECKLIST.md](./CHECKLIST.md) como guía paso a paso
3. Sigue los pasos cuidadosamente
4. Verifica con el checklist al final

### 🔧 **Agregar nueva funcionalidad**
1. Consulta [DEVELOPMENT.md](./DEVELOPMENT.md) - "Agregar nueva funcionalidad"
2. Consulta [ARCHITECTURE.md](./ARCHITECTURE.md) para entender la estructura
3. Consulta [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) para patrones de API
4. Prueba localmente antes de desplegar

### 🐛 **Solucionar un problema**
1. Revisa logs: `docker-compose logs -f`
2. Consulta sección "Solución de problemas" en [DEVELOPMENT.md](./DEVELOPMENT.md)
3. Consulta sección "Solución de problemas" en [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📞 Contacto y Soporte

### Recursos Internos
- **Logs**: `docker-compose logs -f`
- **Estado**: `docker-compose ps`
- **Base de datos**: Ver [DEVELOPMENT.md](./DEVELOPMENT.md) sección "Base de Datos"

### Comunidad
- GitHub Issues (si aplica)
- Documentación oficial de tecnologías:
  - [React](https://react.dev/)
  - [Express](https://expressjs.com/)
  - [PostgreSQL](https://www.postgresql.org/docs/)
  - [Docker](https://docs.docker.com/)
  - [Nginx](https://nginx.org/en/docs/)

---

## ✅ Checklist de Lectura

Marca lo que has leído:

- [ ] README.md (Visión general)
- [ ] QUICKSTART.md (Inicio rápido)
- [ ] DEVELOPMENT.md (Si vas a desarrollar)
- [ ] DEPLOYMENT.md (Si vas a desplegar)
- [ ] API_DOCUMENTATION.md (Si trabajas con la API)
- [ ] CHANGES.md (Para ver qué incluye)
- [ ] ARCHITECTURE.md (Para entender la arquitectura)
- [ ] CHECKLIST.md (Guía de verificación)
- [ ] INDEX.md (Este archivo)

---

## 🎓 Nivel de Documentación por Rol

### 👨‍💼 **Usuario Final / Cliente**
- ✅ [README.md](./README.md) - Sección "Características"
- ✅ [QUICKSTART.md](./QUICKSTART.md) - Ver URLs de acceso

### 👨‍💻 **Desarrollador**
- ✅ [README.md](./README.md)
- ✅ [QUICKSTART.md](./QUICKSTART.md)
- ✅ [DEVELOPMENT.md](./DEVELOPMENT.md) ⭐
- ✅ [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) ⭐
- ✅ [ARCHITECTURE.md](./ARCHITECTURE.md) ⭐
- ✅ [CHANGES.md](./CHANGES.md)
- ✅ [CHECKLIST.md](./CHECKLIST.md)

### 🚀 **DevOps / SysAdmin**
- ✅ [README.md](./README.md)
- ✅ [DEPLOYMENT.md](./DEPLOYMENT.md) ⭐
- ✅ [CHECKLIST.md](./CHECKLIST.md) ⭐
- ✅ [ARCHITECTURE.md](./ARCHITECTURE.md)
- ✅ [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### 📊 **Project Manager**
- ✅ [README.md](./README.md)
- ✅ [CHANGES.md](./CHANGES.md) ⭐
- ✅ [QUICKSTART.md](./QUICKSTART.md)

---

## 🔄 Actualización de Documentación

Esta documentación se mantiene actualizada con cada cambio importante del proyecto.

**Última actualización**: 24 de Octubre de 2025

---

## 📝 Resumen Ultra-Rápido

**¿Qué es este proyecto?**
Portal web para Proyectos TI Valpo con admin panel para gestionar proyectos, noticias y mensajes de contacto.

**¿Qué tecnologías usa?**
React + Node.js + PostgreSQL + Docker + Nginx

**¿Cómo empiezo?**
```bash
docker-compose up -d --build
docker exec -it proyectosti_backend node src/scripts/createAdmin.js
# Abrir http://localhost:3000
```

**¿Dónde está desplegado?**
https://proyectostivalpo.com (cuando lo despliegues)

**¿Cómo consigo ayuda?**
Lee la documentación apropiada según tu necesidad (ver arriba).

---

**¡Bienvenido al proyecto! 🎉**

Cualquier duda, consulta primero este índice para encontrar el documento apropiado.

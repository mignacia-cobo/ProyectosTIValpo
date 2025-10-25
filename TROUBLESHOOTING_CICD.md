# 🔧 Solución de Problemas - CI/CD

## ❌ Error 1: "access token has insufficient scopes"

**Causa:** El Access Token de Docker Hub no tiene permisos suficientes

**Solución:**
1. Ve a: https://hub.docker.com/settings/security
2. Elimina el token anterior
3. Crea nuevo token con:
   - **Permissions: Read, Write, Delete** ✅
4. Ve a GitHub: Settings > Secrets > DOCKER_PASSWORD
5. Click "Update secret"
6. Pega el nuevo token
7. Re-ejecuta el workflow en Actions

---

## ❌ Error 2: "Permission denied" al copiar archivos

**Causa:** El directorio no existe o no tiene permisos

**Solución:** ✅ YA CORREGIDO en el último commit
- El workflow ahora crea el directorio automáticamente
- Configura los permisos correctos

---

## ❌ Error 3: "403 Forbidden" al hacer push

**Causa:** Problema de autenticación con GitHub

**Solución:**
1. Verifica tu token de GitHub
2. O usa SSH en lugar de HTTPS:
```powershell
git remote set-url origin git@github.com:mignacia-cobo/ProyectosTIValpo.git
```

---

## ❌ Error 4: Job "deploy" no se ejecuta

**Causa:** Los jobs anteriores fallaron

**Solución:**
- El job "deploy" solo se ejecuta si "build-and-push" tiene éxito
- Revisa los logs de "build-and-push"
- Corrige el error y vuelve a hacer push

---

## ✅ Verificar que todo funciona

### 1. En GitHub Actions:
```
✅ Build and Test: Success
✅ Build and Push: Success  
✅ Deploy: Success
```

### 2. En Docker Hub:
- Ve a: https://hub.docker.com/u/micobo
- Deberías ver:
  - `micobo/proyectosti-backend:latest`
  - `micobo/proyectosti-frontend:latest`

### 3. En el Servidor:
```bash
ssh root@64.176.16.195
cd /var/www/proyectostivalpo
docker compose ps

# Deberías ver 3 contenedores corriendo:
# - proyectosti_db
# - proyectosti_backend
# - proyectosti_frontend
```

### 4. En el Sitio Web:
- http://64.176.16.195:3000 (debería cargar)
- Después de configurar DNS: https://proyectostivalpo.com

---

## 🔄 Re-ejecutar un Workflow Fallido

1. Ve a: https://github.com/mignacia-cobo/ProyectosTIValpo/actions
2. Click en el workflow que falló
3. Click en "Re-run jobs"
4. Selecciona "Re-run failed jobs" o "Re-run all jobs"

---

## 📝 Checklist de Troubleshooting

- [ ] DOCKER_USERNAME correcto en GitHub Secrets
- [ ] DOCKER_PASSWORD con permisos Read, Write, Delete
- [ ] SERVER_HOST = 64.176.16.195
- [ ] SERVER_USER = root
- [ ] SERVER_PASSWORD correcta
- [ ] Todas las variables de entorno configuradas (15 total)
- [ ] Docker Hub muestra las imágenes
- [ ] Servidor accesible por SSH
- [ ] Directorio /var/www/proyectostivalpo creado
- [ ] Contenedores corriendo en el servidor

---

## 🆘 Si nada funciona

### Opción: Deployment Manual

```bash
# 1. Conectarse al servidor
ssh root@64.176.16.195

# 2. Crear directorio
mkdir -p /var/www/proyectostivalpo
cd /var/www/proyectostivalpo

# 3. Clonar repositorio
git clone https://github.com/mignacia-cobo/ProyectosTIValpo.git .

# 4. Configurar .env (copiar valores de github-secrets.txt)
nano .env

# 5. Login a Docker Hub
docker login -u micobo

# 6. Pull de imágenes
docker compose pull

# 7. Iniciar contenedores
docker compose up -d

# 8. Verificar
docker compose ps
docker compose logs -f
```

---

## 📞 Contacto

- Email: ma.cobo@profesor.duoc.cl
- Repositorio: https://github.com/mignacia-cobo/ProyectosTIValpo
- Documentación: CICD_SETUP.md

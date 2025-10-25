# 🚀 GUÍA RÁPIDA: CI/CD con GitHub Actions

## ✅ Lo que se ha configurado:

1. **GitHub Actions Workflow** (`.github/workflows/ci-cd.yml`)
   - Build automático
   - Tests automáticos
   - Deploy automático a producción

2. **Docker Hub Integration**
   - Imágenes se suben automáticamente
   - Versionado por commit SHA
   - Tag `latest` para producción

3. **Deployment automático**
   - Pull de nuevas imágenes
   - Restart de contenedores
   - Zero downtime

---

## 📝 PASOS PARA ACTIVAR CI/CD:

### 1️⃣ Generar Secrets (5 minutos)

```powershell
# Ejecutar el script generador
.\generate-secrets.ps1
```

Este script:
- ✅ Genera contraseñas seguras automáticamente
- ✅ Te pide la información necesaria
- ✅ Crea archivo `github-secrets.txt` con todo listo

### 2️⃣ Configurar GitHub Secrets (5 minutos)

1. **Ir a GitHub:**
   ```
   Tu Repositorio > Settings > Secrets and variables > Actions
   ```

2. **Agregar cada secret:**
   - Click en "New repository secret"
   - Copiar el nombre y valor del archivo `github-secrets.txt`
   - Repetir para todos los secrets

**Secrets necesarios (15 en total):**
- ✅ DOCKER_USERNAME
- ✅ DOCKER_PASSWORD
- ✅ SERVER_HOST
- ✅ SERVER_USER
- ✅ SERVER_PASSWORD
- ✅ DB_USER
- ✅ DB_PASSWORD
- ✅ DB_NAME
- ✅ JWT_SECRET
- ✅ SMTP_HOST
- ✅ SMTP_PORT
- ✅ SMTP_USER
- ✅ SMTP_PASS
- ✅ ADMIN_EMAIL

### 3️⃣ Push al repositorio (1 minuto)

```powershell
git add .
git commit -m "feat: CI/CD con GitHub Actions y Docker Hub"
git push origin main
```

### 4️⃣ Monitorear Deployment (10-15 minutos)

1. **En GitHub:**
   ```
   Repositorio > Actions > Ver workflow ejecutándose
   ```

2. **Fases del workflow:**
   - 🔨 Build and Test (2-3 min)
   - 📦 Build and Push (5-7 min)
   - 🚀 Deploy (2-3 min)

3. **Ver en el servidor:**
   ```powershell
   ssh root@64.176.16.195
   cd /var/www/proyectostivalpo
   docker compose ps
   docker compose logs -f
   ```

---

## 🔄 FLUJO DE TRABAJO DIARIO:

### Cada vez que hagas un cambio:

```powershell
# 1. Probar localmente (opcional)
docker compose -f docker-compose.dev.yml up -d

# 2. Commit
git add .
git commit -m "feat: descripción del cambio"

# 3. Push (activa el deployment automático)
git push origin main

# 4. Monitorear en GitHub Actions
# 5. Verificar en https://proyectostivalpo.com
```

**¡Eso es todo!** El resto es automático 🎉

---

## 📊 ESTADOS DEL WORKFLOW:

| Estado | Descripción | Acción |
|--------|-------------|--------|
| 🟡 En progreso | Building/Testing/Deploying | Esperar |
| ✅ Success | Todo funcionó correctamente | Verificar sitio |
| ❌ Failed | Algo falló | Ver logs, corregir, re-push |
| ⚠️ Cancelled | Manualmente cancelado | Re-ejecutar si fue error |

---

## 🐛 PROBLEMAS COMUNES:

### ❌ Error en Build and Push
```
Causa: Credenciales de Docker Hub incorrectas
Solución: Verificar DOCKER_USERNAME y DOCKER_PASSWORD en GitHub Secrets
```

### ❌ Error en Deploy
```
Causa: No puede conectar al servidor
Solución: Verificar SERVER_HOST, SERVER_USER, SERVER_PASSWORD
```

### ❌ Contenedores no inician
```
Causa: Variables de entorno faltantes
Solución: Verificar todos los secrets en GitHub
```

### ⚠️ Deployment lento
```
Causa: Descargando imágenes grandes
Solución: Normal en el primer deployment (5-10 min)
```

---

## 🎯 VENTAJAS DE ESTE SETUP:

✅ **Push to Deploy**: Solo haz `git push` y todo se despliega automáticamente

✅ **Docker Hub**: Las imágenes están disponibles públicamente o privadamente

✅ **Rollback fácil**: Si algo falla, las imágenes anteriores están en Docker Hub

✅ **Consistencia**: Misma imagen en desarrollo y producción

✅ **Historial**: Cada commit tiene su propia imagen (por SHA)

✅ **Colaboración**: Otros desarrolladores pueden contribuir fácilmente

---

## 📈 PRÓXIMOS PASOS OPCIONALES:

### Notificaciones por Email/Slack
Añadir al workflow para recibir notificaciones de deployments

### Tests automáticos
Añadir scripts de testing en package.json

### Staging environment
Crear una rama `develop` que despliegue a servidor de staging

### Rollback automático
Si el deployment falla, revertir a la versión anterior

### Monitoreo
Integrar con servicios como Datadog, New Relic, etc.

---

## 📚 ARCHIVOS IMPORTANTES:

```
.github/
  workflows/
    ci-cd.yml              # Workflow principal

docker-compose.yml         # Producción (usa imágenes de Docker Hub)
docker-compose.dev.yml     # Desarrollo (construye localmente)

generate-secrets.ps1       # Script para generar secrets
github-secrets.txt         # Secrets generados (NO SUBIR A GITHUB)

CICD_SETUP.md             # Guía completa detallada
QUICKSTART_CICD.md        # Esta guía rápida
```

---

## ✅ CHECKLIST FINAL:

- [ ] Docker Hub: Cuenta creada
- [ ] Docker Hub: Access Token generado
- [ ] Script: `generate-secrets.ps1` ejecutado
- [ ] GitHub: 15 secrets configurados
- [ ] Git: Commit con archivos de CI/CD
- [ ] Git: Push a rama main
- [ ] GitHub Actions: Workflow ejecutado exitosamente
- [ ] Docker Hub: Imágenes visibles en repositorios
- [ ] Servidor: Contenedores actualizados
- [ ] Web: Sitio funcionando en https://proyectostivalpo.com

---

## 🆘 SOPORTE:

- **Documentación completa**: `CICD_SETUP.md`
- **Workflow file**: `.github/workflows/ci-cd.yml`
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Docker Hub Docs**: https://docs.docker.com/docker-hub/

---

## 🎉 ¡ÉXITO!

Ahora tienes un pipeline CI/CD completamente funcional:

```
Code Change → Git Push → GitHub Actions → Docker Hub → Production Server
```

**Deploy time: ~10-15 minutos**
**Esfuerzo manual: 0 (después del setup inicial)**

**¡Feliz coding! 🚀**

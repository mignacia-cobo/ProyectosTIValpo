# 🚀 GUÍA RÁPIDA DE DESPLIEGUE

## 📦 Opción 1: DESPLIEGUE AUTOMÁTICO DESDE WINDOWS (Recomendado)

### Ejecutar desde PowerShell en tu PC:

```powershell
cd C:\Users\Maria\Documents\GitHub\RAOP_V2_DEV\ProyectosTIValpo
.\deploy-windows.ps1
```

Este script:
- ✅ Copia automáticamente todos los archivos al servidor
- ✅ Configura permisos
- ✅ Te conecta al servidor

---

## 🖥️ Opción 2: DESPLIEGUE MANUAL

### 1️⃣ Conectarse al servidor:
```powershell
ssh linuxuser@64.176.16.195
# Contraseña: J4c#[Ga2.D5oTxMt
```

### 2️⃣ Subir archivos con WinSCP:
- Descargar: https://winscp.net/
- Host: 64.176.16.195
- Usuario: linuxuser
- Contraseña: `J4c#[Ga2.D5oTxMt`
- Subir a: /var/www/proyectostivalpo

### 3️⃣ En el servidor, ejecutar:
```bash
cd /var/www/proyectostivalpo
chmod +x deploy.sh
bash deploy.sh
```

### 4️⃣ Configurar variables de entorno:
```bash
nano .env
```

**Importante - Configurar estas variables:**

```env
# Crear en https://myaccount.google.com/apppasswords
SMTP_PASS=xxxx_xxxx_xxxx_xxxx

# Estas se generan automáticamente, verificar que existen
DB_PASSWORD=xxxxx
JWT_SECRET=xxxxx
```

Guardar: `Ctrl + O`, Enter, `Ctrl + X`

### 5️⃣ Iniciar contenedores:
```bash
docker compose up -d
```

### 6️⃣ Crear usuario admin:
```bash
docker compose exec backend node src/scripts/createAdmin.js
```

### 7️⃣ Configurar SSL (después de configurar DNS):
```bash
sudo certbot --nginx -d proyectostivalpo.com -d www.proyectostivalpo.com
```

---

## 🌐 CONFIGURACIÓN DNS

En tu proveedor de dominio, crear:

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | @ | 64.176.16.195 | 3600 |
| A | www | 64.176.16.195 | 3600 |

⏱️ Esperar 1-2 horas para propagación

**Verificar DNS:**
```powershell
nslookup proyectostivalpo.com
# Debe devolver: 64.176.16.195
```

---

## ✅ CHECKLIST FINAL

- [ ] Archivos subidos al servidor
- [ ] Script deploy.sh ejecutado
- [ ] Variables .env configuradas
- [ ] DNS configurado
- [ ] Contenedores Docker iniciados (`docker compose ps`)
- [ ] Usuario administrador creado
- [ ] SSL instalado con Certbot
- [ ] Sitio accesible: https://proyectostivalpo.com

---

## 🆘 COMANDOS ÚTILES

```bash
# Ver estado de contenedores
docker compose ps

# Ver logs
docker compose logs -f

# Reiniciar servicios
docker compose restart

# Detener todo
docker compose down

# Iniciar todo
docker compose up -d

# Backup base de datos
docker compose exec db pg_dump -U postgres proyectosti > backup.sql
```

---

## 📞 SOPORTE

Ver guía completa: **DEPLOYMENT_SERVER.md**

Email: ma.cobo@profesor.duoc.cl

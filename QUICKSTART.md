# 🚀 Inicio Rápido - Proyectos TI Valpo

## Para Desarrollo Local (5 minutos)

### Windows
```cmd
1. Abrir PowerShell o CMD
2. cd ruta\al\proyecto
3. start.bat
4. Esperar a que los contenedores inicien
5. docker exec -it proyectosti_backend node src/scripts/createAdmin.js
6. Abrir: http://localhost:3000
```

### Linux / Mac
```bash
1. cd /ruta/al/proyecto
2. chmod +x start.sh
3. ./start.sh
4. docker exec -it proyectosti_backend node src/scripts/createAdmin.js
5. Abrir: http://localhost:3000
```

## Para Producción (30 minutos)

```bash
# En el servidor Ubuntu
ssh user@servidor
cd /var/www
git clone <repo-url> proyectostivalpo
cd proyectostivalpo

# Configurar
cp .env.example .env
nano .env  # Editar con datos reales

# Levantar servicios
docker-compose up -d --build

# Crear admin
docker exec -it proyectosti_backend node src/scripts/createAdmin.js

# Configurar Nginx
sudo cp nginx/proyectostivalpo.conf /etc/nginx/sites-available/proyectostivalpo.com
sudo ln -s /etc/nginx/sites-available/proyectostivalpo.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL con Certbot
sudo certbot --nginx -d proyectostivalpo.com -d www.proyectostivalpo.com

# Listo!
# Abrir: https://proyectostivalpo.com
```

## URLs Importantes

### Desarrollo
- 🏠 Home: http://localhost:3000
- 🔐 Admin: http://localhost:3000/admin
- 🔌 API: http://localhost:5000/api

### Producción
- 🏠 Home: https://proyectostivalpo.com
- 🔐 Admin: https://proyectostivalpo.com/admin
- 🔌 API: https://proyectostivalpo.com/api

## Comandos Útiles

```bash
# Ver logs
docker-compose logs -f

# Reiniciar
docker-compose restart

# Detener
docker-compose down

# Actualizar código
git pull
docker-compose up -d --build

# Backup DB
docker exec proyectosti_db pg_dump -U postgres proyectosti > backup.sql
```

## Credenciales Iniciales

Las creas tú al ejecutar:
```bash
docker exec -it proyectosti_backend node src/scripts/createAdmin.js
```

## Ayuda

- 📖 Documentación completa: `README.md`
- 💻 Desarrollo local: `DEVELOPMENT.md`
- 🚀 Despliegue: `DEPLOYMENT.md`
- 📡 API: `API_DOCUMENTATION.md`

## Soporte

¿Problemas? Revisa los logs:
```bash
docker-compose logs -f
```

---

**¡Listo para usar!** 🎉

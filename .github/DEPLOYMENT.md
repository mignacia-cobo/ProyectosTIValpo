# Deployment Notes

## Última actualización: 2025-01-25

### Cambios implementados:
- ✅ Galería de imágenes con carrusel en noticias
- ✅ Subida de múltiples imágenes desde panel de administración
- ✅ Backend actualizado para manejar upload.fields
- ✅ Frontend con helper getImageUrl para URLs correctas

### Configuración requerida en producción:
- Base de datos: `readme_to_recover`
- DB_USER: `postgres`
- DB_PASSWORD: `postgres`
- Variables de entorno verificadas en GitHub Secrets

### Pendiente:
- Actualizar secret DB_NAME en GitHub Actions a `readme_to_recover`

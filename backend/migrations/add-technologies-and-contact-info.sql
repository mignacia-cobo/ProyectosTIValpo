-- Agregar secciones de technologies y contactInfo a site_config
-- Fecha: 2025-10-26

-- Insertar configuración de tecnologías
INSERT INTO site_config (section, config)
VALUES (
  'technologies',
  '{
    "items": [
      "React",
      "Node.js",
      "PostgreSQL",
      "Docker"
    ]
  }'::jsonb
)
ON CONFLICT (section) DO UPDATE
SET config = EXCLUDED.config,
    updated_at = CURRENT_TIMESTAMP;

-- Insertar configuración de información de contacto
INSERT INTO site_config (section, config)
VALUES (
  'contactInfo',
  '{
    "email": {
      "icon": "Mail",
      "title": "Email",
      "value": "contacto@proyectostivalpo.com",
      "color": "primary"
    },
    "schedule": {
      "icon": "Clock",
      "title": "Horario",
      "value": "24/7 Disponible",
      "color": "purple"
    },
    "location": {
      "icon": "MapPin",
      "title": "Ubicación",
      "value": "Valparaíso, Chile",
      "color": "pink"
    }
  }'::jsonb
)
ON CONFLICT (section) DO UPDATE
SET config = EXCLUDED.config,
    updated_at = CURRENT_TIMESTAMP;

-- Verificar los datos insertados
SELECT section, config FROM site_config WHERE section IN ('technologies', 'contactInfo');

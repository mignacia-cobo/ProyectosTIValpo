-- Migrar datos de footer desde settings a site_config
-- Fecha: 2025-10-26

-- Insertar configuración del footer
INSERT INTO site_config (section, config)
VALUES (
  'footer',
  '{
    "site_name": "Proyectos TI Valpo",
    "site_description": "Plataforma de gestión de proyectos de innovación tecnológica en Valparaíso",
    "email": "info@proyectostivalpo.com",
    "phone": "+56 9 1234 5678",
    "address": "Valparaíso, Chile"
  }'::jsonb
)
ON CONFLICT (section) DO UPDATE
SET config = EXCLUDED.config,
    updated_at = CURRENT_TIMESTAMP;

-- Verificar los datos insertados
SELECT section, config FROM site_config WHERE section = 'footer';

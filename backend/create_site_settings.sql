-- Crear tabla de configuración del sitio
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  site_name VARCHAR(255) NOT NULL DEFAULT 'Proyectos TI Valpo',
  site_description TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  address VARCHAR(255),
  github_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  facebook_url VARCHAR(255),
  twitter_url VARCHAR(255),
  instagram_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar valores por defecto
INSERT INTO site_settings (site_name, site_description, email, phone, address, github_url, linkedin_url)
VALUES (
  'Proyectos TI Valpo',
  'Desarrollamos y mantenemos soluciones tecnológicas innovadoras para optimizar procesos y mejorar la experiencia digital.',
  'info@proyectostivalpo.com',
  '+56 9 1234 5678',
  'Valparaíso, Chile',
  'https://github.com',
  'https://linkedin.com'
)
ON CONFLICT DO NOTHING;

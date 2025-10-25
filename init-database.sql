-- Script para inicializar la base de datos ProyectosTI
-- Base de datos: readme_to_recover

-- Crear tabla users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla projects
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  image_url VARCHAR(500),
  repository_url VARCHAR(500),
  url VARCHAR(500),
  demo_url VARCHAR(500),
  technologies TEXT,
  created_by INTEGER REFERENCES users(id),
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla news
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  category VARCHAR(100),
  image_url VARCHAR(500),
  author_id INTEGER REFERENCES users(id),
  published BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario admin (password: mico1234)
-- Hash generado con bcrypt rounds=10: $2b$10$N9qo8uLOickgx2ZMRZoMye7FRNv6ze4c5j23Qb9uN8ULvDNLKCzqW
INSERT INTO users (name, email, password, role)
VALUES (
  'Administrador',
  'ma.cobo@profesor.duoc.cl',
  '$2b$10$N9qo8uLOickgx2ZMRZoMye7FRNv6ze4c5j23Qb9uN8ULvDNLKCzqW',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insertar proyecto de ejemplo
INSERT INTO projects (name, title, description, category, status, image_url, repository_url, url, technologies, created_by, active, order_index)
VALUES (
  'Portal ProyectosTI',
  'Portal ProyectosTI',
  'Portal web para gestión de proyectos de Ingeniería en Informática',
  'Web Application',
  'active',
  'https://via.placeholder.com/400x300',
  'https://github.com/mignacia-cobo/ProyectosTIValpo',
  'https://proyectostivalpo.com',
  'React, Node.js, PostgreSQL, Docker',
  1,
  true,
  0
) ON CONFLICT DO NOTHING;

-- Insertar noticias de ejemplo
INSERT INTO news (title, content, category, image_url, author_id, published, active, published_date)
VALUES 
  (
    'Bienvenidos al Portal ProyectosTI',
    'Nos complace presentar el nuevo portal de proyectos de Ingeniería en Informática de Duoc UC.',
    'Anuncios',
    'https://via.placeholder.com/600x400',
    1,
    true,
    true,
    CURRENT_TIMESTAMP
  ),
  (
    'Nuevos proyectos disponibles',
    'Hemos agregado una nueva sección para explorar proyectos estudiantiles destacados.',
    'Proyectos',
    'https://via.placeholder.com/600x400',
    1,
    true,
    true,
    CURRENT_TIMESTAMP - INTERVAL '1 day'
  ),
  (
    'Sistema de gestión actualizado',
    'El sistema ha sido actualizado con nuevas funcionalidades para mejorar la experiencia de usuario.',
    'Tecnología',
    'https://via.placeholder.com/600x400',
    1,
    true,
    true,
    CURRENT_TIMESTAMP - INTERVAL '2 days'
  )
ON CONFLICT DO NOTHING;

-- Mostrar resumen
SELECT 'Usuarios creados:' as info, COUNT(*) as total FROM users
UNION ALL
SELECT 'Proyectos creados:', COUNT(*) FROM projects
UNION ALL
SELECT 'Noticias creadas:', COUNT(*) FROM news;

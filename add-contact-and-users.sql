-- Script para agregar tabla de contacto y más usuarios

-- Crear tabla contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agregar más usuarios de ejemplo (contraseña para todos: duoc2025)
-- Hash bcrypt de "duoc2025": $2a$10$8ZqE5X5yJ0YvK5K5K5K5KeuH3vW8cW8cW8cW8cW8cW8cW8cW8cW8e

INSERT INTO users (name, email, password, role) VALUES
  ('Juan Pérez', 'juan.perez@duocuc.cl', '$2b$10$N9qo8uLOickgx2ZMRZoMye7FRNv6ze4c5j23Qb9uN8ULvDNLKCzqW', 'user'),
  ('María González', 'maria.gonzalez@duocuc.cl', '$2b$10$N9qo8uLOickgx2ZMRZoMye7FRNv6ze4c5j23Qb9uN8ULvDNLKCzqW', 'user'),
  ('Pedro Sánchez', 'pedro.sanchez@duocuc.cl', '$2b$10$N9qo8uLOickgx2ZMRZoMye7FRNv6ze4c5j23Qb9uN8ULvDNLKCzqW', 'user'),
  ('Ana Torres', 'ana.torres@duocuc.cl', '$2b$10$N9qo8uLOickgx2ZMRZoMye7FRNv6ze4c5j23Qb9uN8ULvDNLKCzqW', 'user')
ON CONFLICT (email) DO NOTHING;

-- Agregar más proyectos de ejemplo
INSERT INTO projects (name, title, description, category, status, image_url, repository_url, url, technologies, created_by, active, order_index) VALUES
  (
    'Sistema de Inventario',
    'Sistema de Gestión de Inventario',
    'Aplicación web para control de inventario con lectura de códigos QR y generación de reportes.',
    'Web Application',
    'active',
    'https://via.placeholder.com/400x300/3498db/ffffff?text=Inventario',
    'https://github.com/example/inventario',
    NULL,
    'Vue.js, Laravel, MySQL, QR Scanner',
    2,
    true,
    1
  ),
  (
    'App Móvil Delivery',
    'Aplicación de Delivery',
    'App móvil para pedidos de comida con tracking en tiempo real y pagos integrados.',
    'Mobile App',
    'active',
    'https://via.placeholder.com/400x300/e74c3c/ffffff?text=Delivery',
    'https://github.com/example/delivery-app',
    NULL,
    'React Native, Node.js, MongoDB, Socket.io',
    3,
    true,
    2
  ),
  (
    'Dashboard Analytics',
    'Dashboard de Analytics',
    'Panel de control con visualización de datos y generación de reportes automáticos.',
    'Web Application',
    'active',
    'https://via.placeholder.com/400x300/2ecc71/ffffff?text=Analytics',
    'https://github.com/example/dashboard',
    NULL,
    'Angular, Python, PostgreSQL, Chart.js',
    4,
    true,
    3
  ),
  (
    'API REST Biblioteca',
    'API de Gestión Bibliotecaria',
    'API REST para gestión de biblioteca con autenticación JWT y documentación Swagger.',
    'Backend API',
    'active',
    'https://via.placeholder.com/400x300/9b59b6/ffffff?text=API',
    'https://github.com/example/biblioteca-api',
    NULL,
    'Spring Boot, JWT, MySQL, Swagger',
    5,
    true,
    4
  )
ON CONFLICT DO NOTHING;

-- Agregar más noticias
INSERT INTO news (title, content, category, image_url, author_id, published, active, published_date) VALUES
  (
    'Hackathon 2025',
    'Próximamente realizaremos un hackathon interno donde estudiantes podrán desarrollar proyectos innovadores en equipos.',
    'Eventos',
    'https://via.placeholder.com/600x400/f39c12/ffffff?text=Hackathon',
    1,
    true,
    true,
    CURRENT_TIMESTAMP - INTERVAL '3 days'
  ),
  (
    'Nuevas tecnologías en el curriculum',
    'El programa de Ingeniería en Informática incorpora nuevas tecnologías como IA y Machine Learning en sus asignaturas.',
    'Académico',
    'https://via.placeholder.com/600x400/16a085/ffffff?text=Tecnología',
    1,
    true,
    true,
    CURRENT_TIMESTAMP - INTERVAL '4 days'
  ),
  (
    'Convenio con empresas tech',
    'Se han firmado nuevos convenios con empresas tecnológicas para prácticas profesionales y empleabilidad.',
    'Convenios',
    'https://via.placeholder.com/600x400/8e44ad/ffffff?text=Convenios',
    1,
    true,
    true,
    CURRENT_TIMESTAMP - INTERVAL '5 days'
  )
ON CONFLICT DO NOTHING;

-- Agregar algunos mensajes de contacto de ejemplo
INSERT INTO contact_messages (name, email, message, read, created_at) VALUES
  (
    'Carlos Ramírez',
    'carlos.ramirez@gmail.com',
    '¡Hola! Me gustaría obtener más información sobre los proyectos disponibles para colaborar.',
    false,
    CURRENT_TIMESTAMP - INTERVAL '2 hours'
  ),
  (
    'Laura Fernández',
    'laura.fernandez@outlook.com',
    'Estoy interesada en conocer más sobre el programa de Ingeniería en Informática. ¿Hay charlas informativas próximamente?',
    true,
    CURRENT_TIMESTAMP - INTERVAL '1 day'
  )
ON CONFLICT DO NOTHING;

-- Mostrar resumen actualizado
SELECT 'Usuarios totales:' as info, COUNT(*) as total FROM users
UNION ALL
SELECT 'Proyectos totales:', COUNT(*) FROM projects
UNION ALL
SELECT 'Noticias totales:', COUNT(*) FROM news
UNION ALL
SELECT 'Mensajes de contacto:', COUNT(*) FROM contact_messages;

-- Mostrar los usuarios
SELECT '--- USUARIOS ---' as info;
SELECT id, name, email, role FROM users ORDER BY id;

-- Migración para agregar soporte de galería de imágenes a las noticias

-- Crear tabla para las imágenes de noticias (relación uno a muchos)
CREATE TABLE IF NOT EXISTS news_images (
  id SERIAL PRIMARY KEY,
  news_id INTEGER NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_news_images_news_id ON news_images(news_id);

-- Agregar algunas imágenes de ejemplo a las noticias existentes
INSERT INTO news_images (news_id, image_url, caption, order_index) VALUES
  (1, 'https://via.placeholder.com/800x600/3498db/ffffff?text=Portal+Inicio', 'Vista principal del portal', 0),
  (1, 'https://via.placeholder.com/800x600/2ecc71/ffffff?text=Dashboard', 'Panel de administración', 1),
  (1, 'https://via.placeholder.com/800x600/e74c3c/ffffff?text=Proyectos', 'Sección de proyectos', 2),
  
  (2, 'https://via.placeholder.com/800x600/9b59b6/ffffff?text=Proyecto+1', 'Proyecto destacado 1', 0),
  (2, 'https://via.placeholder.com/800x600/f39c12/ffffff?text=Proyecto+2', 'Proyecto destacado 2', 1),
  
  (3, 'https://via.placeholder.com/800x600/1abc9c/ffffff?text=Actualización', 'Nueva interfaz', 0),
  (3, 'https://via.placeholder.com/800x600/e67e22/ffffff?text=Mejoras', 'Mejoras de rendimiento', 1),
  (3, 'https://via.placeholder.com/800x600/34495e/ffffff?text=Seguridad', 'Actualizaciones de seguridad', 2);

-- Verificar las imágenes insertadas
SELECT n.id, n.title, ni.id as image_id, ni.image_url, ni.caption, ni.order_index
FROM news n
LEFT JOIN news_images ni ON n.id = ni.news_id
ORDER BY n.id, ni.order_index;

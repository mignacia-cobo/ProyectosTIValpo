-- Corregir URLs de imágenes en proyectos y noticias

-- Actualizar URLs de imágenes en projects
UPDATE projects SET image_url = 'https://via.placeholder.com/400x300' WHERE id = 1;
UPDATE projects SET image_url = 'https://via.placeholder.com/400x300/3498db/ffffff?text=Inventario' WHERE id = 2;
UPDATE projects SET image_url = 'https://via.placeholder.com/400x300/e74c3c/ffffff?text=Delivery' WHERE id = 3;
UPDATE projects SET image_url = 'https://via.placeholder.com/400x300/2ecc71/ffffff?text=Analytics' WHERE id = 4;
UPDATE projects SET image_url = 'https://via.placeholder.com/400x300/9b59b6/ffffff?text=API' WHERE id = 5;

-- Actualizar URLs de imágenes en news
UPDATE news SET image_url = 'https://via.placeholder.com/600x400' WHERE id IN (1, 2, 3);
UPDATE news SET image_url = 'https://via.placeholder.com/600x400/f39c12/ffffff?text=Hackathon' WHERE id = 4;
UPDATE news SET image_url = 'https://via.placeholder.com/600x400/16a085/ffffff?text=Tecnologia' WHERE id = 5;
UPDATE news SET image_url = 'https://via.placeholder.com/600x400/8e44ad/ffffff?text=Convenios' WHERE id = 6;

-- Verificar las actualizaciones
SELECT 'Proyectos actualizados:' as info;
SELECT id, name, image_url FROM projects ORDER BY id;

SELECT 'Noticias actualizadas:' as info;
SELECT id, title, image_url FROM news ORDER BY id;

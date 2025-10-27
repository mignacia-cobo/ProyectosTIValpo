-- Crear sistema de foro con moderación
-- Fecha: 2025-10-26

-- Tabla de publicaciones del foro
CREATE TABLE IF NOT EXISTS forum_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de comentarios en publicaciones
CREATE TABLE IF NOT EXISTS forum_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    is_admin_reply BOOLEAN DEFAULT false,
    admin_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_forum_posts_status ON forum_posts(status);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_status ON forum_comments(status);

-- Trigger para actualizar updated_at en posts
CREATE OR REPLACE FUNCTION update_forum_posts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_forum_posts_timestamp
BEFORE UPDATE ON forum_posts
FOR EACH ROW
EXECUTE FUNCTION update_forum_posts_timestamp();

-- Trigger para actualizar updated_at en comments
CREATE OR REPLACE FUNCTION update_forum_comments_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_forum_comments_timestamp
BEFORE UPDATE ON forum_comments
FOR EACH ROW
EXECUTE FUNCTION update_forum_comments_timestamp();

-- Datos de ejemplo (opcional)
INSERT INTO forum_posts (title, content, author_name, author_email, status, approved_at)
VALUES 
(
    '¿Cómo empezar con React?',
    'Hola a todos, soy nuevo en React y me gustaría saber por dónde empezar. ¿Alguna recomendación de cursos o tutoriales?',
    'Juan Pérez',
    'juan.perez@example.com',
    'approved',
    CURRENT_TIMESTAMP
),
(
    'Mejores prácticas con Node.js',
    '¿Cuáles son las mejores prácticas que recomiendan para estructurar un proyecto con Node.js y Express?',
    'María González',
    'maria.gonzalez@example.com',
    'approved',
    CURRENT_TIMESTAMP
);

-- Comentarios de ejemplo
INSERT INTO forum_comments (post_id, content, author_name, author_email, status, approved_at)
VALUES 
(
    1,
    'Te recomiendo empezar por la documentación oficial de React. Es muy completa y tiene buenos ejemplos.',
    'Carlos López',
    'carlos.lopez@example.com',
    'approved',
    CURRENT_TIMESTAMP
),
(
    1,
    'Yo aprendí mucho con el curso de FreeCodeCamp. Es gratuito y muy completo.',
    'Ana Torres',
    'ana.torres@example.com',
    'approved',
    CURRENT_TIMESTAMP
);

-- Verificar que las tablas se crearon correctamente
SELECT 'Tablas del foro creadas exitosamente' AS status;
SELECT COUNT(*) as total_posts FROM forum_posts;
SELECT COUNT(*) as total_comments FROM forum_comments;

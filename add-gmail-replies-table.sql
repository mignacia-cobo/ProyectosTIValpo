-- Script para crear tabla de respuestas de Gmail

-- Crear tabla contact_replies para almacenar respuestas de usuarios
CREATE TABLE IF NOT EXISTS contact_replies (
    id SERIAL PRIMARY KEY,
    message_id INTEGER NOT NULL REFERENCES contact_messages(id) ON DELETE CASCADE,
    gmail_message_id VARCHAR(255) UNIQUE NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    subject TEXT,
    body_text TEXT,
    body_html TEXT,
    received_at TIMESTAMP NOT NULL,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_replies_message_id ON contact_replies(message_id);
CREATE INDEX IF NOT EXISTS idx_replies_gmail_id ON contact_replies(gmail_message_id);
CREATE INDEX IF NOT EXISTS idx_replies_received ON contact_replies(received_at);

-- Agregar columna para almacenar el Message-ID del correo enviado
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS sent_message_id VARCHAR(255);

-- Ver estructura de la tabla
\d contact_replies;

-- Mostrar resumen
SELECT 'Tabla contact_replies creada exitosamente' as resultado;

-- Script para agregar campos de respuesta a contact_messages

-- Agregar columnas para trackear respuestas
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS replied BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS reply_message TEXT;

-- Verificar cambios
SELECT 
    column_name, 
    data_type, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'contact_messages' 
ORDER BY ordinal_position;

-- Ver estructura actualizada
\d contact_messages;

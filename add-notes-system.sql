-- Script para agregar sistema de notas internas

-- Agregar columnas para notas y seguimiento
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS last_checked_by VARCHAR(255);

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_contact_last_checked ON contact_messages(last_checked_at);

-- Verificar cambios
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'contact_messages' 
ORDER BY ordinal_position;

-- Ver estructura actualizada
\d contact_messages;

SELECT 'Sistema de notas agregado exitosamente' as resultado;

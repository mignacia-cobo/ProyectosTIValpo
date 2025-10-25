-- Verificar estructura de la tabla news
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'news'
ORDER BY ordinal_position;

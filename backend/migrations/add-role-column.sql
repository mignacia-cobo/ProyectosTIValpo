-- Migración: Agregar columna role a tabla users
-- Fecha: 2025-10-25
-- Descripción: Permite asignar roles (admin/user) a los usuarios del sistema

-- Agregar columna role si no existe
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Actualizar usuarios existentes que deberían ser admin (ajustar según necesidad)
UPDATE users SET role = 'admin' WHERE email = 'ma.cobo@profesor.duoc.cl';

-- Verificar que se agregó correctamente
SELECT id, name, email, role FROM users;

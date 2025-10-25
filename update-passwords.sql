-- Actualizar contraseña del usuario admin
UPDATE users 
SET password = '$2a$10$Z9ATovdga5UMys/T1ZfJ2.lObCwsgSLzX6oY4TI0bMdz/K6b0hJxG'
WHERE email = 'ma.cobo@profesor.duoc.cl';

-- Actualizar contraseñas de los demás usuarios con el mismo hash (mico1234)
UPDATE users 
SET password = '$2a$10$Z9ATovdga5UMys/T1ZfJ2.lObCwsgSLzX6oY4TI0bMdz/K6b0hJxG'
WHERE email LIKE '%@duocuc.cl';

-- Verificar
SELECT id, name, email, role, substring(password, 1, 20) as pass_preview 
FROM users 
ORDER BY id;

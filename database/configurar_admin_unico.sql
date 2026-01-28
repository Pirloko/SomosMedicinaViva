-- ============================================
-- CONFIGURAR ÚNICO ADMINISTRADOR
-- ============================================
-- smv.informaciones@gmail.com es el ÚNICO usuario administrador.
--
-- Pasos en Supabase (SQL Editor):
-- 1. Ejecutar primero usuarios_roles.sql (funciones que fijan admin por email).
-- 2. Ejecutar este script para sincronizar la tabla usuarios_roles.
-- ============================================

-- 1. Asignar rol admin a smv.informaciones@gmail.com
INSERT INTO usuarios_roles (user_id, rol, nombre_usuario, activo)
SELECT id, 'admin', 'Administrador', true
FROM auth.users
WHERE email = 'smv.informaciones@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  rol = 'admin',
  nombre_usuario = 'Administrador',
  activo = true,
  updated_at = NOW();

-- 2. Cualquier otro usuario en la tabla debe ser vendedor
UPDATE usuarios_roles ur
SET rol = 'vendedor', updated_at = NOW()
WHERE ur.user_id NOT IN (
  SELECT id FROM auth.users WHERE email = 'smv.informaciones@gmail.com'
);

-- Verificación: listar usuarios y sus roles
SELECT 
  au.email,
  ur.rol,
  ur.nombre_usuario,
  ur.activo
FROM auth.users au
LEFT JOIN usuarios_roles ur ON au.id = ur.user_id
ORDER BY (ur.rol = 'admin') DESC, au.email;

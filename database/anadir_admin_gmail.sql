-- ============================================
-- AÑADIR admin@gmail.com COMO ADMINISTRADOR
-- ============================================
-- Ejecutar en Supabase → SQL Editor.
-- Si aún no actualizaste las funciones, ejecuta antes usuarios_roles.sql
-- (con la versión que incluye admin@gmail.com como admin).
-- ============================================

-- Asignar rol admin a admin@gmail.com
INSERT INTO usuarios_roles (user_id, rol, nombre_usuario, activo)
SELECT id, 'admin', 'Admin', true
FROM auth.users
WHERE email = 'admin@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  rol = 'admin',
  nombre_usuario = 'Admin',
  activo = true,
  updated_at = NOW();

-- Verificación
SELECT email, rol, nombre_usuario FROM vista_usuarios_roles WHERE email = 'admin@gmail.com';

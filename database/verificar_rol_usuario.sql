-- ============================================
-- VERIFICAR Y CORREGIR ROL DE USUARIO
-- ============================================
-- Script para verificar el rol de un usuario específico
-- ============================================

-- 1. Ver todos los usuarios con sus roles
SELECT 
  au.email,
  au.id as user_id,
  ur.rol,
  ur.nombre_usuario,
  ur.activo,
  ur.created_at
FROM auth.users au
LEFT JOIN usuarios_roles ur ON au.id = ur.user_id
ORDER BY au.created_at DESC;

-- 2. Verificar rol del único administrador (smv.informaciones@gmail.com)
SELECT 
  au.email,
  au.id as user_id,
  ur.rol,
  ur.nombre_usuario,
  ur.activo
FROM auth.users au
LEFT JOIN usuarios_roles ur ON au.id = ur.user_id
WHERE au.email = 'smv.informaciones@gmail.com';

-- 3. Si el usuario NO tiene rol o tiene el rol incorrecto, corregirlo:
-- Primero, obtén el user_id del usuario ejecutando la consulta anterior
-- Luego ejecuta esto (reemplaza 'USER_ID_AQUI' con el user_id real):

-- Para asignar rol de VENDEDOR:
/*
INSERT INTO usuarios_roles (user_id, rol, nombre_usuario, activo)
VALUES (
  'USER_ID_AQUI',  -- Reemplaza con el user_id real
  'vendedor',
  'Carlos Vendedor',  -- Nombre que quieras mostrar
  true
)
ON CONFLICT (user_id) DO UPDATE SET
  rol = 'vendedor',
  nombre_usuario = 'Carlos Vendedor',
  activo = true,
  updated_at = NOW();
*/

-- Para asignar rol de ADMIN:
/*
INSERT INTO usuarios_roles (user_id, rol, nombre_usuario, activo)
VALUES (
  'USER_ID_AQUI',  -- Reemplaza con el user_id real
  'admin',
  'Administrador',  -- Nombre que quieras mostrar
  true
)
ON CONFLICT (user_id) DO UPDATE SET
  rol = 'admin',
  nombre_usuario = 'Administrador',
  activo = true,
  updated_at = NOW();
*/

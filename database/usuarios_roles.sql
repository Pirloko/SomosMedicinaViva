-- ============================================
-- MEDICINA VIVA BAKERY - SISTEMA DE ROLES
-- ============================================
-- Tabla para gestionar roles de usuarios (Admin y Vendedor)
-- ÚNICO ADMINISTRADOR: smv.informaciones@gmail.com
-- El resto de usuarios son vendedores.
-- ============================================

-- ============================================
-- 1. TABLA DE ROLES DE USUARIOS
-- ============================================

CREATE TABLE IF NOT EXISTS usuarios_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'vendedor')),
  nombre_usuario TEXT NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_usuarios_roles_user_id ON usuarios_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_roles_rol ON usuarios_roles(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_roles_activo ON usuarios_roles(activo);

-- Comentarios
COMMENT ON TABLE usuarios_roles IS 'Gestiona los roles de los usuarios del sistema (admin o vendedor)';
COMMENT ON COLUMN usuarios_roles.rol IS 'Rol del usuario: admin o vendedor';
COMMENT ON COLUMN usuarios_roles.nombre_usuario IS 'Nombre de usuario para mostrar';
COMMENT ON COLUMN usuarios_roles.activo IS 'Indica si el usuario está activo';

-- ============================================
-- 2. FUNCIÓN: OBTENER ROL DEL USUARIO
-- ============================================
-- Único administrador: smv.informaciones@gmail.com
-- El resto de usuarios obtienen su rol de la tabla o vendedor por defecto.

CREATE OR REPLACE FUNCTION obtener_rol_usuario(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_email TEXT;
  v_rol TEXT;
BEGIN
  -- Único admin: solo smv.informaciones@gmail.com
  SELECT email INTO v_email FROM auth.users WHERE id = p_user_id;
  IF v_email = 'smv.informaciones@gmail.com' THEN
    RETURN 'admin';
  END IF;
  -- Resto: rol desde tabla o vendedor por defecto
  SELECT rol INTO v_rol
  FROM usuarios_roles
  WHERE user_id = p_user_id AND activo = true;
  RETURN COALESCE(v_rol, 'vendedor');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permisos para la función
GRANT EXECUTE ON FUNCTION obtener_rol_usuario(UUID) TO authenticated;

-- ============================================
-- 3. FUNCIÓN: ASIGNAR ROL A USUARIO
-- ============================================
-- Esta función asigna un rol a un usuario existente
-- El usuario debe ser creado primero desde el frontend o dashboard de Supabase

CREATE OR REPLACE FUNCTION asignar_rol_usuario(
  p_user_id UUID,
  p_rol TEXT,
  p_nombre_usuario TEXT,
  p_created_by UUID
)
RETURNS JSON AS $$
DECLARE
  v_resultado JSON;
  v_email TEXT;
BEGIN
  -- Verificar que el rol sea válido
  IF p_rol NOT IN ('admin', 'vendedor') THEN
    RAISE EXCEPTION 'Rol inválido. Debe ser admin o vendedor';
  END IF;

  -- Solo smv.informaciones@gmail.com puede tener rol admin
  IF p_rol = 'admin' THEN
    SELECT email INTO v_email FROM auth.users WHERE id = p_user_id;
    IF v_email IS NULL OR v_email <> 'smv.informaciones@gmail.com' THEN
      RAISE EXCEPTION 'Solo el usuario smv.informaciones@gmail.com puede ser administrador';
    END IF;
  END IF;

  -- Insertar o actualizar rol (si es admin y no es el único permitido, ya falló arriba)
  INSERT INTO usuarios_roles (user_id, rol, nombre_usuario, activo, created_by)
  VALUES (p_user_id, p_rol, p_nombre_usuario, true, p_created_by)
  ON CONFLICT (user_id) 
  DO UPDATE SET
    rol = p_rol,
    nombre_usuario = p_nombre_usuario,
    activo = true,
    updated_at = NOW();

  SELECT json_build_object(
    'success', true,
    'user_id', p_user_id,
    'rol', p_rol,
    'message', 'Rol asignado exitosamente'
  ) INTO v_resultado;
  
  RETURN v_resultado;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permisos
GRANT EXECUTE ON FUNCTION asignar_rol_usuario(UUID, TEXT, TEXT, UUID) TO authenticated;

-- ============================================
-- 4. FUNCIÓN: VERIFICAR SI ES ADMIN (sin recursión)
-- ============================================
-- Único admin: smv.informaciones@gmail.com

CREATE OR REPLACE FUNCTION es_admin_usuario(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT email INTO v_email FROM auth.users WHERE id = p_user_id;
  RETURN (v_email = 'smv.informaciones@gmail.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. RLS (Row Level Security)
-- ============================================

ALTER TABLE usuarios_roles ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen (para permitir re-ejecutar el script)
DROP POLICY IF EXISTS "Usuarios pueden ver su propio rol" ON usuarios_roles;
DROP POLICY IF EXISTS "Admins pueden ver todos los roles" ON usuarios_roles;
DROP POLICY IF EXISTS "Admins pueden crear roles" ON usuarios_roles;
DROP POLICY IF EXISTS "Admins pueden actualizar roles" ON usuarios_roles;
DROP POLICY IF EXISTS "Admins pueden eliminar roles" ON usuarios_roles;

-- Los usuarios pueden ver su propio rol
CREATE POLICY "Usuarios pueden ver su propio rol"
  ON usuarios_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Solo los admins pueden ver todos los roles
-- Usa la función es_admin_usuario para evitar recursión
CREATE POLICY "Admins pueden ver todos los roles"
  ON usuarios_roles
  FOR SELECT
  TO authenticated
  USING (es_admin_usuario(auth.uid()));

-- Solo los admins pueden crear roles
CREATE POLICY "Admins pueden crear roles"
  ON usuarios_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (es_admin_usuario(auth.uid()));

-- Solo los admins pueden actualizar roles
CREATE POLICY "Admins pueden actualizar roles"
  ON usuarios_roles
  FOR UPDATE
  TO authenticated
  USING (es_admin_usuario(auth.uid()));

-- Solo los admins pueden eliminar roles
CREATE POLICY "Admins pueden eliminar roles"
  ON usuarios_roles
  FOR DELETE
  TO authenticated
  USING (es_admin_usuario(auth.uid()));

-- ============================================
-- 6. TRIGGER: ACTUALIZAR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eliminar trigger si existe antes de crearlo
DROP TRIGGER IF EXISTS trigger_usuarios_roles_updated_at ON usuarios_roles;

CREATE TRIGGER trigger_usuarios_roles_updated_at
  BEFORE UPDATE ON usuarios_roles
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

-- ============================================
-- 7. VISTA: USUARIOS CON ROLES
-- ============================================

CREATE OR REPLACE VIEW vista_usuarios_roles AS
SELECT 
  ur.id,
  ur.user_id,
  ur.rol,
  ur.nombre_usuario,
  ur.activo,
  ur.created_at,
  ur.updated_at,
  au.email,
  au.created_at as usuario_creado_at
FROM usuarios_roles ur
LEFT JOIN auth.users au ON au.id = ur.user_id;

-- Permisos para la vista
GRANT SELECT ON vista_usuarios_roles TO authenticated;

-- ============================================
-- ✅ SISTEMA DE ROLES IMPLEMENTADO
-- ============================================

COMMENT ON FUNCTION obtener_rol_usuario(UUID) IS 'Obtiene el rol de un usuario (admin o vendedor)';
COMMENT ON FUNCTION asignar_rol_usuario(UUID, TEXT, TEXT, UUID) IS 'Asigna un rol a un usuario existente (requiere permisos de admin)';

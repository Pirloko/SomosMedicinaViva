-- ============================================
-- FUNCIONES OPTIMIZADAS PARA STOCK CRÍTICO
-- ============================================
-- Estas funciones filtran directamente en la BD
-- en lugar de hacerlo en el cliente
-- ============================================

-- ============================================
-- 1. FUNCIÓN: OBTENER INGREDIENTES CRÍTICOS
-- ============================================

CREATE OR REPLACE FUNCTION obtener_ingredientes_criticos()
RETURNS TABLE (
  id UUID,
  nombre TEXT,
  descripcion TEXT,
  beneficio TEXT,
  unidad_medida TEXT,
  stock_actual DECIMAL(10,2),
  stock_minimo DECIMAL(10,2),
  costo_unitario DECIMAL(10,2),
  imagen_url TEXT,
  activo BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.nombre,
    i.descripcion,
    i.beneficio,
    i.unidad_medida,
    i.stock_actual,
    i.stock_minimo,
    i.costo_unitario,
    i.imagen_url,
    i.activo,
    i.created_at,
    i.updated_at
  FROM ingredientes i
  WHERE i.activo = true
    AND i.stock_actual <= i.stock_minimo
  ORDER BY i.stock_actual ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario
COMMENT ON FUNCTION obtener_ingredientes_criticos() IS 'Obtiene ingredientes con stock crítico (stock_actual <= stock_minimo) filtrado directamente en la BD';

-- ============================================
-- 2. FUNCIÓN: OBTENER PRODUCTOS CRÍTICOS (Mejorada)
-- ============================================

-- La función ya existe en stock_management.sql, pero la mejoramos para retornar todos los campos
CREATE OR REPLACE FUNCTION obtener_productos_criticos_completo()
RETURNS TABLE (
  id UUID,
  nombre TEXT,
  descripcion TEXT,
  precio DECIMAL(10,2),
  categoria TEXT,
  imagen_url TEXT,
  tags TEXT[],
  stock_disponible INTEGER,
  stock_minimo INTEGER,
  activo BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.nombre,
    p.descripcion,
    p.precio,
    p.categoria,
    p.imagen_url,
    p.tags,
    p.stock_disponible,
    p.stock_minimo,
    p.activo,
    p.created_at,
    p.updated_at
  FROM productos p
  WHERE p.activo = true
    AND p.stock_disponible <= p.stock_minimo
  ORDER BY p.stock_disponible ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario
COMMENT ON FUNCTION obtener_productos_criticos_completo() IS 'Obtiene productos con stock crítico (stock_disponible <= stock_minimo) con todos los campos, filtrado directamente en la BD';

-- ============================================
-- 3. PERMISOS PARA FUNCIONES RPC
-- ============================================

-- Permitir que usuarios autenticados ejecuten las funciones
GRANT EXECUTE ON FUNCTION obtener_ingredientes_criticos() TO authenticated;
GRANT EXECUTE ON FUNCTION obtener_productos_criticos_completo() TO authenticated;

-- ============================================
-- ✅ FUNCIONES OPTIMIZADAS CREADAS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Función obtener_ingredientes_criticos() creada';
  RAISE NOTICE '✅ Función obtener_productos_criticos_completo() creada';
  RAISE NOTICE '🔒 Permisos configurados para usuarios autenticados';
END $$;

-- ============================================
-- MEDICINA VIVA BAKERY - SISTEMA DE STOCK
-- ============================================
-- Gestión completa de inventario de productos
-- ============================================

-- ============================================
-- 1. AGREGAR STOCK A PRODUCTOS
-- ============================================

-- Agregar columnas de stock a productos
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS stock_disponible INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS stock_minimo INTEGER DEFAULT 5;

-- Comentarios
COMMENT ON COLUMN productos.stock_disponible IS 'Stock actual de productos terminados';
COMMENT ON COLUMN productos.stock_minimo IS 'Stock mínimo antes de alerta';

-- ============================================
-- 2. TABLA DE MOVIMIENTOS DE STOCK
-- ============================================

CREATE TABLE IF NOT EXISTS stock_movimientos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'salida', 'ajuste', 'produccion', 'venta')),
  cantidad INTEGER NOT NULL,
  stock_anterior INTEGER NOT NULL,
  stock_nuevo INTEGER NOT NULL,
  motivo TEXT,
  usuario_id UUID REFERENCES auth.users(id),
  venta_id UUID REFERENCES ventas(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_stock_movimientos_producto ON stock_movimientos(producto_id);
CREATE INDEX IF NOT EXISTS idx_stock_movimientos_tipo ON stock_movimientos(tipo);
CREATE INDEX IF NOT EXISTS idx_stock_movimientos_fecha ON stock_movimientos(created_at);

-- Comentarios
COMMENT ON TABLE stock_movimientos IS 'Historial de movimientos de stock de productos';
COMMENT ON COLUMN stock_movimientos.tipo IS 'entrada=producción, salida=venta, ajuste=corrección manual';

-- ============================================
-- 3. RLS PARA MOVIMIENTOS
-- ============================================

ALTER TABLE stock_movimientos ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si ya existen
DROP POLICY IF EXISTS "Admin puede ver movimientos" ON stock_movimientos;
DROP POLICY IF EXISTS "Admin puede crear movimientos" ON stock_movimientos;

-- Admin puede ver todo
CREATE POLICY "Admin puede ver movimientos"
  ON stock_movimientos
  FOR SELECT
  TO authenticated
  USING (true);

-- Admin puede insertar movimientos
CREATE POLICY "Admin puede crear movimientos"
  ON stock_movimientos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- 4. FUNCIÓN: REGISTRAR PRODUCCIÓN
-- ============================================

CREATE OR REPLACE FUNCTION registrar_produccion(
  p_producto_id UUID,
  p_cantidad INTEGER,
  p_motivo TEXT DEFAULT 'Producción'
)
RETURNS JSON AS $$
DECLARE
  v_stock_anterior INTEGER;
  v_stock_nuevo INTEGER;
  v_ingredientes RECORD;
  v_resultado JSON;
BEGIN
  -- Obtener stock actual del producto
  SELECT stock_disponible INTO v_stock_anterior
  FROM productos
  WHERE id = p_producto_id;

  -- Calcular nuevo stock
  v_stock_nuevo := v_stock_anterior + p_cantidad;

  -- Actualizar stock del producto
  UPDATE productos
  SET stock_disponible = v_stock_nuevo,
      updated_at = NOW()
  WHERE id = p_producto_id;

  -- Registrar movimiento
  INSERT INTO stock_movimientos (
    producto_id,
    tipo,
    cantidad,
    stock_anterior,
    stock_nuevo,
    motivo
  ) VALUES (
    p_producto_id,
    'produccion',
    p_cantidad,
    v_stock_anterior,
    v_stock_nuevo,
    p_motivo
  );

  -- Descontar ingredientes según la receta
  FOR v_ingredientes IN
    SELECT pi.ingrediente_id, pi.cantidad_necesaria, i.unidad_medida, i.nombre
    FROM producto_ingredientes pi
    JOIN ingredientes i ON i.id = pi.ingrediente_id
    WHERE pi.producto_id = p_producto_id
  LOOP
    -- Descontar ingrediente
    UPDATE ingredientes
    SET stock_actual = stock_actual - (v_ingredientes.cantidad_necesaria * p_cantidad),
        updated_at = NOW()
    WHERE id = v_ingredientes.ingrediente_id;
  END LOOP;

  -- Retornar resultado
  SELECT json_build_object(
    'success', true,
    'producto_id', p_producto_id,
    'cantidad_producida', p_cantidad,
    'stock_anterior', v_stock_anterior,
    'stock_nuevo', v_stock_nuevo
  ) INTO v_resultado;

  RETURN v_resultado;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. FUNCIÓN: REGISTRAR VENTA (DESCUENTO AUTOMÁTICO)
-- ============================================

CREATE OR REPLACE FUNCTION descontar_stock_venta()
RETURNS TRIGGER AS $$
BEGIN
  -- Descontar stock del producto
  UPDATE productos
  SET stock_disponible = stock_disponible - NEW.cantidad,
      updated_at = NOW()
  WHERE id = NEW.producto_id;

  -- Registrar movimiento
  INSERT INTO stock_movimientos (
    producto_id,
    tipo,
    cantidad,
    stock_anterior,
    stock_nuevo,
    motivo,
    venta_id
  )
  SELECT
    NEW.producto_id,
    'venta',
    NEW.cantidad,
    p.stock_disponible + NEW.cantidad,  -- stock antes de descontar
    p.stock_disponible,                  -- stock después de descontar
    'Venta registrada',
    NEW.id
  FROM productos p
  WHERE p.id = NEW.producto_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para descuento automático en ventas
DROP TRIGGER IF EXISTS trigger_descontar_stock_venta ON ventas;
CREATE TRIGGER trigger_descontar_stock_venta
  AFTER INSERT ON ventas
  FOR EACH ROW
  EXECUTE FUNCTION descontar_stock_venta();

-- ============================================
-- 6. VISTA: PRODUCTOS CON ALERTAS DE STOCK
-- ============================================

-- Eliminar vista si existe (para evitar conflictos de nombres)
DROP VIEW IF EXISTS vista_productos_stock CASCADE;

-- Crear vista nueva
CREATE VIEW vista_productos_stock AS
SELECT 
  p.id as producto_id,
  p.nombre,
  p.categoria,
  p.imagen_url,
  p.stock_disponible,
  p.stock_minimo,
  CASE 
    WHEN p.stock_disponible = 0 THEN 'sin_stock'
    WHEN p.stock_disponible <= p.stock_minimo THEN 'stock_bajo'
    ELSE 'ok'
  END as estado_stock,
  p.activo,
  COUNT(sm.id) as total_movimientos,
  SUM(CASE WHEN sm.tipo = 'venta' THEN sm.cantidad ELSE 0 END) as total_vendido
FROM productos p
LEFT JOIN stock_movimientos sm ON sm.producto_id = p.id
GROUP BY p.id, p.nombre, p.categoria, p.imagen_url, p.stock_disponible, p.stock_minimo, p.activo;

-- ============================================
-- 7. FUNCIÓN: OBTENER PRODUCTOS CRÍTICOS
-- ============================================

CREATE OR REPLACE FUNCTION obtener_productos_criticos()
RETURNS TABLE (
  producto_id UUID,
  nombre TEXT,
  stock_disponible INTEGER,
  stock_minimo INTEGER,
  estado TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.nombre,
    p.stock_disponible,
    p.stock_minimo,
    CASE 
      WHEN p.stock_disponible = 0 THEN 'sin_stock'
      ELSE 'stock_bajo'
    END as estado
  FROM productos p
  WHERE p.activo = true
    AND p.stock_disponible <= p.stock_minimo
  ORDER BY p.stock_disponible ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. PERMISOS PARA FUNCIONES RPC
-- ============================================

-- Permitir que usuarios autenticados ejecuten las funciones
GRANT EXECUTE ON FUNCTION registrar_produccion(UUID, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION obtener_productos_criticos() TO authenticated;

-- ============================================
-- ✅ SISTEMA DE STOCK IMPLEMENTADO
-- ============================================

DO $$
DECLARE
  producto_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO producto_count FROM productos;
  
  RAISE NOTICE '✅ Sistema de stock implementado';
  RAISE NOTICE '📦 Productos actualizados: %', producto_count;
  RAISE NOTICE '🔄 Trigger de ventas: activo';
  RAISE NOTICE '📊 Función de producción: disponible';
  RAISE NOTICE '⚠️ Alertas de stock: configuradas';
END $$;


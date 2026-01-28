-- ============================================
-- MIGRACIÓN: VENTAS CON MÚLTIPLES PRODUCTOS
-- ============================================
-- Este script modifica la estructura para permitir
-- que una venta contenga múltiples productos
-- ============================================

-- ============================================
-- 1. CREAR TABLA venta_productos
-- ============================================

CREATE TABLE IF NOT EXISTS venta_productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venta_id UUID NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_venta_productos_venta ON venta_productos(venta_id);
CREATE INDEX IF NOT EXISTS idx_venta_productos_producto ON venta_productos(producto_id);

-- Comentarios
COMMENT ON TABLE venta_productos IS 'Productos incluidos en cada venta';
COMMENT ON COLUMN venta_productos.subtotal IS 'Subtotal calculado automáticamente (cantidad * precio_unitario)';

-- ============================================
-- 2. MIGRAR DATOS EXISTENTES
-- ============================================

-- Migrar ventas existentes a venta_productos
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT 
  id as venta_id,
  producto_id,
  cantidad,
  precio_unitario
FROM ventas
WHERE producto_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. MODIFICAR TABLA ventas
-- ============================================

-- Hacer producto_id, cantidad y precio_unitario opcionales (para compatibilidad temporal)
-- Mantener total como campo calculado
ALTER TABLE ventas 
  ALTER COLUMN producto_id DROP NOT NULL,
  ALTER COLUMN cantidad DROP NOT NULL,
  ALTER COLUMN precio_unitario DROP NOT NULL;

-- Agregar comentario indicando que estos campos están deprecados
COMMENT ON COLUMN ventas.producto_id IS 'DEPRECADO: Usar tabla venta_productos';
COMMENT ON COLUMN ventas.cantidad IS 'DEPRECADO: Usar tabla venta_productos';
COMMENT ON COLUMN ventas.precio_unitario IS 'DEPRECADO: Usar tabla venta_productos';

-- ============================================
-- 4. FUNCIÓN: Calcular total de venta
-- ============================================

CREATE OR REPLACE FUNCTION calcular_total_venta(venta_uuid UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  total_calculado DECIMAL(10,2);
BEGIN
  SELECT COALESCE(SUM(subtotal), 0)
  INTO total_calculado
  FROM venta_productos
  WHERE venta_id = venta_uuid;
  
  RETURN total_calculado;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. TRIGGER: Actualizar total de venta automáticamente
-- ============================================

CREATE OR REPLACE FUNCTION actualizar_total_venta()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ventas
  SET total = calcular_total_venta(COALESCE(NEW.venta_id, OLD.venta_id)),
      updated_at = NOW()
  WHERE id = COALESCE(NEW.venta_id, OLD.venta_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para INSERT y UPDATE
DROP TRIGGER IF EXISTS trigger_actualizar_total_venta ON venta_productos;
CREATE TRIGGER trigger_actualizar_total_venta
  AFTER INSERT OR UPDATE OR DELETE ON venta_productos
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_total_venta();

-- ============================================
-- 6. ACTUALIZAR TRIGGER DE STOCK
-- ============================================

-- Modificar función para que funcione con venta_productos
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
    NEW.venta_id
  FROM productos p
  WHERE p.id = NEW.producto_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Actualizar trigger para venta_productos
DROP TRIGGER IF EXISTS trigger_descontar_stock_venta_producto ON venta_productos;
CREATE TRIGGER trigger_descontar_stock_venta_producto
  AFTER INSERT ON venta_productos
  FOR EACH ROW
  EXECUTE FUNCTION descontar_stock_venta();

-- Mantener trigger antiguo para compatibilidad (se puede eliminar después)
-- DROP TRIGGER IF EXISTS trigger_descontar_stock_venta ON ventas;

-- ============================================
-- 7. VISTA: Ventas con productos
-- ============================================

CREATE OR REPLACE VIEW vista_ventas_completas AS
SELECT 
  v.id,
  v.cliente_nombre,
  v.cliente_email,
  v.cliente_telefono,
  v.zona_delivery,
  v.estado,
  v.metodo_pago,
  v.notas,
  v.fecha_venta,
  v.fecha_entrega,
  v.total,
  v.created_at,
  v.updated_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id', vp.id,
        'producto_id', vp.producto_id,
        'producto_nombre', p.nombre,
        'producto_imagen', p.imagen_url,
        'cantidad', vp.cantidad,
        'precio_unitario', vp.precio_unitario,
        'subtotal', vp.subtotal
      )
    ) FILTER (WHERE vp.id IS NOT NULL),
    '[]'::json
  ) as productos
FROM ventas v
LEFT JOIN venta_productos vp ON v.id = vp.venta_id
LEFT JOIN productos p ON vp.producto_id = p.id
GROUP BY v.id;

-- ============================================
-- 8. RLS (Row Level Security)
-- ============================================

ALTER TABLE venta_productos ENABLE ROW LEVEL SECURITY;

-- Política: Solo admins pueden ver/editar venta_productos
CREATE POLICY "Admin full access venta_productos"
  ON venta_productos
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- 9. ACTUALIZAR VISTA DE KPIs
-- ============================================

-- Actualizar vista_kpis_ventas para usar venta_productos
DROP VIEW IF EXISTS vista_kpis_ventas CASCADE;

CREATE OR REPLACE VIEW vista_kpis_ventas AS
SELECT 
  DATE_TRUNC('day', v.fecha_venta) as fecha,
  COUNT(DISTINCT v.id) as total_ventas,
  SUM(v.total) as ingresos_total,
  SUM(vp.cantidad) as productos_vendidos,
  COUNT(DISTINCT v.cliente_telefono) as clientes_unicos
FROM ventas v
LEFT JOIN venta_productos vp ON v.id = vp.venta_id
WHERE v.estado != 'cancelado'
GROUP BY DATE_TRUNC('day', v.fecha_venta)
ORDER BY fecha DESC;

-- ============================================
-- ✅ MIGRACIÓN COMPLETADA
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migración completada: Ventas con múltiples productos';
  RAISE NOTICE '📊 Tabla venta_productos creada';
  RAISE NOTICE '🔄 Triggers actualizados';
  RAISE NOTICE '📈 Vistas actualizadas';
END $$;



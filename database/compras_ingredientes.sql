-- ============================================
-- MEDICINA VIVA BAKERY - COMPRAS DE INGREDIENTES
-- ============================================
-- Sistema de historial de compras con costos variables
-- ============================================

-- ============================================
-- 1. TABLA DE COMPRAS DE INGREDIENTES
-- ============================================

CREATE TABLE IF NOT EXISTS compras_ingredientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingrediente_id UUID NOT NULL REFERENCES ingredientes(id) ON DELETE CASCADE,
  cantidad DECIMAL(10,2) NOT NULL CHECK (cantidad > 0),
  costo_unitario DECIMAL(10,2) NOT NULL CHECK (costo_unitario >= 0),
  costo_total DECIMAL(10,2) NOT NULL CHECK (costo_total >= 0),
  proveedor TEXT,
  numero_factura TEXT,
  fecha_compra DATE DEFAULT CURRENT_DATE,
  notas TEXT,
  stock_anterior DECIMAL(10,2),
  stock_nuevo DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_compras_ingredientes_ingrediente ON compras_ingredientes(ingrediente_id);
CREATE INDEX IF NOT EXISTS idx_compras_ingredientes_fecha ON compras_ingredientes(fecha_compra);

-- Comentarios
COMMENT ON TABLE compras_ingredientes IS 'Historial de compras de ingredientes con costos variables';
COMMENT ON COLUMN compras_ingredientes.costo_unitario IS 'Costo por unidad de medida en esta compra específica';
COMMENT ON COLUMN compras_ingredientes.costo_total IS 'Costo total de la compra (cantidad × costo_unitario)';

-- ============================================
-- 2. RLS PARA COMPRAS
-- ============================================

ALTER TABLE compras_ingredientes ENABLE ROW LEVEL SECURITY;

-- Admin puede ver todo
CREATE POLICY "Admin puede ver compras"
  ON compras_ingredientes
  FOR SELECT
  TO authenticated
  USING (true);

-- Admin puede crear compras
CREATE POLICY "Admin puede crear compras"
  ON compras_ingredientes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- 3. FUNCIÓN: REGISTRAR COMPRA DE INGREDIENTE
-- ============================================

CREATE OR REPLACE FUNCTION registrar_compra_ingrediente(
  p_ingrediente_id UUID,
  p_cantidad DECIMAL,
  p_costo_unitario DECIMAL,
  p_proveedor TEXT DEFAULT NULL,
  p_numero_factura TEXT DEFAULT NULL,
  p_fecha_compra DATE DEFAULT CURRENT_DATE,
  p_notas TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_stock_anterior DECIMAL;
  v_stock_nuevo DECIMAL;
  v_costo_total DECIMAL;
  v_costo_promedio_anterior DECIMAL;
  v_costo_promedio_nuevo DECIMAL;
  v_valor_inventario_anterior DECIMAL;
  v_valor_inventario_nuevo DECIMAL;
  v_resultado JSON;
BEGIN
  -- Obtener stock actual y costo actual del ingrediente
  SELECT stock_actual, costo_unitario 
  INTO v_stock_anterior, v_costo_promedio_anterior
  FROM ingredientes
  WHERE id = p_ingrediente_id;

  -- Calcular costo total de la compra
  v_costo_total := p_cantidad * p_costo_unitario;

  -- Calcular nuevo stock
  v_stock_nuevo := v_stock_anterior + p_cantidad;

  -- Calcular COSTO PROMEDIO PONDERADO
  -- (Valor inventario anterior + Valor compra nueva) / Stock total nuevo
  v_valor_inventario_anterior := v_stock_anterior * COALESCE(v_costo_promedio_anterior, 0);
  v_valor_inventario_nuevo := v_valor_inventario_anterior + v_costo_total;
  
  IF v_stock_nuevo > 0 THEN
    v_costo_promedio_nuevo := v_valor_inventario_nuevo / v_stock_nuevo;
  ELSE
    v_costo_promedio_nuevo := p_costo_unitario;
  END IF;

  -- Actualizar stock y costo promedio del ingrediente
  UPDATE ingredientes
  SET stock_actual = v_stock_nuevo,
      costo_unitario = v_costo_promedio_nuevo,
      updated_at = NOW()
  WHERE id = p_ingrediente_id;

  -- Registrar la compra en historial
  INSERT INTO compras_ingredientes (
    ingrediente_id,
    cantidad,
    costo_unitario,
    costo_total,
    proveedor,
    numero_factura,
    fecha_compra,
    notas,
    stock_anterior,
    stock_nuevo
  ) VALUES (
    p_ingrediente_id,
    p_cantidad,
    p_costo_unitario,
    v_costo_total,
    p_proveedor,
    p_numero_factura,
    p_fecha_compra,
    p_notas,
    v_stock_anterior,
    v_stock_nuevo
  );

  -- Retornar resultado
  SELECT json_build_object(
    'success', true,
    'ingrediente_id', p_ingrediente_id,
    'cantidad_comprada', p_cantidad,
    'costo_unitario_compra', p_costo_unitario,
    'costo_total_compra', v_costo_total,
    'stock_anterior', v_stock_anterior,
    'stock_nuevo', v_stock_nuevo,
    'costo_promedio_anterior', ROUND(v_costo_promedio_anterior, 2),
    'costo_promedio_nuevo', ROUND(v_costo_promedio_nuevo, 2)
  ) INTO v_resultado;

  RETURN v_resultado;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos
GRANT EXECUTE ON FUNCTION registrar_compra_ingrediente(UUID, DECIMAL, DECIMAL, TEXT, TEXT, DATE, TEXT) TO authenticated;

-- ============================================
-- 4. VISTA: HISTORIAL DE COMPRAS CON DETALLES
-- ============================================

CREATE OR REPLACE VIEW vista_compras_ingredientes AS
SELECT 
  c.id,
  c.ingrediente_id,
  i.nombre as ingrediente_nombre,
  i.unidad_medida,
  c.cantidad,
  c.costo_unitario,
  c.costo_total,
  c.proveedor,
  c.numero_factura,
  c.fecha_compra,
  c.notas,
  c.stock_anterior,
  c.stock_nuevo,
  c.stock_nuevo - c.stock_anterior as incremento_stock,
  c.created_at
FROM compras_ingredientes c
JOIN ingredientes i ON i.id = c.ingrediente_id
ORDER BY c.created_at DESC;

-- ============================================
-- 5. VISTA: RESUMEN DE COMPRAS POR INGREDIENTE
-- ============================================

CREATE OR REPLACE VIEW vista_resumen_compras_ingrediente AS
SELECT 
  i.id as ingrediente_id,
  i.nombre as ingrediente_nombre,
  i.unidad_medida,
  i.stock_actual,
  i.costo_unitario as costo_promedio_actual,
  COUNT(c.id) as total_compras,
  SUM(c.cantidad) as cantidad_total_comprada,
  SUM(c.costo_total) as inversion_total,
  AVG(c.costo_unitario) as costo_promedio_compras,
  MIN(c.costo_unitario) as costo_minimo,
  MAX(c.costo_unitario) as costo_maximo,
  MAX(c.fecha_compra) as ultima_compra
FROM ingredientes i
LEFT JOIN compras_ingredientes c ON c.ingrediente_id = i.id
GROUP BY i.id, i.nombre, i.unidad_medida, i.stock_actual, i.costo_unitario;

-- ============================================
-- ✅ SISTEMA DE COMPRAS IMPLEMENTADO
-- ============================================

DO $$
DECLARE
  compra_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO compra_count FROM compras_ingredientes;
  
  RAISE NOTICE '✅ Sistema de compras de ingredientes implementado';
  RAISE NOTICE '📦 Tabla de compras creada';
  RAISE NOTICE '💰 Cálculo de costo promedio ponderado activo';
  RAISE NOTICE '📊 Vistas de análisis disponibles';
  RAISE NOTICE '📋 Compras registradas: %', compra_count;
  RAISE NOTICE '📁 Preparado para exportación a Excel';
END $$;

-- ============================================
-- EJEMPLO DE USO
-- ============================================

-- SELECT registrar_compra_ingrediente(
--   'uuid-del-ingrediente',
--   50,              -- cantidad comprada
--   5000,            -- costo por unidad en esta compra
--   'Proveedor ABC', -- proveedor
--   'F-12345',       -- número factura
--   '2024-12-04',    -- fecha
--   'Compra mensual' -- notas
-- );


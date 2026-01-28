-- ============================================
-- MEDICINA VIVA BAKERY - PRODUCCIÓN MANUAL
-- ============================================
-- Función para registrar producción con selección manual de ingredientes
-- ============================================

-- ============================================
-- 1. AGREGAR CAMPO DE COSTO A PRODUCTOS
-- ============================================

-- Agregar columna para guardar el costo unitario calculado
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS costo_produccion_unitario DECIMAL(10,2) DEFAULT 0;

COMMENT ON COLUMN productos.costo_produccion_unitario IS 'Costo unitario calculado automáticamente en la última producción';

-- ============================================
-- 2. FUNCIÓN: REGISTRAR PRODUCCIÓN MANUAL
-- ============================================

CREATE OR REPLACE FUNCTION registrar_produccion_manual(
  p_producto_id UUID,
  p_stock_producido INTEGER,
  p_ingredientes JSONB,  -- Array de {ingrediente_id, cantidad, costo_unitario}
  p_motivo TEXT DEFAULT 'Producción manual'
)
RETURNS JSON AS $$
DECLARE
  v_stock_anterior INTEGER;
  v_stock_nuevo INTEGER;
  v_ingrediente JSONB;
  v_costo_total DECIMAL := 0;
  v_costo_unitario DECIMAL;
  v_resultado JSON;
BEGIN
  -- Obtener stock actual del producto
  SELECT stock_disponible INTO v_stock_anterior
  FROM productos
  WHERE id = p_producto_id;

  -- Calcular nuevo stock
  v_stock_nuevo := v_stock_anterior + p_stock_producido;

  -- Validar que el stock producido sea mayor a 0
  IF p_stock_producido <= 0 THEN
    RAISE EXCEPTION 'El stock producido debe ser mayor a 0';
  END IF;

  -- Calcular costo total de todos los ingredientes
  FOR v_ingrediente IN SELECT * FROM jsonb_array_elements(p_ingredientes)
  LOOP
    v_costo_total := v_costo_total + 
      ((v_ingrediente->>'cantidad')::DECIMAL * (v_ingrediente->>'costo_unitario')::DECIMAL);
  END LOOP;

  -- Calcular costo unitario del producto (validado que p_stock_producido > 0)
  v_costo_unitario := v_costo_total / p_stock_producido;

  -- Actualizar stock y costo del producto
  UPDATE productos
  SET stock_disponible = v_stock_nuevo,
      costo_produccion_unitario = v_costo_unitario,
      updated_at = NOW()
  WHERE id = p_producto_id;

  -- Registrar movimiento del producto
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
    p_stock_producido,
    v_stock_anterior,
    v_stock_nuevo,
    p_motivo || ' - Costo: $' || ROUND(v_costo_unitario)
  );

  -- Descontar cada ingrediente según lo ingresado manualmente
  FOR v_ingrediente IN SELECT * FROM jsonb_array_elements(p_ingredientes)
  LOOP
    UPDATE ingredientes
    SET stock_actual = stock_actual - (v_ingrediente->>'cantidad')::DECIMAL,
        updated_at = NOW()
    WHERE id = (v_ingrediente->>'ingrediente_id')::UUID;
  END LOOP;

  -- Retornar resultado
  SELECT json_build_object(
    'success', true,
    'producto_id', p_producto_id,
    'stock_producido', p_stock_producido,
    'stock_anterior', v_stock_anterior,
    'stock_nuevo', v_stock_nuevo,
    'costo_total', ROUND(v_costo_total),
    'costo_unitario', ROUND(v_costo_unitario),
    'ingredientes_descontados', jsonb_array_length(p_ingredientes)
  ) INTO v_resultado;

  RETURN v_resultado;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos
GRANT EXECUTE ON FUNCTION registrar_produccion_manual(UUID, INTEGER, JSONB, TEXT) TO authenticated;

-- ============================================
-- COMENTARIOS Y EJEMPLOS
-- ============================================

COMMENT ON FUNCTION registrar_produccion_manual IS 'Registra producción con selección manual de ingredientes y cantidades';

-- Ejemplo de uso:
-- SELECT registrar_produccion_manual(
--   'producto-uuid',
--   10,  -- stock producido
--   '[
--     {"ingrediente_id": "uuid-harina", "cantidad": 10},
--     {"ingrediente_id": "uuid-aceite", "cantidad": 2},
--     {"ingrediente_id": "uuid-stevia", "cantidad": 1}
--   ]'::jsonb,
--   'Producción del día'
-- );

-- ============================================
-- ✅ FUNCIÓN DE PRODUCCIÓN MANUAL CREADA
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Función de producción manual creada';
  RAISE NOTICE '📝 Permite selección manual de ingredientes y cantidades';
  RAISE NOTICE '🔒 Permisos configurados para usuarios autenticados';
END $$;


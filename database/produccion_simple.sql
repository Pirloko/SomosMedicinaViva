-- ============================================
-- PRODUCCIÓN SIMPLE (sin registro de ingredientes)
-- ============================================
-- Actualiza solo el stock del producto y registra el movimiento.
-- No descuenta ingredientes. Para historial se usa stock_movimientos (tipo 'produccion').
-- ============================================

CREATE OR REPLACE FUNCTION registrar_produccion_simple(
  p_producto_id UUID,
  p_stock_producido INTEGER,
  p_motivo TEXT DEFAULT 'Producción del día'
)
RETURNS JSON AS $$
DECLARE
  v_stock_anterior INTEGER;
  v_stock_nuevo INTEGER;
  v_resultado JSON;
BEGIN
  IF p_stock_producido IS NULL OR p_stock_producido <= 0 THEN
    RAISE EXCEPTION 'El stock producido debe ser mayor a 0';
  END IF;

  SELECT stock_disponible INTO v_stock_anterior
  FROM productos
  WHERE id = p_producto_id;

  IF v_stock_anterior IS NULL THEN
    RAISE EXCEPTION 'Producto no encontrado';
  END IF;

  v_stock_nuevo := v_stock_anterior + p_stock_producido;

  UPDATE productos
  SET stock_disponible = v_stock_nuevo,
      updated_at = NOW()
  WHERE id = p_producto_id;

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
    NULLIF(TRIM(p_motivo), '')
  );

  SELECT json_build_object(
    'success', true,
    'producto_id', p_producto_id,
    'stock_producido', p_stock_producido,
    'stock_anterior', v_stock_anterior,
    'stock_nuevo', v_stock_nuevo
  ) INTO v_resultado;

  RETURN v_resultado;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION registrar_produccion_simple(UUID, INTEGER, TEXT) TO authenticated;

COMMENT ON FUNCTION registrar_produccion_simple IS 'Registra producción solo actualizando stock del producto. No descuenta ingredientes.';

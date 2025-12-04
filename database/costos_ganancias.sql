-- ============================================
-- MEDICINA VIVA BAKERY - SISTEMA DE COSTOS
-- ============================================
-- Vistas SQL para cálculo de costos y ganancias
-- ============================================

-- ============================================
-- 1️⃣ VISTA: Costo de Producción por Producto
-- ============================================
CREATE OR REPLACE VIEW vista_costo_productos AS
SELECT 
  p.id as producto_id,
  p.nombre as producto_nombre,
  p.precio as precio_venta,
  p.categoria,
  p.activo,
  -- Calcular costo total sumando todos los ingredientes
  COALESCE(SUM(pi.cantidad_necesaria * i.costo_unitario), 0) as costo_produccion,
  -- Calcular ganancia por unidad
  p.precio - COALESCE(SUM(pi.cantidad_necesaria * i.costo_unitario), 0) as ganancia_unitaria,
  -- Calcular margen de ganancia (%)
  CASE 
    WHEN p.precio > 0 THEN 
      ROUND(((p.precio - COALESCE(SUM(pi.cantidad_necesaria * i.costo_unitario), 0)) / p.precio * 100)::numeric, 2)
    ELSE 0
  END as margen_porcentaje,
  -- Contar ingredientes
  COUNT(pi.ingrediente_id) as cantidad_ingredientes
FROM productos p
LEFT JOIN producto_ingredientes pi ON p.id = pi.producto_id
LEFT JOIN ingredientes i ON pi.ingrediente_id = i.id
GROUP BY p.id, p.nombre, p.precio, p.categoria, p.activo;

-- Comentario
COMMENT ON VIEW vista_costo_productos IS 'Calcula el costo de producción de cada producto basado en sus ingredientes';

-- ============================================
-- 2️⃣ VISTA: Ganancias Reales por Venta
-- ============================================
CREATE OR REPLACE VIEW vista_ganancias_ventas AS
SELECT 
  v.id as venta_id,
  v.fecha_venta,
  v.cliente_nombre,
  v.cliente_telefono,
  v.zona_delivery,
  v.estado,
  v.metodo_pago,
  p.nombre as producto_nombre,
  v.cantidad,
  v.precio_unitario,
  v.total as ingreso_total,
  -- Calcular costo real basado en ingredientes
  COALESCE(cp.costo_produccion, 0) * v.cantidad as costo_real,
  -- Calcular ganancia real
  v.total - (COALESCE(cp.costo_produccion, 0) * v.cantidad) as ganancia_real,
  -- Calcular margen real
  CASE 
    WHEN v.total > 0 THEN 
      ROUND(((v.total - (COALESCE(cp.costo_produccion, 0) * v.cantidad)) / v.total * 100)::numeric, 2)
    ELSE 0
  END as margen_real_porcentaje,
  -- Info del producto
  cp.costo_produccion as costo_unitario_producto,
  cp.margen_porcentaje as margen_producto
FROM ventas v
LEFT JOIN productos p ON v.producto_id = p.id
LEFT JOIN vista_costo_productos cp ON v.producto_id = cp.producto_id
WHERE v.estado != 'cancelado';

-- Comentario
COMMENT ON VIEW vista_ganancias_ventas IS 'Calcula ganancias reales de cada venta considerando costos de ingredientes';

-- ============================================
-- 3️⃣ VISTA: KPIs Financieros Reales
-- ============================================
CREATE OR REPLACE VIEW vista_kpis_financieros AS
SELECT 
  DATE_TRUNC('day', fecha_venta) as fecha,
  COUNT(*) as total_ventas,
  SUM(ingreso_total) as ingresos_totales,
  SUM(costo_real) as costos_totales,
  SUM(ganancia_real) as ganancias_reales,
  AVG(ingreso_total) as ticket_promedio,
  AVG(ganancia_real) as ganancia_promedio_venta,
  CASE 
    WHEN SUM(ingreso_total) > 0 THEN 
      ROUND((SUM(ganancia_real) / SUM(ingreso_total) * 100)::numeric, 2)
    ELSE 0
  END as margen_promedio_porcentaje,
  COUNT(DISTINCT cliente_telefono) as clientes_unicos,
  SUM(cantidad) as productos_vendidos
FROM vista_ganancias_ventas
GROUP BY DATE_TRUNC('day', fecha_venta)
ORDER BY fecha DESC;

-- Comentario
COMMENT ON VIEW vista_kpis_financieros IS 'KPIs financieros diarios con costos y ganancias reales';

-- ============================================
-- 4️⃣ VISTA: Productos Más Rentables
-- ============================================
CREATE OR REPLACE VIEW vista_productos_rentables AS
SELECT 
  gv.producto_nombre,
  COUNT(gv.venta_id) as veces_vendido,
  SUM(gv.cantidad) as unidades_vendidas,
  SUM(gv.ingreso_total) as ingresos_generados,
  SUM(gv.costo_real) as costos_totales,
  SUM(gv.ganancia_real) as ganancias_totales,
  ROUND(AVG(gv.margen_real_porcentaje)::numeric, 2) as margen_promedio,
  -- ROI (Return on Investment)
  CASE 
    WHEN SUM(gv.costo_real) > 0 THEN 
      ROUND((SUM(gv.ganancia_real) / SUM(gv.costo_real) * 100)::numeric, 2)
    ELSE 0
  END as roi_porcentaje
FROM vista_ganancias_ventas gv
GROUP BY gv.producto_nombre
ORDER BY ganancias_totales DESC;

-- Comentario
COMMENT ON VIEW vista_productos_rentables IS 'Ranking de productos por rentabilidad considerando costos reales';

-- ============================================
-- 5️⃣ VISTA: Análisis de Ingredientes
-- ============================================
CREATE OR REPLACE VIEW vista_analisis_ingredientes AS
SELECT 
  i.id as ingrediente_id,
  i.nombre as ingrediente_nombre,
  i.unidad_medida,
  i.stock_actual,
  i.stock_minimo,
  i.costo_unitario,
  -- Cuántos productos usan este ingrediente
  COUNT(DISTINCT pi.producto_id) as productos_que_lo_usan,
  -- Cantidad total necesaria por mes (estimado)
  SUM(pi.cantidad_necesaria) as cantidad_total_recetas,
  -- Valor del stock actual
  i.stock_actual * i.costo_unitario as valor_stock_actual,
  -- Alertas
  CASE 
    WHEN i.stock_actual = 0 THEN 'SIN_STOCK'
    WHEN i.stock_actual <= i.stock_minimo THEN 'STOCK_BAJO'
    ELSE 'OK'
  END as alerta_stock
FROM ingredientes i
LEFT JOIN producto_ingredientes pi ON i.id = pi.ingrediente_id
GROUP BY i.id, i.nombre, i.unidad_medida, i.stock_actual, i.stock_minimo, i.costo_unitario
ORDER BY valor_stock_actual DESC;

-- Comentario
COMMENT ON VIEW vista_analisis_ingredientes IS 'Análisis de ingredientes con alertas y uso en productos';

-- ============================================
-- 6️⃣ FUNCIÓN: Calcular si se puede producir un producto
-- ============================================
CREATE OR REPLACE FUNCTION puede_producir_producto(
  p_producto_id UUID,
  p_cantidad INTEGER DEFAULT 1
)
RETURNS TABLE (
  puede_producir BOOLEAN,
  ingredientes_faltantes TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  WITH ingredientes_necesarios AS (
    SELECT 
      i.nombre,
      pi.cantidad_necesaria * p_cantidad as cantidad_total_necesaria,
      i.stock_actual,
      i.unidad_medida,
      CASE 
        WHEN i.stock_actual >= (pi.cantidad_necesaria * p_cantidad) THEN TRUE
        ELSE FALSE
      END as hay_suficiente
    FROM producto_ingredientes pi
    JOIN ingredientes i ON pi.ingrediente_id = i.id
    WHERE pi.producto_id = p_producto_id
  )
  SELECT 
    (SELECT COUNT(*) = 0 FROM ingredientes_necesarios WHERE NOT hay_suficiente) as puede_producir,
    ARRAY(
      SELECT nombre || ' (necesitas ' || cantidad_total_necesaria || ' ' || unidad_medida || ', tienes ' || stock_actual || ')'
      FROM ingredientes_necesarios 
      WHERE NOT hay_suficiente
    ) as ingredientes_faltantes;
END;
$$ LANGUAGE plpgsql;

-- Comentario
COMMENT ON FUNCTION puede_producir_producto IS 'Verifica si hay stock suficiente de ingredientes para producir un producto';

-- ============================================
-- 7️⃣ FUNCIÓN: Descontar stock al registrar venta
-- ============================================
CREATE OR REPLACE FUNCTION descontar_stock_venta()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo descontar si la venta está confirmada o entregada
  IF NEW.estado IN ('confirmado', 'preparando', 'enviado', 'entregado') THEN
    -- Descontar stock de cada ingrediente del producto
    UPDATE ingredientes i
    SET stock_actual = stock_actual - (pi.cantidad_necesaria * NEW.cantidad)
    FROM producto_ingredientes pi
    WHERE i.id = pi.ingrediente_id
      AND pi.producto_id = NEW.producto_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger (opcional - comentado por seguridad)
-- Si quieres que el stock se descuente automáticamente al confirmar ventas, descomenta esto:
/*
CREATE TRIGGER trigger_descontar_stock_venta
AFTER INSERT OR UPDATE ON ventas
FOR EACH ROW
WHEN (NEW.estado IN ('confirmado', 'preparando', 'enviado', 'entregado'))
EXECUTE FUNCTION descontar_stock_venta();
*/

-- ============================================
-- ✅ VISTAS Y FUNCIONES CREADAS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Sistema de costos implementado';
  RAISE NOTICE '📊 Vistas creadas: 5';
  RAISE NOTICE '⚙️ Funciones: 2';
  RAISE NOTICE '💰 Ahora puedes calcular ganancias reales';
END $$;


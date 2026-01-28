-- ============================================
-- FIX: record "new" has no field "venta_id"
-- ============================================
-- El trigger antiguo en ventas llama a descontar_stock_venta() que usa NEW.venta_id.
-- Eso solo existe en venta_productos. Al insertar en ventas, NEW no tiene venta_id.
-- Solución: quitar el trigger de la tabla ventas. El descuento de stock se hace
-- al insertar en venta_productos (trigger trigger_descontar_stock_venta_producto).
--
-- Ejecuta este script en el SQL Editor de Supabase.
-- ============================================

DROP TRIGGER IF EXISTS trigger_descontar_stock_venta ON ventas;

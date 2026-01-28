-- ============================================
-- FIX: Columna created_by en ventas
-- ============================================
-- Error: "Could not find the 'created_by' column of 'ventas' in the schema cache"
-- Ejecuta este script en Supabase → SQL Editor → New query → Run
-- ============================================

ALTER TABLE ventas
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_ventas_created_by ON ventas(created_by);

COMMENT ON COLUMN ventas.created_by IS 'Usuario que registró la venta (admin o vendedor)';

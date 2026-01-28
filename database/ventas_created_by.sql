-- ============================================
-- VENTAS: Quién registró la venta (created_by)
-- ============================================
-- Vendedor: solo ve y actualiza sus propias ventas.
-- Admin: ve y gestiona todas.
-- Ejecutar en Supabase SQL Editor (después de usuarios_roles.sql).
-- ============================================

-- 1. Añadir columna created_by
ALTER TABLE ventas
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_ventas_created_by ON ventas(created_by);
COMMENT ON COLUMN ventas.created_by IS 'Usuario que registró la venta (admin o vendedor)';

-- 2. RLS: reemplazar política genérica por admin + vendedor
DROP POLICY IF EXISTS "Admin full access ventas" ON ventas;
CREATE POLICY "Admin full access ventas"
  ON ventas FOR ALL TO authenticated
  USING (es_admin_usuario(auth.uid()))
  WITH CHECK (es_admin_usuario(auth.uid()));

DROP POLICY IF EXISTS "Vendedor ve solo sus ventas" ON ventas;
CREATE POLICY "Vendedor ve solo sus ventas"
  ON ventas FOR SELECT TO authenticated
  USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Vendedor actualiza solo sus ventas" ON ventas;
CREATE POLICY "Vendedor actualiza solo sus ventas"
  ON ventas FOR UPDATE TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

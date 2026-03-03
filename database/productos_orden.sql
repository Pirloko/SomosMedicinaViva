-- ============================================
-- ORDEN DE PRODUCTOS EN EL CATÁLOGO
-- ============================================
-- Añade la columna 'orden' para definir el orden de aparición
-- en "Nuestro Catálogo". Se gestiona desde Admin → Productos.
-- Ejecutar en Supabase SQL Editor.
-- ============================================

-- Añadir columna si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'productos' AND column_name = 'orden'
  ) THEN
    ALTER TABLE productos ADD COLUMN orden INTEGER NOT NULL DEFAULT 0;
    COMMENT ON COLUMN productos.orden IS 'Orden de visualización en el catálogo público (menor = primero)';
  END IF;
END $$;

-- Asignar orden inicial por fecha de creación (los más recientes primero = 0, 1, 2...)
WITH numerados AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC NULLS LAST) - 1 AS nuevo_orden
  FROM productos
)
UPDATE productos p
SET orden = n.nuevo_orden
FROM numerados n
WHERE p.id = n.id AND (p.orden IS NULL OR p.orden = 0);

-- Índice para ordenar rápido en el catálogo
CREATE INDEX IF NOT EXISTS idx_productos_orden ON productos(orden ASC);

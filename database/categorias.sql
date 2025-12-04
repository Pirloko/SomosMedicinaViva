-- ============================================
-- MEDICINA VIVA BAKERY - CATEGORÍAS
-- ============================================
-- Sistema de categorías dinámicas
-- ============================================

-- ============================================
-- TABLA: CATEGORÍAS
-- ============================================
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  icono TEXT,
  color TEXT,
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_categorias_slug ON categorias(slug);
CREATE INDEX IF NOT EXISTS idx_categorias_activo ON categorias(activo);
CREATE INDEX IF NOT EXISTS idx_categorias_orden ON categorias(orden);

-- Comentarios
COMMENT ON TABLE categorias IS 'Categorías de productos gestionables desde el admin';
COMMENT ON COLUMN categorias.slug IS 'Identificador único para URLs (tortas, galletas, etc.)';
COMMENT ON COLUMN categorias.icono IS 'Nombre del icono de lucide-react (opcional)';

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- Público: Ver categorías activas
CREATE POLICY "Categorias activas son públicas"
  ON categorias
  FOR SELECT
  USING (activo = true);

-- Admin: CRUD completo
CREATE POLICY "Admin full access categorias"
  ON categorias
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- TRIGGER: Updated_at automático
-- ============================================
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS INICIALES: Categorías por defecto
-- ============================================
INSERT INTO categorias (nombre, slug, descripcion, orden) VALUES
  ('Todos', 'all', 'Todos los productos', 0),
  ('Tortas', 'tortas', 'Tortas y pasteles saludables', 1),
  ('Galletas', 'galletas', 'Galletas y alfajores', 2),
  ('Panes Dulces', 'panes', 'Panes, muffins y brownies', 3),
  ('Navideños', 'navidad', 'Productos especiales de Navidad', 4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ACTUALIZAR CONSTRAINT DE PRODUCTOS
-- ============================================
-- Eliminar constraint viejo de categoría fija
ALTER TABLE productos DROP CONSTRAINT IF EXISTS productos_categoria_check;

-- Ahora la categoría debe existir en la tabla categorias
-- (Esto se puede hacer con una foreign key, pero por flexibilidad lo dejamos como TEXT por ahora)

-- ============================================
-- VISTA: Productos por Categoría con Count
-- ============================================
CREATE OR REPLACE VIEW vista_categorias_con_productos AS
SELECT 
  c.id,
  c.nombre,
  c.slug,
  c.descripcion,
  c.icono,
  c.color,
  c.orden,
  c.activo,
  COUNT(p.id) FILTER (WHERE p.activo = true) as productos_activos,
  COUNT(p.id) as productos_totales
FROM categorias c
LEFT JOIN productos p ON p.categoria = c.slug
GROUP BY c.id, c.nombre, c.slug, c.descripcion, c.icono, c.color, c.orden, c.activo
ORDER BY c.orden;

-- Comentario
COMMENT ON VIEW vista_categorias_con_productos IS 'Categorías con conteo de productos';

-- ============================================
-- ✅ SISTEMA DE CATEGORÍAS CREADO
-- ============================================

DO $$
DECLARE
  categoria_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO categoria_count FROM categorias;
  
  RAISE NOTICE '✅ Sistema de categorías implementado';
  RAISE NOTICE '🏷️ Categorías creadas: %', categoria_count;
  RAISE NOTICE '📊 Vista con conteo de productos: ✓';
  RAISE NOTICE '🔒 RLS configurado: ✓';
END $$;


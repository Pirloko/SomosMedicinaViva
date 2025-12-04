-- ============================================
-- MEDICINA VIVA BAKERY - CARRUSEL HERO
-- ============================================
-- Sistema de imágenes del carrusel del Hero
-- ============================================

-- ============================================
-- TABLA: HERO_IMAGENES
-- ============================================
CREATE TABLE IF NOT EXISTS hero_imagenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT,
  subtitulo TEXT,
  imagen_url TEXT NOT NULL,
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_hero_imagenes_orden ON hero_imagenes(orden);
CREATE INDEX IF NOT EXISTS idx_hero_imagenes_activo ON hero_imagenes(activo);

-- Comentarios
COMMENT ON TABLE hero_imagenes IS 'Imágenes del carrusel de la sección Hero';
COMMENT ON COLUMN hero_imagenes.titulo IS 'Título opcional para la imagen';
COMMENT ON COLUMN hero_imagenes.subtitulo IS 'Subtítulo opcional para la imagen';

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE hero_imagenes ENABLE ROW LEVEL SECURITY;

-- Público: Ver imágenes activas
CREATE POLICY "Hero imagenes activas son públicas"
  ON hero_imagenes
  FOR SELECT
  USING (activo = true);

-- Admin: CRUD completo
CREATE POLICY "Admin full access hero_imagenes"
  ON hero_imagenes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- TRIGGER: Updated_at automático
-- ============================================
CREATE TRIGGER update_hero_imagenes_updated_at BEFORE UPDATE ON hero_imagenes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS INICIALES: Imágenes por defecto
-- ============================================
INSERT INTO hero_imagenes (titulo, subtitulo, imagen_url, orden) VALUES
  ('Torta de Chocolate', 'Deliciosa y saludable', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop', 1),
  ('Pastelería Saludable', '100% Natural', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=600&fit=crop', 2),
  ('Sin Azúcar, Con Sabor', 'Productos artesanales', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop', 3)
ON CONFLICT DO NOTHING;

-- ============================================
-- ACTUALIZAR TIPOS TYPESCRIPT
-- ============================================
-- Recuerda agregar este tipo a database.types.ts:
/*
hero_imagenes: {
  Row: {
    id: string
    titulo: string | null
    subtitulo: string | null
    imagen_url: string
    orden: number
    activo: boolean
    created_at: string
    updated_at: string
  }
  Insert: { ... }
  Update: { ... }
}
*/

-- ============================================
-- ✅ SISTEMA DE CARRUSEL CREADO
-- ============================================

DO $$
DECLARE
  imagen_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO imagen_count FROM hero_imagenes;
  
  RAISE NOTICE '✅ Sistema de carrusel Hero implementado';
  RAISE NOTICE '🎠 Imágenes creadas: %', imagen_count;
  RAISE NOTICE '🔒 RLS configurado: ✓';
END $$;


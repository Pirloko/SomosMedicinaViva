-- ============================================
-- ETIQUETAS DEL BANNER HERO (portada)
-- ============================================
-- Textos e iconos de las etiquetas que aparecen junto a las fotos del carrusel.
-- Una sola fila. Editable desde Admin → Imágenes de la portada.
-- ============================================

CREATE TABLE IF NOT EXISTS hero_etiquetas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Etiquetas flotantes (las 2 tarjetas sobre la imagen)
  floating_1_label TEXT NOT NULL DEFAULT 'Sin Azúcar',
  floating_1_value TEXT NOT NULL DEFAULT '100%',
  floating_2_label TEXT NOT NULL DEFAULT 'Vegano',
  floating_2_value TEXT NOT NULL DEFAULT '🌱',
  -- Pills debajo del título (icono = nombre Lucide: Heart, Leaf, Sparkles, etc.)
  feature_1_icon TEXT NOT NULL DEFAULT 'Heart',
  feature_1_text TEXT NOT NULL DEFAULT 'Apto diabéticos',
  feature_2_icon TEXT NOT NULL DEFAULT 'Leaf',
  feature_2_text TEXT NOT NULL DEFAULT 'Vegano',
  feature_3_icon TEXT NOT NULL DEFAULT 'Sparkles',
  feature_3_text TEXT NOT NULL DEFAULT 'Sin gluten',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE hero_etiquetas IS 'Etiquetas del banner Hero: flotantes y pills. Una sola fila.';

ALTER TABLE hero_etiquetas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hero etiquetas público"
  ON hero_etiquetas FOR SELECT USING (true);

CREATE POLICY "Admin puede actualizar hero_etiquetas"
  ON hero_etiquetas FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION trigger_hero_etiquetas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_hero_etiquetas_updated_at ON hero_etiquetas;
CREATE TRIGGER update_hero_etiquetas_updated_at
  BEFORE UPDATE ON hero_etiquetas
  FOR EACH ROW EXECUTE FUNCTION trigger_hero_etiquetas_updated_at();

INSERT INTO hero_etiquetas (
  floating_1_label, floating_1_value,
  floating_2_label, floating_2_value,
  feature_1_icon, feature_1_text,
  feature_2_icon, feature_2_text,
  feature_3_icon, feature_3_text
)
SELECT
  'Sin Azúcar', '100%',
  'Vegano', '🌱',
  'Heart', 'Apto diabéticos',
  'Leaf', 'Vegano',
  'Sparkles', 'Sin gluten'
WHERE NOT EXISTS (SELECT 1 FROM hero_etiquetas LIMIT 1);

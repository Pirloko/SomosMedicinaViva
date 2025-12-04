-- ============================================
-- MEDICINA VIVA BAKERY - CONTENIDO ABOUT
-- ============================================
-- Sistema de gestión de contenido "Nosotros"
-- ============================================

-- ============================================
-- TABLA: ABOUT_CONTENT
-- ============================================
CREATE TABLE IF NOT EXISTS about_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL DEFAULT 'Quiénes Somos',
  parrafo_1 TEXT NOT NULL,
  parrafo_2 TEXT,
  parrafo_3 TEXT,
  imagen_url TEXT,
  estadistica_numero TEXT DEFAULT '+500',
  estadistica_texto TEXT DEFAULT 'Clientes felices cada mes',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: ABOUT_VALUES (Valores: Con Amor, Natural, Calidad)
-- ============================================
CREATE TABLE IF NOT EXISTS about_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  icono TEXT NOT NULL DEFAULT 'Heart',
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_about_values_orden ON about_values(orden);
CREATE INDEX IF NOT EXISTS idx_about_values_activo ON about_values(activo);

-- Comentarios
COMMENT ON TABLE about_content IS 'Contenido principal de la sección Nosotros';
COMMENT ON TABLE about_values IS 'Valores/etiquetas de la sección Nosotros (Con Amor, Natural, Calidad)';

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_values ENABLE ROW LEVEL SECURITY;

-- Público: Ver contenido
CREATE POLICY "About content es público"
  ON about_content
  FOR SELECT
  USING (true);

CREATE POLICY "About values activos son públicos"
  ON about_values
  FOR SELECT
  USING (activo = true);

-- Admin: CRUD completo
CREATE POLICY "Admin full access about_content"
  ON about_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access about_values"
  ON about_values
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- TRIGGERS: Updated_at automático
-- ============================================
CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON about_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_values_updated_at BEFORE UPDATE ON about_values
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Contenido principal (solo 1 registro)
INSERT INTO about_content (
  titulo,
  parrafo_1,
  parrafo_2,
  parrafo_3,
  imagen_url,
  estadistica_numero,
  estadistica_texto
) VALUES (
  'Quiénes Somos',
  'Medicina Viva nació de la necesidad de disfrutar sin culpa. Como emprendedoras con restricciones alimentarias, entendemos lo difícil que es encontrar opciones realmente saludables y deliciosas.',
  'Cada receta es desarrollada con amor y conocimiento, probada rigurosamente para asegurar que sea apta para personas con diabetes, celiaquía, intolerancias y quienes eligen un estilo de vida vegano.',
  'Creemos que la comida es medicina. Por eso, seleccionamos ingredientes que nutren tu cuerpo mientras deleitan tu paladar.',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=750&fit=crop',
  '+500',
  'Clientes felices cada mes'
) ON CONFLICT DO NOTHING;

-- Valores (Con Amor, Natural, Calidad)
INSERT INTO about_values (titulo, descripcion, icono, orden) VALUES
  ('Con Amor', 'Hecho a mano', 'Heart', 1),
  ('Natural', 'Sin químicos', 'Leaf', 2),
  ('Calidad', 'Premium', 'Award', 3)
ON CONFLICT DO NOTHING;

-- ============================================
-- ✅ SISTEMA DE GESTIÓN ABOUT CREADO
-- ============================================

DO $$
DECLARE
  content_count INTEGER;
  values_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO content_count FROM about_content;
  SELECT COUNT(*) INTO values_count FROM about_values;
  
  RAISE NOTICE '✅ Sistema de gestión About implementado';
  RAISE NOTICE '📝 Contenido principal: % registro(s)', content_count;
  RAISE NOTICE '🏷️ Valores creados: %', values_count;
  RAISE NOTICE '🔒 RLS configurado: ✓';
END $$;


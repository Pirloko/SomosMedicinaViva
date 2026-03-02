-- ============================================
-- INFORMACIÓN DE LA SECCIÓN DELIVERY (PÚBLICA)
-- ============================================
-- Textos editables desde Admin: Horarios de entrega, Costo de envío, Punto de retiro.
-- Una sola fila. Ejecutar en Supabase SQL Editor.
-- ============================================

CREATE TABLE IF NOT EXISTS delivery_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horarios_entrega TEXT NOT NULL DEFAULT 'Lunes a Viernes: 10:00 - 19:00 hrs' || E'\n' || 'Sábados: 10:00 - 14:00 hrs',
  costo_envio_texto TEXT NOT NULL DEFAULT 'Desde $3.990 según zona' || E'\n' || 'Envío gratis en compras sobre $40.000',
  punto_retiro_texto TEXT NOT NULL DEFAULT 'Disponible retiro sin costo' || E'\n' || 'Coordinar horario por WhatsApp',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE delivery_info IS 'Textos de la sección Delivery (horarios, costo, retiro). Una sola fila.';

-- RLS: público puede leer; solo admin puede actualizar (usamos política por authenticated, el front solo muestra edición a admin)
ALTER TABLE delivery_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Delivery info es público"
  ON delivery_info
  FOR SELECT
  USING (true);

CREATE POLICY "Admin puede actualizar delivery_info"
  ON delivery_info
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION trigger_delivery_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_delivery_info_updated_at ON delivery_info;
CREATE TRIGGER update_delivery_info_updated_at
  BEFORE UPDATE ON delivery_info
  FOR EACH ROW EXECUTE FUNCTION trigger_delivery_info_updated_at();

-- Insertar la única fila si la tabla está vacía
INSERT INTO delivery_info (horarios_entrega, costo_envio_texto, punto_retiro_texto)
SELECT
  'Lunes a Viernes: 10:00 - 19:00 hrs' || E'\n' || 'Sábados: 10:00 - 14:00 hrs',
  'Desde $3.990 según zona' || E'\n' || 'Envío gratis en compras sobre $40.000',
  'Disponible retiro sin costo' || E'\n' || 'Coordinar horario por WhatsApp'
WHERE NOT EXISTS (SELECT 1 FROM delivery_info LIMIT 1);

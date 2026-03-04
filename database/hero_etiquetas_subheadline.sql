-- Añadir subtítulo del Hero (texto debajo de "Pastelería Saludable")
-- Ejecutar en Supabase SQL Editor si ya tienes la tabla hero_etiquetas.

ALTER TABLE hero_etiquetas
  ADD COLUMN IF NOT EXISTS subheadline TEXT NOT NULL DEFAULT 'Sin azúcar · Sin gluten · Sin refinados · 100% Vegana';

COMMENT ON COLUMN hero_etiquetas.subheadline IS 'Texto debajo del título principal del Hero. Editable desde Admin → Imágenes de la portada.';

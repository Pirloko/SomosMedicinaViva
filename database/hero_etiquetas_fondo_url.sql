-- Añadir columna para URL de imagen de fondo del sitio (editable desde Admin)
-- Ejecutar si la tabla hero_etiquetas ya existía sin esta columna.

ALTER TABLE hero_etiquetas
  ADD COLUMN IF NOT EXISTS fondo_url TEXT;

COMMENT ON COLUMN hero_etiquetas.fondo_url IS 'URL de la imagen de fondo del sitio (body). Null = usar /imagen/fondo.jpg';

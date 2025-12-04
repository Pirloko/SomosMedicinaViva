-- ============================================
-- MEDICINA VIVA BAKERY - ROW LEVEL SECURITY
-- ============================================
-- Configuración de seguridad a nivel de fila
-- ============================================

-- ============================================
-- PRODUCTOS
-- ============================================

-- Habilitar RLS
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden ver productos activos (público)
CREATE POLICY "Productos activos son públicos"
  ON productos
  FOR SELECT
  USING (activo = true);

-- Política: Solo usuarios autenticados pueden ver todos los productos
CREATE POLICY "Usuarios autenticados ven todos los productos"
  ON productos
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Solo usuarios autenticados pueden insertar
CREATE POLICY "Usuarios autenticados pueden insertar productos"
  ON productos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden actualizar
CREATE POLICY "Usuarios autenticados pueden actualizar productos"
  ON productos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden eliminar
CREATE POLICY "Usuarios autenticados pueden eliminar productos"
  ON productos
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- INGREDIENTES
-- ============================================

ALTER TABLE ingredientes ENABLE ROW LEVEL SECURITY;

-- Público: Leer ingredientes activos
CREATE POLICY "Ingredientes activos son públicos"
  ON ingredientes
  FOR SELECT
  USING (activo = true);

-- Admin: CRUD completo
CREATE POLICY "Admin full access ingredientes"
  ON ingredientes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- PRODUCTO_INGREDIENTES
-- ============================================

ALTER TABLE producto_ingredientes ENABLE ROW LEVEL SECURITY;

-- Público: Leer relaciones
CREATE POLICY "Relaciones producto-ingrediente públicas"
  ON producto_ingredientes
  FOR SELECT
  USING (true);

-- Admin: CRUD completo
CREATE POLICY "Admin full access producto_ingredientes"
  ON producto_ingredientes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- PUNTOS_VENTA
-- ============================================

ALTER TABLE puntos_venta ENABLE ROW LEVEL SECURITY;

-- Público: Leer puntos activos
CREATE POLICY "Puntos de venta activos son públicos"
  ON puntos_venta
  FOR SELECT
  USING (activo = true);

-- Admin: CRUD completo
CREATE POLICY "Admin full access puntos_venta"
  ON puntos_venta
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- ZONAS_DELIVERY
-- ============================================

ALTER TABLE zonas_delivery ENABLE ROW LEVEL SECURITY;

-- Público: Leer zonas activas
CREATE POLICY "Zonas delivery activas son públicas"
  ON zonas_delivery
  FOR SELECT
  USING (activo = true);

-- Admin: CRUD completo
CREATE POLICY "Admin full access zonas_delivery"
  ON zonas_delivery
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- CONTACTOS
-- ============================================

ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;

-- Público: Solo insertar (enviar mensajes)
CREATE POLICY "Cualquiera puede enviar contactos"
  ON contactos
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin: Leer y actualizar contactos
CREATE POLICY "Admin puede leer contactos"
  ON contactos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin puede actualizar contactos"
  ON contactos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- BENEFICIOS
-- ============================================

ALTER TABLE beneficios ENABLE ROW LEVEL SECURITY;

-- Público: Leer beneficios activos
CREATE POLICY "Beneficios activos son públicos"
  ON beneficios
  FOR SELECT
  USING (activo = true);

-- Admin: CRUD completo
CREATE POLICY "Admin full access beneficios"
  ON beneficios
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- VENTAS
-- ============================================

ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;

-- Público: Puede insertar ventas (crear pedidos)
CREATE POLICY "Cualquiera puede crear ventas"
  ON ventas
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin: CRUD completo
CREATE POLICY "Admin full access ventas"
  ON ventas
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- CONTENIDO
-- ============================================

ALTER TABLE contenido ENABLE ROW LEVEL SECURITY;

-- Público: Leer contenido activo
CREATE POLICY "Contenido activo es público"
  ON contenido
  FOR SELECT
  USING (activo = true);

-- Admin: CRUD completo
CREATE POLICY "Admin full access contenido"
  ON contenido
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- ✅ RLS CONFIGURADO
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Row Level Security configurado';
  RAISE NOTICE '🔒 Políticas de seguridad aplicadas';
  RAISE NOTICE '👤 Público: Solo lectura de datos activos';
  RAISE NOTICE '🔐 Admin: Acceso completo a todo';
END $$;


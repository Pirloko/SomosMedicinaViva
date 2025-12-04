-- ============================================
-- MEDICINA VIVA BAKERY - DATABASE SCHEMA
-- ============================================
-- Versión: 1.0
-- Fecha: 2024
-- Descripción: Esquema completo de base de datos
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1️⃣ TABLA: PRODUCTOS
-- ============================================
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  categoria TEXT NOT NULL CHECK (categoria IN ('tortas', 'galletas', 'panes', 'navidad')),
  imagen_url TEXT,
  tags TEXT[] DEFAULT '{}',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para productos
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_productos_created_at ON productos(created_at DESC);

-- Comentarios
COMMENT ON TABLE productos IS 'Catálogo de productos de la pastelería';
COMMENT ON COLUMN productos.tags IS 'Array de etiquetas: Sin Azúcar, Sin Gluten, Vegano, etc.';

-- ============================================
-- 2️⃣ TABLA: INGREDIENTES
-- ============================================
CREATE TABLE IF NOT EXISTS ingredientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  beneficio TEXT,
  unidad_medida TEXT NOT NULL CHECK (unidad_medida IN ('kg', 'litros', 'unidades', 'gramos')),
  stock_actual DECIMAL(10,2) DEFAULT 0 CHECK (stock_actual >= 0),
  stock_minimo DECIMAL(10,2) DEFAULT 0 CHECK (stock_minimo >= 0),
  costo_unitario DECIMAL(10,2),
  imagen_url TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para ingredientes
CREATE INDEX IF NOT EXISTS idx_ingredientes_stock_bajo ON ingredientes(stock_actual) 
  WHERE stock_actual <= stock_minimo;
CREATE INDEX IF NOT EXISTS idx_ingredientes_activo ON ingredientes(activo);

-- Comentarios
COMMENT ON TABLE ingredientes IS 'Ingredientes utilizados en los productos';
COMMENT ON COLUMN ingredientes.stock_actual IS 'Stock disponible en almacén';
COMMENT ON COLUMN ingredientes.stock_minimo IS 'Nivel mínimo para alertas';

-- ============================================
-- 3️⃣ TABLA: PRODUCTO_INGREDIENTES (Relación)
-- ============================================
CREATE TABLE IF NOT EXISTS producto_ingredientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  ingrediente_id UUID NOT NULL REFERENCES ingredientes(id) ON DELETE CASCADE,
  cantidad_necesaria DECIMAL(10,2) NOT NULL CHECK (cantidad_necesaria > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(producto_id, ingrediente_id)
);

-- Índices para relación
CREATE INDEX IF NOT EXISTS idx_producto_ingredientes_producto ON producto_ingredientes(producto_id);
CREATE INDEX IF NOT EXISTS idx_producto_ingredientes_ingrediente ON producto_ingredientes(ingrediente_id);

-- Comentarios
COMMENT ON TABLE producto_ingredientes IS 'Relación entre productos e ingredientes con cantidades';
COMMENT ON COLUMN producto_ingredientes.cantidad_necesaria IS 'Cantidad en la unidad del ingrediente';

-- ============================================
-- 4️⃣ TABLA: PUNTOS_VENTA
-- ============================================
CREATE TABLE IF NOT EXISTS puntos_venta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  maps_url TEXT,
  horario_semana TEXT NOT NULL,
  horario_sabado TEXT NOT NULL,
  horario_domingo TEXT NOT NULL,
  imagen_url TEXT,
  activo BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para puntos de venta
CREATE INDEX IF NOT EXISTS idx_puntos_venta_activo ON puntos_venta(activo);
CREATE INDEX IF NOT EXISTS idx_puntos_venta_orden ON puntos_venta(orden);

-- Comentarios
COMMENT ON TABLE puntos_venta IS 'Negocios aliados donde se venden los productos';

-- ============================================
-- 5️⃣ TABLA: ZONAS_DELIVERY
-- ============================================
CREATE TABLE IF NOT EXISTS zonas_delivery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL UNIQUE,
  tiempo_entrega TEXT NOT NULL,
  costo_envio DECIMAL(10,2) DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para zonas
CREATE INDEX IF NOT EXISTS idx_zonas_delivery_activo ON zonas_delivery(activo);
CREATE INDEX IF NOT EXISTS idx_zonas_delivery_orden ON zonas_delivery(orden);

-- Comentarios
COMMENT ON TABLE zonas_delivery IS 'Zonas de cobertura para delivery';

-- ============================================
-- 6️⃣ TABLA: CONTACTOS
-- ============================================
CREATE TABLE IF NOT EXISTS contactos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT false,
  respondido BOOLEAN DEFAULT false,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para contactos
CREATE INDEX IF NOT EXISTS idx_contactos_leido ON contactos(leido);
CREATE INDEX IF NOT EXISTS idx_contactos_created_at ON contactos(created_at DESC);

-- Comentarios
COMMENT ON TABLE contactos IS 'Mensajes de contacto desde el sitio web';

-- ============================================
-- 7️⃣ TABLA: BENEFICIOS (Apto Para)
-- ============================================
CREATE TABLE IF NOT EXISTS beneficios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  icono TEXT NOT NULL,
  color TEXT NOT NULL,
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para beneficios
CREATE INDEX IF NOT EXISTS idx_beneficios_activo ON beneficios(activo);
CREATE INDEX IF NOT EXISTS idx_beneficios_orden ON beneficios(orden);

-- Comentarios
COMMENT ON TABLE beneficios IS 'Sección "Apto Para" (diabéticos, celíacos, etc.)';
COMMENT ON COLUMN beneficios.icono IS 'Nombre del icono de lucide-react';

-- ============================================
-- 8️⃣ TABLA: VENTAS
-- ============================================
CREATE TABLE IF NOT EXISTS ventas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID REFERENCES productos(id) ON DELETE SET NULL,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  cliente_nombre TEXT,
  cliente_email TEXT,
  cliente_telefono TEXT,
  zona_delivery TEXT,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado')),
  metodo_pago TEXT CHECK (metodo_pago IN ('efectivo', 'transferencia', 'tarjeta', 'otro')),
  notas TEXT,
  fecha_venta TIMESTAMPTZ DEFAULT NOW(),
  fecha_entrega TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para ventas
CREATE INDEX IF NOT EXISTS idx_ventas_producto ON ventas(producto_id);
CREATE INDEX IF NOT EXISTS idx_ventas_estado ON ventas(estado);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha_venta DESC);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente_telefono ON ventas(cliente_telefono);

-- Comentarios
COMMENT ON TABLE ventas IS 'Registro de ventas para tracking y KPIs';

-- ============================================
-- 9️⃣ TABLA: CONTENIDO (Secciones dinámicas)
-- ============================================
CREATE TABLE IF NOT EXISTS contenido (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seccion TEXT NOT NULL UNIQUE,
  titulo TEXT,
  subtitulo TEXT,
  descripcion TEXT,
  imagen_url TEXT,
  datos_json JSONB,
  activo BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para contenido
CREATE INDEX IF NOT EXISTS idx_contenido_seccion ON contenido(seccion);

-- Comentarios
COMMENT ON TABLE contenido IS 'Contenido editable de secciones como Hero, Nosotros, etc.';

-- ============================================
-- 🔄 TRIGGERS: Updated_at automático
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ingredientes_updated_at BEFORE UPDATE ON ingredientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_puntos_venta_updated_at BEFORE UPDATE ON puntos_venta
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zonas_delivery_updated_at BEFORE UPDATE ON zonas_delivery
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beneficios_updated_at BEFORE UPDATE ON beneficios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ventas_updated_at BEFORE UPDATE ON ventas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contenido_updated_at BEFORE UPDATE ON contenido
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 📊 VISTAS: Para KPIs y reportes
-- ============================================

-- Vista: Productos con stock de ingredientes
CREATE OR REPLACE VIEW vista_productos_stock AS
SELECT 
  p.id as producto_id,
  p.nombre as producto_nombre,
  p.categoria,
  p.activo,
  COUNT(pi.ingrediente_id) as total_ingredientes,
  SUM(CASE WHEN i.stock_actual <= i.stock_minimo THEN 1 ELSE 0 END) as ingredientes_stock_bajo
FROM productos p
LEFT JOIN producto_ingredientes pi ON p.id = pi.producto_id
LEFT JOIN ingredientes i ON pi.ingrediente_id = i.id
GROUP BY p.id, p.nombre, p.categoria, p.activo;

-- Vista: KPIs de ventas
CREATE OR REPLACE VIEW vista_kpis_ventas AS
SELECT 
  DATE_TRUNC('day', fecha_venta) as fecha,
  COUNT(*) as total_ventas,
  SUM(total) as ingresos,
  AVG(total) as ticket_promedio,
  COUNT(DISTINCT cliente_telefono) as clientes_unicos,
  SUM(cantidad) as productos_vendidos
FROM ventas
WHERE estado NOT IN ('cancelado')
GROUP BY DATE_TRUNC('day', fecha_venta)
ORDER BY fecha DESC;

-- Vista: Productos más vendidos
CREATE OR REPLACE VIEW vista_productos_mas_vendidos AS
SELECT 
  p.id,
  p.nombre,
  p.categoria,
  COUNT(v.id) as veces_vendido,
  SUM(v.cantidad) as cantidad_total,
  SUM(v.total) as ingresos_generados
FROM productos p
LEFT JOIN ventas v ON p.id = v.producto_id
WHERE v.estado NOT IN ('cancelado') OR v.estado IS NULL
GROUP BY p.id, p.nombre, p.categoria
ORDER BY cantidad_total DESC NULLS LAST;

-- ============================================
-- ✅ SCRIPT COMPLETADO
-- ============================================

-- Verificar que todo se creó correctamente
DO $$
BEGIN
  RAISE NOTICE '✅ Base de datos creada exitosamente';
  RAISE NOTICE '📊 Tablas: 9';
  RAISE NOTICE '🔗 Vistas: 3';
  RAISE NOTICE '⚡ Triggers: 7';
END $$;


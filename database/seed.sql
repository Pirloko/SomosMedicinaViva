-- ============================================
-- MEDICINA VIVA BAKERY - DATOS INICIALES
-- ============================================
-- Seed data para poblar la base de datos
-- ============================================

-- Limpiar datos existentes (solo en desarrollo)
-- TRUNCATE productos, ingredientes, producto_ingredientes, puntos_venta, zonas_delivery, beneficios CASCADE;

-- ============================================
-- 1️⃣ PRODUCTOS (Migrar del código actual)
-- ============================================

INSERT INTO productos (nombre, descripcion, precio, categoria, imagen_url, tags) VALUES
  ('Torta de Chocolate', 'Exquisita torta de cacao con crema de coco y frambuesas frescas', 18990, 'tortas', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', ARRAY['Sin Azúcar', 'Sin Gluten', 'Vegano']),
  ('Torta de Zanahoria', 'Suave bizcocho de zanahoria con frosting de anacardos y canela', 16990, 'tortas', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=400&fit=crop', ARRAY['Sin Azúcar', 'Sin Gluten', 'Vegano']),
  ('Cheesecake de Arándanos', 'Cremoso cheesecake vegano con base de nueces y topping de arándanos', 19990, 'tortas', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop', ARRAY['Sin Azúcar', 'Sin Gluten', 'Vegano']),
  ('Galletas de Avena', 'Crujientes galletas con chips de chocolate y pasas de uva', 6990, 'galletas', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop', ARRAY['Sin Azúcar', 'Vegano']),
  ('Alfajores de Maicena', 'Delicados alfajores rellenos con dulce de dátiles', 8990, 'galletas', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', ARRAY['Sin Azúcar', 'Sin Gluten', 'Vegano']),
  ('Brownies de Almendra', 'Intensos brownies con nueces y un toque de café', 7990, 'galletas', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop', ARRAY['Sin Azúcar', 'Sin Gluten', 'Vegano']),
  ('Pan de Plátano', 'Esponjoso pan con plátano maduro, nueces y canela', 9990, 'panes', 'https://images.unsplash.com/photo-1605286978633-2dec93ff88a2?w=400&h=400&fit=crop', ARRAY['Sin Azúcar', 'Sin Gluten', 'Vegano']),
  ('Muffins de Arándanos', 'Tiernos muffins con arándanos frescos y limón', 5990, 'panes', 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=400&fit=crop', ARRAY['Sin Azúcar', 'Sin Gluten', 'Vegano']),
  ('Tronco de Navidad', 'Clásico tronco navideño de chocolate con crema de avellanas', 24990, 'navidad', 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=400&fit=crop', ARRAY['Sin Azúcar', 'Sin Gluten', 'Vegano', 'Navideño']),
  ('Pan de Pascua', 'Tradicional pan de pascua con frutas confitadas naturales', 14990, 'navidad', 'https://images.unsplash.com/photo-1609956401453-2cee5f9ae7e2?w=400&h=400&fit=crop', ARRAY['Sin Azúcar', 'Sin Gluten', 'Vegano', 'Navideño'])
ON CONFLICT DO NOTHING;

-- ============================================
-- 2️⃣ INGREDIENTES
-- ============================================

INSERT INTO ingredientes (nombre, descripcion, beneficio, unidad_medida, stock_actual, stock_minimo, costo_unitario, imagen_url) VALUES
  ('Cacao Puro', '100% cacao orgánico sin procesar', 'Rico en antioxidantes y mejora el ánimo', 'kg', 50, 10, 12000, 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=200&h=200&fit=crop'),
  ('Dátiles', 'Dátiles Medjool premium sin carozo', 'Endulzante natural con fibra y minerales', 'kg', 30, 5, 8000, 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=200&h=200&fit=crop'),
  ('Harina de Almendra', 'Harina de almendra sin gluten', 'Alta en proteína y vitamina E', 'kg', 40, 8, 15000, 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=200&h=200&fit=crop'),
  ('Aceite de Coco', 'Aceite de coco virgen extra', 'Grasas saludables que aportan energía', 'litros', 25, 5, 10000, 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=200&h=200&fit=crop'),
  ('Leche de Coco', 'Leche de coco orgánica cremosa', 'Cremosidad vegetal sin lácteos', 'litros', 35, 8, 6000, 'https://images.unsplash.com/photo-1550411294-875fa4b9c515?w=200&h=200&fit=crop'),
  ('Avena sin Gluten', 'Avena certificada sin gluten', 'Fibra soluble que regula el azúcar', 'kg', 60, 15, 4000, 'https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=200&h=200&fit=crop'),
  ('Stevia', 'Stevia pura en polvo', 'Endulzante natural sin calorías', 'gramos', 500, 100, 50, 'https://images.unsplash.com/photo-1604467707321-70d5ac45adda?w=200&h=200&fit=crop'),
  ('Anacardos', 'Anacardos crudos sin sal', 'Ricos en grasas saludables y cremosidad', 'kg', 20, 5, 18000, 'https://images.unsplash.com/photo-1622130745881-34bb86e50bc3?w=200&h=200&fit=crop')
ON CONFLICT (nombre) DO NOTHING;

-- ============================================
-- 3️⃣ BENEFICIOS (Apto Para)
-- ============================================

INSERT INTO beneficios (titulo, descripcion, icono, color, orden) VALUES
  ('Diabéticos', 'Sin azúcar añadida. Endulzamos con dátiles, monk fruit y stevia. Índice glucémico bajo.', 'Heart', 'bg-red-50 text-red-500', 1),
  ('Celíacos', '100% libre de gluten. Usamos harinas de almendra, coco y avena certificada sin gluten.', 'Ban', 'bg-amber-50 text-amber-600', 2),
  ('Intolerantes', 'Sin lácteos, sin huevo, sin soya. Alternativas naturales que cuidan tu digestión.', 'Sparkles', 'bg-blue-50 text-blue-500', 3),
  ('Veganos', '100% plant-based. Sin ingredientes de origen animal. Cruelty-free y delicioso.', 'Users', 'bg-primary-light text-primary', 4),
  ('APLV', 'Sin proteína de leche de vaca. Seguro para bebés y niños con alergia a la leche.', 'Baby', 'bg-purple-50 text-purple-500', 5),
  ('Bariátricos', 'Porciones controladas, sin azúcar refinada, bajo en carbohidratos simples.', 'Activity', 'bg-teal-50 text-teal-500', 6)
ON CONFLICT DO NOTHING;

-- ============================================
-- 4️⃣ ZONAS DE DELIVERY (Región de Rancagua)
-- ============================================

INSERT INTO zonas_delivery (nombre, tiempo_entrega, costo_envio, orden) VALUES
  ('Rancagua', '24-48 hrs', 3990, 1),
  ('Graneros', '24-48 hrs', 3990, 2),
  ('Mostazal', '24-48 hrs', 4990, 3),
  ('Codegua', '24-48 hrs', 3990, 4),
  ('Machalí', '24-48 hrs', 3990, 5),
  ('Olivar', '24-48 hrs', 3990, 6),
  ('Coinco', '24-48 hrs', 4990, 7),
  ('Lo Miranda', '24-48 hrs', 4990, 8),
  ('Doñihue', '24-48 hrs', 4990, 9),
  ('Coltauco', '24-48 hrs', 4990, 10),
  ('Rengo', '24-48 hrs', 4990, 11),
  ('Requínoa', '24-48 hrs', 4990, 12)
ON CONFLICT (nombre) DO NOTHING;

-- ============================================
-- 5️⃣ PUNTOS DE VENTA (Rancagua y alrededores)
-- ============================================

INSERT INTO puntos_venta (nombre, direccion, maps_url, horario_semana, horario_sabado, horario_domingo, imagen_url, orden) VALUES
  ('Rosetto - Cafetería & Gelateria', 'Av. Alberto Einstein 705, Rancagua, O''Higgins', 'https://maps.app.goo.gl/tvDPW4KnXEhYCadM9', 'Lun - Vie: 09:00 - 20:00', 'Sáb: 10:00 - 18:00', 'Dom: 11:00 - 15:00', 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=400&h=300&fit=crop', 1),
  ('Tienda Natural Rancagua', 'Av. San Martín 450, Rancagua', 'https://maps.google.com/?q=Av.+San+Martin+450+Rancagua+Chile', 'Lun - Vie: 10:00 - 19:00', 'Sáb: 10:00 - 17:00', 'Cerrado', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop', 2),
  ('Verde Orgánico Graneros', 'Calle Principal 123, Graneros', 'https://maps.google.com/?q=Calle+Principal+123+Graneros+Chile', 'Lun - Vie: 09:30 - 19:30', 'Sáb: 10:00 - 17:00', 'Dom: 10:00 - 14:00', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop', 3),
  ('Mercado Saludable', 'Av. Millán 890, Rancagua', 'https://maps.google.com/?q=Av.+Millan+890+Rancagua+Chile', 'Lun - Vie: 08:30 - 20:00', 'Sáb: 09:00 - 19:00', 'Dom: 10:00 - 15:00', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop', 4)
ON CONFLICT DO NOTHING;

-- ============================================
-- 6️⃣ CONTENIDO (Secciones del sitio)
-- ============================================

INSERT INTO contenido (seccion, titulo, subtitulo, descripcion, imagen_url) VALUES
  ('hero', 'Pastelería Saludable', 'Sin azúcar · Sin gluten · Sin refinados · 100% Vegana', 'Productos artesanales elaborados con ingredientes naturales', NULL),
  ('nosotros', 'Nuestra Historia', 'Medicina Viva nace del amor por la pastelería y el bienestar', 'Creemos que comer rico y sano no son opuestos. Cada producto es elaborado artesanalmente con ingredientes naturales, sin azúcar refinada, sin gluten y 100% vegano. Porque tu salud es lo más importante.', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=750&fit=crop')
ON CONFLICT (seccion) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  subtitulo = EXCLUDED.subtitulo,
  descripcion = EXCLUDED.descripcion,
  imagen_url = EXCLUDED.imagen_url;

-- ============================================
-- ✅ DATOS INICIALES INSERTADOS
-- ============================================

DO $$
DECLARE
  producto_count INTEGER;
  ingrediente_count INTEGER;
  beneficio_count INTEGER;
  zona_count INTEGER;
  punto_venta_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO producto_count FROM productos;
  SELECT COUNT(*) INTO ingrediente_count FROM ingredientes;
  SELECT COUNT(*) INTO beneficio_count FROM beneficios;
  SELECT COUNT(*) INTO zona_count FROM zonas_delivery;
  SELECT COUNT(*) INTO punto_venta_count FROM puntos_venta;
  
  RAISE NOTICE '✅ Datos iniciales cargados exitosamente';
  RAISE NOTICE '🎂 Productos: %', producto_count;
  RAISE NOTICE '🌿 Ingredientes: %', ingrediente_count;
  RAISE NOTICE '✅ Beneficios: %', beneficio_count;
  RAISE NOTICE '🚚 Zonas Delivery: %', zona_count;
  RAISE NOTICE '🏪 Puntos de Venta: %', punto_venta_count;
END $$;


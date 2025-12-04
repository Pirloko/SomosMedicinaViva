# 💰 Sistema de Costos y Ganancias Reales

## 📊 ¿Qué es este Sistema?

Este sistema te permite calcular **automáticamente** los costos reales de producción de cada producto basándote en los ingredientes (insumos) que uses, y así obtener:

- ✅ **Costo Real de Producción** por producto
- ✅ **Ganancia Real** por venta
- ✅ **Margen de Ganancia** (%)
- ✅ **ROI** (Retorno de Inversión)
- ✅ **Productos más rentables**
- ✅ **Control de stock** basado en ventas

---

## 🎯 Paso 1: Ejecutar Script SQL de Costos

### **En Supabase SQL Editor:**

1. Abre el archivo `database/costos_ganancias.sql`
2. Copia TODO el contenido
3. Pégalo en SQL Editor
4. Click en **Run** (▶️)

**Esto crea:**
- 5 vistas SQL para cálculos automáticos
- 2 funciones auxiliares
- Sistema completo de análisis financiero

---

## 🧮 Paso 2: Asignar Ingredientes a Productos

### **Flujo de Trabajo:**

#### 1️⃣ **Ir a Gestión de Productos**
```
http://localhost:8080/admin/productos
```

#### 2️⃣ **Click en el Icono 🧮 (Calculator)**
En la tabla, cada producto tiene 3 botones:
- ✏️ Editar (lápiz)
- 🧮 **Costos** (calculadora) ← NUEVO
- ⋮ Más opciones

#### 3️⃣ **Agregar Ingredientes**
```
Click en "Agregar Ingrediente"
↓
Selecciona el ingrediente: Cacao Puro
Cantidad necesaria: 0.5 (kg)
↓
Click en "Agregar Ingrediente"
```

#### 4️⃣ **Repetir para Todos los Ingredientes**
Ejemplo para "Torta de Chocolate":
- Cacao Puro: 0.5 kg
- Harina de Almendra: 0.3 kg
- Aceite de Coco: 0.2 litros
- Dátiles: 0.15 kg
- Leche de Coco: 0.25 litros

#### 5️⃣ **Ver Cálculos Automáticos**
El sistema calcula instantáneamente:
```
Precio de Venta:     $18,990
Costo de Producción: $8,450  (suma de ingredientes)
─────────────────────────────
Ganancia:            $10,540
Margen:              55% 🟢
```

---

## 📊 Paso 3: Ver Análisis Financiero

### **Dashboard de Ganancias**
```
http://localhost:8080/admin/ganancias
```

**Muestra:**
- 💰 Ingresos Totales
- 📉 Costos Totales
- 📈 Ganancias Reales
- 📊 Margen Promedio
- 🏆 Top 5 productos más rentables
- 📋 Últimas ventas con ganancia real

---

## 🔢 Fórmulas Utilizadas

### **Por Producto:**
```
Costo de Producción = Σ (Cantidad Ingrediente × Costo Unitario)

Ganancia Unitaria = Precio de Venta − Costo de Producción

Margen (%) = (Ganancia / Precio de Venta) × 100
```

### **Por Venta:**
```
Ingreso = Precio Unitario × Cantidad

Costo Real = Costo de Producción × Cantidad

Ganancia Real = Ingreso − Costo Real

Margen Real (%) = (Ganancia Real / Ingreso) × 100
```

### **KPIs del Período:**
```
Ingresos Totales = Σ Todas las ventas

Costos Totales = Σ (Costo Producción × Cantidad) de cada venta

Ganancias Reales = Ingresos Totales − Costos Totales

Margen Promedio = (Ganancias Reales / Ingresos Totales) × 100
```

---

## 💡 Ejemplo Práctico

### **Producto: Torta de Chocolate**

**Ingredientes asignados:**
| Ingrediente | Cantidad | Costo Unit. | Costo Total |
|-------------|----------|-------------|-------------|
| Cacao Puro | 0.5 kg | $12,000/kg | $6,000 |
| Harina Almendra | 0.3 kg | $15,000/kg | $4,500 |
| Aceite Coco | 0.2 L | $10,000/L | $2,000 |
| Dátiles | 0.15 kg | $8,000/kg | $1,200 |
| Leche Coco | 0.25 L | $6,000/L | $1,500 |
| **TOTAL** | | | **$15,200** |

**Análisis:**
```
Precio de Venta:     $18,990
Costo de Producción: $15,200
─────────────────────────────
Ganancia por Unidad: $3,790
Margen:              20% 🟡

Interpretación: Margen bajo, considera:
- Aumentar precio de venta
- Optimizar ingredientes
- Negociar mejores precios de insumos
```

**Si vendes 10 tortas:**
```
Ingresos:   $189,900
Costos:     $152,000
Ganancias:  $37,900  ✨
```

---

## 📊 Interpretación de Márgenes

| Margen | Evaluación | Acción |
|--------|------------|--------|
| > 60% | 🟢 Excelente | Producto muy rentable |
| 40-60% | 🟢 Muy bueno | Mantener estrategia |
| 30-40% | 🟡 Bueno | Monitorear |
| 15-30% | 🟠 Bajo | Revisar costos o precio |
| < 15% | 🔴 Crítico | Replantear producto |

---

## 🎯 Casos de Uso

### **1. Decidir Qué Productos Promocionar**
```
Ir a: /admin/ganancias
Ver: Top 5 productos más rentables
Acción: Promocionar los de mayor margen
```

### **2. Fijar Precios Nuevos Productos**
```
1. Asignar todos los ingredientes
2. Ver costo de producción
3. Decidir margen objetivo (ej: 40%)
4. Calcular: Precio = Costo / (1 - 0.40)
```

### **3. Optimizar Recetas**
```
1. Ir a costos del producto
2. Ver qué ingrediente es más caro
3. Buscar alternativas más económicas
4. Ajustar cantidades
5. Ver nuevo margen
```

### **4. Negociar con Proveedores**
```
1. Identificar ingredientes más costosos
2. Ver cuánto impactan en el producto final
3. Priorizar negociaciones
4. Actualizar costos unitarios en Ingredientes
5. Ver impacto en todas las recetas
```

---

## 🔄 Flujo Completo

### **Setup Inicial (Una vez):**

```mermaid
1. Ejecutar costos_ganancias.sql
   ↓
2. Asignar ingredientes a cada producto
   ↓
3. Verificar costos calculados
   ↓
4. Ajustar precios si es necesario
   ↓
5. ¡Listo! Sistema funciona automáticamente
```

### **Uso Diario:**

```mermaid
Registrar Venta
   ↓
Sistema calcula automáticamente:
- Ingreso
- Costo (basado en ingredientes)
- Ganancia real
   ↓
Actualiza KPIs en tiempo real
   ↓
Ver dashboard de ganancias
```

---

## 📱 Páginas Nuevas Creadas

| Ruta | Descripción |
|------|-------------|
| `/admin/productos/:id/costos` | Asignar ingredientes a un producto |
| `/admin/ventas` | Lista de ventas con filtros |
| `/admin/ventas/nueva` | Registrar nueva venta |
| `/admin/ganancias` | Dashboard de costos y ganancias reales |

---

## ⚙️ Funciones Avanzadas (Opcional)

### **Descontar Stock Automáticamente:**

Si quieres que el stock de ingredientes se descuente automáticamente al confirmar ventas:

1. Abre Supabase SQL Editor
2. Ejecuta:
```sql
CREATE TRIGGER trigger_descontar_stock_venta
AFTER INSERT OR UPDATE ON ventas
FOR EACH ROW
WHEN (NEW.estado IN ('confirmado', 'preparando', 'enviado', 'entregado'))
EXECUTE FUNCTION descontar_stock_venta();
```

⚠️ **Advertencia:** Esto descontará stock automáticamente. Asegúrate de querer esta funcionalidad.

### **Verificar si Puedes Producir:**

Usa la función SQL para verificar stock antes de confirmar un pedido:

```sql
-- Verificar si puedes producir 5 tortas de chocolate
SELECT * FROM puede_producir_producto(
  'id-del-producto-aqui'::UUID, 
  5
);

-- Responde:
-- puede_producir: true/false
-- ingredientes_faltantes: array con lo que falta
```

---

## 📊 Vistas SQL Disponibles

### **1. `vista_costo_productos`**
Costo de cada producto con margen
```sql
SELECT * FROM vista_costo_productos ORDER BY margen_porcentaje DESC;
```

### **2. `vista_ganancias_ventas`**
Cada venta con su ganancia real
```sql
SELECT * FROM vista_ganancias_ventas 
WHERE fecha_venta >= NOW() - INTERVAL '30 days';
```

### **3. `vista_kpis_financieros`**
KPIs diarios agrupados
```sql
SELECT * FROM vista_kpis_financieros 
WHERE fecha >= NOW() - INTERVAL '30 days';
```

### **4. `vista_productos_rentables`**
Ranking de rentabilidad
```sql
SELECT * FROM vista_productos_rentables LIMIT 10;
```

### **5. `vista_analisis_ingredientes`**
Análisis de uso de ingredientes
```sql
SELECT * FROM vista_analisis_ingredientes 
WHERE alerta_stock IN ('SIN_STOCK', 'STOCK_BAJO');
```

---

## 🎯 Beneficios del Sistema

### **Para el Negocio:**
✅ Conocer ganancia real de cada producto  
✅ Identificar productos más rentables  
✅ Tomar decisiones basadas en datos  
✅ Optimizar precios y recetas  
✅ Control de inventario inteligente  
✅ Proyecciones financieras precisas  

### **Para Planificación:**
✅ Saber cuánto puedes producir con stock actual  
✅ Alertas de ingredientes críticos  
✅ Calcular punto de equilibrio  
✅ Proyectar compras de insumos  
✅ Análisis de rentabilidad por categoría  

---

## 🚀 Próximos Pasos

1. ✅ Ejecuta `costos_ganancias.sql` en Supabase
2. ✅ Asigna ingredientes a tus productos principales
3. ✅ Registra algunas ventas de prueba
4. ✅ Revisa el dashboard de ganancias
5. ✅ Ajusta precios si es necesario
6. ✅ ¡Empieza a tomar decisiones basadas en datos reales!

---

## ❓ Preguntas Frecuentes

**¿Qué pasa si no asigno ingredientes?**
- El producto aparecerá con costo $0
- La ganancia será igual al precio de venta
- Recibirás alertas para asignar ingredientes

**¿Puedo cambiar las cantidades después?**
- Sí, en cualquier momento
- Click en la cantidad para editarla
- Los cálculos se actualizan automáticamente

**¿El stock se descuenta automáticamente?**
- No por defecto (para seguridad)
- Puedes activarlo con el trigger (ver sección avanzada)
- O descontar manualmente en Ingredientes

**¿Puedo ver cuánto gano por venta?**
- Sí, en `/admin/ganancias`
- Cada venta muestra: Ingreso, Costo, Ganancia
- Con porcentaje de margen

---

¡El sistema está listo para que tomes decisiones financieras inteligentes! 💡💰


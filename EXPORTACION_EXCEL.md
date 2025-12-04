# 📥 GUÍA DE EXPORTACIÓN A EXCEL - MEDICINA VIVA

Estructura de datos preparada para futura exportación a Excel.

---

## 📊 DATOS DISPONIBLES PARA EXPORTAR

### **1. Compras de Ingredientes**
```sql
SELECT * FROM vista_compras_ingredientes
ORDER BY created_at DESC;
```

**Columnas:**
- Fecha de compra
- Ingrediente
- Unidad de medida
- Cantidad comprada
- Costo unitario
- Costo total
- Proveedor
- N° Factura
- Stock anterior
- Stock nuevo
- Incremento
- Notas

**Uso:** Análisis de compras, control de gastos, comparación de proveedores

---

### **2. Resumen de Compras por Ingrediente**
```sql
SELECT * FROM vista_resumen_compras_ingrediente;
```

**Columnas:**
- Ingrediente
- Stock actual
- Costo promedio actual
- Total de compras
- Cantidad total comprada
- Inversión total
- Costo mínimo histórico
- Costo máximo histórico
- Fecha última compra

**Uso:** Análisis de inversión, tendencias de precios

---

### **3. Inventario de Ingredientes**
```sql
SELECT 
  nombre,
  unidad_medida,
  stock_actual,
  stock_minimo,
  costo_unitario,
  stock_actual * costo_unitario as valor_inventario,
  CASE 
    WHEN stock_actual = 0 THEN 'Sin Stock'
    WHEN stock_actual <= stock_minimo THEN 'Stock Bajo'
    ELSE 'OK'
  END as estado
FROM ingredientes
WHERE activo = true
ORDER BY nombre;
```

**Uso:** Inventario actual, valorización

---

### **4. Productos**
```sql
SELECT 
  nombre,
  categoria,
  precio as precio_venta,
  costo_produccion_unitario as costo,
  precio - costo_produccion_unitario as ganancia_unitaria,
  ROUND(((precio - costo_produccion_unitario) / precio) * 100, 2) as margen_porcentaje,
  stock_disponible,
  stock_minimo
FROM productos
WHERE activo = true
ORDER BY nombre;
```

**Uso:** Análisis de rentabilidad por producto

---

### **5. Movimientos de Stock (Productos)**
```sql
SELECT 
  p.nombre as producto,
  sm.tipo,
  sm.cantidad,
  sm.stock_anterior,
  sm.stock_nuevo,
  sm.motivo,
  sm.created_at as fecha
FROM stock_movimientos sm
JOIN productos p ON p.id = sm.producto_id
ORDER BY sm.created_at DESC;
```

**Uso:** Historial de producciones y ventas

---

### **6. Ventas**
```sql
SELECT 
  v.fecha_venta,
  p.nombre as producto,
  v.cantidad,
  v.precio_unitario,
  v.total as total_venta,
  p.costo_produccion_unitario as costo_unitario,
  (v.precio_unitario - p.costo_produccion_unitario) as ganancia_unitaria,
  (v.precio_unitario - p.costo_produccion_unitario) * v.cantidad as ganancia_total,
  v.cliente_nombre,
  v.zona_delivery,
  v.estado
FROM ventas v
LEFT JOIN productos p ON p.id = v.producto_id
ORDER BY v.fecha_venta DESC;
```

**Uso:** Análisis de ventas con ganancias reales

---

### **7. KPIs Mensuales**
```sql
SELECT 
  DATE_TRUNC('month', fecha_venta) as mes,
  COUNT(*) as total_ventas,
  SUM(total) as ingresos_totales,
  SUM(cantidad) as unidades_vendidas,
  AVG(total) as ticket_promedio
FROM ventas
GROUP BY DATE_TRUNC('month', fecha_venta)
ORDER BY mes DESC;
```

**Uso:** Reportes mensuales, tendencias

---

## 🔮 IMPLEMENTACIÓN FUTURA

### **Opción 1: Exportar desde Frontend**

Usando librería como `xlsx`:

```typescript
import * as XLSX from 'xlsx';

const exportarComprasExcel = async () => {
  // Obtener datos de Supabase
  const { data } = await supabase
    .from('vista_compras_ingredientes')
    .select('*')
    .order('created_at', { ascending: false });

  // Crear worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Crear workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Compras");

  // Descargar
  XLSX.writeFile(workbook, `Compras_Ingredientes_${new Date().toISOString().split('T')[0]}.xlsx`);
};
```

---

### **Opción 2: Exportar desde Supabase**

```sql
-- En SQL Editor:
COPY (
  SELECT * FROM vista_compras_ingredientes
  ORDER BY created_at DESC
) TO STDOUT WITH CSV HEADER;

-- Luego abrir en Excel
```

---

### **Opción 3: API + Excel**

```typescript
// Endpoint que genera Excel del lado del servidor
GET /api/exportar/compras?fecha_desde=2024-01-01&fecha_hasta=2024-12-31

// Retorna archivo .xlsx
```

---

## 📱 UI FUTURA

### **Botones de Exportación:**

```
┌──────────────────────────────────────────┐
│ Compras de Ingredientes                  │
│                          [📥 Excel]       │
├──────────────────────────────────────────┤
│ Período:                                 │
│ [01/01/2024] a [31/12/2024]              │
│                                          │
│ Exportar:                                │
│ [ ] Compras detalladas                   │
│ [ ] Resumen por ingrediente              │
│ [ ] Movimientos de stock                 │
│ [ ] Ventas con ganancias                 │
│                                          │
│ [Generar Excel]                          │
└──────────────────────────────────────────┘
```

---

## 📊 REPORTES RECOMENDADOS

### **Reporte 1: Compras Mensuales**
- Todas las compras del mes
- Agrupadas por ingrediente
- Total invertido
- Comparación con mes anterior

### **Reporte 2: Análisis de Proveedores**
- Compras por proveedor
- Costos promedio
- Cantidad total
- Comparación de precios

### **Reporte 3: Evolución de Costos**
- Costo de cada ingrediente mes a mes
- Gráfica de tendencias
- Inflación detectada
- Proyecciones

### **Reporte 4: Inventario Valorizado**
- Stock actual de todos los ingredientes
- Valor en pesos
- Costo promedio
- Estado (OK/Bajo/Sin)

### **Reporte 5: Rentabilidad por Producto**
- Todos los productos
- Precio, costo, ganancia, margen
- Ordenados por rentabilidad
- Recomendaciones

---

## 🛠️ LIBRERÍAS RECOMENDADAS

### **Para Frontend (React):**

```bash
# Instalación
npm install xlsx

# Uso
import * as XLSX from 'xlsx';
```

### **Alternativa más completa:**

```bash
npm install exceljs
```

---

## ✅ ESTADO ACTUAL

```
[✓] Datos estructurados en base de datos
[✓] Vistas SQL optimizadas
[✓] Columnas bien nombradas
[✓] Relaciones correctas
[✓] Fechas en formato estándar
[✓] Números con decimales correctos
[ ] Botón de exportación (pendiente)
[ ] Librería Excel instalada (pendiente)
[ ] Función de exportación (pendiente)
```

---

## 💡 EJEMPLO DE EXPORTACIÓN

### **Datos Actuales:**

```
Compras de Ingredientes:
- 45 compras registradas
- 8 ingredientes diferentes
- Período: 01/01/2024 - 04/12/2024
- Inversión total: $5,250,000
```

### **Excel Generado:**

```
Pestaña 1: Compras Detalladas (45 filas)
Pestaña 2: Resumen por Ingrediente (8 filas)
Pestaña 3: Evolución de Precios (gráfico)
Pestaña 4: Proveedores (resumen)
```

---

## 🎯 PRÓXIMOS PASOS

### **Fase 1: Datos** ✅ COMPLETADO
- Estructura de tablas
- Funciones SQL
- Vistas de análisis

### **Fase 2: UI** (Próximo)
- Botón "Exportar Excel"
- Selector de período
- Opciones de reporte

### **Fase 3: Implementación** (Próximo)
- Instalar librería
- Función de exportación
- Descarga de archivo

---

## 📝 NOTA PARA EL FUTURO

Cuando implementes la exportación:

```typescript
// En src/utils/exportExcel.ts

export const exportarComprasExcel = async () => {
  // 1. Obtener datos de Supabase
  const { data } = await supabase
    .from('vista_compras_ingredientes')
    .select('*');

  // 2. Crear Excel
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Compras");

  // 3. Descargar
  XLSX.writeFile(wb, `Compras_${fecha}.xlsx`);
};
```

---

**¡Tu sistema está preparado para exportación futura a Excel!** 📥✨

**Estado:** ✅ Datos listos, UI pendiente de implementar


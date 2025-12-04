# 🛒 SISTEMA DE COMPRAS Y ACTUALIZACIÓN DE STOCK - MEDICINA VIVA

Sistema completo de registro de compras con historial, costos variables y costo promedio ponderado.

---

## 🎯 ¿POR QUÉ ESTE SISTEMA?

### **Problema Real:**
```
El costo de los ingredientes VARÍA constantemente:
- Inflación
- Cambio de proveedor
- Temporada
- Ofertas
- Disponibilidad

Ejemplo:
Enero: Harina a $5,000/kg
Marzo: Harina a $5,500/kg (+10%)
Junio: Harina a $6,000/kg (+20%)
```

### **Solución:**
```
✅ Registra cada compra con su costo específico
✅ Calcula costo promedio ponderado automático
✅ Mantiene historial completo
✅ Preparado para exportar a Excel
✅ Trazabilidad total
```

---

## 💰 COSTO PROMEDIO PONDERADO

### **¿Qué es?**

Es el costo promedio que considera tanto la cantidad como el precio de cada compra.

### **Fórmula:**

```
Costo Promedio = (Valor Total Inventario) ÷ (Stock Total)
```

### **Ejemplo:**

```
Situación Inicial:
Stock: 50 kg
Costo: $5,000/kg
Valor: 50 × $5,000 = $250,000

Nueva Compra:
Cantidad: 30 kg
Costo: $6,000/kg
Valor: 30 × $6,000 = $180,000

Después de la Compra:
Stock Total: 50 + 30 = 80 kg
Valor Total: $250,000 + $180,000 = $430,000
Nuevo Costo Promedio: $430,000 ÷ 80 = $5,375/kg

✅ El costo se actualiza automáticamente
```

---

## 🎨 INTERFAZ

### **Botón en cada Ingrediente:**

```
┌──────────────────────────────────────────────────┐
│ Ingrediente │ Stock │ Costo │ Estado │ Acciones │
│ Harina      │ 50 kg │ $5,000│ 🟢 OK  │ 🛒 ✏️ ⋮  │
│                                          ↑
│                                    Click aquí
└──────────────────────────────────────────────────┘
```

---

### **Dialog de Compra:**

```
┌──────────────────────────────────────────────────┐
│ 🛒 Actualizar Stock - Harina de Almendras       │
├──────────────────────────────────────────────────┤
│ 📊 Estado Actual:                                │
│ Stock actual: 50 kg                              │
│ Costo actual: $5,000/kg                          │
├──────────────────────────────────────────────────┤
│ Cantidad a Agregar: [30] kg                      │
│ Costo Unitario: [$6,000] /kg                     │
│ Precio por kg de esta compra                     │
├──────────────────────────────────────────────────┤
│ Proveedor: [Proveedor XYZ]                       │
│ N° Factura: [F-12345]                            │
│ Fecha: [2024-12-04]                              │
│ Notas: [Compra mensual...]                       │
├──────────────────────────────────────────────────┤
│ 💰 Preview de la Compra:                         │
│ Cantidad: 30 kg                                  │
│ Costo Total: $180,000                            │
│ Stock Después: 80 kg                             │
│ Incremento: +30                                  │
│                                                  │
│ Cálculo de Costo Promedio Ponderado:            │
│ • Valor inventario actual: $250,000              │
│ • Valor compra nueva: $180,000                   │
│ • Valor total: $430,000                          │
│ • Nuevo costo promedio: $5,375/kg               │
└──────────────────────────────────────────────────┘

[Cancelar]                    [🛒 Registrar Compra]
```

---

## 📋 CÓMO USAR

### **PASO 1: Registrar Compra**

```bash
1. Admin → Ingredientes

2. Localiza el ingrediente que compraste

3. Click en 🛒 (carrito de compras)

4. Completa:
   Cantidad: 30 kg
   Costo: $6,000/kg
   Proveedor: Proveedor XYZ
   Factura: F-12345
   Fecha: 2024-12-04

5. Ve el preview:
   ✅ Costo Total: $180,000
   ✅ Stock después: 80 kg
   ✅ Nuevo costo promedio: $5,375/kg

6. Click en "Registrar Compra"

7. ✅ RESULTADO:
   - Stock: 50 → 80 kg
   - Costo promedio: $5,000 → $5,375
   - Compra guardada en historial
   - Notificación de éxito
```

---

## 📊 HISTORIAL DE COMPRAS

### **Tabla: compras_ingredientes**

Guarda cada compra con detalle completo:

```
┌────────┬─────────┬──────┬──────┬───────┬──────────┬────────┬───────┐
│ Fecha  │Ingredien│Cant. │Costo │Total  │Proveedor │Factura │Stock  │
│        │te       │      │Unit. │       │          │        │Ant→Nue│
├────────┼─────────┼──────┼──────┼───────┼──────────┼────────┼───────┤
│04-12-24│Harina   │30 kg │$6,000│$180k  │Prov. XYZ │F-12345 │50→80  │
│01-12-24│Harina   │50 kg │$5,000│$250k  │Prov. ABC │F-12340 │0→50   │
│28-11-24│Aceite   │20 L  │$8,000│$160k  │Prov. XYZ │F-12300 │10→30  │
└────────┴─────────┴──────┴──────┴───────┴──────────┴────────┴───────┘
```

---

## 📈 ANÁLISIS Y REPORTES

### **Vista: vista_resumen_compras_ingrediente**

```sql
SELECT * FROM vista_resumen_compras_ingrediente;
```

Muestra por cada ingrediente:
```
┌──────────┬──────┬──────────┬────────┬──────────┬──────────┬──────────┐
│Ingredien │Stock │Costo     │Total   │Inversión │Costo Min │Costo Max │
│te        │Actual│Promedio  │Compras │Total     │          │          │
├──────────┼──────┼──────────┼────────┼──────────┼──────────┼──────────┤
│Harina    │80 kg │$5,375/kg │2       │$430,000  │$5,000    │$6,000    │
│Aceite    │30 L  │$8,000/L  │1       │$160,000  │$8,000    │$8,000    │
└──────────┴──────┴──────────┴────────┴──────────┴──────────┴──────────┘
```

---

## 💡 VENTAJAS DEL SISTEMA

### **1. Costo Real Actualizado:**
```
✅ Refleja precios actuales
✅ Considera todas las compras
✅ Promedio ponderado automático
✅ No manual, no errores
```

### **2. Historial Completo:**
```
✅ Cada compra registrada
✅ Proveedor identificado
✅ Factura guardada
✅ Fecha exacta
✅ Notas adicionales
```

### **3. Análisis Financiero:**
```
✅ Inversión total por ingrediente
✅ Evolución de precios
✅ Costo mínimo/máximo
✅ Comparación de proveedores
```

### **4. Trazabilidad:**
```
✅ De dónde viene cada kg
✅ Cuánto costó
✅ Cuándo se compró
✅ A quién
```

### **5. Preparado para Excel:**
```
✅ Datos estructurados
✅ Vistas SQL listas
✅ Fácil exportación
✅ Reportes mensuales
```

---

## 📊 IMPACTO EN COSTOS

### **Productos:**

Cuando produces, el costo se calcula con el costo promedio actual:

```
Producción de 10 tortas:

Ingredientes usados:
├─ Harina: 10 kg × $5,375/kg = $53,750
│  (usa el costo promedio actualizado)
├─ Aceite: 2 L × $8,000/L = $16,000
└─ Stevia: 1 kg × $15,000/kg = $15,000
                      ──────────
Costo Total:                $84,750
Costo Unitario: $84,750 ÷ 10 = $8,475

✅ Costo refleja precios actuales
✅ Ganancias calculadas correctamente
```

---

## 📁 PREPARADO PARA EXCEL

### **Datos Disponibles para Exportar:**

```
1. Compras de Ingredientes:
   - Todas las compras con fechas
   - Proveedores y facturas
   - Cantidades y costos
   - Stock antes/después

2. Resumen por Ingrediente:
   - Total invertido
   - Cantidad total comprada
   - Costo promedio
   - Última compra

3. Movimientos de Stock Productos:
   - Producciones
   - Ventas
   - Historial completo

4. KPIs:
   - Ventas
   - Ganancias
   - Costos

Futuro: Botón "Exportar a Excel" en cada sección
```

---

## 🚀 CONFIGURACIÓN

### **PASO 1: Ejecutar SQL**

```bash
1. Supabase Dashboard → SQL Editor

2. Ejecuta: database/compras_ingredientes.sql

3. Verás:
   ✅ Tabla compras_ingredientes creada
   ✅ Función registrar_compra_ingrediente creada
   ✅ Vistas de análisis disponibles
   ✅ RLS configurado
   ✅ Permisos aplicados
```

---

### **PASO 2: Probar el Sistema**

```bash
1. Admin → Ingredientes
   http://localhost:8080/admin/ingredientes

2. Verás:
   ✅ Banner verde: "Usa el botón 🛒 en cada fila"
   ✅ Botón 🛒 en cada ingrediente

3. Click en 🛒 de cualquier ingrediente

4. Dialog se abre:
   ✅ Campos para compra
   ✅ Preview de cálculos
   ✅ Costo promedio ponderado

5. Completa y registra

6. ✅ Stock actualizado
   ✅ Costo promedio actualizado
   ✅ Compra en historial
```

---

## 📋 CAMPOS DEL DIALOG

### **Requeridos:**
```
✅ Cantidad a Agregar (ej: 30 kg)
✅ Costo Unitario (ej: $6,000/kg)
```

### **Opcionales:**
```
- Proveedor (ej: Proveedor XYZ)
- N° Factura (ej: F-12345)
- Fecha de Compra (default: hoy)
- Notas (ej: Compra mensual)
```

---

## 🎯 EJEMPLO COMPLETO

### **Compra de Harina:**

```bash
Estado Inicial:
├─ Stock: 20 kg
├─ Costo promedio: $5,000/kg
└─ Valor inventario: $100,000

Compra Nueva:
├─ Cantidad: 50 kg
├─ Costo: $5,500/kg
├─ Proveedor: Molino del Sur
├─ Factura: F-789
└─ Valor: $275,000

Sistema Calcula:
├─ Valor total: $100,000 + $275,000 = $375,000
├─ Stock total: 20 + 50 = 70 kg
└─ Nuevo costo: $375,000 ÷ 70 = $5,357/kg

Resultado:
✅ Stock: 20 → 70 kg
✅ Costo: $5,000 → $5,357/kg
✅ Compra guardada en historial
```

---

## 📊 REPORTES DISPONIBLES

### **1. Historial de Compras:**
```sql
SELECT * FROM vista_compras_ingredientes
ORDER BY created_at DESC;
```

### **2. Resumen por Ingrediente:**
```sql
SELECT * FROM vista_resumen_compras_ingrediente;
```

### **3. Compras de un Ingrediente:**
```sql
SELECT * FROM compras_ingredientes
WHERE ingrediente_id = 'uuid-ingrediente'
ORDER BY fecha_compra DESC;
```

### **4. Compras del Mes:**
```sql
SELECT * FROM compras_ingredientes
WHERE fecha_compra >= DATE_TRUNC('month', CURRENT_DATE)
ORDER BY fecha_compra DESC;
```

---

## 📁 ESTRUCTURA PARA EXCEL

### **Compras de Ingredientes:**
```
Columnas:
- Fecha
- Ingrediente
- Cantidad
- Unidad
- Costo Unitario
- Costo Total
- Proveedor
- N° Factura
- Stock Anterior
- Stock Nuevo
- Notas
```

### **Resumen por Ingrediente:**
```
Columnas:
- Ingrediente
- Stock Actual
- Costo Promedio
- Total Compras
- Inversión Total
- Costo Mínimo
- Costo Máximo
- Última Compra
```

**Futuro:** Botón "📥 Exportar a Excel" para descargar directamente

---

## 🔄 FLUJO COMPLETO

```
1. COMPRAS (Actualizar Stock):
   Admin → Ingredientes → 🛒 
   → Registrar compra con costo
   → Stock aumenta
   → Costo promedio se actualiza

2. PRODUCCIÓN:
   Admin → Producción
   → Selecciona ingredientes
   → Usa costo promedio actual
   → Calcula costo producto
   → Stock ingredientes disminuye

3. ANÁLISIS:
   Admin → Costos y Ganancias
   → Ve costos reales
   → Ganancias basadas en costos actualizados
   → Márgenes correctos

4. EXPORTACIÓN (Futuro):
   Admin → Reportes
   → Selecciona período
   → Exporta a Excel
   → Análisis externo
```

---

## 💼 CASOS DE USO

### **Caso 1: Compra Regular**

```bash
Lunes - Compra mensual

1. Admin → Ingredientes

2. Harina → 🛒
   Cantidad: 50 kg
   Costo: $5,500/kg
   Proveedor: Molino Sur
   Factura: F-456
   
3. Aceite → 🛒
   Cantidad: 20 L
   Costo: $8,500/L
   Proveedor: Aceites SA
   Factura: F-457

4. Stevia → 🛒
   Cantidad: 10 kg
   Costo: $16,000/kg
   Proveedor: Natural Import
   Factura: F-458

✅ Todo registrado
✅ Stock actualizado
✅ Costos promedios recalculados
```

---

### **Caso 2: Aumento de Precios**

```bash
Enero: Harina a $5,000/kg
Marzo: Harina a $5,500/kg (+10%)

Compra Marzo:
Cantidad: 30 kg
Costo: $5,500/kg

Sistema:
Stock antes: 20 kg a $5,000 = $100,000
Compra: 30 kg a $5,500 = $165,000
Total: 50 kg con valor $265,000
Nuevo promedio: $5,300/kg

✅ Costo se ajusta gradualmente
✅ No salta de $5,000 a $5,500 de golpe
✅ Transición suave basada en inventario
```

---

### **Caso 3: Compra de Oportunidad**

```bash
Oferta: Cacao a $8,000/kg (normal $10,000)

Compra:
Cantidad: 100 kg (más de lo normal)
Costo: $8,000/kg

Sistema:
Stock: 10 kg a $10,000 = $100,000
Compra: 100 kg a $8,000 = $800,000
Total: 110 kg con valor $900,000
Nuevo promedio: $8,182/kg

✅ Aprovechas oferta
✅ Costo promedio baja
✅ Productos serán más rentables
```

---

## 📊 ANÁLISIS FINANCIERO

### **Evolución de Costos:**
```
Ver cómo ha variado el costo de un ingrediente:

SELECT 
  fecha_compra,
  costo_unitario,
  cantidad,
  proveedor
FROM compras_ingredientes
WHERE ingrediente_id = 'uuid-harina'
ORDER BY fecha_compra;

Resultado:
01/01: $5,000/kg - 50 kg - Prov. A
01/02: $5,200/kg - 30 kg - Prov. B
01/03: $5,500/kg - 40 kg - Prov. A
01/04: $6,000/kg - 50 kg - Prov. C

Análisis:
📈 Tendencia: +20% en 4 meses
💡 Decisión: Buscar nuevo proveedor o ajustar precios
```

---

## 🎯 ARCHIVOS CREADOS

```
✅ database/compras_ingredientes.sql
   - Tabla de compras
   - Función de registro con costo promedio
   - Vistas de análisis
   - RLS configurado

✅ src/hooks/useComprasIngredientes.ts
   - useRegistrarCompra()
   - useComprasIngrediente()
   - useAllCompras() (para Excel)

✅ src/pages/AdminIngredientes.tsx
   - Botón 🛒 en cada fila
   - Dialog de compra
   - Preview de cálculos
   - Validaciones

✅ SISTEMA_COMPRAS_STOCK.md
   - Documentación completa
   - Fórmulas explicadas
   - Ejemplos paso a paso
```

---

## 🚀 BENEFICIOS

```
✅ Costos actualizados siempre
✅ Refleja inflación automáticamente
✅ Historial completo para auditoría
✅ Proveedores identificados
✅ Facturas registradas
✅ Costo promedio ponderado preciso
✅ Base para análisis financiero
✅ Decisiones informadas
✅ Preparado para reportes Excel
✅ Trazabilidad total
```

---

## ✅ RESUMEN

```
Sistema de Compras de Ingredientes:

✅ Botón 🛒 en cada ingrediente
✅ Dialog completo de compra
✅ Campos: cantidad, costo, proveedor, factura, fecha, notas
✅ Cálculo automático de costo promedio ponderado
✅ Preview de todos los valores
✅ Stock actualizado
✅ Historial completo
✅ Vistas SQL para análisis
✅ Preparado para Excel
✅ Sin errores
```

---

**¡Sistema completo de compras con costos variables implementado!** 🛒💰✨

**Ejecuta `database/compras_ingredientes.sql` y empieza a registrar tus compras con costos reales!**

**Fecha:** Diciembre 2024  
**Estado:** ✅ LISTO  
**Versión:** 1.0


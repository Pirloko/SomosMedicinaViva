# 💰 SISTEMA DE COSTOS AUTOMÁTICOS - MEDICINA VIVA

Sistema que calcula automáticamente el costo de cada producto basándose en los ingredientes reales utilizados en la producción.

---

## 🎯 CONCEPTO CLAVE

### **Costo Basado en Realidad:**

```
El costo del producto se calcula automáticamente
basándose en los ingredientes REALES que usaste
en cada producción.

NO en recetas teóricas.
SÍ en uso real.
```

---

## 💡 ¿CÓMO FUNCIONA?

### **Fórmula:**

```
Costo Unitario = Costo Total Ingredientes ÷ Stock Producido
```

### **Ejemplo:**

```
Producción de 10 Tortas:

Ingredientes usados:
├─ Harina: 10 kg × $5,000/kg = $50,000
├─ Aceite: 2 L × $8,000/L = $16,000
├─ Stevia: 1 kg × $15,000/kg = $15,000
└─ Cacao: 3 kg × $10,000/kg = $30,000
                      ─────────────
Costo Total:                $111,000

Stock Producido: 10 unidades

Costo Unitario = $111,000 ÷ 10 = $11,100

✅ Costo por torta: $11,100
```

---

## 📊 CÁLCULOS ADICIONALES

Una vez calculado el costo unitario:

### **Ganancia Unitaria:**
```
Ganancia = Precio de Venta - Costo Unitario

Ejemplo:
Precio: $18,990
Costo: $11,100
Ganancia: $7,890 por torta
```

### **Margen de Ganancia:**
```
Margen = (Ganancia ÷ Precio) × 100

Ejemplo:
Ganancia: $7,890
Precio: $18,990
Margen: 41.5%

Interpretación:
🟢 > 40%: Excelente
🟡 30-40%: Bueno  
🟠 15-30%: Bajo
🔴 < 15%: Revisar precios
```

---

## 🎨 INTERFAZ DE PRODUCCIÓN

```
┌───────────────────────────────────────────────────────┐
│ DATOS PRODUCCIÓN       │ INGREDIENTES UTILIZADOS      │
├───────────────────────────────────────────────────────┤
│ Producto: Torta        │                  [+ Agregar] │
│ Stock: 10 unidades     │ Ingrediente │Cantidad│ Costo │
│                        │ Harina      │ 10 kg  │$50,000│
│ Stock: 5 → 15          │ Aceite      │ 2 L    │$16,000│
│                        │ Stevia      │ 1 kg   │$15,000│
│ Nota: Producción...    │ Cacao       │ 3 kg   │$30,000│
│                        │ Total: $111,000 · Unit: $11,100│
└───────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────┐
│ 💰 ANÁLISIS DE COSTOS                                 │
├───────────────────────────────────────────────────────┤
│ Costo Total  │ Costo Unit. │ Ganancia   │ Margen     │
│ $111,000     │ $11,100     │ $7,890     │ 41%        │
│ (naranja)    │ (rojo)      │ (verde)    │ (primary)  │
└───────────────────────────────────────────────────────┘

[Cancelar]                    [🏭 Registrar Producción]
```

---

## 📋 FLUJO COMPLETO

### **PASO 1: Seleccionar Producto**
```
→ Torta de Chocolate
```

### **PASO 2: Definir Stock Producido**
```
→ 10 unidades
```

### **PASO 3: Agregar Ingredientes con Cantidades**

```bash
Ingrediente 1:
→ Harina: 10 kg
→ Costo: $5,000/kg
→ Total: $50,000 ✓

Ingrediente 2:
→ Aceite: 2 L
→ Costo: $8,000/L
→ Total: $16,000 ✓

Ingrediente 3:
→ Stevia: 1 kg
→ Costo: $15,000/kg
→ Total: $15,000 ✓

Ingrediente 4:
→ Cacao: 3 kg
→ Costo: $10,000/kg
→ Total: $30,000 ✓
```

### **PASO 4: Ver Análisis Automático**

Card de "Análisis de Costos" muestra:
```
Costo Total: $111,000 (suma de todos)
Costo Unitario: $11,100 ($111,000 ÷ 10)
Ganancia Unitaria: $7,890 ($18,990 - $11,100)
Margen: 41% ($7,890 ÷ $18,990 × 100)
```

### **PASO 5: Registrar**

```bash
Click en "Registrar Producción"

Sistema automáticamente:
✅ Aumenta stock producto: 5 → 15
✅ Descuenta ingredientes
✅ GUARDA costo unitario: $11,100
✅ Registra movimiento
✅ Actualiza alertas
```

---

## 💾 ¿DÓNDE SE GUARDA EL COSTO?

### **Tabla productos:**
```sql
CREATE TABLE productos (
  ...
  precio DECIMAL,
  costo_produccion_unitario DECIMAL,  ← NUEVO
  ...
)
```

### **Se actualiza en cada producción:**
```
Producción 1: Costo $11,100
Producción 2: Costo $11,500 (variación)
Producción 3: Costo $10,800 (optimización)

El sistema siempre guarda el último costo calculado
```

---

## 📊 USO DEL COSTO GUARDADO

### **En KPIs y Ganancias:**
```
Ventas del mes:
├─ Torta vendida: $18,990
├─ Costo guardado: $11,100
├─ Ganancia real: $7,890
└─ Margen real: 41%

Multiplicas por todas las ventas:
Ganancia total = Suma de todas las ganancias
```

---

## 🎯 VENTAJAS DEL SISTEMA

### **1. Costo Real, No Teórico:**
```
✅ Basado en lo que REALMENTE usaste
✅ No en recetas pre-configuradas
✅ Refleja variaciones del día a día
✅ Considera desperdicios
✅ Ajustes de receta incluidos
```

### **2. Actualización Constante:**
```
✅ Cada producción actualiza el costo
✅ Siempre tienes el costo más reciente
✅ Ves evolución de costos
✅ Detectas optimizaciones
```

### **3. Análisis Financiero Preciso:**
```
✅ Ganancias calculadas con datos reales
✅ Márgenes correctos
✅ Decisiones informadas
✅ Rentabilidad por producto
```

---

## 💡 CASOS DE USO

### **Caso 1: Receta Optimizada**

```bash
Lunes - Primera producción:
Ingredientes: $111,000
Stock: 10 tortas
Costo: $11,100

Miércoles - Optimizaste receta:
Ingredientes: $105,000 (menos desperdicio)
Stock: 10 tortas
Costo: $10,500 (¡$600 menos!)

✅ Ves la mejora inmediatamente
✅ Costo actualizado automáticamente
```

---

### **Caso 2: Variación de Precios**

```bash
Enero - Ingredientes baratos:
Costo: $11,100

Marzo - Ingredientes más caros:
Costo: $12,500 (inflación)

✅ Sistema refleja el aumento
✅ Puedes ajustar precio de venta
✅ Mantienes el margen
```

---

### **Caso 3: Diferentes Versiones**

```bash
Torta Premium:
- Ingredientes de lujo
- Costo: $15,000
- Precio: $25,990
- Margen: 42%

Torta Económica:
- Ingredientes básicos
- Costo: $8,000
- Precio: $14,990
- Margen: 47%

✅ Cada versión tiene su costo real
✅ Puedes compararlas
✅ Decides cuál es más rentable
```

---

## 📈 ANÁLISIS EN TIEMPO REAL

### **Card de Análisis muestra:**

```
┌──────────────┬───────────────┬──────────────┬─────────┐
│ COSTO TOTAL  │ COSTO UNITARIO│ GANANCIA     │ MARGEN  │
├──────────────┼───────────────┼──────────────┼─────────┤
│ $111,000     │ $11,100       │ $7,890       │ 41%     │
│ Suma ingreds │ Total÷Stock   │ Precio-Costo │ Gan÷Prec│
└──────────────┴───────────────┴──────────────┴─────────┘

💡 Cómo se calcula:
1️⃣ Costo Total: Suma ingredientes
2️⃣ Costo Unitario: Total ÷ Stock
3️⃣ Ganancia: Precio - Costo
4️⃣ Margen: (Ganancia ÷ Precio) × 100
```

---

## ⚙️ CONFIGURACIÓN

### **PASO 1: Ejecutar SQL**

```bash
1. Supabase → SQL Editor

2. Ejecuta: database/produccion_manual.sql

3. Esto agrega:
   ✅ Campo costo_produccion_unitario
   ✅ Función actualizada para calcular
   ✅ Guarda el costo automáticamente
```

---

### **PASO 2: Recarga y Prueba**

```bash
1. Ctrl+Shift+R (recarga)

2. Admin → Producción

3. Registra producción con ingredientes

4. Verás:
   ✅ Card de "Análisis de Costos"
   ✅ Costo total calculado
   ✅ Costo unitario automático
   ✅ Ganancia y margen
```

---

## 📊 INTEGRACIÓN CON OTROS MÓDULOS

### **Con Ganancias:**
```
Admin → Costos y Ganancias

Usa el costo guardado para calcular:
- Ganancia por venta
- Ganancia total del mes
- Margen promedio
- Rentabilidad por producto
```

### **Con KPIs:**
```
Admin → KPIs

Muestra:
- Productos más rentables
- Evolución de costos
- Optimización de recetas
```

### **Con Ventas:**
```
Cada venta conoce:
- Precio de venta
- Costo real del producto
- Ganancia neta
```

---

## ✅ SIMPLIFICACIÓN DEL SISTEMA

### **Ahora ES INNECESARIO:**
```
❌ Configurar recetas en productos
❌ Página de "Ver Costos" separada
❌ Asignar ingredientes permanentemente
```

### **TODO SE HACE EN PRODUCCIÓN:**
```
✅ Seleccionas producto
✅ Agregas ingredientes que usaste
✅ Defines cantidades reales
✅ Sistema calcula costo
✅ Guarda automáticamente
✅ Todo en un solo lugar
```

---

## 🚀 RESULTADO FINAL

### **Al Registrar Producción:**

```
Se guardan:
├─ Stock producto (aumenta)
├─ Stock ingredientes (descuenta)
├─ Costo unitario calculado ← NUEVO
├─ Movimiento en historial
└─ Actualización de alertas

Costo Unitario guardado en productos:
→ Se usa en análisis financiero
→ Se usa en cálculo de ganancias
→ Se actualiza en cada producción
```

---

## 📱 NUEVA TABLA PRODUCTOS

Ahora incluye:

```sql
productos:
├─ nombre
├─ precio (de venta)
├─ costo_produccion_unitario ← NUEVO
├─ stock_disponible
├─ stock_minimo
└─ ...

Ganancia = precio - costo_produccion_unitario
Margen = (Ganancia ÷ precio) × 100
```

---

## ✅ RESUMEN COMPLETO

```
Sistema de Producción Manual + Costos Automáticos:

✅ Selección de producto
✅ Definir stock producido
✅ Agregar ingredientes manualmente
✅ Cantidades exactas usadas
✅ CÁLCULO AUTOMÁTICO:
   - Costo total ingredientes
   - Costo unitario producto
   - Ganancia unitaria
   - Margen porcentual
✅ Descuento de ingredientes
✅ Aumento de stock producto
✅ Guardado de costo calculado
✅ Preview en tiempo real
✅ Validaciones automáticas
✅ Todo en una sola página
```

---

## 🎯 ARCHIVOS CREADOS/ACTUALIZADOS

```
✅ database/produccion_manual.sql
   - Campo costo_produccion_unitario
   - Función con cálculo de costo
   - Guarda costo automáticamente

✅ src/pages/AdminProduccion.tsx
   - Cálculo de costos en frontend
   - Card de "Análisis de Costos"
   - Preview de todos los valores
   - Envía costo_unitario al backend

✅ src/types/database.types.ts
   - Tipo costo_produccion_unitario agregado

✅ SISTEMA_COSTOS_AUTOMATICO.md
   - Documentación completa
   - Fórmulas explicadas
   - Ejemplos paso a paso
```

---

## 🚀 PROBAR EL SISTEMA

```bash
1. Ejecuta: database/produccion_manual.sql

2. Recarga navegador (Ctrl+Shift+R)

3. Admin → Producción

4. Registra producción:
   - Producto: Torta
   - Stock: 10
   - Ingredientes: (agrega varios)

5. Verás card de "Análisis de Costos":
   ✅ Costo Total
   ✅ Costo Unitario
   ✅ Ganancia
   ✅ Margen
   ✅ Todo calculado automáticamente

6. Registra

7. Ve a Admin → Productos
   ✅ El costo está guardado

8. Ve a Admin → Costos y Ganancias
   ✅ Usa el costo para calcular ganancias
```

---

## 💼 BENEFICIOS PARA EL NEGOCIO

```
✅ Costos reales, no estimados
✅ Detectas optimizaciones
✅ Ves impacto de cambios
✅ Ganancias precisas
✅ Decisiones informadas
✅ Rentabilidad por producto
✅ Evolución de costos
✅ Trazabilidad completa
```

---

**¡Sistema de costos automáticos basados en producción real implementado!** 💰📊✨

**Fecha:** Diciembre 2024  
**Estado:** ✅ LISTO  
**Versión:** 4.0


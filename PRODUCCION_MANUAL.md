# 🏭 SISTEMA DE PRODUCCIÓN MANUAL - MEDICINA VIVA

Sistema completamente nuevo: **Seleccionas ingredientes y cantidades en cada producción**.

---

## 🎯 CONCEPTO NUEVO

### **Antes (Recetas Pre-configuradas):**
```
❌ Receta fija en el producto
❌ Siempre usa la misma receta
❌ Poca flexibilidad
```

### **Ahora (Selección Manual):**
```
✅ Cada producción es independiente
✅ Seleccionas ingredientes que usaste
✅ Defines cantidades exactas
✅ Máxima flexibilidad
✅ Refleja la realidad del día a día
```

---

## 🔄 FLUJO COMPLETO

```
1. Seleccionas PRODUCTO que hiciste
   → "Torta de Chocolate"

2. Defines STOCK PRODUCIDO
   → "10 unidades"

3. Agregas INGREDIENTES que usaste:
   → Click en "+ Agregar"
   → Harina: 10 kg
   → Click en "+ Agregar"
   → Aceite: 2 litros
   → Click en "+ Agregar"
   → Stevia: 1 kg
   → Click en "+ Agregar"
   → Cacao: 3 kg

4. Sistema muestra PREVIEW:
   Producto: 5 → 15 unidades
   Harina: 50 kg → 40 kg ✓
   Aceite: 30 L → 28 L ✓
   Stevia: 5 kg → 4 kg ✓
   Cacao: 8 kg → 5 kg ✓

5. Click en "Registrar Producción"

6. RESULTADO:
   ✅ Stock producto: 5 → 15
   ✅ Harina: 50 → 40 kg
   ✅ Aceite: 30 → 28 L
   ✅ Stevia: 5 → 4 kg
   ✅ Cacao: 8 → 5 kg
```

---

## 🎨 INTERFAZ COMPLETA

```
┌──────────────────────────────────────────────────────────────────┐
│ Registrar Producción                         [← Volver]          │
└──────────────────────────────────────────────────────────────────┘

┌───────────────────────────┬──────────────────────────────────────┐
│ DATOS DE LA PRODUCCIÓN    │ INGREDIENTES UTILIZADOS              │
├───────────────────────────┼──────────────────────────────────────┤
│ Producto Fabricado:       │                    [+ Agregar]       │
│ [Torta de Chocolate ▼]    │                                      │
│                           │ Ingrediente│ Cantidad │Stock │Acc.   │
│ Stock Producido:          │ Harina     │ 10 kg    │50→40 │🗑️    │
│ [10] unidades             │ Aceite     │ 2 L      │30→28 │🗑️    │
│                           │ Stevia     │ 1 kg     │5→4   │🗑️    │
│ ┌─────────────────────┐   │ Cacao      │ 3 kg     │8→5   │🗑️    │
│ │ 📦 Stock Producto   │   │                                      │
│ │ Actual:      5      │   │ 📊 4 ingredientes agregados          │
│ │ Produces:   +10     │   │                                      │
│ │ Después:    15      │   │                                      │
│ └─────────────────────┘   │                                      │
│                           │                                      │
│ Nota:                     │                                      │
│ [Producción del día]      │                                      │
└───────────────────────────┴──────────────────────────────────────┘

[Cancelar]                          [🏭 Registrar Producción]
```

---

## 📋 PASO A PASO DETALLADO

### **PASO 1: Seleccionar Producto**

```bash
1. Admin → Producción
   http://localhost:8080/admin/produccion

2. En "Producto Fabricado":
   → Click en selector
   → Aparece lista de productos
   → Cada uno muestra stock actual

3. Selecciona:
   "Torta de Chocolate (Stock actual: 5)"

4. ✅ Producto seleccionado
```

---

### **PASO 2: Definir Stock Producido**

```bash
1. En "Stock Producido (Unidades)":
   → Escribe: 10

2. Ve preview automático:
   ┌─────────────────────┐
   │ 📦 Stock Producto   │
   │ Actual:      5      │
   │ Produces:   +10     │
   │ Después:    15      │
   └─────────────────────┘

3. ✅ Stock definido
```

---

### **PASO 3: Agregar Ingredientes**

#### **Ingrediente 1:**
```bash
1. Click en "+ Agregar" (columna derecha)

2. Dialog se abre:
   ┌────────────────────────────────────┐
   │ Agregar Ingrediente Utilizado      │
   ├────────────────────────────────────┤
   │ Ingrediente:                       │
   │ [Harina de Almendras ▼]            │
   │                                    │
   │ Cantidad Utilizada (Total):        │
   │ [10] kg                            │
   │ Cantidad TOTAL que usaste          │
   ├────────────────────────────────────┤
   │ ✅ Preview:                        │
   │ Stock actual: 50 kg                │
   │ Vas a usar: 10 kg                  │
   │ Stock después: 40 kg ✓             │
   └────────────────────────────────────┘
   
   [Cancelar]    [Agregar Ingrediente]

3. Click en "Agregar Ingrediente"

4. ✅ Aparece en la tabla de ingredientes
```

#### **Ingrediente 2:**
```bash
1. Click en "+ Agregar" de nuevo

2. Selecciona: Aceite de Coco
   Cantidad: 2 litros

3. Preview muestra:
   Stock actual: 30 L
   Stock después: 28 L ✓

4. Agregar

5. ✅ Segundo ingrediente en la tabla
```

#### **Ingrediente 3 y 4:**
```bash
Repites el proceso para:
- Stevia: 1 kg
- Cacao: 3 kg

Tabla ahora tiene 4 ingredientes
```

---

### **PASO 4: Revisar y Editar (Si necesario)**

En la tabla de ingredientes puedes:

```bash
1. Editar cantidad:
   → Click en el número
   → Escribe nueva cantidad
   → Enter o click fuera

2. Eliminar ingrediente:
   → Click en 🗑️
   → Se elimina de la lista

3. Ver stock después:
   → Se actualiza automáticamente
   → Colores según nivel:
     🟢 Verde: OK
     🟠 Naranja: Quedará bajo
     🔴 Rojo: Insuficiente
```

---

### **PASO 5: Registrar Producción**

```bash
1. Verifica que todo esté correcto:
   ✅ Producto seleccionado
   ✅ Stock producido definido
   ✅ Ingredientes agregados
   ✅ Cantidades correctas
   ✅ Stock suficiente (sin rojos)

2. Click en "🏭 Registrar Producción"

3. Sistema procesa:
   → Aumenta stock del producto
   → Descuenta cada ingrediente
   → Registra movimiento
   → Actualiza alertas

4. ✅ Notificación de éxito

5. Formulario se resetea
```

---

## 💡 VENTAJAS DEL SISTEMA MANUAL

### **1. Flexibilidad Total:**
```
✅ Cada producción puede usar ingredientes diferentes
✅ Cantidades variables según disponibilidad
✅ Adaptación a recetas modificadas
```

### **2. Trazabilidad Real:**
```
✅ Sabes EXACTAMENTE qué usaste
✅ No asumes nada
✅ Refleja la realidad
```

### **3. Casos de Uso:**

```
Caso A: Receta Normal
Produces 10 tortas con receta estándar
→ Agregas ingredientes habituales

Caso B: Variación
Produces 10 tortas pero ajustaste la receta
→ Agregas ingredientes con cantidades reales

Caso C: Sin Receta
Producto nuevo sin receta configurada
→ No hay problema, agregas lo que usaste

Caso D: Múltiples Tandas
Hiciste 2 tandas con ingredientes diferentes
→ Registras cada producción por separado
```

---

## 📊 INFORMACIÓN EN TIEMPO REAL

### **Por Cada Ingrediente:**
```
Nombre: Harina de Almendras
Cantidad: [10] kg (editable)
Stock Actual: 50 kg
Stock Después: 40 kg 🟢
```

### **Validaciones Automáticas:**
```
Si stock después < 0:
→ Fila en ROJO
→ Botón DESHABILITADO
→ Alerta visible

Si stock después OK:
→ Fila normal
→ Botón habilitado
→ Puedes registrar
```

---

## 🎨 EJEMPLO VISUAL COMPLETO

```
PRODUCCIÓN: 10 Tortas de Chocolate

┌─────────────────────────────────┐
│ PRODUCTO: Torta de Chocolate    │
│ STOCK PRODUCIDO: 10 unidades    │
│ Stock: 5 → 15                   │
└─────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ INGREDIENTES UTILIZADOS           [+ Add]   │
├─────────────────────────────────────────────┤
│ Ingrediente      │ Cantidad │ Stock  │ 🗑️  │
│ Harina Almendras │ [10] kg  │ 50→40✓ │ 🗑️  │
│ Aceite Coco      │ [2] L    │ 30→28✓ │ 🗑️  │
│ Stevia           │ [1] kg   │ 5→4✓   │ 🗑️  │
│ Cacao            │ [3] kg   │ 8→5✓   │ 🗑️  │
├─────────────────────────────────────────────┤
│ 📊 4 ingredientes agregados                 │
└─────────────────────────────────────────────┘

[Cancelar]              [🏭 Registrar Producción]
```

---

## ⚙️ CONFIGURACIÓN

### **PASO 1: Ejecutar SQL**

```bash
1. Supabase Dashboard → SQL Editor

2. Ejecuta: database/produccion_manual.sql

3. Verás:
   ✅ Función registrar_produccion_manual creada
   ✅ Permisos configurados
   ✅ Sin errores
```

---

### **PASO 2: Probar el Sistema**

```bash
1. Admin → Producción

2. Selecciona producto: Torta

3. Stock producido: 10

4. Agregar ingredientes:
   
   Ingrediente 1:
   → Harina: 10 kg
   → Agregar

   Ingrediente 2:
   → Aceite: 2 L
   → Agregar

   Ingrediente 3:
   → Stevia: 1 kg
   → Agregar

5. Verifica preview de stocks

6. Registrar Producción

7. ✅ Todo actualizado
```

---

## 🔧 FUNCIONALIDADES

### **Agregar Ingrediente:**
```
1. Click en "+ Agregar"
2. Selecciona ingrediente
3. Define cantidad TOTAL usada
4. Ve preview del stock
5. Agregar
6. ✅ Aparece en tabla
```

### **Editar Cantidad:**
```
1. En tabla, click en número
2. Escribe nueva cantidad
3. Enter o click fuera
4. ✅ Stock después se recalcula
```

### **Eliminar Ingrediente:**
```
1. Click en 🗑️
2. ✅ Se elimina de la lista
```

### **Validación Automática:**
```
Si cantidad > stock:
→ Muestra "Insuficiente"
→ Fila en rojo
→ Botón deshabilitado
```

---

## 📊 COMPARACIÓN

### **Sistema Anterior (Recetas):**
```
Ventajas:
+ Rápido (receta pre-cargada)
+ Automático

Desventajas:
- Inflexible
- No refleja ajustes
- Requiere configuración previa
```

### **Sistema Nuevo (Manual):**
```
Ventajas:
+ Totalmente flexible
+ Cada producción es única
+ No requiere recetas pre-configuradas
+ Refleja exactamente lo que usaste
+ Puedes variar cantidades

Desventajas:
- Requiere más clics
- Debes recordar qué usaste
```

---

## 💼 CASOS DE USO REALES

### **Caso 1: Producción Estándar**

```bash
Lunes - Produces 10 tortas normales

Producción:
- Producto: Torta de Chocolate
- Stock: 10 unidades

Ingredientes:
- Harina: 10 kg (1 kg × 10)
- Aceite: 2 L (0.2 L × 10)
- Stevia: 1 kg (0.1 kg × 10)
- Cacao: 3 kg (0.3 kg × 10)

Registrar
✅ Todo actualizado según lo real
```

---

### **Caso 2: Receta Ajustada**

```bash
Martes - Produces 10 tortas pero ajustas receta

Producción:
- Producto: Torta de Chocolate
- Stock: 10 unidades

Ingredientes (AJUSTADOS):
- Harina: 12 kg (usaste más)
- Aceite: 1.5 L (usaste menos)
- Stevia: 0.8 kg (usaste menos)
- Cacao: 4 kg (usaste más)
- Dátiles: 2 kg (agregaste extra)

Registrar
✅ Se descuenta lo que REALMENTE usaste
```

---

### **Caso 3: Producto Nuevo**

```bash
Pruebas receta nueva - Produces 3 muestras

Producción:
- Producto: Brownie Premium (nuevo)
- Stock: 3 unidades

Ingredientes (prueba):
- Harina: 1.5 kg
- Cacao: 1 kg
- Nueces: 0.5 kg
- Aceite: 0.3 L

Registrar
✅ No necesita receta pre-configurada
✅ Registras lo que usaste
```

---

### **Caso 4: Aprovechamiento**

```bash
Tienes ingredientes por vencer

Producción:
- Producto: Mix Saludable
- Stock: 20 unidades

Ingredientes (disponibles):
- Restos Harina: 3 kg
- Aceite viejo: 1 L
- Stevia sobrante: 0.5 kg
- Frutos secos: 2 kg

Registrar
✅ Aprovechas lo que tienes
✅ Limpias inventario
```

---

## 🚀 ARCHIVOS CREADOS

```
✅ database/produccion_manual.sql
   - Función registrar_produccion_manual
   - Recibe JSONB con ingredientes
   - Descuenta según lo enviado
   - Permisos configurados

✅ src/pages/AdminProduccion.tsx (Reescrito)
   - Selección de producto
   - Agregar ingredientes manualmente
   - Tabla editable de ingredientes
   - Preview de stocks
   - Validaciones en tiempo real
   - Sistema completo nuevo

✅ PRODUCCION_MANUAL.md
   - Guía completa del nuevo sistema
   - Ejemplos paso a paso
   - Casos de uso reales
```

---

## ⚙️ CONFIGURACIÓN (2 PASOS)

### **PASO 1: Ejecutar SQL**

```bash
1. Supabase Dashboard → SQL Editor → New Query

2. Copia el contenido de:
   database/produccion_manual.sql

3. Pega y ejecuta (▶️)

4. Verás:
   ✅ Función registrar_produccion_manual creada
   ✅ Permisos aplicados
   ✅ Sin errores
```

---

### **PASO 2: Recargar Navegador**

```bash
1. Presiona Ctrl+Shift+R (forzar recarga)

2. Ve a: http://localhost:8080/admin/produccion

3. ✅ Nueva interfaz visible
```

---

## 📱 NUEVA INTERFAZ EXPLICADA

### **Columna Izquierda:**
```
DATOS DE LA PRODUCCIÓN
├─ Producto que hiciste
├─ Stock producido (unidades)
├─ Preview del stock producto
└─ Nota/Motivo (opcional)
```

### **Columna Derecha:**
```
INGREDIENTES UTILIZADOS
├─ Botón "+ Agregar"
├─ Tabla de ingredientes:
│  ├─ Nombre
│  ├─ Cantidad (editable)
│  ├─ Stock (actual → después)
│  └─ Eliminar
└─ Contador de ingredientes
```

---

## ✅ VALIDACIONES

### **Botón Habilitado Si:**
```
✅ Producto seleccionado
✅ Stock producido > 0
✅ Al menos 1 ingrediente agregado
✅ Todos los ingredientes tienen stock suficiente
```

### **Botón Deshabilitado Si:**
```
❌ Falta producto
❌ Falta stock producido
❌ Sin ingredientes
❌ Algún ingrediente insuficiente
```

---

## 🎯 VENTAJAS CLAVE

```
✅ No necesitas recetas pre-configuradas
✅ Cada producción es independiente
✅ Reflejas EXACTAMENTE lo que usaste
✅ Puedes variar ingredientes y cantidades
✅ Aprovechas ingredientes disponibles
✅ Experimentas con nuevas recetas
✅ Registras la realidad del día
✅ Máxima flexibilidad
✅ Control total
```

---

## 📖 DOCUMENTACIÓN SQL

### **Función:**
```sql
registrar_produccion_manual(
  producto_id UUID,
  stock_producido INTEGER,
  ingredientes JSONB,  -- Array de objetos
  motivo TEXT
)
```

### **Formato de Ingredientes:**
```json
[
  {
    "ingrediente_id": "uuid-harina",
    "cantidad": 10
  },
  {
    "ingrediente_id": "uuid-aceite",
    "cantidad": 2
  }
]
```

---

## ✅ RESUMEN

```
Sistema COMPLETAMENTE NUEVO:

✅ Producción con selección manual
✅ Agregas ingredientes uno por uno
✅ Defines cantidades exactas
✅ Ves preview de stocks
✅ Validación en tiempo real
✅ Editas cantidades en la tabla
✅ Eliminas ingredientes
✅ Máxima flexibilidad
✅ Refleja la realidad
✅ Sin recetas obligatorias
✅ Control total del admin
```

---

**¡Sistema completamente flexible de producción implementado!** 🏭💚✨

**Fecha:** Diciembre 2024  
**Estado:** ✅ LISTO PARA USAR  
**Versión:** 3.0


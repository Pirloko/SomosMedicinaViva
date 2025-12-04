# 🏭 GUÍA DE PRODUCCIÓN - MEDICINA VIVA

Guía completa para registrar producción y gestionar stock de productos e ingredientes.

---

## 🎯 ¿QUÉ HACE LA PRODUCCIÓN?

Cuando registras producción:
1. ✅ **Stock del producto** aumenta (las unidades que hiciste)
2. ✅ **Ingredientes** se descuentan automáticamente
3. ✅ Se guarda el movimiento en historial

---

## 📋 INTERFAZ DE PRODUCCIÓN

```
┌──────────────────────────────────────────────┐
│ Producto que Produjiste:                     │
│ [Torta de Chocolate ▼]                       │
│ El producto que acabas de hacer              │
├──────────────────────────────────────────────┤
│ Stock Producido (Unidades):                  │
│ [10]                                         │
│ ¿Cuántas unidades produjiste?                │
├──────────────────────────────────────────────┤
│ Nota / Motivo:                               │
│ [Producción del día...]                      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ 📦 PRODUCTO FINAL:                           │
│ Stock Actual: 5                              │
│ Vas a Producir: +10                          │
│ Stock Después: 15                            │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ 🧪 INGREDIENTES QUE SE VAN A DESCONTAR:      │
├──────────────────────────────────────────────┤
│ [Harina de Almendras]              kg        │
│ Por unidad: 1  │ Total usar: 10              │
│ Stock actual: 50 │ Stock después: 40 🟢      │
├──────────────────────────────────────────────┤
│ [Aceite de Coco]                   litros    │
│ Por unidad: 0.2 │ Total usar: 2              │
│ Stock actual: 30 │ Stock después: 28 🟢      │
├──────────────────────────────────────────────┤
│ [Stevia]                           kg        │
│ Por unidad: 0.1 │ Total usar: 1              │
│ Stock actual: 5  │ Stock después: 4 🟢       │
├──────────────────────────────────────────────┤
│ [Cacao]                            kg        │
│ Por unidad: 0.3 │ Total usar: 3              │
│ Stock actual: 8  │ Stock después: 5 🟠       │
└──────────────────────────────────────────────┘

[Cancelar]            [🏭 Registrar Producción]
```

---

## 🚀 FLUJO COMPLETO PASO A PASO

### **PASO 1: Configurar Producto (Una vez)**

```bash
1. Admin → Productos → Editar producto

2. Configura campos de stock:
   Stock Disponible: 0
   Stock Mínimo: 5

3. Agrega ingredientes (receta):
   Click en "+ Agregar Ingrediente"
   
   Ingrediente 1:
   → Harina de Almendras
   → Cantidad: 1 kg (por unidad)
   
   Ingrediente 2:
   → Aceite de Coco
   → Cantidad: 0.2 litros (por unidad)
   
   Ingrediente 3:
   → Stevia
   → Cantidad: 0.1 kg (por unidad)

4. Guardar

5. ✅ Producto configurado con receta
```

---

### **PASO 2: Verificar Stock de Ingredientes**

```bash
1. Admin → Ingredientes

2. Verifica que tengas stock suficiente:
   
   ✅ Harina: 50 kg (suficiente)
   ✅ Aceite: 30 L (suficiente)
   ✅ Stevia: 5 kg (suficiente)

3. Si alguno está bajo:
   → Edita el ingrediente
   → Aumenta el stock
   → Guarda
```

---

### **PASO 3: Registrar Producción**

```bash
1. Admin → Producción
   http://localhost:8080/admin/produccion

2. Selecciona producto:
   "Torta de Chocolate"

3. Define cantidad:
   "10 unidades"

4. Verás automáticamente:

   📦 PRODUCTO FINAL:
   Stock Actual: 0
   Vas a Producir: +10
   Stock Después: 10

   🧪 INGREDIENTES A DESCONTAR:
   
   Harina de Almendras (kg)
   ├─ Por unidad: 1
   ├─ Total usar: 10
   ├─ Stock actual: 50
   └─ Stock después: 40 🟢

   Aceite de Coco (litros)
   ├─ Por unidad: 0.2
   ├─ Total usar: 2
   ├─ Stock actual: 30
   └─ Stock después: 28 🟢

   Stevia (kg)
   ├─ Por unidad: 0.1
   ├─ Total usar: 1
   ├─ Stock actual: 5
   └─ Stock después: 4 🟢

5. Revisa que todo esté correcto

6. Click en "🏭 Registrar Producción"

7. ✅ RESULTADO:
   - Notificación de éxito
   - Stock producto: 0 → 10
   - Harina: 50 → 40 kg
   - Aceite: 30 → 28 L
   - Stevia: 5 → 4 kg
```

---

## 📊 INFORMACIÓN MOSTRADA

### **1. Por unidad:**
```
Cantidad de ingrediente para 1 producto
Ejemplo: 1 kg de harina por torta
```

### **2. Total usar:**
```
Cantidad total que se va a descontar
Cálculo: Por unidad × Cantidad a producir
Ejemplo: 1 kg × 10 tortas = 10 kg
```

### **3. Stock actual:**
```
Cuánto tienes ahora del ingrediente
Ejemplo: 50 kg disponibles
```

### **4. Stock después:**
```
Cuánto quedará después de producir
Cálculo: Stock actual - Total usar
Ejemplo: 50 kg - 10 kg = 40 kg

Colores:
🟢 Verde: Stock después > mínimo
🟠 Naranja: Stock después ≤ mínimo
🔴 Rojo: Stock insuficiente (no puedes producir)
```

---

## ⚠️ VALIDACIONES AUTOMÁTICAS

### **Si NO tiene ingredientes:**
```
┌──────────────────────────────────────────┐
│ ⚠️ Este producto no tiene receta         │
│                                          │
│ Debes asignar ingredientes antes de     │
│ registrar producción.                    │
│                                          │
│ [Ir a configurar receta →]               │
└──────────────────────────────────────────┘

Botón de registrar DESHABILITADO
```

---

### **Si NO hay stock suficiente:**
```
Ingrediente con borde ROJO:

Cacao (kg)
├─ Por unidad: 0.3
├─ Total usar: 15  ← Quieres usar
├─ Stock actual: 8  ← Solo tienes
└─ Stock después: ❌ INSUFICIENTE

Botón de registrar DESHABILITADO
```

---

## 💡 EJEMPLOS PRÁCTICOS

### **Ejemplo 1: Producción Normal**

```bash
Situación:
- Tienes todos los ingredientes
- Vas a hacer 10 tortas

Pasos:
1. Admin → Producción
2. Producto: Torta de Chocolate
3. Cantidad: 10
4. Ves resumen:
   ✅ Harina: 10 kg → OK
   ✅ Aceite: 2 L → OK
   ✅ Stevia: 1 kg → OK
5. Registrar
6. ✅ Producción exitosa
```

---

### **Ejemplo 2: Stock Insuficiente**

```bash
Situación:
- Stevia solo tiene 0.5 kg
- Necesitas 1 kg para 10 tortas

Pasos:
1. Admin → Producción
2. Producto: Torta
3. Cantidad: 10
4. Sistema detecta:
   ❌ Stevia: Stock después INSUFICIENTE
5. Opciones:
   A) Reducir cantidad (hacer solo 5 tortas)
   B) Ir a reponer stock de Stevia
6. Si eliges A:
   Cantidad: 5
   ✅ Ahora sí puedes producir
```

---

### **Ejemplo 3: Alerta de Stock Bajo**

```bash
Situación:
- Cacao tiene 10 kg
- Mínimo es 8 kg
- Vas a usar 3 kg

Pasos:
1. Registras producción de 10 tortas
2. Sistema muestra:
   🟠 Cacao: Stock después 7 kg (bajo del mínimo)
3. Puedes producir (no está bloqueado)
4. Pero te advierte que quedarás con stock bajo
5. Decisión:
   - Producir igual
   - O comprar cacao primero
```

---

## 🎨 CÓDIGOS DE COLOR

```
🟢 VERDE (Stock OK):
   Stock después > Stock mínimo
   Todo bien

🟠 NARANJA (Stock Bajo):
   Stock después ≤ Stock mínimo
   Alerta pero puedes producir

🔴 ROJO (Insuficiente):
   Stock actual < Cantidad necesaria
   NO puedes producir
   Botón DESHABILITADO
```

---

## 📊 VISTA DETALLADA POR INGREDIENTE

Cada ingrediente muestra 4 datos clave:

```
┌──────────────────────────────────────┐
│ HARINA DE ALMENDRAS            kg    │
├──────────────────────────────────────┤
│ Por unidad:     1                    │
│ Total usar:     10  ← Cantidad × unid│
│ Stock actual:   50  ← Lo que tienes  │
│ Stock después:  40  ← Después de prod│
└──────────────────────────────────────┘
```

---

## 🔄 FLUJO DE CÁLCULOS

```
1. Seleccionas producto
   ↓
2. Sistema carga receta del producto
   ↓
3. Defines cantidad a producir (ej: 10)
   ↓
4. Sistema calcula por cada ingrediente:
   Total usar = Cantidad por unidad × 10
   Stock después = Stock actual - Total usar
   ↓
5. Muestra resultado con colores
   ↓
6. Si todo OK: Habilita botón
   Si falta algo: Deshabilita botón
   ↓
7. Registras
   ↓
8. Base de datos actualiza todo automáticamente
```

---

## ✅ CHECKLIST ANTES DE PRODUCIR

```
[ ] Producto tiene receta configurada
[ ] Todos los ingredientes tienen stock
[ ] Stock suficiente para la cantidad deseada
[ ] Verificaste el resumen
[ ] Confirmaste las cantidades
```

---

## 🚨 MENSAJES DE ERROR

### **"Producto no tiene receta"**
```
Causa: No has asignado ingredientes al producto

Solución:
1. Click en "Ir a configurar receta"
2. Agrega ingredientes
3. Guarda
4. Vuelve a Producción
```

---

### **"Ingredientes insuficientes"**
```
Causa: No hay stock suficiente de algún ingrediente

Solución:
1. Ve a Ingredientes
2. Repone stock del ingrediente faltante
3. Vuelve a Producción
4. Intenta de nuevo
```

---

### **"Error al registrar producción"**
```
Causa posible: Función SQL no ejecutada

Solución:
1. Verifica que ejecutaste:
   database/stock_management.sql
2. Verifica en Supabase que la función existe
3. Recarga navegador
```

---

## 📱 ACCESOS RÁPIDOS

```
Registrar Producción:
→ http://localhost:8080/admin/produccion

Gestionar Ingredientes:
→ http://localhost:8080/admin/ingredientes

Configurar Productos:
→ http://localhost:8080/admin/productos
```

---

## 💼 CASO DE USO COMPLETO

### **Escenario: Producción Matutina**

```bash
Lunes 8 AM - Vas a producir

1. Revisas pedidos del día:
   - 5 tortas de chocolate
   - 10 galletas de avena
   - 3 brownies

2. Admin → Producción

3. Primera producción:
   Producto: Torta de Chocolate
   Cantidad: 5
   
   Sistema muestra:
   ✅ Harina: Usar 5 kg, tienes 50 kg → 45 kg
   ✅ Aceite: Usar 1 L, tienes 30 L → 29 L
   ✅ Stevia: Usar 0.5 kg, tienes 5 kg → 4.5 kg
   
   Registrar ✓

4. Segunda producción:
   Producto: Galletas de Avena
   Cantidad: 10
   
   Sistema muestra ingredientes
   Verificas todo OK
   Registrar ✓

5. Tercera producción:
   Producto: Brownies
   Cantidad: 3
   
   Sistema muestra ingredientes
   Registrar ✓

6. RESULTADO FINAL:
   Productos:
   ├─ Torta: +5 unidades
   ├─ Galletas: +10 unidades
   └─ Brownies: +3 unidades
   
   Ingredientes:
   ├─ Harina: Descontado según recetas
   ├─ Aceite: Descontado según recetas
   └─ Etc...

7. Dashboard:
   ✅ Stock productos actualizado
   ✅ Stock ingredientes actualizado
   ✅ Si algo quedó bajo: Alerta visible
```

---

## 🎯 VENTAJAS DEL SISTEMA

```
✅ Ves TODO antes de confirmar
✅ Ingredientes mostrados claramente
✅ Cantidades calculadas automáticamente
✅ Alertas de stock bajo
✅ No puedes producir sin stock
✅ Historial de todo
✅ Trazabilidad completa
```

---

## 📊 INFORMACIÓN CLAVE

### **Por Unidad:**
```
Cantidad de ingrediente para 1 producto
Se define en: Productos → Editar → Agregar Ingrediente
```

### **Total Usar:**
```
Cantidad total a descontar del ingrediente
Cálculo: Por unidad × Cantidad a producir
```

### **Stock Después:**
```
Cuánto quedará de ingrediente
Cálculo: Stock actual - Total usar
Color según nivel
```

---

## ✅ RESUMEN

```
Página de Producción muestra:

✅ Selector de producto
✅ Cantidad a producir
✅ Preview de stock producto (antes/después)
✅ Lista detallada de ingredientes
✅ Cantidades por unidad
✅ Total a usar de cada ingrediente
✅ Stock actual de cada ingrediente
✅ Stock después de producir
✅ Colores según nivel
✅ Validación automática
✅ Botón habilitado solo si hay stock
✅ Alerta si no tiene receta
```

---

**¡Sistema completo de producción con información clara y visual!** 🏭💚✨

**Fecha:** Diciembre 2024  
**Estado:** ✅ IMPLEMENTADO  
**Versión:** 2.0


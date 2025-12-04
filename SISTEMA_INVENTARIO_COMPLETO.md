# 📦 SISTEMA COMPLETO DE INVENTARIO - MEDICINA VIVA

Sistema bidireccional de gestión de stock: productos terminados e ingredientes.

---

## 🎯 ¿CÓMO FUNCIONA?

### **Flujo Completo:**

```
1. REPONES INGREDIENTES
   → Actualizas stock de ingredientes

2. PRODUCES PRODUCTOS
   → Stock de productos ↑ (aumenta)
   → Stock de ingredientes ↓ (descuenta automático)

3. REGISTRAS VENTAS
   → Stock de productos ↓ (descuenta automático)
   
4. ALERTAS AUTOMÁTICAS
   → Dashboard te avisa cuando falta stock
```

---

## 🔄 SISTEMA BIDIRECCIONAL

```
┌─────────────────────────────────────────────┐
│                                             │
│  INGREDIENTES (Materia Prima)               │
│  ├─ Harina Almendras: 50 kg                 │
│  ├─ Aceite Coco: 10 L                       │
│  └─ Stevia: 5 kg                            │
│           ↓                                 │
│     PRODUCCIÓN (Registras)                  │
│  "Producir 10 tortas"                       │
│           ↓                                 │
│  📉 Ingredientes SE DESCUENTAN AUTOMÁTICO:  │
│  ├─ Harina: 50 kg → 40 kg (-10 kg)         │
│  ├─ Aceite: 10 L → 8 L (-2 L)              │
│  └─ Stevia: 5 kg → 4 kg (-1 kg)            │
│           ↓                                 │
│  PRODUCTOS (Stock Terminado)                │
│  └─ Torta Chocolate: 0 → 10 unid. (+10)    │
│           ↓                                 │
│     VENTAS (Registras)                      │
│  "Venta de 3 tortas"                        │
│           ↓                                 │
│  📉 Productos SE DESCUENTAN AUTOMÁTICO:     │
│  └─ Torta: 10 unid. → 7 unid. (-3)         │
│                                             │
└─────────────────────────────────────────────┘
```

---

## ⚙️ CONFIGURACIÓN INICIAL

### **PASO 1: Ejecutar SQL**

```bash
1. Supabase Dashboard
   → SQL Editor → New Query

2. Abre: database/stock_management.sql

3. Copia TODO el contenido

4. Pega y ejecuta (▶️)

5. Verás:
   ✅ Columnas agregadas a productos
   ✅ Tabla stock_movimientos creada
   ✅ Función registrar_produccion creada
   ✅ Trigger de ventas configurado
   ✅ Vista de productos con stock
```

---

### **PASO 2: Actualizar Productos Existentes**

Si ya tienes productos, necesitas darles stock inicial:

```sql
-- Ejecuta en Supabase SQL Editor:
UPDATE productos 
SET 
  stock_disponible = 0,
  stock_minimo = 5
WHERE stock_disponible IS NULL;
```

---

## 📦 GESTIÓN DE PRODUCTOS

### **1. Crear/Editar Producto**

Ahora el formulario incluye:

```
┌─────────────────────────────────────────┐
│ Nombre: Torta de Chocolate              │
│ Precio: $18,990                         │
│ Categoría: Tortas                       │
├─────────────────────────────────────────┤
│ Stock Disponible: 0  ← NUEVO            │
│ Stock Mínimo: 5      ← NUEVO            │
│ ℹ️ Te alertará cuando esté por debajo   │
└─────────────────────────────────────────┘
```

**Uso:**
- `Stock Disponible`: Unidades actualmente disponibles para venta
- `Stock Mínimo`: Nivel de alerta (ej: 5 = alerta cuando queden 5 o menos)

---

### **2. Ver Stock en Tabla de Productos**

```
┌─────────┬────────┬─────────┬────────┐
│ Nombre  │ Precio │ Stock   │ Estado │
├─────────┼────────┼─────────┼────────┤
│ Torta   │ $18,990│ 7 unid. │ 🟢 OK  │
│ Galleta │ $6,990 │ 3 unid. │ 🟠 BAJO│
│ Brownie │ $8,990 │ 0 unid. │ 🔴 SIN │
└─────────┴────────┴─────────┴────────┘
```

**Indicadores:**
- 🟢 **OK**: Stock > Mínimo
- 🟠 **BAJO**: Stock ≤ Mínimo pero > 0
- 🔴 **SIN**: Stock = 0

---

## 🏭 REGISTRAR PRODUCCIÓN

### **¿Qué hace?**

1. ✅ Aumenta stock del producto
2. ✅ Descuenta ingredientes automáticamente (según receta)
3. ✅ Registra el movimiento en historial
4. ✅ Verifica que haya suficientes ingredientes

---

### **Cómo usar:**

```bash
1. Dashboard → "Producción" (card índigo)
   O directo: /admin/produccion

2. Selecciona producto:
   → "Torta de Chocolate"
   → Muestra stock actual

3. Cantidad a producir:
   → 10 unidades

4. Sistema verifica ingredientes:
   ✅ Harina Almendras: Necesitas 10 kg, tienes 50 kg ✓
   ✅ Aceite Coco: Necesitas 2 L, tienes 10 L ✓
   ✅ Stevia: Necesitas 1 kg, tienes 5 kg ✓

5. Click en "Registrar Producción"

6. Resultado:
   ✅ Torta: 0 → 10 unidades
   ✅ Harina: 50 kg → 40 kg
   ✅ Aceite: 10 L → 8 L
   ✅ Stevia: 5 kg → 4 kg
```

---

### **Si NO hay ingredientes suficientes:**

```
┌──────────────────────────────────────────┐
│ ⚠️ Ingredientes Insuficientes            │
├──────────────────────────────────────────┤
│ ✗ Harina Almendras:                      │
│   Necesitas 10 kg, tienes 3 kg           │
│                                          │
│ ✗ Stevia:                                │
│   Necesitas 1 kg, tienes 0.5 kg          │
├──────────────────────────────────────────┤
│ ❌ No puedes producir todavía             │
│ → Ve a Ingredientes para reponer stock  │
└──────────────────────────────────────────┘

Botón "Registrar Producción" DESHABILITADO
```

---

## 💰 REGISTRAR VENTAS

### **¿Qué hace?**

1. ✅ Descuenta stock del producto automáticamente
2. ✅ Registra la venta
3. ✅ Crea movimiento en historial
4. ✅ Actualiza KPIs

---

### **Cómo funciona:**

```bash
1. Registras venta:
   Producto: Torta de Chocolate
   Cantidad: 3 unidades
   Cliente: Juan Pérez

2. AL GUARDAR (automático):
   ✅ Stock producto: 10 → 7 unidades
   ✅ Venta registrada
   ✅ Movimiento guardado
   ✅ KPIs actualizados

No necesitas hacer nada adicional
Todo es AUTOMÁTICO
```

---

## 🔔 SISTEMA DE ALERTAS

### **Alertas de Ingredientes (Naranja):**

```
Dashboard muestra:
┌──────────────────────────────────────────┐
│ ⚠️ Alerta de Stock Bajo                  │
│ 2 ingredientes necesitan reposición     │
│                     [Ver Ingredientes]   │
├──────────────────────────────────────────┤
│ 🖼️ Harina Almendras: 5 kg (mín: 10 kg)  │
│ 🖼️ Stevia: 1 kg (mín: 2 kg)             │
└──────────────────────────────────────────┘
```

---

### **Alertas de Productos (Rojo):**

```
Dashboard muestra:
┌──────────────────────────────────────────┐
│ 📦 Productos sin Stock                   │
│ 2 productos necesitan producción urgente│
│                     [Producir Ahora]     │
├──────────────────────────────────────────┤
│ 🖼️ Torta Chocolate: 0 unid. (mín: 5)    │
│ 🖼️ Galletas Avena: 2 unid. (mín: 10)    │
└──────────────────────────────────────────┘
```

---

## 📊 FLUJO COMPLETO (Ejemplo Real)

### **Lunes:**

```
STOCK INICIAL:
Ingredientes:
├─ Harina: 50 kg
├─ Aceite: 10 L
└─ Stevia: 5 kg

Productos:
└─ Torta: 0 unidades
```

---

### **Lunes 9 AM - Producción:**

```bash
1. Admin → Producción

2. Producto: Torta de Chocolate
   Cantidad: 10 unidades

3. Sistema calcula automático:
   Receta (por unidad):
   - Harina: 1 kg
   - Aceite: 0.2 L
   - Stevia: 0.1 kg

   Para 10 unidades:
   - Harina: 10 kg
   - Aceite: 2 L
   - Stevia: 1 kg

4. Verifica stock:
   ✅ Harina: Necesitas 10, tienes 50 ✓
   ✅ Aceite: Necesitas 2, tienes 10 ✓
   ✅ Stevia: Necesitas 1, tienes 5 ✓

5. Registra producción

6. RESULTADO:
   Ingredientes:
   ├─ Harina: 50 → 40 kg (-10)
   ├─ Aceite: 10 → 8 L (-2)
   └─ Stevia: 5 → 4 kg (-1)

   Productos:
   └─ Torta: 0 → 10 unidades (+10)
```

---

### **Lunes 2 PM - Primera Venta:**

```bash
Cliente compra 3 tortas

1. Admin → Ventas → Nueva Venta

2. Selecciona:
   Producto: Torta de Chocolate
   Cantidad: 3
   Cliente: María González

3. Guarda venta

4. RESULTADO AUTOMÁTICO:
   Productos:
   └─ Torta: 10 → 7 unidades (-3)
```

---

### **Martes 10 AM - Más Ventas:**

```bash
Se venden 5 tortas más

Productos:
└─ Torta: 7 → 2 unidades (-5)

⚠️ ALERTA ACTIVADA (2 ≤ 5 mínimo)

Dashboard muestra:
📦 1 producto necesita producción urgente
   Torta de Chocolate: 2 unid.
```

---

### **Martes 11 AM - Producir Más:**

```bash
1. Dashboard → Click en "Producir Ahora"

2. Producto: Torta de Chocolate
   Cantidad: 15 unidades

3. Verifica ingredientes:
   ✅ Harina: Necesitas 15, tienes 40 ✓
   ✅ Aceite: Necesitas 3, tienes 8 ✓
   ✅ Stevia: Necesitas 1.5, tienes 4 ✓

4. Registra

5. RESULTADO:
   Ingredientes:
   ├─ Harina: 40 → 25 kg
   ├─ Aceite: 8 → 5 L
   └─ Stevia: 4 → 2.5 kg

   Productos:
   └─ Torta: 2 → 17 unidades

6. ✅ Alerta desaparece (17 > 5)
```

---

## 📋 ARCHIVOS CREADOS

```
✅ database/stock_management.sql
   - Columnas stock en productos
   - Tabla stock_movimientos
   - Función registrar_produccion
   - Trigger descuento automático ventas
   - Vista de productos críticos

✅ src/hooks/useStock.ts
   - useProductosCriticos()
   - useRegistrarProduccion()
   - useAjustarStock()
   - useMovimientosStock()

✅ src/pages/AdminProduccion.tsx
   - Página completa de producción
   - Verificación de ingredientes
   - Preview de cambios

✅ src/types/database.types.ts
   - Tipos actualizados para productos
   - Tipo stock_movimientos

✅ Actualizados:
   - AdminProductos.tsx (columna stock)
   - AdminProductoForm.tsx (campos stock)
   - Admin.tsx (widget de alertas productos)
   - App.tsx (rutas)
```

---

## 🎨 NUEVAS FUNCIONALIDADES

### **1. Dashboard con 2 Tipos de Alertas:**
```
🟠 INGREDIENTES CRÍTICOS
   → Naranja
   → Para comprar materia prima

🔴 PRODUCTOS SIN STOCK
   → Rojo
   → Para producir más
```

---

### **2. Tabla de Productos Mejorada:**
```
Antes: Imagen | Nombre | Precio | Tags | Estado
Ahora: Imagen | Nombre | Precio | STOCK | Estado

Stock muestra:
- Cantidad actual
- Badge de estado (OK/BAJO/SIN)
- Color según nivel
```

---

### **3. Formulario de Producto:**
```
Campos nuevos:
- Stock Disponible (unidades actuales)
- Stock Mínimo (nivel de alerta)
```

---

### **4. Página de Producción:**
```
/admin/produccion

Permite:
- Seleccionar producto
- Definir cantidad
- Ver preview de stock
- Verificar ingredientes disponibles
- Registrar producción

Automáticamente:
- Aumenta stock producto
- Descuenta ingredientes
- Registra movimiento
```

---

## 🚀 GUÍA DE USO COMPLETA

### **ESCENARIO A: Empezar desde cero**

#### **Paso 1: Configurar Ingredientes**
```bash
Admin → Ingredientes

Ingrediente: Harina de Almendras
- Stock Actual: 0 kg
- Stock Mínimo: 10 kg
- Costo: $5,000/kg

Guardar
```

#### **Paso 2: Comprar Ingredientes**
```bash
Compras 50 kg de harina al proveedor

Admin → Ingredientes → Editar Harina
- Stock Actual: 0 → 50 kg

Guardar
```

#### **Paso 3: Configurar Producto**
```bash
Admin → Productos → Editar "Torta Chocolate"

- Stock Disponible: 0
- Stock Mínimo: 5

Guardar
```

#### **Paso 4: Asignar Ingredientes al Producto**
```bash
Admin → Productos → Torta → "Ver Costos"

Agregar ingredientes y cantidades:
- Harina: 1 kg por unidad
- Aceite: 0.2 L por unidad
- Stevia: 0.1 kg por unidad

Guardar
```

#### **Paso 5: Producir**
```bash
Admin → Producción

- Producto: Torta de Chocolate
- Cantidad: 10

Sistema muestra:
✅ Harina: Necesitas 10, tienes 50 ✓
✅ Aceite: Necesitas 2, tienes 10 ✓
✅ Stevia: Necesitas 1, tienes 5 ✓

Registrar Producción

Resultado:
Torta: 0 → 10 unidades
Harina: 50 → 40 kg
```

#### **Paso 6: Vender**
```bash
Admin → Ventas → Nueva Venta

- Producto: Torta de Chocolate
- Cantidad: 3
- Cliente: Juan Pérez

Guardar

Resultado AUTOMÁTICO:
Torta: 10 → 7 unidades
```

---

## ⚠️ ALERTAS Y ADVERTENCIAS

### **Alerta de Ingredientes:**
```
Cuando: stock_actual ≤ stock_minimo

Dashboard:
┌────────────────────────────────────┐
│ ⚠️ Ingredientes Bajos              │
│ Compra materia prima               │
└────────────────────────────────────┘
```

### **Alerta de Productos:**
```
Cuando: stock_disponible ≤ stock_minimo

Dashboard:
┌────────────────────────────────────┐
│ 📦 Productos Sin Stock             │
│ Produce más unidades               │
└────────────────────────────────────┘
```

---

## 🎯 LÓGICA DE NEGOCIO

### **Stock de Productos:**
```
Aumenta con: Producción
Disminuye con: Ventas
```

### **Stock de Ingredientes:**
```
Aumenta con: Compras (manual en Admin → Ingredientes)
Disminuye con: Producción (automático)
```

---

## 📊 TABLA: stock_movimientos

Guarda historial de TODO:

```
┌──────┬──────────┬──────┬────────┬────────┬─────────┐
│ Tipo │ Producto │ Cant │ Antes  │ Después│ Fecha   │
├──────┼──────────┼──────┼────────┼────────┼─────────┤
│ PROD │ Torta    │ +10  │ 0      │ 10     │ 10:00   │
│ VENTA│ Torta    │ -3   │ 10     │ 7      │ 14:00   │
│ VENTA│ Torta    │ -5   │ 7      │ 2      │ 10:00   │
│ PROD │ Torta    │ +15  │ 2      │ 17     │ 11:00   │
└──────┴──────────┴──────┴────────┴────────┴─────────┘

Tipos:
- produccion: Cuando produces
- venta: Cuando vendes
- ajuste: Ajuste manual
```

---

## 🚀 NUEVAS RUTAS

```
✅ /admin/produccion  → Registrar producción
```

---

## 📱 DASHBOARD ACTUALIZADO

**13 Cards:**

1. Productos
2. Categorías
3. Carrusel Hero
4. Nosotros
5. Ingredientes
6. **Producción** ✨ NUEVO (índigo)
7. Beneficios
8. Puntos de Venta
9. Zonas Delivery
10. Ventas
11. Contactos
12. KPIs y Métricas
13. Costos y Ganancias

---

## ✅ RESUMEN DEL SISTEMA

```
✅ Productos con stock
✅ Stock mínimo configurable
✅ Producción registra y descuenta ingredientes
✅ Ventas descuentan stock automáticamente
✅ Alertas visuales (ingredientes + productos)
✅ Verificación de ingredientes disponibles
✅ Historial completo de movimientos
✅ Indicadores de color
✅ Sin errores
✅ Integración bidireccional completa
```

---

## 🎯 FLUJO VISUAL

```
COMPRAS → INGREDIENTES ↑
              ↓
         PRODUCCIÓN
              ↓
      INGREDIENTES ↓  +  PRODUCTOS ↑
              ↓
          VENTAS
              ↓
         PRODUCTOS ↓

ALERTAS EN CADA NIVEL:
🟠 Ingredientes bajos → Comprar
🔴 Productos bajos → Producir
```

---

## 🏁 SIGUIENTES PASOS

```bash
1. Ejecuta database/stock_management.sql

2. Actualiza productos existentes (stock inicial)

3. Asigna ingredientes a productos (recetas)

4. Registra producción

5. Registra ventas

6. ✅ Sistema funcionando completo
```

---

**¡Sistema bidireccional completo de inventario implementado!** 📦💚✨

**Fecha:** $(date)  
**Estado:** ✅ LISTO PARA USAR  
**Versión:** 1.0


# 🔔 SISTEMA DE ALERTAS DE STOCK - MEDICINA VIVA

Sistema completo para notificar al administrador cuando los ingredientes tienen stock bajo o se están agotando.

---

## 🎯 ¿CÓMO FUNCIONA?

El sistema compara automáticamente:
```
stock_actual <= stock_minimo → ⚠️ ALERTA
```

**Ejemplo:**
```
Harina de Almendras:
- Stock Actual: 5 kg
- Stock Mínimo: 10 kg
- Estado: ⚠️ STOCK BAJO (se activa alerta)

Aceite de Coco:
- Stock Actual: 0 litros
- Stock Mínimo: 5 litros
- Estado: 🚨 SIN STOCK (alerta crítica)
```

---

## 📍 UBICACIONES DE LAS ALERTAS

### **1. Dashboard Principal**

Cuando entras al admin, **lo primero que ves** si hay problemas:

```
┌──────────────────────────────────────────────┐
│ ⚠️ Alerta de Stock Bajo                      │
│ 3 ingredientes necesitan reposición urgente │
│                         [Ver Ingredientes]   │
├──────────────────────────────────────────────┤
│ 🖼️ Harina de Almendras                       │
│    Stock mínimo: 10 kg                       │
│                           STOCK BAJO: 5 kg   │
├──────────────────────────────────────────────┤
│ 🖼️ Aceite de Coco                            │
│    Stock mínimo: 5 litros                    │
│                           SIN STOCK          │
├──────────────────────────────────────────────┤
│ 🖼️ Eritritol                                 │
│    Stock mínimo: 2 kg                        │
│                           STOCK BAJO: 1 kg   │
└──────────────────────────────────────────────┘
```

**Características:**
- ✅ Muestra hasta 5 ingredientes críticos
- ✅ Indica si hay más con `+ X ingredientes más`
- ✅ Botón directo a la página de Ingredientes
- ✅ Fondo naranja para llamar la atención
- ✅ Solo aparece si hay problemas

---

### **2. Página de Ingredientes**

#### **Header con Contador:**
```
┌──────────────────────────────────────────────┐
│ Gestión de Ingredientes                     │
│ 15 ingredientes · 3 con stock bajo           │
│                         [+ Nuevo Ingrediente]│
└──────────────────────────────────────────────┘
```

#### **Alerta Global:**
```
┌──────────────────────────────────────────────┐
│ ⚠️ 3 ingredientes tienen stock bajo          │
│    o están agotados                          │
└──────────────────────────────────────────────┘
```

#### **Tabla con Indicadores:**
```
┌────────────────┬─────────┬────────────┬──────────┬────────┐
│ Ingrediente    │ Unidad  │ Stock Act. │ Stock Mín│ Estado │
├────────────────┼─────────┼────────────┼──────────┼────────┤
│ H. Almendras   │ kg      │ 5 (naranja)│ 10       │🟠BAJO  │
│ Aceite Coco    │ litros  │ 0 (rojo)   │ 5        │🔴SIN   │
│ Stevia         │ kg      │ 15         │ 5        │🟢OK    │
└────────────────┴─────────┴────────────┴──────────┴────────┘
```

**Indicadores Visuales:**
- 🔴 **Rojo + "SIN STOCK"**: Stock actual = 0
- 🟠 **Naranja + "STOCK BAJO"**: Stock actual ≤ stock mínimo
- 🟢 **Verde + "OK"**: Stock actual > stock mínimo

---

## 🚀 CÓMO USA EL ADMIN EL SISTEMA

### **Escenario 1: Revisar alertas diariamente**

```bash
1. Login al admin
   http://localhost:8080/login

2. Dashboard principal
   ✅ Si hay alertas: Se muestra widget naranja
   ✅ Si NO hay alertas: Widget no aparece

3. Ver detalle:
   → Click en "Ver Ingredientes"
   → Llega a página de Ingredientes
   → Ve tabla completa con todos los estados
```

---

### **Escenario 2: Reponer stock bajo**

```bash
1. Dashboard → Ver alerta de "Harina de Almendras"

2. Click en "Ver Ingredientes"

3. En la tabla, localizar "Harina de Almendras"
   Estado: 🟠 STOCK BAJO - 5 kg

4. Click en ✏️ (editar)

5. Actualizar "Stock Actual":
   Antes: 5 kg
   Después: 20 kg

6. Guardar

7. Resultado:
   ✅ Estado cambia a 🟢 OK
   ✅ Desaparece de las alertas
   ✅ Widget del dashboard se actualiza
```

---

### **Escenario 3: Ingrediente sin stock (urgente)**

```bash
Situación: Aceite de Coco = 0 litros

Dashboard muestra:
┌─────────────────────────────────────┐
│ 🖼️ Aceite de Coco                   │
│    Stock mínimo: 5 litros           │
│                    🔴 SIN STOCK     │
└─────────────────────────────────────┘

Acción:
1. Click en "Ver Ingredientes"
2. Buscar "Aceite de Coco"
3. Estado: 🔴 SIN STOCK (texto rojo, bold)
4. Editar → Actualizar stock
5. Guardar

Resultado:
✅ Alerta desaparece
✅ Puede seguir produciendo
```

---

## 🎨 CÓDIGOS DE COLOR

```css
🟢 VERDE (OK):
   - Stock Actual > Stock Mínimo
   - Todo bien, no hay problema
   - Badge: "OK" con fondo verde

🟠 NARANJA (STOCK BAJO):
   - Stock Actual ≤ Stock Mínimo
   - Stock Actual > 0
   - Necesita reposición pronto
   - Badge: "STOCK BAJO" con fondo naranja

🔴 ROJO (SIN STOCK):
   - Stock Actual = 0
   - Crítico, no se puede usar
   - Badge: "SIN STOCK" con fondo rojo
```

---

## 📊 CONFIGURACIÓN DEL STOCK MÍNIMO

### **¿Qué es el Stock Mínimo?**

Es el **nivel de seguridad** que defines para cada ingrediente.

**Ejemplo:**
```
Harina de Almendras:
- Usas 2 kg por día
- Tu proveedor tarda 3 días en entregar
- Stock Mínimo recomendado: 6-7 kg

Por qué:
✅ 3 días × 2 kg/día = 6 kg
✅ Tienes margen de seguridad
✅ Te alerta antes de quedarte sin stock
```

### **Cómo Definir el Stock Mínimo:**

```bash
1. Admin → Ingredientes

2. Editar ingrediente (✏️)

3. Campo "Stock Mínimo":
   Considera:
   - Consumo diario
   - Tiempo de reposición del proveedor
   - Margen de seguridad
   
4. Ejemplo:
   Ingrediente: Stevia
   Consumo: 0.5 kg/día
   Proveedor: 5 días
   Stock Mínimo: 3 kg (0.5 × 5 + margen)

5. Guardar
```

---

## 🔄 ACTUALIZACIÓN EN TIEMPO REAL

### **¿Cuándo se Actualiza?**

```
✅ Inmediatamente al:
   - Editar stock de un ingrediente
   - Crear nuevo ingrediente
   - Activar/desactivar ingrediente

✅ Cache de 1 minuto:
   - Las alertas se refrescan cada 60 segundos
   - Balance entre actualización y performance
```

### **Refrescar Manualmente:**

```bash
Si quieres ver cambios inmediatos:
1. Recarga la página (F5)
2. O sal y vuelve a entrar al dashboard
```

---

## 💡 MEJORES PRÁCTICAS

### **1. Definir Stock Mínimo Realista**
```
❌ Muy bajo (1 kg): Alertas solo cuando es muy tarde
❌ Muy alto (100 kg): Alertas constantes, molestas
✅ Equilibrado (según consumo y reposición)
```

### **2. Revisar Alertas Diariamente**
```
✅ Al iniciar sesión en el admin
✅ Antes de hacer producción del día
✅ Después de recibir pedidos de proveedores
```

### **3. Mantener Stock Actualizado**
```
✅ Actualizar después de cada compra
✅ Actualizar después de cada producción
✅ Hacer inventario semanal
```

### **4. Priorizar Ingredientes Críticos**
```
🔴 SIN STOCK → Comprar HOY
🟠 STOCK BAJO → Comprar esta semana
🟢 OK → Monitorear
```

---

## 📱 EJEMPLOS PRÁCTICOS

### **Ejemplo 1: Producción del día**

**Situación:**
```
Lunes 8 AM - Vas a hacer 10 tortas

Ingredientes necesarios:
- Harina de Almendras: 20 kg
- Aceite de Coco: 2 litros
- Stevia: 1 kg
```

**Checklist:**
```bash
1. Login al admin

2. Dashboard:
   ⚠️ Alerta: "Harina de Almendras - STOCK BAJO: 5 kg"
   
3. Análisis:
   Necesitas: 20 kg
   Tienes: 5 kg
   Faltan: 15 kg
   
4. Acción:
   ❌ NO puedes producir las 10 tortas
   ✅ Solo puedes hacer 2-3 tortas
   ✅ Debes comprar harina urgente

5. Llamar proveedor ANTES de empezar
```

---

### **Ejemplo 2: Compra semanal**

```bash
1. Viernes - Planificación de compras

2. Admin → Ingredientes

3. Filtrar mentalmente por:
   🔴 SIN STOCK: Comprar HOY
   🟠 STOCK BAJO: Comprar esta semana
   🟢 OK: No comprar

4. Hacer lista de compras:
   ✅ Aceite de Coco: 0L → Comprar 10L
   ✅ Harina Almendras: 5kg → Comprar 25kg
   ✅ Eritritol: 1kg → Comprar 5kg

5. Pedir a proveedores

6. Al recibir:
   → Actualizar stock en el admin
   → Alertas desaparecen
```

---

## 🛠️ ARCHIVOS TÉCNICOS

```typescript
// Hook nuevo creado
src/hooks/useIngredientes.ts
  - useIngredientesCriticos()
    → Obtiene ingredientes donde stock_actual <= stock_minimo

// Widget de alertas
src/pages/Admin.tsx
  - Widget naranja en dashboard
  - Muestra hasta 5 ingredientes
  - Link directo a Ingredientes

// Indicadores existentes (ya estaban)
src/pages/AdminIngredientes.tsx
  - Badges de colores (OK, BAJO, SIN)
  - Contador en header
  - Alerta global
```

---

## 📊 LÓGICA DEL SISTEMA

```typescript
// Detección de stock crítico
const esStockBajo = stock_actual <= stock_minimo
const esSinStock = stock_actual === 0

// Estados posibles:
if (esSinStock) {
  return "SIN STOCK" // 🔴 Rojo
} else if (esStockBajo) {
  return "STOCK BAJO" // 🟠 Naranja
} else {
  return "OK" // 🟢 Verde
}
```

---

## ✅ RESUMEN

### **Lo que el admin ve:**

```
1. Dashboard Principal:
   ✅ Widget de alertas (si hay problemas)
   ✅ Lista de ingredientes críticos
   ✅ Acceso rápido a Ingredientes

2. Página de Ingredientes:
   ✅ Contador en header
   ✅ Alerta global
   ✅ Badges de color en cada ingrediente
   ✅ Stock actual en color
   
3. Beneficios:
   ✅ Sabe ANTES de quedarse sin stock
   ✅ Puede planificar compras
   ✅ Evita interrupciones en producción
   ✅ Visual e intuitivo
```

---

## 🚀 PRÓXIMAS MEJORAS POSIBLES

Ideas para el futuro:

1. **Notificaciones por Email:**
   - Enviar email diario con resumen
   - Alertas críticas en tiempo real

2. **Historial de Stock:**
   - Gráfica de consumo
   - Predicción de cuándo se agotará

3. **Reposición Automática:**
   - Generar orden de compra automática
   - Integración con proveedores

4. **Alertas Móviles:**
   - Push notifications
   - SMS para alertas críticas

---

## 📱 ACCESOS RÁPIDOS

```
Dashboard con alertas:
→ http://localhost:8080/admin

Gestión de Ingredientes:
→ http://localhost:8080/admin/ingredientes

Login:
→ http://localhost:8080/login
```

---

## ✨ CONCLUSIÓN

El admin **SIEMPRE sabrá** cuando un ingrediente está por agotarse gracias a:

```
✅ Widget visible en dashboard
✅ Contador en header de Ingredientes
✅ Alerta global naranja
✅ Badges de color en cada fila
✅ Stock actual en color (rojo/naranja)
✅ Sistema automático basado en stock mínimo
✅ Actualización en tiempo real
```

**¡Nunca más te quedarás sin ingredientes sin saberlo!** 🔔✨

---

**Fecha:** $(date)  
**Estado:** ✅ IMPLEMENTADO  
**Versión:** 1.0


# 🔧 SOLUCIÓN DE ERRORES - SISTEMA DE STOCK

Guía para resolver los errores al implementar el sistema de inventario.

---

## ⚠️ ERRORES CORREGIDOS

### **Error 1: Badge dentro de `<p>`** ✅ RESUELTO
```
Warning: <div> cannot appear as a descendant of <p>
```

**Solución aplicada:**
- Cambié `<p>` por `<div>` para contener el Badge
- HTML ahora válido

---

### **Error 2: Función RPC no disponible** 🔧 REQUIERE ACCIÓN

```
Failed to load resource: 400
Error al llamar: registrar_produccion
```

**Causa:** La función no existe o no tiene permisos

---

## 🚀 SOLUCIÓN PASO A PASO

### **PASO 1: Ejecuta el SQL Actualizado**

El archivo `database/stock_management.sql` fue corregido con:
- ✅ Vista que no causa conflictos
- ✅ Permisos GRANT para funciones
- ✅ Mejor manejo de errores

**Cómo ejecutar:**

```bash
1. Abre Supabase Dashboard
   https://app.supabase.com

2. Ve a SQL Editor → New Query

3. Abre el archivo:
   database/stock_management.sql

4. Copia TODO el contenido (Ctrl+A, Ctrl+C)

5. Pega en SQL Editor (Ctrl+V)

6. Click en Run (▶️)

7. Espera a que termine

8. Verás mensajes:
   ✅ Sistema de stock implementado
   ✅ Productos actualizados: X
   ✅ Trigger de ventas: activo
   ✅ Función de producción: disponible
   ✅ Alertas de stock: configuradas
```

---

### **PASO 2: Verifica que la Función Existe**

```sql
-- En SQL Editor, ejecuta:
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'registrar_produccion';

-- Deberías ver:
registrar_produccion
```

Si NO aparece:
- ❌ El SQL no se ejecutó correctamente
- ❌ Hay un error en el SQL
- → Revisa los mensajes de error en Supabase

---

### **PASO 3: Verifica Permisos**

```sql
-- Ejecuta en SQL Editor:
SELECT 
  p.proname as function_name,
  pg_catalog.pg_get_function_identity_arguments(p.oid) as arguments
FROM pg_catalog.pg_proc p
WHERE p.proname = 'registrar_produccion';

-- Deberías ver la función listada
```

---

### **PASO 4: Prueba Manual la Función**

```sql
-- Obtén un producto_id de tu tabla:
SELECT id, nombre FROM productos LIMIT 1;

-- Copia el ID y prueba la función:
SELECT registrar_produccion(
  'TU-PRODUCTO-ID-AQUI'::uuid,  -- Reemplaza con ID real
  5,                              -- Cantidad
  'Prueba manual'                 -- Motivo
);

-- Si funciona, verás:
{
  "success": true,
  "producto_id": "...",
  "cantidad_producida": 5,
  "stock_anterior": 0,
  "stock_nuevo": 5
}
```

---

### **PASO 5: Actualiza Productos Existentes**

Si ya tenías productos, dales stock inicial:

```sql
-- Ejecuta en SQL Editor:
UPDATE productos 
SET 
  stock_disponible = 0,
  stock_minimo = 5,
  updated_at = NOW()
WHERE stock_disponible IS NULL;
```

---

### **PASO 6: Recarga la Aplicación**

```bash
1. Cierra el navegador completamente

2. Abre de nuevo: http://localhost:8080

3. Login al admin

4. Ve a: /admin/produccion

5. Intenta registrar producción
```

---

## 🔍 SI SIGUE FALLANDO

### **Opción A: Ver Error en Consola**

```bash
1. Presiona F12 (DevTools)

2. Ve a Console

3. Busca el error detallado

4. Verás algo como:
   "Error completo: ..."
   "Error message: ..."
   "Error details: {...}"

5. Copia TODO el mensaje de error
```

---

### **Opción B: Verificar en Supabase Logs**

```bash
1. Supabase Dashboard

2. Ve a: Logs → Postgres Logs

3. Busca errores recientes

4. Filtra por "registrar_produccion"

5. Ve qué dice el error
```

---

### **Opción C: Reconstruir la Función**

Si la función no existe o está corrupta:

```sql
-- 1. Elimina la función vieja
DROP FUNCTION IF EXISTS registrar_produccion(UUID, INTEGER, TEXT);

-- 2. Vuelve a ejecutar TODO el archivo:
-- database/stock_management.sql
```

---

## 🎯 VERIFICACIÓN COMPLETA

### **Checklist antes de usar Producción:**

```
[  ] SQL ejecutado sin errores
[  ] Función registrar_produccion existe
[  ] Permisos GRANT aplicados
[  ] Columnas stock_disponible y stock_minimo en productos
[  ] Tabla stock_movimientos existe
[  ] Trigger de ventas activo
[  ] Productos tienen stock inicial configurado
[  ] Productos tienen receta (ingredientes asignados)
[  ] Ingredientes tienen stock disponible
```

---

## 📋 COMANDOS DE VERIFICACIÓN

```sql
-- 1. Verificar columnas de productos:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'productos' 
AND column_name IN ('stock_disponible', 'stock_minimo');

-- 2. Verificar tabla de movimientos:
SELECT COUNT(*) FROM stock_movimientos;

-- 3. Verificar función existe:
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'registrar_produccion';

-- 4. Verificar trigger de ventas:
SELECT trigger_name 
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_descontar_stock_venta';

-- 5. Ver productos con stock:
SELECT nombre, stock_disponible, stock_minimo 
FROM productos 
LIMIT 5;
```

---

## 🚨 ERRORES COMUNES

### **Error: "Function registrar_produccion does not exist"**

**Causa:** SQL no ejecutado o función mal creada

**Solución:**
```sql
-- Ejecuta esto primero:
DROP FUNCTION IF EXISTS registrar_produccion(UUID, INTEGER, TEXT);

-- Luego ejecuta TODO stock_management.sql de nuevo
```

---

### **Error: "permission denied for function"**

**Causa:** Faltan permisos GRANT

**Solución:**
```sql
GRANT EXECUTE ON FUNCTION registrar_produccion(UUID, INTEGER, TEXT) TO authenticated;
```

---

### **Error: "column stock_disponible does not exist"**

**Causa:** Columnas no agregadas

**Solución:**
```sql
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS stock_disponible INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS stock_minimo INTEGER DEFAULT 5;
```

---

### **Error: "insufficient stock"**

**Causa:** No hay ingredientes suficientes

**Solución:**
1. Admin → Ingredientes
2. Aumenta el stock de los ingredientes
3. Intenta producir de nuevo

---

## ✅ PASOS FINALES

### **1. Ejecuta SQL actualizado:**
```bash
database/stock_management.sql (con GRANT incluido)
```

### **2. Verifica en Supabase:**
```sql
-- Debe retornar la función:
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'registrar_produccion';
```

### **3. Recarga navegador:**
```bash
Ctrl+Shift+R (forzar recarga)
```

### **4. Prueba producción:**
```bash
Admin → Producción
→ Selecciona producto
→ Cantidad: 1
→ Registrar

Si funciona:
✅ Stock aumenta
✅ Ingredientes se descuentan
✅ Sin errores
```

---

## 📞 SI SIGUE FALLANDO

**Comparte conmigo:**
1. El error completo de la consola (F12)
2. El resultado de ejecutar el SQL
3. El resultado de las queries de verificación

---

**¡Con estos cambios debería funcionar!** 🚀


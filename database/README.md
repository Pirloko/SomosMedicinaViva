# 🗄️ Guía de Configuración de Base de Datos

## 📋 Resumen

Esta carpeta contiene todos los scripts SQL necesarios para configurar la base de datos de Medicina Viva Bakery.

### Archivos:

| Archivo | Descripción | Orden |
|---------|-------------|-------|
| `schema.sql` | Crea todas las tablas, índices y triggers | 1️⃣ |
| `security.sql` | Configura Row Level Security (RLS) | 2️⃣ |
| `seed.sql` | Inserta datos iniciales | 3️⃣ |

---

## 🚀 Instrucciones Paso a Paso

### **Paso 1: Abrir SQL Editor en Supabase**

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto "medicina-viva-bakery"
3. En el menú lateral, haz clic en **🔧 SQL Editor**
4. Click en **"New query"**

---

### **Paso 2: Ejecutar Schema (Crear Tablas)**

1. **Abre el archivo** `schema.sql` en tu editor de código
2. **Copia TODO el contenido** del archivo
3. **Pégalo** en el SQL Editor de Supabase
4. **Ejecuta** el script:
   - Click en el botón **"Run"** (▶️)
   - O presiona `Ctrl + Enter` (Windows/Linux) o `Cmd + Enter` (Mac)

5. **Verificar éxito:**
   ```
   ✅ Deberías ver mensajes como:
   - "Success. No rows returned"
   - NOTICE: ✅ Base de datos creada exitosamente
   - NOTICE: 📊 Tablas: 9
   ```

6. **Comprobar tablas creadas:**
   - Ve a **Table Editor** en el menú lateral
   - Deberías ver las 9 tablas:
     - productos
     - ingredientes
     - producto_ingredientes
     - puntos_venta
     - zonas_delivery
     - contactos
     - beneficios
     - ventas
     - contenido

---

### **Paso 3: Ejecutar Security (Configurar RLS)**

1. **En SQL Editor**, crea **"New query"**
2. **Abre el archivo** `security.sql`
3. **Copia TODO el contenido**
4. **Pégalo** y **ejecuta** (▶️ Run)

5. **Verificar éxito:**
   ```
   ✅ Deberías ver:
   - NOTICE: ✅ Row Level Security configurado
   - NOTICE: 🔒 Políticas de seguridad aplicadas
   ```

6. **Comprobar políticas:**
   - Ve a **Authentication → Policies**
   - Deberías ver las políticas para cada tabla

---

### **Paso 4: Ejecutar Seed (Insertar Datos)**

1. **En SQL Editor**, crea **"New query"**
2. **Abre el archivo** `seed.sql`
3. **Copia TODO el contenido**
4. **Pégalo** y **ejecuta** (▶️ Run)

5. **Verificar éxito:**
   ```
   ✅ Deberías ver:
   - NOTICE: ✅ Datos iniciales cargados exitosamente
   - NOTICE: 🎂 Productos: 10
   - NOTICE: 🌿 Ingredientes: 8
   - NOTICE: ✅ Beneficios: 6
   - NOTICE: 🚚 Zonas Delivery: 10
   - NOTICE: 🏪 Puntos de Venta: 4
   ```

6. **Comprobar datos:**
   - Ve a **Table Editor**
   - Click en cada tabla
   - Deberías ver los datos insertados

---

## ✅ Verificación Final

### **1. Verificar Tablas**

En SQL Editor, ejecuta:

```sql
SELECT 
  table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Resultado esperado:** 9 tablas

---

### **2. Verificar Datos**

```sql
SELECT 
  (SELECT COUNT(*) FROM productos) as productos,
  (SELECT COUNT(*) FROM ingredientes) as ingredientes,
  (SELECT COUNT(*) FROM beneficios) as beneficios,
  (SELECT COUNT(*) FROM zonas_delivery) as zonas,
  (SELECT COUNT(*) FROM puntos_venta) as puntos_venta;
```

**Resultado esperado:**
```
productos: 10
ingredientes: 8
beneficios: 6
zonas: 10
puntos_venta: 4
```

---

### **3. Verificar RLS**

```sql
SELECT 
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Resultado esperado:** Deberías ver las políticas configuradas

---

### **4. Probar desde la Aplicación**

1. **Reinicia tu servidor de desarrollo:**
   ```bash
   # Si está corriendo, detén con Ctrl+C
   npm run dev
   ```

2. **Abre tu app:**
   ```
   http://localhost:8080/
   ```

3. **Verifica en la consola del navegador (F12):**
   ```
   ✅ Conexión con Supabase exitosa
   ```

4. **La página debería cargar normalmente** (aún con datos hardcoded por ahora)

---

## 🗂️ Estructura de la Base de Datos

### **Tablas Principales:**

```
productos (catálogo)
   ├── id, nombre, descripcion, precio
   ├── categoria, imagen_url, tags
   └── activo, created_at, updated_at

ingredientes (stock)
   ├── id, nombre, descripcion, beneficio
   ├── unidad_medida, stock_actual, stock_minimo
   ├── costo_unitario, imagen_url
   └── activo, created_at, updated_at

producto_ingredientes (relación)
   ├── id, producto_id, ingrediente_id
   └── cantidad_necesaria

puntos_venta (negocios aliados)
   ├── id, nombre, direccion, maps_url
   ├── horarios (semana, sabado, domingo)
   └── imagen_url, activo, orden

zonas_delivery (cobertura)
   ├── id, nombre, tiempo_entrega
   └── costo_envio, activo, orden

contactos (mensajes)
   ├── id, nombre, email, telefono
   ├── mensaje, leido, respondido
   └── notas, created_at

beneficios ("Apto Para")
   ├── id, titulo, descripcion
   ├── icono, color, orden
   └── activo

ventas (KPIs)
   ├── id, producto_id, cantidad
   ├── precio_unitario, total
   ├── cliente (nombre, email, telefono)
   ├── zona_delivery, estado, metodo_pago
   └── fechas (venta, entrega)

contenido (secciones dinámicas)
   ├── id, seccion, titulo, subtitulo
   ├── descripcion, imagen_url
   └── datos_json, activo
```

---

## ❓ Problemas Comunes

### **Error: "relation already exists"**
- **Solución:** Las tablas ya existen. Puedes ignorar o eliminarlas primero:
  ```sql
  DROP SCHEMA public CASCADE;
  CREATE SCHEMA public;
  -- Luego ejecuta schema.sql nuevamente
  ```

### **Error: "permission denied"**
- **Solución:** Asegúrate de estar ejecutando como el owner del proyecto en Supabase

### **No veo las tablas en Table Editor**
- **Solución:** Refresca la página del dashboard de Supabase

### **Error al insertar datos (seed.sql)**
- **Solución:** Verifica que schema.sql se ejecutó correctamente primero

---

## 🎯 Siguiente Paso

Una vez que hayas ejecutado los 3 scripts exitosamente:

✅ **FASE 3 COMPLETADA** - Base de Datos Configurada

**Siguiente:** **FASE 4** - Hacer el catálogo dinámico (conectar productos desde Supabase)

---

## 📞 Soporte

Si encuentras algún error:
1. Copia el mensaje de error completo
2. Revisa qué script estabas ejecutando
3. Verifica que los anteriores se ejecutaron correctamente


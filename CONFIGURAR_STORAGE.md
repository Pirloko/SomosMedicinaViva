# 📸 Configurar Supabase Storage para Imágenes

## 🎯 Objetivo

Configurar un bucket de almacenamiento en Supabase para que el admin pueda subir imágenes de productos e ingredientes desde su dispositivo.

---

## 📋 Pasos para Configurar

### **Paso 1: Acceder a Storage**

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto "medicina-viva-bakery"
3. En el menú lateral, haz clic en **📦 Storage**

---

### **Paso 2: Crear Bucket**

1. Click en **"New bucket"** (botón verde arriba a la derecha)

2. Completa el formulario:
   ```
   Name: imagenes
   Public bucket: ✅ Activar (IMPORTANTE!)
   File size limit: 5 MB
   Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp
   ```

3. Click en **"Create bucket"**

---

### **Paso 3: Configurar Políticas de Seguridad (RLS)**

#### **3.1: Política de Lectura (SELECT) - Pública**

1. Click en el bucket **"imagenes"**
2. Ve a la pestaña **"Policies"**
3. Click en **"New policy"**
4. Selecciona **"Create policy from scratch"**

**Configuración:**
```
Policy name: Imagenes públicas
Allowed operation: SELECT
Policy definition: WITH CHECK (true)
```

Click en **"Review"** y luego **"Save policy"**

#### **3.2: Política de Subida (INSERT) - Solo Autenticados**

1. Click en **"New policy"** nuevamente
2. Selecciona **"Create policy from scratch"**

**Configuración:**
```
Policy name: Solo admin puede subir
Allowed operation: INSERT
Target roles: authenticated
Policy definition: 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated')
```

Click en **"Review"** y luego **"Save policy"**

#### **3.3: Política de Eliminación (DELETE) - Solo Autenticados**

1. Click en **"New policy"** nuevamente
2. Selecciona **"Create policy from scratch"**

**Configuración:**
```
Policy name: Solo admin puede eliminar
Allowed operation: DELETE
Target roles: authenticated
Policy definition:
  USING (auth.role() = 'authenticated')
```

Click en **"Review"** y luego **"Save policy"**

---

### **Paso 4: Verificar Configuración**

#### **Verificar Bucket:**
```
✅ Nombre: imagenes
✅ Público: Sí
✅ Límite: 5 MB
✅ MIME types: image/jpeg, image/jpg, image/png, image/webp
```

#### **Verificar Políticas:**
```
✅ SELECT (lectura): Público
✅ INSERT (subida): Solo authenticated
✅ DELETE (eliminar): Solo authenticated
```

---

## 📁 Estructura del Bucket

Las imágenes se organizarán automáticamente en carpetas:

```
imagenes/
├── productos/
│   ├── 1701234567-abc123.jpg
│   ├── 1701234890-def456.png
│   └── 1701235000-ghi789.webp
│
└── ingredientes/
    ├── 1701235100-jkl012.jpg
    ├── 1701235200-mno345.png
    └── 1701235300-pqr678.webp
```

---

## 🔐 Seguridad Implementada

### **Público puede:**
- ✅ Ver imágenes (necesario para mostrarlas en el sitio)

### **Admin puede:**
- ✅ Ver imágenes
- ✅ Subir imágenes (solo cuando está autenticado)
- ✅ Eliminar imágenes (solo cuando está autenticado)

### **Validaciones en el Frontend:**
- ✅ Solo formatos: JPG, JPEG, PNG, WEBP
- ✅ Tamaño máximo: 5 MB
- ✅ Nombres únicos con timestamp
- ✅ Mensajes de error claros

---

## 🧪 Probar el Sistema

### **1. Subir una Imagen de Prueba:**

```bash
1. Ve a: http://localhost:8080/admin/productos/nuevo

2. En "Imagen del Producto":
   - Click en "Subir Imagen"
   - Selecciona una imagen (jpg, png o webp)
   - Espera a que se suba
   - ✅ Verás preview de la imagen

3. Completa el resto del formulario

4. Guarda el producto

5. Ve al catálogo público
   - La imagen se muestra correctamente
```

### **2. Verificar en Supabase Storage:**

```bash
1. Ve a Storage → imagenes → productos

2. Deberías ver el archivo subido con nombre único:
   Ej: 1701234567-abc123.jpg

3. Click en el archivo para ver preview
```

---

## ⚠️ Problemas Comunes

### **Error: "new row violates row-level security policy"**
**Solución:** Verifica que creaste las políticas de seguridad (Paso 3)

### **Error: "Bucket not found"**
**Solución:** Verifica que el bucket se llama exactamente "imagenes" (sin mayúsculas, sin acento)

### **Imagen no se muestra en el sitio**
**Solución:** Verifica que el bucket sea público (checkbox "Public bucket" activado)

### **No puedo subir imágenes**
**Solución:** 
- Verifica que estás logueado como admin
- Verifica la política INSERT para authenticated
- Revisa la consola del navegador (F12) para ver el error específico

---

## 📊 Límites del Plan Gratuito

**Supabase Free Tier:**
- ✅ 1 GB de almacenamiento (suficiente para ~1000 imágenes)
- ✅ 2 GB de transferencia/mes
- ✅ Ilimitadas operaciones

**Si creces más:**
- Plan Pro: $25/mes
- 100 GB de almacenamiento
- 200 GB de transferencia

---

## ✨ Características del Sistema

### **Formatos Soportados:**
- ✅ JPG / JPEG
- ✅ PNG
- ✅ WEBP (más eficiente)

### **Funcionalidades:**
- ✅ Upload desde dispositivo
- ✅ Preview antes de guardar
- ✅ Validación de tipo y tamaño
- ✅ Nombres únicos automáticos
- ✅ Organización en carpetas
- ✅ URLs públicas automáticas
- ✅ Opción alternativa: usar URL externa
- ✅ Eliminar imagen
- ✅ Cambiar imagen

### **UX Optimizada:**
- ✅ Drag & drop (nativo del navegador)
- ✅ Loading state al subir
- ✅ Preview inmediato
- ✅ Mensajes de error claros
- ✅ Botón para cambiar entre upload y URL

---

## 🎨 Interfaz del Upload

### **Sin Imagen:**
```
┌──────────────────────────────────┐
│ Imagen del Producto  [Usar URL] │
├──────────────────────────────────┤
│ ┌──────────────────────────────┐ │
│ │  📤 Subir Imagen             │ │
│ └──────────────────────────────┘ │
│ ℹ️ JPG, JPEG, PNG, WEBP (máx 5MB)│
└──────────────────────────────────┘
```

### **Con Imagen:**
```
┌──────────────────────────────────┐
│ Imagen del Producto  [Usar URL] │
├──────────────────────────────────┤
│ ┌──────────────────────────────┐ │
│ │  [Imagen Preview]        [X] │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │  🔄 Cambiar Imagen           │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

### **Opción URL:**
```
┌──────────────────────────────────┐
│ Imagen  [Subir archivo]          │
├──────────────────────────────────┤
│ [https://ejemplo.com/img.jpg] 💾 │
│ ℹ️ Pega la URL de una imagen     │
└──────────────────────────────────┘
```

---

## 🚀 ¡Listo para Usar!

Una vez configurado el bucket, el sistema funcionará automáticamente:

1. Admin sube imagen → Se guarda en Supabase
2. Se genera URL pública → Se guarda en la BD
3. Imagen se muestra en el sitio público
4. Todo sin configuración adicional ✨

---

## 📞 Siguiente Paso

**Una vez que hayas configurado el bucket "imagenes" en Supabase:**

✅ Recarga la aplicación  
✅ Ve a /admin/productos/nuevo  
✅ Prueba subir una imagen  
✅ ¡Debería funcionar perfectamente!

---

¿Algún problema? Revisa los logs de Supabase en Storage → Settings → Logs


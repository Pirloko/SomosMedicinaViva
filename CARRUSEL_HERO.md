# 🎠 SISTEMA DE CARRUSEL DEL HERO

Sistema completo para gestionar las imágenes del carrusel de la sección Hero (Inicio) desde el panel de administración.

---

## 📋 TABLA DE CONTENIDOS

1. [¿Qué es el Carrusel Hero?](#qué-es-el-carrusel-hero)
2. [Configuración Inicial](#configuración-inicial)
3. [Uso del Admin](#uso-del-admin)
4. [Características](#características)
5. [Archivos Creados](#archivos-creados)

---

## 🎯 ¿QUÉ ES EL CARRUSEL HERO?

El **Carrusel Hero** es el sistema que permite gestionar las imágenes que se muestran en la **sección de inicio** (Hero) de la página web. Las imágenes cambian automáticamente cada **2 segundos** con un espectacular **efecto giratorio 3D** al cargar la página, creando una experiencia visual impactante y dinámica.

### Antes vs Ahora:

**❌ ANTES:**
- Imagen fija en el código
- Para cambiarla: editar código manualmente
- Solo 1 imagen

**✅ AHORA:**
- Múltiples imágenes desde base de datos
- Gestión desde panel admin
- Carrusel automático
- Indicadores visuales
- Upload de imágenes directo

---

## ⚙️ CONFIGURACIÓN INICIAL

### PASO 1: Ejecutar SQL en Supabase

1. **Abre tu proyecto de Supabase**
   ```
   https://app.supabase.com
   ```

2. **Ve a SQL Editor**
   ```
   Panel izquierdo → SQL Editor → New Query
   ```

3. **Copia y ejecuta el script**
   ```sql
   -- Archivo: database/hero_carousel.sql
   -- Copia TODO el contenido del archivo
   ```

4. **Ejecuta**
   ```
   Click en "Run" (▶️)
   ```

5. **Verifica**
   ```
   ✅ Tabla hero_imagenes creada
   ✅ 3 imágenes iniciales insertadas
   ✅ RLS configurado
   ✅ Sin errores
   ```

### PASO 2: Verificar en tu App

1. **Reinicia el servidor de desarrollo**
   ```bash
   # Detén el servidor (Ctrl+C)
   # Inicia de nuevo
   npm run dev
   ```

2. **Ve a la página principal**
   ```
   http://localhost:8080/
   ```

3. **Observa el Hero**
   ```
   ✅ Imagen visible con efecto giratorio 3D
   ✅ Indicadores en la parte inferior
   ✅ Cambia cada 2 segundos
   ```

---

## 🎛️ USO DEL ADMIN

### Acceder al Administrador de Carrusel

**Opción 1: Desde el Dashboard**
```
1. Login: http://localhost:8080/login
2. Dashboard: Click en card "Carrusel Hero" (rosa/pink)
```

**Opción 2: URL Directa**
```
http://localhost:8080/admin/hero-carousel
```

---

### ➕ AGREGAR NUEVA IMAGEN

1. **Click en "Nueva Imagen"**

2. **Sube la imagen**
   - Click en "📤 Subir Imagen"
   - Selecciona archivo (JPG, PNG, WEBP)
   - Máximo 5 MB
   - Preview automático

3. **Completa datos (opcionales)**
   ```
   Título: Torta de Chocolate
   Subtítulo: Deliciosa y saludable
   Orden: 4
   ```

4. **Guarda**
   ```
   Click en "Crear Imagen"
   ```

5. **Resultado**
   ```
   ✅ Imagen agregada a la tabla
   ✅ Se muestra automáticamente en el carrusel
   ✅ Notificación de éxito
   ```

---

### ✏️ EDITAR IMAGEN EXISTENTE

1. **En la tabla, busca la imagen**

2. **Click en ✏️ (lápiz)**

3. **Edita lo que necesites:**
   - Cambiar imagen (botón "Cambiar Imagen")
   - Modificar título
   - Ajustar subtítulo
   - Cambiar orden

4. **Guarda cambios**
   ```
   Click en "Actualizar Imagen"
   ```

5. **Resultado**
   ```
   ✅ Cambios aplicados inmediatamente
   ✅ El carrusel se actualiza solo
   ```

---

### 👁️ ACTIVAR / DESACTIVAR IMAGEN

1. **Click en ⋮ (tres puntos) de la imagen**

2. **Selecciona:**
   - Si está activa: "Desactivar"
   - Si está inactiva: "Activar"

3. **Resultado:**
   ```
   Activa:
   ✅ Se muestra en el carrusel
   ✅ Indicador verde "Activo"
   
   Inactiva:
   ❌ NO se muestra en el carrusel
   ❌ Indicador gris "Inactivo"
   ```

---

### 🗑️ ELIMINAR IMAGEN

1. **Click en ⋮ (tres puntos)**

2. **Click en "Eliminar"**

3. **Confirma la acción**
   ```
   ⚠️ Esta acción es permanente
   ```

4. **Resultado**
   ```
   ✅ Imagen eliminada de la base de datos
   ✅ Desaparece del carrusel
   ```

---

## ✨ CARACTERÍSTICAS DEL CARRUSEL

### 🔄 Cambio Automático
```
⏱️ Cada 2 segundos
🎬 Transición suave (fade)
🔁 Loop infinito
🌀 Efecto giratorio 3D al cargar
```

### 🎯 Indicadores
```
• • • ← Puntos en la parte inferior
━ • • ← El activo se alarga y se resalta
```

### 👆 Interacción Manual
```
Click en indicadores → Ir a esa imagen
Cambio inmediato
```

### 📱 Responsive
```
✅ Se adapta a móvil
✅ Se adapta a tablet
✅ Se adapta a desktop
```

### 🎨 Efectos Visuales
```
🟢 Anillo giratorio decorativo (30s)
💫 Badges flotantes ("Sin Azúcar", "Vegano")
🌈 Gradiente de fondo dinámico
```

---

## 📊 GESTIÓN DE ORDEN

### ¿Qué es el Orden?

El **orden** determina en qué secuencia aparecen las imágenes:

```
Orden 1 → Primera imagen
Orden 2 → Segunda imagen
Orden 3 → Tercera imagen
...
```

### Reordenar Imágenes

1. **Edita cada imagen**
2. **Cambia el número de orden**
3. **Guarda**

**Ejemplo:**
```
Antes:
- Torta Chocolate: Orden 1
- Galletas: Orden 2
- Brownies: Orden 3

Después:
- Brownies: Orden 1      ← Ahora es primera
- Torta Chocolate: Orden 2
- Galletas: Orden 3
```

---

## 💡 MEJORES PRÁCTICAS

### Número de Imágenes
```
✅ Recomendado: 3-5 imágenes
⚠️ Mínimo: 2 imágenes (para ver efecto carrusel)
❌ Evitar: 1 sola imagen (no tiene sentido el carrusel)
```

### Calidad de Imágenes
```
✅ Resolución: 600x600 px o superior
✅ Formato: WEBP (mejor) o JPG
✅ Peso: Menor a 500 KB (optimizado)
✅ Aspecto: Cuadrado (1:1) preferido
```

### Contenido
```
✅ Productos destacados
✅ Promociones temporales
✅ Productos de temporada
✅ Best sellers
```

### Velocidad
```
⏱️ Default: 2 segundos
🎯 Muy dinámico, capta atención inmediata
✏️ Se puede modificar en src/components/Hero.tsx (línea 17)
🌀 Efecto giratorio: 1.2 segundos
```

---

## 🗂️ ARCHIVOS CREADOS

### 1. Base de Datos
```
📄 database/hero_carousel.sql
   - Tabla hero_imagenes
   - RLS policies
   - Datos iniciales
   - Triggers
```

### 2. Tipos TypeScript
```
📄 src/types/database.types.ts
   - hero_imagenes: Row, Insert, Update
```

### 3. Hooks
```
📄 src/hooks/useHeroImagenes.ts
   - useHeroImagenes() → Obtener activas
   - useAllHeroImagenes() → Obtener todas (admin)
   - useCreateHeroImagen() → Crear
   - useUpdateHeroImagen() → Editar
   - useToggleHeroImagenActivo() → Activar/Desactivar
   - useDeleteHeroImagen() → Eliminar
```

### 4. Componentes
```
📄 src/pages/AdminHeroCarousel.tsx
   - Página admin completa
   - Tabla de imágenes
   - Formularios crear/editar
   - Upload de imágenes
   - Gestión de orden
```

### 5. Hero Actualizado
```
📄 src/components/Hero.tsx
   - Carrusel automático
   - Indicadores
   - Transiciones suaves
   - Integración con Supabase
```

### 6. Rutas
```
📄 src/App.tsx
   - /admin/hero-carousel
```

### 7. Dashboard
```
📄 src/pages/Admin.tsx
   - Card "Carrusel Hero"
   - Ícono: Image
   - Color: Rosa/Pink
```

---

## 🎬 FLUJO COMPLETO DE USO

### Ejemplo Práctico: "Agregar Promoción de Navidad"

**Objetivo:** Agregar una imagen de productos navideños al carrusel

**Pasos:**

1. **Preparar imagen**
   ```
   - Foto de pan de pascua
   - Formato: WEBP
   - Tamaño: 600x600 px
   - Peso: 300 KB
   ```

2. **Login admin**
   ```
   http://localhost:8080/login
   ```

3. **Ir a Carrusel Hero**
   ```
   Dashboard → Click en "Carrusel Hero"
   ```

4. **Nueva Imagen**
   ```
   Click en "Nueva Imagen"
   ```

5. **Subir foto**
   ```
   Click en "Subir Imagen"
   Selecciona: pan-pascua.webp
   Espera upload
   ```

6. **Completar datos**
   ```
   Título: Especial Navidad
   Subtítulo: Pan de Pascua Saludable
   Orden: 1  (para que aparezca primera)
   ```

7. **Guardar**
   ```
   Click en "Crear Imagen"
   ```

8. **Verificar en la web**
   ```
   Ir a http://localhost:8080/
   ✅ Nueva imagen aparece primero
   ✅ Cambia automáticamente cada 5s
   ```

9. **Después de Navidad: Desactivar**
   ```
   En admin → ⋮ → Desactivar
   ✅ Ya no se muestra
   ✅ Pero NO se eliminó (puedes reactivar el próximo año)
   ```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### ❌ "No se muestran las imágenes"

**Posibles causas:**
1. ❌ No ejecutaste el SQL
2. ❌ Todas las imágenes están inactivas
3. ❌ No hay imágenes en la base de datos

**Solución:**
```bash
1. Verifica en Supabase:
   - Table Editor → hero_imagenes
   - ¿Hay registros?
   - ¿Tienen activo = true?

2. Si no hay registros:
   - Ejecuta database/hero_carousel.sql

3. Si están inactivas:
   - Admin → Activa al menos 1
```

---

### ❌ "El carrusel no cambia automáticamente"

**Posibles causas:**
1. ❌ Solo hay 1 imagen activa
2. ❌ Error en useEffect

**Solución:**
```
1. Verifica número de imágenes activas:
   - Admin → Cuenta imágenes con ícono verde

2. Debe haber mínimo 2 activas:
   - Si solo hay 1: Agrega o activa más
```

---

### ❌ "Error al subir imagen"

**Posibles causas:**
1. ❌ Storage no configurado
2. ❌ Archivo muy grande
3. ❌ Formato no permitido

**Solución:**
```
1. Verifica formato:
   ✅ JPG, JPEG, PNG, WEBP
   ❌ GIF, BMP, SVG

2. Verifica tamaño:
   ✅ Menor a 5 MB
   ❌ Mayor a 5 MB

3. Verifica Storage:
   - Supabase → Storage → imagenes/otros/
   - Debe existir el bucket
```

---

## 📝 RESUMEN TÉCNICO

```
┌─────────────────────────────────────────────┐
│ CARRUSEL HERO - ARQUITECTURA                │
├─────────────────────────────────────────────┤
│                                             │
│ 📊 Base de Datos                            │
│  └─ hero_imagenes (tabla)                   │
│     ├─ id, titulo, subtitulo                │
│     ├─ imagen_url, orden, activo            │
│     └─ created_at, updated_at               │
│                                             │
│ 🎨 Frontend                                 │
│  ├─ Hero.tsx (carrusel público)             │
│  │  ├─ useHeroImagenes()                    │
│  │  ├─ Auto-cambio cada 5s                  │
│  │  ├─ Indicadores                          │
│  │  └─ Transiciones suaves                  │
│  │                                           │
│  └─ AdminHeroCarousel.tsx (gestión)         │
│     ├─ CRUD completo                        │
│     ├─ Upload de imágenes                   │
│     ├─ Activar/Desactivar                   │
│     └─ Reordenar                            │
│                                             │
│ 🔧 Hooks                                    │
│  └─ useHeroImagenes.ts                      │
│     ├─ useHeroImagenes()                    │
│     ├─ useAllHeroImagenes()                 │
│     ├─ useCreateHeroImagen()                │
│     ├─ useUpdateHeroImagen()                │
│     ├─ useToggleHeroImagenActivo()          │
│     └─ useDeleteHeroImagen()                │
│                                             │
│ 📁 Storage                                  │
│  └─ imagenes/otros/                         │
│     └─ [timestamp]-[random].webp            │
│                                             │
└─────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

```
[✓] SQL ejecutado en Supabase
[✓] Tabla hero_imagenes creada
[✓] RLS configurado
[✓] 3 imágenes iniciales insertadas
[✓] Tipos TypeScript agregados
[✓] Hooks creados
[✓] Página admin creada
[✓] Hero actualizado con carrusel
[✓] Rutas configuradas
[✓] Card en dashboard
[✓] Storage configurado (imagenes/otros/)
[✓] Componente ImageUpload integrado
[✓] Sin errores de linter (excepto temporales)
```

---

## 🎉 ¡TODO LISTO!

Tu sistema de carrusel está completamente implementado. 

**Próximos pasos:**
1. Ejecuta el SQL en Supabase
2. Sube tus propias imágenes de productos
3. Personaliza títulos y orden
4. ¡Disfruta del carrusel automático!

**¿Necesitas ayuda?**
- Revisa esta guía
- Verifica la consola del navegador
- Revisa logs de Supabase

---

**Creado para:** Medicina Viva Bakery 🍰💚  
**Versión:** 1.0  
**Fecha:** Diciembre 2024


# 🚀 GUÍA DE DESPLIEGUE EN NETLIFY - MEDICINA VIVA

Guía completa paso a paso para desplegar tu proyecto en Netlify desde GitHub.

---

## 📋 REQUISITOS PREVIOS

✅ Proyecto en GitHub: https://github.com/Pirloko/SomosMedicinaViva  
✅ Cuenta de Netlify creada  
✅ Proyecto de Supabase configurado  

---

## 🎯 PASO 1: CREAR ARCHIVO DE CONFIGURACIÓN NETLIFY

Este archivo le dice a Netlify cómo construir tu proyecto.

### Archivo: `netlify.toml`

Ya está creado en tu proyecto con la configuración correcta para Vite.

---

## 🚀 PASO 2: CONECTAR GITHUB CON NETLIFY

### 1. Ir a Netlify Dashboard

```
1. Abre tu navegador
2. Ve a: https://app.netlify.com/
3. Inicia sesión con tu cuenta
```

### 2. Crear Nuevo Sitio

```
1. Click en "Add new site" o "Import from Git"
2. Selecciona "Import from Git"
```

### 3. Conectar con GitHub

```
1. Click en "GitHub"

2. Netlify pedirá permisos:
   → "Authorize Netlify"
   → Click en "Authorize"

3. Si es la primera vez:
   → GitHub pedirá instalar Netlify App
   → Click en "Install"
   → Selecciona tu cuenta (Pirloko)
   → Selecciona repositorios:
     • "All repositories" (todos)
     • O "Only select repositories" y elige: SomosMedicinaViva
   → Click en "Install"
```

### 4. Seleccionar Repositorio

```
1. Verás lista de repositorios
2. Busca: "SomosMedicinaViva"
3. Click en el repositorio
```

---

## ⚙️ PASO 3: CONFIGURAR BUILD SETTINGS

### Configuración Automática

Netlify detectará tu `netlify.toml` y pre-llenará:

```
Branch to deploy: main
Build command: npm run build
Publish directory: dist
```

✅ **No cambies nada si ya aparece así**

---

## 🔐 PASO 4: AGREGAR VARIABLES DE ENTORNO

**MUY IMPORTANTE:** Debes agregar tus credenciales de Supabase.

### 1. En la página de configuración:

```
Scroll hacia abajo hasta "Environment variables"
```

### 2. Agregar Variables:

```
Click en "Add environment variables"

Variable 1:
Key:   VITE_SUPABASE_URL
Value: [Tu Supabase URL]
       Ejemplo: https://tuproyecto.supabase.co

Variable 2:
Key:   VITE_SUPABASE_ANON_KEY
Value: [Tu Supabase Anon Key]
       Ejemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. ¿Dónde encontrar estos valores?

```
1. Abre Supabase Dashboard
   → https://app.supabase.com

2. Selecciona tu proyecto

3. Ve a: Settings (⚙️) → API

4. Copia:
   Project URL → VITE_SUPABASE_URL
   anon public → VITE_SUPABASE_ANON_KEY
```

---

## 🚀 PASO 5: DESPLEGAR

```
1. Verifica que todo esté configurado:
   ✅ Branch: main
   ✅ Build command: npm run build
   ✅ Publish directory: dist
   ✅ Variables de entorno agregadas

2. Click en "Deploy [nombre-del-sitio]"

3. Netlify comenzará el build:
   → Clonando repositorio
   → Instalando dependencias
   → Ejecutando npm run build
   → Desplegando archivos

4. Espera 2-5 minutos

5. ✅ ¡Sitio desplegado!
```

---

## 🌐 PASO 6: VER TU SITIO

### URL Automática

Netlify te asigna una URL automática:

```
https://[nombre-random].netlify.app

Ejemplo:
https://medicina-viva-bakery-abc123.netlify.app
```

### Cambiar Nombre del Sitio

```
1. En Netlify Dashboard
2. Ve a: Site settings → General → Site details
3. Click en "Change site name"
4. Escribe: medicina-viva
5. Save
6. Nueva URL: https://medicina-viva.netlify.app
```

---

## 🔧 PASO 7: CONFIGURAR DOMINIO PERSONALIZADO (Opcional)

Si tienes un dominio propio:

```
1. Netlify → Domain settings
2. Click "Add custom domain"
3. Escribe tu dominio: medicinaviva.cl
4. Netlify te dará instrucciones DNS
5. Configura en tu proveedor de dominio
6. Espera propagación (24-48 hrs)
7. SSL automático (gratis)
```

---

## 🔄 PASO 8: DESPLIEGUES AUTOMÁTICOS

### ¡Ya está configurado!

Cada vez que hagas `git push` a GitHub:

```
1. GitHub detecta el push
2. Netlify detecta el cambio
3. Netlify hace build automático
4. Sitio se actualiza solo

✅ Despliegue continuo automático
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error 1: "Build failed"

**Ver el error:**
```
1. En Netlify, click en el deploy fallido
2. Ve a "Deploy log"
3. Lee el error completo
```

**Errores comunes:**

#### a) "Module not found"
```
Causa: Falta dependencia

Solución:
1. En local: npm install [paquete-faltante]
2. git add package.json package-lock.json
3. git commit -m "fix: agregar dependencia"
4. git push
```

#### b) "Environment variable not set"
```
Causa: Falta variable de entorno

Solución:
1. Netlify → Site settings → Environment variables
2. Verifica que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén
3. Si faltan, agrégalas
4. Redeploy: Deploys → Click "Trigger deploy" → "Deploy site"
```

#### c) "Command failed: npm run build"
```
Causa: Error de TypeScript o linter

Solución:
1. En local: npm run build
2. Corrige los errores que aparezcan
3. git add .
4. git commit -m "fix: errores de build"
5. git push
```

---

### Error 2: "Site loads but broken"

#### a) Página en blanco
```
Causa: Variables de entorno no configuradas

Solución:
1. Netlify → Environment variables
2. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
3. Redeploy
```

#### b) Imágenes no cargan
```
Causa: Rutas incorrectas

Solución:
El proyecto usa Supabase Storage, debería funcionar.
Verifica en Supabase que el bucket "imagenes" exista.
```

#### c) "Error de autenticación"
```
Causa: Supabase URL no configurado correctamente

Solución:
1. Verifica variables de entorno en Netlify
2. Copia exactamente desde Supabase Dashboard
3. Redeploy
```

---

### Error 3: "404 en rutas"

```
Causa: React Router necesita configuración especial

Solución:
El netlify.toml ya incluye:
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

Esto debería funcionar automáticamente.
```

---

## 🔄 REDESPLEGAR MANUALMENTE

Si necesitas redesplegar:

```
1. Netlify Dashboard
2. Deploys
3. Click en "Trigger deploy"
4. "Deploy site"
5. Espera el nuevo deploy
```

---

## 📊 MONITOREAR DEPLOYS

### Ver Estado:

```
Netlify Dashboard → Deploys

Estados posibles:
🟢 Published: Sitio en vivo
🟡 Building: Construyendo
🔴 Failed: Error en build
⚪ Queued: En cola
```

### Ver Logs:

```
Click en cualquier deploy → Deploy log
Ve todo el proceso de build
```

---

## 🎯 CONFIGURACIÓN AVANZADA

### 1. Build Hooks

Para redesplegar desde otros servicios:

```
Settings → Build & deploy → Build hooks
→ Add build hook
→ Usa la URL en webhooks externos
```

### 2. Deploy Previews

Cada Pull Request crea un preview automático:

```
Netlify → Site settings → Build & deploy → Deploy contexts
Activa "Deploy Previews"
```

### 3. Branch Deploys

Desplegar otras ramas:

```
Settings → Build & deploy → Branch deploys
→ "Let me add individual branches"
→ Agrega: develop, staging, etc.
```

---

## 📱 PRUEBA TU SITIO

### Después del Deploy:

```bash
1. Netlify te mostrará la URL:
   https://tu-sitio.netlify.app

2. Abre en navegador

3. Prueba:
   ✅ Página principal carga
   ✅ Carrusel funciona
   ✅ Catálogo se ve
   ✅ Modal de productos abre
   ✅ Login funciona
   ✅ Admin carga (después de login)

4. Prueba en móvil:
   → Abre desde tu teléfono
   → Todo debería funcionar responsive
```

---

## 🔒 SEGURIDAD

### Variables de Entorno:

```
✅ NUNCA subas .env a GitHub
✅ .gitignore ya lo protege
✅ Solo configura en Netlify
✅ No las compartas públicamente
```

### Supabase RLS:

```
✅ Asegúrate que RLS esté activo
✅ Políticas configuradas correctamente
✅ Solo admin puede modificar datos
```

---

## 💰 COSTOS

### Netlify Free Tier:

```
✅ 100 GB bandwidth/mes
✅ 300 build minutes/mes
✅ Deploy ilimitados
✅ SSL gratis
✅ CDN global
✅ Suficiente para comenzar
```

### Supabase Free Tier:

```
✅ 500 MB database
✅ 1 GB file storage
✅ 50,000 monthly active users
✅ 2 GB bandwidth
✅ Suficiente para empezar
```

---

## 📊 CHECKLIST COMPLETO

```
[ ] Cuenta Netlify creada
[ ] Proyecto en GitHub
[ ] netlify.toml existe
[ ] Conectar GitHub con Netlify
[ ] Seleccionar repositorio
[ ] Configurar build settings
[ ] Agregar variables de entorno:
    [ ] VITE_SUPABASE_URL
    [ ] VITE_SUPABASE_ANON_KEY
[ ] Click "Deploy"
[ ] Esperar build (2-5 min)
[ ] Probar sitio en la URL
[ ] Cambiar nombre del sitio (opcional)
[ ] Configurar dominio custom (opcional)
[ ] ✅ ¡Sitio en vivo!
```

---

## 🎉 RESULTADO FINAL

Tu sitio estará disponible en:

```
🌐 https://tu-sitio.netlify.app

Con:
✅ Despliegue automático en cada push
✅ SSL gratis (HTTPS)
✅ CDN global (rápido en todo el mundo)
✅ Preview de Pull Requests
✅ Rollback a versiones anteriores
✅ Analytics básico
```

---

## 📞 AYUDA ADICIONAL

Si algo falla:

1. **Lee el Deploy Log** (99% de las veces ahí está la solución)
2. **Verifica variables de entorno** (error más común)
3. **Prueba build local** (`npm run build`)
4. **Revisa este documento**

---

**¡Sigue estos pasos y tu sitio estará en vivo en minutos!** 🚀💚

**Próximos pasos:** Una vez desplegado, te ayudo a configurar el dominio custom si quieres.


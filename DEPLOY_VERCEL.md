# 🚀 GUÍA DE DEPLOY EN VERCEL
## Sistema Web - SOMOS MEDICINA VIVA

---

## 📋 REQUISITOS PREVIOS

Antes de comenzar, asegúrate de tener:

- ✅ Cuenta en [Vercel](https://vercel.com) (gratis)
- ✅ Proyecto en un repositorio Git (GitHub, GitLab o Bitbucket)
- ✅ Variables de entorno de Supabase configuradas
- ✅ Node.js 18+ instalado localmente (para pruebas)

---

## 📝 PASO 1: PREPARAR EL PROYECTO

### 1.1. Verificar que el proyecto compile correctamente

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
# Instalar dependencias (si no lo has hecho)
npm install

# Probar el build localmente
npm run build

# Verificar que el build se creó correctamente
ls dist/
```

Si el build es exitoso, verás una carpeta `dist/` con los archivos compilados.

### 1.2. Verificar variables de entorno

Asegúrate de tener un archivo `.env` o `.env.local` con:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

**⚠️ IMPORTANTE:** El archivo `.env` NO debe subirse a Git. Debe estar en `.gitignore`.

---

## 📝 PASO 2: CREAR ARCHIVO DE CONFIGURACIÓN PARA VERCEL

Crea un archivo `vercel.json` en la raíz del proyecto:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

Este archivo le dice a Vercel:
- Cómo construir el proyecto
- Dónde están los archivos de salida
- Cómo manejar las rutas de React Router (SPA)
- Headers de seguridad y caché

---

## 📝 PASO 3: SUBIR EL PROYECTO A GIT

Si tu proyecto aún no está en Git:

```bash
# Inicializar repositorio (si no existe)
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit - Proyecto Medicina Viva"

# Crear repositorio en GitHub/GitLab/Bitbucket y luego:
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git branch -M main
git push -u origin main
```

**⚠️ IMPORTANTE:** Asegúrate de que `.env` esté en `.gitignore`:

```bash
# Verificar que .env está en .gitignore
cat .gitignore | grep .env
```

Si no está, agrégalo:

```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

---

## 📝 PASO 4: CONECTAR PROYECTO CON VERCEL

### 4.1. Iniciar sesión en Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"** o **"Log In"**
3. Inicia sesión con GitHub, GitLab o Bitbucket (recomendado)

### 4.2. Importar proyecto

1. En el dashboard de Vercel, haz clic en **"Add New..."** → **"Project"**
2. Selecciona tu repositorio de Git (GitHub/GitLab/Bitbucket)
3. Si no aparece, haz clic en **"Adjust GitHub App Permissions"** y autoriza Vercel

### 4.3. Configurar el proyecto

Vercel detectará automáticamente que es un proyecto Vite. Verás:

- **Framework Preset:** Vite (debería detectarse automáticamente)
- **Root Directory:** `./` (dejar por defecto)
- **Build Command:** `npm run build` (debería estar automático)
- **Output Directory:** `dist` (debería estar automático)
- **Install Command:** `npm install` (debería estar automático)

**Si no se detecta automáticamente**, configura manualmente:
- Framework: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`

---

## 📝 PASO 5: CONFIGURAR VARIABLES DE ENTORNO

### 5.1. Agregar variables en Vercel

1. En la página de configuración del proyecto, ve a la sección **"Environment Variables"**
2. Haz clic en **"Add"** para cada variable:

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `tu_url_de_supabase` (ej: `https://xxxxx.supabase.co`)
   - Environment: Selecciona **Production**, **Preview** y **Development**

   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `tu_clave_anonima_de_supabase`
   - Environment: Selecciona **Production**, **Preview** y **Development**

3. Haz clic en **"Save"** para cada variable

### 5.2. Obtener las credenciales de Supabase

Si no las tienes:

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Ve a **Settings** → **API**
3. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## 📝 PASO 6: HACER EL DEPLOY

### 6.1. Deploy automático desde Git

1. Una vez configurado todo, haz clic en **"Deploy"**
2. Vercel comenzará a construir tu proyecto
3. Verás el progreso en tiempo real
4. Cuando termine, verás un mensaje: **"Ready"**

### 6.2. Ver tu sitio

1. Haz clic en el enlace que aparece (ej: `tu-proyecto.vercel.app`)
2. Tu sitio debería estar funcionando

---

## 📝 PASO 7: CONFIGURAR DOMINIO PERSONALIZADO (OPCIONAL)

### 7.1. Agregar dominio

1. En el dashboard de tu proyecto en Vercel
2. Ve a **Settings** → **Domains**
3. Ingresa tu dominio (ej: `medicinaviva.cl`)
4. Sigue las instrucciones para configurar DNS

### 7.2. Configurar DNS

Vercel te dará registros DNS para agregar en tu proveedor de dominio:

- Tipo: `CNAME` o `A`
- Name: `@` o `www`
- Value: El que Vercel te proporcione

---

## 🔄 DEPLOYS AUTOMÁTICOS

Una vez configurado, Vercel hará deploys automáticos cada vez que:

- ✅ Haces push a la rama `main` → Deploy a producción
- ✅ Haces push a otras ramas → Deploy de preview
- ✅ Haces un Pull Request → Deploy de preview

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema 1: Error "Build Failed"

**Solución:**
1. Revisa los logs de build en Vercel
2. Verifica que todas las dependencias estén en `package.json`
3. Asegúrate de que el comando `npm run build` funcione localmente

### Problema 2: Error "404" en rutas

**Solución:**
- Verifica que el archivo `vercel.json` tenga la configuración de `rewrites`
- Asegúrate de que todas las rutas redirijan a `/index.html`

### Problema 3: Variables de entorno no funcionan

**Solución:**
1. Verifica que las variables empiecen con `VITE_` (requerido para Vite)
2. Asegúrate de que estén configuradas en Vercel
3. Haz un nuevo deploy después de agregar variables

### Problema 4: Error de conexión con Supabase

**Solución:**
1. Verifica que las URLs de Supabase sean correctas
2. Revisa las políticas de Row Level Security (RLS) en Supabase
3. Verifica que el dominio de Vercel esté permitido en Supabase (si aplica)

---

## 📊 VERIFICAR EL DEPLOY

### Checklist post-deploy:

- [ ] El sitio carga correctamente
- [ ] Las rutas funcionan (navegación)
- [ ] La conexión con Supabase funciona
- [ ] El login/admin funciona
- [ ] Las imágenes se cargan correctamente
- [ ] El formulario de contacto funciona
- [ ] Google Maps funciona (si aplica)

---

## 🔐 SEGURIDAD ADICIONAL

### Configurar CORS en Supabase (si es necesario)

1. Ve a Supabase → **Settings** → **API**
2. En **CORS**, agrega tu dominio de Vercel:
   - `https://tu-proyecto.vercel.app`
   - `https://www.tu-dominio.com` (si tienes dominio)

---

## 📝 COMANDOS ÚTILES

### Deploy manual desde CLI (opcional)

Si prefieres usar la CLI de Vercel:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

---

## 🎯 RESUMEN RÁPIDO

1. ✅ Preparar proyecto (build local funciona)
2. ✅ Crear `vercel.json`
3. ✅ Subir a Git
4. ✅ Conectar con Vercel
5. ✅ Configurar variables de entorno
6. ✅ Deploy
7. ✅ Verificar funcionamiento

---

## 📞 SOPORTE

Si tienes problemas:

- **Documentación Vercel:** [https://vercel.com/docs](https://vercel.com/docs)
- **Documentación Vite:** [https://vitejs.dev](https://vitejs.dev)
- **Comunidad Vercel:** [https://github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

**¡Listo! Tu proyecto debería estar funcionando en Vercel.** 🚀

---

*Última actualización: [FECHA ACTUAL]*

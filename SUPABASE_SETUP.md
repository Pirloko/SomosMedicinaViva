# 🚀 Guía de Configuración de Supabase

## Paso 1: Crear Cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Regístrate con GitHub, Google o Email

---

## Paso 2: Crear Nuevo Proyecto

1. Una vez dentro, haz clic en "New project"
2. Completa los siguientes campos:
   - **Name**: `medicina-viva-bakery` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura (guárdala en un lugar seguro)
   - **Region**: Elige la región más cercana a Chile (ejemplo: `South America (São Paulo)`)
   - **Pricing Plan**: Selecciona "Free" para empezar

3. Haz clic en "Create new project"
4. Espera 1-2 minutos mientras Supabase crea tu proyecto

---

## Paso 3: Obtener las Credenciales

1. Una vez creado el proyecto, ve a **Settings** (⚙️ en el menú lateral)
2. Haz clic en **API**
3. Copia los siguientes valores:

   - **Project URL**: Algo como `https://xxxxxxxxxxx.supabase.co`
   - **Project API keys → anon public**: Una clave larga que empieza con `eyJ...`

---

## Paso 4: Configurar Variables de Entorno

1. Abre el archivo `.env` en la raíz de tu proyecto
2. Reemplaza los valores con los que copiaste:

```env
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **⚠️ IMPORTANTE**: NO compartas este archivo en Git (ya está en .gitignore)

---

## Paso 5: Verificar la Conexión

1. Guarda el archivo `.env`
2. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre la consola del navegador (F12)
4. Deberías ver: `✅ Conexión con Supabase exitosa`

---

## 🎯 Próximos Pasos

Una vez que veas el mensaje de conexión exitosa, estaremos listos para:

✅ **FASE 1 COMPLETADA** - Setup y Configuración

Siguiente: **FASE 2** - Crear sistema de autenticación para administrador

---

## ❓ Problemas Comunes

### Error: "Invalid API key"
- Verifica que copiaste correctamente la `anon public` key (no la `service_role`)

### Error: "Project URL is invalid"
- Asegúrate de que la URL incluye `https://` al inicio

### Error: Variables de entorno no se cargan
- Reinicia completamente el servidor (Ctrl+C y luego `npm run dev`)
- Verifica que el archivo se llama exactamente `.env` (no `.env.txt`)

---

## 📚 Recursos

- [Documentación Supabase](https://supabase.com/docs)
- [Supabase + React](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Dashboard de tu proyecto](https://supabase.com/dashboard/project/_)


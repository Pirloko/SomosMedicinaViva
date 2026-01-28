# 👥 SISTEMA DE USUARIOS VENDEDORES - MEDICINA VIVA BAKERY

## 📋 Descripción

Sistema de roles que permite al administrador crear usuarios vendedores con acceso limitado a funcionalidades específicas del sistema.

---

## 🎯 Funcionalidades Implementadas

### ✅ Para el Administrador:
- Crear usuarios vendedores con email y contraseña
- Ver lista de todos los usuarios (admins y vendedores)
- Activar/desactivar usuarios vendedores
- Eliminar usuarios vendedores

### ✅ Para el Vendedor:
- Panel de vendedor con métricas básicas
- Registrar nuevas ventas
- Ver historial de ventas
- Ver catálogo de productos (solo lectura)

---

## 🗄️ Base de Datos

### Tabla: `usuarios_roles`

```sql
CREATE TABLE usuarios_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  rol TEXT CHECK (rol IN ('admin', 'vendedor')),
  nombre_usuario TEXT NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id)
);
```

### Vista: `vista_usuarios_roles`

Muestra usuarios con sus roles y emails.

---

## 📝 Configuración Inicial

### Paso 1: Ejecutar Script SQL

1. Ve a tu proyecto en Supabase Dashboard
2. Abre el **SQL Editor**
3. Ejecuta el archivo: `database/usuarios_roles.sql`

### Paso 2: Asignar Rol al Usuario Admin Actual

Después de ejecutar el script, necesitas asignar el rol de "admin" a tu usuario actual:

```sql
-- Reemplaza 'TU_USER_ID' con el ID de tu usuario (lo encuentras en Authentication > Users)
INSERT INTO usuarios_roles (user_id, rol, nombre_usuario, activo)
VALUES (
  'TU_USER_ID_AQUI',  -- ID de tu usuario admin
  'admin',
  'Administrador Principal',
  true
)
ON CONFLICT (user_id) DO NOTHING;
```

**Para obtener tu User ID:**
1. Ve a Supabase Dashboard > Authentication > Users
2. Haz clic en tu usuario
3. Copia el **UUID** que aparece en "User UID"

---

## 🔐 Crear Usuarios Vendedores

### Opción 1: Desde el Panel Admin (Recomendado)

1. Inicia sesión como administrador
2. Ve a `/admin/usuarios`
3. Haz clic en "Nuevo Vendedor"
4. Completa el formulario:
   - **Nombre de Usuario**: Nombre para mostrar
   - **Email**: Email del vendedor (usará este para iniciar sesión)
   - **Contraseña**: Contraseña temporal (mínimo 6 caracteres)
5. Haz clic en "Crear Vendedor"

**⚠️ Nota Importante:**
- El usuario se crea con `signUp()` que requiere confirmación de email
- Para producción, deberías usar una Edge Function con Admin API
- Ver sección "Solución para Producción" más abajo

### Opción 2: Desde Supabase Dashboard

1. Ve a Supabase Dashboard > Authentication > Users
2. Haz clic en "Add user" > "Create new user"
3. Completa:
   - Email del vendedor
   - Contraseña
   - **Auto Confirm User**: ✅ Activar
4. Copia el **User UID** del usuario creado
5. Ejecuta este SQL:

```sql
INSERT INTO usuarios_roles (user_id, rol, nombre_usuario, activo)
VALUES (
  'USER_UID_AQUI',  -- Pegar el User UID
  'vendedor',
  'Nombre del Vendedor',
  true
);
```

---

## 🚀 Solución para Producción (Edge Function)

Para crear usuarios sin confirmación de email, necesitas una Edge Function:

### Crear Edge Function en Supabase

1. Instala Supabase CLI:
```bash
npm install -g supabase
```

2. Inicializa el proyecto:
```bash
supabase init
```

3. Crea la función:
```bash
supabase functions new crear-usuario-vendedor
```

4. Código de la función (`supabase/functions/crear-usuario-vendedor/index.ts`):

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { email, password, nombre_usuario, created_by } = await req.json()

  // Crear cliente con service_role (solo en Edge Function)
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Crear usuario
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (userError) {
    return new Response(JSON.stringify({ error: userError.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Asignar rol
  const { data: rolData, error: rolError } = await supabaseAdmin
    .from('usuarios_roles')
    .insert({
      user_id: userData.user.id,
      rol: 'vendedor',
      nombre_usuario,
      activo: true,
      created_by,
    })
    .select()
    .single()

  if (rolError) {
    return new Response(JSON.stringify({ error: rolError.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true, data: rolData }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

5. Despliega la función:
```bash
supabase functions deploy crear-usuario-vendedor
```

6. Actualiza el hook `useUsuarios.ts` para usar la Edge Function:

```typescript
const { data, error } = await supabase.functions.invoke('crear-usuario-vendedor', {
  body: { email, password, nombre_usuario, created_by: user.id }
})
```

---

## 🔒 Protección de Rutas

### Rutas de Admin (requieren rol `admin`):
- `/admin/*` - Todas las rutas de administración

### Rutas de Vendedor (requieren rol `vendedor`):
- `/vendedor` - Dashboard del vendedor
- `/vendedor/ventas/nueva` - Registrar nueva venta
- `/vendedor/ventas` - Ver ventas
- `/vendedor/productos` - Ver productos (solo lectura)

---

## 📱 Flujo de Usuario

### Admin:
1. Inicia sesión → Redirige a `/admin`
2. Ve a "Usuarios" → Crea vendedores
3. Acceso completo a todas las funcionalidades

### Vendedor:
1. Inicia sesión con email y contraseña → Redirige a `/vendedor`
2. Ve métricas básicas en el dashboard
3. Puede registrar ventas y ver productos
4. **NO** puede acceder a rutas de admin

---

## ⚠️ Notas Importantes

1. **Seguridad**: Los vendedores NO pueden acceder a rutas de admin
2. **Confirmación de Email**: En desarrollo, los usuarios creados con `signUp()` requieren confirmación
3. **Producción**: Usa Edge Functions para crear usuarios sin confirmación
4. **RLS**: Las políticas de seguridad están configuradas en la base de datos

---

## 🐛 Solución de Problemas

### El usuario no puede iniciar sesión:
- Verifica que el usuario esté creado en `auth.users`
- Verifica que tenga un rol asignado en `usuarios_roles`
- Verifica que `activo = true`

### Error "No tienes permisos":
- Verifica que el usuario tenga el rol correcto
- Verifica las políticas RLS en Supabase

### El usuario se crea pero no tiene rol:
- Ejecuta manualmente el INSERT en `usuarios_roles`
- Verifica que la función `asignar_rol_usuario` esté creada

---

## ✅ Checklist de Implementación

- [ ] Ejecutar `database/usuarios_roles.sql` en Supabase
- [ ] Asignar rol "admin" al usuario principal
- [ ] Probar creación de usuario vendedor desde `/admin/usuarios`
- [ ] Probar login como vendedor
- [ ] Verificar que vendedor NO puede acceder a `/admin`
- [ ] Verificar que vendedor puede acceder a `/vendedor`
- [ ] (Opcional) Configurar Edge Function para producción

---

**Fecha de Implementación:** 2024-12-04
**Estado:** ✅ Sistema básico implementado

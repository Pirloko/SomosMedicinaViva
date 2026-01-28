# 👤 Cómo Modificar el Usuario Administrador

## 📝 Guía Completa para Cambiar Email, Contraseña y Datos del Admin

---

## 🔐 Método 1: Desde el Dashboard de Supabase (Recomendado)

### **Paso 1: Acceder al Dashboard de Supabase**

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Inicia sesión con tu cuenta de Supabase
3. Selecciona tu proyecto **"medicina-viva-bakery"** (o el nombre de tu proyecto)

---

### **Paso 2: Navegar a Authentication**

1. En el menú lateral izquierdo, haz clic en el icono de 🔐 **Authentication**
2. Luego haz clic en **Users** (o "Usuarios")
3. Verás una lista de todos los usuarios registrados

---

### **Paso 3: Modificar el Usuario Administrador**

#### **A) Cambiar Email**

1. Busca tu usuario administrador en la lista
2. Haz clic en el usuario (o en los 3 puntos ⋮ a la derecha)
3. Se abrirá un panel con los detalles del usuario
4. Busca el campo **"Email"**
5. Haz clic en el icono de **lápiz** ✏️ o en **"Edit"**
6. Ingresa el nuevo email
7. Haz clic en **"Save"** o **"Update"**
8. ✅ **Listo**: El email ha sido actualizado

**⚠️ Importante:**
- Después de cambiar el email, deberás usar el **nuevo email** para iniciar sesión
- Si el usuario tiene sesión activa, deberá cerrar sesión y volver a iniciar con el nuevo email

---

#### **B) Cambiar Contraseña**

**Opción 1: Reset de Contraseña (Recomendado)**

1. En la lista de usuarios, busca tu usuario administrador
2. Haz clic en los **3 puntos** (⋮) a la derecha del usuario
3. Selecciona **"Reset password"** o **"Restablecer contraseña"**
4. Se enviará un email al usuario con un enlace para restablecer la contraseña
5. El usuario deberá:
   - Abrir el email
   - Hacer clic en el enlace
   - Ingresar la nueva contraseña
   - Confirmar la nueva contraseña

**Opción 2: Cambiar Contraseña Manualmente (Avanzado)**

1. Haz clic en tu usuario administrador
2. En el panel de detalles, busca la sección **"Password"**
3. Haz clic en **"Change password"** o **"Cambiar contraseña"**
4. Ingresa la nueva contraseña
5. Confirma la nueva contraseña
6. Haz clic en **"Update"** o **"Guardar"**

**⚠️ Importante:**
- La contraseña debe tener mínimo **6 caracteres**
- Se recomienda usar una contraseña fuerte:
  - Mínimo 12 caracteres
  - Mezcla de letras mayúsculas y minúsculas
  - Números y símbolos
  - Ejemplo: `MedViva2024!#Admin$`

---

#### **C) Cambiar Nombre de Usuario (Metadata)**

El "nombre de usuario" en Supabase se almacena en los **metadatos** del usuario. Para modificarlo:

1. Haz clic en tu usuario administrador
2. En el panel de detalles, busca la sección **"User Metadata"** o **"Metadatos"**
3. Haz clic en **"Edit"** o el icono de lápiz ✏️
4. Busca el campo `full_name` o `name` (si existe)
5. Modifica el valor
6. Haz clic en **"Save"**

**Nota:** Si no existe el campo `full_name`, puedes agregarlo manualmente editando el JSON:

```json
{
  "full_name": "Nuevo Nombre del Admin"
}
```

---

### **Paso 4: Verificar los Cambios**

1. Cierra sesión en tu aplicación (si estás logueado)
2. Ve a la página de login: `http://localhost:8080/login` (o tu URL de producción)
3. Inicia sesión con los **nuevos datos**
4. ✅ Si puedes iniciar sesión, los cambios fueron exitosos

---

## 🔧 Método 2: Desde SQL Editor (Avanzado)

Si prefieres usar SQL directamente:

### **Cambiar Email**

```sql
-- Reemplaza 'nuevo-email@ejemplo.com' con el nuevo email
-- Reemplaza 'email-actual@ejemplo.com' con el email actual
UPDATE auth.users
SET 
  email = 'nuevo-email@ejemplo.com',
  updated_at = NOW()
WHERE email = 'email-actual@ejemplo.com';
```

### **Cambiar Contraseña**

```sql
-- Reemplaza 'nueva-contraseña-segura' con tu nueva contraseña
-- Reemplaza 'email@ejemplo.com' con el email del usuario
UPDATE auth.users
SET 
  encrypted_password = crypt('nueva-contraseña-segura', gen_salt('bf')),
  updated_at = NOW()
WHERE email = 'email@ejemplo.com';
```

### **Cambiar Metadata (Nombre)**

```sql
-- Reemplaza 'Nuevo Nombre' con el nombre deseado
-- Reemplaza 'email@ejemplo.com' con el email del usuario
UPDATE auth.users
SET 
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{full_name}',
    '"Nuevo Nombre"'::jsonb
  ),
  updated_at = NOW()
WHERE email = 'email@ejemplo.com';
```

**Pasos para ejecutar SQL:**

1. En Supabase Dashboard, ve a **SQL Editor** (🔧 en el menú lateral)
2. Haz clic en **"New query"**
3. Pega el código SQL correspondiente
4. Modifica los valores (email, contraseña, nombre)
5. Haz clic en **"Run"** o presiona `Ctrl + Enter` (Windows/Linux) o `Cmd + Enter` (Mac)

---

## 📧 Método 3: Desde la Aplicación (Futuro)

Actualmente, la aplicación no tiene una interfaz para modificar el perfil del administrador. Esto se puede implementar en el futuro agregando:

1. Una página `/admin/perfil` o `/admin/configuracion`
2. Formularios para cambiar email y contraseña
3. Integración con Supabase Auth para actualizar los datos

**Si quieres que implemente esta funcionalidad, avísame y lo hacemos juntos.**

---

## 🔄 Recuperar Contraseña Olvidada

Si olvidaste tu contraseña y no puedes acceder:

### **Opción A: Reset desde Supabase Dashboard**

1. Ve a Supabase Dashboard → Authentication → Users
2. Busca tu usuario administrador
3. Haz clic en los **3 puntos** (⋮)
4. Selecciona **"Reset password"**
5. Revisa tu email (puede estar en spam)
6. Sigue las instrucciones del email

### **Opción B: Reset desde SQL**

```sql
-- Esto enviará un email de recuperación
-- Reemplaza 'email@ejemplo.com' con tu email
SELECT auth.reset_password_for_email('email@ejemplo.com');
```

---

## ⚠️ Consideraciones Importantes

### **Seguridad**

✅ **Contraseñas Fuertes:**
- Mínimo 12 caracteres
- Mezcla de mayúsculas, minúsculas, números y símbolos
- No uses información personal (fechas, nombres, etc.)

✅ **Emails Corporativos:**
- Usa un email profesional: `admin@medicinaviva.cl`
- Evita emails personales: `tu-nombre@gmail.com`

✅ **Autenticación de Dos Factores (2FA):**
- En Supabase: Authentication → Policies → Enable MFA
- Añade una capa extra de seguridad

### **Después de Modificar**

1. ✅ Cierra sesión en todas las aplicaciones
2. ✅ Inicia sesión con los nuevos datos
3. ✅ Verifica que todo funcione correctamente
4. ✅ Actualiza cualquier documentación con los nuevos datos

---

## 🆘 Problemas Comunes

### **"No puedo cambiar el email"**

- Verifica que el nuevo email no esté en uso por otro usuario
- Asegúrate de tener permisos de administrador en Supabase
- Intenta desde el Dashboard en lugar de SQL

### **"No recibo el email de reset de contraseña"**

- Revisa la carpeta de spam
- En Supabase: Authentication → Email Templates → View Emails
- Verifica que el email esté correcto en tu perfil

### **"No puedo iniciar sesión después de cambiar el email"**

- Asegúrate de usar el **nuevo email** (no el antiguo)
- Verifica que el email esté confirmado en Supabase
- Limpia la caché del navegador (Ctrl+Shift+R)

### **"El nombre no aparece en la aplicación"**

- El nombre se muestra desde `user.email` en el código
- Si quieres mostrar un nombre personalizado, necesitamos modificar el código para usar `user.user_metadata.full_name`
- Avísame si quieres que implemente esto

---

## 📞 Próximos Pasos

Después de modificar tu usuario administrador:

1. ✅ Prueba iniciar sesión con los nuevos datos
2. ✅ Verifica que puedas acceder al panel admin
3. ✅ Confirma que todos los permisos funcionen correctamente

---

## 💡 Consejos Adicionales

### **Múltiples Usuarios Administradores**

Si quieres tener varios usuarios administradores:

1. Crea usuarios adicionales desde: Authentication → Users → Add user
2. Todos tendrán acceso al panel admin (según las políticas RLS)
3. Puedes diferenciarlos por email o metadata

### **Eliminar Usuario Administrador**

Si necesitas eliminar un usuario:

1. Authentication → Users
2. Haz clic en los 3 puntos (⋮) del usuario
3. Selecciona **"Delete user"**
4. Confirma la eliminación

**⚠️ Cuidado:** Esto es permanente y no se puede deshacer.

---

## ✅ Resumen Rápido

**Para cambiar EMAIL:**
1. Supabase Dashboard → Authentication → Users
2. Click en tu usuario → Editar email → Guardar

**Para cambiar CONTRASEÑA:**
1. Supabase Dashboard → Authentication → Users
2. Click en 3 puntos (⋮) → Reset password
3. Revisa tu email y sigue las instrucciones

**Para cambiar NOMBRE:**
1. Supabase Dashboard → Authentication → Users
2. Click en tu usuario → User Metadata → Editar
3. Modifica `full_name` → Guardar

---

¿Necesitas ayuda con algo más? ¡Avísame! 🚀





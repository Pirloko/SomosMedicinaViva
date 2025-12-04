# 👤 Cómo Crear tu Usuario Administrador

## 📝 Instrucciones Paso a Paso

### **Opción 1: Desde el Dashboard de Supabase (Recomendado)**

1. **Ve a tu proyecto en Supabase**
   - Abre [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecciona tu proyecto "medicina-viva-bakery"

2. **Navega a Authentication**
   - En el menú lateral, haz clic en el icono de 🔐 **Authentication**
   - Luego haz clic en **Users**

3. **Agregar nuevo usuario**
   - Haz clic en el botón **"Add user"** (arriba a la derecha)
   - Selecciona **"Create new user"**

4. **Completar el formulario**
   ```
   Email: tu-email@ejemplo.com
   Password: (crea una contraseña segura)
   Auto Confirm User: ✅ Activar (importante!)
   ```

5. **Guardar**
   - Haz clic en **"Create user"**
   - ✅ ¡Listo! Ya tienes tu usuario admin

---

### **Opción 2: Desde la Terminal (Avanzado)**

Si prefieres usar SQL directamente:

1. **Abre el SQL Editor en Supabase**
   - En el menú lateral: 🔧 **SQL Editor**
   - Click en **"New query"**

2. **Ejecuta este script**
   ```sql
   -- Insertar usuario admin
   INSERT INTO auth.users (
     instance_id,
     id,
     aud,
     role,
     email,
     encrypted_password,
     email_confirmed_at,
     created_at,
     updated_at,
     confirmation_token,
     email_change,
     email_change_token_new,
     recovery_token
   )
   VALUES (
     '00000000-0000-0000-0000-000000000000',
     gen_random_uuid(),
     'authenticated',
     'authenticated',
     'admin@mediciaviva.cl', -- Cambia este email
     crypt('tu-contraseña-aqui', gen_salt('bf')), -- Cambia la contraseña
     NOW(),
     NOW(),
     NOW(),
     '',
     '',
     '',
     ''
   );
   ```

3. **Personaliza y ejecuta**
   - Reemplaza `admin@mediciaviva.cl` con tu email
   - Reemplaza `tu-contraseña-aqui` con tu contraseña
   - Haz clic en **"Run"** o presiona `Ctrl + Enter`

---

## 🔐 Probar el Login

1. **Abre tu aplicación**
   ```bash
   npm run dev
   ```

2. **Ve a la página de login**
   - Navega a: `http://localhost:8080/login`

3. **Inicia sesión**
   - Email: El que creaste
   - Contraseña: La que configuraste
   - Click en "Iniciar Sesión"

4. **¡Éxito!**
   - Deberías ser redirigido a `/admin`
   - Verás el panel de administración

---

## ⚠️ Recomendaciones de Seguridad

### **Para Producción:**

✅ **Email Corporativo**
```
Usa: admin@mediciaviva.cl
No uses: correo-personal@gmail.com
```

✅ **Contraseña Fuerte**
```
Mínimo 12 caracteres
Mezcla de letras, números y símbolos
Ejemplo: MedViva2024!#Admin$
```

✅ **Habilitar 2FA (Autenticación de Dos Factores)**
```
Authentication → Policies → Enable MFA
```

✅ **Configurar Email Provider**
```
Authentication → Email Templates
Configura SMTP personalizado
```

---

## 📧 Emails de Prueba para Desarrollo

Durante el desarrollo, Supabase captura todos los emails:

1. Ve a: **Authentication → Email Templates**
2. Click en **"View Emails"**
3. Ahí verás los emails de confirmación, recuperación, etc.

---

## 🔄 Recuperar Contraseña

Si olvidas tu contraseña:

### **Opción A: Desde Supabase Dashboard**
1. Authentication → Users
2. Busca tu usuario
3. Click en los 3 puntos (⋮)
4. "Reset password"
5. Sigue las instrucciones

### **Opción B: Implementar "Olvidé mi contraseña"**
(Lo haremos en fases posteriores)

---

## ✅ Verificar que Funciona

Después de crear el usuario, prueba:

1. ✅ Iniciar sesión en `/login`
2. ✅ Ver el dashboard en `/admin`
3. ✅ Ver tu email en el header
4. ✅ Cerrar sesión
5. ✅ Intentar acceder a `/admin` sin login (debería redirigir a `/login`)

---

## 🆘 Problemas Comunes

### "Invalid login credentials"
- ✅ Verifica que el email sea exacto (case sensitive)
- ✅ Asegúrate de marcar "Auto Confirm User"
- ✅ Espera 10 segundos y vuelve a intentar

### "Email not confirmed"
- ✅ En Supabase: Authentication → Users
- ✅ Click en tu usuario
- ✅ Marca "Email confirmed" manualmente

### No puedo acceder al admin
- ✅ Abre la consola del navegador (F12)
- ✅ Busca errores en rojo
- ✅ Verifica que `.env` tenga las credenciales correctas

---

## 📞 Siguiente Paso

Una vez que puedas iniciar sesión y ver el dashboard admin:

✅ **FASE 2 COMPLETADA**

Siguiente: **FASE 3** - Crear las tablas en la base de datos

---

¿Algún problema? Revisa la consola del navegador o los logs de Supabase.


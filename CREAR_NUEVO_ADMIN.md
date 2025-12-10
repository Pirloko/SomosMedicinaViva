# 👤 Guía Paso a Paso: Crear Nuevo Usuario Administrador

## 🎯 Objetivo
Eliminar el usuario administrador anterior y crear uno nuevo con tus datos.

---

## 📋 PASO 1: Acceder a Supabase Dashboard

1. **Abre tu navegador** y ve a:
   ```
   https://supabase.com/dashboard
   ```

2. **Inicia sesión** con tu cuenta de Supabase
   - Si no tienes cuenta, créala primero

3. **Selecciona tu proyecto**
   - Busca el proyecto **"medicina-viva-bakery"** (o el nombre que le diste)
   - Haz clic en él

---

## 🗑️ PASO 2: Eliminar el Usuario Administrador Anterior

### **2.1 Navegar a la lista de usuarios**

1. En el **menú lateral izquierdo**, busca el icono de 🔐 **Authentication**
2. Haz clic en **Authentication**
3. Luego haz clic en **Users** (o "Usuarios")

### **2.2 Identificar el usuario a eliminar**

1. Verás una **tabla con todos los usuarios** registrados
2. Busca el usuario administrador que quieres eliminar
3. Identifícalo por su **email** (ejemplo: `admin@ejemplo.com`)

### **2.3 Eliminar el usuario**

1. En la fila del usuario, busca los **3 puntos** (⋮) a la derecha
2. Haz clic en los **3 puntos** (⋮)
3. Se abrirá un menú desplegable
4. Selecciona **"Delete user"** o **"Eliminar usuario"**
5. Aparecerá un **mensaje de confirmación**
6. Lee el mensaje cuidadosamente (dice que es permanente)
7. Haz clic en **"Delete"** o **"Eliminar"** para confirmar

**⚠️ IMPORTANTE:**
- Esta acción es **PERMANENTE** y **NO se puede deshacer**
- Todos los datos asociados al usuario se eliminarán
- Asegúrate de que es el usuario correcto antes de eliminar

### **2.4 Verificar eliminación**

1. El usuario debería **desaparecer de la lista**
2. Si aún aparece, **recarga la página** (F5 o Ctrl+R)

---

## ➕ PASO 3: Crear Nuevo Usuario Administrador

### **3.1 Abrir el formulario de creación**

1. En la página de **Users**, busca el botón **"Add user"** o **"Agregar usuario"**
   - Está en la **esquina superior derecha**
   - Puede ser un botón verde o azul

2. Haz clic en **"Add user"**

3. Se abrirá un **menú desplegable** o un **modal**
   - Selecciona **"Create new user"** o **"Crear nuevo usuario"**

### **3.2 Completar el formulario**

Se abrirá un formulario con los siguientes campos:

#### **A) Email**
```
Campo: Email
Ejemplo: admin@medicinaviva.cl
```
- Ingresa el **email** que quieres usar como administrador
- **Recomendación:** Usa un email profesional o corporativo
- Ejemplos:
  - ✅ `admin@medicinaviva.cl`
  - ✅ `administrador@medicinaviva.cl`
  - ❌ `tu-nombre@gmail.com` (mejor evitar emails personales)

#### **B) Password (Contraseña)**
```
Campo: Password
Ejemplo: MedViva2024!#Admin$
```
- Ingresa una **contraseña segura**
- **Requisitos mínimos:**
  - Mínimo 6 caracteres (pero se recomienda 12+)
  - Mezcla de letras mayúsculas y minúsculas
  - Números
  - Símbolos especiales (!, @, #, $, etc.)

- **Ejemplos de contraseñas seguras:**
  ```
  MedViva2024!#Admin$
  AdminMV2024@Seguro
  MedicinaViva2024!#
  ```

- **⚠️ IMPORTANTE:** 
  - **Guarda esta contraseña** en un lugar seguro
  - No la compartas con nadie
  - Puedes usar un gestor de contraseñas (LastPass, 1Password, etc.)

#### **C) Auto Confirm User (Confirmación Automática)**
```
Checkbox: ☑️ Auto Confirm User
```
- **DEBES ACTIVAR ESTA OPCIÓN** ✅
- Haz clic en la casilla para marcarla
- Esto evita tener que confirmar el email manualmente
- **Es muy importante** para que puedas iniciar sesión inmediatamente

### **3.3 Crear el usuario**

1. **Revisa todos los campos:**
   - ✅ Email correcto
   - ✅ Contraseña segura
   - ✅ "Auto Confirm User" activado

2. Haz clic en el botón **"Create user"** o **"Crear usuario"**

3. Espera unos segundos mientras se crea el usuario

4. Verás un **mensaje de éxito** o el usuario aparecerá en la lista

---

## ✅ PASO 4: Verificar que el Usuario se Creó Correctamente

### **4.1 Verificar en la lista**

1. En la página de **Users**, busca tu nuevo usuario
2. Deberías ver:
   - ✅ Tu email en la lista
   - ✅ Estado: **"Confirmed"** o **"Confirmado"**
   - ✅ Fecha de creación: Hoy

### **4.2 Verificar detalles del usuario**

1. Haz clic en tu nuevo usuario
2. Se abrirá un panel con los detalles
3. Verifica:
   - ✅ Email correcto
   - ✅ Email Confirmed: **Sí** o **True**
   - ✅ Created at: Fecha de hoy

---

## 🔐 PASO 5: Probar el Login en tu Aplicación

### **5.1 Abrir la aplicación**

1. **Abre tu terminal** en la carpeta del proyecto
2. Si no está corriendo, ejecuta:
   ```bash
   npm run dev
   ```
3. Espera a que inicie (verás: `Local: http://localhost:8080`)

### **5.2 Ir a la página de login**

1. Abre tu navegador
2. Ve a:
   ```
   http://localhost:8080/login
   ```
   O si estás en producción:
   ```
   https://tu-dominio.com/login
   ```

### **5.3 Iniciar sesión**

1. En el campo **"Email"**, ingresa:
   ```
   El email que usaste al crear el usuario
   Ejemplo: admin@medicinaviva.cl
   ```

2. En el campo **"Contraseña"**, ingresa:
   ```
   La contraseña que configuraste
   Ejemplo: MedViva2024!#Admin$
   ```

3. Haz clic en el botón **"Iniciar Sesión"**

### **5.4 Verificar acceso**

Si todo está correcto:

1. ✅ Serás **redirigido** a `/admin`
2. ✅ Verás el **Panel de Administración**
3. ✅ En la parte superior derecha verás tu **email**
4. ✅ Podrás navegar por todas las secciones del admin

---

## 🆘 Solución de Problemas

### **Problema 1: "Invalid login credentials"**

**Causa:** Email o contraseña incorrectos

**Solución:**
1. Verifica que el email sea **exactamente igual** (mayúsculas/minúsculas importan)
2. Verifica que la contraseña sea correcta (sin espacios al inicio/final)
3. Copia y pega el email desde Supabase para asegurarte
4. Intenta de nuevo después de 10 segundos

---

### **Problema 2: "Email not confirmed"**

**Causa:** El usuario no está confirmado

**Solución:**
1. Ve a Supabase Dashboard → Authentication → Users
2. Busca tu usuario
3. Haz clic en él
4. Busca la opción **"Email Confirmed"** o **"Email confirmado"**
5. Si está en **"No"**, cámbialo a **"Sí"** manualmente
6. Guarda los cambios
7. Intenta iniciar sesión de nuevo

---

### **Problema 3: No puedo eliminar el usuario anterior**

**Causa:** Puede haber restricciones o el usuario está en uso

**Solución:**
1. Asegúrate de estar en el proyecto correcto
2. Verifica que tengas permisos de administrador en Supabase
3. Intenta cerrar todas las sesiones activas primero
4. Si persiste, contacta el soporte de Supabase

---

### **Problema 4: El botón "Add user" no aparece**

**Causa:** Puede ser un problema de permisos o interfaz

**Solución:**
1. Verifica que estés en: Authentication → Users
2. Recarga la página (F5)
3. Intenta desde otro navegador
4. Verifica que tengas permisos de administrador en el proyecto

---

### **Problema 5: No puedo iniciar sesión después de crear el usuario**

**Causa:** Varias posibles causas

**Solución paso a paso:**

1. **Verifica en Supabase:**
   - Authentication → Users
   - ¿El usuario aparece en la lista?
   - ¿Está marcado como "Confirmed"?

2. **Verifica las credenciales:**
   - ¿El email es exactamente igual?
   - ¿La contraseña es correcta?
   - ¿No hay espacios extras?

3. **Limpia la caché del navegador:**
   - Presiona `Ctrl + Shift + R` (Windows/Linux)
   - O `Cmd + Shift + R` (Mac)
   - Esto hace un "hard refresh"

4. **Verifica la consola del navegador:**
   - Presiona `F12` para abrir las herramientas de desarrollador
   - Ve a la pestaña "Console"
   - Busca errores en rojo
   - Comparte el error si aparece

5. **Verifica el archivo .env:**
   - Asegúrate de que tenga las credenciales correctas de Supabase
   - `VITE_SUPABASE_URL` debe ser correcto
   - `VITE_SUPABASE_ANON_KEY` debe ser correcto

---

## 📝 Resumen Rápido

### **Para Eliminar Usuario:**
```
1. Supabase Dashboard → Authentication → Users
2. Click en 3 puntos (⋮) del usuario
3. "Delete user" → Confirmar
```

### **Para Crear Usuario:**
```
1. Supabase Dashboard → Authentication → Users
2. "Add user" → "Create new user"
3. Completar:
   - Email: admin@medicinaviva.cl
   - Password: MedViva2024!#Admin$
   - ☑️ Auto Confirm User
4. "Create user"
```

### **Para Probar:**
```
1. http://localhost:8080/login
2. Ingresar email y contraseña
3. Click "Iniciar Sesión"
4. Deberías ver el panel admin
```

---

## ✅ Checklist Final

Antes de considerar que todo está listo, verifica:

- [ ] Usuario anterior eliminado
- [ ] Nuevo usuario creado en Supabase
- [ ] Email confirmado en Supabase
- [ ] Puedo iniciar sesión en `/login`
- [ ] Veo el panel admin en `/admin`
- [ ] Mi email aparece en el header del admin
- [ ] Puedo navegar por las secciones del admin
- [ ] Puedo cerrar sesión correctamente

---

## 💡 Consejos Adicionales

### **Seguridad:**

1. **Usa contraseñas únicas:**
   - No reutilices contraseñas de otras cuentas
   - Usa un gestor de contraseñas

2. **Habilita 2FA (Autenticación de Dos Factores):**
   - En Supabase: Authentication → Policies → Enable MFA
   - Añade una capa extra de seguridad

3. **Guarda las credenciales de forma segura:**
   - No las compartas por email o chat
   - Usa un gestor de contraseñas encriptado

### **Múltiples Administradores:**

Si quieres tener varios usuarios administradores:

1. Repite el proceso de creación para cada usuario
2. Todos tendrán acceso al panel admin
3. Puedes diferenciarlos por email

---

## 🎉 ¡Listo!

Si completaste todos los pasos y puedes iniciar sesión:

✅ **¡Felicidades!** Tienes un nuevo usuario administrador configurado.

Ahora puedes:
- Gestionar productos
- Ver mensajes de contacto
- Registrar ventas
- Y mucho más desde el panel admin

---

## 📞 ¿Necesitas Ayuda?

Si tienes algún problema:

1. Revisa la sección "Solución de Problemas" arriba
2. Verifica la consola del navegador (F12)
3. Revisa los logs de Supabase Dashboard
4. Avísame y te ayudo a resolverlo

---

**¡Éxito con tu nuevo usuario administrador!** 🚀


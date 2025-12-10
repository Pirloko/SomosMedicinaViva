# 🌐 GUÍA: CONECTAR DOMINIO somosmedicinaviva.cl A NETLIFY

Guía completa paso a paso para conectar tu dominio adquirido en nic.cl a tu sitio desplegado en Netlify.

---

## 📋 REQUISITOS PREVIOS

✅ Dominio `somosmedicinaviva.cl` adquirido en nic.cl  
✅ Sitio desplegado en Netlify  
✅ Acceso al panel de administración de nic.cl  
✅ Acceso al dashboard de Netlify  

---

## 🎯 PASO 1: AGREGAR DOMINIO EN NETLIFY

### 1.1. Ir al Dashboard de Netlify

```
1. Abre tu navegador
2. Ve a: https://app.netlify.com/
3. Inicia sesión con tu cuenta
4. Selecciona tu sitio (medicina-viva o el nombre que tenga)
```

### 1.2. Ir a Domain Settings

```
1. En el menú lateral izquierdo, click en "Domain settings"
   (O ve a: Site settings → Domain management)
```

### 1.3. Agregar Dominio Personalizado

```
1. Click en el botón "Add custom domain"
2. Escribe tu dominio: somosmedicinaviva.cl
3. Click en "Verify"
```

### 1.4. Netlify te mostrará las opciones de configuración

Netlify te dará dos opciones:

**Opción A: Configuración con DNS (Recomendada)**
- Netlify te dará registros DNS específicos
- Debes agregarlos en nic.cl

**Opción B: Configuración con Nameservers**
- Netlify te dará nameservers
- Debes cambiar los nameservers en nic.cl

**Recomendamos la Opción A (DNS)** porque es más flexible.

---

## 🔧 PASO 2: CONFIGURAR DNS EN NIC.CL

### 2.1. Acceder al Panel de nic.cl

```
1. Ve a: https://www.nic.cl/
2. Click en "Acceso Clientes" o "Mi Cuenta"
3. Inicia sesión con tus credenciales
```

### 2.2. Ir a la Administración del Dominio

```
1. Busca tu dominio: somosmedicinaviva.cl
2. Click en "Administrar" o "Gestionar DNS"
3. Ve a la sección "DNS" o "Zona DNS"
```

### 2.3. Obtener los Registros DNS de Netlify

En Netlify, después de agregar el dominio, verás algo como:

```
Para apuntar tu dominio a Netlify, agrega estos registros:

Tipo: A
Nombre: @
Valor: 75.2.60.5

Tipo: A
Nombre: @
Valor: 99.83.190.102

Tipo: AAAA
Nombre: @
Valor: 2606:4700:10::ac43:90ae

Tipo: AAAA
Nombre: @
Valor: 2606:4700:10::6814:8c66
```

**⚠️ IMPORTANTE:** Los valores exactos pueden variar. Netlify te los mostrará específicamente para tu cuenta.

### 2.4. Agregar Registros DNS en nic.cl

En el panel de nic.cl, necesitas agregar estos registros:

#### a) Registros A (IPv4)

```
1. Click en "Agregar registro" o "Añadir"
2. Tipo: A
3. Nombre/Host: @ (o deja vacío, o pon "somosmedicinaviva.cl")
4. Valor/IP: [Primera IP que Netlify te dio]
   Ejemplo: 75.2.60.5
5. TTL: 3600 (o el valor por defecto)
6. Guardar

Repite para la segunda IP A:
1. Tipo: A
2. Nombre: @
3. Valor: [Segunda IP que Netlify te dio]
   Ejemplo: 99.83.190.102
4. Guardar
```

#### b) Registros AAAA (IPv6) - Opcional pero recomendado

```
1. Tipo: AAAA
2. Nombre: @
3. Valor: [Primera IPv6 que Netlify te dio]
   Ejemplo: 2606:4700:10::ac43:90ae
4. Guardar

Repite para la segunda IPv6:
1. Tipo: AAAA
2. Nombre: @
3. Valor: [Segunda IPv6 que Netlify te dio]
4. Guardar
```

#### c) Registro CNAME para www (Opcional pero recomendado)

Si quieres que `www.somosmedicinaviva.cl` también funcione:

```
1. En Netlify, después de agregar el dominio principal,
   click en "Add domain alias"
2. Escribe: www.somosmedicinaviva.cl
3. Netlify te dará un registro CNAME

En nic.cl:
1. Tipo: CNAME
2. Nombre: www
3. Valor: [El valor que Netlify te dio]
   Ejemplo: somosmedicinaviva.cl o algo como [tu-sitio].netlify.app
4. Guardar
```

---

## ⏳ PASO 3: ESPERAR PROPAGACIÓN DNS

### 3.1. Tiempo de Propagación

```
⏱️ Tiempo estimado: 1-48 horas
⏱️ Típicamente: 2-6 horas
⏱️ A veces: 15-30 minutos
```

### 3.2. Verificar Estado en Netlify

```
1. En Netlify → Domain settings
2. Verás el estado del dominio:
   🟡 "Pending verification" = Esperando verificación
   🟢 "Verified" = Verificado y funcionando
```

### 3.3. Verificar Propagación DNS (Opcional)

Puedes verificar si los DNS ya se propagaron:

**Opción 1: Herramienta online**
```
1. Ve a: https://dnschecker.org/
2. Escribe: somosmedicinaviva.cl
3. Selecciona tipo: A
4. Click en "Search"
5. Verás si los DNS se propagaron en diferentes países
```

**Opción 2: Desde terminal (Mac/Linux)**
```bash
dig somosmedicinaviva.cl A
# O
nslookup somosmedicinaviva.cl
```

**Opción 3: Desde terminal (Windows)**
```cmd
nslookup somosmedicinaviva.cl
```

---

## 🔒 PASO 4: CERTIFICADO SSL (AUTOMÁTICO)

### 4.1. Netlify lo hace automáticamente

```
✅ Netlify detecta automáticamente cuando el dominio está verificado
✅ Genera un certificado SSL gratuito (Let's Encrypt)
✅ Configura HTTPS automáticamente
✅ Renovación automática
```

### 4.2. Verificar SSL

Una vez que el dominio esté verificado:

```
1. Netlify → Domain settings
2. Verás: "SSL certificate: Active"
3. Tu sitio estará disponible en:
   ✅ https://somosmedicinaviva.cl
   ✅ https://www.somosmedicinaviva.cl (si configuraste www)
```

---

## 🎯 PASO 5: CONFIGURAR REDIRECCIONES (OPCIONAL)

### 5.1. Redireccionar www a no-www (o viceversa)

En Netlify → Domain settings:

```
1. Ve a "Domain settings"
2. Busca "HTTPS" o "SSL"
3. Configura:
   - Redirect www to apex (www → somosmedicinaviva.cl)
   - O Redirect apex to www (somosmedicinaviva.cl → www)
```

### 5.2. Forzar HTTPS

Netlify ya lo hace automáticamente, pero puedes verificar:

```
1. Domain settings → HTTPS
2. Asegúrate que "Force HTTPS" esté activado
```

---

## ✅ PASO 6: VERIFICAR QUE TODO FUNCIONA

### 6.1. Probar el Dominio

```
1. Abre tu navegador
2. Ve a: https://somosmedicinaviva.cl
3. Deberías ver tu sitio funcionando
4. Verifica que el candado 🔒 aparezca (HTTPS activo)
```

### 6.2. Probar www (si lo configuraste)

```
1. Ve a: https://www.somosmedicinaviva.cl
2. Debería redirigir o cargar correctamente
```

### 6.3. Verificar en Netlify

```
1. Netlify → Domain settings
2. Estado debería ser: "Verified" ✅
3. SSL debería estar: "Active" ✅
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema 1: "Domain verification failed"

**Causa:** Los DNS no están configurados correctamente o no se han propagado.

**Solución:**
```
1. Verifica en nic.cl que los registros A estén correctos
2. Verifica que los valores IP sean exactamente los que Netlify te dio
3. Espera más tiempo (hasta 48 horas)
4. Usa dnschecker.org para ver si los DNS se propagaron
5. En Netlify, click en "Retry verification"
```

### Problema 2: "SSL certificate pending"

**Causa:** El dominio aún no está completamente verificado.

**Solución:**
```
1. Espera a que el dominio esté "Verified" en Netlify
2. Una vez verificado, el SSL se generará automáticamente
3. Puede tardar hasta 24 horas después de la verificación
```

### Problema 3: "Site not loading"

**Causa:** Los DNS no se propagaron o hay error en la configuración.

**Solución:**
```
1. Verifica que los registros A en nic.cl sean correctos
2. Verifica que no haya registros conflictivos (otros A records)
3. Espera más tiempo para la propagación
4. Limpia la caché de DNS en tu computadora:
   - Mac: sudo dscacheutil -flushcache
   - Windows: ipconfig /flushdns
   - Linux: sudo systemd-resolve --flush-caches
```

### Problema 4: "www no funciona"

**Causa:** No configuraste el CNAME para www.

**Solución:**
```
1. En Netlify, agrega "www.somosmedicinaviva.cl" como domain alias
2. En nic.cl, agrega el registro CNAME que Netlify te indique
3. Espera propagación
```

### Problema 5: "Error en nic.cl al agregar registros"

**Causa:** Formato incorrecto o límites del panel.

**Solución:**
```
1. Verifica el formato exacto:
   - Tipo: A (no "A Record", solo "A")
   - Nombre: @ o vacío (no "somosmedicinaviva.cl")
   - Valor: Solo la IP (ej: 75.2.60.5)
2. Si nic.cl tiene límites de registros, elimina registros antiguos no usados
3. Contacta soporte de nic.cl si persiste el problema
```

---

## 📝 RESUMEN DE REGISTROS DNS NECESARIOS

### En nic.cl debes tener:

```
Tipo: A
Nombre: @
Valor: [IP1 de Netlify]
TTL: 3600

Tipo: A
Nombre: @
Valor: [IP2 de Netlify]
TTL: 3600

Tipo: AAAA (opcional)
Nombre: @
Valor: [IPv6-1 de Netlify]
TTL: 3600

Tipo: AAAA (opcional)
Nombre: @
Valor: [IPv6-2 de Netlify]
TTL: 3600

Tipo: CNAME (opcional, para www)
Nombre: www
Valor: [Valor que Netlify te indique]
TTL: 3600
```

---

## 🎉 RESULTADO FINAL

Una vez completado, tu sitio estará disponible en:

```
🌐 https://somosmedicinaviva.cl
🌐 https://www.somosmedicinaviva.cl (si configuraste www)

Con:
✅ SSL/HTTPS automático y gratuito
✅ Renovación automática del certificado
✅ CDN global de Netlify
✅ Despliegues automáticos desde GitHub
✅ Todo funcionando correctamente
```

---

## 📞 AYUDA ADICIONAL

### Si necesitas ayuda:

1. **Netlify Support:**
   - Dashboard → Help → Contact support
   - O: https://www.netlify.com/support/

2. **nic.cl Support:**
   - Contacta soporte desde tu panel de cliente
   - O: https://www.nic.cl/

3. **Verificar DNS:**
   - https://dnschecker.org/
   - https://www.whatsmydns.net/

---

## ✅ CHECKLIST COMPLETO

```
[ ] Acceder a Netlify Dashboard
[ ] Ir a Domain settings
[ ] Agregar dominio: somosmedicinaviva.cl
[ ] Copiar los registros DNS que Netlify proporciona
[ ] Acceder a panel de nic.cl
[ ] Ir a administración DNS del dominio
[ ] Agregar registro A (primera IP)
[ ] Agregar registro A (segunda IP)
[ ] Agregar registros AAAA (opcional)
[ ] Agregar CNAME para www (opcional)
[ ] Esperar propagación DNS (1-48 horas)
[ ] Verificar en Netlify que dominio esté "Verified"
[ ] Verificar que SSL esté "Active"
[ ] Probar https://somosmedicinaviva.cl
[ ] ✅ ¡Dominio funcionando!
```

---

**¡Sigue estos pasos y tu dominio estará conectado en unas horas!** 🚀🌐

**Nota:** La propagación DNS puede tardar hasta 48 horas, pero típicamente funciona en 2-6 horas.


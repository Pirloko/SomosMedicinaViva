# 🧪 GUÍA PARA PROBAR LOADING STATES
## Dashboard Admin - `/admin`

---

## 🚀 CÓMO PROBAR LOS LOADING STATES

### 1. Iniciar el Servidor de Desarrollo

El servidor ya debería estar corriendo. Si no, ejecuta:

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:8080`

---

## 📋 PRUEBAS A REALIZAR

### Prueba 1: Ver Loading States en Acción

**Pasos:**
1. Abre `http://localhost:8080/admin` en tu navegador
2. Inicia sesión con tus credenciales de admin
3. Observa las cards de alertas mientras cargan

**Qué deberías ver:**
- ✅ **Skeletons animados** (efecto pulse) mientras cargan los datos
- ✅ Las cards aparecen con placeholders grises animados
- ✅ Después de 1-2 segundos, los datos reales reemplazan los skeletons

---

### Prueba 2: Simular Carga Lenta (Opcional)

Para ver mejor los loading states, puedes simular una carga lenta:

**Opción A: Usar DevTools Network Throttling**
1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Cambia la velocidad a **Slow 3G** o **Fast 3G**
4. Recarga la página
5. Observa los skeletons por más tiempo

**Opción B: Agregar delay temporal en el código**
```typescript
// En los hooks, agregar un delay (solo para testing)
await new Promise(resolve => setTimeout(resolve, 2000))
```

---

### Prueba 3: Probar Estados de Error

**Para simular un error:**

1. **Opción A: Desconectar internet temporalmente**
   - Desconecta tu WiFi
   - Recarga la página `/admin`
   - Deberías ver las cards de error con el botón "Reintentar"

2. **Opción B: Modificar temporalmente las queries**
   ```typescript
   // En useIngredientesCriticos, cambiar temporalmente:
   .from('ingredientes_falsa') // Tabla que no existe
   ```

3. **Opción C: Usar DevTools**
   - Abre DevTools → Network
   - Haz clic derecho en una petición
   - Selecciona "Block request URL"
   - Recarga la página

**Qué deberías ver:**
- ✅ Cards de error con icono de alerta
- ✅ Mensaje de error descriptivo
- ✅ Botón "Reintentar" para volver a intentar

---

### Prueba 4: Probar Fallbacks de Imágenes

**Pasos:**
1. Ve a `/admin`
2. Si hay ingredientes/productos con imágenes, observa:
   - Si la imagen carga correctamente → se muestra
   - Si la imagen falla → se muestra placeholder con icono

**Para forzar error de imagen:**
- Modifica temporalmente una URL de imagen en la BD a una inválida
- O usa DevTools para bloquear la carga de imágenes

**Qué deberías ver:**
- ✅ Si imagen falla: icono de hoja (Leaf) o paquete (Package) en lugar de imagen rota
- ✅ No hay imágenes rotas en la consola

---

### Prueba 5: Probar Manejo de Fechas

**Pasos:**
1. Observa las fechas en los mensajes de contacto
2. Deberían mostrarse en formato: "02 ene" (día y mes abreviado)

**Para probar fecha inválida:**
- Temporalmente modifica `created_at` a `null` en la BD
- Debería mostrar "Fecha no disponible" en lugar de error

---

## 🎯 CHECKLIST DE VERIFICACIÓN

### Loading States
- [ ] Skeletons aparecen mientras cargan los datos
- [ ] Skeletons tienen animación pulse
- [ ] Skeletons desaparecen cuando los datos cargan
- [ ] No hay "flash" de contenido vacío

### Error States
- [ ] Cards de error aparecen cuando hay error
- [ ] Mensaje de error es claro y descriptivo
- [ ] Botón "Reintentar" funciona
- [ ] Colores de error son consistentes (azul, naranja, rojo)

### Fallbacks
- [ ] Imágenes rotas muestran placeholder
- [ ] Fechas inválidas muestran mensaje seguro
- [ ] Mensajes vacíos muestran "Sin mensaje"

### Performance
- [ ] No hay re-renders innecesarios
- [ ] Las queries se ejecutan en paralelo
- [ ] La página carga rápidamente

---

## 🔍 QUÉ OBSERVAR EN LA CONSOLA

### Mensajes Esperados:
- ✅ `✅ Conexión con Supabase exitosa` (debería aparecer)
- ⚠️ Warnings de React Router (normales, no críticos)

### Errores que NO deberían aparecer:
- ❌ `Cannot read property 'filter' of undefined`
- ❌ `Cannot read property 'length' of undefined`
- ❌ Errores de imágenes rotas

---

## 🐛 SI ALGO NO FUNCIONA

### Problema: No veo los skeletons
**Solución:**
- Los datos pueden cargar muy rápido
- Usa Network Throttling en DevTools
- Verifica que los hooks retornen `isLoading: true` inicialmente

### Problema: Veo errores en la consola
**Solución:**
- Verifica que Supabase esté configurado correctamente
- Revisa las variables de entorno
- Verifica la conexión a internet

### Problema: Las imágenes no muestran fallback
**Solución:**
- Verifica que `/placeholder.svg` exista en `public/`
- Revisa la función `handleImageError`

---

## 📊 COMPORTAMIENTO ESPERADO

### Flujo Normal:
```
1. Usuario navega a /admin
   ↓
2. Componente se monta
   ↓
3. Hooks inician queries (isLoading: true)
   ↓
4. Skeletons se muestran
   ↓
5. Datos llegan de Supabase
   ↓
6. Skeletons desaparecen
   ↓
7. Contenido real se muestra
```

### Flujo con Error:
```
1. Usuario navega a /admin
   ↓
2. Componente se monta
   ↓
3. Hooks inician queries
   ↓
4. Skeletons se muestran
   ↓
5. Query falla (error: true)
   ↓
6. Skeletons desaparecen
   ↓
7. ErrorCard se muestra con botón "Reintentar"
```

---

## ✅ RESULTADO ESPERADO

Después de todas las pruebas, deberías tener:

1. ✅ **Mejor UX:** Los usuarios ven que algo está cargando
2. ✅ **Manejo de errores:** Errores se muestran claramente
3. ✅ **Sin errores en consola:** Todo funciona sin crashes
4. ✅ **Fallbacks funcionando:** Imágenes y fechas manejadas correctamente

---

## 🎓 PRÓXIMOS PASOS

Una vez que verifiques que los loading states funcionan:

1. **Optimizar queries** (siguiente mejora)
2. **Memoizar cálculos** con `useMemo`
3. **Separar en componentes** más pequeños

---

**¡Listo para probar!** 🚀

Abre `http://localhost:8080/admin` y observa los loading states en acción.

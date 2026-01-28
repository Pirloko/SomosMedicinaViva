# COTIZACIÓN DE DESARROLLO
## Sistema Web Integral - SOMOS MEDICINA VIVA

---

**Fecha:** [FECHA ACTUAL]  
**Cotización N°:** COT-2024-001  
**Vigencia:** 30 días  
**Cliente:** SOMOS MEDICINA VIVA  
**Desarrollador:** [TU NOMBRE COMPLETO]  
**Título:** Analista Programador  
**Ubicación:** Rancagua, Región de O'Higgins, Chile  
**Email:** [TU EMAIL]  
**Teléfono:** [TU TELÉFONO]  

---

## 1. RESUMEN EJECUTIVO

Se presenta la cotización para el desarrollo completo de un **Sistema Web Integral de Gestión** para la pastelería saludable "SOMOS MEDICINA VIVA", que incluye sitio web público responsive y panel administrativo completo con 13 módulos de gestión.

**Objetivo del Proyecto:**  
Digitalizar y automatizar la gestión operativa y comercial de la pastelería, incluyendo control de inventario, análisis financiero, gestión de ventas y presencia web profesional.

---

## 2. ALCANCE DEL PROYECTO

### 2.1. SITIO WEB PÚBLICO

Sitio web corporativo responsive con las siguientes secciones:

#### 2.1.1. Página Principal
- ✅ **Carrusel Hero** con efecto 3D giratorio (cambio automático cada 2 segundos)
- ✅ **Catálogo de Productos** dinámico con filtros por categoría
- ✅ **Modal de Detalle** de producto con información completa
- ✅ **Sección "Apto Para"** con beneficios destacados
- ✅ **Ingredientes Destacados** con información nutricional
- ✅ **Puntos de Venta** con integración de Google Maps y horarios
- ✅ **Zonas de Delivery** con información de cobertura
- ✅ **Formulario de Contacto** con integración a WhatsApp
- ✅ **Sección "Nosotros"** con contenido editable
- ✅ **Diseño 100% Responsive** (iPhone, Android, iPad, Desktop)

#### 2.1.2. Características Técnicas del Sitio
- Optimización SEO básica
- Carga rápida y optimizada
- Compatibilidad cross-browser
- Accesibilidad (WCAG 2.1 nivel AA)
- Animaciones y transiciones suaves

---

### 2.2. PANEL ADMINISTRATIVO

Sistema de gestión completo con **13 módulos administrativos**:

#### 2.2.1. Módulo de Productos
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Upload de imágenes (JPG, PNG, WEBP)
- Gestión de categorías dinámicas
- Sistema de tags personalizables
- Control de stock con alertas automáticas
- Activar/Desactivar productos
- Soft delete y hard delete
- Búsqueda y filtrado avanzado

#### 2.2.2. Módulo de Ingredientes
- CRUD completo de ingredientes
- Upload de imágenes
- Unidades de medida configurables (kg, litros, unidades, gramos)
- Control de stock actual y mínimo
- Sistema de compras integrado
- **Cálculo automático de costo promedio ponderado**
- Alertas de stock bajo
- Valor total del inventario

#### 2.2.3. Módulo de Producción
- Selección manual de producto a producir
- Agregar ingredientes uno por uno
- Definir cantidades exactas utilizadas
- **Cálculo automático de costo unitario del producto**
- Descuento automático de ingredientes del stock
- Aumento automático de stock de productos
- Preview de todos los cambios antes de confirmar
- Validación de stock disponible

#### 2.2.4. Módulo de Compras de Ingredientes
- Registro de compras con costo específico
- Información de proveedor y número de factura
- Fecha de compra
- **Cálculo automático de costo promedio ponderado**
- Historial completo de compras
- Preparado para exportar a Excel
- Análisis de compras por ingrediente

#### 2.2.5. Módulo de Ventas
- Registro de ventas con descuento automático de stock
- Información de cliente y zona de entrega
- Cálculo automático de totales
- Métodos de pago configurables
- Historial completo de ventas
- Búsqueda y filtrado por fecha, cliente, producto

#### 2.2.6. Módulo de Costos y Ganancias
- Costo por producto calculado automáticamente en producción
- Ganancia unitaria y total por producto
- Margen de ganancia porcentual
- Análisis de rentabilidad por producto
- Ganancias basadas en costos reales
- Reportes de rentabilidad

#### 2.2.7. Módulo de KPIs y Métricas
- Dashboard con métricas clave en tiempo real
- Total de ventas
- Ingresos totales
- Productos más vendidos
- Análisis temporal (diario, semanal, mensual)
- Gráficos interactivos con Recharts

#### 2.2.8. Módulo de Categorías
- CRUD de categorías
- Slug automático
- Ordenamiento configurable
- Activar/Desactivar categorías
- Gestión de categorías dinámicas

#### 2.2.9. Módulo de Carrusel Hero
- Upload de imágenes del inicio
- Cambio automático configurable (2 segundos)
- Efecto giratorio 3D al cargar
- Título y subtítulo opcionales por imagen
- Ordenamiento de imágenes

#### 2.2.10. Módulo "Nosotros"
- Editor de contenido "Quiénes Somos"
- Upload de imagen principal
- 3 párrafos editables
- Valores/etiquetas personalizables (Con Amor, Natural, Calidad)

#### 2.2.11. Módulo de Puntos de Venta
- CRUD completo de puntos de venta
- Upload de imágenes
- Integración con Google Maps
- Horarios configurables (semana, sábado, domingo)
- Ordenamiento personalizable

#### 2.2.12. Módulo de Zonas Delivery
- CRUD completo de zonas de delivery
- Gestión de cobertura geográfica
- Información de costos y tiempos
- Activar/Desactivar zonas

#### 2.2.13. Módulo de Contactos
- Mensajes recibidos del formulario de contacto
- Marcar como leído/no leído
- Información de contacto del cliente
- Historial de mensajes

---

### 2.3. SISTEMA DE BASE DE DATOS

#### 2.3.1. Arquitectura de Base de Datos
- **11+ tablas principales** con relaciones optimizadas
- **Funciones SQL personalizadas** para lógica de negocio:
  - `registrar_produccion_manual()` - Producción con ingredientes manuales
  - `registrar_compra_ingrediente()` - Compras con costo promedio ponderado
  - `descontar_stock_venta()` - Descuento automático en ventas
- **Vistas optimizadas** para consultas complejas
- **Triggers automáticos** para actualizaciones de timestamps
- **Índices optimizados** para consultas rápidas

#### 2.3.2. Seguridad
- **Row Level Security (RLS)** en todas las tablas
- Autenticación segura con Supabase Auth
- Rutas protegidas en el panel administrativo
- Variables de entorno para credenciales
- Validación de datos en frontend y backend

---

## 3. TECNOLOGÍAS UTILIZADAS

### 3.1. Frontend
- **React 18.3.1** - Librería de interfaz de usuario
- **TypeScript 5.8.3** - Tipado estático (100% del código)
- **Vite 5.4.19** - Build tool y bundler
- **React Router DOM 6.30.1** - Enrutamiento
- **Tailwind CSS 3.4.17** - Framework de estilos
- **shadcn/ui** - Sistema de componentes UI (48 componentes)
- **TanStack Query 5.83.0** - Gestión de estado del servidor
- **React Hook Form 7.61.1** - Manejo de formularios
- **Zod 3.25.76** - Validación de esquemas
- **Recharts 2.15.4** - Gráficos y visualizaciones
- **Lucide React 0.462.0** - Iconografía
- **Embla Carousel 8.6.0** - Carruseles

### 3.2. Backend y Base de Datos
- **Supabase 2.86.0** - Backend as a Service
  - PostgreSQL Database
  - Authentication (Email/Password)
  - Storage (Almacenamiento de imágenes)
  - Row Level Security (RLS)
  - Real-time subscriptions
- **Funciones SQL personalizadas**
- **Triggers automáticos**
- **Vistas optimizadas**

### 3.3. Herramientas de Desarrollo
- **ESLint 9.32.0** - Linter de código
- **TypeScript ESLint 8.38.0** - Linter para TypeScript
- **PostCSS 8.5.6** - Procesador de CSS
- **Vite Plugin React SWC** - Compilador rápido

---

## 4. ENTREGABLES

### 4.1. Código Fuente
- ✅ Código fuente completo del proyecto
- ✅ Estructura de carpetas organizada y documentada
- ✅ Comentarios en código crítico
- ✅ Configuración de build para producción

### 4.2. Base de Datos
- ✅ Scripts SQL completos (10+ archivos)
  - `schema.sql` - Esquema completo de base de datos
  - `security.sql` - Políticas de seguridad (RLS)
  - `seed.sql` - Datos iniciales
  - Scripts adicionales para funcionalidades específicas
- ✅ Documentación de estructura de base de datos
- ✅ Guía de migración

### 4.3. Documentación
- ✅ **18+ guías markdown** detalladas:
  - Configuración inicial de Supabase
  - Configuración de Storage
  - Creación de usuario administrador
  - Sistema de inventario completo
  - Sistema de costos automático
  - Gestión de compras
  - Sistema de alertas
  - Producción manual
  - Análisis de costos y ganancias
  - Sistema de carrusel
  - Auditoría de responsividad
  - Guía de producción
  - Preparación para exportación Excel
  - Y más...
- ✅ README.md principal con información completa
- ✅ Comentarios en código

### 4.4. Configuración y Deploy
- ✅ Configuración de variables de entorno
- ✅ Configuración para Netlify (netlify.toml)
- ✅ Build optimizado para producción
- ✅ Instrucciones de deploy

### 4.5. Capacitación
- ✅ Sesión de capacitación para uso del sistema (2 horas)
- ✅ Documentación de usuario
- ✅ Video tutoriales (opcional, según acuerdo)

---

## 5. MÉTRICAS DEL PROYECTO

### 5.1. Volumen de Desarrollo
- **Archivos creados:** ~70+ archivos
- **Líneas de código:** ~8,000+ líneas
- **Componentes React:** ~65 componentes
- **Custom Hooks:** 16 hooks personalizados
- **Páginas:** 20 páginas
- **Rutas:** 15+ rutas
- **Tablas de base de datos:** 11+ tablas
- **Funciones SQL:** 3+ funciones personalizadas
- **Vistas SQL:** 3+ vistas optimizadas

### 5.2. Funcionalidades
- **Módulos administrativos:** 13 módulos completos
- **Sistemas implementados:** 8+ sistemas complejos
- **Integraciones:** Google Maps, WhatsApp, Supabase Storage

---

## 6. TIEMPO ESTIMADO DE DESARROLLO

### 6.1. Desglose por Fases

| Fase | Descripción | Horas Estimadas |
|------|-------------|-----------------|
| **Fase 1** | Setup y configuración inicial | 8 horas |
| **Fase 2** | Sistema de autenticación y seguridad | 12 horas |
| **Fase 3** | Diseño y desarrollo de base de datos | 16 horas |
| **Fase 4** | Desarrollo del sitio web público | 24 horas |
| **Fase 5** | Desarrollo de módulos administrativos (13 módulos) | 80 horas |
| **Fase 6** | Sistema de inventario bidireccional | 16 horas |
| **Fase 7** | Sistema de costos y ganancias | 12 horas |
| **Fase 8** | Sistema de compras y producción | 16 horas |
| **Fase 9** | Sistema de KPIs y métricas | 12 horas |
| **Fase 10** | Testing y corrección de bugs | 16 horas |
| **Fase 11** | Documentación completa | 12 horas |
| **Fase 12** | Deploy y configuración final | 8 horas |
| **TOTAL** | | **232 horas** |

### 6.2. Tiempo Total
- **Horas totales:** 232 horas
- **Tiempo estimado:** 6-8 semanas (trabajando tiempo parcial)
- **Tiempo estimado:** 4-5 semanas (trabajando tiempo completo)

---

## 7. VALORIZACIÓN

### 7.1. Estructura de Costos

**NOTA:** Los valores deben ser completados según tu tarifa y experiencia. A continuación se presenta una estructura sugerida.

#### Opción A: Valor por Hora
- **Tarifa por hora:** $[VALOR] CLP
- **Total de horas:** 232 horas
- **Subtotal:** $[VALOR] CLP
- **IVA (19%):** $[VALOR] CLP
- **TOTAL:** $[VALOR] CLP

#### Opción B: Valor Fijo por Proyecto
- **Desarrollo completo:** $[VALOR] CLP
- **IVA (19%):** $[VALOR] CLP
- **TOTAL:** $[VALOR] CLP

#### Opción C: Pago por Módulos
- **Sitio Web Público:** $[VALOR] CLP
- **Panel Administrativo Base:** $[VALOR] CLP
- **Módulos Adicionales (11 módulos):** $[VALOR] CLP c/u
- **Sistemas Especializados (Inventario, Costos, etc.):** $[VALOR] CLP c/u
- **Documentación y Deploy:** $[VALOR] CLP
- **Subtotal:** $[VALOR] CLP
- **IVA (19%):** $[VALOR] CLP
- **TOTAL:** $[VALOR] CLP

### 7.2. Forma de Pago Sugerida
- **30%** al inicio del proyecto
- **40%** al completar el 60% del desarrollo
- **30%** al entregar el proyecto final

---

## 8. SERVICIOS ADICIONALES (OPCIONALES)

### 8.1. Mantenimiento y Soporte
- **Mantenimiento mensual:** $[VALOR] CLP/mes
  - Actualizaciones de seguridad
  - Corrección de bugs menores
  - Soporte técnico (5 horas/mes)
  - Actualizaciones de dependencias

### 8.2. Nuevas Funcionalidades
- **Desarrollo de nuevas funcionalidades:** $[VALOR] CLP/hora
- **Tiempo mínimo:** 2 horas por solicitud

### 8.3. Capacitación Adicional
- **Sesiones de capacitación adicionales:** $[VALOR] CLP/hora
- **Documentación personalizada:** $[VALOR] CLP

---

## 9. GARANTÍAS Y SOPORTE

### 9.1. Garantía de Funcionamiento
- **Período de garantía:** 3 meses desde la entrega
- **Cobertura:** Corrección de bugs y errores de funcionamiento
- **No cubre:** Modificaciones de funcionalidades, cambios de diseño, nuevas características

### 9.2. Soporte Post-Entrega
- **Soporte básico:** 1 mes incluido (solo corrección de bugs)
- **Soporte extendido:** Según contrato de mantenimiento

---

## 10. TÉRMINOS Y CONDICIONES

### 10.1. Propiedad Intelectual
- El código fuente será entregado al cliente al finalizar el proyecto
- El desarrollador se reserva el derecho de usar el proyecto como portafolio
- El cliente tiene derecho a modificar y mantener el código

### 10.2. Cambios y Modificaciones
- Los cambios solicitados durante el desarrollo pueden afectar el tiempo y costo
- Cambios mayores requieren nueva cotización
- Cambios menores (hasta 2 horas) se incluyen sin costo adicional

### 10.3. Plazos
- Los plazos son estimativos y pueden variar según la complejidad
- Retrasos por parte del cliente (falta de información, aprobaciones, etc.) no son responsabilidad del desarrollador
- Se notificará con anticipación cualquier retraso

### 10.4. Hosting y Servicios Externos
- El cliente es responsable de:
  - Contratar y mantener cuenta de Supabase
  - Contratar dominio y hosting (si aplica)
  - Configurar servicios de terceros (Google Maps API, etc.)
- El desarrollador proporcionará guías de configuración

### 10.5. Aceptación del Proyecto
- El cliente tendrá 7 días para revisar y reportar problemas
- Después de este período, se considerará aceptado
- Los cambios solicitados después de la aceptación se cotizarán por separado

---

## 11. INFORMACIÓN DEL DESARROLLADOR

**Nombre:** [TU NOMBRE COMPLETO]  
**Título Profesional:** Analista Programador  
**Estudios Actuales:** Ingeniería (en curso)  
**Ubicación:** Rancagua, Región de O'Higgins, Chile  
**Email:** [TU EMAIL]  
**Teléfono:** [TU TELÉFONO]  
**LinkedIn:** [TU LINKEDIN] (opcional)  
**Portafolio:** [TU PORTAFOLIO] (opcional)  

### 11.1. Experiencia y Competencias
- ✅ Desarrollo Full Stack con React y TypeScript
- ✅ Gestión de bases de datos PostgreSQL
- ✅ Integración con servicios cloud (Supabase)
- ✅ Desarrollo de interfaces responsive
- ✅ Implementación de sistemas de autenticación
- ✅ Desarrollo de paneles administrativos
- ✅ Optimización y performance
- ✅ Documentación técnica

---

## 12. PRÓXIMOS PASOS

1. **Revisión de la cotización** por parte del cliente
2. **Aclaración de dudas** y ajustes si es necesario
3. **Aprobación** de la cotización
4. **Firma de acuerdo** o contrato (si aplica)
5. **Pago inicial** (30% según forma de pago acordada)
6. **Inicio del desarrollo**

---

## 13. CONTACTO

Para consultas, aclaraciones o aprobación de esta cotización, favor contactar:

**Email:** [TU EMAIL]  
**Teléfono:** [TU TELÉFONO]  
**Horario de atención:** [TU HORARIO]  

---

## ANEXOS

### Anexo A: Estructura Técnica Detallada
- Arquitectura del sistema
- Diagrama de base de datos
- Flujo de datos

### Anexo B: Capturas de Pantalla
- Interfaz del sitio web público
- Panel administrativo
- Módulos principales

### Anexo C: Documentación Técnica
- Guías de instalación
- Manual de usuario
- Documentación de API

---

**Esta cotización tiene una vigencia de 30 días desde su emisión.**

---

*Documento generado el [FECHA] para SOMOS MEDICINA VIVA*  
*Desarrollado con profesionalismo y dedicación*

---

**Firma del Desarrollador:**

_________________________  
[TU NOMBRE COMPLETO]  
Analista Programador  
Rancagua, Chile


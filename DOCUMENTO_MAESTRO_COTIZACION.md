# 📋 DOCUMENTO MAESTRO PARA COTIZACIÓN
## Sistema Web Integral - SOMOS MEDICINA VIVA

**Proyecto:** Sistema de Gestión para Pastelería Saludable  
**Cliente:** SOMOS MEDICINA VIVA  
**Versión:** 1.0.0  
**Estado:** Producción  
**Fecha de Documento:** [FECHA ACTUAL]  

---

# 📊 ÍNDICE

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Descripción del Proyecto](#2-descripción-del-proyecto)
3. [Tecnologías Utilizadas](#3-tecnologías-utilizadas)
4. [Arquitectura del Sistema](#4-arquitectura-del-sistema)
5. [Funcionalidades Completas](#5-funcionalidades-completas)
6. [Base de Datos](#6-base-de-datos)
7. [Estructura del Proyecto](#7-estructura-del-proyecto)
8. [Métricas y Estadísticas](#8-métricas-y-estadísticas)
9. [Tiempo de Desarrollo](#9-tiempo-de-desarrollo)
10. [Entregables](#10-entregables)
11. [Características Técnicas](#11-características-técnicas)
12. [Seguridad](#12-seguridad)
13. [Documentación](#13-documentación)

---

## 1. RESUMEN EJECUTIVO

### 1.1. Visión General

**SOMOS MEDICINA VIVA** es un sistema web integral desarrollado para la gestión completa de una pastelería saludable que ofrece productos sin azúcar, sin gluten y 100% veganos. El sistema incluye:

- ✅ **Sitio web público** responsive y moderno
- ✅ **Panel administrativo** completo con 13 módulos de gestión
- ✅ **Sistema de inventario** bidireccional automatizado
- ✅ **Análisis financiero** con cálculo automático de costos y ganancias
- ✅ **Gestión de compras** con costo promedio ponderado
- ✅ **Sistema de producción** manual con cálculo de costos
- ✅ **KPIs y métricas** en tiempo real

### 1.2. Objetivos Cumplidos

- Digitalización completa de la operación
- Automatización de procesos manuales
- Control de inventario en tiempo real
- Análisis financiero automatizado
- Presencia web profesional
- Gestión centralizada de toda la información

### 1.3. Valor Entregado

- **Ahorro de tiempo:** Automatización de procesos que tomaban horas
- **Control total:** Gestión centralizada de productos, inventario y ventas
- **Toma de decisiones:** KPIs y análisis financiero en tiempo real
- **Escalabilidad:** Sistema preparado para crecer con el negocio
- **Profesionalismo:** Presencia web moderna y responsive

---

## 2. DESCRIPCIÓN DEL PROYECTO

### 2.1. Sitio Web Público

Sitio web corporativo completamente responsive que presenta la marca y productos de manera profesional.

#### 2.1.1. Secciones Implementadas

**1. Hero Section (Carrusel)**
- Carrusel de imágenes con efecto 3D giratorio
- Cambio automático cada 2 segundos
- Títulos y subtítulos configurables por imagen
- Efecto de rotación 3D al cargar
- Transiciones suaves entre imágenes
- Totalmente responsive

**2. Catálogo de Productos**
- Visualización de todos los productos activos
- Filtros por categoría (Tortas, Galletas, Panes, Navidad)
- Modal de detalle con información completa:
  - Imagen en alta resolución
  - Descripción detallada
  - Precio
  - Tags (Sin Azúcar, Sin Gluten, Vegano, etc.)
  - Información nutricional
- Diseño tipo grid responsive
- Búsqueda y filtrado en tiempo real

**3. Sección "Apto Para" (Beneficios)**
- Muestra los beneficios de los productos
- Iconos y descripciones
- Diseño atractivo y visual

**4. Ingredientes Destacados**
- Muestra ingredientes principales
- Información de beneficios
- Imágenes y descripciones

**5. Puntos de Venta**
- Listado de todos los puntos de venta
- Integración con Google Maps
- Horarios detallados (semana, sábado, domingo)
- Direcciones y contacto
- Imágenes de cada punto

**6. Zonas de Delivery**
- Información de zonas de cobertura
- Costos de envío
- Tiempos de entrega
- Activar/desactivar zonas

**7. Formulario de Contacto**
- Campos: Nombre, Email, Teléfono, Mensaje
- Validación en tiempo real
- Integración con WhatsApp
- Envío de mensajes al panel admin

**8. Sección "Nosotros"**
- Contenido editable desde el admin
- Imagen principal
- 3 párrafos editables
- Valores de la empresa (Con Amor, Natural, Calidad)

**9. Footer**
- Información de contacto
- Redes sociales
- Enlaces importantes

#### 2.1.2. Características Técnicas del Sitio

- ✅ **100% Responsive:** iPhone, Android, iPad, Desktop
- ✅ **Optimización SEO:** Meta tags, estructura semántica
- ✅ **Performance:** Carga rápida, imágenes optimizadas
- ✅ **Accesibilidad:** WCAG 2.1 nivel AA
- ✅ **Cross-browser:** Compatible con todos los navegadores modernos
- ✅ **Animaciones:** Transiciones suaves y profesionales

---

### 2.2. Panel Administrativo

Sistema completo de gestión con **13 módulos administrativos** independientes pero integrados.

#### 2.2.1. Módulo 1: Gestión de Productos

**Funcionalidades:**
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Upload de imágenes (JPG, PNG, WEBP)
- ✅ Gestión de categorías dinámicas
- ✅ Sistema de tags personalizables (array)
- ✅ Control de stock con alertas automáticas
- ✅ Activar/Desactivar productos
- ✅ Soft delete y hard delete
- ✅ Búsqueda y filtrado avanzado
- ✅ Ordenamiento por múltiples criterios
- ✅ Vista de tabla con paginación
- ✅ Validación de datos en frontend y backend

**Campos del Producto:**
- Nombre (requerido)
- Descripción
- Precio (requerido, validación >= 0)
- Categoría (Tortas, Galletas, Panes, Navidad)
- Imagen URL
- Tags (array de strings)
- Stock actual
- Stock mínimo
- Activo/Inactivo
- Timestamps (created_at, updated_at)

#### 2.2.2. Módulo 2: Gestión de Ingredientes

**Funcionalidades:**
- ✅ CRUD completo de ingredientes
- ✅ Upload de imágenes
- ✅ Unidades de medida configurables (kg, litros, unidades, gramos)
- ✅ Control de stock actual y mínimo
- ✅ Sistema de compras integrado (botón 🛒)
- ✅ **Cálculo automático de costo promedio ponderado**
- ✅ Alertas de stock bajo
- ✅ Valor total del inventario
- ✅ Historial de compras por ingrediente
- ✅ Búsqueda y filtrado

**Campos del Ingrediente:**
- Nombre (requerido, único)
- Descripción
- Beneficio
- Unidad de medida (kg, litros, unidades, gramos)
- Stock actual (default 0, >= 0)
- Stock mínimo (default 0, >= 0)
- Costo unitario (calculado automáticamente)
- Imagen URL
- Activo/Inactivo
- Timestamps

#### 2.2.3. Módulo 3: Producción Manual

**Funcionalidades:**
- ✅ Selección manual de producto a producir
- ✅ Agregar ingredientes uno por uno
- ✅ Definir cantidades exactas utilizadas
- ✅ **Cálculo automático de costo unitario del producto**
- ✅ Descuento automático de ingredientes del stock
- ✅ Aumento automático de stock de productos
- ✅ Preview de todos los cambios antes de confirmar
- ✅ Validación de stock disponible
- ✅ Registro de movimientos de stock
- ✅ Historial de producciones

**Proceso de Producción:**
1. Seleccionar producto a producir
2. Agregar ingredientes utilizados
3. Definir cantidades
4. Sistema calcula costo total
5. Preview de cambios
6. Confirmar producción
7. Actualización automática de stocks

#### 2.2.4. Módulo 4: Compras de Ingredientes

**Funcionalidades:**
- ✅ Registro de compras con costo específico
- ✅ Información de proveedor
- ✅ Número de factura
- ✅ Fecha de compra
- ✅ **Cálculo automático de costo promedio ponderado**
- ✅ Historial completo de compras
- ✅ Análisis de compras por ingrediente
- ✅ Preparado para exportar a Excel
- ✅ Vista de resumen de compras
- ✅ Filtrado por fecha, proveedor, ingrediente

**Campos de Compra:**
- Ingrediente (FK)
- Cantidad comprada
- Costo unitario
- Costo total
- Proveedor
- Número de factura
- Fecha de compra
- Notas
- Timestamps

#### 2.2.5. Módulo 5: Ventas

**Funcionalidades:**
- ✅ Registro de ventas con descuento automático de stock
- ✅ Información de cliente
- ✅ Zona de entrega
- ✅ Cálculo automático de totales
- ✅ Métodos de pago configurables
- ✅ Historial completo de ventas
- ✅ Búsqueda y filtrado por fecha, cliente, producto
- ✅ Vista de tabla con paginación
- ✅ Detalle de venta
- ✅ Registro de movimientos de stock

**Campos de Venta:**
- Fecha de venta
- Cliente (nombre, email, teléfono)
- Productos vendidos (array)
- Cantidades
- Precios unitarios
- Descuentos
- Total
- Método de pago
- Zona de entrega
- Notas
- Timestamps

#### 2.2.6. Módulo 6: Costos y Ganancias

**Funcionalidades:**
- ✅ Costo por producto calculado automáticamente en producción
- ✅ Ganancia unitaria por producto
- ✅ Ganancia total por producto
- ✅ Margen de ganancia porcentual
- ✅ Análisis de rentabilidad por producto
- ✅ Ganancias basadas en costos reales
- ✅ Reportes de rentabilidad
- ✅ Gráficos de análisis
- ✅ Comparación de productos
- ✅ Exportación de datos

**Cálculos Automáticos:**
- Costo unitario = Suma de costos de ingredientes utilizados
- Ganancia unitaria = Precio de venta - Costo unitario
- Margen % = (Ganancia / Precio de venta) × 100
- Ganancia total = Ganancia unitaria × Cantidad vendida

#### 2.2.7. Módulo 7: KPIs y Métricas

**Funcionalidades:**
- ✅ Dashboard con métricas clave en tiempo real
- ✅ Total de ventas (cantidad)
- ✅ Ingresos totales (monto)
- ✅ Productos más vendidos
- ✅ Análisis temporal (diario, semanal, mensual)
- ✅ Gráficos interactivos con Recharts
- ✅ Comparación de períodos
- ✅ Tendencias
- ✅ Métricas de inventario
- ✅ Alertas y notificaciones

**Métricas Incluidas:**
- Ventas del día/semana/mes
- Ingresos del día/semana/mes
- Top 5 productos más vendidos
- Productos con stock bajo
- Ingredientes con stock bajo
- Valor total del inventario
- Ganancias del período

#### 2.2.8. Módulo 8: Categorías

**Funcionalidades:**
- ✅ CRUD de categorías
- ✅ Slug automático
- ✅ Ordenamiento configurable
- ✅ Activar/Desactivar categorías
- ✅ Gestión de categorías dinámicas
- ✅ Validación de nombres únicos
- ✅ Relación con productos

**Campos de Categoría:**
- Nombre (requerido, único)
- Slug (generado automáticamente)
- Descripción
- Orden
- Activo/Inactivo
- Imagen (opcional)
- Timestamps

#### 2.2.9. Módulo 9: Carrusel Hero

**Funcionalidades:**
- ✅ Upload de imágenes del inicio
- ✅ Cambio automático configurable (2 segundos)
- ✅ Efecto giratorio 3D al cargar
- ✅ Título y subtítulo opcionales por imagen
- ✅ Ordenamiento de imágenes
- ✅ Activar/Desactivar imágenes
- ✅ Preview de carrusel
- ✅ Gestión de orden de visualización

**Campos de Imagen Hero:**
- Imagen URL (requerido)
- Título (opcional)
- Subtítulo (opcional)
- Orden
- Activo/Inactivo
- Timestamps

#### 2.2.10. Módulo 10: Nosotros

**Funcionalidades:**
- ✅ Editor de contenido "Quiénes Somos"
- ✅ Upload de imagen principal
- ✅ 3 párrafos editables
- ✅ Valores/etiquetas personalizables (Con Amor, Natural, Calidad)
- ✅ Preview de cambios
- ✅ Guardado automático

**Estructura:**
- Imagen principal
- Párrafo 1
- Párrafo 2
- Párrafo 3
- Valores (array de objetos con icono, título, descripción)

#### 2.2.11. Módulo 11: Puntos de Venta

**Funcionalidades:**
- ✅ CRUD completo de puntos de venta
- ✅ Upload de imágenes
- ✅ Integración con Google Maps
- ✅ Horarios configurables (semana, sábado, domingo)
- ✅ Ordenamiento personalizable
- ✅ Activar/Desactivar puntos
- ✅ Validación de URLs de mapas

**Campos de Punto de Venta:**
- Nombre (requerido)
- Dirección (requerido)
- URL de Google Maps
- Horario semana
- Horario sábado
- Horario domingo
- Imagen URL
- Orden
- Activo/Inactivo
- Timestamps

#### 2.2.12. Módulo 12: Zonas Delivery

**Funcionalidades:**
- ✅ CRUD completo de zonas de delivery
- ✅ Gestión de cobertura geográfica
- ✅ Información de costos y tiempos
- ✅ Activar/Desactivar zonas
- ✅ Ordenamiento
- ✅ Validación de datos

**Campos de Zona Delivery:**
- Nombre (requerido, único)
- Tiempo de entrega
- Costo de envío (default 0)
- Orden
- Activo/Inactivo
- Timestamps

#### 2.2.13. Módulo 13: Contactos

**Funcionalidades:**
- ✅ Mensajes recibidos del formulario de contacto
- ✅ Marcar como leído/no leído
- ✅ Información de contacto del cliente
- ✅ Historial de mensajes
- ✅ Búsqueda y filtrado
- ✅ Notas internas
- ✅ Marcar como respondido

**Campos de Contacto:**
- Nombre (requerido)
- Email
- Teléfono
- Mensaje (requerido)
- Leído (boolean, default false)
- Respondido (boolean, default false)
- Notas (texto interno)
- Timestamps

---

## 3. TECNOLOGÍAS UTILIZADAS

### 3.1. Frontend - Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.3.1 | Librería de interfaz de usuario |
| **TypeScript** | 5.8.3 | Tipado estático (100% del código) |
| **Vite** | 5.4.19 | Build tool y bundler |
| **React Router DOM** | 6.30.1 | Enrutamiento de la aplicación |

### 3.2. Frontend - Estilos y UI

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Tailwind CSS** | 3.4.17 | Framework de estilos utility-first |
| **shadcn/ui** | Latest | Sistema de componentes UI (48 componentes) |
| **Radix UI** | Multiple | Componentes primitivos accesibles |
| **Lucide React** | 0.462.0 | Iconografía moderna |
| **tailwindcss-animate** | 1.0.7 | Animaciones para Tailwind |
| **class-variance-authority** | 0.7.1 | Variantes de componentes |
| **clsx** | 2.1.1 | Utilidad para clases CSS |
| **tailwind-merge** | 2.6.0 | Merge de clases Tailwind |

### 3.3. Frontend - Gestión de Estado y Datos

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **TanStack Query** | 5.83.0 | Gestión de estado del servidor y caché |
| **React Hook Form** | 7.61.1 | Manejo de formularios |
| **Zod** | 3.25.76 | Validación de esquemas |
| **@hookform/resolvers** | 3.10.0 | Resolvers para React Hook Form |

### 3.4. Frontend - Componentes Especializados

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Recharts** | 2.15.4 | Gráficos y visualizaciones |
| **Embla Carousel React** | 8.6.0 | Carruseles |
| **TanStack Table** | 8.21.3 | Tablas de datos avanzadas |
| **date-fns** | 3.6.0 | Manipulación de fechas |
| **react-day-picker** | 8.10.1 | Selector de fechas |
| **cmdk** | 1.1.1 | Command menu |
| **sonner** | 1.7.4 | Notificaciones toast |

### 3.5. Backend y Base de Datos

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Supabase** | 2.86.0 | Backend as a Service |
| **@supabase/supabase-js** | 2.86.0 | Cliente JavaScript de Supabase |
| **@supabase/auth-helpers-react** | 0.15.0 | Helpers de autenticación para React |
| **PostgreSQL** | (via Supabase) | Base de datos relacional |

**Servicios de Supabase Utilizados:**
- ✅ **PostgreSQL Database** - Base de datos relacional
- ✅ **Authentication** - Sistema de autenticación (Email/Password)
- ✅ **Storage** - Almacenamiento de imágenes
- ✅ **Row Level Security (RLS)** - Seguridad a nivel de fila
- ✅ **Real-time** - Subscripciones en tiempo real (preparado)

### 3.6. Herramientas de Desarrollo

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **ESLint** | 9.32.0 | Linter de código |
| **TypeScript ESLint** | 8.38.0 | Linter para TypeScript |
| **PostCSS** | 8.5.6 | Procesador de CSS |
| **Autoprefixer** | 10.4.21 | Prefijos CSS automáticos |
| **Vite Plugin React SWC** | 3.11.0 | Compilador rápido (SWC) |
| **@tailwindcss/typography** | 0.5.16 | Plugin de tipografía |

### 3.7. Dependencias Adicionales

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **next-themes** | 0.3.0 | Gestión de temas (preparado para modo oscuro) |
| **react-resizable-panels** | 2.1.9 | Paneles redimensionables |
| **input-otp** | 1.4.2 | Input para códigos OTP |
| **vaul** | 0.9.9 | Drawer component |

### 3.8. Total de Dependencias

- **Dependencies:** 52 paquetes
- **DevDependencies:** 12 paquetes
- **Total:** 64 paquetes npm

---

## 4. ARQUITECTURA DEL SISTEMA

### 4.1. Arquitectura General

```
┌─────────────────────────────────────────────────┐
│           CLIENTE (Navegador)                    │
│  ┌──────────────────────────────────────────┐   │
│  │     React App (Frontend)                 │   │
│  │  - React 18 + TypeScript                 │   │
│  │  - Tailwind CSS + shadcn/ui              │   │
│  │  - TanStack Query                     │   │
│  │  - React Router                           │   │
│  └──────────────────────────────────────────┘   │
└───────────────────┬─────────────────────────────┘
                    │ HTTPS
                    │ API Calls
┌───────────────────▼─────────────────────────────┐
│         SUPABASE (Backend as a Service)          │
│  ┌──────────────────────────────────────────┐   │
│  │  - PostgreSQL Database                   │   │
│  │  - Authentication Service                │   │
│  │  - Storage Service                       │   │
│  │  - Row Level Security (RLS)              │   │
│  │  - Real-time Subscriptions               │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

### 4.2. Flujo de Datos

1. **Usuario interactúa** con la interfaz React
2. **React Hook Form** valida datos en frontend
3. **TanStack Query** gestiona peticiones y caché
4. **Supabase Client** hace peticiones a la API
5. **PostgreSQL** procesa consultas con RLS
6. **Respuesta** vuelve a través de Supabase
7. **TanStack Query** actualiza caché y UI

### 4.3. Autenticación

- **Método:** Email/Password con Supabase Auth
- **Flujo:**
  1. Usuario ingresa credenciales
  2. Supabase valida
  3. Se genera JWT token
  4. Token se almacena en localStorage
  5. Todas las peticiones incluyen token
  6. RLS valida permisos en cada query

### 4.4. Almacenamiento de Imágenes

- **Servicio:** Supabase Storage
- **Proceso:**
  1. Usuario selecciona imagen
  2. Imagen se sube a Supabase Storage
  3. Se obtiene URL pública
  4. URL se guarda en base de datos
  5. Imagen se muestra desde CDN de Supabase

---

## 5. FUNCIONALIDADES COMPLETAS

### 5.1. Sistemas Implementados

#### Sistema 1: Inventario Bidireccional
- Control de stock de productos
- Control de stock de ingredientes
- Movimientos automáticos en producción
- Movimientos automáticos en ventas
- Alertas de stock bajo
- Historial de movimientos

#### Sistema 2: Cálculo Automático de Costos
- Costo promedio ponderado de ingredientes
- Cálculo de costo unitario en producción
- Actualización automática de costos
- Análisis de rentabilidad

#### Sistema 3: Gestión de Compras
- Registro de compras de ingredientes
- Cálculo automático de costo promedio
- Historial de compras
- Análisis por proveedor

#### Sistema 4: Sistema de Producción
- Producción manual con selección de ingredientes
- Cálculo automático de costos
- Descuento automático de stock
- Registro de movimientos

#### Sistema 5: Sistema de Ventas
- Registro de ventas múltiples productos
- Descuento automático de stock
- Cálculo de totales
- Historial completo

#### Sistema 6: Análisis Financiero
- Costos por producto
- Ganancias unitarias y totales
- Margen de ganancia
- Reportes de rentabilidad

#### Sistema 7: KPIs y Métricas
- Dashboard en tiempo real
- Gráficos interactivos
- Análisis temporal
- Top productos

#### Sistema 8: Alertas Inteligentes
- Stock bajo de productos
- Stock bajo de ingredientes
- Notificaciones en tiempo real

---

## 6. BASE DE DATOS

### 6.1. Tablas Principales

| Tabla | Descripción | Campos Principales |
|-------|-------------|-------------------|
| **productos** | Catálogo de productos | id, nombre, descripcion, precio, categoria, imagen_url, tags, stock_actual, stock_minimo, activo |
| **ingredientes** | Materia prima | id, nombre, descripcion, unidad_medida, stock_actual, stock_minimo, costo_unitario, imagen_url, activo |
| **producto_ingredientes** | Relación productos-ingredientes | id, producto_id, ingrediente_id, cantidad_necesaria |
| **categorias** | Categorías dinámicas | id, nombre, slug, descripcion, orden, activo |
| **puntos_venta** | Puntos de venta | id, nombre, direccion, maps_url, horario_semana, horario_sabado, horario_domingo, imagen_url, activo |
| **zonas_delivery** | Zonas de cobertura | id, nombre, tiempo_entrega, costo_envio, activo |
| **beneficios** | Sección "Apto Para" | id, titulo, descripcion, icono, orden, activo |
| **ventas** | Registro de ventas | id, fecha_venta, cliente_nombre, cliente_email, cliente_telefono, productos, total, metodo_pago, zona_id |
| **compras_ingredientes** | Historial de compras | id, ingrediente_id, cantidad, costo_unitario, costo_total, proveedor, numero_factura, fecha_compra |
| **stock_movimientos** | Historial de stock | id, tipo, tabla_origen, registro_id, cantidad, stock_anterior, stock_nuevo, motivo, created_at |
| **hero_imagenes** | Carrusel del Hero | id, imagen_url, titulo, subtitulo, orden, activo |
| **about_content** | Contenido "Nosotros" | id, imagen_url, parrafo1, parrafo2, parrafo3 |
| **about_values** | Valores de la empresa | id, icono, titulo, descripcion, orden |
| **contactos** | Mensajes de contacto | id, nombre, email, telefono, mensaje, leido, respondido, notas |

**Total: 14 tablas principales**

### 6.2. Funciones SQL Personalizadas

#### Función 1: `registrar_produccion_manual()`
- **Propósito:** Registrar producción con ingredientes manuales
- **Parámetros:** producto_id, ingredientes (array)
- **Acciones:**
  - Calcula costo total de producción
  - Descuenta ingredientes del stock
  - Aumenta stock del producto
  - Registra movimientos de stock
  - Actualiza costo unitario del producto

#### Función 2: `registrar_compra_ingrediente()`
- **Propósito:** Registrar compra y actualizar costo promedio
- **Parámetros:** ingrediente_id, cantidad, costo_unitario, proveedor, etc.
- **Acciones:**
  - Registra la compra
  - Calcula nuevo costo promedio ponderado
  - Actualiza costo_unitario del ingrediente
  - Aumenta stock del ingrediente
  - Registra movimiento de stock

#### Función 3: `descontar_stock_venta()`
- **Propósito:** Descontar stock automáticamente en ventas
- **Parámetros:** venta_id, productos (array)
- **Acciones:**
  - Descuenta stock de cada producto vendido
  - Registra movimientos de stock
  - Valida stock disponible
  - Retorna error si no hay stock suficiente

### 6.3. Vistas Optimizadas

#### Vista 1: `vista_compras_ingredientes`
- Combina compras con información de ingredientes
- Incluye cálculos de totales
- Ordenada por fecha descendente

#### Vista 2: `vista_productos_stock`
- Productos con estado de stock
- Incluye alertas de stock bajo
- Información de categoría

#### Vista 3: `vista_resumen_compras_ingrediente`
- Resumen de compras por ingrediente
- Total de compras
- Promedio de costos
- Última compra

### 6.4. Triggers Automáticos

- **updated_at trigger:** Actualiza automáticamente el campo `updated_at` en todas las tablas
- **stock_movimientos trigger:** Registra automáticamente movimientos de stock

### 6.5. Índices Optimizados

- Índices en campos de búsqueda frecuente
- Índices en foreign keys
- Índices en campos de ordenamiento
- Índices parciales para consultas específicas

### 6.6. Row Level Security (RLS)

- **Políticas implementadas:**
  - Lectura pública para sitio web
  - Escritura solo para administradores autenticados
  - Validación de permisos en cada query
  - Políticas específicas por tabla

---

## 7. ESTRUCTURA DEL PROYECT

### 7.1. Estructura de Carpetas

```
medicina-viva-bakery/
├── database/                    # Scripts SQL
│   ├── schema.sql              # Esquema completo
│   ├── security.sql            # Políticas RLS
│   ├── seed.sql               # Datos iniciales
│   ├── categorias.sql         # Sistema de categorías
│   ├── hero_carousel.sql      # Carrusel Hero
│   ├── about_content.sql      # Contenido Nosotros
│   ├── stock_management.sql  # Sistema de stock
│   ├── produccion_manual.sql # Producción manual
│   ├── compras_ingredientes.sql # Compras
│   ├── costos_ganancias.sql  # Análisis financiero
│   ├── migracion_ventas_multiples_productos.sql
│   └── README.md
│
├── src/
│   ├── components/            # Componentes React
│   │   ├── ui/               # 48 componentes shadcn/ui
│   │   │   ├── accordion.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── chart.tsx
│   │   │   └── ... (48 componentes total)
│   │   ├── About.tsx
│   │   ├── Benefits.tsx
│   │   ├── Catalog.tsx
│   │   ├── Contact.tsx
│   │   ├── Delivery.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── Ingredients.tsx
│   │   ├── Navbar.tsx
│   │   ├── NavLink.tsx
│   │   ├── PickupPoints.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── pages/                 # Páginas de la aplicación
│   │   ├── Index.tsx         # Página principal pública
│   │   ├── Login.tsx         # Página de login
│   │   ├── NotFound.tsx      # Página 404
│   │   ├── Admin.tsx         # Dashboard administrativo
│   │   ├── AdminProductos.tsx
│   │   ├── AdminProductoForm.tsx
│   │   ├── AdminProductoCostos.tsx
│   │   ├── AdminIngredientes.tsx
│   │   ├── AdminBeneficios.tsx
│   │   ├── AdminPuntosVenta.tsx
│   │   ├── AdminDelivery.tsx
│   │   ├── AdminCategorias.tsx
│   │   ├── AdminHeroCarousel.tsx
│   │   ├── AdminAbout.tsx
│   │   ├── AdminProduccion.tsx
│   │   ├── AdminVentas.tsx
│   │   ├── AdminVentaForm.tsx
│   │   ├── AdminContactos.tsx
│   │   ├── AdminKPIs.tsx
│   │   └── AdminGanancias.tsx
│   │
│   ├── hooks/                # Custom Hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   ├── useAbout.ts
│   │   ├── useBeneficios.ts
│   │   ├── useCategorias.ts
│   │   ├── useComprasIngredientes.ts
│   │   ├── useContactos.ts
│   │   ├── useHeroImagenes.ts
│   │   ├── useIngredientes.ts
│   │   ├── useProductoIngredientes.ts
│   │   ├── useProducts.ts
│   │   ├── usePuntosVenta.ts
│   │   ├── useStock.ts
│   │   ├── useVentas.ts
│   │   └── useZonasDelivery.ts
│   │
│   ├── contexts/             # React Contexts
│   │   └── AuthContext.tsx
│   │
│   ├── lib/                  # Utilidades
│   │   ├── supabase.ts      # Cliente de Supabase
│   │   ├── storage.ts       # Utilidades de storage
│   │   └── utils.ts         # Utilidades generales
│   │
│   ├── types/                # Tipos TypeScript
│   │   └── database.types.ts
│   │
│   ├── App.tsx              # Componente principal
│   ├── App.css
│   ├── main.tsx            # Punto de entrada
│   └── index.css           # Estilos globales
│
├── public/                  # Archivos estáticos
│   ├── imagen/
│   │   ├── fondo.png
│   │   └── logoMedicinaVida.png
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── dist/                    # Build de producción
│
├── *.md                     # 18+ archivos de documentación
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.js
├── components.json
└── netlify.toml
```

### 7.2. Componentes por Categoría

**Componentes UI (shadcn/ui):** 48 componentes
- Formularios: input, textarea, select, checkbox, radio, etc.
- Navegación: menu, navigation-menu, breadcrumb, etc.
- Feedback: alert, toast, dialog, tooltip, etc.
- Datos: table, chart, pagination, etc.
- Layout: card, separator, tabs, accordion, etc.

**Componentes de Negocio:** 13 componentes
- About, Benefits, Catalog, Contact, Delivery, Footer, Hero, ImageUpload, Ingredients, Navbar, NavLink, PickupPoints, ProtectedRoute

**Total Componentes:** 61 componentes

---

## 8. MÉTRICAS Y ESTADÍSTICAS

### 8.1. Volumen de Código

| Métrica | Cantidad |
|---------|----------|
| **Archivos TypeScript/TSX** | ~70+ archivos |
| **Líneas de código** | ~8,000+ líneas |
| **Componentes React** | 61 componentes |
| **Custom Hooks** | 16 hooks |
| **Páginas** | 20 páginas |
| **Rutas** | 15+ rutas |
| **Tablas de BD** | 14 tablas |
| **Funciones SQL** | 3 funciones |
| **Vistas SQL** | 3 vistas |
| **Scripts SQL** | 10+ scripts |
| **Archivos de documentación** | 18+ archivos MD |

### 8.2. Funcionalidades

| Categoría | Cantidad |
|-----------|----------|
| **Módulos administrativos** | 13 módulos |
| **Sistemas implementados** | 8 sistemas |
| **Integraciones** | 3 (Google Maps, WhatsApp, Supabase) |
| **Formularios** | 20+ formularios |
| **Tablas de datos** | 15+ tablas |
| **Gráficos y visualizaciones** | 10+ gráficos |

### 8.3. Dependencias

| Categoría | Cantidad |
|-----------|----------|
| **Dependencies** | 52 paquetes |
| **DevDependencies** | 12 paquetes |
| **Total paquetes** | 64 paquetes |

### 8.4. Base de Datos

| Métrica | Cantidad |
|---------|----------|
| **Tablas principales** | 14 tablas |
| **Relaciones (FK)** | 10+ relaciones |
| **Índices** | 20+ índices |
| **Funciones SQL** | 3 funciones |
| **Vistas** | 3 vistas |
| **Triggers** | 2+ triggers |
| **Políticas RLS** | 20+ políticas |

---

## 9. TIEMPO DE DESARROLLO

### 9.1. Desglose Detallado por Fase

| Fase | Descripción | Horas | % del Total |
|------|-------------|-------|-------------|
| **1. Setup y Configuración** | Configuración inicial del proyecto, Vite, TypeScript, Tailwind, Supabase | 8h | 3.4% |
| **2. Autenticación y Seguridad** | Sistema de login, RLS, rutas protegidas, AuthContext | 12h | 5.2% |
| **3. Base de Datos** | Diseño de esquema, creación de tablas, relaciones, índices, RLS | 16h | 6.9% |
| **4. Sitio Web Público** | Hero, Catálogo, About, Contact, Delivery, Responsive | 24h | 10.3% |
| **5. Módulos Admin Base** | Estructura admin, navegación, layout, componentes base | 16h | 6.9% |
| **6. Módulo Productos** | CRUD completo, imágenes, categorías, tags, stock | 12h | 5.2% |
| **7. Módulo Ingredientes** | CRUD, compras, costo promedio, alertas | 12h | 5.2% |
| **8. Módulo Producción** | Producción manual, cálculo de costos, movimientos stock | 16h | 6.9% |
| **9. Módulo Compras** | Registro compras, costo promedio ponderado, historial | 12h | 5.2% |
| **10. Módulo Ventas** | Registro ventas, múltiples productos, descuento stock | 12h | 5.2% |
| **11. Módulo Costos/Ganancias** | Análisis financiero, cálculos automáticos, reportes | 12h | 5.2% |
| **12. Módulo KPIs** | Dashboard, gráficos, métricas, análisis temporal | 12h | 5.2% |
| **13. Módulos Adicionales** | Categorías, Hero, About, Puntos Venta, Delivery, Contactos (6 módulos) | 24h | 10.3% |
| **14. Sistema Inventario** | Inventario bidireccional, alertas, movimientos | 16h | 6.9% |
| **15. Testing y Bugs** | Testing, corrección de errores, optimización | 16h | 6.9% |
| **16. Documentación** | 18+ guías markdown, comentarios, README | 12h | 5.2% |
| **17. Deploy y Configuración** | Configuración Netlify, variables entorno, build | 8h | 3.4% |
| **TOTAL** | | **232h** | **100%** |

### 9.2. Tiempo Total Estimado

- **Horas totales:** 232 horas
- **Semanas (tiempo parcial - 20h/semana):** 11-12 semanas
- **Semanas (tiempo completo - 40h/semana):** 6 semanas
- **Meses (tiempo parcial):** 3 meses
- **Meses (tiempo completo):** 1.5 meses

### 9.3. Distribución por Tipo de Trabajo

| Tipo de Trabajo | Horas | % |
|-----------------|-------|---|
| **Desarrollo Frontend** | 120h | 51.7% |
| **Desarrollo Backend/BD** | 48h | 20.7% |
| **Integración y Lógica** | 32h | 13.8% |
| **Testing y Debugging** | 16h | 6.9% |
| **Documentación** | 12h | 5.2% |
| **Configuración y Deploy** | 4h | 1.7% |

---

## 10. ENTREGABLES

### 10.1. Código Fuente

- ✅ Código fuente completo del proyecto
- ✅ Estructura de carpetas organizada
- ✅ Comentarios en código crítico
- ✅ Configuración de build para producción
- ✅ Variables de entorno documentadas
- ✅ Scripts de desarrollo y producción

### 10.2. Base de Datos

- ✅ Scripts SQL completos (10+ archivos):
  - `schema.sql` - Esquema completo de base de datos
  - `security.sql` - Políticas de seguridad (RLS)
  - `seed.sql` - Datos iniciales
  - `categorias.sql` - Sistema de categorías
  - `hero_carousel.sql` - Carrusel Hero
  - `about_content.sql` - Contenido Nosotros
  - `stock_management.sql` - Sistema de stock
  - `produccion_manual.sql` - Producción manual
  - `compras_ingredientes.sql` - Sistema de compras
  - `costos_ganancias.sql` - Análisis financiero
  - `migracion_ventas_multiples_productos.sql` - Migración ventas
- ✅ Documentación de estructura de base de datos
- ✅ Guía de migración paso a paso
- ✅ Diagrama de relaciones (en documentación)

### 10.3. Documentación Técnica

- ✅ **18+ guías markdown** detalladas:
  - `README.md` - Documentación principal
  - `SUPABASE_SETUP.md` - Configuración Supabase
  - `CONFIGURAR_STORAGE.md` - Configuración Storage
  - `CREAR_ADMIN.md` - Crear usuario admin
  - `SISTEMA_INVENTARIO_COMPLETO.md` - Sistema inventario
  - `SISTEMA_COSTOS_AUTOMATICO.md` - Sistema costos
  - `SISTEMA_COMPRAS_STOCK.md` - Gestión compras
  - `SISTEMA_ALERTAS_STOCK.md` - Sistema alertas
  - `PRODUCCION_MANUAL.md` - Producción manual
  - `SISTEMA_COSTOS.md` - Análisis costos
  - `CARRUSEL_HERO.md` - Sistema carrusel
  - `RESPONSIVE_COMPLETE.md` - Auditoría responsive
  - `GUIA_PRODUCCION.md` - Guía producción
  - `EXPORTACION_EXCEL.md` - Exportación Excel
  - `DEPLOY_NETLIFY.md` - Deploy Netlify
  - `CONFIGURAR_DOMINIO.md` - Configuración dominio
  - Y más...
- ✅ Comentarios en código
- ✅ README con instrucciones de instalación

### 10.4. Configuración y Deploy

- ✅ Configuración de variables de entorno (`.env.example`)
- ✅ Configuración para Netlify (`netlify.toml`)
- ✅ Build optimizado para producción
- ✅ Instrucciones de deploy paso a paso
- ✅ Configuración de dominio (guía)

### 10.5. Capacitación y Soporte

- ✅ Sesión de capacitación para uso del sistema (2 horas)
- ✅ Documentación de usuario
- ✅ Guías paso a paso para cada módulo
- ✅ Video tutoriales (opcional, según acuerdo)

---

## 11. CARACTERÍSTICAS TÉCNICAS

### 11.1. Performance

- ✅ **Build optimizado:** Vite con tree-shaking
- ✅ **Code splitting:** Carga diferida de componentes
- ✅ **Imágenes optimizadas:** Lazy loading, formatos modernos
- ✅ **Caché inteligente:** TanStack Query con stale-while-revalidate
- ✅ **Bundle size:** Optimizado y minificado

### 11.2. Seguridad

- ✅ **Autenticación:** Supabase Auth con JWT
- ✅ **Row Level Security:** Políticas en todas las tablas
- ✅ **Validación:** Frontend (Zod) + Backend (PostgreSQL)
- ✅ **Variables de entorno:** Credenciales seguras
- ✅ **HTTPS:** Todas las comunicaciones encriptadas
- ✅ **Sanitización:** Prevención de SQL injection, XSS

### 11.3. Escalabilidad

- ✅ **Arquitectura modular:** Fácil agregar nuevas funcionalidades
- ✅ **Base de datos normalizada:** Optimizada para crecimiento
- ✅ **Código reutilizable:** Componentes y hooks compartidos
- ✅ **API escalable:** Supabase maneja escalabilidad automáticamente

### 11.4. Mantenibilidad

- ✅ **TypeScript 100%:** Tipado estático en todo el código
- ✅ **Código organizado:** Estructura clara y consistente
- ✅ **Documentación completa:** 18+ guías markdown
- ✅ **Comentarios:** Código crítico documentado
- ✅ **Estándares:** ESLint, Prettier (configurado)

### 11.5. Accesibilidad

- ✅ **WCAG 2.1:** Nivel AA de accesibilidad
- ✅ **ARIA labels:** Etiquetas semánticas
- ✅ **Navegación por teclado:** Totalmente navegable
- ✅ **Contraste:** Colores con buen contraste
- ✅ **Screen readers:** Compatible con lectores de pantalla

### 11.6. Responsive Design

- ✅ **Mobile first:** Diseño pensado para móviles primero
- ✅ **Breakpoints:** iPhone, Android, iPad, Desktop
- ✅ **Touch friendly:** Botones y elementos táctiles
- ✅ **Imágenes adaptativas:** Tamaños según dispositivo

---

## 12. SEGURIDAD

### 12.1. Autenticación y Autorización

- **Método:** Email/Password con Supabase Auth
- **Tokens:** JWT almacenados de forma segura
- **Sesiones:** Persistencia de sesión configurada
- **Refresh tokens:** Renovación automática
- **Rutas protegidas:** Middleware de autenticación

### 12.2. Row Level Security (RLS)

- **Políticas implementadas:** 20+ políticas RLS
- **Lectura pública:** Solo para sitio web (productos, categorías, etc.)
- **Escritura:** Solo administradores autenticados
- **Validación:** En cada query a la base de datos
- **Seguridad por tabla:** Políticas específicas por tabla

### 12.3. Validación de Datos

- **Frontend:** Zod schemas para validación
- **Backend:** Constraints de PostgreSQL
- **Sanitización:** Prevención de inyección SQL
- **XSS Protection:** Escapado de datos en frontend
- **CSRF Protection:** Tokens en formularios

### 12.4. Almacenamiento Seguro

- **Variables de entorno:** Credenciales en `.env`
- **Git ignore:** `.env` excluido del repositorio
- **Supabase Storage:** Permisos configurados
- **URLs públicas:** Solo para recursos públicos

---

## 13. DOCUMENTACIÓN

### 13.1. Documentación Técnica

- ✅ **README.md:** Documentación principal del proyecto
- ✅ **Guías de configuración:** Supabase, Storage, Deploy
- ✅ **Guías de sistemas:** Inventario, Costos, Compras, etc.
- ✅ **Comentarios en código:** Código crítico documentado
- ✅ **Tipos TypeScript:** Autogenerados desde Supabase

### 13.2. Documentación de Usuario

- ✅ **Guías de uso:** Para cada módulo administrativo
- ✅ **Manual de usuario:** Paso a paso
- ✅ **FAQ:** Preguntas frecuentes
- ✅ **Video tutoriales:** (opcional)

### 13.3. Documentación de Desarrollo

- ✅ **Estructura del proyecto:** Explicada en README
- ✅ **Convenciones de código:** Estándares seguidos
- ✅ **Guías de contribución:** (si aplica)
- ✅ **Changelog:** Historial de cambios

---

## 📊 RESUMEN FINAL PARA COTIZACIÓN

### Información Clave

- **Proyecto:** Sistema Web Integral para Pastelería Saludable
- **Tecnologías:** React 18 + TypeScript + Supabase + Tailwind CSS
- **Módulos:** 13 módulos administrativos completos
- **Tiempo de desarrollo:** 232 horas
- **Líneas de código:** 8,000+ líneas
- **Componentes:** 61 componentes
- **Tablas de BD:** 14 tablas
- **Documentación:** 18+ guías markdown
- **Estado:** Producción, completamente funcional

### Valor del Proyecto

Este proyecto representa un **sistema completo y profesional** que incluye:

1. ✅ **Sitio web público** moderno y responsive
2. ✅ **Panel administrativo** con 13 módulos
3. ✅ **Sistemas complejos** (inventario, costos, producción)
4. ✅ **Base de datos** optimizada y segura
5. ✅ **Documentación** extensa y completa
6. ✅ **Código de calidad** con TypeScript 100%
7. ✅ **Arquitectura escalable** y mantenible

---

**Este documento contiene toda la información necesaria para realizar una cotización profesional y detallada del proyecto SOMOS MEDICINA VIVA.**

---

*Documento generado para uso en cotizaciones y presentaciones profesionales*  
*Última actualización: [FECHA ACTUAL]*


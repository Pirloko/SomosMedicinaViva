# 🍰 Medicina Viva Bakery

Sistema integral de gestión para pastelería saludable con panel administrativo completo.

![Estado](https://img.shields.io/badge/Estado-Producción-success)
![Version](https://img.shields.io/badge/Versión-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)

---

## 🎯 Descripción

**Medicina Viva** es un sistema completo de gestión para una pastelería saludable que ofrece productos sin azúcar, sin gluten y 100% veganos. El proyecto incluye:

- 🌐 **Sitio web público** responsive con todas las secciones dinámicas
- 🎛️ **Panel administrativo** completo con 13 módulos de gestión
- 📦 **Sistema de inventario** bidireccional (productos e ingredientes)
- 💰 **Análisis financiero** con cálculo automático de costos y ganancias
- 🛒 **Gestión de compras** con costo promedio ponderado
- 🏭 **Producción manual** con selección flexible de ingredientes
- 📊 **KPIs y métricas** en tiempo real

---

## ✨ Características Principales

### 🌐 Sitio Web Público

- ✅ Carrusel Hero con efecto 3D giratorio (cambio cada 2 segundos)
- ✅ Catálogo de productos dinámico con filtros por categoría
- ✅ Modal de detalle de producto con información completa
- ✅ Sección "Apto Para" con beneficios
- ✅ Ingredientes destacados
- ✅ Puntos de venta con mapas y horarios
- ✅ Zonas de delivery
- ✅ Formulario de contacto con WhatsApp
- ✅ 100% Responsive (iPhone, Android, iPad, Desktop)

### 🎛️ Panel Administrativo

#### 📦 Gestión de Productos
- CRUD completo de productos
- Upload de imágenes (JPG, PNG, WEBP)
- Categorías dinámicas
- Tags personalizables
- Control de stock con alertas
- Activar/Desactivar
- Soft delete y hard delete

#### 🌿 Gestión de Ingredientes
- CRUD completo de ingredientes
- Upload de imágenes
- Unidades de medida configurables
- Stock actual y mínimo
- **Botón 🛒 para registrar compras**
- **Costo promedio ponderado automático**
- Alertas de stock bajo
- Valor total del inventario

#### 🏭 Producción
- **Selección manual de producto**
- **Agregar ingredientes uno por uno**
- **Definir cantidades exactas utilizadas**
- **Cálculo automático de costo unitario**
- Descuento automático de ingredientes
- Aumento de stock de productos
- Preview de todos los cambios
- Validación de stock disponible

#### 🛒 Compras de Ingredientes
- Registrar compras con costo específico
- Proveedor y número de factura
- Fecha de compra
- **Costo promedio ponderado automático**
- Historial completo de compras
- Preparado para exportar a Excel

#### 💰 Ventas
- Registro de ventas con descuento automático de stock
- Información de cliente y zona
- Cálculo automático de totales
- Métodos de pago
- Historial completo

#### 📊 Costos y Ganancias
- Costo por producto calculado en producción
- Ganancia unitaria y total
- Margen de ganancia porcentual
- Análisis de rentabilidad por producto
- Ganancias basadas en costos reales

#### 📈 KPIs y Métricas
- Dashboard con métricas clave
- Total de ventas
- Ingresos
- Productos más vendidos
- Análisis temporal

#### 🏷️ Categorías
- CRUD de categorías
- Slug automático
- Ordenamiento configurable
- Activar/Desactivar

#### 🎠 Carrusel Hero
- Upload de imágenes del inicio
- Cambio automático (2 segundos)
- Efecto giratorio 3D al cargar
- Título y subtítulo opcionales

#### 📖 Nosotros
- Editor de contenido "Quiénes Somos"
- Upload de imagen
- 3 párrafos editables
- Valores/etiquetas personalizables (Con Amor, Natural, Calidad)

#### 📍 Puntos de Venta y 🚚 Zonas Delivery
- CRUD completo
- Upload de imágenes
- Google Maps integrado
- Horarios configurables

#### 📧 Contactos
- Mensajes de formulario de contacto
- Marcar como leído/no leído

---

## 🛠️ Tecnologías

### Frontend
- **React 18** - Librería UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **TanStack Query** - Data fetching
- **React Hook Form** - Formularios
- **Zod** - Validación
- **Lucide React** - Iconos

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication (Email/Password)
  - Storage (Imágenes)
  - Row Level Security (RLS)
  - Real-time subscriptions
- **Funciones SQL** personalizadas
- **Triggers** automáticos
- **Vistas** optimizadas

---

## 📦 Instalación

### Requisitos Previos
- Node.js 18+ y npm
- Cuenta de Supabase

### 1. Clonar Repositorio

```bash
git clone https://github.com/Pirloko/SomosMedicinaViva.git
cd SomosMedicinaViva
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Configurar Base de Datos

Ejecuta los scripts SQL en orden en Supabase SQL Editor:

```bash
1. database/schema.sql           # Tablas principales
2. database/security.sql         # Políticas RLS
3. database/seed.sql             # Datos iniciales
4. database/categorias.sql       # Sistema de categorías
5. database/hero_carousel.sql    # Carrusel del Hero
6. database/about_content.sql    # Contenido "Nosotros"
7. database/stock_management.sql # Sistema de stock
8. database/produccion_manual.sql # Producción manual
9. database/compras_ingredientes.sql # Compras
10. database/costos_ganancias.sql # Análisis financiero
```

### 5. Configurar Storage

Sigue la guía en `CONFIGURAR_STORAGE.md`

### 6. Crear Usuario Admin

Sigue la guía en `CREAR_ADMIN.md`

### 7. Iniciar Aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:8080`

---

## 📚 Documentación

El proyecto incluye 18+ guías markdown detalladas:

### Configuración
- `SUPABASE_SETUP.md` - Configuración inicial de Supabase
- `CONFIGURAR_STORAGE.md` - Configuración de Storage
- `CREAR_ADMIN.md` - Crear usuario administrador

### Sistemas
- `SISTEMA_INVENTARIO_COMPLETO.md` - Sistema de stock bidireccional
- `SISTEMA_COSTOS_AUTOMATICO.md` - Cálculo automático de costos
- `SISTEMA_COMPRAS_STOCK.md` - Gestión de compras
- `SISTEMA_ALERTAS_STOCK.md` - Alertas inteligentes
- `PRODUCCION_MANUAL.md` - Producción con selección manual
- `SISTEMA_COSTOS.md` - Análisis de costos y ganancias

### Funcionalidades
- `CARRUSEL_HERO.md` - Sistema de carrusel
- `RESPONSIVE_COMPLETE.md` - Auditoría de responsividad
- `GUIA_PRODUCCION.md` - Guía de producción
- `EXPORTACION_EXCEL.md` - Preparación para Excel

---

## 🗄️ Estructura del Proyecto

```
medicina-viva-bakery/
├── database/               # Scripts SQL
│   ├── schema.sql         # Tablas principales
│   ├── security.sql       # RLS
│   ├── seed.sql          # Datos iniciales
│   └── ...               # Otros scripts
├── src/
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes shadcn/ui
│   │   ├── About.tsx
│   │   ├── Catalog.tsx
│   │   ├── Hero.tsx
│   │   └── ...
│   ├── pages/           # Páginas
│   │   ├── Admin*.tsx   # Páginas admin
│   │   ├── Index.tsx    # Página principal
│   │   └── Login.tsx
│   ├── hooks/           # Custom hooks
│   ├── contexts/        # React contexts
│   ├── lib/            # Utilidades
│   └── types/          # Tipos TypeScript
├── public/             # Archivos estáticos
│   └── imagen/        # Imágenes
├── *.md               # Documentación
└── package.json
```

---

## 🔐 Seguridad

- ✅ Autenticación con Supabase Auth
- ✅ Row Level Security (RLS) en todas las tablas
- ✅ Rutas protegidas en el admin
- ✅ Variables de entorno para credenciales
- ✅ .env excluido de Git

---

## 📊 Base de Datos

### Tablas Principales
- `productos` - Catálogo de productos
- `ingredientes` - Materia prima
- `producto_ingredientes` - Recetas (opcional)
- `categorias` - Categorías dinámicas
- `puntos_venta` - Puntos de venta
- `zonas_delivery` - Zonas de cobertura
- `beneficios` - Sección "Apto Para"
- `ventas` - Registro de ventas
- `compras_ingredientes` - Historial de compras
- `stock_movimientos` - Historial de stock
- `hero_imagenes` - Carrusel del Hero
- `about_content` - Contenido "Nosotros"
- `about_values` - Valores de la empresa
- `contactos` - Mensajes de contacto

### Funciones SQL
- `registrar_produccion_manual()` - Producción con ingredientes manuales
- `registrar_compra_ingrediente()` - Compras con costo promedio
- `descontar_stock_venta()` - Descuento automático en ventas

### Vistas
- `vista_compras_ingredientes` - Historial de compras
- `vista_productos_stock` - Productos con estado de stock
- `vista_resumen_compras_ingrediente` - Análisis de compras

---

## 🎨 Características de Diseño

- 🎨 Paleta de colores natural (verde menta, beige, sage)
- 🖼️ Background personalizado con opacidad ajustable
- 🎭 Animaciones y transiciones suaves
- 📱 100% Responsive
- ♿ Accesible
- 🌙 Preparado para modo oscuro (estructura)

---

## 🚀 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Ejecutar linter
```

---

## 📈 Roadmap Futuro

- [ ] Exportación a Excel de reportes
- [ ] Notificaciones push de alertas
- [ ] Gráficos de evolución de costos
- [ ] Integración con pasarelas de pago
- [ ] App móvil (React Native)
- [ ] Sistema de fidelización de clientes
- [ ] Reportes PDF automatizados

---

## 👥 Contribuir

Este es un proyecto privado de Medicina Viva. Para sugerencias o reportes de bugs, contacta al equipo.

---

## 📝 Licencia

© 2024 Medicina Viva. Todos los derechos reservados.

---

## 📞 Contacto

- 🌐 Web: [medicinaviva.cl](http://medicinaviva.cl) (próximamente)
- 📷 Instagram: [@somosmedicinaviva](https://instagram.com/somosmedicinaviva)
- 📘 Facebook: [Somos Medicina Viva](https://www.facebook.com/somosmedicinaviva?locale=es_LA)
- 📱 WhatsApp: +56 9 1234 5678

---

## 🙏 Agradecimientos

Proyecto desarrollado con ❤️ para ofrecer opciones saludables y deliciosas.

**Stack:** React + TypeScript + Vite + Supabase + Tailwind CSS + shadcn/ui

---

**¡Comida saludable que sabe increíble!** 🍰💚

/**
 * Tipos TypeScript generados para la base de datos de Supabase
 * 
 * 🔄 Este archivo se actualizará automáticamente cuando creemos las tablas en Supabase
 * Puedes generar estos tipos automáticamente con: npx supabase gen types typescript
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // 🎂 PRODUCTOS
      productos: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          precio: number
          categoria: string
          imagen_url: string | null
          tags: string[]
          stock_disponible: number
          stock_minimo: number
          costo_produccion_unitario: number
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          precio: number
          categoria: string
          imagen_url?: string | null
          tags?: string[]
          stock_disponible?: number
          stock_minimo?: number
          costo_produccion_unitario?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          precio?: number
          categoria?: string
          imagen_url?: string | null
          tags?: string[]
          stock_disponible?: number
          stock_minimo?: number
          costo_produccion_unitario?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      
      // 🌿 INGREDIENTES
      ingredientes: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          beneficio: string | null
          unidad_medida: string
          stock_actual: number
          stock_minimo: number
          costo_unitario: number | null
          imagen_url: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          beneficio?: string | null
          unidad_medida: string
          stock_actual?: number
          stock_minimo?: number
          costo_unitario?: number | null
          imagen_url?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          beneficio?: string | null
          unidad_medida?: string
          stock_actual?: number
          stock_minimo?: number
          costo_unitario?: number | null
          imagen_url?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // 🔗 RELACIÓN PRODUCTOS-INGREDIENTES
      producto_ingredientes: {
        Row: {
          id: string
          producto_id: string
          ingrediente_id: string
          cantidad_necesaria: number
          created_at: string
        }
        Insert: {
          id?: string
          producto_id: string
          ingrediente_id: string
          cantidad_necesaria: number
          created_at?: string
        }
        Update: {
          id?: string
          producto_id?: string
          ingrediente_id?: string
          cantidad_necesaria?: number
          created_at?: string
        }
      }

      // 🏪 PUNTOS DE VENTA
      puntos_venta: {
        Row: {
          id: string
          nombre: string
          direccion: string
          maps_url: string | null
          horario_semana: string
          horario_sabado: string
          horario_domingo: string
          imagen_url: string | null
          activo: boolean
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          direccion: string
          maps_url?: string | null
          horario_semana: string
          horario_sabado: string
          horario_domingo: string
          imagen_url?: string | null
          activo?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          direccion?: string
          maps_url?: string | null
          horario_semana?: string
          horario_sabado?: string
          horario_domingo?: string
          imagen_url?: string | null
          activo?: boolean
          created_at?: string
        }
      }

      // 🚚 ZONAS DE DELIVERY
      zonas_delivery: {
        Row: {
          id: string
          nombre: string
          tiempo_entrega: string
          activo: boolean
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          tiempo_entrega: string
          activo?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          tiempo_entrega?: string
          activo?: boolean
          created_at?: string
        }
      }

      // 📧 CONTACTOS
      contactos: {
        Row: {
          id: string
          nombre: string
          email: string | null
          telefono: string | null
          mensaje: string
          leido: boolean
          respondido: boolean
          notas: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          email?: string | null
          telefono?: string | null
          mensaje: string
          leido?: boolean
          respondido?: boolean
          notas?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          email?: string | null
          telefono?: string | null
          mensaje?: string
          leido?: boolean
          respondido?: boolean
          notas?: string | null
          created_at?: string
        }
      }

      // ✅ BENEFICIOS (Apto Para)
      beneficios: {
        Row: {
          id: string
          titulo: string
          descripcion: string
          icono: string
          color: string
          orden: number
          activo: boolean
        }
        Insert: {
          id?: string
          titulo: string
          descripcion: string
          icono: string
          color: string
          orden?: number
          activo?: boolean
        }
        Update: {
          id?: string
          titulo?: string
          descripcion?: string
          icono?: string
          color?: string
          orden?: number
          activo?: boolean
        }
      }

      // 📖 ABOUT (Nosotros) - Contenido Principal
      about_content: {
        Row: {
          id: string
          titulo: string
          parrafo_1: string
          parrafo_2: string | null
          parrafo_3: string | null
          imagen_url: string | null
          estadistica_numero: string
          estadistica_texto: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo?: string
          parrafo_1: string
          parrafo_2?: string | null
          parrafo_3?: string | null
          imagen_url?: string | null
          estadistica_numero?: string
          estadistica_texto?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          parrafo_1?: string
          parrafo_2?: string | null
          parrafo_3?: string | null
          imagen_url?: string | null
          estadistica_numero?: string
          estadistica_texto?: string
          created_at?: string
          updated_at?: string
        }
      }

      // 🏷️ ABOUT VALUES (Valores: Con Amor, Natural, Calidad)
      about_values: {
        Row: {
          id: string
          titulo: string
          descripcion: string
          icono: string
          orden: number
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descripcion: string
          icono?: string
          orden?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descripcion?: string
          icono?: string
          orden?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // 🎠 HERO IMÁGENES (Carrusel)
      hero_imagenes: {
        Row: {
          id: string
          titulo: string | null
          subtitulo: string | null
          imagen_url: string
          orden: number
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo?: string | null
          subtitulo?: string | null
          imagen_url: string
          orden?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string | null
          subtitulo?: string | null
          imagen_url?: string
          orden?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // 🏷️ CATEGORÍAS
      categorias: {
        Row: {
          id: string
          nombre: string
          slug: string
          descripcion: string | null
          icono: string | null
          color: string | null
          orden: number
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          slug: string
          descripcion?: string | null
          icono?: string | null
          color?: string | null
          orden?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          slug?: string
          descripcion?: string | null
          icono?: string | null
          color?: string | null
          orden?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // 💰 VENTAS
      ventas: {
        Row: {
          id: string
          producto_id: string | null
          cantidad: number
          precio_unitario: number
          total: number
          cliente_nombre: string | null
          cliente_telefono: string | null
          zona_delivery: string | null
          estado: string
          fecha_venta: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          producto_id?: string | null
          cantidad: number
          precio_unitario: number
          total: number
          cliente_nombre?: string | null
          cliente_telefono?: string | null
          zona_delivery?: string | null
          estado?: string
          fecha_venta?: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          producto_id?: string | null
          cantidad?: number
          precio_unitario?: number
          total?: number
          cliente_nombre?: string | null
          cliente_telefono?: string | null
          zona_delivery?: string | null
          estado?: string
          fecha_venta?: string
          created_by?: string | null
          created_at?: string
        }
      }

      // 📦 MOVIMIENTOS DE STOCK
      stock_movimientos: {
        Row: {
          id: string
          producto_id: string
          tipo: 'entrada' | 'salida' | 'ajuste' | 'produccion' | 'venta'
          cantidad: number
          stock_anterior: number
          stock_nuevo: number
          motivo: string | null
          usuario_id: string | null
          venta_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          producto_id: string
          tipo: 'entrada' | 'salida' | 'ajuste' | 'produccion' | 'venta'
          cantidad: number
          stock_anterior: number
          stock_nuevo: number
          motivo?: string | null
          usuario_id?: string | null
          venta_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          producto_id?: string
          tipo?: 'entrada' | 'salida' | 'ajuste' | 'produccion' | 'venta'
          cantidad?: number
          stock_anterior?: number
          stock_nuevo?: number
          motivo?: string | null
          usuario_id?: string | null
          venta_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}


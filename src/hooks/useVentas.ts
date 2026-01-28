import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { useToast } from '@/hooks/use-toast'

type Venta = Database['public']['Tables']['ventas']['Row']
type VentaInsert = Database['public']['Tables']['ventas']['Insert']

// Hook para obtener todas las ventas (admin)
export const useVentas = () => {
  return useQuery({
    queryKey: ['ventas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ventas')
        .select(`
          *,
          venta_productos(
            id,
            cantidad,
            precio_unitario,
            subtotal,
            productos(nombre, imagen_url, categoria)
          )
        `)
        .order('fecha_venta', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

// Hook para obtener una venta por ID
export const useVenta = (id: string) => {
  return useQuery({
    queryKey: ['venta', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ventas')
        .select(`
          *,
          venta_productos(
            id,
            cantidad,
            precio_unitario,
            subtotal,
            productos(nombre, imagen_url, categoria)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

// Hook para actualizar estado de venta
export const useUpdateVenta = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('ventas')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] })
      queryClient.invalidateQueries({ queryKey: ['kpis-ventas'] })
      toast({
        title: '✅ Venta actualizada',
        description: 'Los cambios se han guardado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo actualizar la venta',
      })
    },
  })
}

// Hook para eliminar venta
export const useDeleteVenta = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ventas')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] })
      queryClient.invalidateQueries({ queryKey: ['kpis-ventas'] })
      toast({
        title: '✅ Venta eliminada',
        description: 'La venta se ha eliminado de la base de datos',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo eliminar la venta',
      })
    },
  })
}

// Hook para obtener KPIs de ventas
export const useKPIsVentas = (dias: number = 30) => {
  return useQuery({
    queryKey: ['kpis-ventas', dias],
    queryFn: async () => {
      const fechaInicio = new Date()
      fechaInicio.setDate(fechaInicio.getDate() - dias)

      const { data, error } = await supabase
        .from('ventas')
        .select(`
          *,
          venta_productos(cantidad)
        `)
        .gte('fecha_venta', fechaInicio.toISOString())
        .neq('estado', 'cancelado')

      if (error) throw error

      // Calcular KPIs
      const totalVentas = data.length
      const ingresosTotal = data.reduce((sum, v) => sum + Number(v.total), 0)
      const ticketPromedio = totalVentas > 0 ? ingresosTotal / totalVentas : 0
      
      // Calcular productos vendidos sumando de venta_productos
      const productosVendidos = data.reduce((sum, v) => {
        const productos = (v as any).venta_productos || []
        const cantidadProductos = productos.reduce((subSum: number, vp: any) => subSum + (vp.cantidad || 0), 0)
        // Compatibilidad: si no hay venta_productos, usar cantidad antigua
        return sum + (cantidadProductos || (v.cantidad || 0))
      }, 0)
      
      // Clientes únicos
      const clientesUnicos = new Set(data.map(v => v.cliente_telefono).filter(Boolean)).size

      // Ventas por estado
      const ventasPorEstado = data.reduce((acc, v) => {
        acc[v.estado] = (acc[v.estado] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return {
        totalVentas,
        ingresosTotal,
        ticketPromedio,
        productosVendidos,
        clientesUnicos,
        ventasPorEstado,
        ventas: data,
      }
    },
  })
}

// Hook para obtener productos más vendidos
export const useProductosMasVendidos = (limit: number = 5) => {
  return useQuery({
    queryKey: ['productos-mas-vendidos', limit],
    queryFn: async () => {
      // Primero obtener las ventas no canceladas
      const { data: ventas, error: errorVentas } = await supabase
        .from('ventas')
        .select('id')
        .neq('estado', 'cancelado')

      if (errorVentas) throw errorVentas

      const ventaIds = ventas?.map(v => v.id) || []

      if (ventaIds.length === 0) return []

      // Luego obtener los productos de esas ventas
      const { data, error } = await supabase
        .from('venta_productos')
        .select('producto_id, cantidad, productos(nombre, imagen_url)')
        .in('venta_id', ventaIds)

      if (error) throw error

      // Agrupar por producto y sumar cantidades
      const productosMap = new Map<string, any>()
      
      data.forEach((vp: any) => {
        if (!vp.producto_id) return
        
        const existing = productosMap.get(vp.producto_id)
        if (existing) {
          existing.cantidad_total += vp.cantidad
          existing.ventas_count += 1
        } else {
          productosMap.set(vp.producto_id, {
            producto_id: vp.producto_id,
            nombre: vp.productos?.nombre || 'Desconocido',
            imagen_url: vp.productos?.imagen_url,
            cantidad_total: vp.cantidad,
            ventas_count: 1,
          })
        }
      })

      // Convertir a array y ordenar
      const productos = Array.from(productosMap.values())
        .sort((a, b) => b.cantidad_total - a.cantidad_total)
        .slice(0, limit)

      return productos
    },
  })
}

// Hook para obtener estadísticas de stock
export const useStockStats = () => {
  return useQuery({
    queryKey: ['stock-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingredientes')
        .select('*')

      if (error) throw error

      const totalIngredientes = data.length
      const stockBajo = data.filter(i => i.stock_actual <= i.stock_minimo).length
      const sinStock = data.filter(i => i.stock_actual === 0).length
      const valorTotal = data.reduce((sum, i) => sum + (i.stock_actual * (i.costo_unitario || 0)), 0)

      return {
        totalIngredientes,
        stockBajo,
        sinStock,
        valorTotal,
        ingredientes: data,
      }
    },
  })
}

// Hook para crear venta
export const useCreateVenta = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (newVenta: VentaInsert & { productos?: Array<{ producto_id: string; cantidad: number; precio_unitario: number }> }) => {
      const { data: { user } } = await supabase.auth.getUser()
      const createdBy = user?.id ?? null

      // Extraer productos del objeto venta
      const { productos, ...ventaData } = newVenta

      // Si hay productos, crear la venta primero y luego los productos
      if (productos && productos.length > 0) {
        // 1. Crear la venta (sin producto_id, cantidad, precio_unitario; con created_by)
        const { data: venta, error: errorVenta } = await supabase
          .from('ventas')
          .insert([{
            ...ventaData,
            producto_id: null,
            cantidad: null,
            precio_unitario: null,
            created_by: createdBy,
          }])
          .select()
          .single()

        if (errorVenta) throw errorVenta

        // 2. Insertar los productos de la venta
        const productosInsert = productos.map(p => ({
          venta_id: venta.id,
          producto_id: p.producto_id,
          cantidad: p.cantidad,
          precio_unitario: p.precio_unitario,
        }))

        const { error: errorProductos } = await supabase
          .from('venta_productos')
          .insert(productosInsert)

        if (errorProductos) {
          // Si falla, eliminar la venta creada
          await supabase.from('ventas').delete().eq('id', venta.id)
          throw errorProductos
        }

        // 3. Obtener la venta completa con productos
        const { data: ventaCompleta, error: errorCompleta } = await supabase
          .from('ventas')
          .select('*')
          .eq('id', venta.id)
          .single()

        if (errorCompleta) throw errorCompleta

        return ventaCompleta as Venta
      } else {
        // Compatibilidad: Si no hay productos, crear venta como antes
        const { data, error } = await supabase
          .from('ventas')
          .insert([{ ...newVenta, created_by: createdBy }])
          .select()
          .single()

        if (error) throw error
        return data as Venta
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] })
      queryClient.invalidateQueries({ queryKey: ['kpis-ventas'] })
      toast({
        title: '✅ Venta registrada',
        description: 'La venta se ha guardado exitosamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo registrar la venta',
      })
    },
  })
}


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
        .select('*, productos(nombre, imagen_url, categoria)')
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
        .select('*, productos(nombre, imagen_url)')
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
        .select('*')
        .gte('fecha_venta', fechaInicio.toISOString())
        .neq('estado', 'cancelado')

      if (error) throw error

      // Calcular KPIs
      const totalVentas = data.length
      const ingresosTotal = data.reduce((sum, v) => sum + Number(v.total), 0)
      const ticketPromedio = totalVentas > 0 ? ingresosTotal / totalVentas : 0
      const productosVendidos = data.reduce((sum, v) => sum + v.cantidad, 0)
      
      // Clientes únicos
      const clientesUnicos = new Set(data.map(v => v.cliente_telefono)).size

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
      const { data, error } = await supabase
        .from('ventas')
        .select('producto_id, cantidad, productos(nombre, imagen_url)')
        .neq('estado', 'cancelado')

      if (error) throw error

      // Agrupar por producto y sumar cantidades
      const productosMap = new Map<string, any>()
      
      data.forEach((venta: any) => {
        if (!venta.producto_id) return
        
        const existing = productosMap.get(venta.producto_id)
        if (existing) {
          existing.cantidad_total += venta.cantidad
          existing.ventas_count += 1
        } else {
          productosMap.set(venta.producto_id, {
            producto_id: venta.producto_id,
            nombre: venta.productos?.nombre || 'Desconocido',
            imagen_url: venta.productos?.imagen_url,
            cantidad_total: venta.cantidad,
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
    mutationFn: async (newVenta: VentaInsert) => {
      const { data, error } = await supabase
        .from('ventas')
        .insert([newVenta])
        .select()
        .single()

      if (error) throw error
      return data as Venta
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


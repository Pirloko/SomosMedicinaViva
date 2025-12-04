import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { useToast } from '@/hooks/use-toast'

type ProductoIngrediente = Database['public']['Tables']['producto_ingredientes']['Row']
type ProductoIngredienteInsert = Database['public']['Tables']['producto_ingredientes']['Insert']

// Hook para obtener ingredientes de un producto
export const useProductoIngredientes = (productoId: string) => {
  return useQuery({
    queryKey: ['producto-ingredientes', productoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('producto_ingredientes')
        .select(`
          *,
          ingredientes (
            id,
            nombre,
            unidad_medida,
            costo_unitario,
            stock_actual
          )
        `)
        .eq('producto_id', productoId)

      if (error) throw error
      return data
    },
    enabled: !!productoId,
  })
}

// Hook para obtener el costo de un producto
export const useCostoProducto = (productoId: string) => {
  return useQuery({
    queryKey: ['costo-producto', productoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vista_costo_productos')
        .select('*')
        .eq('producto_id', productoId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    },
    enabled: !!productoId,
  })
}

// Hook para obtener todos los costos de productos
export const useCostosProductos = () => {
  return useQuery({
    queryKey: ['costos-productos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vista_costo_productos')
        .select('*')
        .order('margen_porcentaje', { ascending: false })

      if (error && error.code !== 'PGRST116') throw error
      return data || []
    },
  })
}

// Hook para asignar ingrediente a producto
export const useAsignarIngrediente = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: ProductoIngredienteInsert) => {
      const { data: result, error } = await supabase
        .from('producto_ingredientes')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return result as ProductoIngrediente
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['producto-ingredientes', variables.producto_id] })
      queryClient.invalidateQueries({ queryKey: ['costo-producto', variables.producto_id] })
      queryClient.invalidateQueries({ queryKey: ['costos-productos'] })
      toast({
        title: '✅ Ingrediente asignado',
        description: 'El ingrediente se ha agregado al producto',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo asignar el ingrediente',
      })
    },
  })
}

// Hook para actualizar cantidad de ingrediente
export const useActualizarCantidadIngrediente = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, cantidad, productoId }: { id: string; cantidad: number; productoId: string }) => {
      const { data, error } = await supabase
        .from('producto_ingredientes')
        .update({ cantidad_necesaria: cantidad })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, productoId }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['producto-ingredientes', result.productoId] })
      queryClient.invalidateQueries({ queryKey: ['costo-producto', result.productoId] })
      queryClient.invalidateQueries({ queryKey: ['costos-productos'] })
      toast({
        title: '✅ Cantidad actualizada',
        description: 'La cantidad del ingrediente se ha actualizado',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo actualizar la cantidad',
      })
    },
  })
}

// Hook para eliminar ingrediente de producto
export const useEliminarIngredienteDeProducto = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, productoId }: { id: string; productoId: string }) => {
      const { error } = await supabase
        .from('producto_ingredientes')
        .delete()
        .eq('id', id)

      if (error) throw error
      return productoId
    },
    onSuccess: (productoId) => {
      queryClient.invalidateQueries({ queryKey: ['producto-ingredientes', productoId] })
      queryClient.invalidateQueries({ queryKey: ['costo-producto', productoId] })
      queryClient.invalidateQueries({ queryKey: ['costos-productos'] })
      toast({
        title: '✅ Ingrediente eliminado',
        description: 'El ingrediente se ha quitado del producto',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo eliminar el ingrediente',
      })
    },
  })
}

// Hook para obtener ganancias de ventas
export const useGananciasVentas = (dias: number = 30) => {
  return useQuery({
    queryKey: ['ganancias-ventas', dias],
    queryFn: async () => {
      const fechaInicio = new Date()
      fechaInicio.setDate(fechaInicio.getDate() - dias)

      const { data, error } = await supabase
        .from('vista_ganancias_ventas')
        .select('*')
        .gte('fecha_venta', fechaInicio.toISOString())
        .order('fecha_venta', { ascending: false })

      if (error && error.code !== 'PGRST116') throw error
      return data || []
    },
  })
}

// Hook para obtener KPIs financieros
export const useKPIsFinancieros = (dias: number = 30) => {
  return useQuery({
    queryKey: ['kpis-financieros', dias],
    queryFn: async () => {
      const fechaInicio = new Date()
      fechaInicio.setDate(fechaInicio.getDate() - dias)

      const { data, error } = await supabase
        .from('vista_kpis_financieros')
        .select('*')
        .gte('fecha', fechaInicio.toISOString())

      if (error && error.code !== 'PGRST116') throw error
      
      if (!data || data.length === 0) return null

      // Sumar todos los KPIs del período
      const totales = data.reduce((acc, row) => ({
        total_ventas: (acc.total_ventas || 0) + (row.total_ventas || 0),
        ingresos_totales: (acc.ingresos_totales || 0) + (row.ingresos_totales || 0),
        costos_totales: (acc.costos_totales || 0) + (row.costos_totales || 0),
        ganancias_reales: (acc.ganancias_reales || 0) + (row.ganancias_reales || 0),
        clientes_unicos: Math.max(acc.clientes_unicos || 0, row.clientes_unicos || 0),
        productos_vendidos: (acc.productos_vendidos || 0) + (row.productos_vendidos || 0),
      }), {} as any)

      return {
        ...totales,
        ticket_promedio: totales.total_ventas > 0 ? totales.ingresos_totales / totales.total_ventas : 0,
        margen_promedio: totales.ingresos_totales > 0 ? (totales.ganancias_reales / totales.ingresos_totales * 100) : 0,
        datos_diarios: data,
      }
    },
  })
}


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

// Hook para registrar compra de ingrediente
export const useRegistrarCompra = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({
      ingrediente_id,
      cantidad,
      costo_unitario,
      proveedor,
      numero_factura,
      fecha_compra,
      notas,
    }: {
      ingrediente_id: string
      cantidad: number
      costo_unitario: number
      proveedor?: string
      numero_factura?: string
      fecha_compra?: string
      notas?: string
    }) => {
      const { data, error } = await supabase.rpc('registrar_compra_ingrediente', {
        p_ingrediente_id: ingrediente_id,
        p_cantidad: cantidad,
        p_costo_unitario: costo_unitario,
        p_proveedor: proveedor || null,
        p_numero_factura: numero_factura || null,
        p_fecha_compra: fecha_compra || new Date().toISOString().split('T')[0],
        p_notas: notas || null,
      } as any)

      if (error) {
        console.error('Error RPC:', error)
        throw new Error(error.message || 'Error al registrar compra')
      }
      return data
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      queryClient.invalidateQueries({ queryKey: ['ingredientes-admin'] })
      queryClient.invalidateQueries({ queryKey: ['ingredientes-criticos'] })
      queryClient.invalidateQueries({ queryKey: ['compras-ingredientes'] })
      
      toast({
        title: '✅ Compra registrada exitosamente',
        description: `Stock actualizado. Nuevo costo promedio: $${Math.round(data.costo_promedio_nuevo).toLocaleString('es-CL')}`,
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error al registrar compra',
        description: error.message || 'No se pudo registrar la compra',
      })
    },
  })
}

// Hook para obtener historial de compras
export const useComprasIngrediente = (ingrediente_id?: string) => {
  return useQuery({
    queryKey: ['compras-ingredientes', ingrediente_id],
    queryFn: async () => {
      let query = supabase
        .from('compras_ingredientes')
        .select('*')
        .order('created_at', { ascending: false })

      if (ingrediente_id) {
        query = query.eq('ingrediente_id', ingrediente_id)
      }

      const { data, error } = await query.limit(50)

      if (error) throw error
      return data
    },
    enabled: !!ingrediente_id || ingrediente_id === undefined,
  })
}

// Hook para obtener todas las compras (para exportar)
export const useAllCompras = () => {
  return useQuery({
    queryKey: ['compras-todas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compras_ingredientes')
        .select(`
          *,
          ingredientes (
            nombre,
            unidad_medida
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}


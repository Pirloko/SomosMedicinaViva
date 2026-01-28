import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { useToast } from '@/hooks/use-toast'

type Producto = Database['public']['Tables']['productos']['Row']
type StockMovimiento = Database['public']['Tables']['stock_movimientos']['Row']

// ============================================
// PRODUCTOS CRÍTICOS (Stock Bajo)
// ============================================

// Hook optimizado: Usa función SQL que filtra directamente en la BD
export const useProductosCriticos = () => {
  return useQuery({
    queryKey: ['productos-criticos'],
    queryFn: async () => {
      // Intentar usar la función SQL optimizada
      const { data, error } = await supabase.rpc('obtener_productos_criticos_completo')

      if (error) {
        // Fallback: si la función no existe, usar query tradicional
        console.warn('Función RPC no disponible, usando query tradicional:', error.message)
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('productos')
          .select('*')
          .eq('activo', true)
          .order('stock_disponible')

        if (fallbackError) throw fallbackError
        
        // Filtrar en cliente como fallback
        return (fallbackData as Producto[])
          .filter(prod => prod.stock_disponible <= prod.stock_minimo)
          .sort((a, b) => a.stock_disponible - b.stock_disponible)
      }
      
      return data as Producto[]
    },
    staleTime: 1000 * 60, // 1 minuto
  })
}

// ============================================
// REGISTRAR PRODUCCIÓN
// ============================================

export const useRegistrarProduccion = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ 
      producto_id, 
      cantidad, 
      motivo = 'Producción del día' 
    }: { 
      producto_id: string
      cantidad: number
      motivo?: string 
    }) => {
      // Llamar a la función de PostgreSQL
      const { data, error } = await supabase.rpc('registrar_produccion', {
        p_producto_id: producto_id,
        p_cantidad: cantidad,
        p_motivo: motivo,
      })

      if (error) {
        console.error('Error RPC:', error)
        throw new Error(error.message || 'Error al registrar producción')
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      queryClient.invalidateQueries({ queryKey: ['productos-admin'] })
      queryClient.invalidateQueries({ queryKey: ['productos-criticos'] })
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      queryClient.invalidateQueries({ queryKey: ['ingredientes-admin'] })
      queryClient.invalidateQueries({ queryKey: ['ingredientes-criticos'] })
      toast({
        title: '✅ Producción registrada',
        description: 'Stock de producto actualizado e ingredientes descontados',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error en producción',
        description: error.message || 'No se pudo registrar la producción. Verifica que haya suficientes ingredientes.',
      })
    },
  })
}

// ============================================
// AJUSTAR STOCK MANUAL
// ============================================

export const useAjustarStock = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ 
      producto_id, 
      nuevo_stock,
      motivo = 'Ajuste manual' 
    }: { 
      producto_id: string
      nuevo_stock: number
      motivo?: string 
    }) => {
      // Obtener stock actual
      const { data: producto, error: fetchError } = await supabase
        .from('productos')
        .select('stock_disponible')
        .eq('id', producto_id)
        .single()

      if (fetchError) throw fetchError

      const stock_anterior = producto.stock_disponible

      // Actualizar stock
      const { error: updateError } = await supabase
        .from('productos')
        .update({ 
          stock_disponible: nuevo_stock,
          updated_at: new Date().toISOString()
        })
        .eq('id', producto_id)

      if (updateError) throw updateError

      // Registrar movimiento
      await supabase
        .from('stock_movimientos')
        .insert({
          producto_id,
          tipo: 'ajuste',
          cantidad: nuevo_stock - stock_anterior,
          stock_anterior,
          stock_nuevo: nuevo_stock,
          motivo,
        })

      return { stock_anterior, stock_nuevo: nuevo_stock }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      queryClient.invalidateQueries({ queryKey: ['productos-admin'] })
      queryClient.invalidateQueries({ queryKey: ['productos-criticos'] })
      toast({
        title: '✅ Stock ajustado',
        description: 'El stock del producto se ha actualizado',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo ajustar el stock',
      })
    },
  })
}

// ============================================
// HISTORIAL DE MOVIMIENTOS
// ============================================

export const useMovimientosStock = (producto_id?: string) => {
  return useQuery({
    queryKey: ['stock-movimientos', producto_id],
    queryFn: async () => {
      let query = supabase
        .from('stock_movimientos')
        .select('*')
        .order('created_at', { ascending: false })

      if (producto_id) {
        query = query.eq('producto_id', producto_id)
      }

      const { data, error } = await query.limit(50)

      if (error) throw error
      return data as StockMovimiento[]
    },
    enabled: !!producto_id || producto_id === undefined,
  })
}


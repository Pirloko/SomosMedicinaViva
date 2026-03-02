import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { useToast } from '@/hooks/use-toast'

type DeliveryInfo = Database['public']['Tables']['delivery_info']['Row']
type DeliveryInfoUpdate = Database['public']['Tables']['delivery_info']['Update']

const DEFAULT_HORARIOS = 'Lunes a Viernes: 10:00 - 19:00 hrs\nSábados: 10:00 - 14:00 hrs'
const DEFAULT_COSTO = 'Desde $3.990 según zona\nEnvío gratis en compras sobre $40.000'
const DEFAULT_RETIRO = 'Disponible retiro sin costo\nCoordinar horario por WhatsApp'

/** Hook para obtener la info de la sección Delivery (público y admin) */
export const useDeliveryInfo = () => {
  return useQuery({
    queryKey: ['delivery-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_info')
        .select('*')
        .limit(1)
        .maybeSingle()

      if (error) throw error
      if (data) return data as DeliveryInfo
      return null
    },
    staleTime: 1000 * 60 * 5,
  })
}

/** Valores por defecto si no hay registro en BD */
export const getDefaultDeliveryInfo = (): { horarios_entrega: string; costo_envio_texto: string; punto_retiro_texto: string } => ({
  horarios_entrega: DEFAULT_HORARIOS,
  costo_envio_texto: DEFAULT_COSTO,
  punto_retiro_texto: DEFAULT_RETIRO,
})

/** Hook para actualizar la info (solo admin) */
export const useUpdateDeliveryInfo = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: DeliveryInfoUpdate }) => {
      const { data, error } = await supabase
        .from('delivery_info')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as DeliveryInfo
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-info'] })
      toast({
        title: '✅ Información guardada',
        description: 'Los textos de la sección Delivery se actualizaron correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo guardar',
      })
    },
  })
}

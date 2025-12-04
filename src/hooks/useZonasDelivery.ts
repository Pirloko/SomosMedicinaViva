import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { useToast } from '@/hooks/use-toast'

type ZonaDelivery = Database['public']['Tables']['zonas_delivery']['Row']
type ZonaDeliveryInsert = Database['public']['Tables']['zonas_delivery']['Insert']
type ZonaDeliveryUpdate = Database['public']['Tables']['zonas_delivery']['Update']

// Hook para obtener zonas activas (público)
export const useZonasDelivery = () => {
  return useQuery({
    queryKey: ['zonas-delivery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('zonas_delivery')
        .select('*')
        .eq('activo', true)
        .order('orden')

      if (error) throw error
      return data as ZonaDelivery[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para obtener todas las zonas (admin)
export const useAllZonasDelivery = () => {
  return useQuery({
    queryKey: ['zonas-delivery-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('zonas_delivery')
        .select('*')
        .order('orden')

      if (error) throw error
      return data as ZonaDelivery[]
    },
  })
}

// Hook para obtener una zona por ID
export const useZonaDelivery = (id: string) => {
  return useQuery({
    queryKey: ['zona-delivery', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('zonas_delivery')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as ZonaDelivery
    },
    enabled: !!id,
  })
}

// Hook para crear zona
export const useCreateZonaDelivery = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (newZona: ZonaDeliveryInsert) => {
      const { data, error } = await supabase
        .from('zonas_delivery')
        .insert([newZona])
        .select()
        .single()

      if (error) throw error
      return data as ZonaDelivery
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zonas-delivery'] })
      queryClient.invalidateQueries({ queryKey: ['zonas-delivery-admin'] })
      toast({
        title: '✅ Zona creada',
        description: 'La zona de delivery se ha agregado exitosamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo crear la zona',
      })
    },
  })
}

// Hook para actualizar zona
export const useUpdateZonaDelivery = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ZonaDeliveryUpdate }) => {
      const { data, error } = await supabase
        .from('zonas_delivery')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as ZonaDelivery
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zonas-delivery'] })
      queryClient.invalidateQueries({ queryKey: ['zonas-delivery-admin'] })
      toast({
        title: '✅ Zona actualizada',
        description: 'Los cambios se han guardado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo actualizar la zona',
      })
    },
  })
}

// Hook para eliminar zona (soft delete)
export const useDeleteZonaDelivery = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('zonas_delivery')
        .update({ activo: false })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zonas-delivery'] })
      queryClient.invalidateQueries({ queryKey: ['zonas-delivery-admin'] })
      toast({
        title: '✅ Zona desactivada',
        description: 'La zona se ha desactivado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo desactivar la zona',
      })
    },
  })
}

// Hook para eliminar zona permanentemente
export const useDeleteZonaDeliveryPermanentemente = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('zonas_delivery')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zonas-delivery'] })
      queryClient.invalidateQueries({ queryKey: ['zonas-delivery-admin'] })
      toast({
        title: '✅ Zona eliminada permanentemente',
        description: 'La zona se ha eliminado de la base de datos',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo eliminar la zona',
      })
    },
  })
}


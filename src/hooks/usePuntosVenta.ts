import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { useToast } from '@/hooks/use-toast'

type PuntoVenta = Database['public']['Tables']['puntos_venta']['Row']
type PuntoVentaInsert = Database['public']['Tables']['puntos_venta']['Insert']
type PuntoVentaUpdate = Database['public']['Tables']['puntos_venta']['Update']

// Hook para obtener puntos de venta activos (público)
export const usePuntosVenta = () => {
  return useQuery({
    queryKey: ['puntos-venta'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puntos_venta')
        .select('*')
        .eq('activo', true)
        .order('orden')

      if (error) throw error
      return data as PuntoVenta[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para obtener todos los puntos de venta (admin)
export const useAllPuntosVenta = () => {
  return useQuery({
    queryKey: ['puntos-venta-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puntos_venta')
        .select('*')
        .order('orden')

      if (error) throw error
      return data as PuntoVenta[]
    },
  })
}

// Hook para obtener un punto de venta por ID
export const usePuntoVenta = (id: string) => {
  return useQuery({
    queryKey: ['punto-venta', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puntos_venta')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as PuntoVenta
    },
    enabled: !!id,
  })
}

// Hook para crear punto de venta
export const useCreatePuntoVenta = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (newPunto: PuntoVentaInsert) => {
      const { data, error } = await supabase
        .from('puntos_venta')
        .insert([newPunto])
        .select()
        .single()

      if (error) throw error
      return data as PuntoVenta
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puntos-venta'] })
      queryClient.invalidateQueries({ queryKey: ['puntos-venta-admin'] })
      toast({
        title: '✅ Punto de venta creado',
        description: 'El punto de venta se ha agregado exitosamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo crear el punto de venta',
      })
    },
  })
}

// Hook para actualizar punto de venta
export const useUpdatePuntoVenta = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PuntoVentaUpdate }) => {
      const { data, error } = await supabase
        .from('puntos_venta')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as PuntoVenta
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puntos-venta'] })
      queryClient.invalidateQueries({ queryKey: ['puntos-venta-admin'] })
      toast({
        title: '✅ Punto de venta actualizado',
        description: 'Los cambios se han guardado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo actualizar el punto de venta',
      })
    },
  })
}

// Hook para eliminar punto de venta (soft delete)
export const useDeletePuntoVenta = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('puntos_venta')
        .update({ activo: false })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puntos-venta'] })
      queryClient.invalidateQueries({ queryKey: ['puntos-venta-admin'] })
      toast({
        title: '✅ Punto de venta desactivado',
        description: 'El punto de venta se ha desactivado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo desactivar el punto de venta',
      })
    },
  })
}

// Hook para eliminar punto de venta permanentemente
export const useDeletePuntoVentaPermanentemente = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('puntos_venta')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puntos-venta'] })
      queryClient.invalidateQueries({ queryKey: ['puntos-venta-admin'] })
      toast({
        title: '✅ Punto de venta eliminado permanentemente',
        description: 'El punto de venta se ha eliminado de la base de datos',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo eliminar el punto de venta',
      })
    },
  })
}


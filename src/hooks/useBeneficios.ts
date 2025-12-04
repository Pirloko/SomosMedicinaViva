import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { useToast } from '@/hooks/use-toast'

type Beneficio = Database['public']['Tables']['beneficios']['Row']
type BeneficioInsert = Database['public']['Tables']['beneficios']['Insert']
type BeneficioUpdate = Database['public']['Tables']['beneficios']['Update']

// Hook para obtener beneficios activos (público)
export const useBeneficios = () => {
  return useQuery({
    queryKey: ['beneficios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beneficios')
        .select('*')
        .eq('activo', true)
        .order('orden')

      if (error) throw error
      return data as Beneficio[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para obtener todos los beneficios (admin)
export const useAllBeneficios = () => {
  return useQuery({
    queryKey: ['beneficios-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beneficios')
        .select('*')
        .order('orden')

      if (error) throw error
      return data as Beneficio[]
    },
  })
}

// Hook para obtener un beneficio por ID
export const useBeneficio = (id: string) => {
  return useQuery({
    queryKey: ['beneficio', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beneficios')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Beneficio
    },
    enabled: !!id,
  })
}

// Hook para crear beneficio
export const useCreateBeneficio = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (newBeneficio: BeneficioInsert) => {
      const { data, error } = await supabase
        .from('beneficios')
        .insert([newBeneficio])
        .select()
        .single()

      if (error) throw error
      return data as Beneficio
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios'] })
      queryClient.invalidateQueries({ queryKey: ['beneficios-admin'] })
      toast({
        title: '✅ Beneficio creado',
        description: 'El beneficio se ha agregado exitosamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo crear el beneficio',
      })
    },
  })
}

// Hook para actualizar beneficio
export const useUpdateBeneficio = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: BeneficioUpdate }) => {
      const { data, error } = await supabase
        .from('beneficios')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Beneficio
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios'] })
      queryClient.invalidateQueries({ queryKey: ['beneficios-admin'] })
      toast({
        title: '✅ Beneficio actualizado',
        description: 'Los cambios se han guardado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo actualizar el beneficio',
      })
    },
  })
}

// Hook para eliminar beneficio (soft delete)
export const useDeleteBeneficio = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('beneficios')
        .update({ activo: false })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios'] })
      queryClient.invalidateQueries({ queryKey: ['beneficios-admin'] })
      toast({
        title: '✅ Beneficio desactivado',
        description: 'El beneficio se ha desactivado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo desactivar el beneficio',
      })
    },
  })
}

// Hook para eliminar beneficio permanentemente
export const useDeleteBeneficioPermanentemente = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('beneficios')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios'] })
      queryClient.invalidateQueries({ queryKey: ['beneficios-admin'] })
      toast({
        title: '✅ Beneficio eliminado permanentemente',
        description: 'El beneficio se ha eliminado de la base de datos',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo eliminar el beneficio',
      })
    },
  })
}


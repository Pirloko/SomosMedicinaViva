import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { useToast } from '@/hooks/use-toast'

type AboutContent = Database['public']['Tables']['about_content']['Row']
type AboutContentUpdate = Database['public']['Tables']['about_content']['Update']
type AboutValue = Database['public']['Tables']['about_values']['Row']
type AboutValueInsert = Database['public']['Tables']['about_values']['Insert']
type AboutValueUpdate = Database['public']['Tables']['about_values']['Update']

// ============================================
// HOOKS PARA ABOUT CONTENT (Contenido Principal)
// ============================================

// Hook para obtener el contenido principal
export const useAboutContent = () => {
  return useQuery({
    queryKey: ['about-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .single()

      if (error) throw error
      return data as AboutContent
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para actualizar el contenido principal
export const useUpdateAboutContent = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: AboutContentUpdate }) => {
      const { data, error } = await supabase
        .from('about_content')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as AboutContent
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-content'] })
      toast({
        title: '✅ Contenido actualizado',
        description: 'Los cambios se han guardado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo actualizar el contenido',
      })
    },
  })
}

// ============================================
// HOOKS PARA ABOUT VALUES (Valores/Etiquetas)
// ============================================

// Hook para obtener valores activos (público)
export const useAboutValues = () => {
  return useQuery({
    queryKey: ['about-values'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_values')
        .select('*')
        .eq('activo', true)
        .order('orden')

      if (error) throw error
      return data as AboutValue[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para obtener todos los valores (admin)
export const useAllAboutValues = () => {
  return useQuery({
    queryKey: ['about-values-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_values')
        .select('*')
        .order('orden')

      if (error) throw error
      return data as AboutValue[]
    },
  })
}

// Hook para crear valor
export const useCreateAboutValue = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (newValue: AboutValueInsert) => {
      const { data, error } = await supabase
        .from('about_values')
        .insert(newValue as any)
        .select()
        .single()

      if (error) throw error
      return data as AboutValue
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-values'] })
      queryClient.invalidateQueries({ queryKey: ['about-values-admin'] })
      toast({
        title: '✅ Valor agregado',
        description: 'El valor se ha creado exitosamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo crear el valor',
      })
    },
  })
}

// Hook para actualizar valor
export const useUpdateAboutValue = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: AboutValueUpdate }) => {
      const { data, error } = await supabase
        .from('about_values')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as AboutValue
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-values'] })
      queryClient.invalidateQueries({ queryKey: ['about-values-admin'] })
      toast({
        title: '✅ Valor actualizado',
        description: 'Los cambios se han guardado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo actualizar el valor',
      })
    },
  })
}

// Hook para activar/desactivar valor
export const useToggleAboutValueActivo = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, activo }: { id: string; activo: boolean }) => {
      const { data, error } = await supabase
        .from('about_values')
        .update({ activo } as any)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as AboutValue
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['about-values'] })
      queryClient.invalidateQueries({ queryKey: ['about-values-admin'] })
      toast({
        title: data.activo ? '✅ Valor activado' : '✅ Valor desactivado',
        description: data.activo 
          ? 'El valor se mostrará en la página'
          : 'El valor se ha ocultado',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo cambiar el estado',
      })
    },
  })
}

// Hook para eliminar valor
export const useDeleteAboutValue = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('about_values')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-values'] })
      queryClient.invalidateQueries({ queryKey: ['about-values-admin'] })
      toast({
        title: '✅ Valor eliminado',
        description: 'El valor se ha eliminado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo eliminar el valor',
      })
    },
  })
}


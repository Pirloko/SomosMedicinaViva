import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { useToast } from '@/hooks/use-toast'

type Categoria = Database['public']['Tables']['categorias']['Row']
type CategoriaInsert = Database['public']['Tables']['categorias']['Insert']
type CategoriaUpdate = Database['public']['Tables']['categorias']['Update']

// Hook para obtener categorías activas (público)
export const useCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('activo', true)
        .order('orden')

      if (error) throw error
      return data as Categoria[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para obtener todas las categorías (admin)
export const useAllCategorias = () => {
  return useQuery({
    queryKey: ['categorias-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('orden')

      if (error) throw error
      return data as Categoria[]
    },
  })
}

// Hook para obtener una categoría por ID
export const useCategoria = (id: string) => {
  return useQuery({
    queryKey: ['categoria', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Categoria
    },
    enabled: !!id,
  })
}

// Hook para crear categoría
export const useCreateCategoria = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (newCategoria: CategoriaInsert) => {
      const { data, error } = await supabase
        .from('categorias')
        .insert([newCategoria])
        .select()
        .single()

      if (error) throw error
      return data as Categoria
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      queryClient.invalidateQueries({ queryKey: ['categorias-admin'] })
      toast({
        title: '✅ Categoría creada',
        description: 'La categoría se ha agregado exitosamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo crear la categoría',
      })
    },
  })
}

// Hook para actualizar categoría
export const useUpdateCategoria = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: CategoriaUpdate }) => {
      const { data, error } = await supabase
        .from('categorias')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Categoria
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      queryClient.invalidateQueries({ queryKey: ['categorias-admin'] })
      toast({
        title: '✅ Categoría actualizada',
        description: 'Los cambios se han guardado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo actualizar la categoría',
      })
    },
  })
}

// Hook para activar/desactivar categoría
export const useToggleCategoriaActivo = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, activo }: { id: string; activo: boolean }) => {
      const { data, error } = await supabase
        .from('categorias')
        .update({ activo })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Categoria
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      queryClient.invalidateQueries({ queryKey: ['categorias-admin'] })
      toast({
        title: data.activo ? '✅ Categoría activada' : '✅ Categoría desactivada',
        description: data.activo 
          ? 'La categoría se mostrará en el catálogo'
          : 'La categoría se ha ocultado del catálogo',
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

// Hook para eliminar categoría permanentemente
export const useDeleteCategoria = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      queryClient.invalidateQueries({ queryKey: ['categorias-admin'] })
      toast({
        title: '✅ Categoría eliminada',
        description: 'La categoría se ha eliminado de la base de datos',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo eliminar la categoría. Puede tener productos asignados.',
      })
    },
  })
}


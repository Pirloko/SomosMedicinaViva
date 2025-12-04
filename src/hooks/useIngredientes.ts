import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { useToast } from '@/hooks/use-toast'

type Ingrediente = Database['public']['Tables']['ingredientes']['Row']
type IngredienteInsert = Database['public']['Tables']['ingredientes']['Insert']
type IngredienteUpdate = Database['public']['Tables']['ingredientes']['Update']

// Hook para obtener ingredientes activos (público)
export const useIngredientes = () => {
  return useQuery({
    queryKey: ['ingredientes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingredientes')
        .select('*')
        .eq('activo', true)
        .order('nombre')

      if (error) throw error
      return data as Ingrediente[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para obtener todos los ingredientes (admin)
export const useAllIngredientes = () => {
  return useQuery({
    queryKey: ['ingredientes-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingredientes')
        .select('*')
        .order('nombre')

      if (error) throw error
      return data as Ingrediente[]
    },
  })
}

// Hook para obtener ingredientes con stock crítico
export const useIngredientesCriticos = () => {
  return useQuery({
    queryKey: ['ingredientes-criticos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingredientes')
        .select('*')
        .filter('activo', 'eq', true)
        .order('stock_actual')

      if (error) throw error
      
      // Filtrar ingredientes donde stock_actual <= stock_minimo
      const ingredientesCriticos = (data as Ingrediente[]).filter(
        ing => ing.stock_actual <= ing.stock_minimo
      )
      
      return ingredientesCriticos
    },
    staleTime: 1000 * 60, // 1 minuto - se actualiza frecuentemente
  })
}

// Hook para obtener un ingrediente por ID
export const useIngrediente = (id: string) => {
  return useQuery({
    queryKey: ['ingrediente', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingredientes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Ingrediente
    },
    enabled: !!id,
  })
}

// Hook para crear ingrediente
export const useCreateIngrediente = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (newIngrediente: IngredienteInsert) => {
      const { data, error } = await supabase
        .from('ingredientes')
        .insert([newIngrediente])
        .select()
        .single()

      if (error) throw error
      return data as Ingrediente
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      queryClient.invalidateQueries({ queryKey: ['ingredientes-admin'] })
      toast({
        title: '✅ Ingrediente creado',
        description: 'El ingrediente se ha agregado exitosamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo crear el ingrediente',
      })
    },
  })
}

// Hook para actualizar ingrediente
export const useUpdateIngrediente = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: IngredienteUpdate }) => {
      const { data, error } = await supabase
        .from('ingredientes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Ingrediente
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      queryClient.invalidateQueries({ queryKey: ['ingredientes-admin'] })
      toast({
        title: '✅ Ingrediente actualizado',
        description: 'Los cambios se han guardado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo actualizar el ingrediente',
      })
    },
  })
}

// Hook para eliminar ingrediente (soft delete)
export const useDeleteIngrediente = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ingredientes')
        .update({ activo: false })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      queryClient.invalidateQueries({ queryKey: ['ingredientes-admin'] })
      toast({
        title: '✅ Ingrediente desactivado',
        description: 'El ingrediente se ha desactivado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo desactivar el ingrediente',
      })
    },
  })
}

// Hook para eliminar ingrediente permanentemente
export const useDeleteIngredientePermanentemente = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ingredientes')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      queryClient.invalidateQueries({ queryKey: ['ingredientes-admin'] })
      toast({
        title: '✅ Ingrediente eliminado permanentemente',
        description: 'El ingrediente se ha eliminado de la base de datos',
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

// Hook para activar/desactivar ingrediente
export const useToggleIngredienteActivo = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, activo }: { id: string; activo: boolean }) => {
      const { data, error } = await supabase
        .from('ingredientes')
        .update({ activo })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Ingrediente
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      queryClient.invalidateQueries({ queryKey: ['ingredientes-admin'] })
      toast({
        title: data.activo ? '✅ Ingrediente activado' : '✅ Ingrediente desactivado',
        description: data.activo 
          ? 'El ingrediente se mostrará en la sección pública'
          : 'El ingrediente se ha ocultado de la sección pública',
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


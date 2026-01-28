import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { useToast } from '@/hooks/use-toast'

type HeroImagen = Database['public']['Tables']['hero_imagenes']['Row']
type HeroImagenInsert = Database['public']['Tables']['hero_imagenes']['Insert']
type HeroImagenUpdate = Database['public']['Tables']['hero_imagenes']['Update']

// Hook para obtener imágenes activas del hero (público)
export const useHeroImagenes = () => {
  return useQuery({
    queryKey: ['hero-imagenes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_imagenes')
        .select('*')
        .eq('activo', true)
        .order('orden')

      if (error) throw error
      return data as HeroImagen[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para obtener todas las imágenes (admin)
export const useAllHeroImagenes = () => {
  return useQuery({
    queryKey: ['hero-imagenes-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_imagenes')
        .select('*')
        .order('orden')

      if (error) throw error
      return data as HeroImagen[]
    },
  })
}

// Hook para crear imagen
export const useCreateHeroImagen = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (newImagen: HeroImagenInsert) => {
      const { data, error } = await supabase
        .from('hero_imagenes')
        .insert(newImagen as any)
        .select()
        .single()

      if (error) throw error
      return data as HeroImagen
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-imagenes'] })
      queryClient.invalidateQueries({ queryKey: ['hero-imagenes-admin'] })
      toast({
        title: '✅ Imagen agregada',
        description: 'La imagen se ha agregado a la portada',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo agregar la imagen',
      })
    },
  })
}

// Hook para actualizar imagen
export const useUpdateHeroImagen = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: HeroImagenUpdate }) => {
      const { data, error } = await supabase
        .from('hero_imagenes')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as HeroImagen
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-imagenes'] })
      queryClient.invalidateQueries({ queryKey: ['hero-imagenes-admin'] })
      toast({
        title: '✅ Imagen actualizada',
        description: 'Los cambios se han guardado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo actualizar la imagen',
      })
    },
  })
}

// Hook para activar/desactivar imagen
export const useToggleHeroImagenActivo = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, activo }: { id: string; activo: boolean }) => {
      const { data, error } = await supabase
        .from('hero_imagenes')
        .update({ activo } as any)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as HeroImagen
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hero-imagenes'] })
      queryClient.invalidateQueries({ queryKey: ['hero-imagenes-admin'] })
      toast({
        title: data.activo ? '✅ Imagen activada' : '✅ Imagen desactivada',
        description: data.activo 
          ? 'La imagen se mostrará en la portada de la web'
          : 'La imagen se ha ocultado de la portada',
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

// Hook para eliminar imagen
export const useDeleteHeroImagen = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hero_imagenes')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-imagenes'] })
      queryClient.invalidateQueries({ queryKey: ['hero-imagenes-admin'] })
      toast({
        title: '✅ Imagen eliminada',
        description: 'La imagen se ha eliminado de la portada',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo eliminar la imagen',
      })
    },
  })
}


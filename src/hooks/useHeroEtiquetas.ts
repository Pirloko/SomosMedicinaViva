import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { useToast } from '@/hooks/use-toast'

export type HeroEtiquetas = Database['public']['Tables']['hero_etiquetas']['Row']
export type HeroEtiquetasUpdate = Database['public']['Tables']['hero_etiquetas']['Update']

const DEFAULT: Omit<HeroEtiquetas, 'id' | 'created_at' | 'updated_at'> = {
  floating_1_label: 'Sin Azúcar',
  floating_1_value: '100%',
  floating_2_label: 'Vegano',
  floating_2_value: '🌱',
  feature_1_icon: 'Heart',
  feature_1_text: 'Apto diabéticos',
  feature_2_icon: 'Leaf',
  feature_2_text: 'Vegano',
  feature_3_icon: 'Sparkles',
  feature_3_text: 'Sin gluten',
  subheadline: 'Sin azúcar · Sin gluten · Sin refinados · 100% Vegana',
  fondo_url: null,
}

/** Hook para obtener las etiquetas del Hero (público y admin) */
export const useHeroEtiquetas = () => {
  return useQuery({
    queryKey: ['hero-etiquetas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_etiquetas')
        .select('*')
        .limit(1)
        .maybeSingle()

      if (error) throw error
      if (data) return data as HeroEtiquetas
      return null
    },
    staleTime: 1000 * 60 * 5,
  })
}

/** Valores por defecto si no hay registro en BD */
export const getDefaultHeroEtiquetas = () => ({ ...DEFAULT })

/** Hook para actualizar las etiquetas (solo admin) */
export const useUpdateHeroEtiquetas = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: HeroEtiquetasUpdate }) => {
      const { data, error } = await supabase
        .from('hero_etiquetas')
        .update(updates as Record<string, unknown>)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as HeroEtiquetas
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-etiquetas'] })
      toast({
        title: '✅ Guardado',
        description: 'Etiquetas e imagen de fondo guardados. Actualiza la página principal (F5) para ver el nuevo fondo.',
      })
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo guardar',
      })
    },
  })
}

/** Hook para actualizar solo la imagen de fondo del sitio (solo admin) */
export const useUpdateHeroFondo = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, fondo_url }: { id: string; fondo_url: string | null }) => {
      const { data, error } = await supabase
        .from('hero_etiquetas')
        .update({ fondo_url } as Record<string, unknown>)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as HeroEtiquetas
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-etiquetas'] })
      toast({
        title: '✅ Imagen de fondo guardada',
        description: 'Actualiza la página principal (F5) para ver el cambio.',
      })
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo guardar el fondo',
      })
    },
  })
}

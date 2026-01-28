import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { useToast } from '@/hooks/use-toast'

type Contacto = Database['public']['Tables']['contactos']['Row']
type ContactoInsert = Database['public']['Tables']['contactos']['Insert']
type ContactoUpdate = Database['public']['Tables']['contactos']['Update']

// Hook para obtener todos los contactos (admin)
export const useContactos = () => {
  return useQuery({
    queryKey: ['contactos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contactos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Contacto[]
    },
  })
}

// Hook para obtener contactos no leídos (admin)
export const useContactosNoLeidos = () => {
  return useQuery({
    queryKey: ['contactos-no-leidos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contactos')
        .select('*')
        .eq('leido', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Contacto[]
    },
  })
}

// Hook optimizado para obtener solo el conteo de contactos pendientes
export const useContactosPendientesCount = () => {
  return useQuery({
    queryKey: ['contactos-pendientes-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('contactos')
        .select('*', { count: 'exact', head: true })
        .eq('respondido', false)

      if (error) throw error
      return count || 0
    },
    staleTime: 1000 * 30, // 30 segundos - se actualiza frecuentemente
  })
}

// Hook optimizado para obtener solo el conteo de contactos no leídos
export const useContactosNoLeidosCount = () => {
  return useQuery({
    queryKey: ['contactos-no-leidos-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('contactos')
        .select('*', { count: 'exact', head: true })
        .eq('leido', false)

      if (error) throw error
      return count || 0
    },
    staleTime: 1000 * 30, // 30 segundos
  })
}

// Hook optimizado para obtener solo los primeros 3 contactos pendientes (para preview)
export const useContactosPendientesPreview = () => {
  return useQuery({
    queryKey: ['contactos-pendientes-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contactos')
        .select('id, nombre, mensaje, leido, respondido, created_at')
        .eq('respondido', false)
        .order('created_at', { ascending: false })
        .limit(3)

      if (error) throw error
      // Retornar con tipo completo incluyendo respondido
      return (data || []) as Contacto[]
    },
    staleTime: 1000 * 30, // 30 segundos
  })
}

// Hook para crear contacto (público)
export const useCreateContacto = () => {
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (newContacto: ContactoInsert) => {
      // @ts-ignore - Tipo de Supabase necesita actualización
      const { data, error } = await supabase
        .from('contactos')
        .insert([newContacto])
        .select()
        .single()

      if (error) throw error
      return data as Contacto
    },
    onSuccess: () => {
      toast({
        title: '✅ Mensaje enviado',
        description: 'Nos pondremos en contacto contigo pronto',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo enviar el mensaje',
      })
    },
  })
}

// Hook para marcar contacto como leído (admin)
export const useMarcarContactoLeido = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, leido }: { id: string; leido: boolean }) => {
      // @ts-ignore - Tipo de Supabase necesita actualización
      const { data, error } = await supabase
        .from('contactos')
        .update({ leido })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Contacto
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactos'] })
      queryClient.invalidateQueries({ queryKey: ['contactos-no-leidos'] })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo actualizar el contacto',
      })
    },
  })
}

// Hook para actualizar contacto (admin - para notas)
export const useUpdateContacto = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ContactoUpdate }) => {
      // @ts-ignore - Tipo de Supabase necesita actualización
      const { data, error } = await supabase
        .from('contactos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Contacto
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactos'] })
      toast({
        title: '✅ Contacto actualizado',
        description: 'Los cambios se han guardado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo actualizar el contacto',
      })
    },
  })
}


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { useToast } from '@/hooks/use-toast'

type Product = Database['public']['Tables']['productos']['Row']
type ProductInsert = Database['public']['Tables']['productos']['Insert']
type ProductUpdate = Database['public']['Tables']['productos']['Update']

// Hook para obtener todos los productos
export const useProducts = (categoria?: string) => {
  return useQuery({
    queryKey: ['productos', categoria],
    queryFn: async () => {
      let query = supabase
        .from('productos')
        .select('*')
        .eq('activo', true)
        .order('created_at', { ascending: false })

      if (categoria && categoria !== 'all') {
        query = query.eq('categoria', categoria)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error al obtener productos:', error)
        throw error
      }

      return data as Product[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para obtener un producto por ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['producto', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Product
    },
    enabled: !!id,
  })
}

// Hook para obtener todos los productos (admin - incluye inactivos)
export const useAllProducts = () => {
  return useQuery({
    queryKey: ['productos-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Product[]
    },
  })
}

// Hook para crear producto
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (newProduct: ProductInsert) => {
      const { data, error } = await supabase
        .from('productos')
        .insert([newProduct])
        .select()
        .single()

      if (error) throw error
      return data as Product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      queryClient.invalidateQueries({ queryKey: ['productos-admin'] })
      toast({
        title: '✅ Producto creado',
        description: 'El producto se ha agregado exitosamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo crear el producto',
      })
    },
  })
}

// Hook para actualizar producto
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProductUpdate }) => {
      const { data, error } = await supabase
        .from('productos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      queryClient.invalidateQueries({ queryKey: ['productos-admin'] })
      toast({
        title: '✅ Producto actualizado',
        description: 'Los cambios se han guardado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo actualizar el producto',
      })
    },
  })
}

// Hook para eliminar producto (soft delete)
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('productos')
        .update({ activo: false })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      queryClient.invalidateQueries({ queryKey: ['productos-admin'] })
      toast({
        title: '✅ Producto eliminado',
        description: 'El producto se ha desactivado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo eliminar el producto',
      })
    },
  })
}

// Hook para eliminar permanentemente un producto
export const useDeleteProductPermanently = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      queryClient.invalidateQueries({ queryKey: ['productos-admin'] })
      toast({
        title: '✅ Producto eliminado permanentemente',
        description: 'El producto se ha eliminado de la base de datos',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error',
        description: error.message || 'No se pudo eliminar el producto',
      })
    },
  })
}

// Hook para activar/desactivar producto
export const useToggleProductoActivo = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, activo }: { id: string; activo: boolean }) => {
      const { data, error } = await supabase
        .from('productos')
        .update({ activo })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Product
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      queryClient.invalidateQueries({ queryKey: ['productos-admin'] })
      toast({
        title: data.activo ? '✅ Producto activado' : '✅ Producto desactivado',
        description: data.activo 
          ? 'El producto se mostrará en el catálogo público'
          : 'El producto se ha ocultado del catálogo público',
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


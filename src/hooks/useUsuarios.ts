import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

// ============================================
// TIPOS
// ============================================

export interface UsuarioRol {
  id: string
  user_id: string
  rol: 'admin' | 'vendedor'
  nombre_usuario: string
  activo: boolean
  created_at: string
  updated_at: string
  email?: string
}

// ============================================
// OBTENER TODOS LOS USUARIOS (SOLO ADMINS)
// ============================================

export const useUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vista_usuarios_roles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as UsuarioRol[]
    },
  })
}

// ============================================
// CREAR USUARIO VENDEDOR
// ============================================

export const useCrearUsuarioVendedor = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({
      email,
      password,
      nombre_usuario,
    }: {
      email: string
      password: string
      nombre_usuario: string
    }) => {
      // Obtener el usuario actual (debe ser admin)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No estás autenticado')

      // Crear usuario usando signUp
      // Nota: En desarrollo, esto requiere confirmación de email
      // Para producción sin confirmación, usa una Edge Function (ver SISTEMA_USUARIOS_VENDEDORES.md)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          email_redirect_to: `${window.location.origin}/login`,
          data: {
            nombre_usuario,
            rol: 'vendedor',
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('No se pudo crear el usuario')

      // Esperar un momento para que el usuario se cree en la base de datos
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Asignar rol usando la función RPC
      const { data: rolData, error: rolError } = await supabase.rpc('asignar_rol_usuario', {
        p_user_id: authData.user.id,
        p_rol: 'vendedor',
        p_nombre_usuario: nombre_usuario,
        p_created_by: user.id,
      })

      if (rolError) {
        // Si falla la función RPC, intentar insert directo
        const { data: directInsert, error: directError } = await supabase
          .from('usuarios_roles')
          .insert({
            user_id: authData.user.id,
            rol: 'vendedor',
            nombre_usuario,
            activo: true,
            created_by: user.id,
          })
          .select()
          .single()

        if (directError) {
          throw new Error(`Error al asignar rol: ${directError.message}`)
        }
        return directInsert
      }

      return rolData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      toast({
        title: '✅ Usuario vendedor creado',
        description: 'El vendedor puede iniciar sesión con su email y contraseña',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error al crear usuario',
        description: error.message || 'No se pudo crear el usuario vendedor',
      })
    },
  })
}

// ============================================
// ACTUALIZAR USUARIO
// ============================================

export const useActualizarUsuario = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({
      id,
      nombre_usuario,
      activo,
    }: {
      id: string
      nombre_usuario?: string
      activo?: boolean
    }) => {
      const updates: any = {}
      if (nombre_usuario !== undefined) updates.nombre_usuario = nombre_usuario
      if (activo !== undefined) updates.activo = activo

      const { data, error } = await supabase
        .from('usuarios_roles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      toast({
        title: '✅ Usuario actualizado',
        description: 'Los cambios se han guardado correctamente',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error al actualizar',
        description: error.message || 'No se pudo actualizar el usuario',
      })
    },
  })
}

// ============================================
// ELIMINAR/DESACTIVAR USUARIO
// ============================================

export const useEliminarUsuario = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, user_id }: { id: string; user_id: string }) => {
      // Desactivar el rol
      const { error: rolError } = await supabase
        .from('usuarios_roles')
        .update({ activo: false })
        .eq('id', id)

      if (rolError) throw rolError

      // Eliminar el usuario de auth (opcional, puedes solo desactivarlo)
      // await supabase.auth.admin.deleteUser(user_id)

      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      toast({
        title: '✅ Usuario desactivado',
        description: 'El usuario ya no puede acceder al sistema',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: '❌ Error al eliminar',
        description: error.message || 'No se pudo eliminar el usuario',
      })
    },
  })
}

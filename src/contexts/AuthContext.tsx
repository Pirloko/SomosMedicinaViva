import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  role: 'admin' | 'vendedor' | null
  signIn: (email: string, password: string) => Promise<'admin' | 'vendedor'>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/** Único usuario administrador. Solo este email tiene rol admin. */
const ADMIN_EMAIL = 'smv.informaciones@gmail.com'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<'admin' | 'vendedor' | null>(null)
  const { toast } = useToast()
  const fetchingRoleRef = useRef<Set<string>>(new Set()) // Para evitar llamadas duplicadas

  const isAdminEmail = (email: string | undefined) => email?.toLowerCase() === ADMIN_EMAIL

  // Función para obtener el rol del usuario (nunca devuelve admin salvo para ADMIN_EMAIL)
  const fetchUserRole = async (userId: string, userEmail?: string): Promise<'admin' | 'vendedor'> => {
    if (userEmail && isAdminEmail(userEmail)) {
      setRole('admin')
      return 'admin'
    }
    // Evitar llamadas duplicadas para el mismo usuario
    if (fetchingRoleRef.current.has(userId)) {
      console.log('Ya se está obteniendo el rol para este usuario, esperando...')
      await new Promise(resolve => setTimeout(resolve, 500))
      return role || 'vendedor'
    }
    
    fetchingRoleRef.current.add(userId)
    
    try {
      console.log('🔍 Obteniendo rol para usuario:', userId)
      
      // Intentar primero con la función RPC (más rápida y evita problemas de RLS)
      try {
        const rpcCall = supabase.rpc as any
        const { data: rpcData, error: rpcError } = await rpcCall('obtener_rol_usuario', {
          p_user_id: userId
        })
        
        if (!rpcError && rpcData) {
          const userRole = (rpcData === 'admin' ? 'admin' : 'vendedor') as 'admin' | 'vendedor'
          console.log('✅ Rol obtenido mediante RPC:', userRole)
          setRole(userRole)
          return userRole
        }
      } catch (rpcErr: any) {
        console.warn('⚠️ Error con RPC, intentando consulta directa:', rpcErr.message)
      }
      
      // Si falla RPC, intentar consulta directa con timeout corto (3 segundos)
      const { data, error } = await Promise.race([
        supabase
          .from('usuarios_roles')
          .select('rol')
          .eq('user_id', userId)
          .eq('activo', true)
          .maybeSingle(),
        new Promise<{ data: null; error: { code: string; message: string } }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: { code: 'TIMEOUT', message: 'Timeout' } }), 3000)
        )
      ])

      console.log('📊 Resultado de la consulta directa:', { data, error: error?.code || error?.message })

      // Si hay un error
      if (error) {
        // PGRST116 = no rows returned (esto es normal si el usuario no tiene rol)
        if (error.code === 'PGRST116') {
          console.warn('⚠️ Usuario sin rol asignado en la tabla, usando vendedor por defecto')
          setRole('vendedor')
          return 'vendedor'
        }
        
        // 42P01 = tabla no existe
        if (error.code === '42P01') {
          console.warn('⚠️ Tabla usuarios_roles no existe, usando vendedor por defecto')
          setRole('vendedor')
          return 'vendedor'
        }
        
        // TIMEOUT o error 500 - usar vendedor por defecto (más seguro que admin)
        if (error.code === 'TIMEOUT' || error.message?.includes('500') || error.message?.includes('permission denied')) {
          console.warn('⚠️ Timeout o error accediendo a usuarios_roles, usando vendedor por defecto:', error.message || error.code)
          setRole('vendedor')
          return 'vendedor'
        }
        
        // Cualquier otro error - usar vendedor por defecto
        console.warn('⚠️ Error al obtener rol, usando vendedor por defecto:', error.message || error.code)
        setRole('vendedor')
        return 'vendedor'
      }

      // Si tiene rol asignado, usarlo
      const roleData = data as { rol: string } | null
      if (roleData?.rol) {
        const userRole = (roleData.rol === 'admin' ? 'admin' : 'vendedor') as 'admin' | 'vendedor'
        console.log('✅ Rol obtenido correctamente:', userRole)
        setRole(userRole)
        return userRole
      } else {
        // Si no tiene rol, asignar vendedor por defecto (más seguro)
        console.warn('⚠️ Usuario sin rol asignado, asignando vendedor por defecto')
        setRole('vendedor')
        return 'vendedor'
      }
    } catch (error: any) {
      // Cualquier excepción no capturada - NO asignar admin por defecto automáticamente
      console.error('❌ Excepción al obtener rol:', error?.message || 'Error desconocido')
      // Si ya hay un rol en el estado, mantenerlo, sino lanzar error
      if (role) {
        console.log('🔄 Manteniendo rol actual del estado:', role)
        return role
      }
      // Si no hay rol y hay error, solo asignar admin si es un error de "no existe"
      throw error
    } finally {
      // Remover el userId del set después de un delay para permitir reintentos si es necesario
      setTimeout(() => {
        fetchingRoleRef.current.delete(userId)
      }, 5000)
    }
  }

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        if (isAdminEmail(session.user.email)) {
          setRole('admin')
        } else {
          await fetchUserRole(session.user.id, session.user.email)
        }
      } else {
        setRole(null)
      }
      setLoading(false)
    })

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        if (isAdminEmail(session.user.email)) {
          setRole('admin')
        } else {
          await fetchUserRole(session.user.id, session.user.email)
        }
      } else {
        setRole(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<'admin' | 'vendedor'> => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setSession(data.session)
      setUser(data.user)
      
      // ÚNICO ADMIN: smv.informaciones@gmail.com. El resto es vendedor.
      let userRole: 'admin' | 'vendedor'
      if (data.user && isAdminEmail(data.user.email)) {
        setRole('admin')
        userRole = 'admin'
      } else if (data.user) {
        try {
          userRole = await fetchUserRole(data.user.id, data.user.email)
        } catch (roleError: any) {
          console.error('❌ Error obteniendo rol en signIn:', roleError.message)
          userRole = 'vendedor'
          setRole('vendedor')
        }
      } else {
        userRole = 'vendedor'
      }

      toast({
        title: '¡Bienvenido!',
        description: 'Has iniciado sesión correctamente',
      })
      
      return userRole
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description: error.message || 'Email o contraseña incorrectos',
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión exitosamente',
      })

      setSession(null)
      setUser(null)
      setRole(null)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo cerrar sesión',
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    role,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}


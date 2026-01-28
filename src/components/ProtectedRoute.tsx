import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'vendedor'
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading, role } = useAuth()

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Redirigir a login si no está autenticado
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Verificar rol si es requerido
  if (requiredRole) {
    // Si no tiene rol asignado pero está autenticado, permitir acceso temporal
    // Esto permite que el primer admin pueda configurar el sistema
    if (!role) {
      console.warn('Usuario sin rol asignado, permitiendo acceso temporal para configuración')
      // Permitir acceso si es admin requerido (para configuración inicial)
      if (requiredRole === 'admin') {
        return <>{children}</>
      }
      // Para vendedor, también permitir acceso temporal
      return <>{children}</>
    } else if (requiredRole === 'admin' && role !== 'admin') {
      // Si requiere admin pero no lo es, redirigir a panel de vendedor
      return <Navigate to="/vendedor" replace />
    } else if (requiredRole === 'vendedor' && role !== 'vendedor' && role !== 'admin') {
      // Si requiere vendedor pero no tiene rol válido, permitir acceso temporal
      return <>{children}</>
    }
  } else {
    // Si no se especifica rol pero el usuario tiene uno, permitir acceso
    // Las rutas específicas ya tienen requiredRole definido
  }

  // Renderizar contenido protegido
  return <>{children}</>
}

export default ProtectedRoute


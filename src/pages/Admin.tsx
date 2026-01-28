import { useMemo, useCallback, memo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import ContactosAlert from '@/components/admin/ContactosAlert'
import IngredientesCriticosAlert from '@/components/admin/IngredientesCriticosAlert'
import ProductosCriticosAlert from '@/components/admin/ProductosCriticosAlert'
import MenuGrid from '@/components/admin/MenuGrid'
import QuickActions from '@/components/admin/QuickActions'
import MetricsCards from '@/components/admin/MetricsCards'
import { useIngredientesCriticos } from '@/hooks/useIngredientes'
import { useProductosCriticos } from '@/hooks/useStock'
import { useProducts } from '@/hooks/useProducts'
import { useKPIsVentas } from '@/hooks/useVentas'
import { useKPIsFinancieros } from '@/hooks/useProductoIngredientes'
import { 
  useContactosPendientesCount, 
  useContactosNoLeidosCount,
  useContactosPendientesPreview 
} from '@/hooks/useContactos'
import { 
  LogOut, 
  ShoppingBag, 
  Leaf, 
  Package, 
  MapPin, 
  Truck,
  MessageSquare,
  BarChart3,
  User,
  Calculator,
  Tag,
  Image,
  FileText,
  AlertTriangle,
  Factory,
  Loader2,
  AlertCircle
} from 'lucide-react'

const Admin = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  
  // Hooks con estados de loading y error
  const { 
    data: ingredientesCriticos, 
    isLoading: loadingIngredientes,
    error: errorIngredientes 
  } = useIngredientesCriticos()
  
  const { 
    data: productosCriticos, 
    isLoading: loadingProductos,
    error: errorProductos 
  } = useProductosCriticos()
  
  // Hooks optimizados para contactos (solo obtienen lo necesario)
  const { 
    data: contactosPendientes = 0, 
    isLoading: loadingContactosCount,
    error: errorContactosCount 
  } = useContactosPendientesCount()
  
  const { 
    data: contactosNoLeidos = 0,
    isLoading: loadingContactosNoLeidos 
  } = useContactosNoLeidosCount()
  
  const { 
    data: contactosPreview = [], 
    isLoading: loadingContactosPreview,
    error: errorContactosPreview 
  } = useContactosPendientesPreview()
  
  // Hooks para métricas
  const { data: productos, isLoading: loadingProductosList } = useProducts()
  const { data: kpisVentas, isLoading: loadingKPIsVentas } = useKPIsVentas(30)
  const { data: kpisFinancieros, isLoading: loadingKPIsFinancieros } = useKPIsFinancieros(30)
  
  // Estados combinados memoizados para evitar recálculos
  const loadingContactos = useMemo(
    () => loadingContactosCount || loadingContactosNoLeidos || loadingContactosPreview,
    [loadingContactosCount, loadingContactosNoLeidos, loadingContactosPreview]
  )
  
  const errorContactos = useMemo(
    () => errorContactosCount || errorContactosPreview,
    [errorContactosCount, errorContactosPreview]
  )

  // Funciones memoizadas con useCallback para evitar recrearlas en cada render
  const handleSignOut = useCallback(async () => {
    await signOut()
    navigate('/login')
  }, [signOut, navigate])

  // Función helper para formatear fechas de forma segura (memoizada)
  const formatDate = useCallback((date: string | null | undefined): string => {
    if (!date) return 'Fecha no disponible'
    try {
      return new Date(date).toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'short',
      })
    } catch {
      return 'Fecha inválida'
    }
  }, [])

  // Función helper para manejar errores de imágenes (memoizada)
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg'
    e.currentTarget.onerror = null // Prevenir loops infinitos
  }, [])

  // Handlers de navegación memoizados
  const navigateToContactos = useCallback(() => navigate('/admin/contactos'), [navigate])
  const navigateToIngredientes = useCallback(() => navigate('/admin/ingredientes'), [navigate])
  const navigateToProduccion = useCallback(() => navigate('/admin/stock?tab=produccion'), [navigate])
  const navigateToHome = useCallback(() => navigate('/'), [navigate])
  const navigateToProductos = useCallback(() => navigate('/admin/productos'), [navigate])
  const navigateToVentas = useCallback(() => navigate('/admin/ventas/nueva'), [navigate])
  const navigateToKPIs = useCallback(() => navigate('/admin/kpis'), [navigate])
  const navigateToModule = useCallback((href: string) => navigate(href), [navigate])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/imagen/logoMedicinaVida.png" 
                alt="Medicina Viva" 
                className="w-10 h-10 object-contain"
                onError={handleImageError}
              />
              <div>
                <h1 className="font-display text-lg font-semibold text-foreground">
                  Panel de Administración
                </h1>
                <p className="text-xs text-muted-foreground">Somos Medicina Viva</p>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user?.email}
                </p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">¡Bienvenido al Panel Admin! 👋</CardTitle>
            <CardDescription>
              Desde aquí puedes gestionar todo el contenido de tu sitio web
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Métricas del Dashboard */}
        <MetricsCards
          kpisVentas={kpisVentas}
          kpisFinancieros={kpisFinancieros}
          totalProductos={productos?.length}
          isLoading={loadingKPIsVentas || loadingKPIsFinancieros || loadingProductosList}
        />

        {/* Alertas de Mensajes de Contacto */}
        <ContactosAlert
          contactosPendientes={contactosPendientes}
          contactosNoLeidos={contactosNoLeidos}
          contactosPreview={contactosPreview}
          isLoading={loadingContactos}
          error={errorContactos}
          onNavigate={navigateToContactos}
          formatDate={formatDate}
        />

        {/* Alertas de Stock Crítico - Ingredientes */}
        <IngredientesCriticosAlert
          ingredientes={ingredientesCriticos || []}
          isLoading={loadingIngredientes}
          error={errorIngredientes}
          onNavigate={navigateToIngredientes}
          onImageError={handleImageError}
        />

        {/* Alertas de Productos con Stock Bajo */}
        <ProductosCriticosAlert
          productos={productosCriticos || []}
          isLoading={loadingProductos}
          error={errorProductos}
          onNavigate={navigateToProduccion}
          onImageError={handleImageError}
        />

        {/* Menu Grid */}
        <MenuGrid onNavigate={navigateToModule} />

        {/* Quick Actions */}
        <QuickActions
          onNavigateToHome={navigateToHome}
          onNavigateToProductos={navigateToProductos}
          onNavigateToVentas={navigateToVentas}
          onNavigateToKPIs={navigateToKPIs}
        />
      </main>
    </div>
  )
}

export default Admin

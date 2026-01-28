import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useKPIsVentas } from '@/hooks/useVentas'
import { useProducts } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  LogOut, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Package,
  User,
  Loader2
} from 'lucide-react'

const VendedorDashboard = () => {
  const { user, signOut, role } = useAuth()
  const navigate = useNavigate()
  const { data: kpis, isLoading: loadingKPIs } = useKPIsVentas(30)
  const { data: productos, isLoading: loadingProductos } = useProducts('all')

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const statsCards = [
    {
      title: 'Ventas del Mes',
      value: kpis?.totalVentas || 0,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Ingresos Totales',
      value: `$${(kpis?.ingresosTotal || 0).toLocaleString('es-CL')}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Venta Promedio',
      value: `$${Math.round(kpis?.ticketPromedio || 0).toLocaleString('es-CL')}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Productos Disponibles',
      value: productos?.filter(p => p.activo && p.stock_disponible > 0).length || 0,
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/imagen/logoMedicinaVida.png" 
                alt="Medicina Viva" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="font-display text-lg font-semibold text-foreground">
                  Panel de Vendedor
                </h1>
                <p className="text-xs text-muted-foreground">Somos Medicina Viva</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user?.email}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {role === 'vendedor' ? 'Vendedor' : 'Usuario'}
                </Badge>
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
            <CardTitle className="text-2xl">¡Bienvenido! 👋</CardTitle>
            <CardDescription>
              Panel de vendedor - Registra y gestiona ventas
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Loading State */}
        {(loadingKPIs || loadingProductos) ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/vendedor/ventas/nueva')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                    Nueva Venta
                  </CardTitle>
                  <CardDescription>
                    Registrar una nueva venta
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/vendedor/ventas')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Ver Ventas
                  </CardTitle>
                  <CardDescription>
                    Historial de ventas realizadas
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/vendedor/productos')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    Ver Productos
                  </CardTitle>
                  <CardDescription>
                    Catálogo de productos disponibles
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default VendedorDashboard

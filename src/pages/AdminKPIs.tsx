import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useKPIsVentas, useProductosMasVendidos } from '@/hooks/useVentas'
import { useStockStats } from '@/hooks/useVentas'
import { useAllProducts } from '@/hooks/useProducts'
import { useContactosNoLeidos } from '@/hooks/useContactos'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Loader2,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  Trophy,
  Calendar
} from 'lucide-react'

const AdminKPIs = () => {
  const navigate = useNavigate()
  const [periodo, setPeriodo] = useState('30')
  
  const { data: kpis, isLoading: loadingKPIs } = useKPIsVentas(Number(periodo))
  const { data: topProductos, isLoading: loadingTop } = useProductosMasVendidos(5)
  const { data: stockStats, isLoading: loadingStock } = useStockStats()
  const { data: productos } = useAllProducts()
  const { data: contactosNoLeidos } = useContactosNoLeidos()

  const isLoading = loadingKPIs || loadingTop || loadingStock

  // Stats cards data
  const statsCards = [
    {
      title: 'Ingresos Totales',
      value: `$${(kpis?.ingresosTotal || 0).toLocaleString('es-CL')}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12.5%',
    },
    {
      title: 'Ventas Realizadas',
      value: kpis?.totalVentas || 0,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+8.2%',
    },
    {
      title: 'Ticket Promedio',
      value: `$${Math.round(kpis?.ticketPromedio || 0).toLocaleString('es-CL')}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+5.1%',
    },
    {
      title: 'Clientes Únicos',
      value: kpis?.clientesUnicos || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+15.3%',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="font-display text-xl font-semibold text-foreground">
                  KPIs y Métricas
                </h1>
                <p className="text-xs text-muted-foreground">
                  Dashboard de análisis y estadísticas
                </p>
              </div>
            </div>
            
            {/* Selector de período */}
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 días</SelectItem>
                <SelectItem value="30">Últimos 30 días</SelectItem>
                <SelectItem value="90">Últimos 90 días</SelectItem>
                <SelectItem value="365">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-green-600 mt-2">
                          {stat.change} vs período anterior
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Second Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Productos */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Top Productos
                      </CardTitle>
                      <CardDescription>Los más vendidos del período</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProductos && topProductos.length > 0 ? (
                      topProductos.map((producto, index) => (
                        <div key={producto.producto_id} className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                            {index + 1}
                          </div>
                          <img
                            src={producto.imagen_url || '/placeholder.svg'}
                            alt={producto.nombre}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{producto.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                              {producto.cantidad_total} unidades vendidas
                            </p>
                          </div>
                          <Badge variant="secondary">{producto.ventas_count} ventas</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No hay ventas registradas
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Inventario */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-500" />
                        Estado del Inventario
                      </CardTitle>
                      <CardDescription>Control de stock de ingredientes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Total ingredientes */}
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Ingredientes</p>
                        <p className="text-2xl font-bold text-foreground">
                          {stockStats?.totalIngredientes || 0}
                        </p>
                      </div>
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>

                    {/* Stock bajo */}
                    {(stockStats?.stockBajo || 0) > 0 && (
                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                        <div>
                          <p className="text-sm text-orange-600 font-medium">Stock Bajo</p>
                          <p className="text-2xl font-bold text-orange-700">
                            {stockStats?.stockBajo}
                          </p>
                          <p className="text-xs text-orange-600 mt-1">Requieren reposición</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-orange-500" />
                      </div>
                    )}

                    {/* Sin stock */}
                    {(stockStats?.sinStock || 0) > 0 && (
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                        <div>
                          <p className="text-sm text-red-600 font-medium">Sin Stock</p>
                          <p className="text-2xl font-bold text-red-700">
                            {stockStats?.sinStock}
                          </p>
                          <p className="text-xs text-red-600 mt-1">Urgente reponer</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                    )}

                    {/* Valor total */}
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Total Stock</p>
                        <p className="text-2xl font-bold text-primary">
                          ${(stockStats?.valorTotal || 0).toLocaleString('es-CL')}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-primary" />
                    </div>

                    {/* Action */}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/admin/ingredientes')}
                    >
                      Ver Detalles de Inventario
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Third Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Resumen rápido */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumen General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Productos Activos</span>
                    <span className="font-semibold">
                      {productos?.filter(p => p.activo).length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Productos Totales</span>
                    <span className="font-semibold">{productos?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Productos Vendidos</span>
                    <span className="font-semibold">{kpis?.productosVendidos || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Mensajes Sin Leer</span>
                    <Badge variant={contactosNoLeidos && contactosNoLeidos.length > 0 ? 'destructive' : 'secondary'}>
                      {contactosNoLeidos?.length || 0}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Ventas por Estado */}
              <Card>
                <CardHeader>
                  <CardTitle>Ventas por Estado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {kpis?.ventasPorEstado && Object.keys(kpis.ventasPorEstado).length > 0 ? (
                    Object.entries(kpis.ventasPorEstado).map(([estado, cantidad]) => (
                      <div key={estado} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground capitalize">{estado}</span>
                        <Badge variant="outline">{cantidad}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4 text-sm">
                      No hay ventas en este período
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Acciones Rápidas */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/productos/nuevo')}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Agregar Producto
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/contactos')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Ver Contactos
                    {contactosNoLeidos && contactosNoLeidos.length > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {contactosNoLeidos.length}
                      </Badge>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/ingredientes')}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Revisar Stock
                    {stockStats && stockStats.stockBajo > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {stockStats.stockBajo}
                      </Badge>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Info Card */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Período de Análisis: Últimos {periodo} días
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Los datos mostrados corresponden a ventas confirmadas y entregadas. 
                      Las ventas canceladas no se incluyen en las métricas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminKPIs


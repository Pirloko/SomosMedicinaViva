import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'
import { useIngredientesCriticos } from '@/hooks/useIngredientes'
import { useProductosCriticos } from '@/hooks/useStock'
import { useContactos } from '@/hooks/useContactos'
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
  Factory
} from 'lucide-react'

const Admin = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { data: ingredientesCriticos } = useIngredientesCriticos()
  const { data: productosCriticos } = useProductosCriticos()
  const { data: contactos } = useContactos()
  
  const contactosNoLeidos = contactos?.filter(c => !c.leido).length || 0
  const contactosPendientes = contactos?.filter(c => !c.respondido).length || 0

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const menuItems = [
    {
      title: 'Productos',
      description: 'Gestionar catálogo de productos',
      icon: ShoppingBag,
      href: '/admin/productos',
      color: 'bg-blue-500',
    },
    {
      title: 'Categorías',
      description: 'Crear y gestionar categorías',
      icon: Tag,
      href: '/admin/categorias',
      color: 'bg-cyan-500',
    },
    {
      title: 'Carrusel Hero',
      description: 'Imágenes del inicio (Hero)',
      icon: Image,
      href: '/admin/hero-carousel',
      color: 'bg-pink-500',
    },
    {
      title: 'Nosotros',
      description: 'Contenido "Quiénes Somos"',
      icon: FileText,
      href: '/admin/nosotros',
      color: 'bg-amber-500',
    },
    {
      title: 'Ingredientes',
      description: 'Administrar ingredientes y stock',
      icon: Leaf,
      href: '/admin/ingredientes',
      color: 'bg-green-500',
    },
    {
      title: 'Producción',
      description: 'Registrar producción de productos',
      icon: Factory,
      href: '/admin/produccion',
      color: 'bg-indigo-500',
    },
    {
      title: 'Beneficios',
      description: 'Editar sección "Apto Para"',
      icon: Package,
      href: '/admin/beneficios',
      color: 'bg-purple-500',
    },
    {
      title: 'Puntos de Venta',
      description: 'Gestionar puntos de venta',
      icon: MapPin,
      href: '/admin/puntos-venta',
      color: 'bg-red-500',
    },
    {
      title: 'Zonas Delivery',
      description: 'Administrar zonas de cobertura',
      icon: Truck,
      href: '/admin/delivery',
      color: 'bg-yellow-500',
    },
    {
      title: 'Ventas',
      description: 'Registrar y gestionar ventas',
      icon: ShoppingBag,
      href: '/admin/ventas',
      color: 'bg-emerald-500',
    },
    {
      title: 'Contactos',
      description: 'Ver mensajes de contacto',
      icon: MessageSquare,
      href: '/admin/contactos',
      color: 'bg-pink-500',
    },
    {
      title: 'KPIs y Métricas',
      description: 'Dashboard de análisis',
      icon: BarChart3,
      href: '/admin/kpis',
      color: 'bg-indigo-500',
    },
    {
      title: 'Costos y Ganancias',
      description: 'Análisis financiero real',
      icon: Calculator,
      href: '/admin/ganancias',
      color: 'bg-teal-500',
    },
  ]

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
              />
              <div>
                <h1 className="font-display text-lg font-semibold text-foreground">
                  Panel de Administración
                </h1>
                <p className="text-xs text-muted-foreground">Medicina Viva Bakery</p>
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

        {/* Alertas de Mensajes de Contacto */}
        {contactos && contactos.length > 0 && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-blue-900">
                      💬 Mensajes de Contacto
                    </CardTitle>
                    <CardDescription className="text-blue-700">
                      {contactos.length} {contactos.length === 1 ? 'mensaje recibido' : 'mensajes recibidos'} · {contactosNoLeidos} sin leer · {contactosPendientes} pendientes
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/admin/contactos')}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Ver Mensajes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {contactos.slice(0, 3).map((contacto) => (
                  <div 
                    key={contacto.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground">{contacto.nombre}</p>
                        {!contacto.leido && (
                          <Badge variant="default" className="text-xs">
                            Nuevo
                          </Badge>
                        )}
                        {contacto.respondido && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            Respondido
                          </Badge>
                        )}
                        {!contacto.respondido && (
                          <Badge variant="outline" className="text-xs text-orange-600">
                            Pendiente
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {contacto.mensaje}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-muted-foreground">
                        {new Date(contacto.created_at).toLocaleDateString('es-CL', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {contactos.length > 3 && (
                  <p className="text-center text-sm text-blue-600 pt-2">
                    + {contactos.length - 3} mensajes más
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alertas de Stock Crítico */}
        {ingredientesCriticos && ingredientesCriticos.length > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-orange-900">
                      ⚠️ Alerta de Stock Bajo
                    </CardTitle>
                    <CardDescription className="text-orange-700">
                      {ingredientesCriticos.length} {ingredientesCriticos.length === 1 ? 'ingrediente necesita' : 'ingredientes necesitan'} reposición urgente
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/admin/ingredientes')}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  Ver Ingredientes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {ingredientesCriticos.slice(0, 5).map((ingrediente) => (
                  <div 
                    key={ingrediente.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
                  >
                    <div className="flex items-center gap-3">
                      {ingrediente.imagen_url && (
                        <img 
                          src={ingrediente.imagen_url} 
                          alt={ingrediente.nombre}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{ingrediente.nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock mínimo: {ingrediente.stock_minimo} {ingrediente.unidad_medida}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {ingrediente.stock_actual === 0 ? (
                        <Badge variant="destructive" className="text-sm">
                          SIN STOCK
                        </Badge>
                      ) : (
                        <>
                          <Badge className="bg-orange-500 text-white text-sm mb-1">
                            STOCK BAJO
                          </Badge>
                          <p className="text-sm font-semibold text-orange-600">
                            {ingrediente.stock_actual} {ingrediente.unidad_medida}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {ingredientesCriticos.length > 5 && (
                  <p className="text-center text-sm text-orange-600 pt-2">
                    + {ingredientesCriticos.length - 5} ingredientes más con stock crítico
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alertas de Productos con Stock Bajo */}
        {productosCriticos && productosCriticos.length > 0 && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center text-white">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-red-900">
                      📦 Productos sin Stock
                    </CardTitle>
                    <CardDescription className="text-red-700">
                      {productosCriticos.length} {productosCriticos.length === 1 ? 'producto necesita' : 'productos necesitan'} producción urgente
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/admin/produccion')}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  Producir Ahora
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {productosCriticos.slice(0, 5).map((producto) => (
                  <div 
                    key={producto.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200"
                  >
                    <div className="flex items-center gap-3">
                      {producto.imagen_url && (
                        <img 
                          src={producto.imagen_url} 
                          alt={producto.nombre}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{producto.nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock mínimo: {producto.stock_minimo} unidades
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {producto.stock_disponible === 0 ? (
                        <Badge variant="destructive" className="text-sm">
                          SIN STOCK
                        </Badge>
                      ) : (
                        <>
                          <Badge className="bg-red-500 text-white text-sm mb-1">
                            STOCK BAJO
                          </Badge>
                          <p className="text-sm font-semibold text-red-600">
                            {producto.stock_disponible} unid.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {productosCriticos.length > 5 && (
                  <p className="text-center text-sm text-red-600 pt-2">
                    + {productosCriticos.length - 5} productos más con stock crítico
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card 
              key={item.href}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              onClick={() => navigate(item.href)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center text-white`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                </div>
                <CardTitle className="mt-4">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Gestionar →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid sm:grid-cols-4 gap-4">
          <Button variant="outline" onClick={() => navigate('/')} className="w-full">
            Ver Sitio Web
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/productos')} className="w-full">
            Agregar Producto
          </Button>
          <Button variant="default" onClick={() => navigate('/admin/ventas/nueva')} className="w-full bg-emerald-500 hover:bg-emerald-600">
            💰 Registrar Venta
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/kpis')} className="w-full">
            Ver Estadísticas
          </Button>
        </div>
      </main>
    </div>
  )
}

export default Admin


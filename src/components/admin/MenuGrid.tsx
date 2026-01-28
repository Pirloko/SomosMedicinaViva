import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ShoppingBag, 
  Leaf, 
  Package, 
  MapPin, 
  Truck,
  MessageSquare,
  BarChart3,
  Calculator,
  Tag,
  Image,
  FileText,
  Factory,
  Warehouse,
  Users,
  LucideIcon
} from 'lucide-react'
import { memo, useMemo } from 'react'

interface MenuItem {
  title: string
  description: string
  icon: LucideIcon
  href: string
  color: string
}

interface MenuGridProps {
  onNavigate: (href: string) => void
}

const MenuGrid = memo(({ onNavigate }: MenuGridProps) => {
  const menuItems = useMemo<MenuItem[]>(() => [
    // Grupo 1: Gestión de Productos (más usado)
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
      title: 'Manejo de Stock',
      description: 'Producción y stock de ingredientes',
      icon: Warehouse,
      href: '/admin/stock',
      color: 'bg-slate-600',
    },
    // Grupo 2: Inventario
    {
      title: 'Ingredientes',
      description: 'Administrar ingredientes',
      icon: Leaf,
      href: '/admin/ingredientes',
      color: 'bg-green-500',
    },
    // Grupo 3: Ventas y Operaciones
    {
      title: 'Ventas',
      description: 'Registrar y ver ventas',
      icon: ShoppingBag,
      href: '/admin/ventas',
      color: 'bg-emerald-500',
    },
    {
      title: 'KPIs y Métricas',
      description: 'Dashboard de análisis',
      icon: BarChart3,
      href: '/admin/kpis',
      color: 'bg-indigo-500',
    },
    // Grupo 4: Configuración de Venta
    {
      title: 'Puntos de Venta',
      description: 'Gestionar puntos de venta',
      icon: MapPin,
      href: '/admin/puntos-venta',
      color: 'bg-teal-500',
    },
    {
      title: 'Zonas de Delivery',
      description: 'Configurar zonas de entrega',
      icon: Truck,
      href: '/admin/delivery',
      color: 'bg-orange-500',
    },
    // Grupo 5: Contenido Web
    {
      title: 'Imágenes de la portada',
      description: 'Las fotos que se ven al entrar a la web',
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
      title: 'Beneficios',
      description: 'Editar sección "Apto Para"',
      icon: Package,
      href: '/admin/beneficios',
      color: 'bg-purple-500',
    },
    // Grupo 6: Comunicación y Usuarios
    {
      title: 'Contactos',
      description: 'Ver mensajes de contacto',
      icon: MessageSquare,
      href: '/admin/contactos',
      color: 'bg-pink-500',
    },
    {
      title: 'Usuarios',
      description: 'Gestionar usuarios vendedores',
      icon: Users,
      href: '/admin/usuarios',
      color: 'bg-violet-500',
    },
  ], [])

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map((item) => {
        const Icon = item.icon
        return (
          <Card 
            key={item.href}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            onClick={() => onNavigate(item.href)}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {item.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
})

MenuGrid.displayName = 'MenuGrid'

export default MenuGrid

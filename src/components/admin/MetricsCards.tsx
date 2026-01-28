import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package,
  AlertCircle,
  TrendingDown
} from 'lucide-react'
import { memo } from 'react'

interface MetricsCardsProps {
  kpisVentas: {
    totalVentas: number
    ingresosTotal: number
    ticketPromedio: number
    productosVendidos: number
    clientesUnicos: number
  } | undefined
  kpisFinancieros: {
    ingresos_totales: number
    ganancias_reales: number
    margen_promedio: number
  } | undefined
  totalProductos: number | undefined
  isLoading: boolean
}

const MetricsCards = memo(({
  kpisVentas,
  kpisFinancieros,
  totalProductos,
  isLoading
}: MetricsCardsProps) => {
  // Formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value)
  }

  // Formatear número
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-CL').format(value)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const metrics = [
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(kpisFinancieros?.ingresos_totales || kpisVentas?.ingresosTotal || 0),
      description: 'Total de ingresos',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: kpisFinancieros?.ingresos_totales ? 'up' : undefined,
    },
    {
      title: 'Ganancias Reales',
      value: formatCurrency(kpisFinancieros?.ganancias_reales || 0),
      description: `Margen: ${(kpisFinancieros?.margen_promedio || 0).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: kpisFinancieros?.ganancias_reales ? 'up' : undefined,
    },
    {
      title: 'Total de Ventas',
      value: formatNumber(kpisVentas?.totalVentas || 0),
      description: `Venta promedio: ${formatCurrency(kpisVentas?.ticketPromedio || 0)}`,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Productos Activos',
      value: formatNumber(totalProductos || 0),
      description: `${formatNumber(kpisVentas?.productosVendidos || 0)} vendidos este mes`,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`${metric.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <CardDescription className="flex items-center gap-1 mt-1">
                {metric.trend === 'up' && (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                )}
                {metric.trend === 'down' && (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                {metric.description}
              </CardDescription>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
})

MetricsCards.displayName = 'MetricsCards'

export default MetricsCards

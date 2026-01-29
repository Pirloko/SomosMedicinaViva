import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, AlertCircle } from 'lucide-react'
import { memo, useCallback } from 'react'

interface Producto {
  id: string
  nombre: string
  stock_disponible: number
  stock_minimo: number
  imagen_url: string | null
}

interface ProductosCriticosAlertProps {
  productos: Producto[]
  isLoading: boolean
  error: boolean | Error | null
  onNavigate: () => void
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void
}

const ProductosCriticosAlert = memo(({
  productos,
  isLoading,
  error,
  onNavigate,
  onImageError
}: ProductosCriticosAlertProps) => {
  const handleRetry = useCallback(() => {
    window.location.reload()
  }, [])

  if (isLoading) {
    return (
      <Card className="mb-8 border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-9 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mb-8 border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <p className="text-destructive font-semibold mb-2">
              Error al cargar productos con stock crítico
            </p>
            <Button variant="outline" size="sm" onClick={handleRetry} className="mt-2">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!productos || productos.length === 0) {
    return null
  }

  const productosPreview = productos.slice(0, 5)

  return (
    <Card className="mb-8 border-red-200 bg-red-50 overflow-hidden">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-red-500 flex items-center justify-center text-white">
              <Package className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-red-900 text-lg sm:text-xl">
                📦 Productos sin Stock
              </CardTitle>
              <CardDescription className="text-red-700 text-sm mt-0.5">
                {productos.length} {productos.length === 1 ? 'producto necesita' : 'productos necesitan'} producción urgente
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onNavigate}
            className="w-full sm:w-auto min-h-[44px] sm:min-h-0 border-red-300 text-red-700 hover:bg-red-100 shrink-0"
          >
            Producir Ahora
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 sm:space-y-2">
          {productosPreview.map((producto) => (
            <div 
              key={producto.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-3 bg-white rounded-xl sm:rounded-lg border border-red-200 shadow-sm"
            >
              <div className="flex gap-3 min-w-0 flex-1">
                {producto.imagen_url ? (
                  <img 
                    src={producto.imagen_url} 
                    alt={producto.nombre}
                    className="w-14 h-14 sm:w-10 sm:h-10 object-cover rounded-lg shrink-0"
                    onError={onImageError}
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-10 sm:h-10 bg-gray-200 rounded-lg shrink-0 flex items-center justify-center">
                    <Package className="w-6 h-6 sm:w-5 sm:h-5 text-gray-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-base leading-snug line-clamp-2 break-words">
                    {producto.nombre}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Stock mínimo: {producto.stock_minimo} un.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 sm:flex-col sm:items-end">
                {producto.stock_disponible === 0 ? (
                  <Badge variant="destructive" className="text-xs sm:text-sm px-3 py-1.5">
                    SIN STOCK
                  </Badge>
                ) : (
                  <>
                    <Badge className="bg-red-500 text-white text-xs sm:text-sm px-3 py-1.5">
                      STOCK BAJO
                    </Badge>
                    <span className="text-sm font-semibold text-red-600 tabular-nums">
                      {producto.stock_disponible} unid.
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
          {productos.length > 5 && (
            <p className="text-center text-sm text-red-600 pt-3 pb-1">
              + {productos.length - 5} productos más con stock crítico
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

ProductosCriticosAlert.displayName = 'ProductosCriticosAlert'

export default ProductosCriticosAlert

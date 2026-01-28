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
                {productos.length} {productos.length === 1 ? 'producto necesita' : 'productos necesitan'} producción urgente
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onNavigate}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Producir Ahora
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {productosPreview.map((producto) => (
            <div 
              key={producto.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200"
            >
              <div className="flex items-center gap-3">
                {producto.imagen_url ? (
                  <img 
                    src={producto.imagen_url} 
                    alt={producto.nombre}
                    className="w-10 h-10 object-cover rounded"
                    onError={onImageError}
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
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
          {productos.length > 5 && (
            <p className="text-center text-sm text-red-600 pt-2">
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle, AlertCircle, Leaf } from 'lucide-react'
import { memo, useCallback } from 'react'

interface Ingrediente {
  id: string
  nombre: string
  unidad_medida: string
  stock_actual: number
  stock_minimo: number
  imagen_url: string | null
}

interface IngredientesCriticosAlertProps {
  ingredientes: Ingrediente[]
  isLoading: boolean
  error: boolean | Error | null
  onNavigate: () => void
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void
}

const IngredientesCriticosAlert = memo(({
  ingredientes,
  isLoading,
  error,
  onNavigate,
  onImageError
}: IngredientesCriticosAlertProps) => {
  const handleRetry = useCallback(() => {
    window.location.reload()
  }, [])

  if (isLoading) {
    return (
      <Card className="mb-8 border-orange-200 bg-orange-50">
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
      <Card className="mb-8 border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <p className="text-destructive font-semibold mb-2">
              Error al cargar ingredientes con stock crítico
            </p>
            <Button variant="outline" size="sm" onClick={handleRetry} className="mt-2">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!ingredientes || ingredientes.length === 0) {
    return null
  }

  const ingredientesPreview = ingredientes.slice(0, 5)

  return (
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
                {ingredientes.length} {ingredientes.length === 1 ? 'ingrediente necesita' : 'ingredientes necesitan'} reposición urgente
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onNavigate}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            Ver Ingredientes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {ingredientesPreview.map((ingrediente) => (
            <div 
              key={ingrediente.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
            >
              <div className="flex items-center gap-3">
                {ingrediente.imagen_url ? (
                  <img 
                    src={ingrediente.imagen_url} 
                    alt={ingrediente.nombre}
                    className="w-10 h-10 object-cover rounded"
                    onError={onImageError}
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-gray-400" />
                  </div>
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
          {ingredientes.length > 5 && (
            <p className="text-center text-sm text-orange-600 pt-2">
              + {ingredientes.length - 5} ingredientes más con stock crítico
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

IngredientesCriticosAlert.displayName = 'IngredientesCriticosAlert'

export default IngredientesCriticosAlert

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useKPIsFinancieros, useGananciasVentas } from '@/hooks/useProductoIngredientes'
import { useCostosProductos } from '@/hooks/useProductoIngredientes'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  Loader2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  ShoppingCart,
  Calculator,
  AlertCircle
} from 'lucide-react'

const AdminGanancias = () => {
  const navigate = useNavigate()
  const [periodo, setPeriodo] = useState('30')
  
  const { data: kpisFinancieros, isLoading: loadingKPIs } = useKPIsFinancieros(Number(periodo))
  const { data: gananciasVentas, isLoading: loadingGanancias } = useGananciasVentas(Number(periodo))
  const { data: costosProductos, isLoading: loadingCostos } = useCostosProductos()

  const isLoading = loadingKPIs || loadingGanancias || loadingCostos

  // Calcular estadísticas
  const ingresosTotales = kpisFinancieros?.ingresos_totales || 0
  const costosTotales = kpisFinancieros?.costos_totales || 0
  const gananciasReales = kpisFinancieros?.ganancias_reales || 0
  const margenPromedio = kpisFinancieros?.margen_promedio || 0

  // Top 5 productos más rentables
  const productosRentables = costosProductos?.slice(0, 5) || []

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
                  💰 Costos y Ganancias Reales
                </h1>
                <p className="text-xs text-muted-foreground">
                  Análisis financiero basado en costos de ingredientes
                </p>
              </div>
            </div>
            
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 días</SelectItem>
                <SelectItem value="30">Últimos 30 días</SelectItem>
                <SelectItem value="90">Últimos 90 días</SelectItem>
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
          <div className="space-y-6">
            {/* KPIs Principales */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Ingresos */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ingresos Totales</p>
                      <p className="text-3xl font-bold text-blue-600">
                        ${Math.round(ingresosTotales).toLocaleString('es-CL')}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Costos */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Costos Totales</p>
                      <p className="text-3xl font-bold text-orange-600">
                        ${Math.round(costosTotales).toLocaleString('es-CL')}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ganancias */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ganancias Reales</p>
                      <p className="text-3xl font-bold text-green-600">
                        ${Math.round(gananciasReales).toLocaleString('es-CL')}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Margen */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Margen Promedio</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {Math.round(margenPromedio)}%
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Percent className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ecuación Visual */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Ingresos</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${Math.round(ingresosTotales).toLocaleString('es-CL')}
                    </p>
                  </div>
                  <span className="text-4xl font-light text-muted-foreground">−</span>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Costos</p>
                    <p className="text-2xl font-bold text-orange-600">
                      ${Math.round(costosTotales).toLocaleString('es-CL')}
                    </p>
                  </div>
                  <span className="text-4xl font-light text-muted-foreground">=</span>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Ganancia</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${Math.round(gananciasReales).toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Productos Más Rentables */}
              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Productos Más Rentables</CardTitle>
                  <CardDescription>Basado en margen de ganancia real</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {productosRentables && productosRentables.length > 0 ? (
                      productosRentables.map((producto, index) => {
                        const margen = producto.margen_porcentaje || 0
                        return (
                          <div key={index} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{producto.producto_nombre}</p>
                              <p className="text-xs text-muted-foreground">
                                Costo: ${Math.round(producto.costo_produccion || 0).toLocaleString('es-CL')} · 
                                Ganancia: ${Math.round(producto.ganancia_unitaria || 0).toLocaleString('es-CL')}
                              </p>
                            </div>
                            <Badge 
                              className={
                                margen > 50 ? 'bg-green-100 text-green-700' :
                                margen > 30 ? 'bg-blue-100 text-blue-700' :
                                'bg-orange-100 text-orange-700'
                              }
                            >
                              {Math.round(margen)}%
                            </Badge>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No hay datos de costos disponibles
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Asigna ingredientes a tus productos para calcular costos
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Últimas Ventas con Ganancia */}
              <Card>
                <CardHeader>
                  <CardTitle>Últimas Ventas (con Ganancia Real)</CardTitle>
                  <CardDescription>Mostrando las 10 más recientes</CardDescription>
                </CardHeader>
                <CardContent>
                  {gananciasVentas && gananciasVentas.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Ingreso</TableHead>
                          <TableHead>Costo</TableHead>
                          <TableHead>Ganancia</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {gananciasVentas.slice(0, 10).map((venta: any) => (
                          <TableRow key={venta.venta_id}>
                            <TableCell>
                              <div className="text-sm">
                                <p className="font-medium">{venta.producto_nombre}</p>
                                <p className="text-xs text-muted-foreground">
                                  {venta.cantidad}x
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-blue-600 font-semibold">
                              ${Math.round(venta.ingreso_total).toLocaleString('es-CL')}
                            </TableCell>
                            <TableCell className="text-orange-600">
                              ${Math.round(venta.costo_real).toLocaleString('es-CL')}
                            </TableCell>
                            <TableCell className="text-green-600 font-semibold">
                              ${Math.round(venta.ganancia_real).toLocaleString('es-CL')}
                              <span className="text-xs ml-1">
                                ({Math.round(venta.margen_real_porcentaje)}%)
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No hay ventas registradas en este período
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Instrucciones */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
                    <Calculator className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      ¿Cómo funciona el cálculo de costos?
                    </h3>
                    <div className="text-sm text-blue-800 space-y-2">
                      <p>
                        <strong>1. Asigna ingredientes a cada producto:</strong> En la lista de productos, 
                        click en el icono 🧮 para gestionar ingredientes y cantidades.
                      </p>
                      <p>
                        <strong>2. El sistema calcula automáticamente:</strong><br />
                        • Costo = Suma de (Cantidad × Costo Unitario) de cada ingrediente<br />
                        • Ganancia = Precio de Venta − Costo<br />
                        • Margen = (Ganancia / Precio de Venta) × 100
                      </p>
                      <p>
                        <strong>3. Las ventas reflejan ganancias reales:</strong> Cada venta muestra 
                        el ingreso, costo real y ganancia neta.
                      </p>
                    </div>
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/admin/productos')}
                        className="bg-white"
                      >
                        Ir a Productos para Asignar Ingredientes
                      </Button>
                    </div>
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

export default AdminGanancias


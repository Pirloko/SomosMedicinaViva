import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { useAllIngredientes } from '@/hooks/useIngredientes'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { ArrowLeft, Package, Loader2, AlertTriangle, CheckCircle, Factory, Plus, Trash2, ShoppingBasket, Calculator, TrendingUp } from 'lucide-react'

type IngredienteSeleccionado = {
  ingrediente_id: string
  nombre: string
  unidad_medida: string
  cantidad: number
  stock_actual: number
  stock_despues: number
}

const AdminProduccion = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const { data: productos } = useProducts('all')
  const { data: ingredientes } = useAllIngredientes()

  const [selectedProductoId, setSelectedProductoId] = useState('')
  const [stockProducido, setStockProducido] = useState(1)
  const [motivo, setMotivo] = useState('Producción del día')
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState<IngredienteSeleccionado[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dialog para agregar ingrediente
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogIngredienteId, setDialogIngredienteId] = useState('')
  const [dialogCantidad, setDialogCantidad] = useState(1)

  const productoSeleccionado = productos?.find(p => p.id === selectedProductoId)

  // Calcular costos
  const costoTotalIngredientes = ingredientesSeleccionados.reduce((total, ing) => {
    const ingrediente = ingredientes?.find(i => i.id === ing.ingrediente_id)
    return total + (ing.cantidad * (ingrediente?.costo_unitario || 0))
  }, 0)

  const costoUnitario = stockProducido > 0 ? costoTotalIngredientes / stockProducido : 0
  const gananciaUnitaria = (productoSeleccionado?.precio || 0) - costoUnitario
  const margenPorcentaje = productoSeleccionado?.precio ? (gananciaUnitaria / productoSeleccionado.precio) * 100 : 0

  // Abrir dialog para agregar ingrediente
  const handleOpenDialog = () => {
    setDialogIngredienteId('')
    setDialogCantidad(1)
    setIsDialogOpen(true)
  }

  // Agregar ingrediente a la lista
  const handleAgregarIngrediente = () => {
    const ingrediente = ingredientes?.find(i => i.id === dialogIngredienteId)
    if (!ingrediente || dialogCantidad <= 0) return

    // Verificar que no esté ya agregado
    if (ingredientesSeleccionados.some(i => i.ingrediente_id === dialogIngredienteId)) {
      toast({
        variant: 'destructive',
        title: 'Ingrediente ya agregado',
        description: 'Este ingrediente ya está en la lista',
      })
      return
    }

    const nuevoIngrediente: IngredienteSeleccionado = {
      ingrediente_id: ingrediente.id,
      nombre: ingrediente.nombre,
      unidad_medida: ingrediente.unidad_medida,
      cantidad: dialogCantidad,
      stock_actual: ingrediente.stock_actual,
      stock_despues: ingrediente.stock_actual - dialogCantidad,
    }

    setIngredientesSeleccionados([...ingredientesSeleccionados, nuevoIngrediente])
    setIsDialogOpen(false)
  }

  // Eliminar ingrediente de la lista
  const handleEliminarIngrediente = (ingrediente_id: string) => {
    setIngredientesSeleccionados(ingredientesSeleccionados.filter(i => i.ingrediente_id !== ingrediente_id))
  }

  // Actualizar cantidad de ingrediente
  const handleActualizarCantidad = (ingrediente_id: string, nuevaCantidad: number) => {
    setIngredientesSeleccionados(ingredientesSeleccionados.map(ing => {
      if (ing.ingrediente_id === ingrediente_id) {
        return {
          ...ing,
          cantidad: nuevaCantidad,
          stock_despues: ing.stock_actual - nuevaCantidad,
        }
      }
      return ing
    }))
  }

  // Verificar si hay ingredientes con stock insuficiente
  const hayStockInsuficiente = ingredientesSeleccionados.some(ing => ing.stock_despues < 0)

  // Enviar producción
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProductoId || stockProducido <= 0) return
    if (ingredientesSeleccionados.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Sin ingredientes',
        description: 'Debes agregar al menos un ingrediente',
      })
      return
    }
    if (hayStockInsuficiente) {
      toast({
        variant: 'destructive',
        title: 'Stock insuficiente',
        description: 'Algunos ingredientes no tienen stock suficiente',
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Preparar ingredientes para la función (incluir costo_unitario)
      const ingredientesJSON = ingredientesSeleccionados.map(ing => {
        const ingrediente = ingredientes?.find(i => i.id === ing.ingrediente_id)
        return {
          ingrediente_id: ing.ingrediente_id,
          cantidad: ing.cantidad,
          costo_unitario: ingrediente?.costo_unitario || 0,
        }
      })

      // Llamar a la función de PostgreSQL
      const { data, error } = await supabase.rpc('registrar_produccion_manual', {
        p_producto_id: selectedProductoId,
        p_stock_producido: stockProducido,
        p_ingredientes: ingredientesJSON as any,
        p_motivo: motivo,
      } as any)

      if (error) {
        console.error('Error RPC:', error)
        throw new Error(error.message || 'Error al registrar producción')
      }

      toast({
        title: '✅ Producción registrada exitosamente',
        description: `${stockProducido} unidades producidas. Costo unitario: $${Math.round(costoUnitario).toLocaleString('es-CL')}. Ingredientes descontados.`,
      })

      // Invalidar queries para actualizar datos
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      queryClient.invalidateQueries({ queryKey: ['productos-admin'] })
      queryClient.invalidateQueries({ queryKey: ['productos-criticos'] })
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      queryClient.invalidateQueries({ queryKey: ['ingredientes-admin'] })
      queryClient.invalidateQueries({ queryKey: ['ingredientes-criticos'] })

      // Resetear formulario
      setSelectedProductoId('')
      setStockProducido(1)
      setMotivo('Producción del día')
      setIngredientesSeleccionados([])

    } catch (error: any) {
      console.error('Error en producción:', error)
      toast({
        variant: 'destructive',
        title: '❌ Error al registrar',
        description: error.message || 'No se pudo registrar la producción',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
                  Registrar Producción
                </h1>
                <p className="text-xs text-muted-foreground">
                  Selecciona producto, ingredientes y cantidades utilizadas
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Card */}
        <Alert className="mb-6 border-primary bg-primary/5">
          <Factory className="h-4 w-4 text-primary" />
          <AlertTitle>Cómo funciona la Producción Manual</AlertTitle>
          <AlertDescription className="text-sm">
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Selecciona el <strong>producto</strong> que acabas de hacer</li>
              <li>Agrega cada <strong>ingrediente</strong> que usaste con su cantidad</li>
              <li>Define el <strong>stock producido</strong> (cuántas unidades hiciste)</li>
              <li>Al guardar: stock del producto aumenta e ingredientes se descuentan</li>
            </ol>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna Izquierda - Datos de Producción */}
            <Card>
              <CardHeader>
                <CardTitle>Datos de la Producción</CardTitle>
                <CardDescription>Producto y cantidad producida</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Seleccionar Producto */}
                <div className="space-y-2">
                  <Label htmlFor="producto">
                    Producto Fabricado *
                  </Label>
                  <Select
                    value={selectedProductoId}
                    onValueChange={setSelectedProductoId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="¿Qué producto hiciste?" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos?.map(producto => (
                        <SelectItem key={producto.id} value={producto.id}>
                          {producto.nombre} (Stock actual: {producto.stock_disponible})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Stock Producido */}
                <div className="space-y-2">
                  <Label htmlFor="stock">
                    Stock Producido (Unidades) *
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    min="1"
                    value={stockProducido}
                    onChange={(e) => setStockProducido(parseInt(e.target.value) || 1)}
                    required
                    className="text-lg font-semibold"
                  />
                  <p className="text-xs text-muted-foreground">
                    ¿Cuántas unidades fabricaste?
                  </p>
                </div>

                {/* Preview Stock Producto */}
                {productoSeleccionado && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium mb-2">📦 Stock del Producto:</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Actual</p>
                        <p className="text-lg font-bold">{productoSeleccionado.stock_disponible}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Produces</p>
                        <p className="text-lg font-bold text-green-600">+{stockProducido}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Después</p>
                        <p className="text-lg font-bold text-primary">
                          {productoSeleccionado.stock_disponible + stockProducido}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Motivo */}
                <div className="space-y-2">
                  <Label htmlFor="motivo">Nota / Motivo (Opcional)</Label>
                  <Textarea
                    id="motivo"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ej: Producción del día, Pedido especial, etc."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Columna Derecha - Ingredientes Utilizados */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Ingredientes Utilizados</CardTitle>
                    <CardDescription>
                      Agrega los ingredientes que usaste y sus cantidades
                    </CardDescription>
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleOpenDialog} 
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {ingredientesSeleccionados.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <ShoppingBasket className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-2">
                      No has agregado ingredientes
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Agrega los ingredientes que usaste en esta producción
                    </p>
                    <Button type="button" onClick={handleOpenDialog} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Ingrediente
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Tabla de Ingredientes */}
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ingrediente</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Costo</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ingredientesSeleccionados.map((ing) => {
                            const ingrediente = ingredientes?.find(i => i.id === ing.ingrediente_id)
                            const esInsuficiente = ing.stock_despues < 0
                            const quedaBajo = ing.stock_despues < ing.stock_actual * 0.2 // 20% del stock
                            const costoIngrediente = ing.cantidad * (ingrediente?.costo_unitario || 0)
                            
                            return (
                              <TableRow key={ing.ingrediente_id} className={esInsuficiente ? 'bg-red-50' : ''}>
                                <TableCell>
                                  <p className="font-medium">{ing.nombre}</p>
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={ing.cantidad}
                                    onChange={(e) => handleActualizarCantidad(ing.ingrediente_id, parseFloat(e.target.value) || 0)}
                                    className="w-24"
                                  />
                                  <span className="text-xs text-muted-foreground ml-1">
                                    {ing.unidad_medida}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <p className="font-semibold text-orange-600">
                                    ${Math.round(costoIngrediente).toLocaleString('es-CL')}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ${(ingrediente?.costo_unitario || 0).toLocaleString('es-CL')}/{ing.unidad_medida}
                                  </p>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="text-sm">
                                      <span className="text-muted-foreground">Actual: </span>
                                      <span className="font-semibold">{ing.stock_actual}</span>
                                    </div>
                                    <div className="text-sm">
                                      <span className="text-muted-foreground">Después: </span>
                                      <span className={`font-bold ${
                                        esInsuficiente ? 'text-red-600' :
                                        quedaBajo ? 'text-orange-600' :
                                        'text-green-600'
                                      }`}>
                                        {esInsuficiente ? '❌ Insuficiente' : ing.stock_despues.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEliminarIngrediente(ing.ingrediente_id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Resumen */}
                    <div className="p-3 bg-muted/50 rounded-lg text-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium mb-1">
                            📊 {ingredientesSeleccionados.length} {ingredientesSeleccionados.length === 1 ? 'ingrediente' : 'ingredientes'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Costo total: ${Math.round(costoTotalIngredientes).toLocaleString('es-CL')}
                          </p>
                        </div>
                        {stockProducido > 0 && (
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Costo por unidad:</p>
                            <p className="font-bold text-primary">
                              ${Math.round(costoUnitario).toLocaleString('es-CL')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Card de Análisis de Costos */}
          {ingredientesSeleccionados.length > 0 && stockProducido > 0 && (
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Análisis de Costos
                </CardTitle>
                <CardDescription>
                  Cálculos automáticos basados en ingredientes y stock producido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Costo Total Ingredientes */}
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-xs text-orange-600 font-medium mb-1">Costo Total Ingredientes</p>
                    <p className="text-2xl font-bold text-orange-700">
                      ${Math.round(costoTotalIngredientes).toLocaleString('es-CL')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Suma de todos los ingredientes
                    </p>
                  </div>

                  {/* Costo Unitario */}
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-600 font-medium mb-1">Costo por Unidad</p>
                    <p className="text-2xl font-bold text-red-700">
                      ${Math.round(costoUnitario).toLocaleString('es-CL')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {costoTotalIngredientes > 0 ? `$${Math.round(costoTotalIngredientes).toLocaleString('es-CL')} ÷ ${stockProducido}` : 'Agrega ingredientes'}
                    </p>
                  </div>

                  {/* Ganancia Unitaria */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-600 font-medium mb-1">Ganancia Unitaria</p>
                    <p className={`text-2xl font-bold ${
                      gananciaUnitaria > 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      ${Math.round(gananciaUnitaria).toLocaleString('es-CL')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Precio - Costo
                    </p>
                  </div>

                  {/* Margen */}
                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-xs text-primary font-medium mb-1">Margen de Ganancia</p>
                    <p className={`text-2xl font-bold ${
                      margenPorcentaje > 40 ? 'text-green-600' :
                      margenPorcentaje > 20 ? 'text-primary' :
                      'text-orange-600'
                    }`}>
                      {Math.round(margenPorcentaje)}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {margenPorcentaje > 50 ? '🟢 Excelente' :
                       margenPorcentaje > 30 ? '🟡 Bueno' :
                       margenPorcentaje > 15 ? '🟠 Bajo' :
                       '🔴 Revisar precios'}
                    </p>
                  </div>
                </div>

                {/* Información Adicional */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <p className="font-medium text-blue-900 mb-2">💡 Cómo se calcula:</p>
                  <div className="space-y-1 text-blue-800">
                    <p>1️⃣ <strong>Costo Total:</strong> Suma de (Cantidad × Costo Unitario) de cada ingrediente</p>
                    <p>2️⃣ <strong>Costo Unitario:</strong> Costo Total ÷ Stock Producido</p>
                    <p>3️⃣ <strong>Ganancia:</strong> Precio de Venta - Costo Unitario</p>
                    <p>4️⃣ <strong>Margen:</strong> (Ganancia ÷ Precio) × 100</p>
                  </div>
                </div>

                {productoSeleccionado && (
                  <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                    <p className="text-muted-foreground">
                      El <strong>costo unitario calculado (${Math.round(costoUnitario).toLocaleString('es-CL')})</strong> se guardará en el producto 
                      y se usará para análisis de ganancias futuras.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Alerta de Stock Insuficiente */}
          {hayStockInsuficiente && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>⚠️ Stock Insuficiente</AlertTitle>
              <AlertDescription>
                <p>Algunos ingredientes no tienen stock suficiente:</p>
                <ul className="list-disc list-inside mt-2">
                  {ingredientesSeleccionados
                    .filter(ing => ing.stock_despues < 0)
                    .map(ing => (
                      <li key={ing.ingrediente_id}>
                        <strong>{ing.nombre}:</strong> Necesitas {ing.cantidad} {ing.unidad_medida}, 
                        tienes {ing.stock_actual} {ing.unidad_medida}
                      </li>
                    ))}
                </ul>
                <p className="mt-2 text-sm">
                  Reduce las cantidades o ve a <strong>Ingredientes</strong> para reponer stock.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Botones */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={
                !selectedProductoId || 
                stockProducido <= 0 || 
                ingredientesSeleccionados.length === 0 || 
                hayStockInsuficiente ||
                isSubmitting
              }
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <Factory className="w-4 h-4 mr-2" />
                  Registrar Producción
                </>
              )}
            </Button>
          </div>
        </form>
      </main>

      {/* Dialog para Agregar Ingrediente */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Ingrediente Utilizado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Seleccionar Ingrediente */}
            <div className="space-y-2">
              <Label htmlFor="ingrediente">Ingrediente *</Label>
              <Select
                value={dialogIngredienteId}
                onValueChange={setDialogIngredienteId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un ingrediente" />
                </SelectTrigger>
                <SelectContent>
                  {ingredientes
                    ?.filter(ing => !ingredientesSeleccionados.some(i => i.ingrediente_id === ing.id))
                    .map(ingrediente => (
                      <SelectItem key={ingrediente.id} value={ingrediente.id}>
                        {ingrediente.nombre} - Stock: {ingrediente.stock_actual} {ingrediente.unidad_medida}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cantidad Utilizada */}
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad Utilizada (Total) *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cantidad"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={dialogCantidad}
                  onChange={(e) => setDialogCantidad(parseFloat(e.target.value) || 0)}
                  placeholder="1"
                />
                {dialogIngredienteId && (
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {ingredientes?.find(i => i.id === dialogIngredienteId)?.unidad_medida}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Cantidad TOTAL del ingrediente que usaste en esta producción
              </p>
            </div>

            {/* Preview */}
            {dialogIngredienteId && dialogCantidad > 0 && (() => {
              const ingrediente = ingredientes?.find(i => i.id === dialogIngredienteId)
              if (!ingrediente) return null

              const stockDespues = ingrediente.stock_actual - dialogCantidad
              const esInsuficiente = stockDespues < 0
              const costoIngrediente = dialogCantidad * (ingrediente.costo_unitario || 0)

              return (
                <div className={`p-4 rounded-lg border ${
                  esInsuficiente ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
                }`}>
                  <p className="text-sm font-medium mb-2">
                    {esInsuficiente ? '❌ Stock Insuficiente' : '✅ Preview:'}
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Costo unitario:</span>
                      <span className="ml-2 font-semibold">${(ingrediente.costo_unitario || 0).toLocaleString('es-CL')}/{ingrediente.unidad_medida}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Vas a usar:</span>
                      <span className="ml-2 font-semibold">{dialogCantidad} {ingrediente.unidad_medida}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Costo total:</span>
                      <span className="ml-2 font-bold text-orange-600">${Math.round(costoIngrediente).toLocaleString('es-CL')}</span>
                    </p>
                    <div className="border-t pt-2 mt-2">
                      <p>
                        <span className="text-muted-foreground">Stock actual:</span>
                        <span className="ml-2 font-semibold">{ingrediente.stock_actual} {ingrediente.unidad_medida}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Stock después:</span>
                        <span className={`ml-2 font-bold ${
                          esInsuficiente ? 'text-red-600' :
                          stockDespues <= ingrediente.stock_minimo ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {esInsuficiente ? 'INSUFICIENTE' : `${stockDespues.toFixed(2)} ${ingrediente.unidad_medida}`}
                        </span>
                      </p>
                    </div>
                  </div>
                  {esInsuficiente && (
                    <p className="text-xs text-red-600 mt-2">
                      ⚠️ No puedes agregar este ingrediente con esta cantidad
                    </p>
                  )}
                </div>
              )
            })()}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleAgregarIngrediente}
              disabled={!dialogIngredienteId || dialogCantidad <= 0}
            >
              Agregar Ingrediente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminProduccion

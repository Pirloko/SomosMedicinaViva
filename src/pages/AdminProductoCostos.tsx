import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProduct } from '@/hooks/useProducts'
import { useAllIngredientes } from '@/hooks/useIngredientes'
import { 
  useProductoIngredientes, 
  useCostoProducto,
  useAsignarIngrediente,
  useActualizarCantidadIngrediente,
  useEliminarIngredienteDeProducto
} from '@/hooks/useProductoIngredientes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Loader2, 
  DollarSign,
  TrendingUp,
  Calculator,
  AlertTriangle,
  Edit
} from 'lucide-react'

const AdminProductoCostos = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  
  const { data: producto, isLoading: loadingProducto } = useProduct(id || '')
  const { data: ingredientesProducto, isLoading: loadingIngredientes } = useProductoIngredientes(id || '')
  const { data: costoProducto } = useCostoProducto(id || '')
  const { data: todosIngredientes } = useAllIngredientes()
  
  const asignarIngrediente = useAsignarIngrediente()
  const actualizarCantidad = useActualizarCantidadIngrediente()
  const eliminarIngrediente = useEliminarIngredienteDeProducto()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    ingrediente_id: '',
    cantidad_necesaria: 0,
  })

  // Obtener ingrediente seleccionado para mostrar su unidad
  const ingredienteSeleccionado = todosIngredientes?.find(ing => ing.id === formData.ingrediente_id)

  const handleOpenDialog = () => {
    setFormData({ ingrediente_id: '', cantidad_necesaria: 0 })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      await asignarIngrediente.mutateAsync({
        producto_id: id,
        ingrediente_id: formData.ingrediente_id,
        cantidad_necesaria: formData.cantidad_necesaria,
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleUpdateCantidad = async (relacionId: string, nuevaCantidad: number) => {
    if (!id) return
    await actualizarCantidad.mutateAsync({
      id: relacionId,
      cantidad: nuevaCantidad,
      productoId: id,
    })
    setEditingId(null)
  }

  const handleEliminar = async (relacionId: string) => {
    if (!id) return
    await eliminarIngrediente.mutateAsync({
      id: relacionId,
      productoId: id,
    })
  }

  // Ingredientes disponibles para agregar (que no estén ya asignados)
  const ingredientesDisponibles = todosIngredientes?.filter(ing => 
    !ingredientesProducto?.some(pi => (pi.ingredientes as any)?.id === ing.id)
  )

  if (loadingProducto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Producto no encontrado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/productos')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="font-display text-xl font-semibold text-foreground">
                  Costos e Ingredientes
                </h1>
                <p className="text-xs text-muted-foreground">{producto.nombre}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Columna Izquierda - Info del Producto */}
          <div className="lg:col-span-1 space-y-6">
            {/* Imagen y Info */}
            <Card>
              <CardContent className="pt-6">
                <img
                  src={producto.imagen_url || '/placeholder.svg'}
                  alt={producto.nombre}
                  className="w-full aspect-square object-cover rounded-lg mb-4"
                />
                <h2 className="font-display text-xl font-bold mb-2">{producto.nombre}</h2>
                <Badge>{producto.categoria}</Badge>
              </CardContent>
            </Card>

            {/* Análisis Financiero */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Análisis Financiero
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Precio de Venta */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Precio de Venta</p>
                    <p className="text-2xl font-bold text-blue-700">
                      ${producto.precio.toLocaleString('es-CL')}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-500" />
                </div>

                {/* Costo de Producción */}
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="text-xs text-orange-600 font-medium">Costo de Producción</p>
                    <p className="text-2xl font-bold text-orange-700">
                      ${Math.round(costoProducto?.costo_produccion || 0).toLocaleString('es-CL')}
                    </p>
                  </div>
                  <Calculator className="w-8 h-8 text-orange-500" />
                </div>

                {/* Ganancia por Unidad */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-xs text-green-600 font-medium">Ganancia por Unidad</p>
                    <p className="text-2xl font-bold text-green-700">
                      ${Math.round(costoProducto?.ganancia_unitaria || 0).toLocaleString('es-CL')}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>

                {/* Margen */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Margen de Ganancia</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">
                      {Math.round(costoProducto?.margen_porcentaje || 0)}%
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {(costoProducto?.margen_porcentaje || 0) > 50 ? '🟢 Margen excelente' :
                     (costoProducto?.margen_porcentaje || 0) > 30 ? '🟡 Margen bueno' :
                     (costoProducto?.margen_porcentaje || 0) > 15 ? '🟠 Margen bajo' :
                     '🔴 Revisar precios'}
                  </div>
                </div>

                {/* Alerta si no hay ingredientes */}
                {(!ingredientesProducto || ingredientesProducto.length === 0) && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Sin ingredientes asignados
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Asigna ingredientes para calcular el costo real de producción
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Capacidad de Producción */}
                {ingredientesProducto && ingredientesProducto.length > 0 && (() => {
                  const capacidadesPorIngrediente = ingredientesProducto.map(pi => {
                    const ingrediente = pi.ingredientes as any
                    return Math.floor(ingrediente?.stock_actual / pi.cantidad_necesaria)
                  })
                  const capacidadMaxima = Math.min(...capacidadesPorIngrediente)
                  const ingredienteLimitante = ingredientesProducto.find((pi, idx) => {
                    const ingrediente = pi.ingredientes as any
                    return Math.floor(ingrediente?.stock_actual / pi.cantidad_necesaria) === capacidadMaxima
                  })
                  const ingLimitante = ingredienteLimitante?.ingredientes as any

                  return (
                    <div className={`p-4 rounded-lg border-2 ${
                      capacidadMaxima === 0 ? 'bg-red-50 border-red-200' :
                      capacidadMaxima < 10 ? 'bg-orange-50 border-orange-200' :
                      'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Capacidad de Producción Actual
                          </p>
                          <p className={`text-3xl font-bold ${
                            capacidadMaxima === 0 ? 'text-red-600' :
                            capacidadMaxima < 10 ? 'text-orange-600' :
                            'text-green-600'
                          }`}>
                            {capacidadMaxima}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            unidades del producto
                          </p>
                        </div>
                        {ingLimitante && (
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-1">
                              Limitado por:
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              {ingLimitante.nombre}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Stock: {ingLimitante.stock_actual} {ingLimitante.unidad_medida}
                            </p>
                          </div>
                        )}
                      </div>
                      {capacidadMaxima === 0 && (
                        <p className="text-xs text-red-600 mt-2">
                          ⚠️ No puedes producir. Repone stock de {ingLimitante?.nombre}
                        </p>
                      )}
                      {capacidadMaxima > 0 && capacidadMaxima < 10 && (
                        <p className="text-xs text-orange-600 mt-2">
                          ⚠️ Stock bajo. Produce pronto o repone {ingLimitante?.nombre}
                        </p>
                      )}
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha - Ingredientes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Ingredientes del Producto</CardTitle>
                    <CardDescription>
                      Configura qué ingredientes lleva y en qué cantidades
                    </CardDescription>
                  </div>
                  <Button onClick={handleOpenDialog} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Ingrediente
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingIngredientes ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : ingredientesProducto && ingredientesProducto.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ingrediente</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Costo Unit.</TableHead>
                        <TableHead>Costo Total</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Puede Producir</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ingredientesProducto.map((pi) => {
                        const ingrediente = pi.ingredientes as any
                        const costoTotal = pi.cantidad_necesaria * (ingrediente?.costo_unitario || 0)
                        
                        return (
                          <TableRow key={pi.id}>
                            <TableCell>
                              <p className="font-medium">{ingrediente?.nombre}</p>
                            </TableCell>
                            <TableCell>
                              {editingId === pi.id ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    step="0.01"
                                    defaultValue={pi.cantidad_necesaria}
                                    className="w-24"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleUpdateCantidad(pi.id, parseFloat(e.currentTarget.value))
                                      }
                                    }}
                                    autoFocus
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    {ingrediente?.unidad_medida}
                                  </span>
                                </div>
                              ) : (
                                <div 
                                  className="cursor-pointer hover:text-primary"
                                  onClick={() => setEditingId(pi.id)}
                                >
                                  <span className="font-semibold">{pi.cantidad_necesaria}</span>
                                  <span className="text-xs text-muted-foreground ml-1">
                                    {ingrediente?.unidad_medida}
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              ${(ingrediente?.costo_unitario || 0).toLocaleString('es-CL')}
                            </TableCell>
                            <TableCell className="font-semibold">
                              ${Math.round(costoTotal).toLocaleString('es-CL')}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  ingrediente?.stock_actual <= 0 ? 'destructive' :
                                  ingrediente?.stock_actual <= ingrediente?.stock_minimo ? 'default' :
                                  'secondary'
                                }
                              >
                                {ingrediente?.stock_actual} {ingrediente?.unidad_medida}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {(() => {
                                const puedeProducir = Math.floor(ingrediente?.stock_actual / pi.cantidad_necesaria)
                                const esLimitante = puedeProducir < 50 // Menos de 50 unidades es limitante
                                
                                return (
                                  <div className="space-y-1">
                                    <div className={`font-bold text-lg ${
                                      puedeProducir === 0 ? 'text-red-600' : 
                                      esLimitante ? 'text-orange-600' : 
                                      'text-green-600'
                                    }`}>
                                      {puedeProducir}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      unidades
                                    </p>
                                  </div>
                                )
                              })()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingId(pi.id)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEliminar(pi.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <p className="mb-4">No hay ingredientes asignados a este producto</p>
                    <Button onClick={handleOpenDialog} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Primer Ingrediente
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialog Agregar Ingrediente */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Ingrediente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Seleccionar Ingrediente */}
              <div className="space-y-2">
                <Label htmlFor="ingrediente">
                  Ingrediente <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.ingrediente_id}
                  onValueChange={(value) => setFormData({ ...formData, ingrediente_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un ingrediente" />
                  </SelectTrigger>
                  <SelectContent>
                    {ingredientesDisponibles && ingredientesDisponibles.length > 0 ? (
                      ingredientesDisponibles.map(ing => (
                        <SelectItem key={ing.id} value={ing.id}>
                          <div className="flex items-center justify-between w-full gap-4">
                            <span className="font-medium">{ing.nombre}</span>
                            <span className="text-xs text-muted-foreground">
                              ${ing.costo_unitario?.toLocaleString('es-CL')}/{ing.unidad_medida}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Todos los ingredientes ya están asignados
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Cantidad */}
              <div className="space-y-2">
                <Label htmlFor="cantidad">
                  Cantidad Necesaria <span className="text-destructive">*</span>
                  {ingredienteSeleccionado && (
                    <span className="ml-2 text-primary font-semibold">
                      (en {ingredienteSeleccionado.unidad_medida})
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    id="cantidad"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.cantidad_necesaria}
                    onChange={(e) => setFormData({ ...formData, cantidad_necesaria: parseFloat(e.target.value) || 0 })}
                    required
                    placeholder={
                      ingredienteSeleccionado 
                        ? `Ejemplo: ${ingredienteSeleccionado.unidad_medida === 'kg' || ingredienteSeleccionado.unidad_medida === 'litros' ? '0.5' : '100'}`
                        : 'Selecciona un ingrediente primero'
                    }
                    disabled={!ingredienteSeleccionado}
                    className={ingredienteSeleccionado ? 'pr-16' : ''}
                  />
                  {ingredienteSeleccionado && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Badge variant="secondary" className="font-semibold">
                        {ingredienteSeleccionado.unidad_medida}
                      </Badge>
                    </div>
                  )}
                </div>
                {ingredienteSeleccionado ? (
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-xs text-muted-foreground">
                      💡 <strong>Ejemplo:</strong> Si usas <strong>0.5 {ingredienteSeleccionado.unidad_medida}</strong> de {ingredienteSeleccionado.nombre} por unidad, ingresa <strong>0.5</strong>
                    </p>
                    <p className="text-xs text-primary mt-1">
                      📊 Costo: ${(ingredienteSeleccionado.costo_unitario || 0).toLocaleString('es-CL')} por {ingredienteSeleccionado.unidad_medida}
                      {formData.cantidad_necesaria > 0 && (
                        <span className="font-semibold ml-2">
                          → Total: ${Math.round((ingredienteSeleccionado.costo_unitario || 0) * formData.cantidad_necesaria).toLocaleString('es-CL')}
                        </span>
                      )}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Selecciona primero un ingrediente para ver su unidad de medida
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!formData.ingrediente_id || formData.cantidad_necesaria <= 0}>
                Agregar Ingrediente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminProductoCostos


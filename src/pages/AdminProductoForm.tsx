import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts'
import { useCategorias } from '@/hooks/useCategorias'
import { useAllIngredientes } from '@/hooks/useIngredientes'
import { useProductoIngredientes, useAsignarIngrediente, useEliminarIngredienteDeProducto, useActualizarCantidadIngrediente } from '@/hooks/useProductoIngredientes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import ImageUpload from '@/components/ImageUpload'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Save, Plus, Trash2, Calculator, TrendingUp } from 'lucide-react'

type ProductFormData = {
  nombre: string
  descripcion: string
  precio: number
  categoria: string
  imagen_url: string
  tags: string
  stock_disponible: number
  stock_minimo: number
  activo: boolean
}

const AdminProductoForm = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  const { data: product, isLoading: loadingProduct } = useProduct(id || '')
  const { data: categorias } = useCategorias()
  const { data: ingredientes } = useAllIngredientes()
  const { data: ingredientesProducto } = useProductoIngredientes(id || '') as { 
    data: Array<{
      id: string
      producto_id: string
      ingrediente_id: string
      cantidad_necesaria: number
      ingredientes?: any
    }> | undefined 
  }
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const asignarIngrediente = useAsignarIngrediente()
  const eliminarIngrediente = useEliminarIngredienteDeProducto()
  const actualizarCantidad = useActualizarCantidadIngrediente()

  // Estado para diálogo de ingredientes
  const [isIngredienteDialogOpen, setIsIngredienteDialogOpen] = useState(false)
  const [selectedIngredienteId, setSelectedIngredienteId] = useState('')
  const [cantidadNecesaria, setCantidadNecesaria] = useState(1)

  // Calcular costo total del producto
  const costoProduccion = ingredientesProducto?.reduce((total, pi) => {
    const ingrediente = pi.ingredientes as any
    return total + (pi.cantidad_necesaria * (ingrediente?.costo_unitario || 0))
  }, 0) || 0

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    defaultValues: {
      activo: true,
    },
  })

  const categoria = watch('categoria')

  // Cargar datos del producto si estamos editando
  useEffect(() => {
    if (product) {
      setValue('nombre', product.nombre)
      setValue('descripcion', product.descripcion || '')
      setValue('precio', product.precio)
      setValue('categoria', product.categoria)
      setValue('imagen_url', product.imagen_url || '')
      setValue('tags', product.tags?.join(', ') || '')
      setValue('stock_disponible', product.stock_disponible || 0)
      setValue('stock_minimo', product.stock_minimo || 5)
      setValue('activo', product.activo)
    }
  }, [product, setValue])

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Convertir tags de string a array
      const tagsArray = data.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const productData = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: Number(data.precio),
        categoria: data.categoria,
        imagen_url: data.imagen_url || null,
        tags: tagsArray,
        stock_disponible: Number(data.stock_disponible) || 0,
        stock_minimo: Number(data.stock_minimo) || 5,
        activo: data.activo,
      }

      if (isEditing && id) {
        await updateProduct.mutateAsync({
          id,
          updates: productData,
        })
      } else {
        await createProduct.mutateAsync(productData)
      }

      navigate('/admin/productos')
    } catch (error) {
      console.error('Error al guardar producto:', error)
    }
  }

  // Funciones para manejar ingredientes
  const handleOpenIngredienteDialog = () => {
    setSelectedIngredienteId('')
    setCantidadNecesaria(1)
    setIsIngredienteDialogOpen(true)
  }

  const handleAgregarIngrediente = async () => {
    if (!id || !selectedIngredienteId || cantidadNecesaria <= 0) return

    try {
      await asignarIngrediente.mutateAsync({
        producto_id: id,
        ingrediente_id: selectedIngredienteId,
        cantidad_necesaria: cantidadNecesaria,
      })
      setIsIngredienteDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEliminarIngrediente = async (productoIngredienteId: string) => {
    if (!id) return
    try {
      await eliminarIngrediente.mutateAsync({
        id: productoIngredienteId,
        productoId: id
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (isEditing && loadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/productos')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <h1 className="font-display text-xl font-semibold text-foreground">
                {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>
                  Datos principales del producto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="nombre">
                    Nombre del Producto <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    {...register('nombre', { required: 'El nombre es requerido' })}
                    placeholder="Ej: Torta de Chocolate"
                  />
                  {errors.nombre && (
                    <p className="text-sm text-destructive">{errors.nombre.message}</p>
                  )}
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    {...register('descripcion')}
                    placeholder="Descripción detallada del producto"
                    rows={3}
                  />
                </div>

                {/* Precio y Categoría */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Precio */}
                  <div className="space-y-2">
                    <Label htmlFor="precio">
                      Precio (CLP) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="precio"
                      type="number"
                      step="1"
                      {...register('precio', {
                        required: 'El precio es requerido',
                        min: { value: 0, message: 'El precio debe ser mayor a 0' },
                      })}
                      placeholder="18990"
                    />
                    {errors.precio && (
                      <p className="text-sm text-destructive">{errors.precio.message}</p>
                    )}
                  </div>

                  {/* Categoría */}
                  <div className="space-y-2">
                    <Label htmlFor="categoria">
                      Categoría <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={categoria}
                      onValueChange={(value) => setValue('categoria', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias?.filter(cat => cat.slug !== 'all').map(categoria => (
                          <SelectItem key={categoria.id} value={categoria.slug}>
                            {categoria.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoria && (
                      <p className="text-sm text-destructive">{errors.categoria.message}</p>
                    )}
                  </div>
                </div>

                {/* Stock Disponible y Stock Mínimo */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Stock Disponible */}
                  <div className="space-y-2">
                    <Label htmlFor="stock_disponible">
                      Stock Disponible
                    </Label>
                    <Input
                      id="stock_disponible"
                      type="number"
                      step="1"
                      {...register('stock_disponible', {
                        min: { value: 0, message: 'El stock no puede ser negativo' },
                        valueAsNumber: true,
                      })}
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">
                      Unidades disponibles para venta
                    </p>
                  </div>

                  {/* Stock Mínimo */}
                  <div className="space-y-2">
                    <Label htmlFor="stock_minimo">
                      Stock Mínimo (Alerta)
                    </Label>
                    <Input
                      id="stock_minimo"
                      type="number"
                      step="1"
                      {...register('stock_minimo', {
                        min: { value: 0, message: 'El stock mínimo no puede ser negativo' },
                        valueAsNumber: true,
                      })}
                      placeholder="5"
                    />
                    <p className="text-xs text-muted-foreground">
                      Te alertará cuando el stock esté por debajo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredientes y Costos - Solo en modo edición */}
            {isEditing && id && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Ingredientes y Costos</CardTitle>
                      <CardDescription>
                        Configura la receta y calcula el costo de producción
                      </CardDescription>
                    </div>
                    <Button onClick={handleOpenIngredienteDialog} size="sm" type="button">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Ingrediente
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Resumen de Costos */}
                  {ingredientesProducto && ingredientesProducto.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-xs text-orange-600 font-medium mb-1">Costo de Producción</p>
                        <p className="text-2xl font-bold text-orange-700">
                          ${Math.round(costoProduccion).toLocaleString('es-CL')}
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-green-600 font-medium mb-1">Ganancia Unitaria</p>
                        <p className="text-2xl font-bold text-green-700">
                          ${Math.round(watch('precio') - costoProduccion).toLocaleString('es-CL')}
                        </p>
                      </div>
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">Margen</p>
                        <p className="text-2xl font-bold text-primary">
                          {Math.round(((watch('precio') - costoProduccion) / watch('precio')) * 100)}%
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tabla de Ingredientes */}
                  {ingredientesProducto && ingredientesProducto.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ingrediente</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Puede Producir</TableHead>
                            <TableHead>Costo</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ingredientesProducto.map((pi) => {
                            const ingrediente = pi.ingredientes as any
                            const puedeProducir = Math.floor(ingrediente?.stock_actual / pi.cantidad_necesaria)
                            const costoIngrediente = pi.cantidad_necesaria * (ingrediente?.costo_unitario || 0)

                            return (
                              <TableRow key={pi.id}>
                                <TableCell>
                                  <p className="font-medium">{ingrediente?.nombre}</p>
                                </TableCell>
                                <TableCell>
                                  <span className="font-semibold">{pi.cantidad_necesaria}</span>
                                  <span className="text-xs text-muted-foreground ml-1">
                                    {ingrediente?.unidad_medida}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={ingrediente?.stock_actual <= 0 ? 'destructive' : 'secondary'}>
                                    {ingrediente?.stock_actual} {ingrediente?.unidad_medida}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <span className={`font-bold ${
                                    puedeProducir === 0 ? 'text-red-600' :
                                    puedeProducir < 10 ? 'text-orange-600' :
                                    'text-green-600'
                                  }`}>
                                    {puedeProducir}
                                  </span>
                                  <span className="text-xs text-muted-foreground ml-1">unid.</span>
                                </TableCell>
                                <TableCell>
                                  ${Math.round(costoIngrediente).toLocaleString('es-CL')}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEliminarIngrediente(pi.id)}
                                    type="button"
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
                  ) : (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      <p>No hay ingredientes asignados</p>
                      <p className="text-sm mt-1">Agrega ingredientes para calcular costos</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Imagen y Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Imagen y Etiquetas</CardTitle>
                <CardDescription>
                  URL de la imagen y características del producto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload de Imagen */}
                <ImageUpload
                  currentImageUrl={watch('imagen_url')}
                  onImageUploaded={(url) => setValue('imagen_url', url)}
                  folder="productos"
                  label="Imagen del Producto"
                />

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Etiquetas</Label>
                  <Input
                    id="tags"
                    {...register('tags')}
                    placeholder="Sin Azúcar, Sin Gluten, Vegano"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separa las etiquetas con comas
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/productos')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Actualizar' : 'Crear'} Producto
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>

      {/* Dialog para Agregar Ingrediente */}
      <Dialog open={isIngredienteDialogOpen} onOpenChange={setIsIngredienteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Ingrediente a la Receta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Seleccionar Ingrediente */}
            <div className="space-y-2">
              <Label htmlFor="ingrediente">Ingrediente *</Label>
              <Select
                value={selectedIngredienteId}
                onValueChange={setSelectedIngredienteId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un ingrediente" />
                </SelectTrigger>
                <SelectContent>
                  {ingredientes
                    ?.filter(ing => !ingredientesProducto?.some(pi => pi.ingrediente_id === ing.id))
                    .map(ingrediente => (
                      <SelectItem key={ingrediente.id} value={ingrediente.id}>
                        {ingrediente.nombre} - Stock: {ingrediente.stock_actual} {ingrediente.unidad_medida}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cantidad Necesaria */}
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad Necesaria (por unidad) *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cantidad"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={cantidadNecesaria}
                  onChange={(e) => setCantidadNecesaria(parseFloat(e.target.value) || 0)}
                  placeholder="1"
                />
                {selectedIngredienteId && (
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {ingredientes?.find(i => i.id === selectedIngredienteId)?.unidad_medida}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Cantidad necesaria para producir 1 unidad del producto
              </p>
            </div>

            {/* Preview de Producción */}
            {selectedIngredienteId && cantidadNecesaria > 0 && (() => {
              const ingrediente = ingredientes?.find(i => i.id === selectedIngredienteId)
              const puedeProducir = Math.floor((ingrediente?.stock_actual || 0) / cantidadNecesaria)
              const costo = cantidadNecesaria * (ingrediente?.costo_unitario || 0)

              return (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">Preview:</p>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Con stock actual puedes producir:</span>
                      <span className={`ml-2 font-bold ${
                        puedeProducir === 0 ? 'text-red-600' :
                        puedeProducir < 10 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {puedeProducir} unidades
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Costo por unidad:</span>
                      <span className="ml-2 font-semibold text-blue-700">
                        ${Math.round(costo).toLocaleString('es-CL')}
                      </span>
                    </p>
                  </div>
                </div>
              )
            })()}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsIngredienteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleAgregarIngrediente}
              disabled={!selectedIngredienteId || cantidadNecesaria <= 0 || asignarIngrediente.isPending}
            >
              {asignarIngrediente.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Agregando...
                </>
              ) : (
                'Agregar Ingrediente'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminProductoForm


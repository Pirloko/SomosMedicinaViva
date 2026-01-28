import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllIngredientes, useDeleteIngrediente, useDeleteIngredientePermanentemente, useCreateIngrediente, useUpdateIngrediente, useToggleIngredienteActivo } from '@/hooks/useIngredientes'
import { useRegistrarCompra } from '@/hooks/useComprasIngredientes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import ImageUpload from '@/components/ImageUpload'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ArrowLeft, Plus, Edit, Trash2, Search, Loader2, AlertTriangle, MoreVertical, EyeOff, Eye, ShoppingCart } from 'lucide-react'
import { Database } from '@/types/database.types'

type Ingrediente = Database['public']['Tables']['ingredientes']['Row']

const AdminIngredientes = () => {
  const navigate = useNavigate()
  const { data: ingredientes, isLoading } = useAllIngredientes()
  const deleteIngrediente = useDeleteIngrediente()
  const deleteIngredientePermanentemente = useDeleteIngredientePermanentemente()
  const toggleIngredienteActivo = useToggleIngredienteActivo()
  const registrarCompra = useRegistrarCompra()
  const createIngrediente = useCreateIngrediente()
  const updateIngrediente = useUpdateIngrediente()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deletePermanentlyId, setDeletePermanentlyId] = useState<string | null>(null)
  const [editingIngrediente, setEditingIngrediente] = useState<Ingrediente | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Estado para dialog de compra
  const [isCompraDialogOpen, setIsCompraDialogOpen] = useState(false)
  const [comprandoIngrediente, setComprandoIngrediente] = useState<Ingrediente | null>(null)
  const [compraData, setCompraData] = useState({
    cantidad: 0,
    costo_unitario: 0,
    proveedor: '',
    numero_factura: '',
    fecha_compra: new Date().toISOString().split('T')[0],
    notas: '',
  })
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    beneficio: '',
    unidad_medida: 'kg',
    stock_actual: 0,
    stock_minimo: 0,
    costo_unitario: 0,
    imagen_url: '',
  })

  // Filtrar ingredientes
  const filteredIngredientes = ingredientes?.filter(ing =>
    ing.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Ingredientes con stock bajo
  const stockBajo = ingredientes?.filter(ing => ing.stock_actual <= ing.stock_minimo).length || 0

  const handleOpenDialog = (ingrediente?: Ingrediente) => {
    if (ingrediente) {
      setEditingIngrediente(ingrediente)
      setFormData({
        nombre: ingrediente.nombre,
        descripcion: ingrediente.descripcion || '',
        beneficio: ingrediente.beneficio || '',
        unidad_medida: ingrediente.unidad_medida,
        stock_actual: ingrediente.stock_actual,
        stock_minimo: ingrediente.stock_minimo,
        costo_unitario: ingrediente.costo_unitario || 0,
        imagen_url: ingrediente.imagen_url || '',
      })
    } else {
      setEditingIngrediente(null)
      setFormData({
        nombre: '',
        descripcion: '',
        beneficio: '',
        unidad_medida: 'kg',
        stock_actual: 0,
        stock_minimo: 0,
        costo_unitario: 0,
        imagen_url: '',
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingIngrediente) {
        // Al editar, mantener stock_actual y costo_unitario existentes
        await updateIngrediente.mutateAsync({
          id: editingIngrediente.id,
          updates: {
            ...formData,
            stock_actual: editingIngrediente.stock_actual, // Mantener valor existente
            costo_unitario: editingIngrediente.costo_unitario || 0, // Mantener valor existente
          },
        })
      } else {
        // Al crear, establecer stock_actual y costo_unitario en 0
        await createIngrediente.mutateAsync({
          ...formData,
          stock_actual: 0, // Se gestiona desde "Manejo de Stock"
          costo_unitario: 0, // Se gestiona desde "Manejo de Stock"
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteIngrediente.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleDeletePermanently = async () => {
    if (deletePermanentlyId) {
      await deleteIngredientePermanentemente.mutateAsync(deletePermanentlyId)
      setDeletePermanentlyId(null)
    }
  }

  // Funciones para compra de ingredientes
  const handleOpenCompraDialog = (ingrediente: Ingrediente) => {
    setComprandoIngrediente(ingrediente)
    setCompraData({
      cantidad: 0,
      costo_unitario: ingrediente.costo_unitario || 0,
      proveedor: '',
      numero_factura: '',
      fecha_compra: new Date().toISOString().split('T')[0],
      notas: '',
    })
    setIsCompraDialogOpen(true)
  }

  const handleRegistrarCompra = async () => {
    if (!comprandoIngrediente || compraData.cantidad <= 0 || compraData.costo_unitario < 0) return

    try {
      await registrarCompra.mutateAsync({
        ingrediente_id: comprandoIngrediente.id,
        cantidad: compraData.cantidad,
        costo_unitario: compraData.costo_unitario,
        proveedor: compraData.proveedor || undefined,
        numero_factura: compraData.numero_factura || undefined,
        fecha_compra: compraData.fecha_compra,
        notas: compraData.notas || undefined,
      })
      setIsCompraDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
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
                  Gestión de Ingredientes
                </h1>
                <p className="text-xs text-muted-foreground">
                  {ingredientes?.length || 0} ingredientes · {stockBajo} con stock bajo · 
                  Valor total: ${(ingredientes?.reduce((sum, ing) => sum + (ing.stock_actual * (ing.costo_unitario || 0)), 0) || 0).toLocaleString('es-CL')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Inventario</p>
                <p className="text-sm font-bold text-primary">
                  ${(ingredientes?.reduce((sum, ing) => sum + (ing.stock_actual * (ing.costo_unitario || 0)), 0) || 0).toLocaleString('es-CL')}
                </p>
              </div>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Ingrediente
              </Button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar ingredientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stock Alerts */}
        {stockBajo > 0 && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-orange-700">
              <strong>{stockBajo} ingredientes</strong> tienen stock bajo o están agotados
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Ingredientes Table */}
        {!isLoading && filteredIngredientes && (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Stock Mínimo</TableHead>
                  <TableHead>Costo Unit.</TableHead>
                  <TableHead>Costo Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIngredientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      No se encontraron ingredientes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIngredientes.map((ingrediente) => {
                    const stockBajo = ingrediente.stock_actual <= ingrediente.stock_minimo
                    const sinStock = ingrediente.stock_actual === 0

                    return (
                      <TableRow key={ingrediente.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {ingrediente.imagen_url && (
                              <img
                                src={ingrediente.imagen_url}
                                alt={ingrediente.nombre}
                                className="w-10 h-10 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <p className="font-medium">{ingrediente.nombre}</p>
                              {ingrediente.beneficio && (
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {ingrediente.beneficio}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{ingrediente.unidad_medida}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className={sinStock ? 'text-red-600 font-bold' : stockBajo ? 'text-orange-600 font-semibold' : ''}>
                            {ingrediente.stock_actual}
                          </span>
                        </TableCell>
                        <TableCell>{ingrediente.stock_minimo}</TableCell>
                        <TableCell>
                          ${(ingrediente.costo_unitario || 0).toLocaleString('es-CL')}
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-primary">
                            ${((ingrediente.stock_actual * (ingrediente.costo_unitario || 0))).toLocaleString('es-CL')}
                          </span>
                        </TableCell>
                        <TableCell>
                          {sinStock ? (
                            <Badge variant="destructive">Sin Stock</Badge>
                          ) : stockBajo ? (
                            <Badge className="bg-orange-500">Stock Bajo</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">OK</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(ingrediente)}
                              title="Editar ingrediente"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {ingrediente.activo ? (
                                  <DropdownMenuItem onClick={() => toggleIngredienteActivo.mutate({ id: ingrediente.id, activo: false })}>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Desactivar
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => toggleIngredienteActivo.mutate({ id: ingrediente.id, activo: true })}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Activar
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => setDeletePermanentlyId(ingrediente.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Eliminar Permanentemente
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
                
                {/* Fila de Totales */}
                {filteredIngredientes.length > 0 && (
                  <TableRow className="bg-muted/50 font-semibold border-t-2">
                    <TableCell colSpan={4} className="text-right">
                      VALOR TOTAL DEL INVENTARIO:
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <span className="text-lg font-bold text-primary">
                        ${filteredIngredientes.reduce((sum, ing) => 
                          sum + (ing.stock_actual * (ing.costo_unitario || 0)), 0
                        ).toLocaleString('es-CL')}
                      </span>
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingIngrediente ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  placeholder="Ej: Cacao Puro"
                />
              </div>

              {/* Descripción y Beneficio */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Descripción breve"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beneficio">Beneficio</Label>
                  <Textarea
                    id="beneficio"
                    value={formData.beneficio}
                    onChange={(e) => setFormData({ ...formData, beneficio: e.target.value })}
                    placeholder="Beneficio para la salud"
                    rows={2}
                  />
                </div>
              </div>

              {/* Unidad y Stock Mínimo */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unidad">Unidad de Medida *</Label>
                  <Select
                    value={formData.unidad_medida}
                    onValueChange={(value) => setFormData({ ...formData, unidad_medida: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                      <SelectItem value="gramos">Gramos (g)</SelectItem>
                      <SelectItem value="litros">Litros (L)</SelectItem>
                      <SelectItem value="unidades">Unidades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock_minimo">Stock Mínimo</Label>
                  <Input
                    id="stock_minimo"
                    type="number"
                    step="0.01"
                    value={formData.stock_minimo}
                    onChange={(e) => setFormData({ ...formData, stock_minimo: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-muted-foreground">
                    El stock actual y costo unitario se gestionan desde "Manejo de Stock"
                  </p>
                </div>
              </div>

              {/* Upload de Imagen */}
              <ImageUpload
                currentImageUrl={formData.imagen_url}
                onImageUploaded={(url) => setFormData({ ...formData, imagen_url: url })}
                folder="ingredientes"
                label="Imagen del Ingrediente"
              />
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingIngrediente ? 'Actualizar' : 'Crear'} Ingrediente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      {/* Deactivate Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar ingrediente?</AlertDialogTitle>
            <AlertDialogDescription>
              El ingrediente no se mostrará en la sección pública pero permanecerá en la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Permanently Dialog */}
      <AlertDialog open={!!deletePermanentlyId} onOpenChange={(open) => !open && setDeletePermanentlyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              ¿Eliminar permanentemente?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="font-semibold">⚠️ Esta acción NO se puede deshacer.</p>
              <p>El ingrediente será eliminado completamente de la base de datos.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePermanently} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, Eliminar Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para Actualizar Stock (Registrar Compra) */}
      <Dialog open={isCompraDialogOpen} onOpenChange={setIsCompraDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-green-600" />
              Actualizar Stock - {comprandoIngrediente?.nombre}
            </DialogTitle>
          </DialogHeader>
          
          {comprandoIngrediente && (
            <div className="space-y-4">
              {/* Info actual */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">📊 Estado Actual:</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Stock actual:</p>
                    <p className="font-bold">{comprandoIngrediente.stock_actual} {comprandoIngrediente.unidad_medida}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Costo actual:</p>
                    <p className="font-bold">${(comprandoIngrediente.costo_unitario || 0).toLocaleString('es-CL')}/{comprandoIngrediente.unidad_medida}</p>
                  </div>
                </div>
              </div>

              {/* Campos de compra */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cantidad */}
                <div className="space-y-2">
                  <Label htmlFor="compra-cantidad">
                    Cantidad a Agregar * <Badge variant="outline">{comprandoIngrediente.unidad_medida}</Badge>
                  </Label>
                  <Input
                    id="compra-cantidad"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={compraData.cantidad}
                    onChange={(e) => setCompraData({ ...compraData, cantidad: parseFloat(e.target.value) || 0 })}
                    required
                    placeholder="50"
                  />
                </div>

                {/* Costo Unitario */}
                <div className="space-y-2">
                  <Label htmlFor="compra-costo">
                    Costo Unitario * <Badge variant="outline">$/{comprandoIngrediente.unidad_medida}</Badge>
                  </Label>
                  <Input
                    id="compra-costo"
                    type="number"
                    step="1"
                    min="0"
                    value={compraData.costo_unitario}
                    onChange={(e) => setCompraData({ ...compraData, costo_unitario: parseFloat(e.target.value) || 0 })}
                    required
                    placeholder="5000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Precio por {comprandoIngrediente.unidad_medida} de esta compra
                  </p>
                </div>
              </div>

              {/* Proveedor y Factura */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="compra-proveedor">Proveedor (Opcional)</Label>
                  <Input
                    id="compra-proveedor"
                    value={compraData.proveedor}
                    onChange={(e) => setCompraData({ ...compraData, proveedor: e.target.value })}
                    placeholder="Nombre del proveedor"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compra-factura">N° Factura (Opcional)</Label>
                  <Input
                    id="compra-factura"
                    value={compraData.numero_factura}
                    onChange={(e) => setCompraData({ ...compraData, numero_factura: e.target.value })}
                    placeholder="F-12345"
                  />
                </div>
              </div>

              {/* Fecha y Notas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="compra-fecha">Fecha de Compra</Label>
                  <Input
                    id="compra-fecha"
                    type="date"
                    value={compraData.fecha_compra}
                    onChange={(e) => setCompraData({ ...compraData, fecha_compra: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compra-notas">Notas (Opcional)</Label>
                  <Input
                    id="compra-notas"
                    value={compraData.notas}
                    onChange={(e) => setCompraData({ ...compraData, notas: e.target.value })}
                    placeholder="Compra mensual, etc."
                  />
                </div>
              </div>

              {/* Preview de cálculos */}
              {compraData.cantidad > 0 && compraData.costo_unitario >= 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-3">💰 Preview de la Compra:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Cantidad</p>
                      <p className="font-bold text-green-700">{compraData.cantidad} {comprandoIngrediente.unidad_medida}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Costo Total</p>
                      <p className="font-bold text-green-700">
                        ${Math.round(compraData.cantidad * compraData.costo_unitario).toLocaleString('es-CL')}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Stock Después</p>
                      <p className="font-bold text-primary">
                        {(comprandoIngrediente.stock_actual + compraData.cantidad).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Incremento</p>
                      <p className="font-bold text-green-600">+{compraData.cantidad}</p>
                    </div>
                  </div>
                  
                  {/* Costo Promedio */}
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-muted-foreground mb-1">Cálculo de Costo Promedio Ponderado:</p>
                    <div className="text-xs text-green-800 space-y-1">
                      <p>• Valor inventario actual: ${Math.round(comprandoIngrediente.stock_actual * (comprandoIngrediente.costo_unitario || 0)).toLocaleString('es-CL')}</p>
                      <p>• Valor compra nueva: ${Math.round(compraData.cantidad * compraData.costo_unitario).toLocaleString('es-CL')}</p>
                      <p>• Valor total: ${Math.round((comprandoIngrediente.stock_actual * (comprandoIngrediente.costo_unitario || 0)) + (compraData.cantidad * compraData.costo_unitario)).toLocaleString('es-CL')}</p>
                      <p className="font-semibold">
                        • Nuevo costo promedio: ${(() => {
                          const stockTotal = comprandoIngrediente.stock_actual + compraData.cantidad
                          const valorTotal = (comprandoIngrediente.stock_actual * (comprandoIngrediente.costo_unitario || 0)) + (compraData.cantidad * compraData.costo_unitario)
                          return stockTotal > 0 
                            ? Math.round(valorTotal / stockTotal).toLocaleString('es-CL')
                            : '0'
                        })()}/{comprandoIngrediente.unidad_medida}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCompraDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleRegistrarCompra}
              disabled={compraData.cantidad <= 0 || compraData.costo_unitario < 0 || registrarCompra.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {registrarCompra.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Registrar Compra
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminIngredientes


import { useState } from 'react'
import { useAllIngredientes } from '@/hooks/useIngredientes'
import { useRegistrarCompra } from '@/hooks/useComprasIngredientes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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
} from '@/components/ui/alert'
import { Search, Loader2, ShoppingCart, Info } from 'lucide-react'
import { Database } from '@/types/database.types'

type Ingrediente = Database['public']['Tables']['ingredientes']['Row']

const AdminIngredientesStock = () => {
  const { data: ingredientes, isLoading } = useAllIngredientes()
  const registrarCompra = useRegistrarCompra()
  
  const [searchTerm, setSearchTerm] = useState('')
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

  // Filtrar ingredientes por búsqueda
  const filteredIngredientes = ingredientes?.filter(ingrediente =>
    ingrediente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingrediente.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calcular valor total del inventario
  const valorTotalInventario = ingredientes?.reduce((total, ing) => {
    return total + (ing.stock_actual * (ing.costo_unitario || 0))
  }, 0) || 0

  // Contar ingredientes con stock bajo
  const ingredientesStockBajo = ingredientes?.filter(ing => 
    ing.stock_actual <= ing.stock_minimo && ing.activo
  ).length || 0

  // Abrir dialog de compra
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

  // Registrar compra
  const handleRegistrarCompra = async () => {
    if (!comprandoIngrediente || compraData.cantidad <= 0) return

    try {
      await registrarCompra.mutateAsync({
        ingrediente_id: comprandoIngrediente.id,
        cantidad: compraData.cantidad,
        costo_unitario: compraData.costo_unitario,
        proveedor: compraData.proveedor,
        numero_factura: compraData.numero_factura || undefined,
        fecha_compra: compraData.fecha_compra,
        notas: compraData.notas || undefined,
      })

      setIsCompraDialogOpen(false)
      setComprandoIngrediente(null)
      setCompraData({
        cantidad: 0,
        costo_unitario: 0,
        proveedor: '',
        numero_factura: '',
        fecha_compra: new Date().toISOString().split('T')[0],
        notas: '',
      })
    } catch (error) {
      console.error('Error al registrar compra:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Ingredientes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {ingredientes?.length || 0} ingredientes • {ingredientesStockBajo} con stock bajo • Valor total: ${valorTotalInventario.toLocaleString('es-CL')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Inventario</p>
          <p className="text-2xl font-bold text-green-600">
            ${valorTotalInventario.toLocaleString('es-CL')}
          </p>
        </div>
      </div>

      {/* Alert Info */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Usa el botón 🛒 en cada fila para registrar compras y actualizar stock
        </AlertDescription>
      </Alert>

      {/* Search */}
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Ingredients Table */}
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
                filteredIngredientes
                  .filter(ing => ing.activo)
                  .map((ingrediente) => {
                    const costoTotal = ingrediente.stock_actual * (ingrediente.costo_unitario || 0)
                    const stockBajo = ingrediente.stock_actual <= ingrediente.stock_minimo
                    const sinStock = ingrediente.stock_actual === 0

                    return (
                      <TableRow key={ingrediente.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {ingrediente.imagen_url ? (
                              <img
                                src={ingrediente.imagen_url}
                                alt={ingrediente.nombre}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🌿</span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{ingrediente.nombre}</p>
                              {ingrediente.descripcion && (
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {ingrediente.descripcion}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{ingrediente.unidad_medida}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {ingrediente.stock_actual} {ingrediente.unidad_medida}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {ingrediente.stock_minimo} {ingrediente.unidad_medida}
                        </TableCell>
                        <TableCell>
                          ${(ingrediente.costo_unitario || 0).toLocaleString('es-CL')}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ${costoTotal.toLocaleString('es-CL')}
                        </TableCell>
                        <TableCell>
                          {sinStock ? (
                            <Badge variant="destructive">Sin Stock</Badge>
                          ) : stockBajo ? (
                            <Badge className="bg-orange-500 text-white">Bajo</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">OK</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenCompraDialog(ingrediente)}
                            title="Registrar compra y actualizar stock"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
              )}
            </TableBody>
          </Table>

          {/* Footer con total */}
          {filteredIngredientes.length > 0 && (
            <div className="border-t bg-muted/50 p-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">VALOR TOTAL DEL INVENTARIO:</span>
                <span className="font-bold text-2xl text-green-600">
                  ${valorTotalInventario.toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dialog de Compra */}
      <Dialog open={isCompraDialogOpen} onOpenChange={setIsCompraDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Compra de {comprandoIngrediente?.nombre}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="cantidad">Cantidad *</Label>
              <Input
                id="cantidad"
                type="number"
                min="0"
                step="0.01"
                value={compraData.cantidad || ''}
                onChange={(e) => setCompraData({ ...compraData, cantidad: parseFloat(e.target.value) || 0 })}
                placeholder="Ej: 10"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Unidad: {comprandoIngrediente?.unidad_medida}
              </p>
            </div>

            <div>
              <Label htmlFor="costo_unitario">Costo Unitario *</Label>
              <Input
                id="costo_unitario"
                type="number"
                min="0"
                step="0.01"
                value={compraData.costo_unitario || ''}
                onChange={(e) => setCompraData({ ...compraData, costo_unitario: parseFloat(e.target.value) || 0 })}
                placeholder="Ej: 1500"
              />
            </div>

            <div>
              <Label htmlFor="proveedor">Proveedor</Label>
              <Input
                id="proveedor"
                type="text"
                value={compraData.proveedor}
                onChange={(e) => setCompraData({ ...compraData, proveedor: e.target.value })}
                placeholder="Nombre del proveedor"
              />
            </div>

            <div>
              <Label htmlFor="numero_factura">Número de Factura</Label>
              <Input
                id="numero_factura"
                type="text"
                value={compraData.numero_factura}
                onChange={(e) => setCompraData({ ...compraData, numero_factura: e.target.value })}
                placeholder="Opcional"
              />
            </div>

            <div>
              <Label htmlFor="fecha_compra">Fecha de Compra</Label>
              <Input
                id="fecha_compra"
                type="date"
                value={compraData.fecha_compra}
                onChange={(e) => setCompraData({ ...compraData, fecha_compra: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                value={compraData.notas}
                onChange={(e) => setCompraData({ ...compraData, notas: e.target.value })}
                placeholder="Notas adicionales (opcional)"
                rows={3}
              />
            </div>

            {comprandoIngrediente && compraData.cantidad > 0 && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-semibold mb-2">Resumen:</p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Stock actual:</span>{' '}
                  <span className="font-semibold">
                    {comprandoIngrediente.stock_actual} {comprandoIngrediente.unidad_medida}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Stock después:</span>{' '}
                  <span className="font-bold text-green-600">
                    {(comprandoIngrediente.stock_actual + compraData.cantidad).toFixed(2)}{' '}
                    {comprandoIngrediente.unidad_medida}
                  </span>
                </p>
                <p className="text-sm mt-2">
                  <span className="text-muted-foreground">Costo total:</span>{' '}
                  <span className="font-bold">
                    ${(compraData.cantidad * compraData.costo_unitario).toLocaleString('es-CL')}
                  </span>
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompraDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleRegistrarCompra}
              disabled={compraData.cantidad <= 0 || compraData.costo_unitario <= 0 || registrarCompra.isPending}
            >
              {registrarCompra.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registrando...
                </>
              ) : (
                'Registrar Compra'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminIngredientesStock

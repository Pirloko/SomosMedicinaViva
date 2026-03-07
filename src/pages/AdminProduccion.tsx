import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { useRegistrarProduccionSimple, useMovimientosStock } from '@/hooks/useStock'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { ArrowLeft, Factory, Loader2, History } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface AdminProduccionProps {
  hideHeader?: boolean
}

const AdminProduccion = ({ hideHeader = false }: AdminProduccionProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data: productos } = useProducts('all')
  const registrarProduccion = useRegistrarProduccionSimple()
  const { data: movimientos = [] } = useMovimientosStock(undefined)

  const [selectedProductoId, setSelectedProductoId] = useState('')
  const [stockProducido, setStockProducido] = useState(1)
  const [motivo, setMotivo] = useState('Producción del día')

  const productoSeleccionado = productos?.find(p => p.id === selectedProductoId)

  const producciones = movimientos
    .filter(m => m.tipo === 'produccion')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 50)

  const getNombreProducto = (productoId: string) =>
    productos?.find(p => p.id === productoId)?.nombre ?? '—'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProductoId || stockProducido <= 0) return

    try {
      await registrarProduccion.mutateAsync({
        producto_id: selectedProductoId,
        cantidad: stockProducido,
        motivo: motivo.trim() || 'Producción del día',
      })
      setSelectedProductoId('')
      setStockProducido(1)
      setMotivo('Producción del día')
    } catch {
      // Toast ya se muestra en el hook
    }
  }

  return (
    <div className={hideHeader ? "" : "min-h-screen bg-background"}>
      {!hideHeader && (
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
                    Producto y cantidad producida. El stock se actualiza al guardar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={hideHeader ? "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" : "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}>
        <Alert className="mb-6 border-primary bg-primary/5">
          <Factory className="h-4 w-4 text-primary" />
          <AlertTitle>Producción simple</AlertTitle>
          <AlertDescription className="text-sm">
            Elige el producto que fabricaste y la cantidad. Al guardar se actualiza el stock del producto
            y el listado de productos sin stock. No es necesario registrar ingredientes utilizados.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos de la Producción</CardTitle>
              <CardDescription>Producto y cantidad producida</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="producto">Producto Fabricado *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Producido (Unidades) *</Label>
                <Input
                  id="stock"
                  type="number"
                  min={1}
                  value={stockProducido}
                  onChange={(e) => setStockProducido(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-muted-foreground">
                  ¿Cuántas unidades fabricaste?
                </p>
              </div>

              {productoSeleccionado && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-2">Stock del Producto:</p>
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

              <div className="flex items-center justify-between pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedProductoId || stockProducido <= 0 || registrarProduccion.isPending}
                >
                  {registrarProduccion.isPending ? (
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
            </CardContent>
          </Card>
        </form>

        {/* Historial de producción */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Historial de producción
            </CardTitle>
            <CardDescription>
              Últimas producciones registradas (producto, cantidad, fecha y nota)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {producciones.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground text-sm">
                Aún no hay registros de producción.
              </p>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead>Nota / Motivo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {producciones.map((mov) => (
                      <TableRow key={mov.id}>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {format(new Date(mov.created_at), "d MMM yyyy, HH:mm", { locale: es })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {getNombreProducto(mov.producto_id)}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-green-600">
                          +{mov.cantidad}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                          {mov.motivo || '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default AdminProduccion

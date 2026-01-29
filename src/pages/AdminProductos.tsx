import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAllProducts, useDeleteProduct, useDeleteProductPermanently, useToggleProductoActivo } from '@/hooks/useProducts'
import { useAuth } from '@/contexts/AuthContext'
import { useProductosCriticos } from '@/hooks/useStock'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { ArrowLeft, Plus, Edit, Trash2, Search, Loader2, Eye, EyeOff, MoreVertical, AlertTriangle } from 'lucide-react'

const AdminProductos = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { role } = useAuth()
  const isVendedor = location.pathname.startsWith('/vendedor') || role === 'vendedor'
  const { data: products, isLoading } = useAllProducts()
  const { data: productosCriticos } = useProductosCriticos()
  const deleteProduct = useDeleteProduct()
  const deleteProductPermanently = useDeleteProductPermanently()
  const toggleProductoActivo = useToggleProductoActivo()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deletePermanentlyId, setDeletePermanentlyId] = useState<string | null>(null)

  // Filtrar productos por búsqueda
  const filteredProducts = products?.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProduct.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleDeletePermanently = async () => {
    if (deletePermanentlyId) {
      await deleteProductPermanently.mutateAsync(deletePermanentlyId)
      setDeletePermanentlyId(null)
    }
  }

  const renderStockBadge = (product: (typeof filteredProducts)[0]) => {
    const sinStock = product.stock_disponible === 0
    const stockBajo = product.stock_disponible <= product.stock_minimo
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`font-semibold tabular-nums ${sinStock ? 'text-red-600' : stockBajo ? 'text-orange-600' : 'text-foreground'}`}>
          {product.stock_disponible} unid.
        </span>
        {sinStock ? (
          <Badge variant="destructive" className="text-xs">Sin Stock</Badge>
        ) : stockBajo ? (
          <Badge className="bg-orange-500 text-white text-xs">Bajo</Badge>
        ) : (
          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">OK</Badge>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <Button variant="ghost" size="sm" onClick={() => navigate(isVendedor ? '/vendedor' : '/admin')} className="shrink-0 -ml-2">
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Volver</span>
            </Button>
            <div className="min-w-0">
              <h1 className="font-display text-lg sm:text-xl font-semibold text-foreground">
                {isVendedor ? 'Productos' : 'Gestión de Productos'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {products?.length || 0} productos totales
              </p>
            </div>
          </div>
          {!isVendedor && (
            <Button onClick={() => navigate('/admin/productos/nuevo')} className="w-full sm:w-auto min-h-[44px] shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 min-h-[44px]"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Mobile: Cards */}
        {!isLoading && filteredProducts && (
          <div className="block md:hidden space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="bg-card rounded-xl border shadow-sm py-16 text-center text-muted-foreground">
                No se encontraron productos
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-card rounded-xl border shadow-sm overflow-hidden p-4 flex flex-col gap-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={product.imagen_url || '/placeholder.svg'}
                      alt={product.nombre}
                      className="w-20 h-20 object-cover rounded-xl shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground text-base leading-snug line-clamp-2 break-words">
                        {product.nombre}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                        {product.descripcion || '—'}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {product.categoria}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Precio</p>
                      <p className="font-semibold text-foreground">${product.precio.toLocaleString('es-CL')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Stock</p>
                      {renderStockBadge(product)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {product.activo ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <Eye className="w-4 h-4" /> Activo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground text-sm">
                          <EyeOff className="w-4 h-4" /> Inactivo
                        </span>
                      )}
                    </div>
                  </div>
                  {!isVendedor && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/productos/${product.id}`)}
                        className="flex-1 min-h-[44px]"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="min-h-[44px] min-w-[44px] px-3">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {product.activo ? (
                            <DropdownMenuItem onClick={() => toggleProductoActivo.mutate({ id: product.id, activo: false })}>
                              <EyeOff className="w-4 h-4 mr-2" /> Desactivar
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => toggleProductoActivo.mutate({ id: product.id, activo: true })}>
                              <Eye className="w-4 h-4 mr-2" /> Activar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setDeletePermanentlyId(product.id)} className="text-destructive focus:text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" /> Eliminar permanentemente
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Desktop: Table */}
        {!isLoading && filteredProducts && (
          <div className="hidden md:block bg-card rounded-xl border shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  {!isVendedor && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isVendedor ? 6 : 7} className="text-center py-10 text-muted-foreground">
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img
                          src={product.imagen_url || '/placeholder.svg'}
                          alt={product.nombre}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.nombre}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {product.descripcion}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.categoria}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${product.precio.toLocaleString('es-CL')}
                      </TableCell>
                      <TableCell>{renderStockBadge(product)}</TableCell>
                      <TableCell>
                        {product.activo ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">Activo</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <EyeOff className="w-4 h-4" />
                            <span className="text-sm">Inactivo</span>
                          </div>
                        )}
                      </TableCell>
                      {!isVendedor && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/productos/${product.id}`)} title="Editar producto">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {product.activo ? (
                                  <DropdownMenuItem onClick={() => toggleProductoActivo.mutate({ id: product.id, activo: false })}>
                                    <EyeOff className="w-4 h-4 mr-2" /> Desactivar
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => toggleProductoActivo.mutate({ id: product.id, activo: true })}>
                                    <Eye className="w-4 h-4 mr-2" /> Activar
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setDeletePermanentlyId(product.id)} className="text-destructive focus:text-destructive">
                                  <Trash2 className="w-4 h-4 mr-2" /> Eliminar Permanentemente
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desactivará el producto. No se mostrará en el catálogo público pero
              permanecerá en la base de datos. Puedes reactivarlo cuando quieras.
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

      {/* Delete Permanently Confirmation Dialog */}
      <AlertDialog open={!!deletePermanentlyId} onOpenChange={(open) => !open && setDeletePermanentlyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              ¿Eliminar permanentemente?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="font-semibold">⚠️ Esta acción NO se puede deshacer.</p>
              <p>
                El producto será eliminado completamente de la base de datos. 
                Esto incluirá todas las referencias en ventas y relaciones con ingredientes.
              </p>
              <p className="text-destructive">
                Si solo quieres ocultarlo temporalmente, usa "Desactivar" en su lugar.
              </p>
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
    </div>
  )
}

export default AdminProductos


import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllCategorias, useToggleCategoriaActivo, useDeleteCategoria, useCreateCategoria, useUpdateCategoria } from '@/hooks/useCategorias'
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
import { ArrowLeft, Plus, Edit, Trash2, Loader2, Eye, EyeOff, MoreVertical, AlertTriangle, Tag } from 'lucide-react'
import { Database } from '@/types/database.types'

type Categoria = Database['public']['Tables']['categorias']['Row']

const AdminCategorias = () => {
  const navigate = useNavigate()
  const { data: categorias, isLoading } = useAllCategorias()
  const toggleCategoriaActivo = useToggleCategoriaActivo()
  const deleteCategoria = useDeleteCategoria()
  const createCategoria = useCreateCategoria()
  const updateCategoria = useUpdateCategoria()
  
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre: '',
    slug: '',
    descripcion: '',
    orden: 0,
  })

  // Función para generar slug automáticamente
  const generateSlug = (nombre: string) => {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
      .trim()
      .replace(/\s+/g, '-') // Espacios a guiones
  }

  const handleOpenDialog = (categoria?: Categoria) => {
    if (categoria) {
      setEditingCategoria(categoria)
      setFormData({
        nombre: categoria.nombre,
        slug: categoria.slug,
        descripcion: categoria.descripcion || '',
        orden: categoria.orden,
      })
    } else {
      setEditingCategoria(null)
      const nextOrden = (categorias?.length || 0) + 1
      setFormData({
        nombre: '',
        slug: '',
        descripcion: '',
        orden: nextOrden,
      })
    }
    setIsDialogOpen(true)
  }

  const handleNombreChange = (nombre: string) => {
    setFormData({ ...formData, nombre })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = generateSlug(formData.nombre)
    const payload = { ...formData, slug }
    try {
      if (editingCategoria) {
        await updateCategoria.mutateAsync({
          id: editingCategoria.id,
          updates: payload,
        })
      } else {
        await createCategoria.mutateAsync(payload)
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCategoria.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="shrink-0 -ml-2">
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Volver</span>
            </Button>
            <div className="min-w-0">
              <h1 className="font-display text-lg sm:text-xl font-semibold text-foreground">
                Gestión de Categorías
              </h1>
              <p className="text-xs text-muted-foreground">
                {categorias?.length || 0} categorías configuradas
              </p>
            </div>
          </div>
          <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto min-h-[44px] shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Categoría
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Info Card */}
        <div className="mb-6 p-4 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="min-w-0 text-sm text-blue-800">
              <p className="font-semibold mb-1">💡 Sobre las Categorías</p>
              <p>Las categorías organizan tus productos en el catálogo. La categoría &quot;Todos&quot; es especial y muestra todos los productos.</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Mobile: Cards */}
        {!isLoading && categorias && (
          <div className="block md:hidden space-y-4">
            {categorias.length === 0 ? (
              <div className="bg-card rounded-xl border shadow-sm py-16 text-center text-muted-foreground">
                No hay categorías configuradas
              </div>
            ) : (
              categorias.map((categoria) => (
                <div
                  key={categoria.id}
                  className="bg-card rounded-xl border shadow-sm overflow-hidden p-4 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="shrink-0">{categoria.orden}</Badge>
                        <p className="font-semibold text-foreground text-base">{categoria.nombre}</p>
                      </div>
                      <code className="inline-block text-xs bg-muted px-2 py-1 rounded mt-2">
                        {categoria.slug}
                      </code>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {categoria.activo ? (
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
                  <p className="text-sm text-muted-foreground line-clamp-2 break-words">
                    {categoria.descripcion || '—'}
                  </p>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(categoria)}
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
                        {categoria.activo ? (
                          <DropdownMenuItem onClick={() => toggleCategoriaActivo.mutate({ id: categoria.id, activo: false })}>
                            <EyeOff className="w-4 h-4 mr-2" /> Desactivar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => toggleCategoriaActivo.mutate({ id: categoria.id, activo: true })}>
                            <Eye className="w-4 h-4 mr-2" /> Activar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteId(categoria.id)}
                          className="text-destructive focus:text-destructive"
                          disabled={categoria.slug === 'all'}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Eliminar permanentemente
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Desktop: Table */}
        {!isLoading && categorias && (
          <div className="hidden md:block bg-card rounded-xl border shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categorias.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No hay categorías configuradas
                    </TableCell>
                  </TableRow>
                ) : (
                  categorias.map((categoria) => (
                    <TableRow key={categoria.id}>
                      <TableCell>
                        <Badge variant="outline">{categoria.orden}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{categoria.nombre}</p>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{categoria.slug}</code>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground max-w-xs line-clamp-1">
                          {categoria.descripcion || '-'}
                        </p>
                      </TableCell>
                      <TableCell>
                        {categoria.activo ? (
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
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(categoria)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {categoria.activo ? (
                                <DropdownMenuItem onClick={() => toggleCategoriaActivo.mutate({ id: categoria.id, activo: false })}>
                                  <EyeOff className="w-4 h-4 mr-2" /> Desactivar
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => toggleCategoriaActivo.mutate({ id: categoria.id, activo: true })}>
                                  <Eye className="w-4 h-4 mr-2" /> Activar
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setDeleteId(categoria.id)}
                                className="text-destructive focus:text-destructive"
                                disabled={categoria.slug === 'all'}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Eliminar Permanentemente
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  Nombre de la Categoría <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleNombreChange(e.target.value)}
                  required
                  placeholder="Ej: Tortas Especiales"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción breve de la categoría"
                  rows={2}
                />
              </div>

              {/* Orden */}
              <div className="space-y-2">
                <Label htmlFor="orden">Orden de Visualización</Label>
                <Input
                  id="orden"
                  type="number"
                  value={formData.orden}
                  onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">
                  El orden determina la posición en el filtro de categorías
                </p>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingCategoria ? 'Actualizar' : 'Crear'} Categoría
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              ¿Eliminar categoría?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="font-semibold">⚠️ Esta acción NO se puede deshacer.</p>
              <p>La categoría será eliminada completamente de la base de datos.</p>
              <p className="text-orange-600">
                <strong>Importante:</strong> Si tiene productos asignados, la eliminación fallará. 
                Debes reasignar esos productos a otra categoría primero.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminCategorias


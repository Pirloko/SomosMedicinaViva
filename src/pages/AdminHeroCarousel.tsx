import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllHeroImagenes, useToggleHeroImagenActivo, useDeleteHeroImagen, useCreateHeroImagen, useUpdateHeroImagen } from '@/hooks/useHeroImagenes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { ArrowLeft, Plus, Edit, Trash2, Loader2, Eye, EyeOff, MoreVertical, AlertTriangle, Image as ImageIcon } from 'lucide-react'
import { Database } from '@/types/database.types'

type HeroImagen = Database['public']['Tables']['hero_imagenes']['Row']

const AdminHeroCarousel = () => {
  const navigate = useNavigate()
  const { data: imagenes, isLoading } = useAllHeroImagenes()
  const toggleImagenActivo = useToggleHeroImagenActivo()
  const deleteImagen = useDeleteHeroImagen()
  const createImagen = useCreateHeroImagen()
  const updateImagen = useUpdateHeroImagen()
  
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingImagen, setEditingImagen] = useState<HeroImagen | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    imagen_url: '',
    orden: 0,
  })

  const imagenesActivas = imagenes?.filter(img => img.activo).length || 0

  const handleOpenDialog = (imagen?: HeroImagen) => {
    if (imagen) {
      setEditingImagen(imagen)
      setFormData({
        titulo: imagen.titulo || '',
        subtitulo: imagen.subtitulo || '',
        imagen_url: imagen.imagen_url,
        orden: imagen.orden,
      })
    } else {
      setEditingImagen(null)
      const nextOrden = (imagenes?.length || 0) + 1
      setFormData({
        titulo: '',
        subtitulo: '',
        imagen_url: '',
        orden: nextOrden,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingImagen) {
        await updateImagen.mutateAsync({
          id: editingImagen.id,
          updates: formData,
        })
      } else {
        await createImagen.mutateAsync(formData)
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteImagen.mutateAsync(deleteId)
      setDeleteId(null)
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
                  Imágenes de la portada
                </h1>
                <p className="text-xs text-muted-foreground">
                  {imagenes?.length || 0} imágenes · {imagenesActivas} activas
                </p>
              </div>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Imagen
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Card */}
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-3">
            <ImageIcon className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm text-foreground">
              <p className="font-semibold mb-1">Sobre las imágenes de portada</p>
              <p className="text-muted-foreground">
                Las imágenes activas se mostrarán en la portada de la web (la primera pantalla que ven los clientes). 
                Cambiarán solas cada 2 segundos. Recomendamos usar 3 a 5 imágenes.
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Imagenes Table */}
        {!isLoading && imagenes && (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Orden</TableHead>
                  <TableHead className="w-32">Imagen</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Subtítulo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {imagenes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No hay imágenes en la portada
                    </TableCell>
                  </TableRow>
                ) : (
                  imagenes.map((imagen) => (
                    <TableRow key={imagen.id}>
                      <TableCell>
                        <Badge variant="outline">{imagen.orden}</Badge>
                      </TableCell>
                      <TableCell>
                        <img
                          src={imagen.imagen_url}
                          alt={imagen.titulo || 'Imagen de portada'}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{imagen.titulo || '-'}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">{imagen.subtitulo || '-'}</p>
                      </TableCell>
                      <TableCell>
                        {imagen.activo ? (
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(imagen)}
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
                              {imagen.activo ? (
                                <DropdownMenuItem onClick={() => toggleImagenActivo.mutate({ id: imagen.id, activo: false })}>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  Desactivar
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => toggleImagenActivo.mutate({ id: imagen.id, activo: true })}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Activar
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => setDeleteId(imagen.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingImagen ? 'Editar imagen de portada' : 'Nueva imagen de portada'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Upload de Imagen */}
              <ImageUpload
                currentImageUrl={formData.imagen_url}
                onImageUploaded={(url) => setFormData({ ...formData, imagen_url: url })}
                folder="otros"
                label="Imagen de portada"
              />

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="titulo">Título (Opcional)</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ej: Torta de Chocolate"
                />
                <p className="text-xs text-muted-foreground">
                  El título puede mostrarse sobre la imagen (opcional)
                </p>
              </div>

              {/* Subtítulo */}
              <div className="space-y-2">
                <Label htmlFor="subtitulo">Subtítulo (Opcional)</Label>
                <Input
                  id="subtitulo"
                  value={formData.subtitulo}
                  onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                  placeholder="Ej: Deliciosa y saludable"
                />
              </div>

              {/* Orden */}
              <div className="space-y-2">
                <Label htmlFor="orden">Orden</Label>
                <Input
                  id="orden"
                  type="number"
                  value={formData.orden}
                  onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">
                  El orden determina en qué posición aparece en la portada
                </p>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!formData.imagen_url}>
                {editingImagen ? 'Actualizar' : 'Crear'} Imagen
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
              ¿Eliminar imagen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la imagen de la portada permanentemente.
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

export default AdminHeroCarousel


import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  useAboutContent, 
  useUpdateAboutContent,
  useAllAboutValues,
  useCreateAboutValue,
  useUpdateAboutValue,
  useToggleAboutValueActivo,
  useDeleteAboutValue
} from '@/hooks/useAbout'
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { ArrowLeft, Plus, Edit, Trash2, Loader2, Eye, EyeOff, MoreVertical, AlertTriangle, Heart, Leaf, Award, Star } from 'lucide-react'
import { Database } from '@/types/database.types'

type AboutValue = Database['public']['Tables']['about_values']['Row']

const ICON_OPTIONS = [
  { value: 'Heart', label: 'Corazón', icon: Heart },
  { value: 'Leaf', label: 'Hoja', icon: Leaf },
  { value: 'Award', label: 'Premio', icon: Award },
  { value: 'Star', label: 'Estrella', icon: Star },
]

const AdminAbout = () => {
  const navigate = useNavigate()
  const { data: aboutContent, isLoading: loadingContent } = useAboutContent()
  const updateContent = useUpdateAboutContent()
  const { data: values, isLoading: loadingValues } = useAllAboutValues()
  const createValue = useCreateAboutValue()
  const updateValue = useUpdateAboutValue()
  const toggleValueActivo = useToggleAboutValueActivo()
  const deleteValue = useDeleteAboutValue()

  const [isEditing, setIsEditing] = useState(false)
  const [contentForm, setContentForm] = useState({
    titulo: '',
    parrafo_1: '',
    parrafo_2: '',
    parrafo_3: '',
    imagen_url: '',
    estadistica_numero: '',
    estadistica_texto: '',
  })

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState<AboutValue | null>(null)
  const [isValueDialogOpen, setIsValueDialogOpen] = useState(false)
  const [valueForm, setValueForm] = useState({
    titulo: '',
    descripcion: '',
    icono: 'Heart',
    orden: 0,
  })

  // Cargar datos del contenido
  const handleEditContent = () => {
    if (aboutContent) {
      setContentForm({
        titulo: aboutContent.titulo,
        parrafo_1: aboutContent.parrafo_1,
        parrafo_2: aboutContent.parrafo_2 || '',
        parrafo_3: aboutContent.parrafo_3 || '',
        imagen_url: aboutContent.imagen_url || '',
        estadistica_numero: aboutContent.estadistica_numero,
        estadistica_texto: aboutContent.estadistica_texto,
      })
      setIsEditing(true)
    }
  }

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (aboutContent) {
      await updateContent.mutateAsync({
        id: aboutContent.id,
        updates: contentForm,
      })
      setIsEditing(false)
    }
  }

  // Manejo de valores
  const handleOpenValueDialog = (value?: AboutValue) => {
    if (value) {
      setEditingValue(value)
      setValueForm({
        titulo: value.titulo,
        descripcion: value.descripcion,
        icono: value.icono,
        orden: value.orden,
      })
    } else {
      setEditingValue(null)
      const nextOrden = (values?.length || 0) + 1
      setValueForm({
        titulo: '',
        descripcion: '',
        icono: 'Heart',
        orden: nextOrden,
      })
    }
    setIsValueDialogOpen(true)
  }

  const handleSubmitValue = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingValue) {
        await updateValue.mutateAsync({
          id: editingValue.id,
          updates: valueForm,
        })
      } else {
        await createValue.mutateAsync(valueForm)
      }
      setIsValueDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteValue.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const getIconComponent = (iconName: string) => {
    const iconOption = ICON_OPTIONS.find(opt => opt.value === iconName)
    return iconOption ? iconOption.icon : Heart
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
                  Gestión de "Nosotros"
                </h1>
                <p className="text-xs text-muted-foreground">
                  Contenido y valores de la sección
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Contenido Principal Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Contenido Principal</CardTitle>
              <CardDescription>
                Texto, imagen y estadísticas de la sección "Nosotros"
              </CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={handleEditContent} disabled={loadingContent}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loadingContent && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {!loadingContent && aboutContent && !isEditing && (
              <div className="space-y-6">
                {/* Vista previa */}
                <div>
                  <Label>Título</Label>
                  <p className="text-lg font-semibold">{aboutContent.titulo}</p>
                </div>
                
                {aboutContent.imagen_url && (
                  <div>
                    <Label>Imagen</Label>
                    <img 
                      src={aboutContent.imagen_url} 
                      alt="About" 
                      className="w-full max-w-md h-64 object-cover rounded-lg mt-2"
                    />
                  </div>
                )}

                <div>
                  <Label>Párrafo 1</Label>
                  <p className="text-muted-foreground">{aboutContent.parrafo_1}</p>
                </div>

                {aboutContent.parrafo_2 && (
                  <div>
                    <Label>Párrafo 2</Label>
                    <p className="text-muted-foreground">{aboutContent.parrafo_2}</p>
                  </div>
                )}

                {aboutContent.parrafo_3 && (
                  <div>
                    <Label>Párrafo 3</Label>
                    <p className="text-muted-foreground">{aboutContent.parrafo_3}</p>
                  </div>
                )}

                <div className="flex gap-6">
                  <div>
                    <Label>Estadística (Número)</Label>
                    <p className="text-2xl font-bold text-primary">{aboutContent.estadistica_numero}</p>
                  </div>
                  <div>
                    <Label>Estadística (Texto)</Label>
                    <p className="text-muted-foreground">{aboutContent.estadistica_texto}</p>
                  </div>
                </div>
              </div>
            )}

            {!loadingContent && isEditing && (
              <form onSubmit={handleSaveContent} className="space-y-6">
                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={contentForm.titulo}
                    onChange={(e) => setContentForm({ ...contentForm, titulo: e.target.value })}
                    required
                  />
                </div>

                {/* Imagen */}
                <ImageUpload
                  currentImageUrl={contentForm.imagen_url}
                  onImageUploaded={(url) => setContentForm({ ...contentForm, imagen_url: url })}
                  folder="otros"
                  label="Imagen de la Sección"
                />

                {/* Párrafos */}
                <div className="space-y-2">
                  <Label htmlFor="parrafo_1">Párrafo 1 *</Label>
                  <Textarea
                    id="parrafo_1"
                    value={contentForm.parrafo_1}
                    onChange={(e) => setContentForm({ ...contentForm, parrafo_1: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parrafo_2">Párrafo 2 (Opcional)</Label>
                  <Textarea
                    id="parrafo_2"
                    value={contentForm.parrafo_2}
                    onChange={(e) => setContentForm({ ...contentForm, parrafo_2: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parrafo_3">Párrafo 3 (Opcional)</Label>
                  <Textarea
                    id="parrafo_3"
                    value={contentForm.parrafo_3}
                    onChange={(e) => setContentForm({ ...contentForm, parrafo_3: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Estadística */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estadistica_numero">Estadística (Número)</Label>
                    <Input
                      id="estadistica_numero"
                      value={contentForm.estadistica_numero}
                      onChange={(e) => setContentForm({ ...contentForm, estadistica_numero: e.target.value })}
                      placeholder="Ej: +500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estadistica_texto">Estadística (Texto)</Label>
                    <Input
                      id="estadistica_texto"
                      value={contentForm.estadistica_texto}
                      onChange={(e) => setContentForm({ ...contentForm, estadistica_texto: e.target.value })}
                      placeholder="Ej: Clientes felices"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={updateContent.isPending}>
                    {updateContent.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar Cambios'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Valores/Etiquetas Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Valores / Etiquetas</CardTitle>
              <CardDescription>
                Con Amor, Natural, Calidad, etc.
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenValueDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Valor
            </Button>
          </CardHeader>
          <CardContent>
            {loadingValues && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {!loadingValues && values && (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Orden</TableHead>
                      <TableHead className="w-20">Ícono</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {values.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          No hay valores configurados
                        </TableCell>
                      </TableRow>
                    ) : (
                      values.map((value) => {
                        const IconComponent = getIconComponent(value.icono)
                        return (
                          <TableRow key={value.id}>
                            <TableCell>
                              <Badge variant="outline">{value.orden}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <IconComponent className="w-5 h-5 text-primary" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{value.titulo}</p>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-muted-foreground">{value.descripcion}</p>
                            </TableCell>
                            <TableCell>
                              {value.activo ? (
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
                                  onClick={() => handleOpenValueDialog(value)}
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
                                    {value.activo ? (
                                      <DropdownMenuItem onClick={() => toggleValueActivo.mutate({ id: value.id, activo: false })}>
                                        <EyeOff className="w-4 h-4 mr-2" />
                                        Desactivar
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => toggleValueActivo.mutate({ id: value.id, activo: true })}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Activar
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => setDeleteId(value.id)}
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
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Dialog para Crear/Editar Valor */}
      <Dialog open={isValueDialogOpen} onOpenChange={setIsValueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingValue ? 'Editar Valor' : 'Nuevo Valor'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitValue}>
            <div className="space-y-4">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="value-titulo">Título *</Label>
                <Input
                  id="value-titulo"
                  value={valueForm.titulo}
                  onChange={(e) => setValueForm({ ...valueForm, titulo: e.target.value })}
                  required
                  placeholder="Ej: Con Amor"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="value-descripcion">Descripción *</Label>
                <Input
                  id="value-descripcion"
                  value={valueForm.descripcion}
                  onChange={(e) => setValueForm({ ...valueForm, descripcion: e.target.value })}
                  required
                  placeholder="Ej: Hecho a mano"
                />
              </div>

              {/* Ícono */}
              <div className="space-y-2">
                <Label htmlFor="value-icono">Ícono</Label>
                <Select
                  value={valueForm.icono}
                  onValueChange={(value) => setValueForm({ ...valueForm, icono: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map(option => {
                      const IconComp = option.icon
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <IconComp className="w-4 h-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Orden */}
              <div className="space-y-2">
                <Label htmlFor="value-orden">Orden</Label>
                <Input
                  id="value-orden"
                  type="number"
                  value={valueForm.orden}
                  onChange={(e) => setValueForm({ ...valueForm, orden: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsValueDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingValue ? 'Actualizar' : 'Crear'} Valor
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
              ¿Eliminar valor?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el valor permanentemente.
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

export default AdminAbout


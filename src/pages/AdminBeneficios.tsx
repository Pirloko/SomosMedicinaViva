import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllBeneficios, useDeleteBeneficio, useDeleteBeneficioPermanentemente, useCreateBeneficio, useUpdateBeneficio } from '@/hooks/useBeneficios'
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
import { ArrowLeft, Plus, Edit, Trash2, Loader2, Eye, EyeOff, MoreVertical, AlertTriangle } from 'lucide-react'
import { Database } from '@/types/database.types'

type Beneficio = Database['public']['Tables']['beneficios']['Row']

const AdminBeneficios = () => {
  const navigate = useNavigate()
  const { data: beneficios, isLoading } = useAllBeneficios()
  const deleteBeneficio = useDeleteBeneficio()
  const deleteBeneficioPermanentemente = useDeleteBeneficioPermanentemente()
  const createBeneficio = useCreateBeneficio()
  const updateBeneficio = useUpdateBeneficio()
  
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deletePermanentlyId, setDeletePermanentlyId] = useState<string | null>(null)
  const [editingBeneficio, setEditingBeneficio] = useState<Beneficio | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    icono: 'Heart',
    color: 'bg-red-50 text-red-500',
    orden: 0,
  })

  const iconos = [
    'Heart', 'Ban', 'Sparkles', 'Users', 'Baby', 'Activity',
    'Leaf', 'Shield', 'Star', 'CheckCircle'
  ]

  const colores = [
    { value: 'bg-red-50 text-red-500', label: 'Rojo' },
    { value: 'bg-blue-50 text-blue-500', label: 'Azul' },
    { value: 'bg-green-50 text-green-500', label: 'Verde' },
    { value: 'bg-purple-50 text-purple-500', label: 'Morado' },
    { value: 'bg-orange-50 text-orange-500', label: 'Naranja' },
    { value: 'bg-amber-50 text-amber-600', label: 'Ámbar' },
    { value: 'bg-teal-50 text-teal-500', label: 'Turquesa' },
    { value: 'bg-pink-50 text-pink-500', label: 'Rosa' },
  ]

  const handleOpenDialog = (beneficio?: Beneficio) => {
    if (beneficio) {
      setEditingBeneficio(beneficio)
      setFormData({
        titulo: beneficio.titulo,
        descripcion: beneficio.descripcion,
        icono: beneficio.icono,
        color: beneficio.color,
        orden: beneficio.orden,
      })
    } else {
      setEditingBeneficio(null)
      const nextOrden = (beneficios?.length || 0) + 1
      setFormData({
        titulo: '',
        descripcion: '',
        icono: 'Heart',
        color: 'bg-red-50 text-red-500',
        orden: nextOrden,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingBeneficio) {
        await updateBeneficio.mutateAsync({
          id: editingBeneficio.id,
          updates: formData,
        })
      } else {
        await createBeneficio.mutateAsync(formData)
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteBeneficio.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleDeletePermanently = async () => {
    if (deletePermanentlyId) {
      await deleteBeneficioPermanentemente.mutateAsync(deletePermanentlyId)
      setDeletePermanentlyId(null)
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
                  Gestión de Beneficios (Apto Para)
                </h1>
                <p className="text-xs text-muted-foreground">
                  {beneficios?.length || 0} beneficios configurados
                </p>
              </div>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Beneficio
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Beneficios Table */}
        {!isLoading && beneficios && (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Icono</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {beneficios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No hay beneficios configurados
                    </TableCell>
                  </TableRow>
                ) : (
                  beneficios.map((beneficio) => (
                    <TableRow key={beneficio.id}>
                      <TableCell>
                        <Badge variant="outline">{beneficio.orden}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{beneficio.titulo}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                          {beneficio.descripcion}
                        </p>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {beneficio.icono}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex px-3 py-1 rounded ${beneficio.color} text-xs font-medium`}>
                          Color
                        </div>
                      </TableCell>
                      <TableCell>
                        {beneficio.activo ? (
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
                            onClick={() => handleOpenDialog(beneficio)}
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
                              <DropdownMenuItem onClick={() => setDeleteId(beneficio.id)}>
                                <EyeOff className="w-4 h-4 mr-2" />
                                Desactivar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => setDeletePermanentlyId(beneficio.id)}
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBeneficio ? 'Editar Beneficio' : 'Nuevo Beneficio'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                  placeholder="Ej: Diabéticos"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                  placeholder="Descripción del beneficio"
                  rows={3}
                />
              </div>

              {/* Icono y Color */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icono">Icono (Lucide)</Label>
                  <select
                    id="icono"
                    value={formData.icono}
                    onChange={(e) => setFormData({ ...formData, icono: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {iconos.map(icono => (
                      <option key={icono} value={icono}>{icono}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <select
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {colores.map(color => (
                      <option key={color.value} value={color.value}>{color.label}</option>
                    ))}
                  </select>
                </div>
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
                  El orden determina la posición en la sección "Apto Para"
                </p>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingBeneficio ? 'Actualizar' : 'Crear'} Beneficio
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Deactivate Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar beneficio?</AlertDialogTitle>
            <AlertDialogDescription>
              El beneficio no se mostrará en la sección pública pero permanecerá en la base de datos.
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
              <p>El beneficio será eliminado completamente de la base de datos.</p>
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

export default AdminBeneficios


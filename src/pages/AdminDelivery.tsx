import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllZonasDelivery, useDeleteZonaDelivery, useDeleteZonaDeliveryPermanentemente, useCreateZonaDelivery, useUpdateZonaDelivery } from '@/hooks/useZonasDelivery'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { ArrowLeft, Plus, Edit, Trash2, Search, Loader2, Truck, Eye, EyeOff, MoreVertical, AlertTriangle } from 'lucide-react'
import { Database } from '@/types/database.types'

type ZonaDelivery = Database['public']['Tables']['zonas_delivery']['Row']

const AdminDelivery = () => {
  const navigate = useNavigate()
  const { data: zonas, isLoading } = useAllZonasDelivery()
  const deleteZona = useDeleteZonaDelivery()
  const deleteZonaPermanentemente = useDeleteZonaDeliveryPermanentemente()
  const createZona = useCreateZonaDelivery()
  const updateZona = useUpdateZonaDelivery()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deletePermanentlyId, setDeletePermanentlyId] = useState<string | null>(null)
  const [editingZona, setEditingZona] = useState<ZonaDelivery | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre: '',
    tiempo_entrega: '24-48 hrs',
    costo_envio: 3990,
    orden: 0,
  })

  const filteredZonas = zonas?.filter(zona =>
    zona.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenDialog = (zona?: ZonaDelivery) => {
    if (zona) {
      setEditingZona(zona)
      setFormData({
        nombre: zona.nombre,
        tiempo_entrega: zona.tiempo_entrega,
        costo_envio: zona.costo_envio || 0,
        orden: zona.orden,
      })
    } else {
      setEditingZona(null)
      const nextOrden = (zonas?.length || 0) + 1
      setFormData({
        nombre: '',
        tiempo_entrega: '24-48 hrs',
        costo_envio: 3990,
        orden: nextOrden,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingZona) {
        await updateZona.mutateAsync({
          id: editingZona.id,
          updates: formData,
        })
      } else {
        await createZona.mutateAsync(formData)
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteZona.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleDeletePermanently = async () => {
    if (deletePermanentlyId) {
      await deleteZonaPermanentemente.mutateAsync(deletePermanentlyId)
      setDeletePermanentlyId(null)
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
                Zonas Delivery
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {zonas?.length || 0} zonas de cobertura
              </p>
            </div>
          </div>
          <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto min-h-[44px] shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Zona
          </Button>
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
              placeholder="Buscar zonas..."
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
        {!isLoading && filteredZonas && (
          <div className="block md:hidden space-y-4">
            {filteredZonas.length === 0 ? (
              <div className="bg-card rounded-xl border shadow-sm py-16 text-center text-muted-foreground">
                No se encontraron zonas
              </div>
            ) : (
              filteredZonas.map((zona) => (
                <div key={zona.id} className="bg-card rounded-xl border shadow-sm overflow-hidden p-4 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Badge variant="outline" className="mb-2">Orden {zona.orden}</Badge>
                      <p className="font-semibold text-foreground text-base leading-snug break-words">{zona.nombre}</p>
                    </div>
                    {zona.activo ? (
                      <div className="flex items-center gap-1 text-green-600 shrink-0">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Activo</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                        <EyeOff className="w-4 h-4" />
                        <span className="text-sm">Inactivo</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 border-t pt-3">
                    <Truck className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">{zona.tiempo_entrega}</span>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-xs text-muted-foreground mb-0.5">Costo de envío</p>
                    <p className="font-semibold text-primary">${(zona.costo_envio || 0).toLocaleString('es-CL')}</p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(zona)} className="flex-1 min-h-[44px]">
                      <Edit className="w-4 h-4 mr-2" /> Editar
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="min-h-[44px] min-w-[44px] px-3">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDeleteId(zona.id)}>
                          <EyeOff className="w-4 h-4 mr-2" /> Desactivar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeletePermanentlyId(zona.id)}
                          className="text-destructive focus:text-destructive"
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
        {!isLoading && filteredZonas && (
          <div className="hidden md:block bg-card rounded-xl border shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Comuna/Zona</TableHead>
                  <TableHead>Tiempo de Entrega</TableHead>
                  <TableHead>Costo de Envío</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredZonas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No se encontraron zonas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredZonas.map((zona) => (
                    <TableRow key={zona.id}>
                      <TableCell>
                        <Badge variant="outline">{zona.orden}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{zona.nombre}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-primary" />
                          <span className="text-sm">{zona.tiempo_entrega}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${(zona.costo_envio || 0).toLocaleString('es-CL')}
                      </TableCell>
                      <TableCell>
                        {zona.activo ? (
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
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(zona)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setDeleteId(zona.id)}>
                                <EyeOff className="w-4 h-4 mr-2" /> Desactivar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setDeletePermanentlyId(zona.id)}
                                className="text-destructive focus:text-destructive"
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
              {editingZona ? 'Editar Zona' : 'Nueva Zona de Delivery'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Comuna/Zona *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  placeholder="Ej: Rancagua, Machalí, etc."
                />
              </div>

              {/* Tiempo y Costo */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tiempo">Tiempo de Entrega *</Label>
                  <Input
                    id="tiempo"
                    value={formData.tiempo_entrega}
                    onChange={(e) => setFormData({ ...formData, tiempo_entrega: e.target.value })}
                    required
                    placeholder="24-48 hrs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costo">Costo de Envío (CLP) *</Label>
                  <Input
                    id="costo"
                    type="number"
                    value={formData.costo_envio}
                    onChange={(e) => setFormData({ ...formData, costo_envio: parseInt(e.target.value) || 0 })}
                    required
                  />
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
                  Determina el orden de aparición en la lista
                </p>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingZona ? 'Actualizar' : 'Crear'} Zona
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
            <AlertDialogTitle>¿Desactivar zona?</AlertDialogTitle>
            <AlertDialogDescription>
              La zona no se mostrará en la sección pública pero permanecerá en la base de datos.
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
              <p>La zona será eliminada completamente de la base de datos.</p>
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

export default AdminDelivery


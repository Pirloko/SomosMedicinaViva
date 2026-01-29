import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllPuntosVenta, useDeletePuntoVenta, useDeletePuntoVentaPermanentemente, useCreatePuntoVenta, useUpdatePuntoVenta } from '@/hooks/usePuntosVenta'
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
import { ArrowLeft, Plus, Edit, Trash2, Search, Loader2, MapPin, Eye, EyeOff, MoreVertical, AlertTriangle } from 'lucide-react'
import { Database } from '@/types/database.types'

type PuntoVenta = Database['public']['Tables']['puntos_venta']['Row']

const AdminPuntosVenta = () => {
  const navigate = useNavigate()
  const { data: puntosVenta, isLoading } = useAllPuntosVenta()
  const deletePuntoVenta = useDeletePuntoVenta()
  const deletePuntoVentaPermanentemente = useDeletePuntoVentaPermanentemente()
  const createPuntoVenta = useCreatePuntoVenta()
  const updatePuntoVenta = useUpdatePuntoVenta()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deletePermanentlyId, setDeletePermanentlyId] = useState<string | null>(null)
  const [editingPunto, setEditingPunto] = useState<PuntoVenta | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    maps_url: '',
    horario_semana: '',
    horario_sabado: '',
    horario_domingo: '',
    imagen_url: '',
    orden: 0,
  })

  const filteredPuntos = puntosVenta?.filter(punto =>
    punto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    punto.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenDialog = (punto?: PuntoVenta) => {
    if (punto) {
      setEditingPunto(punto)
      setFormData({
        nombre: punto.nombre,
        direccion: punto.direccion,
        maps_url: punto.maps_url || '',
        horario_semana: punto.horario_semana,
        horario_sabado: punto.horario_sabado,
        horario_domingo: punto.horario_domingo,
        imagen_url: punto.imagen_url || '',
        orden: punto.orden,
      })
    } else {
      setEditingPunto(null)
      const nextOrden = (puntosVenta?.length || 0) + 1
      setFormData({
        nombre: '',
        direccion: '',
        maps_url: '',
        horario_semana: 'Lun - Vie: 09:00 - 20:00',
        horario_sabado: 'Sáb: 10:00 - 18:00',
        horario_domingo: 'Dom: 11:00 - 15:00',
        imagen_url: '',
        orden: nextOrden,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingPunto) {
        await updatePuntoVenta.mutateAsync({
          id: editingPunto.id,
          updates: formData,
        })
      } else {
        await createPuntoVenta.mutateAsync(formData)
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deletePuntoVenta.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleDeletePermanently = async () => {
    if (deletePermanentlyId) {
      await deletePuntoVentaPermanentemente.mutateAsync(deletePermanentlyId)
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
                Gestión de Puntos de Venta
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {puntosVenta?.length || 0} puntos de venta configurados
              </p>
            </div>
          </div>
          <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto min-h-[44px] shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Punto de Venta
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
              placeholder="Buscar puntos de venta..."
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
        {!isLoading && filteredPuntos && (
          <div className="block md:hidden space-y-4">
            {filteredPuntos.length === 0 ? (
              <div className="bg-card rounded-xl border shadow-sm py-16 text-center text-muted-foreground">
                No se encontraron puntos de venta
              </div>
            ) : (
              filteredPuntos.map((punto) => (
                <div key={punto.id} className="bg-card rounded-xl border shadow-sm overflow-hidden p-4 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <img
                      src={punto.imagen_url || '/placeholder.svg'}
                      alt={punto.nombre}
                      className="w-20 h-20 object-cover rounded-xl shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground text-base leading-snug line-clamp-2 break-words">{punto.nombre}</p>
                      {punto.activo ? (
                        <div className="flex items-center gap-1 text-green-600 mt-2">
                          <Eye className="w-4 h-4 shrink-0" />
                          <span className="text-sm">Activo</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-muted-foreground mt-2">
                          <EyeOff className="w-4 h-4 shrink-0" />
                          <span className="text-sm">Inactivo</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground break-words">{punto.direccion}</p>
                    </div>
                  </div>
                  <div className="border-t pt-3 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Horarios</p>
                    <p className="text-sm text-foreground">{punto.horario_semana}</p>
                    <p className="text-sm text-foreground">{punto.horario_sabado}</p>
                    {punto.horario_domingo && (
                      <p className="text-sm text-foreground">{punto.horario_domingo}</p>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(punto)} className="flex-1 min-h-[44px]">
                      <Edit className="w-4 h-4 mr-2" /> Editar
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="min-h-[44px] min-w-[44px] px-3">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDeleteId(punto.id)}>
                          <EyeOff className="w-4 h-4 mr-2" /> Desactivar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeletePermanentlyId(punto.id)}
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
        {!isLoading && filteredPuntos && (
          <div className="hidden md:block bg-card rounded-xl border shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Horarios</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPuntos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No se encontraron puntos de venta
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPuntos.map((punto) => (
                    <TableRow key={punto.id}>
                      <TableCell>
                        <img
                          src={punto.imagen_url || '/placeholder.svg'}
                          alt={punto.nombre}
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{punto.nombre}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2 max-w-xs">
                          <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-muted-foreground">{punto.direccion}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <p className="text-muted-foreground">{punto.horario_semana}</p>
                          <p className="text-muted-foreground">{punto.horario_sabado}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {punto.activo ? (
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
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(punto)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setDeleteId(punto.id)}>
                                <EyeOff className="w-4 h-4 mr-2" /> Desactivar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setDeletePermanentlyId(punto.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPunto ? 'Editar Punto de Venta' : 'Nuevo Punto de Venta'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Negocio *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  placeholder="Ej: Rosetto - Cafetería & Gelateria"
                />
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  required
                  placeholder="Av. Alberto Einstein 705, Rancagua"
                />
              </div>

              {/* Google Maps URL */}
              <div className="space-y-2">
                <Label htmlFor="maps_url">Google Maps URL</Label>
                <Input
                  id="maps_url"
                  type="url"
                  value={formData.maps_url}
                  onChange={(e) => setFormData({ ...formData, maps_url: e.target.value })}
                  placeholder="https://maps.app.goo.gl/..."
                />
              </div>

              {/* Horarios */}
              <div className="space-y-2">
                <Label htmlFor="horario_semana">Horario Lun-Vie *</Label>
                <Input
                  id="horario_semana"
                  value={formData.horario_semana}
                  onChange={(e) => setFormData({ ...formData, horario_semana: e.target.value })}
                  required
                  placeholder="Lun - Vie: 09:00 - 20:00"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horario_sabado">Horario Sábado *</Label>
                  <Input
                    id="horario_sabado"
                    value={formData.horario_sabado}
                    onChange={(e) => setFormData({ ...formData, horario_sabado: e.target.value })}
                    required
                    placeholder="Sáb: 10:00 - 18:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario_domingo">Horario Domingo *</Label>
                  <Input
                    id="horario_domingo"
                    value={formData.horario_domingo}
                    onChange={(e) => setFormData({ ...formData, horario_domingo: e.target.value })}
                    required
                    placeholder="Dom: 11:00 - 15:00 o Cerrado"
                  />
                </div>
              </div>

              {/* Imagen del Negocio */}
              <ImageUpload
                currentImageUrl={formData.imagen_url}
                onImageUploaded={(url) => setFormData({ ...formData, imagen_url: url })}
                folder="otros"
                label="Imagen del Punto de Venta"
              />

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
                  El orden determina la posición en la lista de puntos de venta
                </p>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingPunto ? 'Actualizar' : 'Crear'} Punto de Venta
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
            <AlertDialogTitle>¿Desactivar punto de venta?</AlertDialogTitle>
            <AlertDialogDescription>
              El punto de venta no se mostrará en la sección pública pero permanecerá en la base de datos.
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
              <p>El punto de venta será eliminado completamente de la base de datos.</p>
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

export default AdminPuntosVenta


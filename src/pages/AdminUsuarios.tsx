import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsuarios, useCrearUsuarioVendedor, useActualizarUsuario, useEliminarUsuario } from '@/hooks/useUsuarios'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowLeft, Plus, Loader2, MoreVertical, UserPlus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

const AdminUsuarios = () => {
  const navigate = useNavigate()
  const { data: usuarios, isLoading } = useUsuarios()
  const crearUsuario = useCrearUsuarioVendedor()
  const actualizarUsuario = useActualizarUsuario()
  const eliminarUsuario = useEliminarUsuario()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<{ id: string; user_id: string; nombre: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre_usuario: '',
  })

  const handleOpenDialog = () => {
    setFormData({ email: '', password: '', nombre_usuario: '' })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password || !formData.nombre_usuario) {
      return
    }

    try {
      await crearUsuario.mutateAsync({
        email: formData.email,
        password: formData.password,
        nombre_usuario: formData.nombre_usuario,
      })
      setIsDialogOpen(false)
      setFormData({ email: '', password: '', nombre_usuario: '' })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleToggleActivo = async (usuario: any) => {
    try {
      await actualizarUsuario.mutateAsync({
        id: usuario.id,
        activo: !usuario.activo,
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await eliminarUsuario.mutateAsync({
          id: deleteId.id,
          user_id: deleteId.user_id,
        })
        setDeleteId(null)
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  const vendedores = usuarios?.filter(u => u.rol === 'vendedor') || []
  const admins = usuarios?.filter(u => u.rol === 'admin') || []

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
                Usuarios
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Administrar usuarios vendedores
              </p>
            </div>
          </div>
          <Button onClick={handleOpenDialog} className="w-full sm:w-auto min-h-[44px] shrink-0">
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Vendedor
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Vendedores */}
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">Vendedores ({vendedores.length})</h2>
                  <p className="text-sm text-muted-foreground">
                    Usuarios que pueden registrar ventas
                  </p>
                </div>
              </div>

              {/* Mobile: Vendedores Cards */}
              <div className="block md:hidden p-4 space-y-4">
                {vendedores.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground text-sm">
                    No hay vendedores registrados
                  </div>
                ) : (
                  vendedores.map((usuario) => (
                    <div key={usuario.id} className="rounded-xl border bg-background p-4 flex flex-col gap-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground text-base break-words">{usuario.nombre_usuario}</p>
                          <p className="text-sm text-muted-foreground break-all mt-0.5">{usuario.email || 'N/A'}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                          <Badge variant="secondary">{usuario.rol}</Badge>
                          {usuario.activo ? (
                            <Badge className="bg-green-100 text-green-700">Activo</Badge>
                          ) : (
                            <Badge variant="destructive">Inactivo</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground border-t pt-3">
                        Creado: {new Date(usuario.created_at).toLocaleDateString('es-CL')}
                      </p>
                      <div className="flex gap-2 pt-2 border-t">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1 min-h-[44px]">
                              <MoreVertical className="w-4 h-4 mr-2" /> Acciones
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => handleToggleActivo(usuario)}>
                              {usuario.activo ? (
                                <><EyeOff className="w-4 h-4 mr-2" /> Desactivar</>
                              ) : (
                                <><Eye className="w-4 h-4 mr-2" /> Activar</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteId({
                                id: usuario.id,
                                user_id: usuario.user_id,
                                nombre: usuario.nombre_usuario,
                              })}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop: Vendedores Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre de Usuario</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha de Creación</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendedores.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          No hay vendedores registrados
                        </TableCell>
                      </TableRow>
                    ) : (
                      vendedores.map((usuario) => (
                        <TableRow key={usuario.id}>
                          <TableCell className="font-medium">{usuario.nombre_usuario}</TableCell>
                          <TableCell>{usuario.email || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{usuario.rol}</Badge>
                          </TableCell>
                          <TableCell>
                            {usuario.activo ? (
                              <Badge className="bg-green-100 text-green-700">Activo</Badge>
                            ) : (
                              <Badge variant="destructive">Inactivo</Badge>
                            )}
                          </TableCell>
                          <TableCell>{new Date(usuario.created_at).toLocaleDateString('es-CL')}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleToggleActivo(usuario)}>
                                  {usuario.activo ? (
                                    <><EyeOff className="w-4 h-4 mr-2" /> Desactivar</>
                                  ) : (
                                    <><Eye className="w-4 h-4 mr-2" /> Activar</>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setDeleteId({
                                    id: usuario.id,
                                    user_id: usuario.user_id,
                                    nombre: usuario.nombre_usuario,
                                  })}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Admins (solo lectura) */}
            {admins.length > 0 && (
              <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Administradores ({admins.length})</h2>
                  <p className="text-sm text-muted-foreground">
                    Usuarios con acceso completo al sistema
                  </p>
                </div>

                {/* Mobile: Admins Cards */}
                <div className="block md:hidden p-4 space-y-4">
                  {admins.map((usuario) => (
                    <div key={usuario.id} className="rounded-xl border bg-background p-4 flex flex-col gap-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground text-base break-words">{usuario.nombre_usuario}</p>
                          <p className="text-sm text-muted-foreground break-all mt-0.5">{usuario.email || 'N/A'}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                          <Badge className="bg-blue-100 text-blue-700">{usuario.rol}</Badge>
                          {usuario.activo ? (
                            <Badge className="bg-green-100 text-green-700">Activo</Badge>
                          ) : (
                            <Badge variant="destructive">Inactivo</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: Admins Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre de Usuario</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins.map((usuario) => (
                        <TableRow key={usuario.id}>
                          <TableCell className="font-medium">{usuario.nombre_usuario}</TableCell>
                          <TableCell>{usuario.email || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-700">{usuario.rol}</Badge>
                          </TableCell>
                          <TableCell>
                            {usuario.activo ? (
                              <Badge className="bg-green-100 text-green-700">Activo</Badge>
                            ) : (
                              <Badge variant="destructive">Inactivo</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Dialog para Crear Vendedor */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Vendedor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_usuario">Nombre de Usuario *</Label>
                <Input
                  id="nombre_usuario"
                  value={formData.nombre_usuario}
                  onChange={(e) => setFormData({ ...formData, nombre_usuario: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="vendedor@medicinaviva.cl"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  El vendedor usará este email para iniciar sesión
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={crearUsuario.isPending}>
                {crearUsuario.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Crear Vendedor
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmación de Eliminación */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar vendedor?</AlertDialogTitle>
            <AlertDialogDescription>
              El vendedor <strong>{deleteId?.nombre}</strong> no podrá acceder al sistema.
              Esta acción se puede revertir activando el usuario nuevamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminUsuarios

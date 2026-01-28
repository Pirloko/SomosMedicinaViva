import { type ReactNode, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useVentas, useUpdateVenta } from '@/hooks/useVentas'
import { useAuth } from '@/contexts/AuthContext'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Loader2, 
  MoreVertical, 
  DollarSign,
  TrendingUp,
  ShoppingBag,
  CheckCircle,
  Package,
  Truck,
  CircleDollarSign,
  XCircle
} from 'lucide-react'

// Opciones por estado: desde "preparando" se puede ir a Enviado O Entregado (retiro en tienda)
type OpcionEstado = { estado: string; label: string; icon: ReactNode }
const OPCIONES_POR_ESTADO: Record<string, OpcionEstado[]> = {
  pendiente: [{ estado: 'confirmado', label: 'Confirmar', icon: <CheckCircle className="w-4 h-4" /> }, { estado: 'preparando', label: 'Preparando', icon: <Package className="w-4 h-4" /> }],
  confirmado: [{ estado: 'preparando', label: 'Preparando', icon: <Package className="w-4 h-4" /> }],
  preparando: [
    { estado: 'enviado', label: 'Enviado', icon: <Truck className="w-4 h-4" /> },
    { estado: 'entregado', label: 'Entregado', icon: <CircleDollarSign className="w-4 h-4" /> },
  ],
  enviado: [{ estado: 'entregado', label: 'Entregado', icon: <CircleDollarSign className="w-4 h-4" /> }],
  entregado: [],
  cancelado: [],
}

const AdminVentas = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { role } = useAuth()
  const { data: ventas, isLoading } = useVentas()
  const updateVenta = useUpdateVenta()

  const isVendedor = location.pathname.startsWith('/vendedor') || role === 'vendedor'
  const basePath = isVendedor ? '/vendedor' : '/admin'
  
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('all')

  // Filtrar ventas
  const filteredVentas = ventas?.filter(venta => {
    // Buscar en productos de la venta
    const productosVenta = (venta as any).venta_productos || []
    const nombresProductos = productosVenta
      .map((vp: any) => vp.productos?.nombre?.toLowerCase() || '')
      .join(' ')
    
    const matchSearch = 
      venta.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.cliente_telefono?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nombresProductos.includes(searchTerm.toLowerCase())
    
    const matchEstado = estadoFilter === 'all' || venta.estado === estadoFilter

    return matchSearch && matchEstado
  })

  // Estadísticas
  const totalVentas = ventas?.length || 0
  const totalIngresos = ventas?.reduce((sum, v) => sum + Number(v.total), 0) || 0
  const ventasPendientes = ventas?.filter(v => v.estado === 'pendiente').length || 0

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, { variant: any; color: string }> = {
      pendiente: { variant: 'secondary', color: 'bg-yellow-100 text-yellow-700' },
      confirmado: { variant: 'secondary', color: 'bg-blue-100 text-blue-700' },
      preparando: { variant: 'secondary', color: 'bg-purple-100 text-purple-700' },
      enviado: { variant: 'secondary', color: 'bg-indigo-100 text-indigo-700' },
      entregado: { variant: 'secondary', color: 'bg-green-100 text-green-700' },
      cancelado: { variant: 'destructive', color: 'bg-red-100 text-red-700' },
    }
    
    const badge = badges[estado] || badges.pendiente
    return <Badge className={badge.color}>{estado}</Badge>
  }

  const handleCambiarEstado = async (ventaId: string, nuevoEstado: string) => {
    await updateVenta.mutateAsync({
      id: ventaId,
      updates: { estado: nuevoEstado },
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(basePath)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="font-display text-xl font-semibold text-foreground">
                  {isVendedor ? 'Mis Ventas' : 'Gestión de Ventas'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {totalVentas} ventas · {ventasPendientes} pendientes
                </p>
              </div>
            </div>
            <Button onClick={() => navigate(`${basePath}/ventas/nueva`)}>
              <Plus className="w-4 h-4 mr-2" />
              Registrar Venta
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Ventas</p>
                <p className="text-2xl font-bold text-foreground">{totalVentas}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ingresos Totales</p>
                <p className="text-2xl font-bold text-foreground">
                  ${totalIngresos.toLocaleString('es-CL')}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pendientes</p>
                <p className="text-2xl font-bold text-foreground">{ventasPendientes}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por cliente, teléfono o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={estadoFilter} onValueChange={setEstadoFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="preparando">Preparando</SelectItem>
              <SelectItem value="enviado">Enviado</SelectItem>
              <SelectItem value="entregado">Entregado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Ventas Table */}
        {!isLoading && filteredVentas && (
          <div className="bg-card rounded-xl border shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Zona</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVentas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      No se encontraron ventas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVentas.map((venta) => (
                    <TableRow key={venta.id}>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">
                            {new Date(venta.fecha_venta).toLocaleDateString('es-CL', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(venta.fecha_venta).toLocaleTimeString('es-CL', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{venta.cliente_nombre || 'Sin nombre'}</p>
                          {venta.cliente_telefono && (
                            <p className="text-xs text-muted-foreground">{venta.cliente_telefono}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {(venta as any).venta_productos && (venta as any).venta_productos.length > 0 ? (
                            (venta as any).venta_productos.map((vp: any, idx: number) => (
                              <div key={vp.id || idx} className="flex items-center gap-2">
                                {vp.productos?.imagen_url && (
                                  <img
                                    src={vp.productos.imagen_url}
                                    alt={vp.productos?.nombre}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {vp.productos?.nombre || 'Producto eliminado'}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {vp.cantidad}x ${vp.precio_unitario?.toLocaleString('es-CL')} = ${vp.subtotal?.toLocaleString('es-CL')}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            // Compatibilidad: Si no hay venta_productos, mostrar datos antiguos
                            <div className="flex items-center gap-2">
                              {(venta.productos as any)?.imagen_url && (
                                <img
                                  src={(venta.productos as any).imagen_url}
                                  alt={(venta.productos as any)?.nombre}
                                  className="w-10 h-10 object-cover rounded-lg"
                                />
                              )}
                              <p className="text-sm font-medium">
                                {(venta.productos as any)?.nombre || 'Producto eliminado'}
                              </p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {(venta as any).venta_productos && (venta as any).venta_productos.length > 0 ? (
                            <>
                              <Badge variant="outline">
                                {(venta as any).venta_productos.reduce((sum: number, vp: any) => sum + vp.cantidad, 0)} unidades
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                {(venta as any).venta_productos.length} producto{(venta as any).venta_productos.length > 1 ? 's' : ''}
                              </p>
                            </>
                          ) : (
                            <Badge variant="outline">{venta.cantidad}x</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${venta.total.toLocaleString('es-CL')}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">{venta.zona_delivery || '-'}</p>
                      </TableCell>
                      <TableCell>
                        {getEstadoBadge(venta.estado)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" aria-label="Acciones">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-[180px]">
                            {/* Desde preparando: Enviado y Entregado (retiro en tienda). Desde enviado: Entregado */}
                            {(OPCIONES_POR_ESTADO[venta.estado] ?? []).map((opcion) => (
                              <DropdownMenuItem
                                key={opcion.estado}
                                onClick={() => handleCambiarEstado(venta.id, opcion.estado)}
                                className="font-medium"
                              >
                                {opcion.icon}
                                <span className="ml-2">{opcion.label}</span>
                              </DropdownMenuItem>
                            ))}
                            {/* Cancelar pedido: solo si aún no está entregado ni cancelado */}
                            {venta.estado !== 'cancelado' && venta.estado !== 'entregado' && (
                              <DropdownMenuItem
                                onClick={() => handleCambiarEstado(venta.id, 'cancelado')}
                                className="text-amber-600 focus:text-amber-600"
                              >
                                <XCircle className="w-4 h-4" />
                                <span className="ml-2">Cancelar pedido</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminVentas


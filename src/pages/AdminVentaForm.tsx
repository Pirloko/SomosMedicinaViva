import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCreateVenta } from '@/hooks/useVentas'
import { useAuth } from '@/contexts/AuthContext'
import { useAllProducts } from '@/hooks/useProducts'
import { useZonasDelivery } from '@/hooks/useZonasDelivery'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Save, Calculator, Plus, Trash2 } from 'lucide-react'

type ProductoVenta = {
  id: string
  producto_id: string
  cantidad: number
  precio_unitario: number
}

type VentaFormData = {
  cliente_nombre: string
  cliente_email: string
  cliente_telefono: string
  zona_delivery: string
  estado: string
  metodo_pago: string
  notas: string
}

const AdminVentaForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { role } = useAuth()
  const createVenta = useCreateVenta()
  const { data: productos } = useAllProducts()
  const { data: zonas } = useZonasDelivery()

  const isVendedor = location.pathname.startsWith('/vendedor') || role === 'vendedor'

  const [productosVenta, setProductosVenta] = useState<ProductoVenta[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VentaFormData>({
    defaultValues: {
      estado: 'preparando',
      metodo_pago: 'efectivo',
    },
  })

  // Toda venta nueva queda en "preparando"
  useEffect(() => {
    setValue('estado', 'preparando')
  }, [setValue])

  // Calcular total automáticamente sumando todos los productos
  const total = productosVenta.reduce((sum, p) => {
    return sum + (p.cantidad * p.precio_unitario)
  }, 0)

  // Agregar nuevo producto a la lista
  const agregarProducto = () => {
    const nuevoProducto: ProductoVenta = {
      id: Date.now().toString(),
      producto_id: '',
      cantidad: 1,
      precio_unitario: 0,
    }
    setProductosVenta([...productosVenta, nuevoProducto])
  }

  // Eliminar producto de la lista
  const eliminarProducto = (id: string) => {
    setProductosVenta(productosVenta.filter(p => p.id !== id))
  }

  // Actualizar producto en la lista
  const actualizarProducto = (id: string, campo: keyof ProductoVenta, valor: string | number) => {
    setProductosVenta(productosVenta.map(p => {
      if (p.id === id) {
        const actualizado = { ...p, [campo]: valor }
        
        // Si cambió el producto, actualizar el precio automáticamente
        if (campo === 'producto_id' && productos) {
          const producto = productos.find(prod => prod.id === valor)
          if (producto) {
            actualizado.precio_unitario = producto.precio
          }
        }
        
        return actualizado
      }
      return p
    }))
  }

  const onSubmit = async (data: VentaFormData) => {
    // Validar que haya al menos un producto
    if (productosVenta.length === 0) {
      alert('Debes agregar al menos un producto a la venta')
      return
    }

    // Validar que todos los productos tengan producto_id
    const productosInvalidos = productosVenta.some(p => !p.producto_id || p.cantidad <= 0 || p.precio_unitario <= 0)
    if (productosInvalidos) {
      alert('Todos los productos deben estar completos y tener cantidad y precio válidos')
      return
    }

    try {
      await createVenta.mutateAsync({
        cliente_nombre: data.cliente_nombre || null,
        cliente_email: data.cliente_email || null,
        cliente_telefono: data.cliente_telefono || null,
        zona_delivery: data.zona_delivery || null,
        estado: 'preparando',
        metodo_pago: data.metodo_pago || null,
        notas: data.notas || null,
        fecha_venta: new Date().toISOString(),
        total: total,
        productos: productosVenta.map(p => ({
          producto_id: p.producto_id,
          cantidad: p.cantidad,
          precio_unitario: p.precio_unitario,
        })),
      })

      navigate(isVendedor ? '/vendedor/ventas' : '/admin/ventas')
    } catch (error) {
      console.error('Error al registrar venta:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(isVendedor ? '/vendedor/ventas' : '/admin/ventas')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <h1 className="font-display text-xl font-semibold text-foreground">
                Registrar Nueva Venta
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Información de los Productos */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Productos de la Venta</CardTitle>
                    <CardDescription>Agrega uno o más productos a esta venta</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={agregarProducto}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Producto
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {productosVenta.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No hay productos agregados</p>
                    <p className="text-sm">Haz clic en "Agregar Producto" para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {productosVenta.map((producto, index) => {
                      const productoSeleccionado = productos?.find(p => p.id === producto.producto_id)
                      const subtotal = producto.cantidad * producto.precio_unitario
                      
                      return (
                        <div key={producto.id} className="p-4 border rounded-lg space-y-4 bg-card">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm text-muted-foreground">
                              Producto {index + 1}
                            </h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => eliminarProducto(producto.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Producto */}
                          <div className="space-y-2">
                            <Label>
                              Producto <span className="text-destructive">*</span>
                            </Label>
                            <Select
                              value={producto.producto_id}
                              onValueChange={(value) => actualizarProducto(producto.id, 'producto_id', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un producto" />
                              </SelectTrigger>
                              <SelectContent>
                                {productos?.filter(p => p.activo).map(prod => (
                                  <SelectItem key={prod.id} value={prod.id}>
                                    {prod.nombre} - ${prod.precio.toLocaleString('es-CL')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Cantidad y Precio */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>
                                Cantidad <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                type="number"
                                min="1"
                                value={producto.cantidad}
                                onChange={(e) => actualizarProducto(producto.id, 'cantidad', parseInt(e.target.value) || 1)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>
                                Precio Unitario (CLP) <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                type="number"
                                step="1"
                                value={producto.precio_unitario}
                                onChange={(e) => actualizarProducto(producto.id, 'precio_unitario', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </div>

                          {/* Subtotal del producto */}
                          {producto.producto_id && (
                            <div className="p-3 bg-muted/50 rounded-md">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span className="font-semibold">
                                  ${subtotal.toLocaleString('es-CL')}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Total Calculado */}
                {productosVenta.length > 0 && (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">Total de la Venta:</span>
                      </div>
                      <span className="text-2xl font-bold text-primary">
                        ${total.toLocaleString('es-CL')}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información del Cliente */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Cliente</CardTitle>
                <CardDescription>Datos de contacto del cliente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente_nombre">Nombre del Cliente</Label>
                  <Input
                    id="cliente_nombre"
                    {...register('cliente_nombre')}
                    placeholder="Juan Pérez"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cliente_telefono">Teléfono</Label>
                    <Input
                      id="cliente_telefono"
                      {...register('cliente_telefono')}
                      placeholder="+56 9 7873 8705"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cliente_email">Email</Label>
                    <Input
                      id="cliente_email"
                      type="email"
                      {...register('cliente_email')}
                      placeholder="cliente@ejemplo.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalles de Entrega */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles de Entrega y Pago</CardTitle>
                <CardDescription>Información adicional de la venta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Zona y Estado */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zona_delivery">Zona de Delivery</Label>
                    <Select
                      value={watch('zona_delivery')}
                      onValueChange={(value) => setValue('zona_delivery', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una zona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retiro">Retiro en Local</SelectItem>
                        {zonas?.map(zona => (
                          <SelectItem key={zona.id} value={zona.nombre}>
                            {zona.nombre} ({zona.tiempo_entrega})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Estado fijo: toda venta nueva queda en "preparando" */}
                </div>

                {/* Método de Pago */}
                <div className="space-y-2">
                  <Label htmlFor="metodo_pago">Método de Pago</Label>
                  <Select
                    value={watch('metodo_pago')}
                    onValueChange={(value) => setValue('metodo_pago', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notas */}
                <div className="space-y-2">
                  <Label htmlFor="notas">Notas Adicionales</Label>
                  <Textarea
                    id="notas"
                    {...register('notas')}
                    placeholder="Información adicional sobre la venta..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(isVendedor ? '/vendedor/ventas' : '/admin/ventas')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Registrar Venta
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default AdminVentaForm


import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCreateVenta } from '@/hooks/useVentas'
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
import { ArrowLeft, Loader2, Save, Calculator } from 'lucide-react'

type VentaFormData = {
  producto_id: string
  cantidad: number
  precio_unitario: number
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
  const createVenta = useCreateVenta()
  const { data: productos } = useAllProducts()
  const { data: zonas } = useZonasDelivery()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VentaFormData>({
    defaultValues: {
      cantidad: 1,
      estado: 'pendiente',
      metodo_pago: 'efectivo',
    },
  })

  const productoId = watch('producto_id')
  const cantidad = watch('cantidad')
  const precioUnitario = watch('precio_unitario')

  // Calcular total automáticamente
  const total = cantidad * (precioUnitario || 0)

  // Actualizar precio cuando se selecciona producto
  useEffect(() => {
    if (productoId && productos) {
      const producto = productos.find(p => p.id === productoId)
      if (producto) {
        setValue('precio_unitario', producto.precio)
      }
    }
  }, [productoId, productos, setValue])

  const onSubmit = async (data: VentaFormData) => {
    try {
      await createVenta.mutateAsync({
        producto_id: data.producto_id,
        cantidad: data.cantidad,
        precio_unitario: data.precio_unitario,
        total: total,
        cliente_nombre: data.cliente_nombre || null,
        cliente_email: data.cliente_email || null,
        cliente_telefono: data.cliente_telefono || null,
        zona_delivery: data.zona_delivery || null,
        estado: data.estado,
        metodo_pago: data.metodo_pago || null,
        notas: data.notas || null,
        fecha_venta: new Date().toISOString(),
      })

      navigate('/admin/ventas')
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
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/ventas')}>
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
            {/* Información del Producto */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Producto</CardTitle>
                <CardDescription>Selecciona el producto y cantidad</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Producto */}
                <div className="space-y-2">
                  <Label htmlFor="producto_id">
                    Producto <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={productoId}
                    onValueChange={(value) => setValue('producto_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos?.filter(p => p.activo).map(producto => (
                        <SelectItem key={producto.id} value={producto.id}>
                          {producto.nombre} - ${producto.precio.toLocaleString('es-CL')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.producto_id && (
                    <p className="text-sm text-destructive">{errors.producto_id.message}</p>
                  )}
                </div>

                {/* Cantidad y Precio */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cantidad">
                      Cantidad <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cantidad"
                      type="number"
                      min="1"
                      {...register('cantidad', {
                        required: 'La cantidad es requerida',
                        min: { value: 1, message: 'Mínimo 1' },
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="precio_unitario">
                      Precio Unitario (CLP) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="precio_unitario"
                      type="number"
                      step="1"
                      {...register('precio_unitario', {
                        required: 'El precio es requerido',
                        min: { value: 0, message: 'El precio debe ser mayor a 0' },
                      })}
                    />
                  </div>
                </div>

                {/* Total Calculado */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
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

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado Inicial</Label>
                    <Select
                      value={watch('estado')}
                      onValueChange={(value) => setValue('estado', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="confirmado">Confirmado</SelectItem>
                        <SelectItem value="preparando">Preparando</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                onClick={() => navigate('/admin/ventas')}
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


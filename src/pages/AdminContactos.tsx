import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContactos, useMarcarContactoLeido, useUpdateContacto } from '@/hooks/useContactos'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowLeft, Loader2, Mail, Phone, MessageSquare, Check, X, MessageCircle, Eye, CheckCircle, Clock } from 'lucide-react'
import { Database } from '@/types/database.types'

type Contacto = Database['public']['Tables']['contactos']['Row']

const AdminContactos = () => {
  const navigate = useNavigate()
  const { data: contactos, isLoading } = useContactos()
  const marcarLeido = useMarcarContactoLeido()
  const updateContacto = useUpdateContacto()
  
  const [selectedContacto, setSelectedContacto] = useState<Contacto | null>(null)
  const [notas, setNotas] = useState('')

  const contactosNoLeidos = contactos?.filter(c => !c.leido).length || 0

  const handleToggleLeido = async (contacto: Contacto) => {
    await marcarLeido.mutateAsync({
      id: contacto.id,
      leido: !contacto.leido,
    })
  }

  const handleOpenDialog = (contacto: Contacto) => {
    setSelectedContacto(contacto)
    setNotas(contacto.notas || '')
    
    // Marcar como leído automáticamente al abrir
    if (!contacto.leido) {
      marcarLeido.mutate({
        id: contacto.id,
        leido: true,
      })
    }
  }

  const handleSaveNotas = async () => {
    if (selectedContacto) {
      await updateContacto.mutateAsync({
        id: selectedContacto.id,
        updates: { 
          notas,
          respondido: true,
        },
      })
      setSelectedContacto(null)
    }
  }

  const handleResponderWhatsApp = (contacto: Contacto) => {
    if (!contacto.telefono) return
    
    // Formatear número de teléfono chileno para WhatsApp
    // Eliminar espacios, guiones, paréntesis y el + si existe
    let numero = contacto.telefono.replace(/\D/g, '')
    
    // Si el número empieza con 56 (código de país), mantenerlo
    // Si empieza con 9, agregar 56 al inicio
    // Si empieza con otro número, asumir que es número chileno y agregar 569
    if (numero.startsWith('56')) {
      // Ya tiene código de país
    } else if (numero.startsWith('9')) {
      numero = '56' + numero
    } else {
      // Número local, agregar código de país y 9
      numero = '569' + numero
    }
    
    // Crear mensaje inicial con información del contacto
    const mensajeInicial = `Hola ${contacto.nombre}! 👋\n\nGracias por contactarnos a través de somosmedicinaviva.cl.\n\nVeo que tu consulta es:\n"${contacto.mensaje}"\n\n¿En qué puedo ayudarte?`
    
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensajeInicial)}`
    window.open(url, '_blank')
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
                Mensajes de Contacto
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {contactos?.length || 0} mensajes totales · {contactosNoLeidos} sin leer
              </p>
            </div>
          </div>
          {contactosNoLeidos > 0 && (
            <Badge variant="destructive" className="w-fit shrink-0 px-3 py-1.5">
              {contactosNoLeidos} nuevos
            </Badge>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Mobile: Cards */}
        {!isLoading && contactos && (
          <div className="block md:hidden space-y-4">
            {contactos.length === 0 ? (
              <div className="bg-card rounded-xl border shadow-sm py-16 text-center text-muted-foreground">
                No hay mensajes de contacto
              </div>
            ) : (
              contactos.map((contacto) => (
                <div
                  key={contacto.id}
                  className={`bg-card rounded-xl border shadow-sm overflow-hidden p-4 flex flex-col gap-4 ${!contacto.leido ? 'ring-1 ring-primary/30' : ''}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground text-base break-words">{contacto.nombre}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(contacto.created_at).toLocaleDateString('es-CL', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {contacto.respondido ? (
                      <Badge variant="outline" className="shrink-0 text-green-600 border-green-600">
                        ✓ Respondido
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="shrink-0 text-orange-600 border-orange-600">
                        ⏳ Pendiente
                      </Badge>
                    )}
                  </div>
                  <div className="border-t pt-3 space-y-1">
                    {contacto.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="break-all">{contacto.email}</span>
                      </div>
                    )}
                    {contacto.telefono && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 shrink-0" />
                        <span>{contacto.telefono}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 break-words">{contacto.mensaje}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleLeido(contacto)}
                      className="min-h-[44px] shrink-0"
                      title={contacto.leido ? 'Marcar como no leído' : 'Marcar como leído'}
                    >
                      {contacto.leido ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(contacto)}
                      className="flex-1 min-h-[44px]"
                      title="Ver mensaje completo"
                    >
                      <Eye className="w-4 h-4 mr-2" /> Ver
                    </Button>
                    {contacto.telefono && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResponderWhatsApp(contacto)}
                        className="min-h-[44px] shrink-0 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                        title="Responder por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    )}
                    {!contacto.respondido && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => updateContacto.mutate({ id: contacto.id, updates: { respondido: true } })}
                        className="min-h-[44px] shrink-0 bg-green-500 text-white hover:bg-green-600"
                        title="Marcar como Respondido"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Respondido
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Desktop: Table */}
        {!isLoading && contactos && (
          <div className="hidden md:block bg-card rounded-xl border shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Mensaje</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No hay mensajes de contacto
                    </TableCell>
                  </TableRow>
                ) : (
                  contactos.map((contacto) => (
                    <TableRow key={contacto.id} className={!contacto.leido ? 'bg-primary/5' : ''}>
                      <TableCell>
                        {contacto.respondido ? (
                          <Badge variant="outline" className="w-fit text-green-600 border-green-600">
                            ✓ Respondido
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="w-fit text-orange-600 border-orange-600">
                            ⏳ Pendiente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{contacto.nombre}</p>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {contacto.email && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span className="text-xs">{contacto.email}</span>
                            </div>
                          )}
                          {contacto.telefono && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span className="text-xs">{contacto.telefono}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">{contacto.mensaje}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">
                          {new Date(contacto.created_at).toLocaleDateString('es-CL', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleLeido(contacto)}
                            title={contacto.leido ? 'Marcar como no leído' : 'Marcar como leído'}
                          >
                            {contacto.leido ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleOpenDialog(contacto)} title="Ver mensaje completo">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {contacto.telefono && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResponderWhatsApp(contacto)}
                              className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                              title="Responder por WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {!contacto.respondido && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => updateContacto.mutate({ id: contacto.id, updates: { respondido: true } })}
                              className="bg-green-500 text-white hover:bg-green-600"
                              title="Marcar como Respondido"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" /> Respondido
                            </Button>
                          )}
                          {contacto.respondido && (
                            <Badge variant="outline" className="text-green-600 border-green-600 px-3 py-1.5">
                              ✓ Respondido
                            </Badge>
                          )}
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

      {/* Contact Detail Dialog */}
      <Dialog open={!!selectedContacto} onOpenChange={(open) => !open && setSelectedContacto(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del Mensaje</DialogTitle>
            <DialogDescription>
              Mensaje recibido el {selectedContacto && new Date(selectedContacto.created_at).toLocaleDateString('es-CL')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedContacto && (
            <div className="space-y-4">
              {/* Info del contacto */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Nombre</p>
                  <p className="text-foreground">{selectedContacto.nombre}</p>
                </div>
                {selectedContacto.email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                    <p className="text-foreground">{selectedContacto.email}</p>
                  </div>
                )}
                {selectedContacto.telefono && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Teléfono</p>
                    <p className="text-foreground">{selectedContacto.telefono}</p>
                  </div>
                )}
              </div>

              {/* Mensaje */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Mensaje</p>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-foreground whitespace-pre-wrap">{selectedContacto.mensaje}</p>
                </div>
              </div>

              {/* Estado del mensaje */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Estado</p>
                  {selectedContacto.respondido ? (
                    <Badge variant="outline" className="text-green-600 border-green-600 px-4 py-2">
                      ✓ Respondido
                    </Badge>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        updateContacto.mutate({
                          id: selectedContacto.id,
                          updates: { respondido: true }
                        })
                        // Actualizar el estado local para reflejar el cambio inmediatamente
                        setSelectedContacto({
                          ...selectedContacto,
                          respondido: true
                        })
                      }}
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Marcar como Respondido
                    </Button>
                  )}
                </div>
              </div>

              {/* Notas del admin */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Notas Internas</p>
                <Textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Agrega notas sobre este contacto..."
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleResponderWhatsApp(selectedContacto)}
                  disabled={!selectedContacto.telefono}
                  className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Responder por WhatsApp
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedContacto(null)}>
                    Cerrar
                  </Button>
                  <Button onClick={handleSaveNotas}>
                    Guardar Notas
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminContactos


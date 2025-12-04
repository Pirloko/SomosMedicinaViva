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
import { ArrowLeft, Loader2, Mail, Phone, MessageSquare, Check, X } from 'lucide-react'
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
                  Mensajes de Contacto
                </h1>
                <p className="text-xs text-muted-foreground">
                  {contactos?.length || 0} mensajes totales · {contactosNoLeidos} sin leer
                </p>
              </div>
            </div>
            {contactosNoLeidos > 0 && (
              <Badge variant="destructive" className="px-3 py-1">
                {contactosNoLeidos} nuevos
              </Badge>
            )}
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

        {/* Contacts Table */}
        {!isLoading && contactos && (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
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
                    <TableRow 
                      key={contacto.id}
                      className={!contacto.leido ? 'bg-primary/5' : ''}
                    >
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={contacto.leido ? 'secondary' : 'default'} className="w-fit">
                            {contacto.leido ? 'Leído' : 'Nuevo'}
                          </Badge>
                          {contacto.respondido && (
                            <Badge variant="outline" className="w-fit text-green-600">
                              Respondido
                            </Badge>
                          )}
                        </div>
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
                        <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                          {contacto.mensaje}
                        </p>
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
                          >
                            {contacto.leido ? (
                              <X className="w-4 h-4" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(contacto)}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
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
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    const message = `Hola ${selectedContacto.nombre}! Gracias por contactarnos.`
                    window.open(`https://wa.me/${selectedContacto.telefono?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
                  }}
                  disabled={!selectedContacto.telefono}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Responder por WhatsApp
                </Button>
                <Button onClick={handleSaveNotas}>
                  Guardar Notas
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminContactos


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageSquare, AlertCircle } from 'lucide-react'
import { memo, useCallback } from 'react'

interface Contacto {
  id: string
  nombre: string
  mensaje: string
  leido: boolean
  respondido: boolean
  created_at: string
}

interface ContactosAlertProps {
  contactosPendientes: number
  contactosNoLeidos: number
  contactosPreview: Contacto[]
  isLoading: boolean
  error: boolean | Error | null
  onNavigate: () => void
  formatDate: (date: string | null | undefined) => string
}

const ContactosAlert = memo(({
  contactosPendientes,
  contactosNoLeidos,
  contactosPreview,
  isLoading,
  error,
  onNavigate,
  formatDate
}: ContactosAlertProps) => {
  const handleRetry = useCallback(() => {
    window.location.reload()
  }, [])

  if (isLoading) {
    return (
      <Card className="mb-8 border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-9 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mb-8 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <p className="text-destructive font-semibold mb-2">
              Error al cargar mensajes de contacto
            </p>
            <Button variant="outline" size="sm" onClick={handleRetry} className="mt-2">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (contactosPendientes === 0) {
    return null
  }

  return (
    <Card className="mb-8 border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center text-white">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-blue-900">
                💬 Mensajes de Contacto Pendientes
              </CardTitle>
              <CardDescription className="text-blue-700">
                {contactosPendientes} {contactosPendientes === 1 ? 'mensaje pendiente' : 'mensajes pendientes'} · {contactosNoLeidos} sin leer
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onNavigate}
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            Ver Mensajes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {contactosPreview.map((contacto) => (
            <div 
              key={contacto.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-foreground">{contacto.nombre}</p>
                  {!contacto.leido && (
                    <Badge variant="default" className="text-xs">
                      Nuevo
                    </Badge>
                  )}
                  {!contacto.respondido && (
                    <Badge variant="outline" className="text-xs text-orange-600">
                      Pendiente
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {contacto.mensaje || 'Sin mensaje'}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="text-xs text-muted-foreground">
                  {formatDate(contacto.created_at)}
                </p>
              </div>
            </div>
          ))}
          {contactosPendientes > 3 && (
            <p className="text-center text-sm text-blue-600 pt-2">
              + {contactosPendientes - 3} mensajes pendientes más
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

ContactosAlert.displayName = 'ContactosAlert'

export default ContactosAlert

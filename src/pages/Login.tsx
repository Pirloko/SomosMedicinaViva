import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Lock, Mail } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, role, user } = useAuth()
  const navigate = useNavigate()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/vendedor', { replace: true })
      }
    }
  }, [user, role, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      return
    }

    try {
      setIsLoading(true)
      // signIn ahora retorna el rol directamente
      const userRole = await signIn(email, password)
      
      // Redirigir inmediatamente según el rol retornado
      if (userRole === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/vendedor', { replace: true })
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      // El error ya se muestra en el toast, no hacer nada más
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mint px-4">
      {/* Fondo con imagen */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <img 
                src="/imagen/logoMedicinaVida.png" 
                alt="Medicina Viva" 
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-display">Panel de Administración</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@mediciaviva.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>

            {/* Volver al inicio */}
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full"
              onClick={() => navigate('/')}
              disabled={isLoading}
            >
              Volver al inicio
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login


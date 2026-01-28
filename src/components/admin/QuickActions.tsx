import { Button } from '@/components/ui/button'
import { memo } from 'react'

interface QuickActionsProps {
  onNavigateToHome: () => void
  onNavigateToProductos: () => void
  onNavigateToVentas: () => void
  onNavigateToKPIs: () => void
}

const QuickActions = memo(({
  onNavigateToHome,
  onNavigateToProductos,
  onNavigateToVentas,
  onNavigateToKPIs
}: QuickActionsProps) => {
  return (
    <div className="mt-8 grid sm:grid-cols-4 gap-4">
      <Button variant="outline" onClick={onNavigateToHome} className="w-full">
        Ver Sitio Web
      </Button>
      <Button variant="outline" onClick={onNavigateToProductos} className="w-full">
        Agregar Producto
      </Button>
      <Button variant="default" onClick={onNavigateToVentas} className="w-full bg-emerald-500 hover:bg-emerald-600">
        💰 Registrar Venta
      </Button>
      <Button variant="outline" onClick={onNavigateToKPIs} className="w-full">
        Ver Estadísticas
      </Button>
    </div>
  )
})

QuickActions.displayName = 'QuickActions'

export default QuickActions

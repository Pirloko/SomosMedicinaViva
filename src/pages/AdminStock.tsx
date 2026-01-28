import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Factory, Warehouse } from 'lucide-react'
import AdminProduccion from './AdminProduccion'
import AdminIngredientesStock from './AdminIngredientesStock'

const AdminStock = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  
  // Inicializar con el tab del query param o 'produccion' por defecto
  const [activeTab, setActiveTab] = useState(tabParam === 'ingredientes' ? 'ingredientes' : 'produccion')
  
  // Actualizar tab si cambia el query param
  useEffect(() => {
    if (tabParam === 'ingredientes' || tabParam === 'produccion') {
      setActiveTab(tabParam)
    }
  }, [tabParam])

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
                  Manejo de Stock
                </h1>
                <p className="text-xs text-muted-foreground">
                  Producción y stock de ingredientes
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="produccion" className="flex items-center gap-2">
              <Factory className="w-4 h-4" />
              Producción
            </TabsTrigger>
            <TabsTrigger value="ingredientes" className="flex items-center gap-2">
              <Warehouse className="w-4 h-4" />
              Stock de Ingredientes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="produccion" className="mt-0">
            <AdminProduccion hideHeader={true} />
          </TabsContent>

          <TabsContent value="ingredientes" className="mt-0">
            <AdminIngredientesStock />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default AdminStock

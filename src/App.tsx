import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminProductos from "./pages/AdminProductos";
import AdminProductoForm from "./pages/AdminProductoForm";
import AdminProductoCostos from "./pages/AdminProductoCostos";
import AdminIngredientes from "./pages/AdminIngredientes";
import AdminBeneficios from "./pages/AdminBeneficios";
import AdminPuntosVenta from "./pages/AdminPuntosVenta";
import AdminDelivery from "./pages/AdminDelivery";
import AdminCategorias from "./pages/AdminCategorias";
import AdminHeroCarousel from "./pages/AdminHeroCarousel";
import AdminAbout from "./pages/AdminAbout";
import AdminProduccion from "./pages/AdminProduccion";
import AdminVentas from "./pages/AdminVentas";
import AdminVentaForm from "./pages/AdminVentaForm";
import AdminContactos from "./pages/AdminContactos";
import AdminKPIs from "./pages/AdminKPIs";
import AdminGanancias from "./pages/AdminGanancias";
import NotFound from "./pages/NotFound";
import { checkSupabaseConnection } from "@/lib/supabase";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Verificar conexión con Supabase al iniciar
    checkSupabaseConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Rutas Protegidas (Admin) */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/productos" 
                element={
                  <ProtectedRoute>
                    <AdminProductos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/productos/nuevo" 
                element={
                  <ProtectedRoute>
                    <AdminProductoForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/productos/:id" 
                element={
                  <ProtectedRoute>
                    <AdminProductoForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/productos/:id/costos" 
                element={
                  <ProtectedRoute>
                    <AdminProductoCostos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/ingredientes" 
                element={
                  <ProtectedRoute>
                    <AdminIngredientes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/beneficios" 
                element={
                  <ProtectedRoute>
                    <AdminBeneficios />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/puntos-venta" 
                element={
                  <ProtectedRoute>
                    <AdminPuntosVenta />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/delivery" 
                element={
                  <ProtectedRoute>
                    <AdminDelivery />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/categorias" 
                element={
                  <ProtectedRoute>
                    <AdminCategorias />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/hero-carousel" 
                element={
                  <ProtectedRoute>
                    <AdminHeroCarousel />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/nosotros" 
                element={
                  <ProtectedRoute>
                    <AdminAbout />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/produccion" 
                element={
                  <ProtectedRoute>
                    <AdminProduccion />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/ventas" 
                element={
                  <ProtectedRoute>
                    <AdminVentas />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/ventas/nueva" 
                element={
                  <ProtectedRoute>
                    <AdminVentaForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/contactos" 
                element={
                  <ProtectedRoute>
                    <AdminContactos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/kpis" 
                element={
                  <ProtectedRoute>
                    <AdminKPIs />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/ganancias" 
                element={
                  <ProtectedRoute>
                    <AdminGanancias />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import AdminStock from "./pages/AdminStock";
import AdminUsuarios from "./pages/AdminUsuarios";
import VendedorDashboard from "./pages/VendedorDashboard";
import NotFound from "./pages/NotFound";
import { checkSupabaseConnection } from "@/lib/supabase";

const queryClient = new QueryClient();

// Componente para cambiar título y favicon según la ruta
const DocumentTitle = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  useEffect(() => {
    // Cambiar título
    if (isAdminRoute) {
      document.title = 'Panel Admin | Medicina Viva';
    } else {
      document.title = 'Medicina Viva | Pastelería Saludable - Sin azúcar, sin gluten, vegana';
    }

    // Cambiar favicon dinámicamente
    const updateFavicon = (href: string) => {
      // Eliminar todos los favicons existentes
      const existingFavicons = document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']");
      existingFavicons.forEach(link => link.remove());
      
      // Agregar timestamp para forzar recarga
      const timestamp = new Date().getTime();
      const hrefWithCache = `${href}?v=${timestamp}`;
      
      // Crear nuevos favicons
      const favicon32 = document.createElement('link');
      favicon32.rel = 'icon';
      favicon32.type = 'image/png';
      favicon32.sizes = '32x32';
      favicon32.href = hrefWithCache;
      document.head.appendChild(favicon32);
      
      const favicon16 = document.createElement('link');
      favicon16.rel = 'icon';
      favicon16.type = 'image/png';
      favicon16.sizes = '16x16';
      favicon16.href = hrefWithCache;
      document.head.appendChild(favicon16);
      
      const shortcutIcon = document.createElement('link');
      shortcutIcon.rel = 'shortcut icon';
      shortcutIcon.type = 'image/png';
      shortcutIcon.href = hrefWithCache;
      document.head.appendChild(shortcutIcon);
      
      const appleIcon = document.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      appleIcon.sizes = '180x180';
      appleIcon.href = hrefWithCache;
      document.head.appendChild(appleIcon);
    };
    
    // Usar el logo de Medicina Viva
    updateFavicon('/imagen/logoMedicinaVida.png');
  }, [isAdminRoute, location.pathname]);

  return null;
};

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
            <DocumentTitle />
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Rutas Protegidas (Admin) - Requieren rol admin */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/usuarios" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminUsuarios />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/productos" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminProductos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/productos/nuevo" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminProductoForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/productos/:id" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminProductoForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/productos/:id/costos" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminProductoCostos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/ingredientes" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminIngredientes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/beneficios" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminBeneficios />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/puntos-venta" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPuntosVenta />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/delivery" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDelivery />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/categorias" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminCategorias />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/hero-carousel" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminHeroCarousel />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/nosotros" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminAbout />
                  </ProtectedRoute>
                } 
              />
              {/* Redirección desde /admin/produccion a /admin/stock */}
              <Route 
                path="/admin/produccion" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Navigate to="/admin/stock?tab=produccion" replace />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/stock" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminStock />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/ventas" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminVentas />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/ventas/nueva" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminVentaForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/contactos" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminContactos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/kpis" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminKPIs />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/ganancias" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminGanancias />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas Protegidas (Vendedor) */}
              <Route 
                path="/vendedor" 
                element={
                  <ProtectedRoute requiredRole="vendedor">
                    <VendedorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vendedor/ventas/nueva" 
                element={
                  <ProtectedRoute requiredRole="vendedor">
                    <AdminVentaForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vendedor/ventas" 
                element={
                  <ProtectedRoute requiredRole="vendedor">
                    <AdminVentas />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vendedor/productos" 
                element={
                  <ProtectedRoute requiredRole="vendedor">
                    <AdminProductos />
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

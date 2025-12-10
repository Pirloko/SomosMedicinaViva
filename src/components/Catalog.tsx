import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProducts } from "@/hooks/useProducts";
import { useCategorias } from "@/hooks/useCategorias";
import { Loader2, AlertCircle, ShoppingCart, X } from "lucide-react";
import { Database } from "@/types/database.types";

type Product = Database['public']['Tables']['productos']['Row']

const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // 🔥 Obtener productos y categorías desde Supabase
  const { data: products, isLoading, error } = useProducts(activeCategory);
  const { data: categorias } = useCategorias();

  const handleWhatsApp = (product: Product) => {
    const message = `Hola, acabo de visitar somosmedicinaviva.cl y me gustaría realizar un pedido`
    window.open(`https://wa.me/56978738705?text=${encodeURIComponent(message)}`, "_blank")
  };

  return (
    <section id="catalogo" className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Nuestro Catálogo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Productos artesanales elaborados con ingredientes naturales y mucho amor
          </p>
        </div>

        {/* Categories */}
        {categorias && categorias.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                onClick={() => setActiveCategory(categoria.slug)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === categoria.slug
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-card text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                }`}
              >
                {categoria.nombre}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Cargando productos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <p className="text-destructive font-semibold mb-2">Error al cargar productos</p>
            <p className="text-muted-foreground text-sm">
              Por favor, intenta recargar la página
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, index) => (
              <article
                key={product.id}
                className="group bg-card rounded-2xl overflow-hidden shadow-soft card-hover cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedProduct(product)}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.imagen_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop'}
                    alt={product.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {product.tags && product.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.nombre}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.descripcion}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-primary">
                      ${product.precio.toLocaleString('es-CL')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Precio referencial
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-muted-foreground">No hay productos en esta categoría</p>
          </div>
        )}

        {/* Note */}
        {!isLoading && !error && products && products.length > 0 && (
          <p className="text-center text-sm text-muted-foreground mt-10">
            * Los precios son referenciales. Consulta disponibilidad y personalización por WhatsApp.
          </p>
        )}
      </div>

      {/* Modal de Detalle de Producto */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto p-0 bg-white border-none shadow-2xl">
          {selectedProduct && (
            <div className="relative">
              {/* Botón Cerrar */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
                onClick={() => setSelectedProduct(null)}
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Imagen del Producto - Full Width */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img
                  src={selectedProduct.imagen_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop'}
                  alt={selectedProduct.nombre}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Contenido */}
              <div className="p-6 space-y-5">
                {/* Categoría Badge */}
                <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                  {selectedProduct.categoria}
                </Badge>

                {/* Nombre del Producto */}
                <h2 className="text-3xl font-display font-bold text-foreground leading-tight">
                  {selectedProduct.nombre}
                </h2>

                {/* Tags con Checkmarks */}
                {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.tags.map((tag) => (
                      <div
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium"
                      >
                        <span className="text-green-600">✓</span>
                        {tag}
                      </div>
                    ))}
                  </div>
                )}

                {/* Descripción */}
                {selectedProduct.descripcion && (
                  <div>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {selectedProduct.descripcion}
                    </p>
                  </div>
                )}

                {/* Precio */}
                <div className="space-y-2 pt-4">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    Precio
                  </p>
                  <div className="flex items-end gap-3">
                    <p className="text-5xl font-bold text-primary">
                      ${selectedProduct.precio.toLocaleString('es-CL')}
                    </p>
                    <p className="text-sm text-muted-foreground pb-2">
                      Precio referencial
                    </p>
                  </div>
                </div>

                {/* Botón de Acción */}
                <Button 
                  variant="whatsapp" 
                  size="lg"
                  className="w-full"
                  onClick={() => handleWhatsApp(selectedProduct)}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Hacer Pedido
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Consulta disponibilidad y personalización por WhatsApp
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Catalog;

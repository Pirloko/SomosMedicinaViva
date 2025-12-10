import { MapPin, Clock, Store, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePuntosVenta } from '@/hooks/usePuntosVenta'

const PickupPoints = () => {
  // 🔥 Obtener puntos de venta desde Supabase
  const { data: pickupPoints, isLoading, error } = usePuntosVenta()
  return (
    <section id="puntos-venta" className="section-padding bg-gradient-mint">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Puntos de Venta
          </span>
          
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Encuentra Nuestros Productos
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visita nuestros puntos de venta aliados y descubre toda nuestra línea de productos saludables
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <p className="text-muted-foreground">Error al cargar puntos de venta</p>
          </div>
        )}

        {/* Pickup Points Grid */}
        {!isLoading && !error && pickupPoints && pickupPoints.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {pickupPoints.map((point) => (
                <article
                  key={point.id}
                  className="group bg-card rounded-2xl overflow-hidden shadow-soft card-hover"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={point.imagen_url || 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=400&h=300&fit=crop'}
                      alt={point.nombre}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/90 backdrop-blur-sm rounded-full">
                        <Store className="w-4 h-4 text-primary-foreground" />
                        <span className="text-xs font-medium text-primary-foreground">
                          Punto de Venta
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Store Name */}
                    <h3 className="font-display text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {point.nombre}
                    </h3>

                    {/* Address */}
                    <a
                      href={point.maps_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 mb-4 bg-muted/50 rounded-lg hover:bg-primary/10 transition-colors group/address"
                    >
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/address:scale-110 transition-transform" />
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover/address:text-primary transition-colors">
                          {point.direccion}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click para ver en Google Maps
                        </p>
                      </div>
                    </a>

                    {/* Schedule */}
                    <div className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-foreground font-medium mb-1">Horarios de Atención:</p>
                        <p className="text-muted-foreground">{point.horario_semana}</p>
                        <p className="text-muted-foreground">{point.horario_sabado}</p>
                        <p className="text-muted-foreground">{point.horario_domingo}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-card p-6 lg:p-8 text-center">
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                ¿Quieres vender nuestros productos en tu negocio?
              </h3>
              <p className="text-muted-foreground mb-6">
                Si tienes un local y te gustaría ser punto de venta de Medicina Viva, contáctanos por WhatsApp
              </p>
              <Button 
                variant="whatsapp"
                onClick={() => window.open("https://wa.me/56978738705?text=Hola!%20Me%20interesa%20ser%20punto%20de%20venta", "_blank")}
              >
                <Store className="w-5 h-5" />
                Quiero ser Punto de Venta
              </Button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!pickupPoints || pickupPoints.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20">
            <Store className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay puntos de venta disponibles</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PickupPoints;


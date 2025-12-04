import { MapPin, Clock, Truck, Loader2, AlertCircle } from "lucide-react";
import { useZonasDelivery } from '@/hooks/useZonasDelivery'

const Delivery = () => {
  // 🔥 Obtener zonas desde Supabase
  const { data: zones, isLoading, error } = useZonasDelivery()

  return (
    <section id="delivery" className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Info */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Delivery
            </span>
            
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Te Llevamos la Dulzura
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Realizamos delivery a diversas comunas. Consulta disponibilidad y tiempos de entrega para tu zona.
            </p>

            {/* Info cards */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-5 bg-card rounded-xl shadow-soft">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Horarios de Entrega</h3>
                  <p className="text-muted-foreground text-sm">
                    Lunes a Viernes: 10:00 - 19:00 hrs<br />
                    Sábados: 10:00 - 14:00 hrs
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-card rounded-xl shadow-soft">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Costo de Envío</h3>
                  <p className="text-muted-foreground text-sm">
                    Desde $3.990 según zona<br />
                    Envío gratis en compras sobre $40.000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-card rounded-xl shadow-soft">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Punto de Retiro</h3>
                  <p className="text-muted-foreground text-sm">
                    Disponible retiro sin costo<br />
                    Coordinar horario por WhatsApp
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Zones */}
          <div>
            <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Zonas de Cobertura
              </h3>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex flex-col items-center justify-center py-10">
                  <AlertCircle className="w-8 h-8 text-destructive mb-2" />
                  <p className="text-sm text-muted-foreground">Error al cargar zonas</p>
                </div>
              )}

              {/* Zones Grid */}
              {!isLoading && !error && zones && (
                <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {zones.map((zone) => (
                  <div
                        key={zone.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                        <span className="text-sm font-medium text-foreground">{zone.nombre}</span>
                        <span className="text-xs text-muted-foreground">{zone.tiempo_entrega}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">¿No encuentras tu comuna?</strong><br />
                  Escríbenos por WhatsApp y consultamos disponibilidad para tu zona.
                </p>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Delivery;

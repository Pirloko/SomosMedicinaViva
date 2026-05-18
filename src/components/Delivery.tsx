import { MapPin, Clock, Truck } from "lucide-react";
import { useDeliveryInfo, getDefaultDeliveryInfo } from '@/hooks/useDeliveryInfo'

const Delivery = () => {
  const { data: deliveryInfo } = useDeliveryInfo()
  const defaults = getDefaultDeliveryInfo()
  const horarios = deliveryInfo?.horarios_entrega ?? defaults.horarios_entrega
  const costoTexto = deliveryInfo?.costo_envio_texto ?? defaults.costo_envio_texto
  const retiroTexto = deliveryInfo?.punto_retiro_texto ?? defaults.punto_retiro_texto

  return (
    <section id="delivery" className="section-padding bg-background">
      <div className="container-custom max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Delivery
          </span>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Te Llevamos la Dulzura
          </h2>

          <p className="text-lg text-muted-foreground">
            Realizamos delivery en la región. Escríbenos por WhatsApp para confirmar disponibilidad en tu comuna.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-5 bg-card rounded-xl shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Horarios de Entrega</h3>
              <p className="text-muted-foreground text-sm whitespace-pre-line">{horarios}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-card rounded-xl shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Costo de Envío</h3>
              <p className="text-muted-foreground text-sm whitespace-pre-line">{costoTexto}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-card rounded-xl shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Punto de Retiro</h3>
              <p className="text-muted-foreground text-sm whitespace-pre-line">{retiroTexto}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 text-center">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">¿No encuentras tu comuna?</strong>
            <br />
            Escríbenos por WhatsApp y consultamos disponibilidad para tu zona.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Delivery;

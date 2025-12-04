import { useState } from "react";
import { MessageCircle, Instagram, Mail, Phone, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateContacto } from "@/hooks/useContactos";

const Contact = () => {
  const createContacto = useCreateContacto();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 🔥 Guardar en Supabase
      await createContacto.mutateAsync({
        nombre: formData.name,
        email: formData.email || null,
        telefono: formData.phone || null,
        mensaje: formData.message,
        leido: false,
      });

      // Abrir WhatsApp
      const message = `Hola! Me llamo ${formData.name}.%0A%0AEmail: ${formData.email}%0ATeléfono: ${formData.phone}%0A%0AMensaje: ${formData.message}`;
      window.open(`https://wa.me/56912345678?text=${message}`, "_blank");

      // Limpiar formulario
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error('Error al enviar contacto:', error);
    }
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/56912345678?text=Hola!%20Me%20interesa%20hacer%20un%20pedido", "_blank");
  };

  return (
    <section id="contacto" className="section-padding gradient-mint">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Contacto
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            ¿Listo Para Pedir?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escríbenos por WhatsApp o completa el formulario y te responderemos a la brevedad
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form */}
          <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
            <h3 className="font-display text-xl font-semibold text-foreground mb-6">
              Envíanos un Mensaje
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Nombre *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Teléfono
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+56 9 1234 5678"
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Mensaje *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="¿Qué te gustaría pedir o consultar?"
                  rows={4}
                  className="rounded-xl resize-none"
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={createContacto.isPending}>
                {createContacto.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Mensaje
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* WhatsApp CTA */}
            <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                Contacto Directo
              </h3>
              <p className="text-muted-foreground mb-6">
                La forma más rápida de hacer tu pedido es por WhatsApp. ¡Te respondemos al instante!
              </p>
              <Button variant="whatsapp" size="lg" className="w-full" onClick={handleWhatsApp}>
                <MessageCircle className="w-5 h-5" />
                Escribir por WhatsApp
              </Button>
            </div>

            {/* Other contacts */}
            <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                Otras Formas de Contacto
              </h3>

              <div className="space-y-4">
                <a
                  href="https://instagram.com/somosmedicinaviva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      @somosmedicinaviva
                    </p>
                    <p className="text-sm text-muted-foreground">Síguenos en Instagram</p>
                  </div>
                </a>

                <a
                  href="mailto:hola@medicinaviva.com"
                  className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      hola@medicinaviva.com
                    </p>
                    <p className="text-sm text-muted-foreground">Escríbenos un email</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">+56 9 1234 5678</p>
                    <p className="text-sm text-muted-foreground">WhatsApp disponible</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

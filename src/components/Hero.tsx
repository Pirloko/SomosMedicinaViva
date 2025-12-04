import { useState, useEffect } from "react";
import { MessageCircle, Sparkles, Heart, Leaf, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroImagenes } from "@/hooks/useHeroImagenes";

const Hero = () => {
  const { data: heroImagenes } = useHeroImagenes();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Carrusel automático: cambiar imagen cada 2 segundos
  useEffect(() => {
    if (!heroImagenes || heroImagenes.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImagenes.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // 2 segundos

    return () => clearInterval(interval);
  }, [heroImagenes]);

  const handleWhatsApp = () => {
    window.open("https://wa.me/56912345678?text=Hola!%20Me%20interesa%20hacer%20un%20pedido", "_blank");
  };

  // Imagen actual del carrusel (o imagen por defecto)
  const currentImage = heroImagenes && heroImagenes.length > 0 
    ? heroImagenes[currentImageIndex]
    : {
        imagen_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop",
        titulo: "Torta saludable de chocolate",
        subtitulo: null
      };

  return (
    <section id="inicio" className="relative gradient-hero overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-20">
        {/* Layout vertical centrado */}
        <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
          
          {/* PARTE 1: Textos y Features */}
          <div className="w-full max-w-4xl space-y-6 md:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-up">
              <Sparkles className="w-4 h-4" />
              <span>100% Natural y Artesanal</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Pastelería{" "}
              <span className="text-primary">Saludable</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Sin azúcar · Sin gluten · Sin refinados · 100% Vegana
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              {[
                { icon: Heart, text: "Apto diabéticos" },
                { icon: Leaf, text: "Vegano" },
                { icon: Sparkles, text: "Sin gluten" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-soft text-sm font-medium text-foreground"
                >
                  <feature.icon className="w-4 h-4 text-primary" />
                  {feature.text}
                </div>
              ))}
            </div>
          </div>

          {/* PARTE 2: Imagen del Carrusel */}
          <div className="relative animate-fade-up w-full max-w-lg" style={{ animationDelay: "0.4s" }}>
            <div className="relative aspect-square mx-auto animate-spin-entrance">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-spin" style={{ animationDuration: "30s" }} />
              
              {/* Main image container con transición */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden shadow-card">
                <img
                  src={currentImage.imagen_url}
                  alt={currentImage.titulo || "Producto saludable"}
                  className="w-full h-full object-cover transition-opacity duration-1000"
                  key={currentImageIndex}
                />
              </div>
              
              {/* Indicadores del carrusel */}
              {heroImagenes && heroImagenes.length > 1 && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {heroImagenes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-primary w-8' 
                          : 'bg-primary/30 hover:bg-primary/50'
                      }`}
                      aria-label={`Ir a imagen ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Floating badges */}
              <div className="absolute top-12 -left-4 bg-card rounded-2xl shadow-card px-4 py-3 animate-float">
                <p className="text-xs text-muted-foreground">Sin Azúcar</p>
                <p className="font-display font-semibold text-primary">100%</p>
              </div>
              
              <div className="absolute bottom-20 -right-4 bg-card rounded-2xl shadow-card px-4 py-3 animate-float" style={{ animationDelay: "1s" }}>
                <p className="text-xs text-muted-foreground">Vegano</p>
                <p className="font-display font-semibold text-accent-foreground">🌱</p>
              </div>
            </div>
          </div>

          {/* PARTE 3: Botones CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <Button variant="whatsapp" size="xl" onClick={handleWhatsApp}>
              <MessageCircle className="w-5 h-5" />
              Pedir por WhatsApp
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#catalogo">Ver Catálogo</a>
            </Button>
            <Button variant="outline" size="xl" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
              <a href="#puntos-venta">
                <MapPin className="w-5 h-5" />
                Puntos de Venta
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

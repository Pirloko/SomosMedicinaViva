import { useState, useEffect, useMemo } from "react";
import { MessageCircle, Sparkles, Heart, Leaf, MapPin, CheckCircle2, Star, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroImagenes } from "@/hooks/useHeroImagenes";
import { useHeroEtiquetas, getDefaultHeroEtiquetas } from "@/hooks/useHeroEtiquetas";

const ICON_MAP: Record<string, LucideIcon> = {
  Heart,
  Leaf,
  Sparkles,
  CheckCircle2,
  Star,
};

const Hero = () => {
  const { data: heroImagenes } = useHeroImagenes();
  const { data: heroEtiquetasRow } = useHeroEtiquetas();
  const etiquetas = useMemo(() => {
    const def = getDefaultHeroEtiquetas();
    if (!heroEtiquetasRow) return def;
    return {
      floating_1_label: heroEtiquetasRow.floating_1_label || def.floating_1_label,
      floating_1_value: heroEtiquetasRow.floating_1_value || def.floating_1_value,
      floating_2_label: heroEtiquetasRow.floating_2_label || def.floating_2_label,
      floating_2_value: heroEtiquetasRow.floating_2_value || def.floating_2_value,
      feature_1_icon: heroEtiquetasRow.feature_1_icon || def.feature_1_icon,
      feature_1_text: heroEtiquetasRow.feature_1_text || def.feature_1_text,
      feature_2_icon: heroEtiquetasRow.feature_2_icon || def.feature_2_icon,
      feature_2_text: heroEtiquetasRow.feature_2_text || def.feature_2_text,
      feature_3_icon: heroEtiquetasRow.feature_3_icon || def.feature_3_icon,
      feature_3_text: heroEtiquetasRow.feature_3_text || def.feature_3_text,
    };
  }, [heroEtiquetasRow]);
  const features = useMemo(() => [
    { icon: ICON_MAP[etiquetas.feature_1_icon] ?? Heart, text: etiquetas.feature_1_text },
    { icon: ICON_MAP[etiquetas.feature_2_icon] ?? Leaf, text: etiquetas.feature_2_text },
    { icon: ICON_MAP[etiquetas.feature_3_icon] ?? Sparkles, text: etiquetas.feature_3_text },
  ], [etiquetas]);
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
    window.open("https://wa.me/56978738705?text=Hola,%20acabo%20de%20visitar%20somosmedicinaviva.cl%20y%20me%20gustaría%20realizar%20un%20pedido", "_blank");
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
              {features.map((feature, index) => (
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
                <p className="text-xs text-muted-foreground">{etiquetas.floating_1_label}</p>
                <p className="font-display font-semibold text-primary">{etiquetas.floating_1_value}</p>
              </div>
              
              <div className="absolute bottom-20 -right-4 bg-card rounded-2xl shadow-card px-4 py-3 animate-float" style={{ animationDelay: "1s" }}>
                <p className="text-xs text-muted-foreground">{etiquetas.floating_2_label}</p>
                <p className="font-display font-semibold text-accent-foreground">{etiquetas.floating_2_value}</p>
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

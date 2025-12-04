import { Heart, Leaf, Award, Star, Loader2, AlertCircle } from "lucide-react";
import { useAboutContent, useAboutValues } from "@/hooks/useAbout";

const About = () => {
  const { data: content, isLoading, error } = useAboutContent();
  const { data: values } = useAboutValues();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return Heart;
      case 'Leaf': return Leaf;
      case 'Award': return Award;
      case 'Star': return Star;
      default: return Heart;
    }
  };

  return (
    <section id="nosotros" className="section-padding gradient-warm">
      <div className="container-custom">
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
            <p className="text-muted-foreground">Error al cargar contenido</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && content && (
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-card">
                <img
                  src={content.imagen_url || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=750&fit=crop'}
                  alt={content.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-6 -right-6 lg:right-auto lg:-left-6 bg-card rounded-2xl shadow-card p-6 max-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-primary fill-primary" />
                  <span className="font-display font-semibold text-foreground">{content.estadistica_numero}</span>
                </div>
                <p className="text-sm text-muted-foreground">{content.estadistica_texto}</p>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                Nuestra Historia
              </span>
              
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {content.titulo}
              </h2>

              <div className="space-y-4 text-muted-foreground mb-8">
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {content.parrafo_1}
                </p>
                {content.parrafo_2 && (
                  <p className="leading-relaxed whitespace-pre-line">
                    {content.parrafo_2}
                  </p>
                )}
                {content.parrafo_3 && (
                  <p className="leading-relaxed whitespace-pre-line">
                    {content.parrafo_3}
                  </p>
                )}
              </div>

              {/* Values */}
              {values && values.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {values.map((value) => {
                    const IconComponent = getIcon(value.icono);
                    return (
                      <div key={value.id} className="flex items-center gap-3 p-4 bg-card rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{value.titulo}</p>
                          <p className="text-xs text-muted-foreground">{value.descripcion}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;

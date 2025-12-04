import * as LucideIcons from "lucide-react";
import { useBeneficios } from '@/hooks/useBeneficios'

const Benefits = () => {
  // 🔥 Obtener beneficios desde Supabase
  const { data: beneficios, isLoading, error } = useBeneficios()

  // Helper para obtener el icono de Lucide por nombre
  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName]
    return Icon || LucideIcons.Heart
  }
  return (
    <section id="beneficios" className="section-padding gradient-mint">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Apto Para Todos
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Pensado Para Ti
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nuestros productos están diseñados para que todos puedan disfrutar sin preocupaciones
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <LucideIcons.Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <LucideIcons.AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <p className="text-muted-foreground">Error al cargar beneficios</p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !error && beneficios && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {beneficios.map((beneficio) => {
                const IconComponent = getIcon(beneficio.icono)
                
                return (
                  <div
                    key={beneficio.id}
                    className="group bg-card rounded-2xl p-8 shadow-soft card-hover"
                  >
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl ${beneficio.color} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                      <IconComponent className="w-7 h-7" />
                    </div>

                    {/* Content */}
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                      {beneficio.titulo}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {beneficio.descripcion}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Trust badge */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-card rounded-full shadow-soft">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="text-sm font-medium text-foreground">
                  Todos nuestros productos son elaborados en un ambiente controlado
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Benefits;

import { useIngredientes } from '@/hooks/useIngredientes'
import { Loader2, AlertCircle } from 'lucide-react'

const Ingredients = () => {
  // 🔥 Obtener ingredientes desde Supabase
  const { data: ingredientes, isLoading, error } = useIngredientes()

  return (
    <section id="ingredientes" className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-cacao/10 text-cacao text-sm font-medium mb-4">
            Ingredientes Naturales
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Lo Mejor de la Naturaleza
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Seleccionamos cuidadosamente cada ingrediente por sus beneficios para tu salud
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
            <p className="text-muted-foreground">Error al cargar ingredientes</p>
          </div>
        )}

        {/* Ingredients Grid */}
        {!isLoading && !error && ingredientes && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {ingredientes.map((ingrediente) => (
              <div
                key={ingrediente.id}
                className="group relative bg-card rounded-2xl overflow-hidden shadow-soft card-hover"
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={ingrediente.imagen_url || 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=200&h=200&fit=crop'}
                    alt={ingrediente.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-base sm:text-lg font-semibold text-white mb-1">
                    {ingrediente.nombre}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-2">
                    {ingrediente.beneficio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { number: "0%", label: "Azúcar refinada" },
            { number: "100%", label: "Ingredientes naturales" },
            { number: "0%", label: "Conservantes artificiales" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-card rounded-2xl shadow-soft">
              <span className="font-display text-4xl lg:text-5xl font-bold text-primary">
                {stat.number}
              </span>
              <p className="text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ingredients;

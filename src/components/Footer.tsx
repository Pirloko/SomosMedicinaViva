import { Leaf, Instagram, Facebook, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#inicio" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display text-xl font-semibold">
                Medicina Viva
              </span>
            </a>
            <p className="text-background/70 max-w-md mb-6">
              Pastelería saludable artesanal. Sin azúcar, sin gluten, sin refinados, 100% vegana. 
              Porque la comida es medicina.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Sin Azúcar", "Sin Gluten", "Vegano", "Sin Refinados"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-background/10 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2">
              {[
                { href: "#catalogo", label: "Catálogo" },
                { href: "#beneficios", label: "Apto Para" },
                { href: "#ingredientes", label: "Ingredientes" },
                { href: "#nosotros", label: "Nosotros" },
                { href: "#delivery", label: "Delivery" },
                { href: "#contacto", label: "Contacto" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-semibold mb-4">Síguenos</h4>
            <div className="space-y-3">
              <a
                href="https://instagram.com/somosmedicinaviva"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-4 py-3 bg-background/10 rounded-xl hover:bg-background/20 transition-colors group w-full"
              >
                <Instagram className="w-5 h-5 group-hover:text-primary transition-colors" />
                <span className="text-sm">@somosmedicinaviva</span>
              </a>
              <a
                href="https://www.facebook.com/somosmedicinaviva?locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-4 py-3 bg-background/10 rounded-xl hover:bg-background/20 transition-colors group w-full"
              >
                <Facebook className="w-5 h-5 group-hover:text-primary transition-colors" />
                <span className="text-sm">Somos Medicina Viva</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60">
            © {currentYear} Medicina Viva. Todos los derechos reservados.
          </p>
          <p className="text-sm text-background/60 flex items-center gap-1">
            Hecho con <Heart className="w-4 h-4 text-primary fill-primary" /> en Chile
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

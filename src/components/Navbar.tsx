import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#beneficios", label: "Apto Para" },
  { href: "#ingredientes", label: "Ingredientes" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#delivery", label: "Delivery" },
  { href: "#puntos-venta", label: "Puntos de Venta" },
  { href: "#contacto", label: "Contacto" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    window.open("https://wa.me/56978738705?text=Hola!%20Me%20interesa%20hacer%20un%20pedido", "_blank");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-3 group">
            <img 
              src="/imagen/logoMedicinaVida.png" 
              alt="Medicina Viva Logo" 
              className="w-12 h-12 md:w-14 md:h-14 object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-display text-xl font-semibold text-foreground">
              Medicina Viva
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="whatsapp" size="sm" onClick={handleWhatsApp}>
              Hacer Pedido
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 px-4">
                <Button variant="whatsapp" className="w-full" onClick={handleWhatsApp}>
                  Hacer Pedido por WhatsApp
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

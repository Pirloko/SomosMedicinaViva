import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import Delivery from "@/components/Delivery";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Catalog />
      <Delivery />
      <Footer />
    </main>
  );
};

export default Index;

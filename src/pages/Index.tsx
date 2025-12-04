import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import Benefits from "@/components/Benefits";
import Ingredients from "@/components/Ingredients";
import About from "@/components/About";
import Delivery from "@/components/Delivery";
import PickupPoints from "@/components/PickupPoints";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Catalog />
      <Benefits />
      <Ingredients />
      <About />
      <Delivery />
      <PickupPoints />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;

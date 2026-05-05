import { Navbar } from "@/components/kuphi/Navbar";
import { Hero } from "@/components/kuphi/Hero";
import { About } from "@/components/kuphi/About";
import { Menu } from "@/components/kuphi/Menu";
import { Gallery } from "@/components/kuphi/Gallery";
import { Reviews } from "@/components/kuphi/Reviews";
import { Hours } from "@/components/kuphi/Hours";
import { Visit } from "@/components/kuphi/Visit";
import { Footer } from "@/components/kuphi/Footer";
import { WhatsAppFab } from "@/components/kuphi/WhatsAppFab";
import { ScrollProgress } from "@/components/kuphi/ScrollProgress";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Kampus Kuphi — Warkop View Sawah & Sunset di Medan";
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
      return m;
    })();
    meta.setAttribute(
      "content",
      "Kampus Kuphi — kedai kopi cozy di Padang Bulan, Medan. View sawah, sunset terbaik, harga ramah mulai Rp 25rb. Buka tiap hari sampai 01.00."
    );
  }, []);

  return (
    <main>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <Menu />
      <Gallery />
      <Reviews />
      <Hours />
      <Visit />
      <Footer />
      <WhatsAppFab />
    </main>
  );
};

export default Index;

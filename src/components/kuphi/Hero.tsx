import { Star, MapPin, Clock } from "lucide-react";
import { useParallax } from "@/hooks/use-parallax";
import { useRef, useEffect, useState } from "react";

export const Hero = () => {
  const sunRef = useParallax<HTMLDivElement>(0.15);
  const glowRef = useParallax<HTMLDivElement>(0.08);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden bg-gradient-sky grain"
    >
      {/* Sun with parallax */}
      <div 
        ref={sunRef}
        className="absolute left-1/2 top-[28%] -translate-x-1/2 w-[420px] h-[420px] md:w-[560px] md:h-[560px] rounded-full bg-gradient-sunset shadow-glow animate-sun-rise" 
      />
      <div 
        ref={glowRef}
        className="absolute left-1/2 top-[28%] -translate-x-1/2 w-[600px] h-[600px] md:w-[820px] md:h-[820px] rounded-full bg-accent/20 blur-3xl animate-float-slow" 
      />

      {/* Paddy field silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-[34vh] bg-gradient-to-t from-coffee-dark via-coffee to-transparent" />
      <svg
        className="absolute bottom-[28vh] left-0 right-0 w-full h-24 text-paddy"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,80 C240,40 480,100 720,70 C960,40 1200,90 1440,60 L1440,120 L0,120 Z" />
      </svg>

      <div className="relative container pt-32 md:pt-40 pb-24 md:pb-32 min-h-screen flex flex-col">
        <div className="max-w-3xl mx-auto text-center animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/40 backdrop-blur-md border border-background/30 text-coffee-dark text-xs md:text-sm font-medium animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Buka sekarang · Tutup pukul 01.00
          </span>

          <h1 className="mt-6 font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-coffee-dark leading-[0.95] animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Ngopi sambil
            <br />
            <span className="italic text-gradient-sunset">menunggu senja</span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-coffee max-w-xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '0.3s' }}>
            Warkop dengan view sawah hijau dan langit jingga di Padang Bulan, Medan.
            Tempat nongkrong paling cozy buat sore yang tak terburu-buru.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#menu"
              className="px-7 py-3.5 rounded-full bg-coffee-dark text-primary-foreground font-semibold shadow-warm hover:scale-105 transition-transform duration-300 animate-fade-up hover:shadow-lg active:scale-95" 
              style={{ animationDelay: '0.4s' }}
            >
              Lihat Menu
            </a>
            <a
              href="#kunjungi"
              className="px-7 py-3.5 rounded-full bg-background/50 backdrop-blur-md border border-coffee-dark/20 text-coffee-dark font-semibold hover:bg-background/80 transition-all duration-300 animate-fade-up hover:border-coffee-dark/40 hover:shadow-soft active:scale-95" 
              style={{ animationDelay: '0.5s' }}
            >
              Cara ke Sini
            </a>
          </div>
        </div>

        {/* Quick stats card */}
        <div className="mt-auto pt-16" ref={statsRef}>
          <div className={`mx-auto max-w-3xl grid grid-cols-3 gap-px bg-coffee-dark/15 rounded-2xl overflow-hidden backdrop-blur-md border border-background/40 shadow-soft transition-all duration-700 ${
            statsVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
             {[
              { icon: Star, label: "Rating Google", value: "4,5", sub: "145 ulasan" },
              { icon: Clock, label: "Jam paling rame", value: "16–22", sub: "sore – malam" },
              { icon: MapPin, label: "Lokasi", value: "Medan", sub: "Padang Bulan" },
            ].map((s, idx) => (
              <div
                key={s.label}
                className="bg-background/70 backdrop-blur-md p-4 md:p-6 text-center transition-all duration-300 hover:bg-background/90 hover:shadow-warm group cursor-default"
                style={{
                  transform: statsVisible ? 'translateY(0)' : 'translateY(16px)',
                  opacity: statsVisible ? 1 : 0,
                  transitionDelay: statsVisible ? `${idx * 100}ms` : '0ms',
                }}
              >
                <s.icon className="w-5 h-5 mx-auto text-primary transition-transform duration-300 group-hover:scale-110" />
                <div className="mt-2 font-display font-black text-2xl md:text-3xl text-coffee-dark transition-colors duration-300 group-hover:text-primary">
                  {s.value}
                </div>
                <div className="text-[11px] md:text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  {s.label}
                </div>
                <div className="text-xs text-coffee mt-0.5 transition-colors duration-300 group-hover:text-primary/70">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

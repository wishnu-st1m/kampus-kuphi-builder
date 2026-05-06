import { Star, MapPin, Clock } from "lucide-react";
import { Reveal } from "./Reveal";

export const Hero = () => {
  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden bg-gradient-sky grain"
    >
      {/* Sun */}
      <div className="absolute left-1/2 top-[28%] -translate-x-1/2 w-[420px] h-[420px] md:w-[560px] md:h-[560px] rounded-full bg-gradient-sunset shadow-glow animate-sun-rise" />
      <div className="absolute left-1/2 top-[28%] -translate-x-1/2 w-[600px] h-[600px] md:w-[820px] md:h-[820px] rounded-full bg-accent/20 blur-3xl" />

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
        <div className="max-w-3xl mx-auto text-center">
          <Reveal variant="fade">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/40 backdrop-blur-md border border-background/30 text-coffee-dark text-xs md:text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Buka sekarang · Tutup pukul 01.00
            </span>
          </Reveal>

          <Reveal variant="up" delay={120}>
            <h1 className="mt-6 font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-coffee-dark leading-[0.95]">
              Ngopi sambil
              <br />
              <span className="italic text-gradient-sunset">menunggu senja</span>
            </h1>
          </Reveal>

          <Reveal variant="up" delay={260}>
            <p className="mt-6 text-base md:text-lg text-coffee max-w-xl mx-auto leading-relaxed">
              Warkop dengan view sawah hijau dan langit jingga di Padang Bulan, Medan.
              Tempat nongkrong paling cozy buat sore yang tak terburu-buru.
            </p>
          </Reveal>

          <Reveal variant="up" delay={380}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#menu"
                className="px-7 py-3.5 rounded-full bg-coffee-dark text-primary-foreground font-semibold shadow-warm hover:scale-105 transition-transform"
              >
                Lihat Menu
              </a>
              <a
                href="#kunjungi"
                className="px-7 py-3.5 rounded-full bg-background/50 backdrop-blur-md border border-coffee-dark/20 text-coffee-dark font-semibold hover:bg-background/80 transition-colors"
              >
                Cara ke Sini
              </a>
            </div>
          </Reveal>
        </div>

        {/* Quick stats card */}
        <div className="mt-auto pt-16">
          <div className="mx-auto max-w-3xl grid grid-cols-3 gap-px bg-coffee-dark/15 rounded-2xl overflow-hidden backdrop-blur-md border border-background/40 shadow-soft">
            {[
              { icon: Star, label: "Rating Google", value: "4,5", sub: "145 ulasan" },
              { icon: Clock, label: "Jam paling rame", value: "16–22", sub: "sore – malam" },
              { icon: MapPin, label: "Lokasi", value: "Medan", sub: "Padang Bulan" },
            ].map((s, i) => (
              <Reveal
                key={s.label}
                variant="up"
                delay={i * 120}
                className="bg-background/70 backdrop-blur-md p-4 md:p-6 text-center"
              >
                <s.icon className="w-5 h-5 mx-auto text-primary" />
                <div className="mt-2 font-display font-black text-2xl md:text-3xl text-coffee-dark">
                  {s.value}
                </div>
                <div className="text-[11px] md:text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  {s.label}
                </div>
                <div className="text-xs text-coffee mt-0.5">{s.sub}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

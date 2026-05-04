import { useEffect, useRef, useState } from "react";
import { Star, MapPin, Clock } from "lucide-react";
import { Hero3DScene } from "./Hero3DScene";

/**
 * Scroll-triggered storytelling Hero.
 * 5 stages: Bean -> Grind -> Brew (espresso machine) -> Pour -> Cup ready
 * The scene is pinned (sticky) while user scrolls; progress drives all SVG animation.
 */

const STAGES = 5; // 0..4
const SCROLL_HEIGHT_VH = 500; // total scrollable height of the journey (vh)

const stageContent = [
  {
    eyebrow: "01 — Asal Mula",
    title: "Biji kopi pilihan",
    desc: "Dari petani Sumatera. Dipanen matang, dijemur sampai aromanya terkunci.",
  },
  {
    eyebrow: "02 — Digiling",
    title: "Digiling segar",
    desc: "Setiap pesanan, biji digiling on-the-spot. Aroma puncak, rasa maksimal.",
  },
  {
    eyebrow: "03 — Diseduh",
    title: "Mesin espresso",
    desc: "Tekanan 9 bar mengekstrak crema keemasan dari bubuk yang baru digiling.",
  },
  {
    eyebrow: "04 — Dituang",
    title: "Aliran emas hitam",
    desc: "Espresso mengalir lambat ke cangkir — momen terbaik untuk menghirup wanginya.",
  },
  {
    eyebrow: "05 — Sajikan",
    title: "Secangkir Kampus Kuphi",
    desc: "Dinikmati di Padang Bulan, ditemani sawah hijau dan langit jingga.",
  },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const Hero = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0..1 across whole pinned section

  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = clamp(-rect.top / total, 0, 1);
      setProgress(scrolled);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active stage index (0..STAGES-1)
  const stageFloat = progress * (STAGES - 1);
  const activeStage = Math.min(STAGES - 1, Math.round(stageFloat));

  return (
    <>
    <section
      id="top"
      ref={wrapperRef}
      className="relative bg-gradient-sky"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
    >
      {/* Pinned viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden grain">
        {/* Sun & glow background */}
        <div
          className="absolute left-1/2 top-[18%] -translate-x-1/2 w-[520px] h-[520px] md:w-[680px] md:h-[680px] rounded-full bg-gradient-sunset shadow-glow transition-transform duration-700"
          style={{
            transform: `translate(-50%, ${lerp(0, -60, progress)}px) scale(${lerp(1, 1.15, progress)})`,
            opacity: lerp(0.95, 0.8, progress),
          }}
        />
        <div className="absolute left-1/2 top-[18%] -translate-x-1/2 w-[760px] h-[760px] md:w-[980px] md:h-[980px] rounded-full bg-accent/20 blur-3xl pointer-events-none" />

        {/* Paddy silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-[28vh] bg-gradient-to-t from-coffee-dark via-coffee to-transparent" />
        <svg
          className="absolute bottom-[24vh] left-0 right-0 w-full h-20 text-paddy"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,80 C240,40 480,100 720,70 C960,40 1200,90 1440,60 L1440,120 L0,120 Z" />
        </svg>

        {/* Top bar: progress + eyebrow */}
        <div className="absolute top-20 md:top-24 left-0 right-0 z-20">
          <div className="container flex items-center gap-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/50 backdrop-blur-md border border-background/40 text-coffee-dark text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Buka sekarang · Tutup pukul 01.00
            </span>
            <div className="hidden md:flex flex-1 items-center gap-2">
              {stageContent.map((_, i) => (
                <div
                  key={i}
                  className="h-0.5 flex-1 rounded-full bg-coffee-dark/15 overflow-hidden"
                >
                  <div
                    className="h-full bg-coffee-dark transition-all duration-300"
                    style={{
                      width: `${clamp(progress * (STAGES - 1) - i + 1) * 100}%`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center scene — 3D coffee journey filling the whole viewport */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full pointer-events-auto">
            <Hero3DScene progress={progress} />
          </div>
        </div>

        {/* Text panel — stage 1-4 mentok bawah, stage 5 naik agar CTA terlihat */}
        <div
          className="absolute left-0 right-0 z-20 transition-[bottom] duration-500"
          style={{ bottom: activeStage === STAGES - 1 ? "12vh" : "3vh" }}
        >
          <div className="container">
            <div className="relative max-w-sm md:max-w-md min-h-[200px] md:min-h-[190px]">
              {stageContent.map((c, i) => {
                const isActive = i === activeStage;
                const isLast = i === STAGES - 1;
                return (
                  <div
                    key={i}
                    className="absolute inset-x-0 top-0 transition-all duration-500"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: `translateY(${isActive ? 0 : 16}px)`,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <div className="inline-block max-w-md rounded-xl bg-background/70 backdrop-blur-md border border-background/50 shadow-soft px-4 py-3 md:px-5 md:py-4">
                      <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-coffee font-semibold">
                        {c.eyebrow}
                      </span>
                      <h1 className="mt-1.5 font-display font-black text-2xl sm:text-3xl md:text-4xl text-coffee-dark leading-[1]">
                        {c.title.split(" ").slice(0, -1).join(" ")}{" "}
                        <span className="italic text-gradient-sunset">
                          {c.title.split(" ").slice(-1)}
                        </span>
                      </h1>
                      <p className="mt-2 text-xs md:text-sm text-coffee-dark/90 max-w-sm leading-relaxed">
                        {c.desc}
                      </p>

                      {isLast && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <a
                            href="#menu"
                            className="px-4 py-2 rounded-full bg-coffee-dark text-primary-foreground text-sm font-semibold shadow-warm hover:scale-105 transition-transform"
                          >
                            Lihat Menu
                          </a>
                          <a
                            href="#kunjungi"
                            className="px-4 py-2 rounded-full bg-background/80 border border-coffee-dark/20 text-coffee-dark text-sm font-semibold hover:bg-background transition-colors"
                          >
                            Cara ke Sini
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll hint (only at start) */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-coffee-dark/70 text-xs uppercase tracking-[0.3em] transition-opacity"
          style={{ opacity: progress < 0.05 ? 1 : 0 }}
        >
          ↓ Scroll
        </div>
      </div>
    </section>

    {/* Quick stats — sebagai section sendiri di bawah hero */}
    <QuickStats />
    </>
  );
};

const QuickStats = () => (
  <section className="bg-background py-10 md:py-14 border-y border-coffee-dark/10">
    <div className="container">
      <div className="mx-auto max-w-3xl grid grid-cols-3 gap-px bg-coffee-dark/10 rounded-2xl overflow-hidden border border-coffee-dark/10 shadow-soft">
        {[
          { icon: Star, label: "Rating Google", value: "4,5", sub: "145 ulasan" },
          { icon: Clock, label: "Jam paling rame", value: "16–22", sub: "sore – malam" },
          { icon: MapPin, label: "Lokasi", value: "Medan", sub: "Padang Bulan" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card p-4 md:p-6 text-center"
          >
            <s.icon className="w-5 h-5 mx-auto text-primary" />
            <div className="mt-2 font-display font-black text-2xl md:text-3xl text-coffee-dark">
              {s.value}
            </div>
            <div className="text-[11px] md:text-xs uppercase tracking-wider text-muted-foreground mt-1">
              {s.label}
            </div>
            <div className="text-xs text-coffee mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);


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

        {/* Center scene — 3D clay coffee journey */}
        <div className="absolute inset-x-0 top-[12vh] md:top-[8vh] bottom-[42vh] md:bottom-[38vh] flex items-center justify-center pointer-events-none">
          <div className="relative h-full aspect-square max-h-full max-w-[90vw] mx-auto pointer-events-auto">
            <Hero3DScene progress={progress} />
          </div>
        </div>

        {/* Text panel */}
        <div className="absolute left-0 right-0 bottom-[22vh] md:bottom-[20vh] z-20">
          <div className="container">
            <div className="relative max-w-xl min-h-[260px] md:min-h-[240px]">
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
                    <div className="inline-block max-w-xl rounded-2xl bg-background/75 backdrop-blur-md border border-background/50 shadow-soft px-5 py-4 md:px-6 md:py-5">
                      <span className="text-xs uppercase tracking-[0.2em] text-coffee font-semibold">
                        {c.eyebrow}
                      </span>
                      <h1 className="mt-2 font-display font-black text-4xl sm:text-5xl md:text-6xl text-coffee-dark leading-[0.95]">
                        {c.title.split(" ").slice(0, -1).join(" ")}{" "}
                        <span className="italic text-gradient-sunset">
                          {c.title.split(" ").slice(-1)}
                        </span>
                      </h1>
                      <p className="mt-3 text-sm md:text-base text-coffee-dark/90 max-w-md leading-relaxed font-medium">
                        {c.desc}
                      </p>

                      {isLast && (
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                          <a
                            href="#menu"
                            className="px-6 py-3 rounded-full bg-coffee-dark text-primary-foreground font-semibold shadow-warm hover:scale-105 transition-transform"
                          >
                            Lihat Menu
                          </a>
                          <a
                            href="#kunjungi"
                            className="px-6 py-3 rounded-full bg-background/80 border border-coffee-dark/20 text-coffee-dark font-semibold hover:bg-background transition-colors"
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


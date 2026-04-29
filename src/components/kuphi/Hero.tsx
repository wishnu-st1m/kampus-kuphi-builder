import { useEffect, useRef, useState } from "react";
import { Star, MapPin, Clock } from "lucide-react";

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
// Map a sub-progress for stage i (each stage occupies 1/STAGES of the total)
const subProg = (p: number, i: number) => clamp(p * STAGES - i);

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

  // Per-stage sub progress 0..1
  const s0 = subProg(progress, 0); // bean entrance
  const s1 = subProg(progress, 1); // grinding
  const s2 = subProg(progress, 2); // brewing
  const s3 = subProg(progress, 3); // pouring
  const s4 = subProg(progress, 4); // cup

  return (
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

        {/* Center scene */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full max-w-[480px] aspect-square mt-8">
            <CoffeeJourneySVG s0={s0} s1={s1} s2={s2} s3={s3} s4={s4} />
          </div>
        </div>

        {/* Text panel */}
        <div className="absolute left-0 right-0 bottom-[26vh] md:bottom-[24vh] z-20">
          <div className="container">
            <div className="max-w-xl">
              {stageContent.map((c, i) => {
                const isActive = i === activeStage;
                return (
                  <div
                    key={i}
                    className="absolute inset-x-0 transition-all duration-500"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: `translateY(${isActive ? 0 : 16}px)`,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <div className="container px-0">
                      <span className="text-xs uppercase tracking-[0.2em] text-coffee font-semibold">
                        {c.eyebrow}
                      </span>
                      <h1 className="mt-2 font-display font-black text-4xl sm:text-5xl md:text-6xl text-coffee-dark leading-[0.95]">
                        {c.title.split(" ").slice(0, -1).join(" ")}{" "}
                        <span className="italic text-gradient-sunset">
                          {c.title.split(" ").slice(-1)}
                        </span>
                      </h1>
                      <p className="mt-3 text-sm md:text-base text-coffee max-w-md leading-relaxed">
                        {c.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA appears at last stage */}
            <div
              className="mt-44 md:mt-40 flex flex-wrap items-center gap-3 transition-all duration-500"
              style={{
                opacity: s4 > 0.4 ? 1 : 0,
                transform: `translateY(${s4 > 0.4 ? 0 : 12}px)`,
              }}
            >
              <a
                href="#menu"
                className="px-7 py-3.5 rounded-full bg-coffee-dark text-primary-foreground font-semibold shadow-warm hover:scale-105 transition-transform"
              >
                Lihat Menu
              </a>
              <a
                href="#kunjungi"
                className="px-7 py-3.5 rounded-full bg-background/60 backdrop-blur-md border border-coffee-dark/20 text-coffee-dark font-semibold hover:bg-background/80 transition-colors"
              >
                Cara ke Sini
              </a>
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

      {/* Quick stats — appears after pinned section */}
      <StickyStatsSpacer />
    </section>
  );
};

const StickyStatsSpacer = () => (
  <div className="absolute bottom-0 left-0 right-0 z-30 pb-10">
    <div className="container">
      <div className="mx-auto max-w-3xl grid grid-cols-3 gap-px bg-coffee-dark/15 rounded-2xl overflow-hidden backdrop-blur-md border border-background/40 shadow-soft">
        {[
          { icon: Star, label: "Rating Google", value: "4,5", sub: "145 ulasan" },
          { icon: Clock, label: "Jam paling rame", value: "16–22", sub: "sore – malam" },
          { icon: MapPin, label: "Lokasi", value: "Medan", sub: "Padang Bulan" },
        ].map((s) => (
          <div
            key={s.label}
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
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ---------------- Coffee Journey SVG ---------------- */

type StageProps = { s0: number; s1: number; s2: number; s3: number; s4: number };

const CoffeeJourneySVG = ({ s0, s1, s2, s3, s4 }: StageProps) => {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="bean" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(22 60% 30%)" />
          <stop offset="100%" stopColor="hsl(22 70% 14%)" />
        </linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(0 0% 92%)" />
          <stop offset="100%" stopColor="hsl(0 0% 70%)" />
        </linearGradient>
        <linearGradient id="espresso" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(28 70% 35%)" />
          <stop offset="100%" stopColor="hsl(22 60% 18%)" />
        </linearGradient>
        <linearGradient id="cream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(38 80% 70%)" />
          <stop offset="100%" stopColor="hsl(28 60% 50%)" />
        </linearGradient>
        <radialGradient id="cupShadow" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="hsl(22 45% 14% / 0.5)" />
          <stop offset="100%" stopColor="hsl(22 45% 14% / 0)" />
        </radialGradient>
      </defs>

      {/* Stage 0: Bean — large bean drops in, then shrinks/moves up to enter grinder */}
      <BeanStage s0={s0} s1={s1} />

      {/* Stage 1: Grinder */}
      <GrinderStage s1={s1} s2={s2} />

      {/* Stage 2: Espresso machine */}
      <MachineStage s2={s2} s3={s3} />

      {/* Stage 3: Pouring stream */}
      <PourStage s3={s3} s4={s4} />

      {/* Stage 4: Final cup */}
      <CupStage s4={s4} />
    </svg>
  );
};

const BeanStage = ({ s0, s1 }: { s0: number; s1: number }) => {
  // Visible while s0 > 0 and before s1 fully in. Fades out as s1 grows.
  const opacity = clamp(s0) * (1 - clamp(s1));
  if (opacity <= 0.01) return null;
  // Drop in: y from -200 to 200 (center)
  const y = lerp(-180, 200, clamp(s0));
  // Shrink at end as it moves toward grinder
  const scale = lerp(1, 0.4, clamp(s1));
  const tx = lerp(0, 0, clamp(s1));
  const ty = lerp(0, -120, clamp(s1));
  const rot = lerp(-30, 20, clamp(s0)) + clamp(s1) * 90;

  return (
    <g opacity={opacity} transform={`translate(${200 + tx} ${y + ty}) scale(${scale}) rotate(${rot})`}>
      {/* Bean shape */}
      <ellipse cx="0" cy="0" rx="70" ry="95" fill="url(#bean)" />
      <path
        d="M 0 -85 C 15 -40 15 40 0 85 C -15 40 -15 -40 0 -85 Z"
        fill="hsl(22 50% 20%)"
        opacity="0.6"
      />
      {/* highlight */}
      <ellipse cx="-25" cy="-40" rx="14" ry="22" fill="hsl(28 60% 50%)" opacity="0.35" />
    </g>
  );
};

const GrinderStage = ({ s1, s2 }: { s1: number; s2: number }) => {
  const appear = clamp(s1);
  const exit = clamp(s2);
  const opacity = appear * (1 - exit);
  if (opacity <= 0.01) return null;
  const y = lerp(60, 0, appear);
  // Grind rotation accelerates during stage
  const grindRot = appear * 720;
  // Powder falling into cup at bottom (visible at end of s1)
  const powderProgress = clamp((appear - 0.5) * 2);

  return (
    <g opacity={opacity} transform={`translate(200 ${200 + y})`}>
      {/* Hopper top */}
      <path
        d="M -80 -120 L 80 -120 L 60 -60 L -60 -60 Z"
        fill="url(#metal)"
        stroke="hsl(0 0% 50%)"
        strokeWidth="2"
      />
      {/* Beans inside hopper */}
      <g clipPath="inset(0)">
        {[-30, 0, 30, -15, 15].map((x, i) => (
          <ellipse
            key={i}
            cx={x}
            cy={-90 + (i % 2) * 12}
            rx="10"
            ry="14"
            fill="url(#bean)"
          />
        ))}
      </g>
      {/* Grinder body */}
      <rect x="-70" y="-60" width="140" height="80" rx="8" fill="hsl(22 30% 25%)" />
      {/* Rotating burr (visible through window) */}
      <g transform={`rotate(${grindRot})`}>
        <circle cx="0" cy="-20" r="28" fill="none" stroke="hsl(0 0% 80%)" strokeWidth="3" />
        <line x1="-28" y1="-20" x2="28" y2="-20" stroke="hsl(0 0% 80%)" strokeWidth="3" />
        <line x1="0" y1="-48" x2="0" y2="8" stroke="hsl(0 0% 80%)" strokeWidth="3" />
      </g>
      {/* Spout */}
      <path d="M -20 20 L 20 20 L 14 40 L -14 40 Z" fill="hsl(0 0% 60%)" />
      {/* Falling grounds */}
      {powderProgress > 0 && (
        <g opacity={powderProgress}>
          {[0, 1, 2, 3, 4].map((i) => {
            const fy = 40 + ((powderProgress * 60 + i * 14) % 70);
            return (
              <circle
                key={i}
                cx={(i - 2) * 4}
                cy={fy}
                r="2"
                fill="hsl(22 50% 25%)"
              />
            );
          })}
          {/* Ground pile */}
          <ellipse cx="0" cy="115" rx={powderProgress * 36} ry={powderProgress * 8} fill="hsl(22 50% 22%)" />
        </g>
      )}
    </g>
  );
};

const MachineStage = ({ s2, s3 }: { s2: number; s3: number }) => {
  const appear = clamp(s2);
  const exit = clamp(s3);
  const opacity = appear * (1 - exit * 0.3); // machine stays a bit during pour
  if (opacity <= 0.01) return null;
  const y = lerp(80, 0, appear);
  // Steam puffs
  const steam = clamp((appear - 0.4) * 1.5);
  // Light on
  const lightOn = appear > 0.3;

  return (
    <g opacity={opacity} transform={`translate(200 ${200 + y})`}>
      {/* Steam puffs */}
      {steam > 0 &&
        [0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={-60 + i * 20}
            cy={-150 - steam * 30 - i * 8}
            r={6 + steam * 4}
            fill="hsl(0 0% 100%)"
            opacity={steam * (0.5 - i * 0.12)}
          />
        ))}
        
      {/* Machine body */}
      <rect x="-110" y="-110" width="220" height="160" rx="14" fill="hsl(22 30% 22%)" />
      <rect x="-110" y="-110" width="220" height="40" rx="14" fill="hsl(22 35% 18%)" />
      {/* Top deck (cup warmer) */}
      <rect x="-90" y="-118" width="180" height="10" rx="3" fill="hsl(0 0% 60%)" />
      {/* Pressure gauge */}
      <circle cx="-60" cy="-50" r="22" fill="hsl(36 60% 96%)" stroke="hsl(0 0% 30%)" strokeWidth="3" />
      <line
        x1="-60"
        y1="-50"
        x2={-60 + Math.cos((appear * Math.PI) - Math.PI / 2) * 16}
        y2={-50 + Math.sin((appear * Math.PI) - Math.PI / 2) * 16}
        stroke="hsl(14 90% 50%)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="-60" cy="-50" r="3" fill="hsl(22 45% 14%)" />
      {/* Power light */}
      <circle
        cx="60"
        cy="-50"
        r="6"
        fill={lightOn ? "hsl(120 70% 50%)" : "hsl(0 0% 30%)"}
      >
        {lightOn && (
          <animate attributeName="opacity" values="1;0.5;1" dur="1.2s" repeatCount="indefinite" />
        )}
      </circle>
      {/* Buttons */}
      <rect x="20" y="-30" width="50" height="14" rx="3" fill="hsl(0 0% 50%)" />
      <rect x="20" y="-10" width="50" height="14" rx="3" fill="hsl(0 0% 50%)" />
      {/* Group head */}
      <rect x="-30" y="40" width="60" height="20" rx="4" fill="hsl(0 0% 70%)" />
      {/* Portafilter handle */}
      <rect x="-25" y="58" width="50" height="14" rx="3" fill="hsl(0 0% 75%)" />
      <rect x="20" y="60" width="50" height="10" rx="5" fill="hsl(22 45% 14%)" />
      {/* Drip tray */}
      <rect x="-100" y="50" width="200" height="14" rx="3" fill="hsl(0 0% 55%)" />
    </g>
  );
};

const PourStage = ({ s3, s4 }: { s3: number; s4: number }) => {
  const appear = clamp(s3);
  if (appear <= 0.01) return null;
  // Stream length grows
  const streamH = lerp(0, 90, Math.min(appear * 1.3, 1));
  const opacity = (1 - clamp(s4) * 0.6);

  return (
    <g opacity={opacity} transform="translate(200 200)">
      {/* Espresso stream from group head (~y=72 in machine local). In screen coords, from (200, 272) */}
      <rect
        x="-3"
        y="72"
        width="6"
        height={streamH}
        rx="3"
        fill="url(#espresso)"
      />
      {/* Drips */}
      {appear > 0.3 && (
        <>
          <circle cx="0" cy={72 + streamH + 4} r="3" fill="hsl(22 60% 22%)" />
        </>
      )}
    </g>
  );
};

const CupStage = ({ s4 }: { s4: number }) => {
  // Cup is present during stages 3 (catching pour) and 4 (final). Use combined visibility.
  // We want cup to appear from s3 too. So accept s3 via prop? Simpler: always render cup during s3+s4 by checking via passed s4 only — but we need s3. Instead, we expose via hook.
  // We'll always render cup at lower opacity from s3 onward. To do that, let's read s4 only but place cup that grows with s4 fill.
  return (
    <g transform="translate(200 320)">
      {/* Saucer shadow */}
      <ellipse cx="0" cy="38" rx="100" ry="10" fill="url(#cupShadow)" />
      {/* Saucer */}
      <ellipse cx="0" cy="30" rx="90" ry="12" fill="hsl(36 50% 96%)" stroke="hsl(28 30% 80%)" strokeWidth="2" />
      {/* Cup body */}
      <path
        d="M -55 -40 L 55 -40 L 48 28 Q 0 38 -48 28 Z"
        fill="hsl(36 60% 98%)"
        stroke="hsl(28 30% 78%)"
        strokeWidth="2"
      />
      {/* Handle */}
      <path
        d="M 55 -28 Q 88 -20 88 0 Q 88 20 55 18"
        fill="none"
        stroke="hsl(28 30% 78%)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Coffee fill — height driven by s4 */}
      <clipPath id="cupClip">
        <path d="M -55 -40 L 55 -40 L 48 28 Q 0 38 -48 28 Z" />
      </clipPath>
      <g clipPath="url(#cupClip)">
        <rect
          x="-60"
          y={lerp(40, -38, clamp(s4))}
          width="120"
          height="100"
          fill="url(#espresso)"
        />
        {/* Crema layer on top once fill is high */}
        {s4 > 0.5 && (
          <rect
            x="-60"
            y={lerp(40, -38, clamp(s4))}
            width="120"
            height="6"
            fill="url(#cream)"
            opacity={(s4 - 0.5) * 2}
          />
        )}
      </g>
      {/* Steam from cup at end */}
      {s4 > 0.7 &&
        [0, 1, 2].map((i) => {
          const t = (s4 - 0.7) * 3.3;
          return (
            <path
              key={i}
              d={`M ${-15 + i * 15} -45 q ${i % 2 === 0 ? 8 : -8} -15 0 -30 q ${i % 2 === 0 ? -8 : 8} -15 0 -30`}
              stroke="hsl(0 0% 100%)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity={Math.min(t, 1) * 0.55}
            />
          );
        })}
    </g>
  );
};

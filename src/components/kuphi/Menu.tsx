import { Coffee, UtensilsCrossed, Soup } from "lucide-react";
import { Reveal } from "./Reveal";

const menu = [
  {
    icon: Coffee,
    name: "Kopi & Minuman",
    desc: "Aneka kopi hangat dan dingin khas warkop Medan.",
    tag: "Favorit sore hari",
  },
  {
    icon: Soup,
    name: "Bakso Sapi",
    desc: "Kuah gurih, daging sapi terasa. Kata pelanggan: 'beneran kerasa daging sapi'.",
    tag: "Recommended",
  },
  {
    icon: UtensilsCrossed,
    name: "Kentang Goreng",
    desc: "Camilan klasik buat nemenin ngobrol panjang sambil nunggu sunset.",
    tag: "Camilan hits",
  },
];

export const Menu = () => {
  return (
    <section id="menu" className="relative py-24 md:py-32 bg-gradient-coffee text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 grain opacity-50" />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-sunset opacity-20 blur-3xl rounded-full" />

      <div className="container relative">
        <Reveal variant="up" className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
            Menu Andalan
          </span>
          <h2 className="mt-3 font-display font-black text-4xl md:text-5xl lg:text-6xl">
            Yang biasa <span className="italic text-gradient-sunset">dipesan</span>
          </h2>
          <p className="mt-5 text-primary-foreground/70 text-lg">
            Harga ramah mahasiswa — Rp 25.000 sampai Rp 50.000 per orang.
          </p>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {menu.map((m, i) => (
            <Reveal
              key={m.name}
              variant="up"
              delay={i * 140}
              className="group relative p-8 rounded-3xl bg-background/5 backdrop-blur-sm border border-background/10 hover:border-accent/50 transition-colors hover:bg-background/10"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-sunset flex items-center justify-center shadow-warm group-hover:rotate-6 transition-transform">
                <m.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="mt-6 font-display font-bold text-2xl">{m.name}</h3>
              <p className="mt-2 text-primary-foreground/70 leading-relaxed">{m.desc}</p>
              <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-wider text-accent">
                {m.tag}
              </span>
            </Reveal>
          ))}
        </div>

        <p className="mt-12 text-center text-primary-foreground/60 text-sm">
          * Daftar menu lengkap tersedia di kedai. Hubungi kami untuk info terbaru.
        </p>
      </div>
    </section>
  );
};

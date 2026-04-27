import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Agita Ermadina",
    role: "Local Guide · 19 ulasan",
    time: "5 bulan lalu",
    text: "Yo! It's warkop (as a Medanese) or coffeeshop. Super comfy, especially the outdoor spot when the sun's setting and the air gets cool. Foods and drinks? All fire, no weak spots.",
    initial: "A",
  },
  {
    name: "Junaidi Usman Lubis",
    role: "Local Guide · 94 ulasan",
    time: "9 bulan lalu",
    text: "Tempat nongkrong yang sempurna, dari makanan hingga suasana outdoor yang cozy terlihat hamparan sawah yang adem dipandang. Bikin betah lama-lama nongkrong di sini, apalagi sore dari jam 4 sampai malam.",
    initial: "J",
  },
  {
    name: "Januar Sinaga",
    role: "2 ulasan · 9 foto",
    time: "9 bulan lalu",
    text: "Kalau tempat nongkrong dengan view terbaik di daerah Abdul Hakim, ya jelas Kampus Kuphi. Di mana lagi kita dapat view sunset, pemandangan sawah, dan udara yang sejuk selain di sini.",
    initial: "J",
  },
];

export const Reviews = () => {
  return (
    <section id="ulasan" className="py-24 md:py-32 bg-muted/40 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-glow opacity-50" />

      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            Ulasan Pelanggan
          </span>
          <h2 className="mt-3 font-display font-black text-4xl md:text-5xl lg:text-6xl text-coffee-dark leading-[1.05]">
            Kata mereka tentang <br />
            <span className="italic text-gradient-sunset">Kampus Kuphi</span>
          </h2>

          <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-background border border-border shadow-soft">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <span className="font-display font-bold text-lg text-coffee-dark">4,5</span>
            <span className="text-sm text-muted-foreground">· 145 ulasan Google</span>
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <article
              key={i}
              className="relative p-7 rounded-3xl bg-card border border-border hover:shadow-warm transition-all hover:-translate-y-1"
            >
              <Quote className="absolute top-5 right-6 w-10 h-10 text-primary/15" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-sunset flex items-center justify-center text-primary-foreground font-display font-bold text-xl shadow-warm">
                  {r.initial}
                </div>
                <div>
                  <div className="font-semibold text-coffee-dark">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-0.5 mt-4">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-accent text-accent" />
                ))}
              </div>
              <p className="mt-3 text-muted-foreground leading-relaxed text-sm">
                "{r.text}"
              </p>
              <div className="mt-4 text-xs text-muted-foreground/70">{r.time}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

import { ImageIcon } from "lucide-react";

const tiles = [
  { label: "View Sawah", className: "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto", gradient: "from-paddy/80 via-paddy/60 to-accent/40" },
  { label: "Sunset Sore", className: "aspect-square", gradient: "from-sunset-1 via-sunset-2 to-sunset-3" },
  { label: "Spot Outdoor", className: "aspect-square", gradient: "from-coffee to-coffee-dark" },
  { label: "Menu Kopi", className: "aspect-square", gradient: "from-accent via-sunset-3 to-sunset-2" },
  { label: "Suasana Malam", className: "aspect-square", gradient: "from-coffee-dark to-sunset-1" },
];

export const Gallery = () => {
  return (
    <section id="galeri" className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
              Galeri
            </span>
            <h2 className="mt-3 font-display font-black text-4xl md:text-5xl lg:text-6xl text-coffee-dark leading-[1.05]">
              Suasana <span className="italic text-gradient-sunset">Kampus Kuphi</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Geser-geser dan rasakan sendiri kenapa pelanggan betah nongkrong berjam-jam di sini.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {tiles.map((t, i) => (
            <div
              key={i}
              className={`relative ${t.className} rounded-2xl overflow-hidden group cursor-pointer shadow-soft`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient}`} />
              <div className="absolute inset-0 grain opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/70 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center text-primary-foreground/60 group-hover:scale-110 transition-transform duration-700">
                <ImageIcon className="w-10 h-10" strokeWidth={1.2} />
              </div>
              <div className="absolute bottom-3 left-4 text-primary-foreground font-display font-semibold text-base md:text-lg drop-shadow-lg">
                {t.label}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground italic">
          Foto asli akan segera ditambahkan oleh pemilik.
        </p>
      </div>
    </section>
  );
};

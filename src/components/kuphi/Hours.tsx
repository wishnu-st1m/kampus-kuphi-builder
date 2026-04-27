// Approximate "popular times" inspired by Google Maps display
const hours = [
  { h: "06", v: 12 },
  { h: "09", v: 22 },
  { h: "12", v: 38 },
  { h: "15", v: 55 },
  { h: "16", v: 72 },
  { h: "18", v: 92 },
  { h: "20", v: 100 },
  { h: "22", v: 78 },
  { h: "00", v: 40 },
];

export const Hours = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            Jam Operasional
          </span>
          <h2 className="mt-3 font-display font-black text-4xl md:text-5xl text-coffee-dark leading-[1.05]">
            Buka tiap hari, <br />
            sampai <span className="italic text-gradient-sunset">dini hari</span>
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Buka</div>
              <div className="font-display font-black text-3xl text-coffee-dark mt-1">
                Setiap Hari
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-sunset text-primary-foreground shadow-warm">
              <div className="text-xs uppercase tracking-wider opacity-80">Tutup</div>
              <div className="font-display font-black text-3xl mt-1">01.00</div>
            </div>
          </div>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
            Datang sore dari pukul 16.00 untuk menikmati golden hour terbaik, atau larut malam
            buat suasana yang lebih syahdu.
          </p>
        </div>

        <div className="p-7 md:p-9 rounded-3xl bg-card border border-border shadow-soft">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="font-display font-bold text-xl text-coffee-dark">Jam Ramai</h3>
            <span className="text-xs text-muted-foreground">Senin · perkiraan</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Paling rame antara pukul 18.00–22.00.
          </p>

          <div className="flex items-end justify-between gap-1.5 h-44">
            {hours.map((b) => (
              <div key={b.h} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-sunset-1 via-sunset-2 to-sunset-3 transition-all hover:opacity-80"
                  style={{ height: `${b.v}%` }}
                  title={`${b.h}:00 — ${b.v}% rame`}
                />
                <span className="text-[10px] md:text-xs font-medium text-muted-foreground">
                  {b.h}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

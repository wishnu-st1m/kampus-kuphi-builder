import { Sunset, Trees, Users } from "lucide-react";

const features = [
  {
    icon: Sunset,
    title: "Spot sunset terbaik",
    desc: "Datang sore dari jam 4, nikmati langit yang berubah jingga keemasan di atas hamparan sawah.",
  },
  {
    icon: Trees,
    title: "Outdoor view sawah",
    desc: "Udara sejuk, pemandangan hijau, dan angin yang adem — bikin betah nongkrong berjam-jam.",
  },
  {
    icon: Users,
    title: "Tempat kumpul kawan",
    desc: "Suasana warkop khas Medan yang santai. Cocok buat ngobrol panjang bareng teman.",
  },
];

export const About = () => {
  return (
    <section id="tentang" className="relative py-24 md:py-32 bg-background overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-glow opacity-60" />

      <div className="container relative grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            Tentang Kami
          </span>
          <h2 className="mt-3 font-display font-black text-4xl md:text-5xl lg:text-6xl text-coffee-dark leading-[1.05]">
            Sebuah warkop kecil <br />
            di balik <span className="italic text-gradient-sunset">hamparan sawah</span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
            Kampus Kuphi adalah kedai kopi sederhana di Jl. Abdul Hakim, Padang Bulan
            Selayang I, Medan. Kami percaya tempat terbaik untuk ngopi adalah yang membuat
            kamu lupa waktu — entah karena pemandangannya, kawan ngobrolnya, atau secangkir
            kopi yang pas di hati.
          </p>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Buka sampai dini hari, harga ramah kantong (Rp 25–50 rb), dan selalu siap jadi
            "kampus kedua" buat ngerjain tugas atau sekadar melepas penat.
          </p>
        </div>

        <div className="grid gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative p-6 md:p-7 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all hover:shadow-warm hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-sunset flex items-center justify-center shadow-warm">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-coffee-dark">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

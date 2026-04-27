import { MapPin, Phone, Navigation, MessageCircle } from "lucide-react";

const ADDRESS = "Jl. Abdul Hakim, Padang Bulan Selayang I, Kec. Medan Selayang, Kota Medan, Sumatera Utara 20155";
const MAPS = "https://www.google.com/maps/search/?api=1&query=Kampus+Kuphi+Jl+Abdul+Hakim+Medan";
const PHONE = "0831-7952-4020";
const WA = "https://wa.me/6283179524020";

export const Visit = () => {
  return (
    <section id="kunjungi" className="relative py-24 md:py-32 bg-gradient-coffee text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 grain opacity-50" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-gradient-sunset opacity-25 blur-3xl rounded-full" />

      <div className="container relative grid lg:grid-cols-5 gap-10 items-center">
        <div className="lg:col-span-2">
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
            Kunjungi Kami
          </span>
          <h2 className="mt-3 font-display font-black text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
            Mampir, kami <br />
            <span className="italic text-gradient-sunset">tunggu</span>
          </h2>

          <div className="mt-8 space-y-5">
            <div className="flex gap-4">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-background/10 border border-background/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-sm uppercase tracking-wider text-primary-foreground/60">Alamat</div>
                <p className="mt-1 leading-relaxed">{ADDRESS}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-background/10 border border-background/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-sm uppercase tracking-wider text-primary-foreground/60">Telepon</div>
                <a href={`tel:${PHONE}`} className="mt-1 block font-display font-bold text-2xl hover:text-accent transition-colors">
                  {PHONE}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-sunset text-primary-foreground font-semibold shadow-warm hover:scale-105 transition-transform"
            >
              <MessageCircle className="w-5 h-5" />
              Pesan via WhatsApp
            </a>
            <a
              href={MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-background/10 border border-background/30 text-primary-foreground font-semibold hover:bg-background/20 transition-colors"
            >
              <Navigation className="w-5 h-5" />
              Buka di Maps
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {["Makan di tempat", "Bawa pulang", "Pesan antar"].map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-full bg-background/10 border border-background/20 text-xs">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="aspect-[4/3] md:aspect-[16/11] rounded-3xl overflow-hidden border-4 border-background/10 shadow-warm">
            <iframe
              title="Lokasi Kampus Kuphi"
              src="https://www.google.com/maps?q=Jl.+Abdul+Hakim,+Padang+Bulan+Selayang+I,+Medan+Selayang,+Medan&output=embed"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

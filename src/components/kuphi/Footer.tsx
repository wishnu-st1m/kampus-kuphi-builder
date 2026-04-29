import { Coffee, Instagram, MessageCircle } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-coffee-dark text-primary-foreground/80">
      <div className="container py-12 md:py-16 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-gradient-sunset flex items-center justify-center">
              <Coffee className="w-5 h-5 text-primary-foreground" />
            </span>
            <span className="font-display font-black text-xl text-primary-foreground">
              Kampus <span className="text-gradient-sunset">Kuphi</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed max-w-xs">
            Warkop view sawah & sunset di Padang Bulan, Medan. Tempat ngopi yang bikin lupa pulang.
          </p>
        </div>

        <div>
          <h4 className="font-display font-bold text-primary-foreground mb-4">Jelajah</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#tentang" className="hover:text-accent transition-colors">Tentang</a></li>
            <li><a href="#menu" className="hover:text-accent transition-colors">Menu</a></li>
            <li><a href="#galeri" className="hover:text-accent transition-colors">Galeri</a></li>
            <li><a href="#ulasan" className="hover:text-accent transition-colors">Ulasan</a></li>
            <li><a href="#kunjungi" className="hover:text-accent transition-colors">Kunjungi</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-primary-foreground mb-4">Hubungi</h4>
          <p className="text-sm">0831-7952-4020</p>
          <p className="text-sm mt-1">Buka tiap hari · Tutup 01.00</p>
          <div className="mt-4 flex gap-3">
            <a href="https://wa.me/6283179524020" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-background/10 hover:bg-gradient-sunset flex items-center justify-center transition-all">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/kampuskuphii/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-background/10 hover:bg-gradient-sunset flex items-center justify-center transition-all">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="container py-5 text-xs text-primary-foreground/50 flex flex-col md:flex-row gap-2 justify-between">
          <span>© {new Date().getFullYear()} Kampus Kuphi. Dibuat dengan ❤ di Medan.</span>
          <span>Padang Bulan Selayang I, Medan</span>
        </div>
        <div className="container pb-5 text-[10px] text-primary-foreground/35 leading-relaxed">
          Model 3D: "Coffee bean" & "Espresso coffee" oleh{" "}
          <a href="https://poly.pizza/u/Poly%20by%20Google" className="underline hover:text-accent" target="_blank" rel="noreferrer">Poly by Google</a>,
          {" "}"Coffee Machine" oleh{" "}
          <a href="https://poly.pizza/u/J-Toastie" className="underline hover:text-accent" target="_blank" rel="noreferrer">J-Toastie</a>
          {" "}via <a href="https://poly.pizza" className="underline hover:text-accent" target="_blank" rel="noreferrer">poly.pizza</a> (CC-BY).
        </div>
      </div>
    </footer>
  );
};

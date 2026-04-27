import { useEffect, useState } from "react";
import { Coffee, Menu as MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#tentang", label: "Tentang" },
  { href: "#menu", label: "Menu" },
  { href: "#galeri", label: "Galeri" },
  { href: "#ulasan", label: "Ulasan" },
  { href: "#kunjungi", label: "Kunjungi" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-soft"
          : "bg-transparent"
      )}
    >
      <nav className="container flex items-center justify-between h-16 md:h-20">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-sunset shadow-warm">
            <Coffee className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-display font-black text-xl tracking-tight">
            Kampus <span className="text-gradient-sunset">Kuphi</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-foreground/75 hover:text-foreground transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-gradient-sunset after:transition-all hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="https://wa.me/6283179524020"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-sunset text-primary-foreground text-sm font-semibold shadow-warm hover:scale-105 transition-transform"
        >
          Pesan via WhatsApp
        </a>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border">
          <ul className="container py-4 flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 font-medium"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <a
              href="https://wa.me/6283179524020"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex justify-center items-center px-5 py-3 rounded-full bg-gradient-sunset text-primary-foreground font-semibold"
            >
              Pesan via WhatsApp
            </a>
          </ul>
        </div>
      )}
    </header>
  );
};

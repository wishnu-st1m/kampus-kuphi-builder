import { MessageCircle } from "lucide-react";

export const WhatsAppFab = () => (
  <a
    href="https://wa.me/6283179524020?text=Halo%20Kampus%20Kuphi%2C%20saya%20mau%20pesan."
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Pesan via WhatsApp"
    className="fixed bottom-5 right-5 z-50 group"
  >
    <span className="absolute inset-0 rounded-full bg-gradient-sunset blur-lg opacity-60 group-hover:opacity-100 transition-opacity animate-float-slow" />
    <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-sunset text-primary-foreground shadow-warm group-hover:scale-110 transition-transform">
      <MessageCircle className="w-6 h-6" />
    </span>
  </a>
);

import { ReactNode, useEffect, useRef, useState } from "react";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

/**
 * Pins a section while the user scrolls vertically and translates its
 * inner track horizontally from right to left — similar to GSAP
 * ScrollTrigger horizontal scroll demos.
 */
export const HorizontalScroll = ({ children, className }: HorizontalScrollProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [distance, setDistance] = useState(0);

  // Measure how far the inner track needs to travel horizontally.
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const extra = Math.max(0, track.scrollWidth - window.innerWidth);
      setDistance(extra);
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [children]);

  // Translate the track based on scroll progress through the pinned section.
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)));
      track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [distance]);

  // Section height = viewport + horizontal travel, so the user gets enough
  // vertical scroll to play out the full horizontal motion.
  const sectionHeight = `calc(100vh + ${distance}px)`;

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{ height: distance > 0 ? sectionHeight : undefined }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-start pt-20 md:pt-24">
        <div
          ref={trackRef}
          className="flex items-stretch will-change-transform"
          style={{ transition: "transform 80ms linear" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

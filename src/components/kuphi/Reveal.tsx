import { useEffect, useRef, useState, ReactNode, ElementType, CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Variant = "up" | "down" | "left" | "right" | "fade" | "zoom";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
  distance?: number;
}

const initialTransform = (variant: Variant, distance: number) => {
  switch (variant) {
    case "up": return `translate3d(0, ${distance}px, 0)`;
    case "down": return `translate3d(0, -${distance}px, 0)`;
    case "left": return `translate3d(${distance}px, 0, 0)`;
    case "right": return `translate3d(-${distance}px, 0, 0)`;
    case "zoom": return "scale(0.92)";
    case "fade":
    default: return "none";
  }
};

export const Reveal = ({
  children,
  as: Tag = "div",
  variant = "up",
  delay = 0,
  duration = 800,
  className,
  once = false,
  threshold = 0.15,
  distance = 40,
}: RevealProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold]);

  const style: CSSProperties = {
    transform: visible ? "none" : initialTransform(variant, distance),
    opacity: visible ? 1 : 0,
    transition: `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    willChange: "transform, opacity",
  };

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={cn(className)} style={style}>
      {children}
    </Tag>
  );
};

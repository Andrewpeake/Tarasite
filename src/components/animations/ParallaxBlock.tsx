"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/scroll/gsapClient";

interface ParallaxBlockProps {
  children: ReactNode;
  fromY?: number;
  toY?: number;
  className?: string;
}

export default function ParallaxBlock({
  children,
  fromY = 0,
  toY = -100,
  className = "",
}: ParallaxBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const animation = gsap.fromTo(
      ref.current,
      {
        y: fromY,
      },
      {
        y: toY,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === ref.current) {
          st.kill();
        }
      });
    };
  }, [fromY, toY]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}


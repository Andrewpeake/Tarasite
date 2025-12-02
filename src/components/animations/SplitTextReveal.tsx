"use client";

import { useEffect, useRef, ElementType } from "react";
import { gsap, ScrollTrigger } from "@/lib/scroll/gsapClient";

interface SplitTextRevealProps {
  text: string;
  as?: ElementType;
  stagger?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function SplitTextReveal({
  text,
  as: Component = "p",
  stagger = 0.02,
  duration = 0.6,
  className = "",
  style,
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const words = text.split(" ");
    const wordElements = containerRef.current.querySelectorAll(".word");

    if (wordElements.length === 0) return;

    const animation = gsap.fromTo(
      wordElements,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === containerRef.current) {
          st.kill();
        }
      });
    };
  }, [text, stagger, duration]);

  const words = text.split(" ");

  return (
    <Component
      ref={containerRef as any}
      className={className}
      style={style}
    >
      {words.map((word, index) => (
        <span key={index} className="word inline-block mr-1">
          {word}
        </span>
      ))}
    </Component>
  );
}


"use client";

import { useEffect, ReactNode } from "react";
import { createLenis, getLenis } from "@/lib/scroll/lenisClient";
import { ScrollTrigger } from "@/lib/scroll/gsapClient";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  useEffect(() => {
    const lenis = createLenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Integrate with ScrollTrigger
    lenis.on("scroll", (e: any) => {
      ScrollTrigger.update();
    });

    // Update ScrollTrigger on window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      lenis.destroy();
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return <>{children}</>;
}


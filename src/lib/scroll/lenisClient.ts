"use client";

import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function createLenis(): Lenis {
  if (typeof window === "undefined") {
    throw new Error("Lenis can only be created in the browser");
  }

  if (!lenisInstance) {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });
  }

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}


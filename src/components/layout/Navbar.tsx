"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLenis } from "@/lib/scroll/lenisClient";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const checkScroll = () => {
      setScrolled(window.scrollY > 50);
      ticking = false;
    };
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(checkScroll);
        ticking = true;
      }
    };

    // Listen to scroll events (works with Lenis smooth scroll)
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Check initial state
    checkScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md border-b"
          : "bg-transparent"
      }`}
      style={{
        backgroundColor: scrolled ? "rgba(254, 252, 247, 0.8)" : "transparent",
        borderColor: scrolled ? "var(--border-subtle)" : "transparent",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm font-medium" style={{ color: "var(--text-main)" }}>
          Identity Archive
        </Link>
        <div className="flex items-center gap-6">
          <a
            href="#about"
            className="text-xs transition-colors hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector("#about") as HTMLElement;
              const lenis = getLenis();
              if (element && lenis) {
                lenis.scrollTo(element, { offset: -80, duration: 1.5 });
              }
            }}
          >
            About
          </a>
          <a
            href="#photos"
            className="text-xs transition-colors hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector("#photos") as HTMLElement;
              const lenis = getLenis();
              if (element && lenis) {
                lenis.scrollTo(element, { offset: -80, duration: 1.5 });
              }
            }}
          >
            Photos
          </a>
          <a
            href="#writing"
            className="text-xs transition-colors hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector("#writing") as HTMLElement;
              const lenis = getLenis();
              if (element && lenis) {
                lenis.scrollTo(element, { offset: -80, duration: 1.5 });
              }
            }}
          >
            Writing
          </a>
          <a
            href="#experience"
            className="text-xs transition-colors hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector("#experience") as HTMLElement;
              const lenis = getLenis();
              if (element && lenis) {
                lenis.scrollTo(element, { offset: -80, duration: 1.5 });
              }
            }}
          >
            Experience
          </a>
        </div>
      </div>
    </nav>
  );
}


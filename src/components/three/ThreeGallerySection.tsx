"use client";

import { useEffect, useState, useRef } from "react";
import { Artifact } from "@/domain/artifact";
import ThreeGalleryCanvas from "./ThreeGalleryCanvas";
import { getLenis } from "@/lib/scroll/lenisClient";

interface ThreeGallerySectionProps {
  artifacts: Artifact[];
}

export default function ThreeGallerySection({
  artifacts,
}: ThreeGallerySectionProps) {
  const [hoveredArtifact, setHoveredArtifact] = useState<Artifact | null>(
    null
  );
  const [scrollFactor, setScrollFactor] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRangeRef = useRef({ start: 0, end: 0 });

  useEffect(() => {
    // Calculate scroll range based on section position
    const updateScrollRange = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      scrollRangeRef.current = {
        start: rect.top + window.scrollY - viewportHeight,
        end: rect.bottom + window.scrollY - viewportHeight * 0.5,
      };
    };

    updateScrollRange();
    window.addEventListener("resize", updateScrollRange);

    // Track scroll position
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const lenis = getLenis();
          const scrollY = lenis ? lenis.scroll : window.scrollY;

          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionBottom = rect.bottom + scrollY;
            const viewportHeight = window.innerHeight;

            // Normalize scroll progress through the section (0 to 1)
            const scrollStart = sectionTop - viewportHeight;
            const scrollEnd = sectionBottom - viewportHeight * 0.5;
            const scrollRange = scrollEnd - scrollStart;

            if (scrollRange > 0) {
              const progress = Math.max(
                0,
                Math.min(1, (scrollY - scrollStart) / scrollRange)
              );
              setScrollFactor(progress);
            } else {
              setScrollFactor(0);
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    // Listen to scroll events (works with Lenis smooth scroll)
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    // Also listen to Lenis scroll events if available
    const lenis = getLenis();
    if (lenis) {
      lenis.on("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollRange);
      if (lenis) {
        lenis.off("scroll", handleScroll);
      }
    };
  }, []);

  const handleHoverStart = (artifact: Artifact) => {
    setHoveredArtifact(artifact);
  };

  const handleHoverEnd = () => {
    setHoveredArtifact(null);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[200vh] w-full overflow-hidden"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* 3D Canvas with light gradient background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-rose-50 via-slate-50 to-sky-50">
        <ThreeGalleryCanvas
          artifacts={artifacts}
          scrollFactor={scrollFactor}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
        />
      </div>

      {/* DOM Overlay Label */}
      {hoveredArtifact && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
          <div 
            className="px-6 py-2 rounded-full backdrop-blur-md border shadow-lg"
            style={{
              backgroundColor: "rgba(254, 247, 242, 0.9)",
              borderColor: "var(--border-subtle)"
            }}
          >
            <span 
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: "var(--text-main)" }}
            >
              {hoveredArtifact.label ?? hoveredArtifact.title}
              {hoveredArtifact.count !== undefined && (
                <span style={{ color: "var(--text-muted)" }}> ({hoveredArtifact.count})</span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Fallback message (hidden by default, shown if WebGL fails) */}
      <div className="sr-only">
        <p className="text-neutral-400 text-center">
          3D gallery view. Please enable WebGL in your browser settings.
        </p>
      </div>
    </section>
  );
}


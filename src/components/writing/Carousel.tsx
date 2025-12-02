"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Writing } from "@/domain/writing";
import CarouselCard from "./CarouselCard";

interface CarouselProps {
  writings: Writing[];
}

export default function Carousel({ writings }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimeoutRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Scroll teaser state
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [teaseDone, setTeaseDone] = useState(false);
  const teaseProgressRef = useRef(0);
  const TEASE_DISTANCE = 400; // px of horizontal scroll we want to "tease"

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Detect when section is in view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio > 0.6);
      },
      { threshold: [0.6] }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Map vertical wheel to horizontal scroll (one-time tease)
  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const track = trackRef.current;

    // If we've already done the teaser or we're not in view, let normal vertical scroll happen.
    if (teaseDone || !isInView || !track) return;

    // We ARE in the section and teaser not done: convert vertical -> horizontal.
    e.preventDefault();
    e.stopPropagation();

    const deltaY = e.deltaY;

    // Apply to horizontal scroll
    track.scrollLeft += deltaY;

    // Track how much tease we've done in total
    teaseProgressRef.current += Math.abs(deltaY);

    if (teaseProgressRef.current >= TEASE_DISTANCE) {
      setTeaseDone(true);
    }
  };

  // Centering helper function
  const centerCard = useCallback((index: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];

    if (!track || !card) {
      // Retry if elements aren't ready
      setTimeout(() => centerCard(index), 50);
      return;
    }

    // Use getBoundingClientRect for reliable positioning with nested structure
    const cardRect = card.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();

    const cardCenter = cardRect.left + cardRect.width / 2;
    const trackCenter = trackRect.left + trackRect.width / 2;

    const scrollDelta = cardCenter - trackCenter;

    track.scrollTo({
      left: track.scrollLeft + scrollDelta,
      behavior: "smooth",
    });
  }, []);

  // Handle card selection
  const handleSelect = useCallback(
    (index: number) => {
      setActiveIndex(index);
      centerCard(index);
    },
    [centerCard]
  );

  // Handle scroll to detect nearest card
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      const trackCenter = track.clientWidth / 2;

      let closestIndex = activeIndex;
      let closestDistance = Infinity;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const trackRect = track.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - (trackRect.left + trackCenter));

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    }, 100);
  }, [activeIndex]);

  // Center first card on mount
  useEffect(() => {
    centerCard(activeIndex);
  }, []); // run once on mount

  return (
    <section
      id="writing"
      ref={sectionRef}
      onWheel={handleWheel}
      className="relative py-24 overflow-hidden"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-main)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 flex flex-col gap-8">
        {/* Heading */}
        <header className="flex flex-col gap-2">
          <p
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            Writing & Editing
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold">
            Stories, essays, and culture pieces.
          </h2>
        </header>

        {/* Carousel Container */}
        <div className="relative mt-6">
          {/* Single section-level floor shadow */}
          <div className="pointer-events-none absolute inset-x-8 bottom-4 h-16">
            <div className="mx-auto h-full max-w-5xl rounded-full bg-black/15 blur-3xl opacity-60" />
          </div>

          {/* Environmental gradient background */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, var(--bg-elevated), rgba(0,0,0,0.08))`,
            }}
          />

          {/* Scrollable track with 3D perspective */}
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="relative overflow-x-auto overflow-y-visible hide-scrollbar"
            style={{
              perspective: isMobile ? "none" : "1200px",
              perspectiveOrigin: "center center",
              height: "600px",
              cursor: "grab",
            }}
            onMouseDown={() => {
              if (trackRef.current) {
                trackRef.current.style.cursor = "grabbing";
              }
            }}
            onMouseUp={() => {
              if (trackRef.current) {
                trackRef.current.style.cursor = "grab";
              }
            }}
            onMouseLeave={() => {
              if (trackRef.current) {
                trackRef.current.style.cursor = "grab";
              }
            }}
          >
            {/* Inner container with cards positioned horizontally */}
            <div
              className="relative h-full flex items-center"
              style={{
                width: `${writings.length * 260}px`,
                paddingLeft: "calc(50% - 130px)",
                paddingRight: "calc(50% - 130px)",
                transformStyle: "preserve-3d",
              }}
            >
              {writings.map((writing, index) => (
                <div
                  key={writing.slug}
                  className="flex-shrink-0"
                  style={{ width: "260px" }}
                >
                  <CarouselCard
                    writing={writing}
                    index={index}
                    activeIndex={activeIndex}
                    isActive={index === activeIndex}
                    registerRef={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    onSelect={() => handleSelect(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

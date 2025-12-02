"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Writing } from "@/domain/writing";

interface WritingBillboardSectionProps {
  writings: Writing[];
}

type WritingBillboardProps = {
  writing: Writing;
  index: number;
  activeIndex: number;
  isActive: boolean;
  setActiveIndex: (i: number) => void;
  registerRef: (el: HTMLDivElement | null) => void;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function WritingBillboard({
  writing,
  index,
  activeIndex,
  isActive,
  setActiveIndex,
  registerRef,
}: WritingBillboardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    registerRef(cardRef.current);
  }, [registerRef]);

  // Compute relative offset from active card
  const offset = index - activeIndex;
  const clamped = Math.max(-2, Math.min(2, offset));

  // Transform constants
  const baseRotate = 16; // degrees
  const baseTranslateY = 18; // pixels
  const baseScaleDiff = 0.1; // 10% smaller per step

  // Calculate transforms based on offset
  const rotateY = -clamped * baseRotate;
  let translateY = Math.abs(clamped) * baseTranslateY;
  const scale = 1 - Math.abs(clamped) * baseScaleDiff;
  const opacity = 0.45 + (1 - Math.min(Math.abs(clamped), 1)) * 0.55;
  const zIndex = 10 - Math.abs(clamped);

  // Extra lift for active card
  const lift = isActive ? -6 : 0;
  translateY += lift;

  return (
    <article
      ref={cardRef}
      onClick={() => setActiveIndex(index)}
      className="
        relative flex-shrink-0 snap-center
        w-[220px] md:w-[260px] lg:w-[300px]
        h-[420px] md:h-[460px] lg:h-[500px]
        rounded-[24px]
        bg-black text-white overflow-hidden
        shadow-[0_24px_70px_rgba(0,0,0,0.4)]
        transform-gpu
        transition-all duration-300 ease-out
        cursor-pointer
        group
      "
      style={{
        transformOrigin: "center bottom",
        transformStyle: "preserve-3d",
        transform: `
          translateY(${translateY}px)
          rotateY(${rotateY}deg)
          scale(${scale})
        `,
        opacity,
        zIndex,
      }}
    >
      {/* Poster content */}
      <div className="absolute inset-0 flex flex-col">
        {/* Top image */}
        <div className="relative flex-1 overflow-hidden">
          <Image
            src={writing.thumbnailUrl || "/sample-photos/study.jpg"}
            alt={writing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 220px, (max-width: 1024px) 260px, 300px"
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
        </div>

        {/* Bottom info strip */}
        <div className="h-[120px] p-4 flex flex-col justify-between bg-black/90 text-[11px] tracking-wide">
          <div className="flex items-center justify-between uppercase">
            <span className="text-[0.65rem] text-neutral-400">
              {writing.category || "CULTURE"}
            </span>
            <span className="text-[0.65rem] text-neutral-500">
              {formatDate(writing.publishedAt)}
            </span>
          </div>

          <h3 className="text-sm md:text-[0.9rem] font-semibold leading-snug line-clamp-2">
            {writing.title}
          </h3>

          <div className="flex items-center justify-between text-[0.65rem] text-neutral-400">
            {writing.url && isActive ? (
              <Link
                href={writing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Read →
              </Link>
            ) : (
              <span>Read →</span>
            )}
            <span>{writing.readTime || "3 min"}</span>
          </div>
        </div>
      </div>

      {/* Left "spine" lines to fake book/billboard edges */}
      <div className="absolute inset-y-0 left-0 w-[10px] bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-x-[2px] inset-y-[12px] border-l border-neutral-700/60" />
      </div>

    </article>
  );
}

export default function WritingBillboardSection({
  writings,
}: WritingBillboardSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimeoutRef = useRef<number | null>(null);
  const isScrollingProgrammaticallyRef = useRef(false);

  // Helper function to center a card in the scroll container
  const centerCard = useCallback((index: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;

    isScrollingProgrammaticallyRef.current = true;

    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const trackCenter = trackRect.left + trackRect.width / 2;
    const cardCenter = cardRect.left + cardRect.width / 2;

    const delta = cardCenter - trackCenter;

    track.scrollTo({
      left: track.scrollLeft + delta,
      behavior: "smooth",
    });

    // Reset flag after scroll animation completes
    setTimeout(() => {
      isScrollingProgrammaticallyRef.current = false;
    }, 500);
  }, []);

  // Recenter when activeIndex changes
  useEffect(() => {
    centerCard(activeIndex);
  }, [activeIndex, centerCard]);

  // Handle scroll to detect which card is closest to center
  const handleScroll = () => {
    // Skip if we're programmatically scrolling
    if (isScrollingProgrammaticallyRef.current) return;

    const track = trackRef.current;
    if (!track) return;

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      // Double-check flag after debounce
      if (isScrollingProgrammaticallyRef.current) return;

      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;

      let closestIndex = activeIndex;
      let closestDistance = Infinity;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - trackCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    }, 80);
  };

  // Register ref callback
  const registerRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  };

  return (
    <section
      id="writing"
      className="relative py-24"
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

        {/* Horizontal billboard rail */}
        <div className="relative mt-6">
          {/* "floor" background */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, var(--bg-elevated), rgba(0,0,0,0.04))`,
            }}
          />

          {/* Ground shadow / stacking illusion */}
          <div className="absolute left-0 right-0 bottom-2 h-12 pointer-events-none">
            <div className="mx-auto h-full max-w-5xl bg-gradient-to-b from-black/20 to-transparent blur-2xl opacity-40" />
          </div>

          {/* Scrollable rail */}
          <div
            className="relative overflow-x-auto overflow-y-visible hide-scrollbar"
            style={{
              perspective: "1200px",
            }}
          >
            <div
              ref={trackRef}
              onScroll={handleScroll}
              className="flex gap-8 px-2 pb-8 snap-x snap-mandatory"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {writings.map((writing, index) => (
                <WritingBillboard
                  key={writing.slug}
                  writing={writing}
                  index={index}
                  activeIndex={activeIndex}
                  isActive={index === activeIndex}
                  setActiveIndex={setActiveIndex}
                  registerRef={registerRef(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

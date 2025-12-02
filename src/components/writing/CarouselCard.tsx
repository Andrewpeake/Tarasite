"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Writing } from "@/domain/writing";

interface CarouselCardProps {
  writing: Writing;
  index: number;
  activeIndex: number;
  isActive: boolean;
  registerRef: (el: HTMLDivElement | null) => void;
  onSelect: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CarouselCard({
  writing,
  index,
  activeIndex,
  isActive,
  registerRef,
  onSelect,
}: CarouselCardProps) {
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    registerRef(wrapperRef.current);
  }, [registerRef]);

  // Calculate distance from active card
  const distance = index - activeIndex;

  // Calculate transforms based on distance
  const rotateY = distance * 12; // ±12° per step
  const scale = Math.max(0.7, 1 - Math.abs(distance) * 0.15); // 0.85 → 0.7
  const translateZ = -80 * Math.abs(distance); // -80px → -140px
  const opacity = Math.max(0.4, 1 - Math.abs(distance) * 0.3); // 0.6 → 0.4

  // Animate with GSAP when activeIndex changes
  useEffect(() => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      rotateY,
      scale,
      z: translateZ,
      opacity,
      duration: 0.45,
      ease: "power2.inOut",
    });
  }, [rotateY, scale, translateZ, opacity]);

  // Set initial transform
  useEffect(() => {
    if (!cardRef.current) return;

    gsap.set(cardRef.current, {
      rotateY,
      scale,
      z: translateZ,
      opacity,
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
    });
  }, []);

  // Depth sorting: cards with more negative translateZ should appear behind
  const zIndex = 10 - Math.abs(distance);

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (!isActive) {
      // If this card is NOT currently centered, just recenter it.
      e.preventDefault();
      e.stopPropagation();
      onSelect();
      return;
    }
    // If it IS active, allow normal navigation.
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{
        zIndex,
        pointerEvents: "auto",
      }}
    >
      <Link
        ref={cardRef}
        href={writing.url || "#"}
        onClick={handleClick}
        target={writing.url?.startsWith("http") ? "_blank" : undefined}
        rel={writing.url?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="
          block
          relative
          w-full
          h-[420px] md:h-[460px] lg:h-[500px]
          rounded-[24px]
          bg-black text-white overflow-hidden
          cursor-pointer
          will-change-transform
        "
      >
        {/* Poster content */}
        <div className="absolute inset-0 flex flex-col">
          {/* Top image */}
          <div className="relative flex-1 overflow-hidden">
            <Image
              src={writing.thumbnailUrl || "/sample-photos/study.jpg"}
              alt={writing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 220px, (max-width: 1024px) 260px, 300px"
            />
            {/* Gradient overlay */}
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
              <span>Read →</span>
              <span>{writing.readTime || "3 min"}</span>
            </div>
          </div>
        </div>

        {/* Ambient occlusion around base */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </Link>
    </div>
  );
}

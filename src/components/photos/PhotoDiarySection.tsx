"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Photo } from "@/domain/photo";

interface PhotoDiarySectionProps {
  photos: Photo[];
}

export default function PhotoDiarySection({ photos }: PhotoDiarySectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isUserScrollingRef = useRef(false);

  // Constants - can be tweaked
  const AUTO_SCROLL_SPEED = 0.5; // pixels per frame (increased for visibility)
  const RESUME_DELAY = 2000; // milliseconds before resuming auto-scroll

  const active = photos[activeIndex];
  const next = photos[(activeIndex + 1) % photos.length];

  // Intersection Observer to detect centered photo during user scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || photos.length === 0) return;

    const observerOptions = {
      root: container,
      rootMargin: "-40% 0px -40% 0px", // Center 20% of viewport
      threshold: 0.5,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Only update when user is manually scrolling (not during auto-scroll)
      if (isUserScrollingRef.current) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = thumbnailRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            if (index !== -1 && index !== activeIndex) {
              setActiveIndex(index);
            }
          }
        });
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Wait for refs to be set
    const timeoutId = setTimeout(() => {
      thumbnailRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [photos.length, activeIndex]);

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrame: number;
    let lastTime = performance.now();
    let isRunning = true;

    const step = (currentTime: number) => {
      if (!isRunning || !isAutoScrolling || !container) {
        return;
      }

      const delta = currentTime - lastTime;
      lastTime = currentTime;

      // Smooth scroll - normalize to ~60fps
      const scrollAmount = (AUTO_SCROLL_SPEED * delta) / 16;

      container.scrollTop += scrollAmount;

      // Loop: when we reach the bottom, smoothly go back to top
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (container.scrollTop >= maxScroll - 1) {
        container.scrollTop = 0;
      }

      animationFrame = requestAnimationFrame(step);
    };

    if (isAutoScrolling) {
      animationFrame = requestAnimationFrame(step);
    }

    return () => {
      isRunning = false;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isAutoScrolling, AUTO_SCROLL_SPEED]);

  const pauseAutoScroll = useCallback(() => {
    setIsAutoScrolling(false);
    isUserScrollingRef.current = false;
  }, []);

  const resumeAutoScroll = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
      isUserScrollingRef.current = false;
    }, RESUME_DELAY);
  }, [RESUME_DELAY]);

  const handleUserScroll = useCallback(() => {
    isUserScrollingRef.current = true;
    setIsAutoScrolling(false);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
      isUserScrollingRef.current = false;
    }, RESUME_DELAY);
  }, [RESUME_DELAY]);

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
    isUserScrollingRef.current = false;
    setIsAutoScrolling(false);
    
    // Scroll to that thumbnail in the sidebar
    if (scrollRef.current && thumbnailRefs.current[index]) {
      const thumbnailElement = thumbnailRefs.current[index];
      if (thumbnailElement) {
        thumbnailElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }

    // Resume auto-scroll after a delay
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, RESUME_DELAY);
  };

  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section
      id="photos"
      className="relative py-24"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-main)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-12">
          <p
            className="text-xs uppercase tracking-wider mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Fragments
          </p>
          <h2
            className="text-2xl md:text-3xl font-medium relative inline-block"
            style={{ color: "var(--text-main)" }}
          >
            Photo Diary
            <span
              className="absolute -bottom-2 left-0 w-12 h-0.5 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
          </h2>
        </div>

        {/* Main layout */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)] items-stretch">
          {/* Left: Auto-scrolling sidebar */}
          <div
            className="relative h-[70vh] overflow-hidden rounded-3xl border bg-[var(--bg-elevated)] shadow-sm"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div
              ref={scrollRef}
              className="scrollbar-none h-full overflow-y-scroll"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              onMouseEnter={pauseAutoScroll}
              onMouseLeave={resumeAutoScroll}
              onScroll={handleUserScroll}
            >
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  ref={(el) => {
                    thumbnailRefs.current[index] = el;
                  }}
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-full aspect-[3/4] relative transition-all duration-300 border-b group ${
                    index === activeIndex
                      ? "brightness-110 scale-[1.02]"
                      : "hover:brightness-105"
                  }`}
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <Image
                    src={photo.thumbnailUrl}
                    alt={photo.title || `Photo ${photo.id}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 30vw"
                  />
                  {/* Small overlay title in bottom-left */}
                  {photo.title && (
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: "var(--text-main)" }}
                      >
                        {photo.title}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Main image + background "next" image */}
          <div
            className="relative h-[70vh] rounded-3xl overflow-hidden bg-[var(--bg-elevated)] border shadow-sm"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            {/* Background "next photo" */}
            <div className="absolute inset-0">
              <Image
                src={next.url}
                alt={next.title || "Next photo"}
                fill
                className="object-cover blur-2xl scale-110 opacity-40 transition-opacity duration-500"
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: "rgba(254, 252, 247, 0.4)",
                }}
              />
            </div>

            {/* Foreground main image card (centered) */}
            <div className="relative z-10 flex h-full items-center justify-center p-6">
              <div
                className="max-w-md w-full rounded-3xl shadow-lg backdrop-blur-md border p-6 flex flex-col gap-4 transition-all duration-500"
                style={{
                  backgroundColor: "rgba(254, 252, 247, 0.9)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl">
                  <Image
                    src={active.url}
                    alt={active.title || "Photo"}
                    fill
                    className="object-cover transition-opacity duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span style={{ color: "var(--text-main)" }}>
                    {active.title || "Untitled"}
                  </span>
                  {formatDate(active.takenAt) && (
                    <span style={{ color: "var(--text-muted)" }}>
                      {formatDate(active.takenAt)}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {active.tags && active.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {active.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          color: "var(--accent)",
                          backgroundColor: "var(--accent-soft)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p
                  className="text-xs md:text-sm italic"
                  style={{ color: "var(--text-muted)" }}
                >
                  From the archive
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

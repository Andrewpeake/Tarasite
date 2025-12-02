"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface CarouselState {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  trackRef: React.RefObject<HTMLDivElement>;
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  handleScroll: () => void;
}

export interface UseCarouselOptions {
  totalItems: number;
  onIndexChange?: (index: number) => void;
}

export function useCarousel({
  totalItems,
  onIndexChange,
}: UseCarouselOptions): CarouselState {
  const [activeIndex, setActiveIndexState] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const centerCard = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const cardWrapper = cardRefs.current[index];
      
      if (!track || !cardWrapper) {
        // Retry after a brief delay if elements aren't ready
        setTimeout(() => centerCard(index), 100);
        return;
      }

      isScrollingRef.current = true;

      // Use requestAnimationFrame to ensure layout is stable
      requestAnimationFrame(() => {
        const trackRect = track.getBoundingClientRect();
        const wrapperRect = cardWrapper.getBoundingClientRect();

        const trackCenter = trackRect.left + trackRect.width / 2;
        const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;
        
        // Calculate scroll delta needed to center the card
        const currentScrollLeft = track.scrollLeft;
        const scrollDelta = wrapperCenter - trackCenter;

        track.scrollTo({
          left: currentScrollLeft + scrollDelta,
          behavior: "smooth",
        });

        setTimeout(() => {
          isScrollingRef.current = false;
        }, 600);
      });
    },
    []
  );

  const setActiveIndex = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(totalItems - 1, index));
      setActiveIndexState(clampedIndex);
      onIndexChange?.(clampedIndex);
    },
    [totalItems, onIndexChange]
  );

  const handleScroll = useCallback(() => {
    if (isScrollingRef.current) return;

    const track = trackRef.current;
    if (!track) return;

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      if (isScrollingRef.current) return;

      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;

      let closestIndex = activeIndex;
      let closestDistance = Infinity;

      cardRefs.current.forEach((wrapper, index) => {
        if (!wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        const wrapperCenter = rect.left + rect.width / 2;
        const distance = Math.abs(wrapperCenter - trackCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    }, 100);
  }, [activeIndex, setActiveIndex]);

  useEffect(() => {
    centerCard(activeIndex);
  }, [activeIndex, centerCard]);

  const goToNext = useCallback(() => {
    setActiveIndex(activeIndex + 1);
  }, [activeIndex, setActiveIndex]);

  const goToPrevious = useCallback(() => {
    setActiveIndex(activeIndex - 1);
  }, [activeIndex, setActiveIndex]);

  return {
    activeIndex,
    setActiveIndex,
    goToNext,
    goToPrevious,
    canGoNext: activeIndex < totalItems - 1,
    canGoPrevious: activeIndex > 0,
    trackRef,
    cardRefs,
    handleScroll,
  };
}

"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/scroll/gsapClient";

interface PinnedChapterProps {
  id?: string;
  children: ReactNode;
  pinDurationFactor?: number;
  heading?: string;
  subheading?: string;
}

export default function PinnedChapter({
  id,
  children,
  pinDurationFactor = 1,
  heading,
  subheading,
}: PinnedChapterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const pinDuration = window.innerHeight * pinDurationFactor;

    // Pin the section
    const pin = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${pinDuration}`,
      pin: true,
      pinSpacing: true,
    });

    // Animate heading and subheading
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "center center",
        scrub: true,
      },
    });

    if (headingRef.current) {
      tl.from(headingRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
      });
    }

    if (subheadingRef.current) {
      tl.from(
        subheadingRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
        },
        "-=0.5"
      );
    }

    return () => {
      pin.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === section) {
          st.kill();
        }
      });
    };
  }, [pinDurationFactor]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center"
    >
      {(heading || subheading) && (
        <div className="mb-12">
          {heading && (
            <h2 ref={headingRef} className="text-2xl md:text-4xl font-medium">
              {heading}
            </h2>
          )}
          {subheading && (
            <p
              ref={subheadingRef}
              className="text-sm md:text-base text-neutral-400 mt-2"
            >
              {subheading}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}


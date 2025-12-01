"use client";

import { Writing } from "@/domain/writing";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/scroll/gsapClient";
import SplitTextReveal from "../animations/SplitTextReveal";

interface EditorialGridProps {
  writings: Writing[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getCategoryLabel(type: Writing["type"]): string {
  switch (type) {
    case "culture":
      return "CULTURE";
    case "article":
      return "ARTICLE";
    case "blog":
      return "BLOG";
    case "note":
      return "NOTE";
    default:
      return String(type).toUpperCase();
  }
}

export default function EditorialGrid({ writings }: EditorialGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll(".article-card");

    cards.forEach((card) => {
      gsap.set(card, { opacity: 0, y: 40 });
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });
  }, [writings]);

  return (
    <div ref={gridRef} className="space-y-8">
      {writings.map((writing) => (
        <article
          key={writing.slug}
          className="article-card group cursor-pointer"
        >
          <a
            href={writing.url || `#${writing.slug}`}
            className="block bg-neutral-50 dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Category label */}
            <div className="px-6 pt-6 pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {writing.category || getCategoryLabel(writing.type)}
              </span>
            </div>

            {/* Thumbnail */}
            {writing.thumbnailUrl && (
              <div className="relative w-full h-64 md:h-80 overflow-hidden">
                <Image
                  src={writing.thumbnailUrl}
                  alt={writing.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-serif font-semibold text-neutral-900 dark:text-neutral-100 mb-3 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                {writing.title}
              </h3>
              <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                {writing.summary}
              </p>
              <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-500">
                <time>{formatDate(writing.publishedAt)}</time>
                {writing.readTime && (
                  <>
                    <span>·</span>
                    <span>{writing.readTime}</span>
                  </>
                )}
              </div>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}


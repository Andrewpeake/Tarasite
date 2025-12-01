"use client";

import { Writing } from "@/domain/writing";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/scroll/gsapClient";

interface WritingListProps {
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

function getTypeLabel(type: Writing["type"]): string {
  switch (type) {
    case "article":
      return "Article";
    case "blog":
      return "Blog";
    case "note":
      return "Note";
    default:
      return type;
  }
}

export default function WritingList({ writings }: WritingListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;

    const cards = listRef.current.querySelectorAll(".writing-card");

    cards.forEach((card) => {
      gsap.set(card, { opacity: 0, y: 30 });
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.6,
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
    <div ref={listRef} className="space-y-6">
      {writings.map((writing) => (
        <article
          key={writing.slug}
          className="writing-card p-6 rounded-xl border border-neutral-900 bg-neutral-950/50 hover:bg-neutral-950/80 hover:border-neutral-800 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-neutral-500 uppercase tracking-wider">
              {getTypeLabel(writing.type)}
            </span>
            <time className="text-xs text-neutral-500">
              {formatDate(writing.publishedAt)}
            </time>
          </div>
          <h3 className="text-xl font-medium text-neutral-100 mb-2">
            {writing.title}
          </h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {writing.summary}
          </p>
        </article>
      ))}
    </div>
  );
}


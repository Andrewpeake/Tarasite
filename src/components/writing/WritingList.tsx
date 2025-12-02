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
          className="writing-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-subtle)"
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span 
              className="text-xs uppercase tracking-wider px-2 py-1 rounded-full inline-block"
              style={{
                color: "var(--accent)",
                backgroundColor: "var(--accent-soft)"
              }}
            >
              {getTypeLabel(writing.type)}
            </span>
            <time 
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {formatDate(writing.publishedAt)}
            </time>
          </div>
          <h3 
            className="text-xl font-medium mb-2"
            style={{ color: "var(--text-main)" }}
          >
            {writing.title}
          </h3>
          <p 
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {writing.summary}
          </p>
        </article>
      ))}
    </div>
  );
}


"use client";

import SplitTextReveal from "../animations/SplitTextReveal";

export default function AboutStrip() {
  return (
    <section id="about" className="py-16 border-y" style={{ borderColor: "var(--border-subtle)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <SplitTextReveal
          text="A place to store the versions of myself that don't fit on social media. A living archive, not a feed. This space is allowed to be inconsistent, unfinished, and deeply human."
          as="p"
          className="text-base md:text-lg text-center max-w-2xl mx-auto"
          style={{ color: "var(--text-muted)" }}
        />
      </div>
    </section>
  );
}


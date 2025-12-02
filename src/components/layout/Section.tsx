import { ReactNode } from "react";

interface SectionProps {
  id?: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

export default function Section({
  id,
  title,
  eyebrow,
  children,
  className = "",
}: SectionProps) {
  return (
    <section id={id} className={`py-24 md:py-32 ${className}`}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          {eyebrow && (
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl md:text-3xl font-medium relative inline-block" style={{ color: "var(--text-main)" }}>
            {title}
            <span className="absolute -bottom-2 left-0 w-12 h-0.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}


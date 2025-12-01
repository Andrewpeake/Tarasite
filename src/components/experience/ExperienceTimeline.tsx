"use client";

import { Experience } from "@/domain/experience";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/scroll/gsapClient";

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export default function ExperienceTimeline({
  experiences,
}: ExperienceTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    const items = timelineRef.current.querySelectorAll(".timeline-item");

    items.forEach((item) => {
      gsap.set(item, { opacity: 0, x: -30 });
      gsap.to(item, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });
  }, [experiences]);

  return (
    <div ref={timelineRef} className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-neutral-800" />

      {/* Timeline items */}
      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="timeline-item relative pl-16 md:pl-20">
            {/* Timeline dot */}
            <div className="absolute left-4 md:left-6 top-2 w-4 h-4 rounded-full bg-neutral-600 border-2 border-neutral-900 z-10" />

            {/* Content card */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-900/70 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-100 mb-1">
                    {exp.role}
                  </h3>
                  <p className="text-base text-neutral-300">{exp.organization}</p>
                </div>
                <div className="text-sm text-neutral-400">
                  {exp.startDate} {exp.endDate && `– ${exp.endDate}`}
                  {exp.endDate === "Present" && " – Present"}
                  {!exp.endDate && " – Present"}
                </div>
              </div>

              {exp.location && (
                <p className="text-xs text-neutral-500 mb-4">{exp.location}</p>
              )}

              {exp.summary && exp.summary.length > 0 && (
                <ul className="space-y-1">
                  {exp.summary.map((point, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-neutral-400 leading-relaxed before:content-['•'] before:mr-2 before:text-neutral-600"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


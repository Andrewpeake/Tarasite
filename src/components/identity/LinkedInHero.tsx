"use client";

import { IdentityProfile } from "@/domain/identity";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/scroll/gsapClient";
import ParallaxBlock from "../animations/ParallaxBlock";

interface LinkedInHeroProps {
  profile: IdentityProfile;
  bannerImage?: string;
  avatarImage?: string;
}

export default function LinkedInHero({
  profile,
  bannerImage = "/sample-photos/banner.jpg",
  avatarImage = "/sample-photos/avatar.jpg",
}: LinkedInHeroProps) {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const rolesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fade/slide-in animations on load
    if (nameRef.current) {
      gsap.fromTo(
        nameRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power2.out" }
      );
    }

    if (taglineRef.current) {
      gsap.fromTo(
        taglineRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: "power2.out" }
      );
    }

    if (rolesRef.current) {
      const chips = rolesRef.current.querySelectorAll(".role-chip");
      gsap.fromTo(
        chips,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: 0.6,
          stagger: 0.1,
          ease: "back.out(1.2)",
        }
      );
    }
  }, []);

  return (
    <section className="relative w-full" style={{ backgroundColor: "var(--bg)" }}>
      {/* Banner with parallax */}
      <ParallaxBlock fromY={0} toY={-30} className="absolute inset-0">
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-b-3xl">
          <Image
            src={bannerImage}
            alt="Banner"
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          {/* Overlay for readability - soft light gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/50" />
        </div>
      </ParallaxBlock>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-[300px] md:pt-[380px] pb-12">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 overflow-hidden shadow-lg"
              style={{ 
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--bg-elevated)"
              }}
            >
              <Image
                src={avatarImage}
                alt={profile.name}
                width={160}
                height={160}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Name and Info */}
          <div className="flex-1 pb-4">
            <h1
              ref={nameRef}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-2"
              style={{ color: "var(--text-main)" }}
            >
              {profile.name}
            </h1>
            <p
              ref={taglineRef}
              className="text-base md:text-lg mb-4 font-light"
              style={{ color: "var(--text-muted)" }}
            >
              {profile.tagline}
            </p>

            {/* Role chips */}
            {profile.roles && profile.roles.length > 0 && (
              <div ref={rolesRef} className="flex flex-wrap gap-2 mt-4">
                {profile.roles.map((role, index) => (
                  <span
                    key={index}
                    className="role-chip px-3 py-1 rounded-full text-xs shadow-sm"
                    style={{
                      backgroundColor: "var(--accent-soft)",
                      color: "var(--accent)",
                      border: `1px solid var(--border-subtle)`
                    }}
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


"use client";

import Image from "next/image";
import { Photo } from "@/domain/photo";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/scroll/gsapClient";

interface PhotoGridProps {
  photos: Photo[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const images = gridRef.current.querySelectorAll(".photo-item");

    images.forEach((img) => {
      gsap.set(img, { opacity: 0, y: 30 });
      gsap.to(img, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: img,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });
  }, [photos]);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
    >
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="photo-item relative aspect-square rounded-xl overflow-hidden border shadow-sm group cursor-pointer"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--bg-elevated)"
          }}
        >
          <Image
            src={photo.thumbnailUrl}
            alt={photo.title || `Photo ${photo.id}`}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          {/* Film grain overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjkiIG51bU9jdGF2ZXM9IjQiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')]" />
          {/* Hover overlay with caption */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-all duration-300 flex items-end">
            {(photo.title || photo.tags.length > 0) && (
              <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-white/90 to-transparent">
                {photo.title && (
                  <p className="text-xs font-light mb-1" style={{ color: "var(--text-main)" }}>
                    {photo.title}
                  </p>
                )}
                {photo.tags.length > 0 && (
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {photo.tags.slice(0, 2).join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


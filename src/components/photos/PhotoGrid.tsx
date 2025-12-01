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
      className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
    >
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="photo-item relative aspect-square rounded-xl overflow-hidden border border-neutral-900 group cursor-pointer"
        >
          <Image
            src={photo.thumbnailUrl}
            alt={photo.title || `Photo ${photo.id}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
}


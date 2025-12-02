"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Artifact } from "@/domain/artifact";
import GalleryScene from "./GalleryScene";

interface ThreeGalleryCanvasProps {
  artifacts: Artifact[];
  scrollFactor: number;
  onHoverStart: (artifact: Artifact) => void;
  onHoverEnd: () => void;
}

export default function ThreeGalleryCanvas({
  artifacts,
  scrollFactor,
  onHoverStart,
  onHoverEnd,
}: ThreeGalleryCanvasProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragRotation, setDragRotation] = useState(0);
  const dragStateRef = useRef({
    lastX: 0,
    velocity: 0,
    rotationOffset: 0,
  });
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Constants for drag behavior
  const DRAG_SENSITIVITY = 0.005; // How much drag movement affects rotation
  const INERTIA_DAMPING = 0.92; // Damping for drag inertia

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const handlePointerDown = (e: PointerEvent) => {
      setIsDragging(true);
      dragStateRef.current.lastX = e.clientX;
      dragStateRef.current.velocity = 0;
      container?.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStateRef.current.lastX;
      const rotationDelta = -deltaX * DRAG_SENSITIVITY;
      dragStateRef.current.rotationOffset += rotationDelta;
      dragStateRef.current.velocity = rotationDelta * 10; // Scale for inertia
      setDragRotation(dragStateRef.current.rotationOffset);
      dragStateRef.current.lastX = e.clientX;
    };

    const handlePointerUp = (e: PointerEvent) => {
      setIsDragging(false);
      container?.releasePointerCapture(e.pointerId);
    };

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointerleave", handlePointerUp);

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointerleave", handlePointerUp);
    };
  }, [isDragging, DRAG_SENSITIVITY]);

  // Apply inertia when not dragging using requestAnimationFrame
  useEffect(() => {
    if (isDragging) return;

    let rafId: number;
    const applyInertia = () => {
      if (Math.abs(dragStateRef.current.velocity) > 0.001) {
        dragStateRef.current.rotationOffset += dragStateRef.current.velocity;
        dragStateRef.current.velocity *= INERTIA_DAMPING;
        setDragRotation(dragStateRef.current.rotationOffset);
        rafId = requestAnimationFrame(applyInertia);
      } else {
        dragStateRef.current.velocity = 0;
      }
    };

    if (Math.abs(dragStateRef.current.velocity) > 0.001) {
      rafId = requestAnimationFrame(applyInertia);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isDragging, INERTIA_DAMPING]);

  return (
    <div ref={canvasContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 11], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <GalleryScene
          artifacts={artifacts}
          scrollFactor={scrollFactor}
          onHoverStart={onHoverStart}
          onHoverEnd={onHoverEnd}
          isDragging={isDragging}
          dragRotation={dragRotation}
        />
      </Canvas>
    </div>
  );
}

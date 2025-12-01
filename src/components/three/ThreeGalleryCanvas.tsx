"use client";

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
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <GalleryScene
        artifacts={artifacts}
        scrollFactor={scrollFactor}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
      />
    </Canvas>
  );
}


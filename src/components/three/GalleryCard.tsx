"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { TextureLoader, MeshStandardMaterial, CanvasTexture } from "three";
import { Artifact } from "@/domain/artifact";
import * as THREE from "three";

interface GalleryCardProps {
  artifact: Artifact;
  position: [number, number, number];
  rotation?: [number, number, number];
  isActive: boolean;
  onHoverStart: (artifact: Artifact) => void;
  onHoverEnd: () => void;
  width?: number;
  height?: number;
}

// Create a fallback texture (simple gradient) - only call on client
function createFallbackTexture(): CanvasTexture | null {
  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;
  
  // Create a gradient background
  const gradient = ctx.createLinearGradient(0, 0, 512, 640);
  gradient.addColorStop(0, "#1a1a1a");
  gradient.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 640);
  
  // Add some text
  ctx.fillStyle = "#666";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Image", 256, 280);
  ctx.fillText("Loading...", 256, 320);
  
  return new CanvasTexture(canvas);
}

export default function GalleryCard({
  artifact,
  position,
  rotation = [0, 0, 0],
  isActive,
  onHoverStart,
  onHoverEnd,
  width = 2,
  height = 2.5,
}: GalleryCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Create fallback texture once (client-side only)
  const fallbackTexture = useMemo(() => {
    if (typeof document !== "undefined") {
      return createFallbackTexture();
    }
    return null;
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const loader = new TextureLoader();
    
    loader.load(
      artifact.imageUrl,
      (loadedTexture) => {
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        // Silently handle error - use fallback texture
        console.warn(`Failed to load texture for ${artifact.id}:`, error);
        if (fallbackTexture) {
          setTexture(fallbackTexture);
        }
      }
    );

    // Cleanup
    return () => {
      if (texture && texture !== fallbackTexture) {
        texture.dispose();
      }
    };
  }, [artifact.imageUrl, artifact.id, fallbackTexture]);

  // Handle hover animations
  useFrame(() => {
    if (!meshRef.current) return;

    const targetScale = hovered || isActive ? 1.05 : 1.0; // Tamed hover scale
    const currentScale = meshRef.current.scale.x;

    // Smoothly interpolate scale
    meshRef.current.scale.x = THREE.MathUtils.lerp(
      currentScale,
      targetScale,
      0.1
    );
    meshRef.current.scale.y = meshRef.current.scale.x;
    meshRef.current.scale.z = meshRef.current.scale.x;

    // Increase brightness on hover
    if (meshRef.current.material instanceof MeshStandardMaterial) {
      const targetEmissive = hovered || isActive ? 0.15 : 0; // Subtle brightness increase
      meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        meshRef.current.material.emissiveIntensity,
        targetEmissive,
        0.1
      );
    }
  });

  // Use fallback texture if there's no texture loaded yet
  const finalTexture = texture || fallbackTexture;

  if (!finalTexture) {
    return null; // Don't render on server
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHoverStart(artifact);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHoverEnd();
      }}
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={finalTexture}
        emissive="#ffffff"
        emissiveIntensity={0}
        toneMapped={false}
      />
    </mesh>
  );
}

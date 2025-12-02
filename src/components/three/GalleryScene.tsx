"use client";

import { useRef, Suspense, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, CanvasTexture } from "three";
import { Artifact } from "@/domain/artifact";
import GalleryCard from "./GalleryCard";
import * as THREE from "three";

interface GallerySceneProps {
  artifacts: Artifact[];
  scrollFactor: number;
  onHoverStart: (artifact: Artifact) => void;
  onHoverEnd: () => void;
  isDragging: boolean;
  dragRotation: number;
}

// Helper function to chunk array into groups of 4
function chunkIntoGroupsOfFour<T>(array: T[]): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += 4) {
    chunks.push(array.slice(i, i + 4));
  }
  return chunks;
}

// Create "TY" texture for central object
function createTYTexture(): CanvasTexture | null {
  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Soft gradient background
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, "#fef7f2");
  gradient.addColorStop(1, "#fefcf7");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  // "TY" text
  ctx.fillStyle = "#e8919b"; // Accent color
  ctx.font = "bold 200px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("TY", 256, 256);

  return new CanvasTexture(canvas);
}

export default function GalleryScene({
  artifacts,
  scrollFactor,
  onHoverStart,
  onHoverEnd,
  isDragging,
  dragRotation,
}: GallerySceneProps) {
  const groupRef = useRef<Group>(null);
  const baseRotationRef = useRef(0);
  const tyTexture = useMemo(() => createTYTexture(), []);

  // Constants for layout - can be tweaked
  const RADIUS = 7; // Distance from center
  const VERTICAL_SPACING = 3.5; // Vertical distance between rings
  const BASE_ROTATION_SPEED = 0.06; // Slow auto-rotation
  const SCROLL_ROTATION_RANGE = 1.2; // Scroll influence range (radians)

  // Chunk artifacts into groups of 4
  const artifactGroups = chunkIntoGroupsOfFour(artifacts);
  const numRings = artifactGroups.length;

  // Calculate positions for all cards in the cylindrical layout
  const cardData: Array<{
    artifact: Artifact;
    position: [number, number, number];
    rotation: [number, number, number];
  }> = useMemo(() => {
    const data: Array<{
      artifact: Artifact;
      position: [number, number, number];
      rotation: [number, number, number];
    }> = [];

    artifactGroups.forEach((group, ringIndex) => {
      const ANGLE_STEP = (2 * Math.PI) / 4; // 90° increments

      // Calculate Y position: center the rings vertically
      const y = (ringIndex - (numRings - 1) / 2) * VERTICAL_SPACING;

      group.forEach((artifact, itemIndex) => {
        const angle = itemIndex * ANGLE_STEP;
        const x = RADIUS * Math.cos(angle);
        const z = RADIUS * Math.sin(angle);

        // Rotation to face center: card should face inward
        const rotationY = angle + Math.PI;
        const rotationX = -0.1; // Subtle uniform tilt for depth

        data.push({
          artifact,
          position: [x, y, z],
          rotation: [rotationX, rotationY, 0],
        });
      });
    });

    return data;
  }, [artifactGroups, numRings, RADIUS, VERTICAL_SPACING]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Base slow, constant rotation (only when not dragging)
    if (!isDragging) {
      baseRotationRef.current += BASE_ROTATION_SPEED * delta;
    }

    // Map scroll factor (0-1) to a rotation offset
    const scrollRotationOffset = scrollFactor * SCROLL_ROTATION_RANGE;

    // Combine all rotation sources: base + scroll + drag
    const targetRotation =
      baseRotationRef.current + scrollRotationOffset + dragRotation;

    // Smoothly interpolate towards target rotation
    const currentRotation = groupRef.current.rotation.y;
    const rotationDiff = targetRotation - currentRotation;
    groupRef.current.rotation.y += rotationDiff * 0.03;
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.2} />

      {/* Soft light fog for depth */}
      <fog attach="fog" args={["#fefcf7", 15, 25]} />

      {/* Central "TY" object */}
      {tyTexture && (
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshStandardMaterial
            map={tyTexture}
            transparent
            emissive="#e8919b"
            emissiveIntensity={0.1}
          />
        </mesh>
      )}

      {/* Cards group - draggable */}
      <Suspense fallback={null}>
        <group ref={groupRef}>
          {cardData.map(({ artifact, position, rotation }) => (
            <GalleryCard
              key={artifact.id}
              artifact={artifact}
              position={position}
              rotation={rotation}
              isActive={false}
              onHoverStart={onHoverStart}
              onHoverEnd={onHoverEnd}
            />
          ))}
        </group>
      </Suspense>
    </>
  );
}

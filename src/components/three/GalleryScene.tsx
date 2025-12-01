"use client";

import { useRef, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { Artifact } from "@/domain/artifact";
import GalleryCard from "./GalleryCard";
import * as THREE from "three";

interface GallerySceneProps {
  artifacts: Artifact[];
  scrollFactor: number;
  onHoverStart: (artifact: Artifact) => void;
  onHoverEnd: () => void;
}

export default function GalleryScene({
  artifacts,
  scrollFactor,
  onHoverStart,
  onHoverEnd,
}: GallerySceneProps) {
  const groupRef = useRef<Group>(null);
  const rotationRef = useRef(0);
  const targetRotationRef = useRef(0);

  // Calculate cylindrical positions for cards
  const radius = 5;
  const cardPositions: Array<[number, number, number]> = artifacts.map(
    (_, index) => {
      const angle = (index / artifacts.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      // Vary Y slightly for vertical spread
      const y = (index % 3 - 1) * 0.8;
      return [x, y, z];
    }
  );

  // Calculate rotations to face center
  const cardRotations: Array<[number, number, number]> = artifacts.map(
    (_, index) => {
      const angle = (index / artifacts.length) * Math.PI * 2;
      // Face the center, slightly tilted
      return [0, angle + Math.PI, 0];
    }
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Base slow rotation
    const baseSpeed = 0.1;
    rotationRef.current += baseSpeed * delta;

    // Add scroll influence (scrollFactor is 0-1, map to rotation range)
    targetRotationRef.current = rotationRef.current + scrollFactor * 2;

    // Smoothly interpolate towards target rotation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationRef.current,
      0.05
    );
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />

      {/* Optional fog for depth */}
      <fog attach="fog" args={["#000000", 10, 20]} />

      {/* Cards group */}
      <Suspense fallback={null}>
        <group ref={groupRef}>
          {artifacts.map((artifact, index) => (
            <GalleryCard
              key={artifact.id}
              artifact={artifact}
              position={cardPositions[index]}
              rotation={cardRotations[index]}
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


import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Dimensions, SurfaceFinish } from "../types";

interface CuboidBoxModelProps {
  dimensions: Dimensions;
  colorHex: string;
  surfaceFinish: SurfaceFinish;
  isLidRemoved: boolean;
  onToggleLid: () => void;
  goldEmbossing: boolean;
  embossText: string;
}

export const CuboidBoxModel: React.FC<CuboidBoxModelProps> = ({
  dimensions,
  colorHex,
  surfaceFinish,
  isLidRemoved,
  onToggleLid,
  goldEmbossing,
  embossText,
}) => {
  const lidGroupRef = useRef<THREE.Group>(null);
  const animProgress = useRef<number>(isLidRemoved ? 1 : 0);
  const [hoveredLid, setHoveredLid] = useState(false);

  // Dimensions in Three.js scene units (100mm = 1.0 unit)
  const w = dimensions.width / 100;
  const h = dimensions.height / 100;
  const d = dimensions.depth / 100;
  const t = 0.038; // Wall thickness (approx 3.8mm scaled)
  const clearance = 0.008;

  const lidRimH = Math.min(h * 0.4, 0.3);
  const lw = w + (clearance + t) * 2;
  const ld = d + (clearance + t) * 2;

  // Material properties based on selected surface finish
  const materialProps = React.useMemo(() => {
    switch (surfaceFinish) {
      case "metallic":
        return {
          metalness: 0.85,
          roughness: 0.22,
          clearcoat: 0.9,
          clearcoatRoughness: 0.1,
        };
      case "glossy":
        return {
          metalness: 0.15,
          roughness: 0.12,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
        };
      case "textured":
        return {
          metalness: 0.05,
          roughness: 0.85,
          clearcoat: 0.0,
        };
      case "velvet":
        return {
          metalness: 0.1,
          roughness: 0.95,
          clearcoat: 0.2,
        };
      case "matte":
      default:
        return {
          metalness: 0.08,
          roughness: 0.45,
          clearcoat: 0.4,
          clearcoatRoughness: 0.2,
        };
    }
  }, [surfaceFinish]);

  const boxColor = new THREE.Color(colorHex);
  // Interior paper: subtle elegant tint matching exterior
  const interiorColor = new THREE.Color(colorHex).offsetHSL(0, -0.05, 0.08);

  // Smooth animation for lid separation and placement beside box
  useFrame((_, delta) => {
    const target = isLidRemoved ? 1 : 0;
    // Smooth damp towards target
    animProgress.current = THREE.MathUtils.damp(animProgress.current, target, 7, delta);
    const p = animProgress.current;

    if (lidGroupRef.current) {
      // Resting on closed box
      const closedY = h - lidRimH + t;
      const liftY = h + 0.45; // Lift up high enough to completely clear the box
      const targetSideX = w / 2 + lw / 2 + 0.35; // Placed beside box
      const targetFloorY = lidRimH / 2 + 0.01; // Placed just on the ground floor beside box

      let currentX = 0;
      let currentY = closedY;
      let currentZ = 0;
      let rotZ = 0;

      if (p <= 0.4) {
        // Phase 1: Lift straight UP
        const step = p / 0.4;
        const eased = THREE.MathUtils.smoothstep(step, 0, 1);
        currentY = THREE.MathUtils.lerp(closedY, liftY, eased);
      } else if (p <= 0.75) {
        // Phase 2: Move horizontally across X beside the box
        const step = (p - 0.4) / 0.35;
        const eased = THREE.MathUtils.smoothstep(step, 0, 1);
        currentX = THREE.MathUtils.lerp(0, targetSideX, eased);
        currentY = liftY;
      } else {
        // Phase 3: Lower down to the ground beside the box
        const step = (p - 0.75) / 0.25;
        const eased = THREE.MathUtils.smoothstep(step, 0, 1);
        currentX = targetSideX;
        currentY = THREE.MathUtils.lerp(liftY, targetFloorY, eased);
      }

      lidGroupRef.current.position.set(currentX, currentY, currentZ);
      lidGroupRef.current.rotation.z = rotZ;
    }
  });

  return (
    <group position={[isLidRemoved ? -w * 0.25 : 0, 0, 0]}>
      {/* ============================================================== */}
      {/* 1. HOLLOW BOX BASE (Nothing inside, pure hollow interior)       */}
      {/* ============================================================== */}
      <group position={[0, 0, 0]}>
        {/* Bottom panel */}
        <mesh position={[0, t / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, t, d]} />
          <meshPhysicalMaterial
            color={boxColor}
            {...materialProps}
          />
        </mesh>

        {/* Interior bottom floor liner */}
        <mesh position={[0, t + 0.001, 0]} receiveShadow>
          <planeGeometry args={[w - 2 * t - 0.002, d - 2 * t - 0.002]} />
          <meshPhysicalMaterial
            color={interiorColor}
            roughness={0.65}
            metalness={0.05}
          />
        </mesh>

        {/* Inner subtle branded stamp on bottom floor */}
        {goldEmbossing && (
          <mesh position={[0, t + 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[Math.min(w, d) * 0.15, 32]} />
            <meshStandardMaterial
              color="#d4af37"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        )}

        {/* Front wall */}
        <mesh
          position={[0, t + (h - t) / 2, d / 2 - t / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[w, h - t, t]} />
          <meshPhysicalMaterial color={boxColor} {...materialProps} />
        </mesh>

        {/* Back wall */}
        <mesh
          position={[0, t + (h - t) / 2, -d / 2 + t / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[w, h - t, t]} />
          <meshPhysicalMaterial color={boxColor} {...materialProps} />
        </mesh>

        {/* Left wall */}
        <mesh
          position={[-w / 2 + t / 2, t + (h - t) / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[t, h - t, d - 2 * t]} />
          <meshPhysicalMaterial color={boxColor} {...materialProps} />
        </mesh>

        {/* Right wall */}
        <mesh
          position={[w / 2 - t / 2, t + (h - t) / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[t, h - t, d - 2 * t]} />
          <meshPhysicalMaterial color={boxColor} {...materialProps} />
        </mesh>

        {/* Top Rim Edges Highlight for luxury paper wrapped look */}
        <mesh position={[0, h, 0]}>
          <boxGeometry args={[w + 0.002, 0.004, d + 0.002]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.6}
            roughness={0.3}
            wireframe
          />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 2. MATCHING LID (Completely separable, sits beside box)       */}
      {/* ============================================================== */}
      <group
        ref={lidGroupRef}
        position={[0, h - lidRimH + t, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onToggleLid();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredLid(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHoveredLid(false);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Lid Top Plate */}
        <mesh
          position={[0, lidRimH / 2 + t / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[lw, t, ld]} />
          <meshPhysicalMaterial
            color={hoveredLid ? new THREE.Color(colorHex).offsetHSL(0, 0, 0.05) : boxColor}
            {...materialProps}
          />
        </mesh>

        {/* Outer Gold Hot-Stamping / Embossed Luxury Foil Emblem on Lid Top */}
        <group position={[0, lidRimH / 2 + t + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* Outer Gold Border Frame */}
          <mesh>
            <planeGeometry args={[lw * 0.75, ld * 0.75]} />
            <meshStandardMaterial
              color="#d4af37"
              metalness={0.92}
              roughness={0.18}
              wireframe
            />
          </mesh>

          {/* Centered Luxury Logo Crest */}
          <mesh position={[0, 0, 0.001]}>
            <circleGeometry args={[Math.min(lw, ld) * 0.16, 32]} />
            <meshStandardMaterial
              color="#d4af37"
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>

          {/* Inner Accent Ring */}
          <mesh position={[0, 0, 0.002]}>
            <ringGeometry
              args={[Math.min(lw, ld) * 0.19, Math.min(lw, ld) * 0.22, 32]}
            />
            <meshStandardMaterial
              color="#ffd700"
              metalness={0.98}
              roughness={0.1}
            />
          </mesh>
        </group>

        {/* Lid Skirt Walls (Hanging down around the box) */}
        {/* Front Skirt */}
        <mesh position={[0, 0, ld / 2 - t / 2]} castShadow receiveShadow>
          <boxGeometry args={[lw, lidRimH, t]} />
          <meshPhysicalMaterial color={boxColor} {...materialProps} />
        </mesh>

        {/* Back Skirt */}
        <mesh position={[0, 0, -ld / 2 + t / 2]} castShadow receiveShadow>
          <boxGeometry args={[lw, lidRimH, t]} />
          <meshPhysicalMaterial color={boxColor} {...materialProps} />
        </mesh>

        {/* Left Skirt */}
        <mesh position={[-lw / 2 + t / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[t, lidRimH, ld - 2 * t]} />
          <meshPhysicalMaterial color={boxColor} {...materialProps} />
        </mesh>

        {/* Right Skirt */}
        <mesh position={[lw / 2 - t / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[t, lidRimH, ld - 2 * t]} />
          <meshPhysicalMaterial color={boxColor} {...materialProps} />
        </mesh>

        {/* Subtle decorative gold trim line along bottom rim of lid */}
        <mesh position={[0, -lidRimH / 2, 0]}>
          <boxGeometry args={[lw + 0.002, 0.006, ld + 0.002]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
};

export default CuboidBoxModel;

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Dimensions, SurfaceFinish } from "../types";

interface ClothPacketModelProps {
  dimensions: Dimensions;
  colorHex: string;
  surfaceFinish: SurfaceFinish;
  isPocketOpen: boolean;
  onTogglePocket: () => void;
  goldEmbossing: boolean;
  embossText: string;
}

export const ClothPacketModel: React.FC<ClothPacketModelProps> = ({
  dimensions,
  colorHex,
  surfaceFinish,
  isPocketOpen,
  onTogglePocket,
  goldEmbossing,
  embossText,
}) => {
  const neckGroupRef = useRef<THREE.Group>(null);
  const leftCordGroupRef = useRef<THREE.Group>(null);
  const rightCordGroupRef = useRef<THREE.Group>(null);
  const mouthRingRef = useRef<THREE.Mesh>(null);
  const animProgress = useRef<number>(isPocketOpen ? 1 : 0);
  const [hovered, setHovered] = useState(false);

  // Scaled dimensions: 100mm = 1.0 unit
  const w = dimensions.width / 100;
  const h = dimensions.height / 100;
  const d = dimensions.depth / 100;

  const clothColor = new THREE.Color(colorHex);

  // Cloth material properties: velvet / silk / satin sheen
  const clothMatProps = React.useMemo(() => {
    switch (surfaceFinish) {
      case "silk":
      case "glossy":
        return {
          roughness: 0.28,
          metalness: 0.15,
          clearcoat: 0.8,
          clearcoatRoughness: 0.2,
        };
      case "metallic":
        return {
          roughness: 0.35,
          metalness: 0.7,
          clearcoat: 0.6,
        };
      case "textured":
      case "velvet":
      default:
        // Velvet plush with soft sheen
        return {
          roughness: 0.88,
          metalness: 0.05,
          clearcoat: 0.3,
          clearcoatRoughness: 0.6,
        };
    }
  }, [surfaceFinish]);

  // Animated opening/closing of the cloth pocket and pulling/loosening of threads
  useFrame((_, delta) => {
    const target = isPocketOpen ? 1 : 0;
    animProgress.current = THREE.MathUtils.damp(animProgress.current, target, 7, delta);
    const p = animProgress.current;

    // 1. Neck collar & mouth scaling:
    // Closed (p=0): neck scale in X & Z is tight ~0.25
    // Open (p=1): neck scale in X & Z expands to ~1.0
    if (neckGroupRef.current) {
      const scaleXZ = THREE.MathUtils.lerp(0.3, 1.05, p);
      neckGroupRef.current.scale.set(scaleXZ, 1, scaleXZ);
    }

    if (mouthRingRef.current) {
      const mouthScale = THREE.MathUtils.lerp(0.15, 1.0, p);
      mouthRingRef.current.scale.set(mouthScale, 1, mouthScale);
    }

    // 2. Drawstring threads:
    // Closed (p=0): threads pulled tight outward to the sides (pulled out distance ~ w*0.45)
    // Open (p=1): threads relaxed inward towards pouch neck (pulled distance ~ w*0.12)
    const cordExtension = THREE.MathUtils.lerp(w * 0.42, w * 0.12, p);

    if (leftCordGroupRef.current) {
      leftCordGroupRef.current.position.x = -w * 0.25 - cordExtension;
      leftCordGroupRef.current.rotation.z = THREE.MathUtils.lerp(-0.15, 0.25, p);
    }

    if (rightCordGroupRef.current) {
      rightCordGroupRef.current.position.x = w * 0.25 + cordExtension;
      rightCordGroupRef.current.rotation.z = THREE.MathUtils.lerp(0.15, -0.25, p);
    }
  });

  const pouchRadiusX = w * 0.48;
  const pouchHeight = h * 0.72;
  const pouchRadiusZ = d * 0.46;
  const neckY = pouchHeight * 0.48;

  return (
    <group
      position={[0, h * 0.45, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onTogglePocket();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* ============================================================== */}
      {/* 1. SOFT CLOTH POUCH MAIN BODY                                  */}
      {/* ============================================================== */}
      <group position={[0, -0.05, 0]}>
        {/* Lower rounded cloth body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <sphereGeometry args={[1, 32, 24]} />
          <meshPhysicalMaterial
            color={hovered ? new THREE.Color(colorHex).offsetHSL(0, 0, 0.04) : clothColor}
            {...clothMatProps}
          />
        </mesh>
      </group>

      {/* Rescale the spherical base into pouch proportions */}
      {/* Apply scale to pouch body via parent transform */}
      <group scale={[pouchRadiusX, pouchHeight * 0.55, pouchRadiusZ]} position={[0, -h * 0.12, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1, 32, 24]} />
          <meshPhysicalMaterial color={clothColor} {...clothMatProps} />
        </mesh>
      </group>

      {/* Flat bottom base for realistic sitting on table */}
      <mesh
        position={[0, -h * 0.38, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[Math.min(w, d) * 0.35, 32]} />
        <meshPhysicalMaterial color={clothColor} {...clothMatProps} />
      </mesh>

      {/* Mid Pouch Transition (Cloth folds) */}
      <mesh
        position={[0, neckY * 0.5, 0]}
        scale={[pouchRadiusX * 0.82, pouchHeight * 0.28, pouchRadiusZ * 0.82]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.9, 1.1, 1, 28]} />
        <meshPhysicalMaterial color={clothColor} {...clothMatProps} />
      </mesh>

      {/* Front Gold Crest / Embroidery on Velvet */}
      {goldEmbossing && (
        <group position={[0, -h * 0.05, pouchRadiusZ + 0.005]}>
          <mesh>
            <circleGeometry args={[Math.min(w, h) * 0.12, 32]} />
            <meshStandardMaterial
              color="#d4af37"
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0, 0.001]}>
            <ringGeometry
              args={[
                Math.min(w, h) * 0.15,
                Math.min(w, h) * 0.17,
                32,
              ]}
            />
            <meshStandardMaterial
              color="#ffd700"
              metalness={0.98}
              roughness={0.12}
            />
          </mesh>
        </group>
      )}

      {/* ============================================================== */}
      {/* 2. GATHERED NECK COLLAR & RUFFLES (Expands/cinches on thread)  */}
      {/* ============================================================== */}
      <group position={[0, neckY, 0]}>
        {/* Drawstring Channel Belt around neck */}
        <mesh castShadow receiveShadow>
          <torusGeometry args={[Math.min(w, d) * 0.32, 0.032, 16, 32]} />
          <meshStandardMaterial
            color="#b8860b"
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>

        {/* Dynamic Neck & Ruffle Mouth Group */}
        <group ref={neckGroupRef}>
          {/* Top flared fabric collar / ruffle */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <cylinderGeometry
              args={[
                Math.min(w, d) * 0.42,
                Math.min(w, d) * 0.3,
                0.22,
                24,
                1,
                true,
              ]}
            />
            <meshPhysicalMaterial
              color={clothColor}
              {...clothMatProps}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Ruffle scalloped pleats */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const r = Math.min(w, d) * 0.38;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * r, 0.14, Math.sin(angle) * r]}
                scale={[0.04, 0.08, 0.04]}
              >
                <sphereGeometry args={[1, 12, 12]} />
                <meshPhysicalMaterial color={clothColor} {...clothMatProps} />
              </mesh>
            );
          })}
        </group>

        {/* Pocket Opening Interior Cavity */}
        <mesh
          ref={mouthRingRef}
          position={[0, 0.12, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[Math.min(w, d) * 0.34, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 3. DRAWSTRING THREADS WITH GOLD BEADS & TASSELS                */}
      {/* ============================================================== */}
      {/* LEFT DRAWSTRING THREAD */}
      <group ref={leftCordGroupRef} position={[-w * 0.35, neckY, 0]}>
        {/* Horizontal Thread / Cord */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.35, 12]} />
          <meshStandardMaterial
            color="#ffd700"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        {/* Hanging Cord Loop */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.32, 12]} />
          <meshStandardMaterial
            color="#ffd700"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        {/* Metallic Gold Bead / Aglet */}
        <mesh position={[0, -0.32, 0]} castShadow>
          <sphereGeometry args={[0.038, 16, 16]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>

        {/* Silk Tassel hanging below bead */}
        <mesh position={[0, -0.42, 0]} castShadow>
          <coneGeometry args={[0.035, 0.16, 16]} />
          <meshPhysicalMaterial
            color="#ffd700"
            roughness={0.5}
            metalness={0.4}
          />
        </mesh>
      </group>

      {/* RIGHT DRAWSTRING THREAD */}
      <group ref={rightCordGroupRef} position={[w * 0.35, neckY, 0]}>
        {/* Horizontal Thread / Cord */}
        <mesh rotation={[0, 0, -Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.35, 12]} />
          <meshStandardMaterial
            color="#ffd700"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        {/* Hanging Cord Loop */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.32, 12]} />
          <meshStandardMaterial
            color="#ffd700"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        {/* Metallic Gold Bead / Aglet */}
        <mesh position={[0, -0.32, 0]} castShadow>
          <sphereGeometry args={[0.038, 16, 16]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>

        {/* Silk Tassel hanging below bead */}
        <mesh position={[0, -0.42, 0]} castShadow>
          <coneGeometry args={[0.035, 0.16, 16]} />
          <meshPhysicalMaterial
            color="#ffd700"
            roughness={0.5}
            metalness={0.4}
          />
        </mesh>
      </group>
    </group>
  );
};

export default ClothPacketModel;

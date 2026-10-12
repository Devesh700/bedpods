import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Dimensions, SurfaceFinish } from "../types";

interface PaperPacketModelProps {
  dimensions: Dimensions;
  colorHex: string;
  surfaceFinish: SurfaceFinish;
  isFlapOpen: boolean;
  onToggleFlap: () => void;
  goldEmbossing: boolean;
  embossText: string;
}

export const PaperPacketModel: React.FC<PaperPacketModelProps> = ({
  dimensions,
  colorHex,
  surfaceFinish,
  isFlapOpen,
  onToggleFlap,
  goldEmbossing,
  embossText,
}) => {
  const flapGroupRef = useRef<THREE.Group>(null);
  const animProgress = useRef<number>(isFlapOpen ? 1 : 0);
  const [hovered, setHovered] = useState(false);

  // Scaled dimensions: 100mm = 1.0 unit
  const w = dimensions.width / 100;
  const h = dimensions.height / 100;
  const d = Math.max(dimensions.depth / 100, 0.08); // Slim packet thickness
  const paperT = 0.015; // Paper thickness
  const flapH = Math.min(h * 0.45, 0.55);

  const paperColor = new THREE.Color(colorHex);
  const interiorPaperColor = new THREE.Color(colorHex).offsetHSL(0, -0.05, 0.06);

  // Material settings for paper packet
  const paperMatProps = React.useMemo(() => {
    switch (surfaceFinish) {
      case "metallic":
        return {
          metalness: 0.75,
          roughness: 0.28,
          clearcoat: 0.6,
        };
      case "glossy":
        return {
          metalness: 0.1,
          roughness: 0.2,
          clearcoat: 0.9,
        };
      case "textured":
        return {
          metalness: 0.0,
          roughness: 0.9,
          clearcoat: 0.0,
        };
      default:
        // Luxury matte cardstock
        return {
          metalness: 0.05,
          roughness: 0.6,
          clearcoat: 0.2,
          clearcoatRoughness: 0.4,
        };
    }
  }, [surfaceFinish]);

  // Triangular flap shape
  const flapShape = React.useMemo(() => {
    const shape = new THREE.Shape();
    // Starts at top-left hinge
    shape.moveTo(-w / 2, 0);
    // Across to top-right hinge
    shape.lineTo(w / 2, 0);
    // Down right bevel
    shape.lineTo(w / 2 - 0.04, -flapH * 0.4);
    // Down to center pointed tip
    shape.lineTo(0, -flapH);
    // Up left bevel
    shape.lineTo(-w / 2 + 0.04, -flapH * 0.4);
    shape.closePath();
    return shape;
  }, [w, flapH]);

  // Smooth Flap open/close animation
  useFrame((_, delta) => {
    const target = isFlapOpen ? 1 : 0;
    animProgress.current = THREE.MathUtils.damp(animProgress.current, target, 8, delta);
    const p = animProgress.current;

    if (flapGroupRef.current) {
      // Rotate flap around top hinge: 0 rad (closed, lying down) -> -2.4 rad (flipped open upwards and back)
      const maxRotX = -Math.PI * 0.72;
      flapGroupRef.current.rotation.x = THREE.MathUtils.lerp(0, maxRotX, p);
    }
  });

  return (
    <group
      position={[0, h / 2, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onToggleFlap();
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
      {/* 1. MAIN PACKET BODY (Hollow luxury paper pocket)               */}
      {/* ============================================================== */}
      <group position={[0, 0, 0]}>
        {/* Back Panel */}
        <mesh position={[0, 0, -d / 2 + paperT / 2]} castShadow receiveShadow>
          <boxGeometry args={[w, h, paperT]} />
          <meshPhysicalMaterial
            color={hovered ? new THREE.Color(colorHex).offsetHSL(0, 0, 0.03) : paperColor}
            {...paperMatProps}
          />
        </mesh>

        {/* Front Panel (slight cutout at top pocket rim) */}
        <mesh
          position={[0, -0.04, d / 2 - paperT / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[w, h - 0.08, paperT]} />
          <meshPhysicalMaterial color={paperColor} {...paperMatProps} />
        </mesh>

        {/* Left Folded Seam / Gusset */}
        <mesh position={[-w / 2 + paperT / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[paperT, h, d]} />
          <meshPhysicalMaterial color={paperColor} {...paperMatProps} />
        </mesh>

        {/* Right Folded Seam / Gusset */}
        <mesh position={[w / 2 - paperT / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[paperT, h, d]} />
          <meshPhysicalMaterial color={paperColor} {...paperMatProps} />
        </mesh>

        {/* Bottom Folded Base */}
        <mesh position={[0, -h / 2 + paperT / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, paperT, d]} />
          <meshPhysicalMaterial color={paperColor} {...paperMatProps} />
        </mesh>

        {/* Interior Paper Lining visible when opened */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[w - paperT * 2 - 0.005, h - paperT * 2 - 0.05, d - paperT * 2 - 0.005]} />
          <meshPhysicalMaterial
            color={interiorPaperColor}
            roughness={0.7}
            metalness={0.0}
          />
        </mesh>

        {/* Front Foil Stamped Logo / Crest */}
        {goldEmbossing && (
          <group position={[0, -h * 0.15, d / 2 + 0.001]}>
            {/* Outer foil frame */}
            <mesh>
              <planeGeometry args={[w * 0.5, h * 0.22]} />
              <meshStandardMaterial
                color="#d4af37"
                metalness={0.95}
                roughness={0.2}
                wireframe
              />
            </mesh>
            {/* Center foil insignia */}
            <mesh position={[0, 0, 0.001]}>
              <circleGeometry args={[Math.min(w, h) * 0.1, 32]} />
              <meshStandardMaterial
                color="#ffd700"
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
          </group>
        )}
      </group>

      {/* ============================================================== */}
      {/* 2. TOP FOLDING FLAP (Hinged at top-back edge)                   */}
      {/* ============================================================== */}
      <group
        ref={flapGroupRef}
        position={[0, h / 2, d / 2]}
      >
        {/* Triangular paper flap with bevel */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <extrudeGeometry
            args={[
              flapShape,
              {
                depth: paperT,
                bevelEnabled: true,
                bevelThickness: 0.004,
                bevelSize: 0.004,
                bevelSegments: 2,
              },
            ]}
          />
          <meshPhysicalMaterial
            color={paperColor}
            {...paperMatProps}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Gold Seal Sticker / Hot-Stamping on the flap tip */}
        <group position={[0, -flapH * 0.72, paperT + 0.002]}>
          <mesh castShadow>
            <circleGeometry args={[Math.min(w, flapH) * 0.18, 32]} />
            <meshStandardMaterial
              color="#d4af37"
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>
          <mesh position={[0, 0, 0.001]}>
            <ringGeometry
              args={[
                Math.min(w, flapH) * 0.12,
                Math.min(w, flapH) * 0.15,
                32,
              ]}
            />
            <meshStandardMaterial
              color="#ffd700"
              metalness={0.98}
              roughness={0.1}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export default PaperPacketModel;

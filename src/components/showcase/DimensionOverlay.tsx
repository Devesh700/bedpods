import React from "react";
import { Html } from "@react-three/drei";
import { Dimensions } from "./types";

interface DimensionOverlayProps {
  dimensions: Dimensions;
  visible: boolean;
  offsetY?: number;
}

export const DimensionOverlay: React.FC<DimensionOverlayProps> = ({
  dimensions,
  visible,
  offsetY = 0,
}) => {
  if (!visible) return null;

  const w = dimensions.width / 100;
  const h = dimensions.height / 100;
  const d = dimensions.depth / 100;
  const barThickness = 0.006;

  return (
    <group position={[0, offsetY, 0]}>
      {/* ============================================================== */}
      {/* WIDTH (X axis) Dimension bar in front                          */}
      {/* ============================================================== */}
      <group position={[0, -0.015, d / 2 + 0.16]}>
        {/* Horizontal bar */}
        <mesh>
          <boxGeometry args={[w, barThickness, barThickness]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        {/* Left end cap */}
        <mesh position={[-w / 2, 0, 0]}>
          <boxGeometry args={[barThickness, 0.04, barThickness]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        {/* Right end cap */}
        <mesh position={[w / 2, 0, 0]}>
          <boxGeometry args={[barThickness, 0.04, barThickness]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        <Html position={[0, -0.05, 0]} center distanceFactor={7}>
          <div className="px-2 py-0.5 rounded-md bg-pure-black/90 text-amber-400 text-[10px] font-mono font-bold whitespace-nowrap border border-amber-400/40 shadow-lg pointer-events-none select-none">
            W: {dimensions.width} mm
          </div>
        </Html>
      </group>

      {/* ============================================================== */}
      {/* HEIGHT (Y axis) Dimension bar on left side                     */}
      {/* ============================================================== */}
      <group position={[-w / 2 - 0.16, h / 2, 0]}>
        {/* Vertical bar */}
        <mesh>
          <boxGeometry args={[barThickness, h, barThickness]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        {/* Top end cap */}
        <mesh position={[0, h / 2, 0]}>
          <boxGeometry args={[0.04, barThickness, barThickness]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        {/* Bottom end cap */}
        <mesh position={[0, -h / 2, 0]}>
          <boxGeometry args={[0.04, barThickness, barThickness]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        <Html position={[-0.05, 0, 0]} center distanceFactor={7}>
          <div className="px-2 py-0.5 rounded-md bg-pure-black/90 text-amber-400 text-[10px] font-mono font-bold whitespace-nowrap border border-amber-400/40 shadow-lg pointer-events-none select-none">
            H: {dimensions.height} mm
          </div>
        </Html>
      </group>

      {/* ============================================================== */}
      {/* DEPTH (Z axis) Dimension bar on right side                     */}
      {/* ============================================================== */}
      <group position={[w / 2 + 0.16, -0.015, 0]}>
        {/* Depth bar */}
        <mesh>
          <boxGeometry args={[barThickness, barThickness, d]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        {/* Front end cap */}
        <mesh position={[0, 0, d / 2]}>
          <boxGeometry args={[barThickness, 0.04, barThickness]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        {/* Back end cap */}
        <mesh position={[0, 0, -d / 2]}>
          <boxGeometry args={[barThickness, 0.04, barThickness]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        <Html position={[0.05, 0, 0]} center distanceFactor={7}>
          <div className="px-2 py-0.5 rounded-md bg-pure-black/90 text-amber-400 text-[10px] font-mono font-bold whitespace-nowrap border border-amber-400/40 shadow-lg pointer-events-none select-none">
            D: {dimensions.depth} mm
          </div>
        </Html>
      </group>
    </group>
  );
};

export default DimensionOverlay;

import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw, Maximize2, Minimize2 } from "lucide-react";
import { ShowcaseState } from "./types";
import CuboidBoxModel from "./models/CuboidBoxModel";
// Commented out other box models for now
// import PaperPacketModel from "./models/PaperPacketModel";
// import ClothPacketModel from "./models/ClothPacketModel";

interface MallShowcaseViewerProps {
  state: ShowcaseState;
  onToggleAction: () => void;
  onToggleAutoRotate: () => void;
  onChangeLighting: (preset: "boutique" | "studio" | "jewel-dark") => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const MallShowcaseViewer: React.FC<MallShowcaseViewerProps> = ({
  state,
  onToggleAction,
  onToggleAutoRotate,
  onChangeLighting,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const controlsRef = useRef<any>(null);

  // Active color calculation
  const currentColorHex = state.selectedColor ? state.selectedColor.hex : state.customHex;

  // Camera presets
  const handleSetCameraView = (type: "front" | "top" | "iso") => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    if (type === "front") {
      controls.object.position.set(0, 0.4, 2.3);
      controls.target.set(0, 0.4, 0);
    } else if (type === "top") {
      controls.object.position.set(0, 2.6, 0.01);
      controls.target.set(0, 0.2, 0);
    } else if (type === "iso") {
      controls.object.position.set(1.6, 1.4, 2.0);
      controls.target.set(0, 0.3, 0);
    }
    controls.update();
  };

  // Action Button Text & State (Cuboid Box is active)
  const actionInfo = {
    label: state.isLidRemoved ? "Replace Lid On Box" : "Remove Lid (Place Beside)",
    sublabel: state.isLidRemoved ? "Lid placed beside hollow box" : "Lift & place beside box",
    active: state.isLidRemoved,
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-[#181a20] via-[#0d0e12] to-[#07080a] select-none overflow-hidden">
      {/* ============================================================== */}
      {/* TOP FLOATING MALL KIOSK HUD BAR                                */}
      {/* ============================================================== */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Left: 360° Showcase Badge (Clean, without ping icons) */}
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pure-black/80 backdrop-blur-md border border-amber-400/30 text-pure-white shadow-xl">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span className="text-xs font-bold tracking-wide uppercase text-amber-300">
            360° View
          </span>
          <span className="text-pure-white/30 text-xs">|</span>
          <span className="text-[11px] text-pure-white/70 font-medium">
            Drag to Rotate
          </span>
        </div>

        {/* Right HUD Controls: Camera Views, Lights, Auto-Rotate, Fullscreen */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Quick Camera Views */}
          <div className="hidden sm:flex items-center bg-pure-black/80 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-xl">
            <button
              onClick={() => handleSetCameraView("iso")}
              className="px-2.5 py-1 text-[11px] font-semibold text-pure-white/80 hover:text-amber-400 hover:bg-white/5 rounded-full transition-all"
              title="Isometric 3D View"
            >
              Perspective
            </button>
            <button
              onClick={() => handleSetCameraView("front")}
              className="px-2.5 py-1 text-[11px] font-semibold text-pure-white/80 hover:text-amber-400 hover:bg-white/5 rounded-full transition-all"
              title="Front View"
            >
              Front
            </button>
            <button
              onClick={() => handleSetCameraView("top")}
              className="px-2.5 py-1 text-[11px] font-semibold text-pure-white/80 hover:text-amber-400 hover:bg-white/5 rounded-full transition-all"
              title="Top View"
            >
              Top
            </button>
          </div>

          {/* Lighting Mode Selector */}
          <div className="flex items-center bg-pure-black/80 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-xl">
            <button
              onClick={() =>
                onChangeLighting(
                  state.lightingPreset === "boutique"
                    ? "studio"
                    : state.lightingPreset === "studio"
                    ? "jewel-dark"
                    : "boutique"
                )
              }
              className="px-3 py-1 text-[11px] font-semibold text-pure-white/90 hover:text-amber-400 rounded-full transition-all"
              title="Change Lighting"
            >
              <span className="capitalize">{state.lightingPreset} Light</span>
            </button>
          </div>

          {/* Auto-Rotate Turntable Toggle */}
          <button
            onClick={onToggleAutoRotate}
            className={`p-2 rounded-full backdrop-blur-md border transition-all shadow-xl ${
              state.autoRotate
                ? "bg-amber-500/20 text-amber-400 border-amber-400/50"
                : "bg-pure-black/80 text-pure-white/80 border-white/10 hover:text-pure-white"
            }`}
            title="Toggle 360° Auto-Rotate"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Mall Kiosk Fullscreen Mode */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-full bg-pure-black/80 backdrop-blur-md text-pure-white/80 hover:text-pure-white border border-white/10 transition-all shadow-xl"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3D WEBGL RENDERING CANVAS                                      */}
      {/* ============================================================== */}
      <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [1.6, 1.3, 2.0], fov: 38 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
        >
          {/* Studio & Boutique Lighting Setup */}
          {state.lightingPreset === "boutique" && (
            <>
              <ambientLight intensity={0.9} />
              <directionalLight
                position={[4, 6, 4]}
                intensity={1.8}
                castShadow
                shadow-mapSize={[2048, 2048]}
              />
              <directionalLight position={[-4, 3, -3]} intensity={0.9} color="#ffd19a" />
              <pointLight position={[0, 3, 2]} intensity={2.0} color="#ffdf7e" />
              <pointLight position={[0, -1, 0]} intensity={0.5} color="#d4af37" />
              <Environment preset="city" />
            </>
          )}

          {state.lightingPreset === "studio" && (
            <>
              <ambientLight intensity={1.2} />
              <directionalLight
                position={[5, 8, 5]}
                intensity={2.2}
                castShadow
                shadow-mapSize={[2048, 2048]}
              />
              <directionalLight position={[-5, 4, -4]} intensity={1.1} />
              <pointLight position={[0, 4, 3]} intensity={1.5} color="#ffffff" />
              <Environment preset="studio" />
            </>
          )}

          {state.lightingPreset === "jewel-dark" && (
            <>
              <ambientLight intensity={0.4} />
              <spotLight
                position={[0, 6, 2]}
                intensity={3.8}
                angle={0.6}
                penumbra={0.8}
                castShadow
                color="#fff5db"
              />
              <directionalLight position={[-3, 2, -3]} intensity={0.4} color="#3b82f6" />
              <pointLight position={[2, 2, 2]} intensity={1.2} color="#f59e0b" />
              <Environment preset="night" />
            </>
          )}

          {/* Interactive Pedestal Showcase Disc */}
          <mesh position={[0, -0.002, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.2, 64]} />
            <meshStandardMaterial
              color="#0d0f14"
              roughness={0.7}
              metalness={0.3}
            />
          </mesh>

          {/* Outer Gold Pedestal Accent Ring */}
          <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.18, 2.2, 64]} />
            <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.15} />
          </mesh>

          {/* Realistic Soft Contact Shadow on Floor */}
          <ContactShadows
            position={[0, -0.005, 0]}
            opacity={0.7}
            scale={6}
            blur={1.8}
            far={1.6}
          />

          {/* 360° Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            autoRotate={state.autoRotate}
            autoRotateSpeed={1.5}
            enablePan={true}
            panSpeed={0.8}
            rotateSpeed={0.8}
            zoomSpeed={0.9}
            minDistance={0.8}
            maxDistance={5.0}
            maxPolarAngle={Math.PI / 2 - 0.02} // Prevent camera going below floor
            minPolarAngle={0.05}
          />

          {/* 3D Cuboid Box Model with Separable Lid */}
          <Suspense fallback={null}>
            <CuboidBoxModel
              dimensions={state.dimensions}
              colorHex={currentColorHex}
              surfaceFinish={state.surfaceFinish}
              isLidRemoved={state.isLidRemoved}
              onToggleLid={onToggleAction}
              goldEmbossing={state.goldEmbossing}
              embossText={state.embossText}
            />

            {/* Other box models commented out for now:
            {state.boxType === "paper-packet" && (
              <PaperPacketModel
                dimensions={state.dimensions}
                colorHex={currentColorHex}
                surfaceFinish={state.surfaceFinish}
                isFlapOpen={state.isFlapOpen}
                onToggleFlap={onToggleAction}
                goldEmbossing={state.goldEmbossing}
                embossText={state.embossText}
              />
            )}
            {state.boxType === "cloth-packet" && (
              <ClothPacketModel
                dimensions={state.dimensions}
                colorHex={currentColorHex}
                surfaceFinish={state.surfaceFinish}
                isPocketOpen={state.isClothPocketOpen}
                onTogglePocket={onToggleAction}
                goldEmbossing={state.goldEmbossing}
                embossText={state.embossText}
              />
            )}
            */}
          </Suspense>
        </Canvas>
      </div>

      {/* ============================================================== */}
      {/* BOTTOM FLOATING ACTION BUTTON (PRIMARY SHOWCASE INTERACTION)   */}
      {/* ============================================================== */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-auto">
        <button
          onClick={onToggleAction}
          className={`flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-sm tracking-wide uppercase shadow-2xl transition-all duration-300 transform active:scale-95 border ${
            actionInfo.active
              ? "bg-amber-400 text-pure-black border-amber-300 hover:bg-amber-300 ring-2 ring-amber-400/30"
              : "bg-pure-black/90 text-pure-white border-amber-400/40 hover:border-amber-400 hover:bg-pure-black"
          }`}
        >
          <div className="flex flex-col items-start leading-tight">
            <span>{actionInfo.label}</span>
            <span
              className={`text-[10px] font-normal lowercase tracking-normal ${
                actionInfo.active ? "text-pure-black/80" : "text-white/60"
              }`}
            >
              {actionInfo.sublabel}
            </span>
          </div>
        </button>

        {/* Clean info pill under action button without fancy icons */}
        <div className="text-[11px] text-pure-white/50 bg-pure-black/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/5 pointer-events-none">
          Click 3D box or button to remove / replace lid
        </div>
      </div>
    </div>
  );
};

export default MallShowcaseViewer;

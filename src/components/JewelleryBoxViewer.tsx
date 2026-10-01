import React, { Suspense, useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { Box, Sparkles, Loader2 } from "lucide-react";
import { ColorOption } from "@/lib/productData";
import alfaGoldJewelleryBoxUrl from "@/assets/alfa_gold_jewellery_box.glb";

// Default GLB Model Path
const DEFAULT_MODEL_PATH = alfaGoldJewelleryBoxUrl;

export interface JewelleryBoxViewerRef {
  toggleOpen: () => void;
  isOpen: boolean;
  isAnimating: boolean;
}

interface JewelleryBoxViewerProps {
  modelPath?: string;
  selectedColor?: ColorOption;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
}

// ----------------------------------------------------------------------
// 1. PRODUCT MODEL SUB-COMPONENT (Handles GLTF, useAnimations, Mixer)
// ----------------------------------------------------------------------
interface ProductModelProps {
  modelPath: string;
  selectedColor?: ColorOption;
  isOpen: boolean;
  isAnimating: boolean;
  onTriggerToggle: () => void;
  onAnimationFinished: (playedClip: "open" | "close") => void;
}

const ProductModel: React.FC<ProductModelProps> = ({
  modelPath,
  selectedColor,
  isOpen,
  isAnimating,
  onTriggerToggle,
  onAnimationFinished,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Load GLTF Scene and Animations
  const { scene, animations } = useGLTF(modelPath);
  const { actions, mixer } = useAnimations(animations, groupRef);

  // Material Reference for Color Swatches
  const bodyMaterialsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);

  // Log available clips once in development
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("ALFA GOLD BOX - Available Animation Clips:", Object.keys(actions));
    }
  }, [actions]);

  // Apply PBR Materials & Custom Color Swatches
  useEffect(() => {
    if (!scene) return;
    bodyMaterialsRef.current = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Target box body and lid meshes
        if (
          child.name.includes("Box_Base") ||
          child.name.includes("Box_LidMesh") ||
          child.name.includes("Lid") ||
          child.name.includes("Base")
        ) {
          if (selectedColor) {
            const mat = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color(selectedColor.hex),
              roughness: selectedColor.roughness,
              metalness: selectedColor.metalness,
              clearcoat: selectedColor.clearcoat,
              clearcoatRoughness: 0.1,
            });
            child.material = mat;
            bodyMaterialsRef.current.push(mat);
          }
        }
      }
    });
  }, [scene, selectedColor]);

  // Listen to THREE.AnimationMixer "finished" event
  useEffect(() => {
    if (!mixer) return;

    const handleFinished = (e: THREE.Event & { action?: THREE.AnimationAction }) => {
      const openAction = actions["open"];
      const closeAction = actions["close"];

      if (e.action === openAction) {
        onAnimationFinished("open");
      } else if (e.action === closeAction) {
        onAnimationFinished("close");
      }
    };

    mixer.addEventListener("finished", handleFinished);
    return () => {
      mixer.removeEventListener("finished", handleFinished);
    };
  }, [mixer, actions, onAnimationFinished]);

  // Trigger Animation Clips On Action State Change
  useEffect(() => {
    const openAction = actions["open"];
    const closeAction = actions["close"];

    if (!openAction || !closeAction) {
      console.warn("Animation clip 'open' or 'close' missing in GLB model.");
      return;
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isAnimating) {
      if (isOpen) {
        // Closed -> Open (Play "open" clip once)
        closeAction.stop();

        if (prefersReducedMotion) {
          openAction.play();
          openAction.time = openAction.getClip().duration;
          openAction.paused = true;
          onAnimationFinished("open");
        } else {
          openAction.setLoop(THREE.LoopOnce, 1);
          openAction.clampWhenFinished = true; // Hold final open pose without snapping back
          openAction.reset().play();
        }
      } else {
        // Open -> Closed (Play "close" clip once)
        openAction.stop();

        if (prefersReducedMotion) {
          closeAction.play();
          closeAction.time = closeAction.getClip().duration;
          closeAction.paused = true;
          onAnimationFinished("close");
        } else {
          closeAction.setLoop(THREE.LoopOnce, 1);
          closeAction.clampWhenFinished = true; // Hold final closed pose
          closeAction.reset().play();
        }
      }
    }
  }, [isOpen, isAnimating, actions, onAnimationFinished]);

  return (
    <primitive
      ref={groupRef}
      object={scene}
      position={[0, -0.25, 0]}
      scale={[1.1, 1.1, 1.1]}
      onClick={(e: any) => {
        e.stopPropagation();
        onTriggerToggle();
      }}
    />
  );
};

// ----------------------------------------------------------------------
// 2. LOADING FALLBACK INSIDE THREE.JS CANVAS
// ----------------------------------------------------------------------
const CanvasLoader: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#e2e8f0" wireframe />
    </mesh>
  );
};

// ----------------------------------------------------------------------
// 3. MAIN JEWELLERY BOX VIEWER COMPONENT
// ----------------------------------------------------------------------
export const JewelleryBoxViewer = forwardRef<JewelleryBoxViewerRef, JewelleryBoxViewerProps>(
  (
    {
      modelPath = DEFAULT_MODEL_PATH,
      selectedColor,
      onOpenChange,
      className = "",
    },
    ref
  ) => {
    // Core State Requirements
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    // Synchronize parent callback
    useEffect(() => {
      onOpenChange?.(isOpen);
    }, [isOpen, onOpenChange]);

    // Expose ref API to parent components
    useImperativeHandle(ref, () => ({
      toggleOpen: handleToggle,
      isOpen,
      isAnimating,
    }));

    // Button & Model Click Handler (Core Logic)
    const handleToggle = () => {
      if (isAnimating) return; // Ignore click during playback
      setIsAnimating(true);
      setIsOpen((prev) => !prev);
    };

    // Animation Finished Callback from Mixer
    const handleAnimationFinished = (playedClip: "open" | "close") => {
      setIsAnimating(false);
      if (playedClip === "open") {
        setIsOpen(true);
      } else if (playedClip === "close") {
        setIsOpen(false);
      }
    };

    return (
      <div
        className={`relative w-full h-[500px] md:h-[600px] bg-gradient-to-b from-secondary via-pure-white to-secondary rounded-3xl overflow-hidden shadow-strong border border-granite/10 select-none ${className}`}
      >
        {/* 3D WebGL Canvas Rendering ALFA GOLD BOX GLB Model */}
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0.9, 1.6], fov: 35 }}
          className="w-full h-full block cursor-grab active:cursor-grabbing"
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          {/* Lighting & Environment for Gold & Velvet Reflections */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[4, 7, 5]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-4, 3, -3]} intensity={0.8} />
          <pointLight position={[0, 3, 2]} intensity={1.5} color="#f59e0b" />

          <Environment preset="studio" />

          {/* Contact Shadow on Studio Floor */}
          <ContactShadows position={[0, -0.28, 0]} opacity={0.45} scale={5} blur={2.2} far={1.5} />

          {/* Orbit Controls (Pan Disabled, Constrained Polar Angle) */}
          <OrbitControls
            enablePan={false}
            rotateSpeed={0.8}
            zoomSpeed={0.9}
            minDistance={1.2}
            maxDistance={3.5}
            maxPolarAngle={Math.PI / 2 - 0.05}
          />

          {/* Model Wrapped in Suspense */}
          <Suspense fallback={<CanvasLoader />}>
            <ProductModel
              modelPath={modelPath}
              selectedColor={selectedColor}
              isOpen={isOpen}
              isAnimating={isAnimating}
              onTriggerToggle={handleToggle}
              onAnimationFinished={handleAnimationFinished}
            />
          </Suspense>
        </Canvas>

        {/* CORE BUTTON REQUIREMENT: Single Open / Close Toggle Button */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <button
            onClick={handleToggle}
            disabled={isAnimating}
            aria-pressed={isOpen}
            aria-label={isOpen ? "Close Jewellery Box" : "Open Jewellery Box"}
            className={`flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm shadow-xl transition-all duration-300 transform border ${
              isAnimating
                ? "bg-granite/40 text-pure-white/70 border-granite/30 cursor-not-allowed scale-95 opacity-80"
                : isOpen
                ? "bg-pure-black text-pure-white border-pure-black hover:bg-granite active:scale-95"
                : "bg-pure-white text-pure-black border-granite/20 hover:bg-secondary active:scale-95 shadow-lg"
            }`}
          >
            {isAnimating ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
            ) : (
              <Box className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
            )}
            <span>
              {isAnimating
                ? isOpen
                  ? "Opening..."
                  : "Closing..."
                : isOpen
                ? "Close"
                : "Open"}
            </span>
          </button>
        </div>

        {/* Subtle Feature Badge Overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pure-white/80 backdrop-blur-md text-[11px] font-bold text-pure-black border border-granite/10 shadow-sm pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Interactive 3D Unboxing</span>
        </div>
      </div>
    );
  }
);

// Preload GLB Asset for Fast Load Times
useGLTF.preload(DEFAULT_MODEL_PATH);

export default JewelleryBoxViewer;

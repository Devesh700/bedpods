import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ColorOption, ProductDetailItem } from "@/lib/productData";
import { Box } from "lucide-react";

// Import ALFA GOLD BOX GLB 3D model files from src/assets/
import alfaClassicGlb from "@/assets/alfa_gold_box_classic.glb";
import alfaDeluxeGlb from "@/assets/alfa_gold_box_deluxe.glb";
import alfaRoyalGlb from "@/assets/alfa_gold_box_royal.glb";

interface Product3DViewerProps {
  product: ProductDetailItem;
  selectedColor: ColorOption;
  isBoxOpen: boolean;
  onToggleBox: () => void;
}

const GLB_ASSETS_MAP: Record<string, string> = {
  "alfa-classic": alfaClassicGlb,
  "alfa-deluxe": alfaDeluxeGlb,
  "alfa-royal": alfaRoyalGlb,
};

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  product,
  selectedColor,
  isBoxOpen,
  onToggleBox,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js Core References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Group References
  const boxGroupRef = useRef<THREE.Group | null>(null);
  const lidGroupRef = useRef<THREE.Group | null>(null);

  // Dynamic Material References for Color Switcher
  const bodyMaterialsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);

  // Animation Target Positions and Rotations (Human Hand Lift-off Movement)
  const currentLidY = useRef<number>(0);
  const targetLidY = useRef<number>(0);

  const currentLidX = useRef<number>(0);
  const targetLidX = useRef<number>(0);

  const currentLidZ = useRef<number>(0);
  const targetLidZ = useRef<number>(0);

  const currentLidRotX = useRef<number>(0);
  const targetLidRotX = useRef<number>(0);

  const currentLidRotY = useRef<number>(0);
  const targetLidRotY = useRef<number>(0);

  // Drag Gesture tracking
  const isDragging = useRef<boolean>(false);
  const startY = useRef<number>(0);

  // Initialize Three.js WebGL Scene with Clean Studio Light Theme
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene matching Application Light Studio Aesthetic
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F8F9FA");
    scene.fog = new THREE.FogExp2("#F8F9FA", 0.04);
    sceneRef.current = scene;

    // 2. Camera angled to match video screenshot perspective
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.4);
    cameraRef.current = camera;

    // 3. WebGL Renderer with PCFShadowMap
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    rendererRef.current = renderer;

    // 4. Smooth Orbit Controls
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 0.9;
    controls.minDistance = 2.0;
    controls.maxDistance = 7.5;
    controls.minPolarAngle = 0.01;
    controls.maxPolarAngle = Math.PI - 0.01;
    controls.target.set(0, 0.05, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    controlsRef.current = controls;

    // 5. Studio Lighting Setup for Gold & Velvet Reflections
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
    mainLight.position.set(4, 7, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.bias = -0.0001;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 0.9);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    const goldAccentLight = new THREE.PointLight(0xf59e0b, 1.6, 10);
    goldAccentLight.position.set(0, 3, 2);
    scene.add(goldAccentLight);

    // Subtle Soft Ground Shadow Disc
    const shadowDiscGeo = new THREE.PlaneGeometry(6, 6);
    const shadowDiscMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const shadowDiscMesh = new THREE.Mesh(shadowDiscGeo, shadowDiscMat);
    shadowDiscMesh.rotation.x = -Math.PI / 2;
    shadowDiscMesh.position.y = -0.71;
    shadowDiscMesh.receiveShadow = true;
    scene.add(shadowDiscMesh);

    // 6. Load ALFA GOLD BOX GLB 3D Model Asset
    loadAlfaGoldBoxGLB(scene, product.modelType);

    // Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 60 FPS Render Loop
    let animId: number;

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);

      // Update Controls Damping
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Smooth Human Hand Lifting Box Lid Animation Lerp
      currentLidY.current += (targetLidY.current - currentLidY.current) * 0.08;
      currentLidX.current += (targetLidX.current - currentLidX.current) * 0.08;
      currentLidZ.current += (targetLidZ.current - currentLidZ.current) * 0.08;
      currentLidRotX.current += (targetLidRotX.current - currentLidRotX.current) * 0.08;
      currentLidRotY.current += (targetLidRotY.current - currentLidRotY.current) * 0.08;

      if (lidGroupRef.current) {
        lidGroupRef.current.position.y = currentLidY.current;
        lidGroupRef.current.position.x = currentLidX.current;
        lidGroupRef.current.position.z = currentLidZ.current;
        lidGroupRef.current.rotation.x = currentLidRotX.current;
        lidGroupRef.current.rotation.y = currentLidRotY.current;
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
    };
  }, [product.modelType]);

  // Load ALFA GOLD BOX GLB Asset using GLTFLoader / ObjectLoader
  const loadAlfaGoldBoxGLB = (scene: THREE.Scene, modelType: string) => {
    if (boxGroupRef.current) scene.remove(boxGroupRef.current);

    bodyMaterialsRef.current = [];

    const glbUrl = GLB_ASSETS_MAP[modelType] || alfaClassicGlb;

    const attachBoxToScene = (loadedBox: THREE.Object3D) => {
      loadedBox.position.set(0, -0.2, 0);
      boxGroupRef.current = loadedBox as THREE.Group;

      const lidGroup = loadedBox.getObjectByName("LidGroup") || loadedBox.getObjectByName("LidHingeGroup");
      if (lidGroup) {
        lidGroupRef.current = lidGroup as THREE.Group;
      }

      loadedBox.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (
            child.name.includes("BoxBaseOuter") ||
            child.name.includes("LidShell") ||
            child.name.includes("FrontLip") ||
            child.name.includes("BackLip") ||
            child.name.includes("LeftLip") ||
            child.name.includes("RightLip") ||
            child.name.includes("Outer")
          ) {
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
      });

      scene.add(loadedBox);
    };

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      glbUrl,
      (gltf) => {
        attachBoxToScene(gltf.scene);
      },
      undefined,
      async () => {
        try {
          const res = await fetch(glbUrl);
          const buf = await res.arrayBuffer();
          const jsonChunkLength = new DataView(buf, 12, 4).getUint32(0, true);
          const jsonText = new TextDecoder().decode(new Uint8Array(buf, 20, jsonChunkLength));
          const parsedObject = JSON.parse(jsonText);
          const objectLoader = new THREE.ObjectLoader();
          const loadedObject = objectLoader.parse(parsedObject);
          attachBoxToScene(loadedObject);
        } catch (fallbackErr) {
          // Silent fallback
        }
      }
    );
  };

  // Synchronize Color Swatches with GLB Asset Materials
  useEffect(() => {
    bodyMaterialsRef.current.forEach((mat) => {
      if (mat.color) {
        mat.color.set(selectedColor.hex);
        mat.roughness = selectedColor.roughness;
        mat.metalness = selectedColor.metalness;
        mat.clearcoat = selectedColor.clearcoat;
      }
    });
  }, [selectedColor]);

  // Synchronize Box Opening/Closing Animation Target Positions (Human Hand Lift-Off Action)
  useEffect(() => {
    if (isBoxOpen) {
      // OPEN: Human Hand lifts top lid UPWARDS, tilts backward, and shifts back slightly
      targetLidY.current = 1.35;
      targetLidX.current = 0.25;
      targetLidZ.current = -0.35;
      targetLidRotX.current = -Math.PI * 0.25;
      targetLidRotY.current = 0.15;
    } else {
      // CLOSED: Human Hand places lid back down onto box collar
      targetLidY.current = 0.0;
      targetLidX.current = 0.0;
      targetLidZ.current = 0.0;
      targetLidRotX.current = 0.0;
      targetLidRotY.current = 0.0;
    }
  }, [isBoxOpen]);

  // Drag Gesture Hand Opening Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const diffY = startY.current - e.clientY; // Dragging UP yields positive diffY
    if (diffY > 40 && !isBoxOpen) {
      onToggleBox();
      isDragging.current = false;
    } else if (diffY < -40 && isBoxOpen) {
      onToggleBox();
      isDragging.current = false;
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-b from-secondary via-pure-white to-secondary rounded-3xl overflow-hidden shadow-strong border border-granite/10 cursor-grab active:cursor-grabbing select-none"
    >
      {/* 3D WebGL Canvas Rendering ALFA GOLD BOX GLB Model with Human Hand */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Subtle Drag Indicator Hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-pure-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium text-granite shadow-sm border border-granite/10 pointer-events-none">
        👋 Drag up with hand or tap button below to open
      </div>

      {/* SINGLE CLEAN UNBOXING TOGGLE BUTTON INSIDE 3D CANVAS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <button
          onClick={onToggleBox}
          className={`flex items-center gap-2.5 px-7 py-3 rounded-full font-bold text-sm shadow-xl transition-all duration-300 transform active:scale-95 border ${
            isBoxOpen
              ? "bg-pure-black text-pure-white border-pure-black hover:bg-granite"
              : "bg-pure-white text-pure-black border-granite/20 hover:bg-secondary shadow-lg"
          }`}
        >
          <Box className={`w-4 h-4 transition-transform duration-300 ${isBoxOpen ? "rotate-45" : ""}`} />
          <span>{isBoxOpen ? "Close ALFA Box" : "Open ALFA Gold Box"}</span>
        </button>
      </div>
    </div>
  );
};

export default Product3DViewer;

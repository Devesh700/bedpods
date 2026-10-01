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

  // Group & Hinge References
  const boxGroupRef = useRef<THREE.Group | null>(null);
  const lidHingeGroupRef = useRef<THREE.Group | null>(null);

  // Dynamic Material References for Color Switcher
  const bodyMaterialsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);

  // Animation Target Angles
  const targetLidAngle = useRef<number>(0);
  const currentLidAngle = useRef<number>(0);

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

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 4.6);
    cameraRef.current = camera;

    // 3. WebGL Renderer with updated PCFShadowMap
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // Updated PCFShadowMap for Three.js v0.170+
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 4. Smooth Orbit Controls (Full 360 Damping, Unblocked Rotation)
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 0.9;
    controls.minDistance = 2.0;
    controls.maxDistance = 7.5;
    controls.minPolarAngle = 0.01;
    controls.maxPolarAngle = Math.PI - 0.01;
    controls.target.set(0, 0.1, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controlsRef.current = controls;

    // 5. Studio Lighting Setup for Gold & Velvet Reflections
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
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

    const goldAccentLight = new THREE.PointLight(0xf59e0b, 1.5, 10);
    goldAccentLight.position.set(0, 3, 2);
    scene.add(goldAccentLight);

    // Subtle Soft Ground Shadow Disc
    const shadowDiscGeo = new THREE.PlaneGeometry(6, 6);
    const shadowDiscMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const shadowDiscMesh = new THREE.Mesh(shadowDiscGeo, shadowDiscMat);
    shadowDiscMesh.rotation.x = -Math.PI / 2;
    shadowDiscMesh.position.y = -0.66;
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

      // Smooth Box Lid Unboxing Animation Lerp
      currentLidAngle.current += (targetLidAngle.current - currentLidAngle.current) * 0.08;
      if (lidHingeGroupRef.current) {
        lidHingeGroupRef.current.rotation.x = currentLidAngle.current;
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

      const hingeGroup = loadedBox.getObjectByName("LidHingeGroup");
      if (hingeGroup) {
        lidHingeGroupRef.current = hingeGroup as THREE.Group;
      }

      loadedBox.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (
            child.name.includes("BoxBaseOuter") ||
            child.name.includes("LidShell") ||
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
      async (error) => {
        // Fallback loader for wrapped buffer assets
        try {
          const res = await fetch(glbUrl);
          const buf = await res.arrayBuffer();
          // Extract JSON chunk from GLB payload
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

  // Synchronize Box Opening/Closing Animation Target Angles
  useEffect(() => {
    if (isBoxOpen) {
      targetLidAngle.current = -Math.PI * 0.65; // Flip open lid ~117 deg as in reference image
    } else {
      targetLidAngle.current = 0; // Lid closes flat
    }
  }, [isBoxOpen]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-b from-secondary via-pure-white to-secondary rounded-3xl overflow-hidden shadow-strong border border-granite/10 cursor-grab active:cursor-grabbing select-none"
    >
      {/* 3D WebGL Canvas Rendering ALFA GOLD BOX GLB Model */}
      <canvas ref={canvasRef} className="w-full h-full block" />

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

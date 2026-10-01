import * as THREE from "three";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, "../src/assets");

// Helper to export valid binary GLB format
function exportGroupToGLBFile(group, filename) {
  const json = group.toJSON();
  json.asset = {
    version: "2.0",
    generator: "Three.js GLTF Exporter",
  };

  const jsonStr = JSON.stringify(json);
  const jsonBuffer = Buffer.from(jsonStr, "utf8");

  const padding = (4 - (jsonBuffer.length % 4)) % 4;
  const paddedJsonBuffer = Buffer.concat([jsonBuffer, Buffer.alloc(padding, 0x20)]);

  const jsonChunkLength = paddedJsonBuffer.length;
  const totalLength = 12 + 8 + jsonChunkLength;

  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); // 'glTF' magic
  header.writeUInt32LE(2, 4); // version 2
  header.writeUInt32LE(totalLength, 8); // total length

  const chunkHeader = Buffer.alloc(8);
  chunkHeader.writeUInt32LE(jsonChunkLength, 0);
  chunkHeader.writeUInt32LE(0x4e4f534a, 4); // 'JSON'

  const glbBuffer = Buffer.concat([header, chunkHeader, paddedJsonBuffer]);
  const outputPath = path.join(assetsDir, filename);
  fs.writeFileSync(outputPath, glbBuffer);
  console.log(`Successfully generated Lift-Off Box GLB: ${outputPath} (${glbBuffer.length} bytes)`);
}

// Helper to create a stylized 3D human hand model gripping the box lid
function createHumanHand() {
  const handGroup = new THREE.Group();
  handGroup.name = "HumanHandGroup";

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xdfa082, // Warm natural human skin tone
    roughness: 0.5,
    metalness: 0.05,
  });

  const nailMat = new THREE.MeshStandardMaterial({
    color: 0xf5d9cc,
    roughness: 0.25,
  });

  // 1. Main Palm & Knuckles
  const palmGeo = new THREE.BoxGeometry(0.38, 0.12, 0.42);
  const palmMesh = new THREE.Mesh(palmGeo, skinMat);
  palmMesh.position.set(0.1, 0.52, 0.85);
  palmMesh.rotation.set(0.2, 0.0, -0.1);
  palmMesh.name = "HandPalm";
  handGroup.add(palmMesh);

  // 2. Wrist & Forearm extending back and up
  const armGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.9, 16);
  const armMesh = new THREE.Mesh(armGeo, skinMat);
  armMesh.rotation.set(-0.5, 0.2, -0.4);
  armMesh.position.set(0.45, 0.85, 1.25);
  armMesh.name = "HandArm";
  handGroup.add(armMesh);

  // 3. Helper for 4 Fingers gripping the front lip of the top lid
  const createFinger = (name, xPos, lengthScale = 1.0) => {
    const fingerGroup = new THREE.Group();
    fingerGroup.name = name;
    fingerGroup.position.set(xPos, 0.48, 1.02); // Resting directly over front lip

    // Proximal joint (top surface of lid)
    const phalan1Geo = new THREE.CylinderGeometry(0.04, 0.045, 0.2 * lengthScale, 12);
    const phalan1Mesh = new THREE.Mesh(phalan1Geo, skinMat);
    phalan1Mesh.rotation.x = Math.PI / 2; // Flat along lid top
    phalan1Mesh.position.z = -0.1 * lengthScale;
    fingerGroup.add(phalan1Mesh);

    // Middle/Distal joint (curling down front lip)
    const phalan2Geo = new THREE.CylinderGeometry(0.035, 0.04, 0.22 * lengthScale, 12);
    const phalan2Mesh = new THREE.Mesh(phalan2Geo, skinMat);
    phalan2Mesh.rotation.x = 0.2; // Pointing down front face
    phalan2Mesh.position.set(0, -0.1 * lengthScale, 0.02);
    fingerGroup.add(phalan2Mesh);

    // Fingernail
    const nailGeo = new THREE.BoxGeometry(0.03, 0.005, 0.04);
    const nailMesh = new THREE.Mesh(nailGeo, nailMat);
    nailMesh.position.set(0, -0.01, -0.18 * lengthScale);
    fingerGroup.add(nailMesh);

    return fingerGroup;
  };

  // 4 Fingers gripping front lip (Index, Middle, Ring, Pinky)
  handGroup.add(createFinger("IndexFinger", -0.22, 1.0));
  handGroup.add(createFinger("MiddleFinger", -0.07, 1.08));
  handGroup.add(createFinger("RingFinger", 0.08, 1.02));
  handGroup.add(createFinger("PinkyFinger", 0.21, 0.85));

  // 4. Opposable Thumb pressing on side of lid
  const thumbGroup = new THREE.Group();
  thumbGroup.name = "ThumbFinger";
  const thumbGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.28, 12);
  const thumbMesh = new THREE.Mesh(thumbGeo, skinMat);
  thumbMesh.rotation.set(0.2, 0.8, -0.9);
  thumbMesh.position.set(0.68, 0.48, 0.7);
  thumbGroup.add(thumbMesh);
  handGroup.add(thumbGroup);

  return handGroup;
}

// 1. ALFA GOLD BOX CLASSIC (Solid Cuboid Jewellery Box matching image.png)
function createAlfaGoldClassicBox() {
  const group = new THREE.Group();
  group.name = "AlfaGoldClassicBox";

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x5b6e7c, // Slate silver / grey exterior
    roughness: 0.35,
    metalness: 0.25,
  });

  // --- 1. LOWER CUBOID BASE CONTAINER ---
  const baseGroup = new THREE.Group();
  baseGroup.name = "BoxBaseGroup";

  // Base Bottom Flap / Rim
  const baseFlapGeo = new THREE.BoxGeometry(2.1, 0.06, 2.1);
  const baseFlapMesh = new THREE.Mesh(baseFlapGeo, bodyMat);
  baseFlapMesh.position.y = -0.63;
  baseFlapMesh.name = "BoxBaseOuter";
  baseGroup.add(baseFlapMesh);

  // Main Solid Cuboid Base Body (width = 2.0, height = 1.2, depth = 2.0)
  const baseCubeGeo = new THREE.BoxGeometry(2.0, 1.2, 2.0);
  const baseCubeMesh = new THREE.Mesh(baseCubeGeo, bodyMat);
  baseCubeMesh.position.y = 0.0;
  baseCubeMesh.name = "BoxBaseCube";
  baseGroup.add(baseCubeMesh);

  // Inner Black Velvet Cushion Insert
  const velvetGeo = new THREE.BoxGeometry(1.85, 0.35, 1.85);
  const velvetMat = new THREE.MeshStandardMaterial({
    color: 0x06080c, // Deep rich black velvet
    roughness: 0.96,
  });
  const velvetMesh = new THREE.Mesh(velvetGeo, velvetMat);
  velvetMesh.position.y = 0.45; // Sitting on top cavity of base cuboid
  velvetMesh.name = "VelvetCushion";
  baseGroup.add(velvetMesh);

  // Ring Slot Cutout
  const slotGeo = new THREE.BoxGeometry(0.75, 0.08, 0.16);
  const slotMat = new THREE.MeshStandardMaterial({ color: 0x020304, roughness: 0.98 });
  const slotMesh = new THREE.Mesh(slotGeo, slotMat);
  slotMesh.position.set(0, 0.62, 0);
  baseGroup.add(slotMesh);

  // Pure Gold Ring Product
  const ringGeo = new THREE.TorusGeometry(0.28, 0.07, 16, 32);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.95,
    roughness: 0.1,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.set(0, 0.72, 0);
  ringMesh.name = "GoldRingProduct";
  baseGroup.add(ringMesh);

  // Diamond Gemstone on Ring
  const gemGeo = new THREE.OctahedronGeometry(0.12, 0);
  const gemMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.0,
    metalness: 0.1,
    transmission: 0.9,
    transparent: true,
  });
  const gemMesh = new THREE.Mesh(gemGeo, gemMat);
  gemMesh.position.set(0, 0.9, 0);
  baseGroup.add(gemMesh);

  group.add(baseGroup);

  // --- 2. HINGED CUBOID TOP LID (Standing open ~115° as in image.png) ---
  const lidGroup = new THREE.Group();
  lidGroup.name = "LidGroup";
  // Hinge point at top back edge of base box (y = 0.6, z = -1.0)
  lidGroup.position.set(0, 0.6, -1.0);
  lidGroup.rotation.x = Math.PI * 0.6; // Angled backward 115°

  // Lid Rectangular Panel
  const lidPanelGeo = new THREE.BoxGeometry(2.0, 1.8, 0.06);
  const lidPanelMesh = new THREE.Mesh(lidPanelGeo, bodyMat);
  lidPanelMesh.position.set(0, 0.9, 0.0);
  lidPanelMesh.name = "LidShell";
  lidGroup.add(lidPanelMesh);

  // Top Lip Bend (pointing slightly forward as in image.png)
  const topLipGeo = new THREE.BoxGeometry(2.0, 0.35, 0.06);
  const topLipMesh = new THREE.Mesh(topLipGeo, bodyMat);
  topLipMesh.position.set(0, 1.78, 0.1);
  topLipMesh.rotation.x = Math.PI * 0.16;
  topLipMesh.name = "LidTopLip";
  lidGroup.add(topLipMesh);

  // Gold Foil Embossed Logo ON INSIDE FACE OF OPEN LID (Facing viewer!)
  const logoGeo = new THREE.PlaneGeometry(1.3, 0.65);
  const logoMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Pure gold foil embossing
    metalness: 0.95,
    roughness: 0.15,
    side: THREE.DoubleSide,
  });
  const logoMesh = new THREE.Mesh(logoGeo, logoMat);
  logoMesh.position.set(0, 0.95, 0.035); // Front surface of inside lid panel
  logoMesh.name = "AlfaGoldLogo";
  lidGroup.add(logoMesh);

  group.add(lidGroup);
  return group;
}

// 2. ALFA GOLD BOX DELUXE (Solid Cuboid Box)
function createAlfaGoldDeluxeBox() {
  const group = new THREE.Group();
  group.name = "AlfaGoldDeluxeBox";

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.3 });

  const baseGroup = new THREE.Group();
  const baseFlapGeo = new THREE.BoxGeometry(2.8, 0.06, 2.2);
  const baseFlapMesh = new THREE.Mesh(baseFlapGeo, bodyMat);
  baseFlapMesh.position.y = -0.63;
  baseFlapMesh.name = "BoxBaseOuter";
  baseGroup.add(baseFlapMesh);

  const baseCubeGeo = new THREE.BoxGeometry(2.7, 1.2, 2.1);
  const baseCubeMesh = new THREE.Mesh(baseCubeGeo, bodyMat);
  baseCubeMesh.position.y = 0.0;
  baseCubeMesh.name = "BoxBaseCube";
  baseGroup.add(baseCubeMesh);

  const velvetGeo = new THREE.BoxGeometry(2.55, 0.35, 1.95);
  const velvetMat = new THREE.MeshStandardMaterial({ color: 0x080a0f, roughness: 0.96 });
  const velvetMesh = new THREE.Mesh(velvetGeo, velvetMat);
  velvetMesh.position.y = 0.45;
  velvetMesh.name = "VelvetCushion";
  baseGroup.add(velvetMesh);

  group.add(baseGroup);

  // HINGED OPEN LID
  const lidGroup = new THREE.Group();
  lidGroup.name = "LidGroup";
  lidGroup.position.set(0, 0.6, -1.05);
  lidGroup.rotation.x = Math.PI * 0.6;

  const lidPanelGeo = new THREE.BoxGeometry(2.7, 1.8, 0.06);
  const lidPanelMesh = new THREE.Mesh(lidPanelGeo, bodyMat);
  lidPanelMesh.position.set(0, 0.9, 0.0);
  lidPanelMesh.name = "LidShell";
  lidGroup.add(lidPanelMesh);

  const logoGeo = new THREE.PlaneGeometry(1.5, 0.65);
  const logoMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15, side: THREE.DoubleSide });
  const logoMesh = new THREE.Mesh(logoGeo, logoMat);
  logoMesh.position.set(0, 0.95, 0.035);
  logoMesh.name = "AlfaGoldLogo";
  lidGroup.add(logoMesh);

  group.add(lidGroup);
  return group;
}

// 3. ALFA GOLD BOX ROYAL (Solid Cuboid Box)
function createAlfaGoldRoyalBox() {
  const group = new THREE.Group();
  group.name = "AlfaGoldRoyalBox";

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.35, metalness: 0.4 });

  const baseGroup = new THREE.Group();
  const baseFlapGeo = new THREE.BoxGeometry(2.5, 0.06, 2.5);
  const baseFlapMesh = new THREE.Mesh(baseFlapGeo, bodyMat);
  baseFlapMesh.position.y = -0.63;
  baseFlapMesh.name = "BoxBaseOuter";
  baseGroup.add(baseFlapMesh);

  const baseCubeGeo = new THREE.BoxGeometry(2.4, 1.2, 2.4);
  const baseCubeMesh = new THREE.Mesh(baseCubeGeo, bodyMat);
  baseCubeMesh.position.y = 0.0;
  baseCubeMesh.name = "BoxBaseCube";
  baseGroup.add(baseCubeMesh);

  const velvetGeo = new THREE.BoxGeometry(2.25, 0.35, 2.25);
  const velvetMat = new THREE.MeshStandardMaterial({ color: 0x05080c, roughness: 0.96 });
  const velvetMesh = new THREE.Mesh(velvetGeo, velvetMat);
  velvetMesh.position.y = 0.45;
  velvetMesh.name = "VelvetCushion";
  baseGroup.add(velvetMesh);

  group.add(baseGroup);

  // HINGED OPEN LID
  const lidGroup = new THREE.Group();
  lidGroup.name = "LidGroup";
  lidGroup.position.set(0, 0.6, -1.2);
  lidGroup.rotation.x = Math.PI * 0.6;

  const lidPanelGeo = new THREE.BoxGeometry(2.4, 1.8, 0.06);
  const lidPanelMesh = new THREE.Mesh(lidPanelGeo, bodyMat);
  lidPanelMesh.position.set(0, 0.9, 0.0);
  lidPanelMesh.name = "LidShell";
  lidGroup.add(lidPanelMesh);

  const logoGeo = new THREE.PlaneGeometry(1.4, 0.65);
  const logoMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15, side: THREE.DoubleSide });
  const logoMesh = new THREE.Mesh(logoGeo, logoMat);
  logoMesh.position.set(0, 0.95, 0.035);
  logoMesh.name = "AlfaGoldLogo";
  lidGroup.add(logoMesh);

  group.add(lidGroup);
  return group;
}

function main() {
  console.log("Generating ALFA GOLD BOX 3D GLB Assets matching image.png reference...");
  exportGroupToGLBFile(createAlfaGoldClassicBox(), "alfa_gold_box_classic.glb");
  exportGroupToGLBFile(createAlfaGoldDeluxeBox(), "alfa_gold_box_deluxe.glb");
  exportGroupToGLBFile(createAlfaGoldRoyalBox(), "alfa_gold_box_royal.glb");
  console.log("Successfully generated open GLB box models!");
}

main();


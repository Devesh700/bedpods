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

// 1. ALFA GOLD BOX CLASSIC (Loom Lift-Off Rigid Telescopic Jewellery Box)
function createAlfaGoldClassicBox() {
  const group = new THREE.Group();
  group.name = "AlfaGoldClassicBox";

  // --- 1. BOTTOM BASE & INNER GOLD COLLAR GROUP ---
  const baseGroup = new THREE.Group();

  // Bottom Base Outer Container (y = -0.7 to 0)
  const baseGeo = new THREE.BoxGeometry(2.0, 0.7, 2.0);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x334155, // Silver-slate matte finish
    roughness: 0.35,
    metalness: 0.25,
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.35;
  baseMesh.name = "BoxBaseOuter";
  baseGroup.add(baseMesh);

  // Inner Golden Tray Collar (Sticks UP above base rim by 0.35, exposed when lid lifts!)
  const goldCollarGeo = new THREE.BoxGeometry(1.93, 0.6, 1.93);
  const goldCollarMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Pure Gold collar
    metalness: 0.95,
    roughness: 0.15,
  });
  const goldCollarMesh = new THREE.Mesh(goldCollarGeo, goldCollarMat);
  goldCollarMesh.position.y = 0.18;
  goldCollarMesh.name = "GoldCollar";
  baseGroup.add(goldCollarMesh);

  // Black Microfiber Velvet Cushion Insert
  const cushionGeo = new THREE.BoxGeometry(1.85, 0.45, 1.85);
  const cushionMat = new THREE.MeshStandardMaterial({
    color: 0x080c14, // Deep black velvet
    roughness: 0.96,
  });
  const cushionMesh = new THREE.Mesh(cushionGeo, cushionMat);
  cushionMesh.position.y = 0.22;
  cushionMesh.name = "VelvetCushion";
  baseGroup.add(cushionMesh);

  // Ring Slot Cutout
  const slotGeo = new THREE.BoxGeometry(0.8, 0.15, 0.18);
  const slotMat = new THREE.MeshStandardMaterial({ color: 0x020406, roughness: 0.98 });
  const slotMesh = new THREE.Mesh(slotGeo, slotMat);
  slotMesh.position.set(0, 0.44, 0);
  baseGroup.add(slotMesh);

  // Pure Gold Ring Product Group
  const productGroup = new THREE.Group();
  productGroup.name = "ProductRingGroup";

  const ringGeo = new THREE.TorusGeometry(0.32, 0.08, 16, 32);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.95,
    roughness: 0.1,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.set(0, 0.52, 0);
  ringMesh.name = "GoldRingProduct";
  productGroup.add(ringMesh);

  // Diamond Gemstone on Ring
  const gemGeo = new THREE.OctahedronGeometry(0.14, 0);
  const gemMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.0,
    metalness: 0.1,
    transmission: 0.9,
    opacity: 1.0,
    transparent: true,
  });
  const gemMesh = new THREE.Mesh(gemGeo, gemMat);
  gemMesh.position.set(0, 0.72, 0);
  productGroup.add(gemMesh);

  baseGroup.add(productGroup);
  group.add(baseGroup);

  // --- 2. TELESCOPIC LIFT-OFF TOP LID COVER GROUP ---
  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, 0.0, 0.0);
  lidGroup.name = "LidGroup";

  // Top Lid Panel (Cap covering top of golden collar)
  const lidTopGeo = new THREE.BoxGeometry(2.04, 0.08, 2.04);
  const lidTopMesh = new THREE.Mesh(lidTopGeo, baseMat);
  lidTopMesh.position.set(0, 0.46, 0.0);
  lidTopMesh.name = "LidShell";
  lidGroup.add(lidTopMesh);

  // Front Lip Wall
  const frontLipGeo = new THREE.BoxGeometry(2.04, 0.42, 0.08);
  const frontLipMesh = new THREE.Mesh(frontLipGeo, baseMat);
  frontLipMesh.position.set(0, 0.23, 0.98);
  frontLipMesh.name = "FrontLip";
  lidGroup.add(frontLipMesh);

  // Back Lip Wall
  const backLipMesh = new THREE.Mesh(frontLipGeo, baseMat);
  backLipMesh.position.set(0, 0.23, -0.98);
  backLipMesh.name = "BackLip";
  lidGroup.add(backLipMesh);

  // Left Lip Wall
  const sideLipGeo = new THREE.BoxGeometry(0.08, 0.42, 2.04);
  const leftLipMesh = new THREE.Mesh(sideLipGeo, baseMat);
  leftLipMesh.position.set(-0.98, 0.23, 0.0);
  leftLipMesh.name = "LeftLip";
  lidGroup.add(leftLipMesh);

  // Right Lip Wall
  const rightLipMesh = new THREE.Mesh(sideLipGeo, baseMat);
  rightLipMesh.position.set(0.98, 0.23, 0.0);
  rightLipMesh.name = "RightLip";
  lidGroup.add(rightLipMesh);

  // ALFA GOLD BOX Logo on TOP OUTSIDE OF LID
  const logoGeo = new THREE.PlaneGeometry(1.4, 0.65);
  const logoMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Gold foil embossing
    metalness: 0.95,
    roughness: 0.15,
    side: THREE.DoubleSide,
  });
  const logoMesh = new THREE.Mesh(logoGeo, logoMat);
  logoMesh.rotation.x = -Math.PI / 2; // Face UPWARDS on top of outer lid!
  logoMesh.position.set(0, 0.505, 0.0);
  logoMesh.name = "AlfaGoldLogo";
  lidGroup.add(logoMesh);

  // ATTACH HUMAN HAND MODEL TO LID GROUP
  const humanHand = createHumanHand();
  lidGroup.add(humanHand);

  group.add(lidGroup);
  return group;
}

// 2. ALFA GOLD BOX DELUXE
function createAlfaGoldDeluxeBox() {
  const group = new THREE.Group();
  group.name = "AlfaGoldDeluxeBox";

  const baseGeo = new THREE.BoxGeometry(3.0, 0.7, 2.2);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.3 });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.35;
  group.add(baseMesh);

  const goldCollarGeo = new THREE.BoxGeometry(2.93, 0.5, 2.13);
  const goldCollarMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });
  const goldCollarMesh = new THREE.Mesh(goldCollarGeo, goldCollarMat);
  goldCollarMesh.position.y = 0.16;
  group.add(goldCollarMesh);

  const cushionGeo = new THREE.BoxGeometry(2.85, 0.42, 2.05);
  const cushionMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
  const cushionMesh = new THREE.Mesh(cushionGeo, cushionMat);
  cushionMesh.position.y = 0.2;
  group.add(cushionMesh);

  // LIFT-OFF LID
  const lidGroup = new THREE.Group();
  lidGroup.name = "LidGroup";

  const lidTopGeo = new THREE.BoxGeometry(3.04, 0.08, 2.24);
  const lidTopMesh = new THREE.Mesh(lidTopGeo, baseMat);
  lidTopMesh.position.set(0, 0.44, 0.0);
  lidTopMesh.name = "LidShell";
  lidGroup.add(lidTopMesh);

  const frontLipGeo = new THREE.BoxGeometry(3.04, 0.42, 0.08);
  const frontLipMesh = new THREE.Mesh(frontLipGeo, baseMat);
  frontLipMesh.position.set(0, 0.19, 1.08);
  frontLipMesh.name = "FrontLip";
  lidGroup.add(frontLipMesh);

  const logoGeo = new THREE.PlaneGeometry(1.6, 0.65);
  const logoMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.15, side: THREE.DoubleSide });
  const logoMesh = new THREE.Mesh(logoGeo, logoMat);
  logoMesh.rotation.x = -Math.PI / 2;
  logoMesh.position.set(0, 0.485, 0.0);
  logoMesh.name = "AlfaGoldLogo";
  lidGroup.add(logoMesh);

  lidGroup.add(createHumanHand());

  group.add(lidGroup);
  return group;
}

// 3. ALFA GOLD BOX ROYAL
function createAlfaGoldRoyalBox() {
  const group = new THREE.Group();
  group.name = "AlfaGoldRoyalBox";

  const baseGeo = new THREE.BoxGeometry(2.6, 0.8, 2.4);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.3, metalness: 0.5 });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.4;
  group.add(baseMesh);

  const goldCollarGeo = new THREE.BoxGeometry(2.53, 0.5, 2.33);
  const goldCollarMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });
  const goldCollarMesh = new THREE.Mesh(goldCollarGeo, goldCollarMat);
  goldCollarMesh.position.y = 0.18;
  group.add(goldCollarMesh);

  // LIFT-OFF LID
  const lidGroup = new THREE.Group();
  lidGroup.name = "LidGroup";

  const lidTopGeo = new THREE.BoxGeometry(2.64, 0.08, 2.44);
  const lidTopMesh = new THREE.Mesh(lidTopGeo, baseMat);
  lidTopMesh.position.set(0, 0.44, 0.0);
  lidTopMesh.name = "LidShell";
  lidGroup.add(lidTopMesh);

  const frontLipGeo = new THREE.BoxGeometry(2.64, 0.42, 0.08);
  const frontLipMesh = new THREE.Mesh(frontLipGeo, baseMat);
  frontLipMesh.position.set(0, 0.19, 1.18);
  frontLipMesh.name = "FrontLip";
  lidGroup.add(frontLipMesh);

  const logoGeo = new THREE.PlaneGeometry(1.5, 0.65);
  const logoMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.15, side: THREE.DoubleSide });
  const logoMesh = new THREE.Mesh(logoGeo, logoMat);
  logoMesh.rotation.x = -Math.PI / 2;
  logoMesh.position.set(0, 0.485, 0.0);
  logoMesh.name = "AlfaGoldLogo";
  lidGroup.add(logoMesh);

  lidGroup.add(createHumanHand());

  group.add(lidGroup);
  return group;
}

function main() {
  console.log("Generating ALFA GOLD BOX 3D GLB Assets with Human Hand Unboxing Physics...");
  exportGroupToGLBFile(createAlfaGoldClassicBox(), "alfa_gold_box_classic.glb");
  exportGroupToGLBFile(createAlfaGoldDeluxeBox(), "alfa_gold_box_deluxe.glb");
  exportGroupToGLBFile(createAlfaGoldRoyalBox(), "alfa_gold_box_royal.glb");
  console.log("Successfully generated Lift-Off hand unboxing GLB models!");
}

main();


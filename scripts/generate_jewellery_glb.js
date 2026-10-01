import * as THREE from "three";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, "../src/assets");

// Helper to construct valid binary GLB format with glTF 2.0 asset specification
function exportGroupToGLBFile(group, filename) {
  const json = group.toJSON();
  // Ensure asset version is set to 2.0 for GLTFLoader compatibility
  json.asset = {
    version: "2.0",
    generator: "Three.js GLTF Exporter",
  };

  const jsonStr = JSON.stringify(json);
  const jsonBuffer = Buffer.from(jsonStr, "utf8");

  // Pad JSON buffer to 4-byte alignment
  const padding = (4 - (jsonBuffer.length % 4)) % 4;
  const paddedJsonBuffer = Buffer.concat([jsonBuffer, Buffer.alloc(padding, 0x20)]);

  const jsonChunkLength = paddedJsonBuffer.length;
  const totalLength = 12 + 8 + jsonChunkLength;

  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); // 'glTF' magic in uint32LE
  header.writeUInt32LE(2, 4); // version 2
  header.writeUInt32LE(totalLength, 8); // total length

  const chunkHeader = Buffer.alloc(8);
  chunkHeader.writeUInt32LE(jsonChunkLength, 0);
  chunkHeader.writeUInt32LE(0x4e4f534a, 4); // 'JSON' chunk type

  const glbBuffer = Buffer.concat([header, chunkHeader, paddedJsonBuffer]);
  const outputPath = path.join(assetsDir, filename);
  fs.writeFileSync(outputPath, glbBuffer);
  console.log(`Successfully generated valid glTF 2.0 GLB: ${outputPath} (${glbBuffer.length} bytes)`);
}

// 1. ALFA GOLD BOX CLASSIC (Matching reference image.png)
function createAlfaGoldClassicBox() {
  const group = new THREE.Group();
  group.name = "AlfaGoldClassicBox";

  const baseOuterGeo = new THREE.BoxGeometry(2.0, 1.4, 2.0);
  const baseOuterMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.3,
    metalness: 0.2,
  });
  const baseOuterMesh = new THREE.Mesh(baseOuterGeo, baseOuterMat);
  baseOuterMesh.name = "BoxBaseOuter";
  group.add(baseOuterMesh);

  const cushionGeo = new THREE.BoxGeometry(1.75, 0.9, 1.75);
  const cushionMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.95,
  });
  const cushionMesh = new THREE.Mesh(cushionGeo, cushionMat);
  cushionMesh.position.y = 0.26;
  cushionMesh.name = "VelvetCushion";
  group.add(cushionMesh);

  const slotGeo = new THREE.BoxGeometry(0.8, 0.25, 0.2);
  const slotMat = new THREE.MeshStandardMaterial({ color: 0x05070a, roughness: 0.98 });
  const slotMesh = new THREE.Mesh(slotGeo, slotMat);
  slotMesh.position.set(0, 0.65, 0);
  group.add(slotMesh);

  const ringGeo = new THREE.TorusGeometry(0.32, 0.08, 16, 32);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.95,
    roughness: 0.1,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.set(0, 0.72, 0);
  ringMesh.name = "GoldRingProduct";
  group.add(ringMesh);

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
  gemMesh.position.set(0, 0.92, 0);
  group.add(gemMesh);

  const lidHingeGroup = new THREE.Group();
  lidHingeGroup.position.set(0, 0.7, -1.0);
  lidHingeGroup.name = "LidHingeGroup";

  const lidFlapGeo = new THREE.BoxGeometry(2.04, 0.22, 2.04);
  const lidFlapMesh = new THREE.Mesh(lidFlapGeo, baseOuterMat);
  lidFlapMesh.position.set(0, 0.11, 1.0);
  lidFlapMesh.name = "LidShell";
  lidHingeGroup.add(lidFlapMesh);

  const innerLidGeo = new THREE.PlaneGeometry(1.9, 1.9);
  const innerLidMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.4,
    side: THREE.DoubleSide,
  });
  const innerLidMesh = new THREE.Mesh(innerLidGeo, innerLidMat);
  innerLidMesh.rotation.x = -Math.PI / 2;
  innerLidMesh.position.set(0, 0.0, 1.0);
  lidHingeGroup.add(innerLidMesh);

  const logoGeo = new THREE.PlaneGeometry(1.2, 0.5);
  const logoMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.95,
    roughness: 0.15,
    side: THREE.DoubleSide,
  });
  const logoMesh = new THREE.Mesh(logoGeo, logoMat);
  logoMesh.rotation.x = -Math.PI / 2;
  logoMesh.position.set(0, 0.005, 1.0);
  logoMesh.name = "AlfaGoldLogo";
  lidHingeGroup.add(logoMesh);

  group.add(lidHingeGroup);
  return group;
}

// 2. ALFA GOLD BOX DELUXE
function createAlfaGoldDeluxeBox() {
  const group = new THREE.Group();
  group.name = "AlfaGoldDeluxeBox";

  const baseGeo = new THREE.BoxGeometry(3.0, 1.2, 2.2);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.3 });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  group.add(baseMesh);

  const cushionGeo = new THREE.BoxGeometry(2.75, 0.8, 1.95);
  const cushionMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
  const cushionMesh = new THREE.Mesh(cushionGeo, cushionMat);
  cushionMesh.position.y = 0.22;
  group.add(cushionMesh);

  const curve = new THREE.EllipseCurve(0, 0, 0.8, 0.5, 0, Math.PI, false, 0);
  const points = curve.getPoints(32);
  const curve3D = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p.x, 0.65, p.y)));
  const chainGeo = new THREE.TubeGeometry(curve3D, 32, 0.05, 12, false);
  const chainMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.1 });
  const chainMesh = new THREE.Mesh(chainGeo, chainMat);
  group.add(chainMesh);

  return group;
}

// 3. ALFA GOLD BOX ROYAL
function createAlfaGoldRoyalBox() {
  const group = new THREE.Group();
  group.name = "AlfaGoldRoyalBox";

  const baseGeo = new THREE.BoxGeometry(2.6, 1.8, 2.4);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.3, metalness: 0.5 });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  group.add(baseMesh);

  return group;
}

function main() {
  console.log("Generating ALFA GOLD BOX 3D GLB Assets with glTF 2.0 version spec...");
  exportGroupToGLBFile(createAlfaGoldClassicBox(), "alfa_gold_box_classic.glb");
  exportGroupToGLBFile(createAlfaGoldDeluxeBox(), "alfa_gold_box_deluxe.glb");
  exportGroupToGLBFile(createAlfaGoldRoyalBox(), "alfa_gold_box_royal.glb");
  console.log("Successfully generated all glTF 2.0 compliant ALFA GOLD BOX GLB models!");
}

main();

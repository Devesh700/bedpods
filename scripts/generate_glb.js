import * as THREE from "three";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, "../src/assets");

// Custom GLB Binary Exporter without browser DOM dependencies
function exportGroupToGLBFile(group, filename) {
  const json = group.toJSON();
  const jsonStr = JSON.stringify(json);
  const jsonBuffer = Buffer.from(jsonStr, "utf8");

  // Pad JSON buffer to 4-byte alignment
  const padding = (4 - (jsonBuffer.length % 4)) % 4;
  const paddedJsonBuffer = Buffer.concat([jsonBuffer, Buffer.alloc(padding, 0x20)]);

  const jsonChunkLength = paddedJsonBuffer.length;
  const totalLength = 12 + 8 + jsonChunkLength;

  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46544c67, 0); // 'glTF' magic
  header.writeUInt32LE(2, 4); // version 2
  header.writeUInt32LE(totalLength, 8); // total length

  const chunkHeader = Buffer.alloc(8);
  chunkHeader.writeUInt32LE(jsonChunkLength, 0); // chunk length
  chunkHeader.writeUInt32LE(0x4e4f534a, 4); // 'JSON' chunk type

  const glbBuffer = Buffer.concat([header, chunkHeader, paddedJsonBuffer]);
  const outputPath = path.join(assetsDir, filename);
  fs.writeFileSync(outputPath, glbBuffer);
  console.log(`Generated GLB file: ${outputPath} (${glbBuffer.length} bytes)`);
}

function createBePodsProModel() {
  const group = new THREE.Group();
  group.name = "BePodsPro2Model";

  const caseGeo = new THREE.CapsuleGeometry(0.5, 0.7, 16, 32);
  const caseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.1 });
  const caseMesh = new THREE.Mesh(caseGeo, caseMat);
  caseMesh.rotation.z = Math.PI / 2;
  caseMesh.name = "ChargingCase";
  group.add(caseMesh);

  const leftEarbud = createEarbud(true, true);
  leftEarbud.position.set(-0.5, 0.35, 0.2);
  leftEarbud.name = "LeftEarbud";
  group.add(leftEarbud);

  const rightEarbud = createEarbud(false, true);
  rightEarbud.position.set(0.5, 0.35, 0.2);
  rightEarbud.name = "RightEarbud";
  group.add(rightEarbud);

  return group;
}

function createBePods4Model() {
  const group = new THREE.Group();
  group.name = "BePods4Model";

  const caseGeo = new THREE.CapsuleGeometry(0.48, 0.65, 16, 32);
  const caseMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.1 });
  const caseMesh = new THREE.Mesh(caseGeo, caseMat);
  caseMesh.rotation.z = Math.PI / 2;
  group.add(caseMesh);

  const leftEarbud = createEarbud(true, false);
  leftEarbud.position.set(-0.45, 0.32, 0.18);
  group.add(leftEarbud);

  const rightEarbud = createEarbud(false, false);
  rightEarbud.position.set(0.45, 0.32, 0.18);
  group.add(rightEarbud);

  return group;
}

function createBePodsMaxModel() {
  const group = new THREE.Group();
  group.name = "BePodsStudioMaxModel";

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.0, 0.2, 0),
    new THREE.Vector3(-0.8, 1.1, 0),
    new THREE.Vector3(0, 1.3, 0),
    new THREE.Vector3(0.8, 1.1, 0),
    new THREE.Vector3(1.0, 0.2, 0),
  ]);
  const headbandGeo = new THREE.TubeGeometry(curve, 32, 0.08, 16, false);
  const headbandMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.25 });
  const headbandMesh = new THREE.Mesh(headbandGeo, headbandMat);
  group.add(headbandMesh);

  const leftCup = createEarCup(true);
  leftCup.position.set(-0.95, 0.1, 0);
  group.add(leftCup);

  const rightCup = createEarCup(false);
  rightCup.position.set(0.95, 0.1, 0);
  group.add(rightCup);

  return group;
}

function createEarbud(isLeft, isPro) {
  const bud = new THREE.Group();

  const headGeo = new THREE.SphereGeometry(0.22, 24, 24);
  const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 });
  const headMesh = new THREE.Mesh(headGeo, headMat);
  bud.add(headMesh);

  if (isPro) {
    const tipGeo = new THREE.ConeGeometry(0.16, 0.18, 20);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 });
    const tipMesh = new THREE.Mesh(tipGeo, tipMat);
    tipMesh.rotation.x = Math.PI / 2;
    tipMesh.position.set(isLeft ? 0.12 : -0.12, 0.05, 0.16);
    bud.add(tipMesh);
  }

  const stemGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.55, 16);
  const stemMesh = new THREE.Mesh(stemGeo, headMat);
  stemMesh.position.set(0, -0.28, 0);
  bud.add(stemMesh);

  return bud;
}

function createEarCup(isLeft) {
  const cupGroup = new THREE.Group();

  const cupGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.35, 32);
  const cupMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.25 });
  const cupMesh = new THREE.Mesh(cupGeo, cupMat);
  cupMesh.rotation.z = Math.PI / 2;
  cupGroup.add(cupMesh);

  const cushionGeo = new THREE.TorusGeometry(0.48, 0.12, 16, 32);
  const cushionMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
  const cushionMesh = new THREE.Mesh(cushionGeo, cushionMat);
  cushionMesh.rotation.y = Math.PI / 2;
  cushionMesh.position.x = isLeft ? 0.16 : -0.16;
  cupGroup.add(cushionMesh);

  return cupGroup;
}

function main() {
  console.log("Generating GLB files in src/assets...");
  exportGroupToGLBFile(createBePodsProModel(), "bepods-pro.glb");
  exportGroupToGLBFile(createBePods4Model(), "bepods-4.glb");
  exportGroupToGLBFile(createBePodsMaxModel(), "bepods-max.glb");
  console.log("GLB asset generation completed.");
}

main();

import * as THREE from "three";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, "../src/assets");

// Custom GLTF JSON generator for node environment
function serializeGroupToGLTF(group) {
  const json = group.toJSON();
  return JSON.stringify(json, null, 2);
}

function createBePodsProModel() {
  const group = new THREE.Group();
  group.name = "BePodsPro2Model";

  const caseGeo = new THREE.CapsuleGeometry(0.5, 0.7, 16, 32);
  const caseMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0.1,
  });
  const caseMesh = new THREE.Mesh(caseGeo, caseMat);
  caseMesh.rotation.z = Math.PI / 2;
  caseMesh.name = "ChargingCase";
  group.add(caseMesh);

  const hingeGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.5, 16);
  const hingeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
  const hingeMesh = new THREE.Mesh(hingeGeo, hingeMat);
  hingeMesh.rotation.z = Math.PI / 2;
  hingeMesh.position.set(0, 0.2, -0.45);
  hingeMesh.name = "HingeAccent";
  group.add(hingeMesh);

  const ledGeo = new THREE.SphereGeometry(0.04, 16, 16);
  const ledMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.2 });
  const ledMesh = new THREE.Mesh(ledGeo, ledMat);
  ledMesh.position.set(0, 0.05, 0.52);
  ledMesh.name = "StatusLED";
  group.add(ledMesh);

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

  const baseTipGeo = new THREE.CylinderGeometry(0.062, 0.062, 0.08, 16);
  const baseTipMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 });
  const baseTipMesh = new THREE.Mesh(baseTipGeo, baseTipMat);
  baseTipMesh.position.set(0, -0.54, 0);
  bud.add(baseTipMesh);

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
  console.log("Exporting 3D object JSON assets to src/assets...");

  const proModel = createBePodsProModel();
  fs.writeFileSync(path.join(assetsDir, "bepods-pro-model.json"), serializeGroupToGLTF(proModel));

  const pods4Model = createBePods4Model();
  fs.writeFileSync(path.join(assetsDir, "bepods-4-model.json"), serializeGroupToGLTF(pods4Model));

  const maxModel = createBePodsMaxModel();
  fs.writeFileSync(path.join(assetsDir, "bepods-max-model.json"), serializeGroupToGLTF(maxModel));

  console.log("Successfully created 3D model asset files in src/assets!");
}

main();

import { assetUrl } from "../utils/assetUrl";
import { memo, Suspense } from "react";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { Environment, ContactShadows, BakeShadows } from "@react-three/drei";
import { StudioMaterials } from "../objects/StudioMaterials";
import NaruStand from "../objects/NaruStand";
import MemoryFrames from "../objects/MemoryFrames";
import ExhibitionObjects from "../objects/ExhibitionObjects";
import {
  Box,
  Bookshelf,
  Chair,
  Desk,
  Floor,
  LeafPlant,
} from "../objects/StudioObjects";
RectAreaLightUniformsLib.init();
import { plantPlacements } from "../data/studioLayout";
function Workspace() {
  return (
    <StudioMaterials><group>
      <color attach="background" args={["#e8deca"]} />
      <Environment files={assetUrl("/media/materials/studio_small_09-hdri.hdr")} environmentIntensity={0.45} environmentRotation={[0, 0.6, 0]} />
      <ambientLight intensity={0.12} />
      <hemisphereLight args={["#e7efff", "#776249", 0.32]} />
      <rectAreaLight position={[-5.5, 2.7, -1.4]} rotation={[0, -Math.PI / 2, 0]} width={3} height={2.6} intensity={3.4} color="#e8f0ff" />
      <directionalLight
        position={[-5, 4.1, -0.5]}
        intensity={3}
        color="#fff0db"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.00015}
        shadow-normalBias={0.025}
        shadow-radius={4}
      />
      <BakeShadows />
      <Floor />
      <ContactShadows position={[0, 0.036, 0]} scale={12} opacity={0.38} blur={2.2} far={4.5} resolution={1024} frames={1} color="#44382b" />
      <Box position={[0, 2.25, -6]} size={[12, 4.5, 0.2]} color="#eee5d4" />
      <Box position={[6, 2.25, 0]} size={[0.2, 4.5, 12]} color="#e7ddca" />
      <Box position={[-6, 2.25, 0]} size={[0.2, 4.5, 12]} color="#f3e8d6" />
      <Box position={[0, 2.25, 6]} size={[12, 4.5, 0.2]} color="#f3e8d6" />
      <Box position={[0, 4.5, 0]} size={[12, 0.16, 12]} color="#eee7d8" />
      {[-5.85, 5.85].map((x) => (
        <Box
          key={x}
          position={[x, 0.12, 0]}
          size={[0.07, 0.24, 12]}
          color="#d0c2aa"
        />
      ))}
      <Box
        position={[0, 0.12, -5.85]}
        size={[12, 0.24, 0.07]}
        color="#d0c2aa"
      />
      {/* Recessed window assembly, with a fixed exterior image-like sky panel. */}
      <Box
        position={[-5.86, 2.65, -1.4]}
        size={[0.08, 2.7, 3.1]}
        color="#c5d1cc"
      />
      <mesh position={[-5.8, 2.65, -1.4]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3.05, 2.65]} />
        <meshStandardMaterial color="#cfdfdf" emissive="#dbe9f2" emissiveIntensity={0.65} roughness={0.15} metalness={0.1} />
      </mesh>
      {[-2.95, -1.4, 0.15].map((z) => (
        <Box
          key={z}
          position={[-5.75, 2.65, z]}
          size={[0.18, 2.95, 0.07]}
          color="#eee5d5"
        />
      ))}
      {[1.2, 2.65, 4.1].map((y) => (
        <Box
          key={y}
          position={[-5.75, y, -1.4]}
          size={[0.18, 0.07, 3.2]}
          color="#eee5d5"
        />
      ))}
      <Box
        position={[-5.65, 1.17, -1.4]}
        size={[0.5, 0.1, 3.5]}
        color="#d5c5ab"
      />
      <Desk />
      <Suspense fallback={null}><NaruStand /></Suspense>
      <Chair />
      <Bookshelf />
      <LeafPlant {...plantPlacements.floor} />
      <Box
        position={[-0.6, 0.018, -1.5]}
        size={[5.8, 0.025, 3.8]}
        color="#d0c5af"
        finish="fabric"
      />
      <ExhibitionObjects />
      <MemoryFrames />
      <Box position={[3.1, 1.42, -5.55]} size={[2.8, 0.08, 0.55]} />
      <Box
        position={[4.7, 1.25, -5.35]}
        size={[0.95, 2.5, 0.95]}
        color="#ad9270"
      />
      <LeafPlant {...plantPlacements.cabinet} />
      {/* Closed interior door, relocated clear of the exhibit wall. */}
      <Box
        position={[5.82, 1.23, 3.8]}
        size={[0.1, 2.46, 1.4]}
        color="#b6a184"
      />
      {[-0.75, 0.75].map((z) => (
        <Box
          key={z}
          position={[5.72, 1.25, 3.8 + z]}
          size={[0.12, 2.5, 0.08]}
          color="#d6c6ad"
        />
      ))}
      <Box
        position={[5.72, 2.52, 3.8]}
        size={[0.12, 0.08, 1.58]}
        color="#d6c6ad"
      />
      <Box
        position={[5.65, 1.12, 3.35]}
        size={[0.14, 0.035, 0.22]}
        color="#565f4e"
      />
      {/* Warm ceiling pendant. */}
      <mesh position={[-0.8, 4.02, -2.8]}>
        <cylinderGeometry args={[0.015, 0.015, 0.8, 12]} />
        <meshStandardMaterial color="#5c5f50" />
      </mesh>
      <mesh position={[-0.8, 3.55, -2.8]}>
        <coneGeometry args={[0.44, 0.28, 32, 1, true]} />
        <meshStandardMaterial color="#6c765e" side={2} />
      </mesh>
      <pointLight position={[-0.8, 3.4, -2.8]} color="#ffdbab" intensity={5} distance={7} decay={2} />
    </group></StudioMaterials>
  );
}

export default memo(Workspace);

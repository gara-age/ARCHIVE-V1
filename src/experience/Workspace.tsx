import { Suspense } from "react";
import NaruStand from "../objects/NaruStand";
import ExhibitionObjects from "../objects/ExhibitionObjects";
import {
  Box,
  Bookshelf,
  Chair,
  Desk,
  Floor,
  LeafPlant,
} from "../objects/StudioObjects";
export default function Workspace() {
  return (
    <group>
      <color attach="background" args={["#e8deca"]} />
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#fff3dc", "#7b7968", 1.3]} />
      <directionalLight
        position={[-4, 4, 1]}
        intensity={3}
        color="#ffedcf"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0005}
      />
      <Floor />
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
      <LeafPlant position={[-4.9, 0, 0.4]} />
      <Box
        position={[-0.6, 0.018, -1.5]}
        size={[5.8, 0.025, 3.8]}
        color="#a6aa94"
      />
      <ExhibitionObjects />
      <Box position={[3.1, 1.42, -5.55]} size={[2.8, 0.08, 0.55]} />
      <Box
        position={[4.7, 1.25, -5.35]}
        size={[0.95, 2.5, 0.95]}
        color="#ad9270"
      />
      <LeafPlant position={[4.7, 2.52, -5.35]} />
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
      <pointLight position={[-0.8, 3.4, -2.8]} color="#ffdbab" intensity={4} />
    </group>
  );
}

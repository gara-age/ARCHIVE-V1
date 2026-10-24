import { ArchiveBook } from "./PersonalProps";
import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { createLeafGeometry, leafPose } from "./detailGeometry";
import { monitor, monitorHardware } from "../data/cameraRoutes";
import { plantPlacements } from "../data/studioLayout";
import { inferFinish, useStudioMaterials, type Finish } from "./StudioMaterials";
export function Box({
  position,
  size,
  color = "#c99b70",
  roughness = 0.7,
  rotation = [0, 0, 0],
  finish,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  roughness?: number;
  rotation?: [number, number, number];
  finish?: Finish;
}) {
  const surfaces = useStudioMaterials();
  const material = finish || inferFinish(color);
  const surface = material === "wood" ? surfaces.wood : material === "plaster" ? surfaces.plaster : material === "fabric" ? surfaces.fabric : undefined;
  const tint = material === "wood" ? "#e0c5a2" : color;
  return (
    <RoundedBox args={size} radius={Math.min(0.035, Math.min(...size) * 0.18)} smoothness={2} bevelSegments={2} position={position} rotation={rotation} castShadow receiveShadow>
      <meshStandardMaterial
        {...surface}
        customProgramCacheKey={() => material === "fabric" ? "woven-tint-v1" : "surface-v1"}
        onBeforeCompile={(shader) => {
          if (material !== "fabric") return;
          // Keep the room's original upholstery colors while preserving scanned fiber variation.
          shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>", `
            #ifdef USE_MAP
              vec4 woven = texture2D(map, vMapUv);
              float luminance = dot(woven.rgb, vec3(0.2126, 0.7152, 0.0722));
              diffuseColor *= vec4(vec3(clamp(luminance * 6.0 + 0.55, 0.5, 1.0)), woven.a);
            #endif
          `);
        }}
        color={tint}
        roughness={color === "#263833" ? 0.16 : material === "metal" ? 0.3 : material === "fabric" ? 0.95 : material === "wood" ? 0.68 : roughness}
        metalness={material === "metal" ? 0.9 : color === "#263833" ? 0.2 : 0}
        bumpMap={material === "fabric" ? surfaces.fabricBump : material === "metal" ? surfaces.metalBump : undefined}
        bumpScale={material === "fabric" ? 0.012 : material === "metal" ? 0.0015 : 0}
        emissive={color === "#263833" ? "#263833" : "#000000"}
        emissiveIntensity={0.1}
        normalScale={new THREE.Vector2(material === "plaster" ? 0.16 : material === "fabric" ? 0.65 : 0.4, material === "plaster" ? 0.16 : material === "fabric" ? 0.65 : 0.4)}
        envMapIntensity={material === "metal" ? 0.8 : 0.35}
      />
    </RoundedBox>
  );
}

function Cylinder({
  position,
  args,
  color,
}: {
  position: [number, number, number];
  args: [number, number, number, number?];
  color: string;
}) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.65} />
    </mesh>
  );
}
export function LeafPlant({
  position, scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const leaf = useMemo(createLeafGeometry, []);
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.31, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.22, 0.62, 48]} />
        <meshPhysicalMaterial color="#d8cbb9" roughness={0.32} clearcoat={0.35} clearcoatRoughness={0.3} />
      </mesh>
      <mesh position={[0, 0.625, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.276, 48]} /><meshStandardMaterial color="#342a20" roughness={1} />
      </mesh>
      <mesh position={[0, 0.625, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.29, 0.018, 8, 48]} /><meshStandardMaterial color="#d8cbb9" roughness={0.4} />
      </mesh>
      {Array.from({ length: 15 }, (_, i) => {
        const pose = leafPose(i);
        return <group key={i} position={[0, 0.64, 0]} rotation={pose.rotation} scale={pose.scale}>
          <mesh position={[0, 0.22, 0]} castShadow><cylinderGeometry args={[0.004, 0.006, 0.44, 6]} /><meshStandardMaterial color="#425c2d" roughness={0.8} /></mesh>
          <mesh geometry={leaf} position={[0, 0.4, 0]} castShadow><meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.65} /></mesh>
        </group>;
      })}
    </group>
  );
}

export function Desk() {
  return (
    <group>
      <Box position={[-0.65, 1.13, -3.35]} size={[5.5, 0.16, 1.65]} />
      {[-3.05, 1.75].map((x) => (
        <Box
          key={x}
          position={[x, 0.55, -3.35]}
          size={[0.12, 1.1, 1.3]}
          color="#4b4d42"
        />
      ))}
      <Box
        position={[-0.65, 1.24, -2.95]}
        size={[2.4, 0.035, 0.65]}
        color="#777e6d"
      />
      <Box
        position={[-0.9, 1.28, -2.96]}
        size={[1.3, 0.06, 0.42]}
        color="#e4ddd0"
      />
      {Array.from({ length: 12 }, (_, i) => (
        <Box
          key={i}
          position={[-1.48 + i * 0.105, 1.315, -2.96]}
          size={[0.065, 0.012, 0.3]}
          color="#c3beb3"
        />
      ))}
      <mesh position={[0.28, 1.3, -2.91]} scale={[0.11, 0.045, 0.16]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#ddd7ca" />
      </mesh>
      <group name="main-monitor-assembly">
        <Box {...monitorHardware.base} color="#353b3a" finish="metal" />
        <Box {...monitorHardware.neck} color="#353b3a" finish="metal" />
        <Box {...monitorHardware.mount} color="#353b3a" finish="metal" />
        <Box {...monitorHardware.shell} color="#292f2d" finish="plastic" roughness={0.48} />
        <Box position={[monitor.center[0], monitor.center[1], -3.719]} size={[monitor.width, monitor.height, 0.012]} color="#263833" />
        <Box position={[-0.65, 3.53, -3.7]} size={[3.5, 0.1, 0.045]} color="#292f2d" finish="plastic" roughness={0.48} />
        {[-2.35, 1.05].map((x) => <Box key={x} position={[x, 2.51, -3.7]} size={[0.1, 2.14, 0.045]} color="#292f2d" finish="plastic" roughness={0.48} />)}
        <Box {...monitorHardware.lowerBezel} color="#292f2d" finish="plastic" roughness={0.48} />
        <Box position={[monitor.center[0], monitor.center[1], -3.708]} size={[2.85, 0.008, 0.003]} color="#8eab91" />
        <mesh position={[0.86, 1.52, -3.674]}>
          <circleGeometry args={[0.007, 12]} /><meshBasicMaterial color="#a5c6ac" toneMapped={false} />
        </mesh>
      </group>
      <Cylinder
        position={[1.5, 1.39, -3.15]}
        args={[0.13, 0.11, 0.36, 24]}
        color="#ece3cf"
      />
      <Box
        position={[-2.6, 1.24, -3.22]}
        size={[0.6, 0.08, 0.8]}
        color="#aa7155"
      />
      <Box
        position={[-2.6, 1.3, -3.22]}
        size={[0.56, 0.04, 0.76]}
        color="#eee5d1"
      />
      <LeafPlant {...plantPlacements.desk} />
      <Box
        position={[-2.7, 1.25, -3.9]}
        size={[0.35, 0.08, 0.35]}
        color="#474b3f"
      />
      <Cylinder
        position={[-2.7, 1.85, -3.9]}
        args={[0.025, 0.025, 1.1, 12]}
        color="#474b3f"
      />
      <mesh position={[-2.5, 2.37, -3.85]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.25, 0.32, 24, 1, true]} />
        <meshStandardMaterial color="#7d876d" side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[-2.5, 2.15, -3.7]} color="#ffdb9c" intensity={2} />
    </group>
  );
}
export function Chair() {
  return (
    <group position={[-0.6, 0, -1.65]}>
      <Cylinder
        position={[0, 0.45, 0]}
        args={[0.045, 0.045, 0.8, 12]}
        color="#45483d"
      />
      <Box position={[0, 0.82, 0]} size={[0.95, 0.14, 0.83]} color="#68715d" />
      <Box
        position={[0, 1.3, 0.37]}
        size={[0.95, 0.95, 0.13]}
        color="#68715d"
      />
      {[-1, 1].map((i) => (
        <Box
          key={i}
          position={[i * 0.54, 1.02, 0]}
          size={[0.07, 0.08, 0.65]}
          color="#43483f"
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={`wheel-${i}`} position={[Math.sin(i * 1.256) * 0.59, 0.07, Math.cos(i * 1.256) * 0.59]} rotation={[Math.PI / 2, 0, i * 1.256]} castShadow>
          <cylinderGeometry args={[0.065, 0.065, 0.06, 20]} />
          <meshStandardMaterial color="#262925" roughness={0.8} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <Box
          key={i}
          position={[
            Math.sin(i * 1.256) * 0.28,
            0.1,
            Math.cos(i * 1.256) * 0.28,
          ]}
          rotation={[0, i * 1.256, 0]}
          size={[0.07, 0.08, 0.72]}
          color="#45483d"
        />
      ))}
    </group>
  );
}
export function Bookshelf() {
  return (
    <group position={[-4.7, 0, -4.45]}>
      {[-0.7, 0.7].map((x) => (
        <Box key={x} position={[x, 1.6, 0]} size={[0.08, 3.2, 0.58]} />
      ))}
      {[0.15, 1.05, 1.95, 2.85, 3.25].map((y) => (
        <Box key={y} position={[0, y, 0]} size={[1.5, 0.08, 0.6]} />
      ))}
      {Array.from({ length: 15 }, (_, i) => {
        const height = 0.58 + (i % 3) * 0.07;
        return <group key={i} position={[-0.53 + (i % 5) * 0.21, 0.2 + Math.floor(i / 5) * 0.9 + height / 2, 0]} rotation={[0, 0, i % 5 === 4 ? -0.07 : 0]}>
          <ArchiveBook index={i} height={height} />
        </group>;
      })}
    </group>
  );
}
export function Floor() {
  const { floor } = useStudioMaterials();
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial {...floor} color="#d6bd99" roughness={0.85} normalScale={new THREE.Vector2(0.28, 0.28)} envMapIntensity={0.4} />
    </mesh>
  );
}

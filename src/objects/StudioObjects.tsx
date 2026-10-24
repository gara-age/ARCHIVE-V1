import { useMemo } from "react";
import * as THREE from "three";
export function Box({
  position,
  size,
  color = "#c99b70",
  roughness = 0.7,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  roughness?: number;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
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
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <Cylinder
        position={[0, 0.32, 0]}
        args={[0.3, 0.22, 0.64, 24]}
        color="#c4ad91"
      />
      {Array.from({ length: 11 }, (_, i) => (
        <group key={i} rotation={[0, i * 2.4, 0]}>
          <mesh
            position={[0.17, 0.85 + i * 0.045, 0]}
            rotation={[0, 0, -0.6]}
            scale={[0.13, 0.48, 0.07]}
            castShadow
          >
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial color={i % 2 ? "#738367" : "#879974"} />
          </mesh>
        </group>
      ))}
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
      <Box
        position={[-0.65, 1.32, -3.77]}
        size={[0.7, 0.08, 0.4]}
        color="#353b3a"
      />
      <Box
        position={[-0.65, 1.58, -3.82]}
        size={[0.12, 0.55, 0.1]}
        color="#353b3a"
      />
      <Box
        position={[-0.65, 2.05, -3.8]}
        size={[3.5, 2.06, 0.15]}
        color="#292f2d"
      />
      <Box
        position={[-0.65, 2.05, -3.719]}
        size={[3.3, 1.86, 0.012]}
        color="#263833"
      />
      <Box
        position={[-0.65, 2.05, -3.708]}
        size={[2.85, 0.008, 0.003]}
        color="#8eab91"
      />
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
      <LeafPlant position={[1.75, 1.21, -3.75]} />
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
      {Array.from({ length: 15 }, (_, i) => (
        <Box
          key={i}
          position={[-0.53 + (i % 5) * 0.21, 0.5 + Math.floor(i / 5) * 0.9, 0]}
          size={[0.13, 0.58 + (i % 3) * 0.07, 0.4]}
          color={["#84917a", "#b69a79", "#d6ceba", "#545c54", "#9c6e56"][i % 5]}
        />
      ))}
      <LeafPlant position={[0, 3.29, 0]} />
    </group>
  );
}
export function Floor() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#b39371";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 32; i++) {
      ctx.strokeStyle = `rgba(75,53,33,${0.03 + (i % 4) * 0.015})`;
      ctx.beginPath();
      ctx.moveTo(i * 8, 0);
      ctx.lineTo(i * 8 + 2, 256);
      ctx.stroke();
    }
    ctx.strokeStyle = "#8c7357";
    ctx.strokeRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(16, 4);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial map={texture} roughness={0.8} />
    </mesh>
  );
}

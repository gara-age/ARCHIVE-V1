import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { useStudioMaterials } from "./StudioMaterials";

const bookColors = ["#65725c", "#af8860", "#d4cbb7", "#414f4b", "#965e49"];
export function ArchiveBook({ index, height }: { index: number; height: number }) {
  const { fabricBump } = useStudioMaterials();
  const spine = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = 128; canvas.height = 512;
    const c = canvas.getContext("2d")!;
    c.fillStyle = bookColors[index % 5]; c.fillRect(0, 0, 128, 512);
    c.fillStyle = "#d8c397";
    for (const y of [30, 38, 438, 446]) c.fillRect(12, y, 104, 3);
    c.save(); c.translate(69, 220); c.rotate(Math.PI / 2);
    c.font = "22px Georgia"; c.textAlign = "center";
    c.fillText(["DESIGN", "ARCHIVE", "HUMAN", "STORIES", "CRAFT"][index % 5], 0, 0);
    c.restore(); c.font = "18px Georgia"; c.textAlign = "center"; c.fillText(`0${index + 1}`, 64, 402);
    const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }, [index]);
  return <group>
    <RoundedBox args={[0.112, height - 0.027, 0.365]} radius={0.006} position={[0, 0, -0.004]} castShadow><meshStandardMaterial color="#e5ddc8" roughness={0.92} /></RoundedBox>
    {[-1, 1].map(side => <RoundedBox key={side} args={[0.012, height, 0.41]} radius={0.003} position={[side * 0.062, 0, 0]} castShadow><meshStandardMaterial color={bookColors[index % 5]} bumpMap={fabricBump} bumpScale={0.001} roughness={0.78} /></RoundedBox>)}
    <RoundedBox args={[0.136, height, 0.028]} radius={0.009} position={[0, 0, 0.195]} castShadow><meshStandardMaterial color={bookColors[index % 5]} roughness={0.72} /></RoundedBox>
    <mesh position={[0, 0, 0.2095]}><planeGeometry args={[0.12, height - 0.012]} /><meshStandardMaterial map={spine} roughness={0.78} /></mesh>
    {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[0, -height / 2 + 0.025 + i * (height - 0.05) / 18, -0.189]}><boxGeometry args={[0.108, 0.0012, 0.001]} /><meshStandardMaterial color="#bcb29c" roughness={1} /></mesh>)}
  </group>;
}

function Wing({ points, y = 0 }: { points: [number, number][]; y?: number }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape(); points.forEach(([x, z], i) => i ? shape.lineTo(x, z) : shape.moveTo(x, z)); shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.018, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.004, bevelSegments: 2, steps: 1 }); g.rotateX(Math.PI / 2); return g;
  }, [points]);
  return <mesh geometry={geometry} position={[0, y, 0]} castShadow receiveShadow><meshStandardMaterial color="#dadbd4" metalness={0.6} roughness={0.3} /></mesh>;
}
export function DetailedAirplane() {
  const { metalBump } = useStudioMaterials();
  return <group position={[-2.1, 1.81, 5.05]} rotation={[0, -0.25, 0]}>
    <mesh rotation={[0, 0, -Math.PI / 2]} castShadow><capsuleGeometry args={[0.071, 0.94, 12, 32]} /><meshPhysicalMaterial color="#eeeee7" metalness={0.35} roughness={0.25} clearcoat={0.5} bumpMap={metalBump} bumpScale={0.0003} /></mesh>
    <Wing points={[[0.17, 0.06], [-0.22, 0.65], [-0.36, 0.65], [-0.12, 0.04]]} y={-0.025} />
    <Wing points={[[0.17, -0.06], [-0.22, -0.65], [-0.36, -0.65], [-0.12, -0.04]]} y={-0.025} />
    <Wing points={[[-0.33, 0], [-0.51, 0.25], [-0.59, 0.25], [-0.5, 0]]} y={0.02} />
    <Wing points={[[-0.33, 0], [-0.51, -0.25], [-0.59, -0.25], [-0.5, 0]]} y={0.02} />
    <mesh position={[-0.43, 0.075, 0]} castShadow><bufferGeometry><bufferAttribute attach="attributes-position" args={[new Float32Array([-0.14,0,-0.009, 0.09,0,-0.009, -0.1,0.24,-0.009, -0.14,0,0.009, -0.1,0.24,0.009, 0.09,0,0.009]),3]} /></bufferGeometry><meshStandardMaterial color="#596c60" side={THREE.DoubleSide} metalness={0.3} roughness={0.35} /></mesh>
    {[-1, 1].map(side => <group key={side}>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0.31 - i * 0.072, 0.022, side * 0.069]} scale={[1, 1.3, 0.25]}><sphereGeometry args={[0.013, 8, 8]} /><meshStandardMaterial color="#253c43" metalness={0.3} roughness={0.18} /></mesh>)}
      <mesh position={[0.43, 0.035, side * 0.043]} scale={[1.8, 0.8, 0.3]} rotation={[0, side * 0.45, -0.25]}><sphereGeometry args={[0.032, 12, 8]} /><meshStandardMaterial color="#22363e" roughness={0.16} metalness={0.4} /></mesh>
      <group position={[-0.015, -0.083, side * 0.25]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow><cylinderGeometry args={[0.042, 0.034, 0.17, 24]} /><meshStandardMaterial color="#bcc1bd" metalness={0.8} roughness={0.25} /></mesh>
        <mesh position={[0, -0.087, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.033, 0.007, 8, 24]} /><meshStandardMaterial color="#d5d8d3" metalness={0.9} roughness={0.23} /></mesh>
        <mesh position={[0, -0.085, 0]}><cylinderGeometry args={[0.029, 0.029, 0.003, 24]} /><meshStandardMaterial color="#26302f" metalness={0.6} roughness={0.5} /></mesh>
      </group>
    </group>)}
    <mesh position={[0, -0.2, 0]} rotation={[0, 0, -0.18]} castShadow><cylinderGeometry args={[0.018, 0.024, 0.25, 16]} /><meshStandardMaterial color="#848c83" metalness={0.85} roughness={0.25} /></mesh>
    <RoundedBox position={[0, -0.32, 0]} args={[0.48, 0.045, 0.31]} radius={0.025} castShadow><meshStandardMaterial color="#303d36" roughness={0.4} metalness={0.3} /></RoundedBox>
  </group>;
}

function BreadScore({ z }: { z: number }) {
  const geometry = useMemo(() => {
    const positions: number[] = [], indices: number[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20, x = (t - 0.5) * 0.14;
      for (const side of [-1, 1]) {
        const depth = z + x * 0.5 + side * 0.009 * Math.sin(Math.PI * t);
        const y = 0.074 * Math.sqrt(Math.max(0, 1 - (x / 0.108) ** 2 - (depth / 0.225) ** 2)) + 0.001;
        positions.push(x, y, depth);
      }
      if (i < 20) { const a = i * 2; indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals(); return g;
  }, [z]);
  return <mesh geometry={geometry}><meshStandardMaterial color="#e8c18a" roughness={1} side={THREE.DoubleSide} /></mesh>;
}

export function DetailedBakingObjects() {
  const { wood } = useStudioMaterials();
  const crust = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 256;
    const c = canvas.getContext("2d")!, pixels = c.createImageData(256, 256);
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const noise = (Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1;
      const toast = Math.sin(x * 0.035) * Math.sin(y * 0.04) * 22 + noise * 16;
      const i = (y * 256 + x) * 4; pixels.data[i] = 183 + toast; pixels.data[i + 1] = 112 + toast; pixels.data[i + 2] = 48 + toast * 0.6; pixels.data[i + 3] = 255;
    }
    c.putImageData(pixels, 0, 0); const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, []);
  return <group position={[-3.45, 1.48, 5.1]}>
    <mesh receiveShadow castShadow><cylinderGeometry args={[0.31, 0.29, 0.028, 48]} /><meshPhysicalMaterial color="#e8e4d8" roughness={0.24} clearcoat={0.6} /></mesh>
    <mesh position={[0, 0.017, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.285, 0.012, 10, 48]} /><meshPhysicalMaterial color="#f6efdf" roughness={0.22} /></mesh>
    {[-0.12, 0.12].map((x, i) => <group key={i} position={[x, 0.082, 0]} rotation={[0, i ? -0.25 : 0.3, 0]}>
      <mesh scale={[0.108, 0.074, 0.225]} castShadow><sphereGeometry args={[1, 32, 20]} /><meshStandardMaterial map={crust} bumpMap={crust} bumpScale={0.004} roughness={0.91} color={i ? '#edbc86' : '#ffffff'} /></mesh>
      {[-0.1, 0, 0.1].map(z => <BreadScore key={z} z={z} />)}
    </group>)}
    <group position={[0.51, 0.048, 0.03]} rotation={[0, -0.2, Math.PI / 2]}>
      <mesh castShadow><cylinderGeometry args={[0.045, 0.045, 0.35, 32]} /><meshStandardMaterial {...wood} color="#ead1a3" roughness={0.64} /></mesh>
      {[-1, 1].map(side => <mesh key={side} position={[0, side * 0.24, 0]} castShadow><capsuleGeometry args={[0.021, 0.13, 6, 16]} /><meshStandardMaterial {...wood} color="#c9a16b" roughness={0.65} /></mesh>)}
    </group>
  </group>;
}

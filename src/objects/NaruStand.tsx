import { useTexture } from "@react-three/drei";
import { DoubleSide, SRGBColorSpace } from "three";
import { Box } from "./StudioObjects";

// Original alpha defines a character-shaped tabletop stand, with no easel or rectangular backing.
export default function NaruStand() {
  const texture = useTexture("/media/characters/naru.png");
  texture.colorSpace = SRGBColorSpace;
  return (
    <group position={[1.52, 1.21, -2.85]} rotation={[0, 0.32, 0]}>
      <Box position={[0, 0.035, 0]} size={[0.5, 0.07, 0.25]} color="#ffffff" />
      <mesh position={[0, 0.49, 0]}>
        <planeGeometry args={[0.95, 0.95]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.05}
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

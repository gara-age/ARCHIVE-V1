import { assetUrl } from "../utils/assetUrl";
import { useTexture } from "@react-three/drei";
import { SRGBColorSpace, type Texture } from "three";
import { memoryPhotos, type MemoryPhoto } from "../data/memoryPhotos";
import { Box } from "./StudioObjects";
function PhotoFrame({ photo, texture }: { photo: MemoryPhoto; texture: Texture }) {
  const height = photo.displayHeight;
  const width = height * photo.width / photo.height;
  const outerHeight = height + 0.12;
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return (
    <group name={`memory-frame-${photo.id}`} position={photo.position} rotation={photo.rotation}>
      <Box position={[0, 0, 0]} size={[width + 0.12, outerHeight, 0.045]} color="#75654c" />
      <Box position={[0, 0, 0.027]} size={[width + 0.073, height + 0.073, 0.012]} color="#f7f3e9" finish="paper" />
      <mesh position={[0, 0, 0.034]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.036]}>
        <planeGeometry args={[width + 0.02, height + 0.02]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.035} roughness={0.12} metalness={0.15} depthWrite={false} />
      </mesh>
      {photo.kind === "table" && (
        <Box position={[0, -outerHeight * 0.24, -0.075]} size={[0.13, outerHeight * 0.5, 0.025]} rotation={[-0.3, 0, 0]} color="#4a4034" />
      )}
    </group>
  );
}
export default function MemoryFrames() {
  const textures = useTexture(memoryPhotos.map((photo) => assetUrl(photo.src)));
  return <group name="personal-memory-frames">{memoryPhotos.map((photo, index) => <PhotoFrame key={photo.id} photo={photo} texture={textures[index]} />)}</group>;
}

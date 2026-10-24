import { assetUrl } from "../utils/assetUrl";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useTexture } from "@react-three/drei";
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from "three";
export type Finish = "wood" | "plaster" | "metal" | "fabric" | "paper" | "plastic";
type Surface = { map: Texture; normalMap: Texture; roughnessMap: Texture };
type Materials = { wood: Surface; plaster: Surface; floor: Surface; fabric: Surface; fabricBump: Texture; metalBump: Texture; stoneMap: Texture };
const Context = createContext<Materials | null>(null);
const names = ["wood_table_001", "plastered_wall_02", "wood_floor", "book_pattern"];
const urls = names.flatMap((name) => ["diffuse", "nor_gl", "roughness"].map((map) => assetUrl(`/media/materials/${name}-${map}.jpg`)));
export function StudioMaterials({ children }: { children: ReactNode }) {
  const textures = useTexture(urls);
  const materials = useMemo(() => {
    const surfaces = names.map((_, index) => {
      const [map, normalMap, roughnessMap] = textures.slice(index * 3, index * 3 + 3);
      for (const texture of [map, normalMap, roughnessMap]) {
        texture.wrapS = texture.wrapT = RepeatWrapping;
        texture.anisotropy = 8;
        texture.repeat.set(index === 1 ? 4 : index === 2 ? 3 : index === 3 ? 4 : 1, index === 1 ? 2 : index === 2 ? 3 : index === 3 ? 4 : 1);
      }
      map.colorSpace = SRGBColorSpace;
      return { map, normalMap, roughnessMap };
    });
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const image = ctx.createImageData(128, 128);
    for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
      const weave = ((x % 8 < 4) !== (y % 8 < 4)) ? 170 : 100;
      const value = weave + Math.sin(x * 17.1 + y * 93.7) * 18;
      const index = (y * 128 + x) * 4;
      image.data[index] = image.data[index + 1] = image.data[index + 2] = value;
      image.data[index + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    const fabricBump = new CanvasTexture(canvas);
    fabricBump.wrapS = fabricBump.wrapT = RepeatWrapping;
    fabricBump.repeat.set(14, 14); fabricBump.anisotropy = 8;
    const detail = (kind: "fabric" | "metal" | "stone") => {
      const c = document.createElement("canvas"); c.width = c.height = 128;
      const context = c.getContext("2d")!, pixels = context.createImageData(128, 128);
      for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
        const random = Math.sin(x * 127.1 + y * 311.7) * 43758.5453 % 1;
        const value = kind === "fabric" ? 228 + random * 9 + (x % 8 < 4 ? 6 : 0) : kind === "metal" ? 128 + Math.sin(y * 9.7) * 12 + random * 3 : 180 + random * 28 + Math.sin(x * 0.09 + Math.sin(y * 0.07)) * 16;
        const i = (y * 128 + x) * 4;
        pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value; pixels.data[i + 3] = 255;
      }
      context.putImageData(pixels, 0, 0);
      const texture = new CanvasTexture(c); texture.wrapS = texture.wrapT = RepeatWrapping; texture.anisotropy = 4;
      texture.repeat.set(kind === "stone" ? 2 : 12, kind === "stone" ? 2 : 12);
      if (kind !== "metal") texture.colorSpace = SRGBColorSpace;
      return texture;
    };
    return { wood: surfaces[0], plaster: surfaces[1], floor: surfaces[2], fabric: surfaces[3], fabricBump, metalBump: detail("metal"), stoneMap: detail("stone") };
  }, [textures]);
  return <Context.Provider value={materials}>{children}</Context.Provider>;
}
export function useStudioMaterials() {
  const value = useContext(Context);
  if (!value) throw new Error("Studio material provider missing");
  return value;
}
export function inferFinish(color: string): Finish {
  if (["#c99b70", "#ad9270", "#b6a184", "#75654c", "#c9b89a", "#d5c5ab"].includes(color)) return "wood";
  if (["#eee5d4", "#e7ddca", "#f3e8d6", "#eee7d8"].includes(color)) return "plaster";
  if (["#68715d", "#a6aa94", "#777e6d", "#84917a", "#b69a79", "#d6ceba", "#545c54", "#9c6e56"].includes(color)) return "fabric";
  if (["#4b4d42", "#353b3a", "#292f2d", "#43483f", "#45483d", "#303531", "#626b58"].includes(color)) return "metal";
  return "plastic";
}

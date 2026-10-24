export type MemoryPhoto = {
  id: string;
  src: string;
  label: string;
  width: number;
  height: number;
  displayHeight: number;
  kind: "table" | "wall";
  position: [number, number, number];
  rotation: [number, number, number];
};
// Small environmental photographs; preserve the full supplied composition and aspect ratio.
export const memoryPhotos: MemoryPhoto[] = [
  {
    id: "childhood-memory", src: "/media/memories/childhood-memory.jpg", label: "어린 시절의 사진",
    width: 576, height: 768, displayHeight: 0.54, kind: "table",
    position: [-4.7, 3.62, -4.25], rotation: [-0.08, 0.25, 0],
  },
  {
    id: "childhood-portrait", src: "/media/memories/childhood-portrait.jpg", label: "어린 시절의 사진",
    width: 480, height: 768, displayHeight: 0.58, kind: "wall",
    position: [4.05, 2.6, 5.875], rotation: [0, Math.PI, 0],
  },
  {
    id: "culinary-class", src: "/media/memories/culinary-class.jpg", label: "조리 실습 사진",
    width: 768, height: 576, displayHeight: 0.36, kind: "table",
    position: [2.3, 1.37, 5.1], rotation: [-0.08, Math.PI - 0.12, 0],
  },
  {
    id: "bakery-name-tag", src: "/media/memories/bakery-name-tag.jpg", label: "안스베이커리 명찰 사진",
    width: 768, height: 768, displayHeight: 0.36, kind: "table",
    position: [-0.52, 1.7, 5.05], rotation: [-0.08, Math.PI + 0.12, 0],
  },
];

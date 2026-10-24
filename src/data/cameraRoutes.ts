export type Vec3 = [number, number, number];
export type FocusSurface = {
  center: Vec3;
  width: number;
  height: number;
  rotation: number;
  kind: "monitor" | "frame";
};
export const monitor: FocusSurface = {
  center: [-0.65, 2.05, -3.72],
  width: 3.3,
  height: 1.86,
  rotation: 0,
  kind: "monitor",
};
export const focusSurfaces: Record<string, FocusSurface> = {
  works: monitor,
  achievements: {
    center: [2.8, 2.65, -5.7],
    width: 2.45,
    height: 1.55,
    rotation: 0,
    kind: "frame",
  },
  certifications: {
    center: [5.7, 2.65, -3.15],
    width: 2.5,
    height: 1.6,
    rotation: -Math.PI / 2,
    kind: "frame",
  },
  skills: {
    center: [5.65, 2.1, 0.35],
    width: 2.45,
    height: 1.5,
    rotation: -Math.PI / 2,
    kind: "monitor",
  },
  about: {
    center: [1.9, 2.45, 5.7],
    width: 2.4,
    height: 1.6,
    rotation: Math.PI,
    kind: "frame",
  },
  beyond: {
    center: [-2.1, 2.45, 5.7],
    width: 2.5,
    height: 1.6,
    rotation: Math.PI,
    kind: "frame",
  },
};
// Shared exhibits keep the same room and physical footprint.
focusSurfaces.campus = focusSurfaces.skills;
focusSurfaces.workstyle = focusSurfaces.about;

export const cameraRoutes = {
  opening: {
    position: [4.3, 2.65, 4.7] as Vec3,
    target: [-0.7, 1.7, -2.9] as Vec3,
  },
  contact: {
    position: [-3.8, 2.65, 3.6] as Vec3,
    target: [0.5, 1.9, -3.4] as Vec3,
  },
  waypoint: [0, 2.65, 1.2] as Vec3,
  duration: 2.8,
  returnDuration: 3.5,
  cooldown: 550,
};

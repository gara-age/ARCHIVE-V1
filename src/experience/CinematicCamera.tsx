import { useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Vector3, type CatmullRomCurve3 } from "three";
import { cameraRoutes, focusSurfaces } from "../data/cameraRoutes";
import { sections } from "../data/sections";
import { fitSurface, interiorPath, flightEase } from "../navigation/cameraMath.mjs";
import { useTourStore } from "../navigation/useTourStore";
type Flight = { path: CatmullRomCurve3; elapsed: number; duration: number; shared: boolean; fromTarget: Vector3; toTarget: Vector3; endPosition: Vector3; fromFov: number; toFov: number };
export default function CinematicCamera() {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const size = useThree((state) => state.size);
  const index = useTourStore((state) => state.sectionIndex);
  const target = useRef(new Vector3(...cameraRoutes.opening.target));
  const flight = useRef<Flight | null>(null);
  const initialized = useRef(false);
  const section = sections[index];
  const surface = focusSurfaces[section.id];
  const lens = (fov: number) => {
    const aspect = size.width / size.height;
    if (Math.abs(camera.fov - fov) > 0.0001 || camera.aspect !== aspect) {
      camera.fov = fov; camera.aspect = aspect; camera.updateProjectionMatrix();
    }
  };
  const project = () => {
    if (!surface) return;
    const corners = [[-surface.width / 2, surface.height / 2], [surface.width / 2, -surface.height / 2]].map(([x, y]) => new Vector3(surface.center[0] + Math.cos(surface.rotation) * x, surface.center[1] + y, surface.center[2] - Math.sin(surface.rotation) * x).project(camera));
    const [a, b] = corners;
    useTourStore.getState().setRect({ left: (a.x + 1) * size.width / 2, top: (1 - a.y) * size.height / 2, width: (b.x - a.x) * size.width / 2, height: (a.y - b.y) * size.height / 2 });
  };
  useLayoutEffect(() => {
    const end = surface ? fitSurface(surface, size.width / size.height) : { ...(section.id === "contact" ? cameraRoutes.contact : cameraRoutes.opening), fov: 45 };
    const endPosition = new Vector3(...end.position);
    const endTarget = new Vector3(...end.target);
    if (!initialized.current || useTourStore.getState().viewMode !== "FLYING") {
      initialized.current = true;
      flight.current = null;
      camera.position.copy(endPosition); target.current.copy(endTarget); lens(end.fov);
      camera.lookAt(target.current); camera.updateMatrixWorld(); project();
      return;
    }
    const shared = camera.position.distanceTo(endPosition) < 0.05;
    flight.current = {
      path: interiorPath(camera.position.toArray(), end.position, cameraRoutes.waypoint), elapsed: 0,
      duration: shared || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.15 : section.id === "contact" ? cameraRoutes.returnDuration : cameraRoutes.duration,
      shared, fromTarget: target.current.clone(), toTarget: endTarget, endPosition, fromFov: camera.fov, toFov: end.fov,
    };
    return () => { flight.current = null; };
  }, [index, size.width, size.height]);
  useFrame((_, delta) => {
    const current = flight.current;
    if (!current) return;
    // Advance in the same loop as rendering; a long stall never jumps far down the route.
    current.elapsed += Math.min(delta, 0.05);
    const progress = Math.min(1, current.elapsed / current.duration);
    const eased = flightEase(progress);
    if (!current.shared) current.path.getPoint(eased, camera.position);
    target.current.lerpVectors(current.fromTarget, current.toTarget, eased);
    lens(current.fromFov + (current.toFov - current.fromFov) * eased);
    camera.lookAt(target.current); camera.updateMatrixWorld();
    if (progress === 1) {
      camera.position.copy(current.endPosition);
      flight.current = null; project(); useTourStore.getState().arrive();
    }
  });
  return null;
}

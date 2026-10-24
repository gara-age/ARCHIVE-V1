import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { PerspectiveCamera, Vector3 } from "three";
import gsap from "gsap";
import { cameraRoutes, focusSurfaces } from "../data/cameraRoutes";
import { sections } from "../data/sections";
import { fitSurface, interiorPath } from "../navigation/cameraMath.mjs";
import { useTourStore } from "../navigation/useTourStore";
export default function CinematicCamera() {
  const { camera, size } = useThree();
  const index = useTourStore((s) => s.sectionIndex);
  const mode = useTourStore((s) => s.viewMode);
  const target = useRef(new Vector3(...cameraRoutes.opening.target));
  const initialized = useRef(false);
  const moving = useRef(false);
  const section = sections[index];
  const surface = focusSurfaces[section.id];
  const destination = () =>
    surface
      ? fitSurface(surface, size.width / size.height)
      : {
          ...(section.id === "contact" ? cameraRoutes.contact : cameraRoutes.opening),
          fov: 45,
        };
  const project = () => {
    if (!surface) return;
    const corners = [
      [-surface.width / 2, surface.height / 2],
      [surface.width / 2, -surface.height / 2],
    ].map(([x, y]) =>
      new Vector3(
        surface.center[0] + Math.cos(surface.rotation) * x,
        surface.center[1] + y,
        surface.center[2] - Math.sin(surface.rotation) * x,
      ).project(camera),
    );
    const [a, b] = corners;
    useTourStore.getState().setRect({
      left: ((a.x + 1) * size.width) / 2,
      top: ((1 - a.y) * size.height) / 2,
      width: ((b.x - a.x) * size.width) / 2,
      height: ((a.y - b.y) * size.height) / 2,
    });
  };
  const setLens = (fov: number) => {
    const c = camera as PerspectiveCamera;
    c.fov = fov;
    c.aspect = size.width / size.height;
    c.updateProjectionMatrix();
  };
  useEffect(() => {
    if (!initialized.current) {
      const end = destination();
      camera.position.set(...(end.position as [number, number, number]));
      target.current.set(...(end.target as [number, number, number]));
      setLens(end.fov);
      camera.lookAt(target.current);
      camera.updateMatrixWorld();
      initialized.current = true;
      useTourStore.getState().setReady();
    }
    if (useTourStore.getState().viewMode !== "FLYING") {
      project();
      return;
    }
    moving.current = true;
    const end = destination();
    const sharedExhibit = camera.position.distanceTo(new Vector3(...end.position)) < 0.05;
    const path = interiorPath(
      camera.position.toArray(),
      end.position,
      cameraRoutes.waypoint,
    );
    const fromTarget = target.current.clone();
    const toTarget = new Vector3(...(end.target as [number, number, number]));
    const fromFov = (camera as PerspectiveCamera).fov;
    const progress = { value: 0 };
    const tween = gsap.to(progress, {
      value: 1,
      duration: sharedExhibit || window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0.15
        : section.id === "contact"
          ? cameraRoutes.returnDuration
          : cameraRoutes.duration,
      ease: "power2.inOut",
      onUpdate: () => {
        if (!sharedExhibit) camera.position.copy(path.getPoint(progress.value));
        target.current.lerpVectors(fromTarget, toTarget, progress.value);
        setLens(fromFov + (end.fov - fromFov) * progress.value);
        camera.lookAt(target.current);
        camera.updateMatrixWorld();
      },
      onComplete: () => {
        moving.current = false;
        project();
        useTourStore.getState().arrive();
      },
    });
    return () => {
      tween.kill();
      moving.current = false;
    };
  }, [index]);
  useEffect(() => {
    if (moving.current) return;
    const end = destination();
    setLens(end.fov);
    camera.position.set(...(end.position as [number, number, number]));
    target.current.set(...(end.target as [number, number, number]));
    camera.lookAt(target.current);
    camera.updateMatrixWorld();
    project();
  }, [size.width, size.height, mode]);
  return null;
}

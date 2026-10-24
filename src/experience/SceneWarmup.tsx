import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
export default function SceneWarmup({ onReady, onFailure }: { onReady: () => void; onFailure: () => void }) {
  const { gl, scene, camera } = useThree();
  const frames = useRef(0);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useFrame(() => {
    if (++frames.current !== 3) return;
    // Environment and texture uploads settle before the first interactive camera flight.
    gl.compileAsync(scene, camera).then(() => {
      if (!alive.current) return;
      gl.shadowMap.needsUpdate = true;
      onReady();
    }).catch(() => {
      if (alive.current) onFailure();
    });
  });
  return null;
}

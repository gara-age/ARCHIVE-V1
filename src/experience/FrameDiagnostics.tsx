import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTourStore } from "../navigation/useTourStore";
// DOM data for local browser QA only; no visible overlay or per-frame React updates.
export default function FrameDiagnostics() {
  const canvas = useThree((state) => state.gl.domElement);
  const samples = useRef<number[]>([]);
  const active = useRef(false);
  useFrame((_, delta) => {
    const flying = useTourStore.getState().viewMode === "FLYING";
    if (flying && !active.current) samples.current = [];
    if (flying) samples.current.push(delta * 1000);
    if (!flying && active.current && samples.current.length) {
      const values = [...samples.current].sort((a, b) => a - b);
      canvas.dataset.flightFrames = JSON.stringify({
        section: useTourStore.getState().sectionIndex,
        samples: values.length,
        medianMs: +values[Math.floor(values.length * 0.5)].toFixed(2),
        p95Ms: +values[Math.floor(values.length * 0.95)].toFixed(2),
        maxMs: +values[values.length - 1].toFixed(2),
      });
    }
    active.current = flying;
  });
  return null;
}

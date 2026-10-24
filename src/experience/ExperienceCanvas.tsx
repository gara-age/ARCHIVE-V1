import { Canvas, useThree } from "@react-three/fiber";
import { Component, Suspense, useEffect, type ReactNode } from "react";
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import Workspace from "./Workspace";
import SceneWarmup from "./SceneWarmup";
import FrameDiagnostics from "./FrameDiagnostics";
import CinematicCamera from "./CinematicCamera";
class CanvasBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function ContextRecovery({ onFailure }: { onFailure: () => void }) {
  const canvas = useThree((s) => s.gl.domElement);
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [canvas, onFailure]);
  return null;
}
export default function ExperienceCanvas({
  focused,
  onFailure, onReady, reducedQuality = false,
}: {
  focused: boolean;
  onFailure: () => void;
  onReady: () => void;
  reducedQuality?: boolean;
}) {
  return (
    <div
      className={`experience ${focused ? "is-focused" : ""}`}
      aria-hidden="true"
    >
      <CanvasBoundary onFailure={onFailure}>
        <Canvas
          shadows
          dpr={reducedQuality ? 1 : [1, 1.5]}
          camera={{ fov: 45, near: 0.08, far: 40 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
            gl.outputColorSpace = SRGBColorSpace;
            gl.shadowMap.type = PCFSoftShadowMap;
          }}
        >
          <ContextRecovery onFailure={onFailure} />
          <Suspense fallback={null}>
            <Workspace />
            <CinematicCamera />
            <FrameDiagnostics />
            <SceneWarmup onReady={onReady} onFailure={onFailure} />
          </Suspense>
        </Canvas>
      </CanvasBoundary>
    </div>
  );
}

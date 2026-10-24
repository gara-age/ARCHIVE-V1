import { Canvas } from "@react-three/fiber";
import { Component, type ReactNode } from "react";
import Workspace from "./Workspace";
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
export default function ExperienceCanvas({
  focused,
  onFailure,
}: {
  focused: boolean;
  onFailure: () => void;
}) {
  return (
    <div
      className={`experience ${focused ? "is-focused" : ""}`}
      aria-hidden="true"
    >
      <CanvasBoundary onFailure={onFailure}>
        <Canvas
          shadows
          dpr={[1, 1.6]}
          camera={{ fov: 45, near: 0.08, far: 40 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", onFailure, {
              once: true,
            });
          }}
        >
          <Workspace />
          <CinematicCamera />
        </Canvas>
      </CanvasBoundary>
    </div>
  );
}

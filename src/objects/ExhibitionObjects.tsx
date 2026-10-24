import { useMemo } from "react";
import * as THREE from "three";
import { createTrophyBowl, trophyHandleCurve } from "./detailGeometry";
import { useStudioMaterials } from "./StudioMaterials";
import { DetailedAirplane, DetailedBakingObjects } from "./PersonalProps";
import { Box } from "./StudioObjects";
import { focusSurfaces, type FocusSurface } from "../data/cameraRoutes";
function ExhibitFrame({
  surface,
  label,
  number,
}: {
  surface: FocusSurface;
  label: string;
  number: string;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    const c = canvas.getContext("2d")!;
    c.fillStyle = surface.kind === "monitor" ? "#304039" : "#e8e2d2";
    c.fillRect(0, 0, 1024, 640);
    c.strokeStyle = surface.kind === "monitor" ? "#82977a" : "#b8b7a1";
    c.lineWidth = 2;
    c.strokeRect(48, 48, 928, 544);
    c.fillStyle = surface.kind === "monitor" ? "#d3dac9" : "#5d6854";
    c.font = "18px sans-serif";
    c.fillText("ARCHIVE V1 / MINSEO CHOI", 80, 100);
    c.font = "140px Georgia";
    c.fillText(number, 78, 315);
    c.font = "34px sans-serif";
    c.fillText(label.toUpperCase(), 80, 405);
    c.font = "16px sans-serif";
    c.fillText("A PERSONAL INTERACTIVE ARCHIVE", 80, 540);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [label, number, surface.kind]);
  const { width: w, height: h } = surface;
  return (
    <group position={surface.center} rotation={[0, surface.rotation, 0]}>
      <Box
        position={[0, 0, -0.07]}
        size={[w + 0.19, h + 0.19, 0.14]}
        color={surface.kind === "monitor" ? "#303531" : "#75654c"}
      />
      <mesh position={[0, 0, 0.003]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={texture} roughness={0.85} />
      </mesh>
      <Box
        position={[0, -h / 2 - 0.25, -0.01]}
        size={[0.65, 0.075, 0.03]}
        color="#c9b89a"
      />
    </group>
  );
}
function Trophy({ position }: { position: [number, number, number] }) {
  const { metalBump, stoneMap } = useStudioMaterials();
  const bowl = useMemo(createTrophyBowl, []);
  const handles = useMemo(() => [-1, 1].map((side) => new THREE.TubeGeometry(trophyHandleCurve(side), 40, 0.014, 10, false)), []);
  const gold = useMemo(() => new THREE.MeshStandardMaterial({ color: "#d6aa50", metalness: 0.94, roughness: 0.24, bumpMap: metalBump, bumpScale: 0.0012, envMapIntensity: 1.2 }), [metalBump]);
  return (
    <group position={position}>
      <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.34, 0.14, 0.3]} /><meshPhysicalMaterial map={stoneMap} color="#41443b" roughness={0.22} clearcoat={0.35} />
      </mesh>
      <mesh position={[0, 0.245, 0]} material={gold} castShadow><cylinderGeometry args={[0.034, 0.073, 0.21, 48]} /></mesh>
      <mesh geometry={bowl} material={gold} castShadow receiveShadow />
      {handles.map((geometry, index) => <mesh key={index} geometry={geometry} material={gold} castShadow />)}
    </group>
  );
}

export default function ExhibitionObjects() {
  return (
    <group>
      <ExhibitFrame
        surface={focusSurfaces.achievements}
        label="Achievements"
        number="02"
      />
      <Trophy position={[2.35, 1.46, -5.45]} />
      <Trophy position={[3.5, 1.46, -5.45]} />
      <ExhibitFrame
        surface={focusSurfaces.certifications}
        label="Certifications"
        number="03"
      />
      {[-1, 1].map((i) => (
        <group
          key={i}
          position={[5.7, 2.65, -3.15 + i * 1.8]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <Box
            position={[0, 0, -0.04]}
            size={[0.65, 0.95, 0.07]}
            color="#75654c"
          />
          <Box
            position={[0, 0, 0.005]}
            size={[0.53, 0.83, 0.01]}
            color="#e9e0ca"
          />
          <Box
            position={[0, 0.1, 0.012]}
            size={[0.31, 0.02, 0.01]}
            color="#9aa084"
          />
        </group>
      ))}
      <ExhibitFrame
        surface={focusSurfaces.skills}
        label="Experience / Campus"
        number="04–05"
      />
      <Box position={[5.3, 1.15, 0.35]} size={[1.1, 0.13, 2.9]} />
      {[-0.7, 0.7].map((z) => (
        <Box
          key={z}
          position={[5.35, 0.56, 0.35 + z]}
          size={[0.6, 1.1, 0.07]}
          color="#626b58"
        />
      ))}
      <Box
        position={[5.15, 0.52, 1.25]}
        size={[0.55, 0.95, 0.45]}
        color="#4b5549"
      />
      <Box
        position={[4.867, 0.7, 1.25]}
        size={[0.015, 0.035, 0.24]}
        color="#a3b18b"
      />
      <Box
        position={[4.867, 0.58, 1.25]}
        size={[0.015, 0.02, 0.24]}
        color="#8b987d"
      />
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          position={[5.27, 1.25 + i * 0.075, -0.65]}
          size={[0.72, 0.06, 0.4]}
          color={["#9b7f5f", "#d8d0b8", "#879573"][i]}
        />
      ))}
      <ExhibitFrame
        surface={focusSurfaces.about}
        label="People / My story"
        number="06–07"
      />
      <Box position={[1.9, 1.05, 5.28]} size={[2.8, 0.14, 0.75]} />
      {[-1.1, 1.1].map((x) => (
        <Box
          key={x}
          position={[1.9 + x, 0.5, 5.28]}
          size={[0.07, 1, 0.6]}
          color="#626b58"
        />
      ))}
      <ExhibitFrame
        surface={focusSurfaces.beyond}
        label="Beyond code / V1"
        number="08"
      />
      <Box position={[-2.1, 1.4, 5.25]} size={[3.8, 0.12, 0.9]} />
      {[-1.5, 1.5].map((x) => (
        <Box
          key={x}
          position={[-2.1 + x, 0.68, 5.25]}
          size={[0.08, 1.35, 0.65]}
          color="#626b58"
        />
      ))}
      <DetailedAirplane />
      <DetailedBakingObjects />
    </group>
  );
}

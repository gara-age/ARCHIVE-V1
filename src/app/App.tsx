import BrandLogo from "../components/BrandLogo";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
const ExperienceCanvas = lazy(() => import("../experience/ExperienceCanvas"));
import { sections } from "../data/sections";
import { Contact } from "../sections/ArchiveSections";
import FrameContent from "../focus/FrameContent";
import TourController from "../navigation/TourController";
import Navigation from "../components/Navigation";
import NarrationPlayer, { NarrationControls } from "../components/NarrationPlayer";
import SoundToggle, { MediaSoundController } from "../components/SoundToggle";
import FallbackResume from "../components/FallbackResume";
import { useNarrationStore } from "../media/useNarrationStore";
import { SceneRecovery, type SceneStatus } from "../experience/sceneRecovery";
import { useTourStore } from "../navigation/useTourStore";
export default function App() {
  const [scene, setScene] = useState<SceneStatus>({ phase: "loading", generation: 0, attempt: 0 });
  const [recovery] = useState(() => new SceneRecovery(setScene));
  const [fallback, setFallback] = useState(false);
  const failed = scene.phase === "failed";
  const showFallback = fallback || failed;
  useEffect(() => { recovery.start(); return () => recovery.dispose(); }, [recovery]);
  const s = useTourStore();
  const entered = useNarrationStore((state) => state.entered);
  const openingButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (entered) openingButton.current?.focus({ preventScroll: true });
  }, [entered]);
  const expanded = s.viewMode === "EXPANDED";
  const focused = s.viewMode === "FOCUSED" || expanded;
  return (
    <>
      <MediaSoundController />
      <NarrationPlayer suspended={showFallback} />
      {!failed && scene.phase !== "retrying" && (
        <Suspense fallback={null}>
          <ExperienceCanvas
            key={scene.generation}
            focused={focused}
            reducedQuality={scene.generation > 0}
            onReady={() => {
              if (recovery.ready(scene.generation)) useTourStore.getState().setReady();
            }}
            onFailure={() => {
              if (recovery.fail(scene.generation)) useTourStore.getState().reloadScene();
            }}
          />
        </Suspense>
      )}
      {showFallback ? (
        <FallbackResume
          onClose={!failed ? () => setFallback(false) : undefined}
        />
      ) : (
        <>
          {entered && s.ready && <TourController />}
          <div inert={!entered || !s.ready}>
          <header className="site-header" inert={expanded}>
            <a
              className="wordmark"
              aria-label="ARCHIVE V1 작업실"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                s.navigate(0);
              }}
            >
              <BrandLogo />
            </a>
            <span className="header-note">
              A PERSONAL
              <br />
              INTERACTIVE ARCHIVE
            </span>
            <div className="header-actions">
              {!focused && <NarrationControls />}
              {!focused && <SoundToggle />}
              <button
                onClick={() => setFallback(true)}
                className="index-button"
              >
                이력서 <span>↗</span>
              </button>
            </div>
          </header>
          <div
            data-content
            className={`opening ${s.sectionIndex === 0 && s.viewMode === "WORKSPACE" ? "visible" : ""}`}
            inert={s.sectionIndex !== 0 || s.viewMode !== "WORKSPACE"}
          >
            <div className="opening-story">
              <div className="opening-kicker">
                <span>MINSEO CHOI</span>
              </div>
              <h1>ARCHIVE V1</h1>
              <p className="opening-subtitle">A Personal Interactive Archive</p>
              <p className="opening-description">
                최민서의 작업과 배움을 담은 공간.
              </p>
              <button ref={openingButton} className="explore-button" onClick={() => s.navigate(1)}>
                작업실 둘러보기 <span>↗</span>
              </button>
            </div>
          </div>
          <div
            className={`scene-caption ${s.sectionIndex === 0 ? "visible" : ""}`}
          >
            <span>00 — THE STUDIO</span>
            <p>
              A collection of what I've built,
              <br />
              learned, and become.
            </p>
          </div>
          <div
            data-content
            className={`contact-scene ${sections[s.sectionIndex].id === "contact" && s.viewMode === "WORKSPACE" ? "visible" : ""}`}
            inert={sections[s.sectionIndex].id !== "contact" || s.viewMode !== "WORKSPACE"}
          >
            <Contact compact />
            <button className="explore-button" onClick={() => s.navigate(0)}>
              작업실 다시 보기 <span>↗</span>
            </button>
          </div>
          <FrameContent />
          <div inert={expanded}>
            <Navigation />
          </div>
          {s.viewMode === "FLYING" && (
            <div className="flight-indicator">
              IN TRANSIT <span>···</span>
            </div>
          )}
          </div>
          {(!entered || !s.ready) && (
            <div className="loading-screen" role="dialog" aria-modal="true" aria-label="작업실 입장" data-content>
              <span className="wordmark"><BrandLogo large /></span>
              {s.ready ? (
                <button className="explore-button studio-enter" autoFocus
                  onClick={() => useNarrationStore.getState().enterStudio()}>
                  작업실 들어가기 <span aria-hidden="true">↗</span>
                </button>
              ) : <p role="status">{scene.attempt > 0 ? "작업실을 다시 불러오는 중" : "작업실의 불을 켜는 중"}</p>}
            </div>
          )}
        </>
      )}
    </>
  );
}

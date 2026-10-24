import { lazy, Suspense, useEffect, useState } from "react";
const ExperienceCanvas = lazy(() => import("../experience/ExperienceCanvas"));
import { sections } from "../data/sections";
import { Contact } from "../sections/ArchiveSections";
import FrameContent from "../focus/FrameContent";
import TourController from "../navigation/TourController";
import Navigation from "../components/Navigation";
import SoundToggle from "../components/SoundToggle";
import FallbackResume from "../components/FallbackResume";
import { useTourStore } from "../navigation/useTourStore";
function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (gl) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
export default function App() {
  const [supported] = useState(supportsWebGL);
  const [failed, setFailed] = useState(false);
  const [fallback, setFallback] = useState(!supported);
  const s = useTourStore();
  const [extraLarge, setExtraLarge] = useState(() => {
    try {
      return localStorage.getItem("archive-reading-size") === "extra";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    document.documentElement.dataset.readingSize = extraLarge
      ? "extra"
      : "large";
    try {
      localStorage.setItem(
        "archive-reading-size",
        extraLarge ? "extra" : "large",
      );
    } catch {}
  }, [extraLarge]);
  const expanded = s.viewMode === "EXPANDED";
  const focused = s.viewMode === "FOCUSED" || expanded;
  return (
    <>
      {!failed && supported && (
        <Suspense fallback={null}>
          <ExperienceCanvas
            focused={focused}
            onFailure={() => {
              setFailed(true);
              setFallback(true);
            }}
          />
        </Suspense>
      )}
      {fallback ? (
        <FallbackResume
          onClose={supported && !failed ? () => setFallback(false) : undefined}
        />
      ) : (
        <>
          <TourController />
          <header className="site-header" inert={expanded}>
            <a
              className="wordmark"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                s.navigate(0);
              }}
            >
              ARCHIVE V1<span>®</span>
            </a>
            <span className="header-note">
              A PERSONAL
              <br />
              INTERACTIVE ARCHIVE
            </span>
            <div className="header-actions">
              <button
                className="reading-toggle"
                aria-pressed={extraLarge}
                aria-label={
                  extraLarge ? "기본 큰 글씨로 보기" : "글씨를 더 크게 보기"
                }
                onClick={() => setExtraLarge(!extraLarge)}
              >
                <span aria-hidden="true">가{extraLarge ? "−" : "+"}</span>
                <span className="reading-label">
                  {extraLarge ? "기본 큰 글씨" : "더 큰 글씨"}
                </span>
              </button>
              <SoundToggle />
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
              <button className="explore-button" onClick={() => s.navigate(1)}>
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
          {!s.ready && (
            <div className="loading-screen">
              <span className="wordmark">ARCHIVE V1</span>
              <p>작업실의 불을 켜는 중</p>
            </div>
          )}
        </>
      )}
    </>
  );
}

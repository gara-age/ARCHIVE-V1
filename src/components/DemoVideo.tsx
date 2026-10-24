import { useEffect, useRef, useState } from "react";
import type { Demo } from "../data/demos";
import { useTourStore } from "../navigation/useTourStore";
const playingVideos = new Set<HTMLVideoElement>();
export default function DemoVideo({ demo }: { demo: Demo }) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const node = video.current;
    const stop = () => {
      node?.pause();
    };
    let index = useTourStore.getState().sectionIndex;
    const unsubscribe = useTourStore.subscribe((state) => {
      if (state.sectionIndex !== index || state.viewMode === "FLYING") {
        stop();
        index = state.sectionIndex;
      }
    });
    return () => {
      unsubscribe();
      stop();
      if (node) playingVideos.delete(node);
    };
  }, [demo.id]);
  return (
    <figure className="demo-video">
      <video
        ref={video}
        key={demo.id}
        controls
        playsInline
        preload="none"
        poster={demo.poster}
        aria-label={`${demo.projectName} — ${demo.competition} 시연 영상`}
        onError={() => setFailed(true)}
        onPlay={(event) => {
          const current = event.currentTarget;
          for (const other of playingVideos)
            if (other !== current) other.pause();
          playingVideos.add(current);
        }}
      >
        <source src={demo.src} type="video/mp4" />
        {demo.captions && (
          <track
            kind="captions"
            src={demo.captions}
            srcLang="ko"
            label="한국어"
            default
          />
        )}
      </video>
      <figcaption>
        <strong>{demo.projectName} 시연 영상</strong>
        <span>{demo.competition}</span>
      </figcaption>
      <p className="video-description">{demo.summary}</p>
      {failed && (
        <p role="alert" className="media-error">
          영상을 불러오지 못했습니다.{" "}
          <a href={demo.src} target="_blank" rel="noreferrer">
            영상 파일 열기 ↗
          </a>
        </p>
      )}
    </figure>
  );
}

export function DemoDisclosure({ demo }: { demo: Demo }) {
  return (
    <details
      className="demo-details"
      onToggle={(event) => {
        if (!event.currentTarget.open)
          event.currentTarget
            .querySelectorAll("video")
            .forEach((video) => video.pause());
      }}
    >
      <summary>{demo.projectName} 시연 영상 보기</summary>
      <DemoVideo demo={demo} />
    </details>
  );
}

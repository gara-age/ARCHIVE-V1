import { assetUrl } from "../utils/assetUrl";
import { useEffect, useRef } from "react";
import { sections } from "../data/sections";
import { narrationFor } from "../data/narrations";
import { useTourStore } from "../navigation/useTourStore";
import { claimPlayback, NarrationPlayback } from "../media/playback";
import { useNarrationStore } from "../media/useNarrationStore";

// One audio element owns narration for the entire studio, including full-screen readers.
export default function NarrationPlayer({ suspended }: { suspended: boolean }) {
  const audio = useRef<HTMLAudioElement>(null);
  const controller = useRef<NarrationPlayback | null>(null);
  const entryTrack = useRef<string | null>(null);
  const entered = useNarrationStore((s) => s.entered);
  const index = useTourStore((s) => s.sectionIndex);
  const mode = useTourStore((s) => s.viewMode);
  const ready = useTourStore((s) => s.ready);
  const projectId = useNarrationStore((s) => s.projectId);
  const track = narrationFor(sections[index].id, projectId);
  const active = entered && ready && mode !== "FLYING" && !suspended;
  useEffect(() => {
    const node = audio.current!;
    const player = new NarrationPlayback(node, () => useNarrationStore.setState({ status: "paused" }));
    controller.current = player;
    const opening = narrationFor("opening");
    node.src = assetUrl(opening.src);
    node.load();
    useNarrationStore.setState({
      togglePlayback: () => player.toggle(),
      enterStudio: () => {
        if (!useTourStore.getState().ready || useNarrationStore.getState().entered) return;
        // Start inside the trusted button click, before a React effect loses user activation.
        entryTrack.current = opening.src;
        player.visit(assetUrl(opening.src));
        useNarrationStore.setState({ entered: true, title: opening.title, available: true });
      },
    });
    const arbitrate = (event: Event) => {
      if (event.target instanceof HTMLMediaElement) {
        claimPlayback(event.target, document.querySelectorAll<HTMLMediaElement>("audio,video"));
      }
    };
    document.addEventListener("play", arbitrate, true);
    return () => {
      document.removeEventListener("play", arbitrate, true);
      player.stop(); controller.current = null;
      useNarrationStore.setState({ available: false, togglePlayback: () => {}, enterStudio: () => {} });
    };
  }, []);
  useEffect(() => {
    useNarrationStore.setState({ title: track?.title || "", available: !!track && active, status: "paused" });
    if (track && active) {
      if (entryTrack.current === track.src) entryTrack.current = null;
      else controller.current?.visit(assetUrl(track.src));
    } else controller.current?.stop();
    // Fullscreen changes do not change active; returning to a section/tab creates a new visit.
  }, [track, active]);
  return <audio
    ref={audio}
    data-narration
    preload="metadata"
    aria-label={`${track?.title || "영역"} 소개 음성`}
    onPlay={() => useNarrationStore.setState({ status: "playing" })}
    onPause={() => useNarrationStore.setState({ status: "paused" })}
    onEnded={() => useNarrationStore.setState({ status: "ended" })}
    onError={() => useNarrationStore.setState({ status: "paused" })}
  />;
}
export function NarrationControls() {
  const { title, status, available, togglePlayback } = useNarrationStore();
  const playing = status === "playing";
  const label = playing ? "음성 일시정지" : status === "ended" ? "다시 듣기" : "소개 듣기";
  return <button className="narration-control" type="button" disabled={!available}
    aria-label={`${title} ${label}`} aria-pressed={playing} onClick={togglePlayback}>
    <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span><span>{label}</span>
  </button>;
}

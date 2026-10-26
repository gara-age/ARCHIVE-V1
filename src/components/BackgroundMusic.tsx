import { useEffect, useRef } from "react";
import { useNarrationStore } from "../media/useNarrationStore";
import { useSoundStore } from "../media/useSoundStore";
import { assetUrl } from "../utils/assetUrl";

// This persistent player is independent of section narration and video playback.
// The file itself is attenuated by 18 dB, including on mobile browsers that ignore volume.
export default function BackgroundMusic() {
  const audio = useRef<HTMLAudioElement>(null);
  const enabled = useSoundStore((state) => state.enabled);
  useEffect(() => {
    const node = audio.current!;
    let blocked = false;
    let disposed = false;
    const start = () => {
      if (!useNarrationStore.getState().entered || disposed) return;
      void node.play().then(() => { if (!disposed) blocked = false; })
        .catch(() => { if (!disposed) blocked = true; });
    };
    const retry = () => { if (blocked && node.paused) start(); };
    useSoundStore.setState({ startMusic: start });
    document.addEventListener("pointerdown", retry);
    document.addEventListener("keydown", retry);
    return () => {
      disposed = true;
      node.pause();
      useSoundStore.setState({ startMusic: () => {} });
      document.removeEventListener("pointerdown", retry);
      document.removeEventListener("keydown", retry);
    };
  }, []);
  return <audio ref={audio} data-background-music aria-hidden="true"
    src={assetUrl("/media/music/clair-de-lune-soft-v2.m4a")} preload="none"
    loop playsInline muted={!enabled} />;
}

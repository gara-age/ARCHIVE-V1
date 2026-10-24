import { useEffect, useRef, useState } from "react";
import { useTourStore } from "../navigation/useTourStore";
export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const play = () => {
      const ctx = audio.current;
      if (!ctx || ctx.state !== "running") return;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(420, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        660,
        ctx.currentTime + 0.15,
      );
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.25);
    };
    let last = useTourStore.getState().viewMode;
    return useTourStore.subscribe((s) => {
      if (s.viewMode !== last) {
        play();
        last = s.viewMode;
      }
    });
  }, [enabled]);
  useEffect(
    () => () => {
      void audio.current?.close();
    },
    [],
  );
  return (
    <button
      className="sound-button"
      aria-pressed={enabled}
      onClick={() => {
        if (!audio.current) audio.current = new AudioContext();
        void audio.current.resume();
        setEnabled(!enabled);
      }}
      aria-label={enabled ? "효과음 끄기" : "효과음 켜기"}
    >
      <span className={`sound-bars ${enabled ? "on" : ""}`}>
        <i />
        <i />
        <i />
        <i />
      </span>
      SOUND {enabled ? "ON" : "OFF"}
    </button>
  );
}

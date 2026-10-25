import { useEffect, useRef } from "react";
import { useTourStore } from "../navigation/useTourStore";
import { useSoundStore } from "../media/useSoundStore";
import { applyMediaSound } from "../media/sound";

// Also covers media mounted after muting, the fullscreen reader and the HTML resume.
export function MediaSoundController() {
  const enabled = useSoundStore((s) => s.enabled);
  const audio = useRef<AudioContext | null>(null);
  useEffect(() => {
    const apply = () => applyMediaSound(document.querySelectorAll<HTMLMediaElement>("audio,video"), enabled);
    const enforce = (event: Event) => {
      const target = event.target;
      if (!enabled && target instanceof HTMLMediaElement && !target.muted) target.muted = true;
    };
    apply();
    const observer = new MutationObserver(() => { if (!enabled) apply(); });
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("volumechange", enforce, true);
    return () => { observer.disconnect(); document.removeEventListener("volumechange", enforce, true); };
  }, [enabled]);
  const unlock = () => {
    if (!useSoundStore.getState().enabled) return;
    if (!audio.current) audio.current = new AudioContext();
    void audio.current.resume().catch(() => {});
  };
  useEffect(() => {
    if (!enabled) { void audio.current?.suspend().catch(() => {}); return; }
    if (audio.current) void audio.current.resume().catch(() => {});
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    const play = () => {
      const ctx = audio.current;
      if (!useSoundStore.getState().enabled || !ctx || ctx.state !== "running") return;
      const oscillator = ctx.createOscillator(), gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(420, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      oscillator.connect(gain); gain.connect(ctx.destination);
      oscillator.start(); oscillator.stop(ctx.currentTime + 0.25);
    };
    let last = useTourStore.getState().viewMode;
    const unsubscribe = useTourStore.subscribe((s) => {
      if (s.viewMode !== last) { play(); last = s.viewMode; }
    });
    return () => {
      unsubscribe(); document.removeEventListener("pointerdown", unlock); document.removeEventListener("keydown", unlock);
    };
  }, [enabled]);
  useEffect(() => {
    useSoundStore.setState({ resumeEffects: unlock });
    return () => { void audio.current?.close().catch(() => {}); useSoundStore.setState({ resumeEffects: () => {} }); };
  }, []);
  return null;
}
export default function SoundToggle({ compact = false }: { compact?: boolean }) {
  const enabled = useSoundStore((s) => s.enabled);
  const toggle = useSoundStore((s) => s.toggle);
  return <button className={`sound-button${compact ? " sound-button-compact" : ""}`} aria-pressed={enabled}
    aria-label={enabled ? "전체 소리 끄기" : "전체 소리 켜기"}
    title={enabled ? "전체 소리 끄기" : "전체 소리 켜기"}
    onClick={() => { toggle(); if (useSoundStore.getState().enabled) useSoundStore.getState().resumeEffects(); }}>
    <span className={`sound-bars ${enabled ? "on" : ""}`} aria-hidden="true"><i /><i /><i /><i /></span>
    <span className="sound-label">SOUND {enabled ? "ON" : "OFF"}</span>
  </button>;
}

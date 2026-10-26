export type PlaybackMedia = {
  tagName: string;
  pause: () => void;
  currentTime: number;
  dataset?: { backgroundMusic?: string };
};
// Video keeps its position; narration stops and returns to the beginning.
export function claimPlayback(current: PlaybackMedia, peers: Iterable<PlaybackMedia>) {
  // Ambient music neither interrupts nor gets interrupted by foreground media.
  if (current.dataset?.backgroundMusic !== undefined) return;
  for (const peer of peers) {
    if (peer === current || peer.dataset?.backgroundMusic !== undefined) continue;
    peer.pause();
    if (peer.tagName.toLowerCase() === "audio") peer.currentTime = 0;
  }
}
export type NarrationMedia = PlaybackMedia & {
  src: string;
  paused: boolean;
  ended: boolean;
  load: () => void;
  play: () => Promise<void>;
};
export class NarrationPlayback {
  private revision = 0;
  private available = false;
  private media: NarrationMedia;
  private onBlocked: () => void;
  constructor(media: NarrationMedia, onBlocked: () => void) {
    this.media = media; this.onBlocked = onBlocked;
  }
  stop() {
    this.revision++;
    this.available = false;
    this.media.pause();
    this.media.currentTime = 0;
  }
  visit(src: string) {
    this.stop();
    this.available = true;
    this.media.src = src;
    this.media.load();
    void this.play();
  }
  async play() {
    if (!this.available) return;
    const revision = this.revision;
    try { await this.media.play(); }
    catch { if (revision === this.revision && this.available) this.onBlocked(); }
  }
  toggle() {
    if (!this.available) return;
    if (!this.media.paused) this.media.pause();
    else {
      if (this.media.ended) this.media.currentTime = 0;
      void this.play();
    }
  }
}

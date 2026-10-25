export function applyMediaSound(media: Iterable<{ muted: boolean }>, enabled: boolean) {
  for (const item of media) item.muted = !enabled;
}

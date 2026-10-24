// Each wheel burst consumes at most one step, including its momentum tail.
export function createWheelGate() {
  let lastWheel = -Infinity,
    eligible = false,
    consumed = false,
    accumulated = 0;
  return ({ mode, now, lockedUntil, delta, inside }) => {
    if (now - lastWheel > 180) {
      accumulated = 0;
      consumed = false;
      eligible =
        mode !== "FLYING" &&
        mode !== "EXPANDED" &&
        !inside &&
        now >= lockedUntil;
    }
    lastWheel = now;
    if (mode === "FLYING" || mode === "EXPANDED" || inside || now < lockedUntil)
      eligible = false;
    if (!eligible || consumed) return 0;
    accumulated += delta;
    if (Math.abs(accumulated) < 28) return 0;
    consumed = true;
    return accumulated > 0 ? 1 : -1;
  };
}

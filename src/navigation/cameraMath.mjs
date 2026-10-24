import { CatmullRomCurve3, Vector3 } from "three";
// Fit inside both the viewport and the closed room. The camera never backs out through a wall.
export function fitSurface(surface, aspect) {
  const { width, height, center, rotation } = surface;
  const fov = Math.min(
    100,
    Math.max(
      45,
      (2 *
        Math.atan(Math.max((width * 1.16) / aspect, height * 1.45) / 16) *
        180) /
        Math.PI,
    ),
  );
  const tangent = Math.tan((fov * Math.PI) / 360);
  const distance = Math.min(
    8,
    Math.max(
      3.4,
      (width * 1.16) / (2 * tangent * aspect),
      (height * 1.45) / (2 * tangent),
    ),
  );
  return {
    fov,
    position: [
      center[0] + Math.sin(rotation) * distance,
      center[1],
      center[2] + Math.cos(rotation) * distance,
    ],
    target: center,
  };
}
export function interiorPath(start, end, waypoint) {
  // Centrally routed transitions keep the eye above furniture and away from the perimeter.
  return new CatmullRomCurve3(
    [new Vector3(...start), new Vector3(...waypoint), new Vector3(...end)],
    false,
    "centripetal",
  );
}

// Minimum-jerk easing has zero velocity and acceleration at both ends.
export function flightEase(t) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

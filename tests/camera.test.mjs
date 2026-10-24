import test from "node:test";
import assert from "node:assert/strict";
import { Vector3, PerspectiveCamera } from "three";
import { fitSurface, interiorPath } from "../src/navigation/cameraMath.mjs";
import { focusSurfaces, cameraRoutes } from "../src/data/cameraRoutes.ts";
import { sections } from "../src/data/sections.ts";

test("all ten sections map to a real surface or an interior wide shot", () => {
  assert.equal(sections.length, 10);
  assert.equal(new Set(sections.map((s) => s.id)).size, 10);
  for (const section of sections)
    assert.equal(!!section.objectId, !!focusSurfaces[section.id]);
});
test("all focus surfaces fit portrait and landscape viewports while cameras stay indoors", () => {
  for (const aspect of [0.4, 0.46, 0.7, 1, 1.5, 2.4])
    for (const [name, surface] of Object.entries(focusSurfaces)) {
      const fit = fitSurface(surface, aspect);
      const camera = new PerspectiveCamera(fit.fov, aspect, 0.08, 40);
      camera.position.set(...fit.position);
      camera.lookAt(new Vector3(...fit.target));
      camera.updateMatrixWorld();
      assert.ok(
        Math.abs(camera.position.x) < 5.85 &&
          Math.abs(camera.position.z) < 5.85,
        `${name} camera indoors at ${aspect}`,
      );
      const corners = [
        [-1, 1],
        [1, -1],
      ].map(([x, y]) =>
        new Vector3(
          surface.center[0] +
            (Math.cos(surface.rotation) * x * surface.width) / 2,
          surface.center[1] + (y * surface.height) / 2,
          surface.center[2] -
            (Math.sin(surface.rotation) * x * surface.width) / 2,
        ).project(camera),
      );
      assert.ok(corners[0].x < corners[1].x, `${name}: no mirrored frame`);
      for (const corner of corners) {
        assert.ok(Math.abs(corner.x) < 0.9, `${name} fits width at ${aspect}`);
        assert.ok(
          Math.abs(corner.y) < 0.75,
          `${name} fits height at ${aspect}`,
        );
      }
    }
});
test("every forward, reverse and index-jump path stays inside the connected room", () => {
  for (const aspect of [0.46, 1.5, 2.4]) {
    const points = [
      cameraRoutes.opening.position,
      ...Object.values(focusSurfaces).map(
        (s) => fitSurface(s, aspect).position,
      ),
      cameraRoutes.contact.position,
    ];
    for (const start of points)
      for (const end of points) {
        const path = interiorPath(start, end, cameraRoutes.waypoint);
        for (let step = 0; step <= 120; step++) {
          const p = path.getPoint(step / 120);
          assert.ok(
            Math.abs(p.x) < 5.85 &&
              Math.abs(p.z) < 5.85 &&
              p.y > 0.2 &&
              p.y < 4.3,
            `indoor path: ${p.toArray()}`,
          );
          // Main monitor is the largest high obstacle in the central studio.
          assert.ok(
            !(
              p.x > -2.48 &&
              p.x < 1.2 &&
              p.y > 1 &&
              p.y < 3.2 &&
              p.z > -3.98 &&
              p.z < -3.55
            ),
            "camera avoids main monitor",
          );
        }
      }
  }
});

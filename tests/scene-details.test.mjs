import test from "node:test";
import assert from "node:assert/strict";
import { Box3, Matrix4, Euler, Quaternion, Vector3 } from "three";
import { createLeafGeometry, leafPose, createTrophyBowl, trophyHandleCurve } from "../src/objects/detailGeometry.ts";
import { plantPlacements, ceilingUnderside } from "../src/data/studioLayout.ts";
import { flightEase } from "../src/navigation/cameraMath.mjs";

test("all plant leaves fit below the ceiling with clearance at actual placement scales", () => {
  const leaf = createLeafGeometry(); leaf.computeBoundingBox();
  const bounds = new Box3(new Vector3(-0.31, 0, -0.31), new Vector3(0.31, 0.65, 0.31));
  for (let i = 0; i < 15; i++) {
    const pose = leafPose(i);
    const box = leaf.boundingBox.clone().translate(new Vector3(0, 0.39, 0));
    box.applyMatrix4(new Matrix4().compose(new Vector3(0, 0.58, 0), new Quaternion().setFromEuler(new Euler(...pose.rotation)), new Vector3().setScalar(pose.scale)));
    bounds.union(box);
  }
  for (const [name, placement] of Object.entries(plantPlacements)) {
    const top = placement.position[1] + bounds.max.y * placement.scale;
    assert.ok(top < ceilingUnderside - 0.1, `${name} plant has clearance: ${top}`);
  }
  leaf.dispose();
});
test("trophy handles connect at both cup attachment points and mirror each other", () => {
  const bowl = createTrophyBowl(); bowl.computeBoundingBox();
  const left = trophyHandleCurve(-1), right = trophyHandleCurve(1);
  assert.deepEqual(right.getPoint(0).toArray(), [0.2, 0.64, 0]);
  assert.deepEqual(right.getPoint(1).toArray(), [0.08, 0.4, 0]);
  for (let i = 0; i <= 40; i++) {
    const a = left.getPoint(i / 40), b = right.getPoint(i / 40);
    assert.ok(Math.abs(a.x + b.x) < 1e-8);
    assert.equal(a.y, b.y);
    assert.ok(b.y < bowl.boundingBox.max.y && b.y > bowl.boundingBox.min.y);
  }
  bowl.dispose();
});
test("camera easing is monotonic and settles gently at both ends", () => {
  assert.equal(flightEase(-1), 0); assert.equal(flightEase(2), 1);
  let previous = 0;
  for (let i = 0; i <= 1000; i++) {
    const value = flightEase(i / 1000);
    assert.ok(value >= previous - 1e-10 && value <= 1);
    previous = value;
  }
  assert.ok(flightEase(0.001) < 1e-7);
  assert.ok(1 - flightEase(0.999) < 1e-7);
});

test("monitor stand stays behind the casing and the lower bezel clears the desk", async () => {
  const { monitor, monitorHardware: hardware } = await import("../src/data/cameraRoutes.ts");
  const shellBack = hardware.shell.position[2] - hardware.shell.size[2] / 2;
  const screenBottom = monitor.center[1] - monitor.height / 2;
  const chinTop = hardware.lowerBezel.position[1] + hardware.lowerBezel.size[1] / 2;
  const chinBottom = hardware.lowerBezel.position[1] - hardware.lowerBezel.size[1] / 2;
  assert.ok(hardware.neck.position[2] + hardware.neck.size[2] / 2 < shellBack);
  assert.ok(hardware.mount.position[2] + hardware.mount.size[2] / 2 < monitor.center[2]);
  assert.ok(Math.abs(chinTop - screenBottom) < 0.001);
  assert.ok(chinBottom > hardware.desktopTop + 0.15);
  assert.ok(Math.abs(hardware.base.position[1] - hardware.base.size[1] / 2 - hardware.desktopTop) < 0.001);
});

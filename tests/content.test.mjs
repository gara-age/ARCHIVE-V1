import test from "node:test";
import assert from "node:assert/strict";
import { certifications } from "../src/data/certifications.ts";
import { photos } from "../src/data/photos.ts";
import { demos } from "../src/data/demos.ts";
import { projects } from "../src/data/projects.ts";
import { achievements } from "../src/data/achievements.ts";
import { contacts } from "../src/data/profile.ts";

test("the resume first-stage Linux pass never becomes a completed certification", () => {
  const linux = certifications.find((c) => c.name === "리눅스마스터 2급");
  assert.ok(linux);
  assert.equal(linux.status, "1차 합격");
});
test("award projects, demos and supplied photos have consistent source mapping", () => {
  for (const award of achievements) {
    const demo = demos.find((d) => d.id === award.demoId);
    assert.ok(demo);
    assert.equal(award.projectId, demo.projectId);
    assert.equal(award.project, demo.projectName);
    assert.equal(award.competition, demo.competition);
    assert.ok(projects.some((p) => p.id === award.projectId));
    const photo = photos.find((p) => p.id === award.photoId);
    assert.ok(photo);
    assert.equal(photo.projectId, award.projectId);
    assert.equal(award.image, photo.src);
    assert.equal(
      photo.kind,
      award.projectId === "navi" ? "certificate" : "award",
    );
  }
  for (const credential of certifications) assert.equal(credential.image, null);
});
test("provided GitHub and contact actions have correct destinations", () => {
  assert.equal(contacts.find((c) => c.label === "GITHUB")?.href, "https://github.com/gara-age/");
  for (const c of contacts.filter((c) => c.href)) {
    assert.ok(c.value);
    assert.ok(c.href.startsWith(c.label === "EMAIL" ? "mailto:" : c.label === "GITHUB" ? "https://github.com/" : "tel:"));
  }
});

test("academic demo maps to Navi and venture demo maps to Bokji Naru", () => {
  assert.equal(demos.find((d) => d.id === "navi-academic")?.projectId, "navi");
  assert.equal(demos.find((d) => d.id === "bokji-venture")?.projectId, "bokji");
});

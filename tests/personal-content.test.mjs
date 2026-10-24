import test from "node:test";
import assert from "node:assert/strict";
import { academicExcellence, publicAcademicEvidence } from "../src/data/academics.ts";
import { publicTestimonials, testimonials } from "../src/data/testimonials.ts";
import { campusActivities } from "../src/data/campusActivities.ts";

test("semester results retain their specific academic year and term", () => {
  assert.deepEqual(
    [academicExcellence.academicYear, academicExcellence.year, academicExcellence.semester],
    [2026, 2, 1],
  );
  assert.equal(academicExcellence.gpa, 4.5);
  assert.equal(academicExcellence.scale, 4.5);
  assert.equal(academicExcellence.departmentRank, 1);
  assert.equal(academicExcellence.majorRank, 1);
});
test("academic images are withheld unless masked and explicitly public", () => {
  const photo = { id: "test-only" };
  assert.equal(publicAcademicEvidence(academicExcellence), null);
  for (const [masked, approvedForPublic] of [[false, false], [true, false], [false, true], [true, true]]) {
    const record = { ...academicExcellence, evidence: { photo, masked, approvedForPublic } };
    assert.equal(publicAcademicEvidence(record), masked && approvedForPublic ? photo : null);
  }
});
test("only consented real quotes are shown and names respect separate consent", () => {
  assert.equal(testimonials.length, 0);
  const record = { id: "fixture", quote: "A test-only quote", name: "Test Name", consent: { publishQuote: false, publishName: true } };
  assert.deepEqual(publicTestimonials([record]), []);
  assert.equal(publicTestimonials([{ ...record, consent: { publishQuote: true, publishName: false } }])[0].name, "익명");
  assert.equal(publicTestimonials([{ ...record, consent: { publishQuote: true, publishName: true } }])[0].name, "Test Name");
  assert.deepEqual(publicTestimonials([{ ...record, quote: " ", consent: { publishQuote: true, publishName: true } }]), []);
  assert.equal(record.name, "Test Name");
});
test("unknown activity dates and supporting materials stay unfilled", () => {
  for (const activity of campusActivities) {
    assert.equal(activity.period, null);
    assert.equal(activity.learning, null);
    assert.deepEqual(activity.photos, []);
  }

});

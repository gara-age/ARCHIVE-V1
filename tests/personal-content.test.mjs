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
  assert.equal(testimonials.length, 4);
  assert.deepEqual(publicTestimonials(testimonials).map((record) => record.name), ["윤현님", "박재홍", "송준범", "임채원"]);
  for (const testimonial of testimonials) {
    assert.ok(testimonial.quote.length > 90);
    assert.equal(testimonial.date, null);
    assert.equal(testimonial.relatedExperience, "");
  }
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
test('confirmed interests replace all five example cards and preserve the supplied goals and attitudes', async () => {
 const {interests}=await import('../src/data/interests.ts');
 const {beyondStory}=await import('../src/data/stories.ts');
 assert.ok(interests.every(i=>!i.isExample));
 const text=JSON.stringify({interests,beyondStory});
 for(const value of ['분위기 좋은 카페','완성도 높은 디자인','패션','과학','시,','AI 활용','스타일링','일본','제과·제빵','V1 Speed (Decision Speed)','스스로에게 당당한 사람','소중한 사람','책임감과 완수','몰입과 배움','협력과 배려','도전과 실행','진정성과 신뢰']) assert.ok(text.includes(value),value);
 assert.ok(!text.includes('개발자라는 진로'));
 assert.equal(interests.find(i=>i.id==='attitudes').items.length,5);
});
test('corrected qualifications, school names and work records retain the user-confirmed scope', async () => {
 const {certifications,academicRecords}=await import('../src/data/certifications.ts');
 const {experiences}=await import('../src/data/experiences.ts');
 const {personalTraits}=await import('../src/data/personalTraits.ts');
 const {projectStories}=await import('../src/data/projectStories.ts');
 assert.equal(certifications.find(c=>c.name.includes('SQLD')).issuer,'한국데이터산업진흥원');
 assert.equal(certifications.find(c=>c.name.includes('JLPT')).name,'JLPT N3급');
 assert.equal(academicRecords[0].institution,'한국폴리텍대학 인천캠퍼스');
 assert.equal(academicRecords[0].title,'AI융합소프트웨어과');
 assert.ok(experiences.every(e=>!e.organization.includes('트랜스코스모스')&&!e.role.includes('인턴')));
 assert.ok(!JSON.stringify([personalTraits,projectStories]).includes('우수상'));
});

import type { TraitId, RelatedRecordId } from "./personalTraits";
export type Testimonial = {
  id: string;
  quote: string;
  name: string | null;
  relationship: string;
  relatedExperience: string;
  date: string | null;
  consent: { publishQuote: boolean; publishName: boolean };
  traits: TraitId[];
  related: RelatedRecordId[];
};
// Quotations and attribution supplied by the user for inclusion in the portfolio.
export const testimonials: Testimonial[] = [
  {
    id: "advisor-yoon", name: "윤현님", relationship: "지도교수",
    quote: "맡은 일에 책임감이 강하고 정직하며, 이해력이 빠르고 상황을 파악하는 센스가 좋은 학생입니다. 믿고 일을 맡길 수 있을 만큼 든든하고, 사람들과도 원만한 관계를 유지합니다. 상대방을 편안하게 해주면서도 예의를 잃지 않는 태도가 인상적입니다.",
    relatedExperience: "", date: null,
    consent: { publishQuote: true, publishName: true },
    traits: ["connect", "focus", "deliver"], related: ["campus", "academics"],
  },
  {
    id: "representative-park", name: "박재홍", relationship: "과대표",
    quote: "과대표로서 학과 일을 챙기다 보면 혼자 감당하기 어려운 순간도 있는데, 민서는 부탁하지 않아도 먼저 나서서 도와주곤 했습니다. 자기 일이 아니어도 함께 고민하고 책임감 있게 도와주는 모습이 참 고마웠고, 덕분에 과대표 일을 하는 데 큰 힘이 됐습니다.",
    relatedExperience: "", date: null,
    consent: { publishQuote: true, publishName: true },
    traits: ["connect", "deliver"], related: ["campus"],
  },
  {
    id: "classmate-song", name: "송준범", relationship: "학과 동급생",
    quote: "민서 형은 작은 부분까지 세심하게 살피고, 계획을 세워 체계적으로 행동하는 사람입니다. 현재에 안주하기보다 새로운 가능성을 찾고 적극적으로 도전하는 진취적인 모습을 본받아야겠다고 생각했습니다.",
    relatedExperience: "", date: null,
    consent: { publishQuote: true, publishName: true },
    traits: ["focus", "deliver"], related: ["campus"],
  },
  {
    id: "classmate-lim", name: "임채원", relationship: "학과 동급생",
    quote: "민서 형은 자신의 일뿐만 아니라 다른 사람의 일도 마치 자기 일처럼 생각하고 도와주는 사람입니다. 함께 프로젝트를 진행하면서 어려운 일이 생길 때마다 같이 고민하고 해결하려는 모습을 많이 봤습니다. 혼자 앞서가기보다 주변 사람들과 함께 나아가려는 형의 모습이 기억에 남습니다.",
    relatedExperience: "", date: null,
    consent: { publishQuote: true, publishName: true },
    traits: ["connect", "deliver"], related: ["works"],
  },
];
export function publicTestimonials(records: Testimonial[]) {
  return records.filter((record) => record.consent.publishQuote && record.quote.trim()).map((record) => ({
    ...record,
    name: record.consent.publishName && record.name ? record.name : "익명",
  }));
}

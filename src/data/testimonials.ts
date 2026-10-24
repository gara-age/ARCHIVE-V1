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
// Add real collected quotations only. An empty collection is intentional.
export const testimonials: Testimonial[] = [];
export function publicTestimonials(records: Testimonial[]) {
  return records.filter((record) => record.consent.publishQuote && record.quote.trim()).map((record) => ({
    ...record,
    name: record.consent.publishName && record.name ? record.name : "익명",
  }));
}

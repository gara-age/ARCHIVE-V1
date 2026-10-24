import type { ArchivePhoto } from "./photos";
export type AcademicRecord = {
  institution: string;
  department: string;
  academicYear: number;
  year: number;
  semester: number;
  gpa: number;
  scale: number;
  departmentRank: number;
  majorRank: number;
  evidence: { photo: ArchivePhoto; masked: boolean; approvedForPublic: boolean } | null;
};
// User supplied semester results; never represent these as cumulative GPA.
export const academicExcellence: AcademicRecord = {
  institution: "한국폴리텍대학 인천캠퍼스",
  department: "AI융합소프트웨어과",
  academicYear: 2026,
  year: 2,
  semester: 1,
  gpa: 4.5,
  scale: 4.5,
  departmentRank: 1,
  majorRank: 1,
  evidence: null,
};
export function publicAcademicEvidence(record: AcademicRecord) {
  return record.evidence?.masked && record.evidence.approvedForPublic
    ? record.evidence.photo
    : null;
}

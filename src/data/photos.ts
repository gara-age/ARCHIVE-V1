export type ArchivePhoto = {
  id: string;
  projectId: string;
  src: string;
  full: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  sourceFile: string;
  kind: "activity" | "award" | "certificate";
};
// A curated selection from the user-provided 수상 및 작품활동.zip. Original compositions are preserved.
export const photos: ArchivePhoto[] = [
  {
    id: "bokji-presentation",
    projectId: "bokji",
    src: "/media/photos/bokji-presentation.webp",
    full: "/media/photos/bokji-presentation-full.webp",
    width: 1290,
    height: 718,
    alt: "복지나루의 안내 기능을 화면으로 소개하는 벤처창업경진대회 발표 장면",
    caption: "복지나루 · 벤처창업경진대회 발표 현장",
    sourceFile: "복지나루_발표장면.jpg",
    kind: "activity",
  },
  {
    id: "navi-presentation",
    projectId: "navi",
    src: "/media/photos/navi-presentation.webp",
    full: "/media/photos/navi-presentation-full.webp",
    width: 1440,
    height: 810,
    alt: "Navi 포스터 앞에서 작품 내용을 설명하는 학술발표대회 현장",
    caption: "Navi · 학술발표대회 포스터 발표",
    sourceFile: "Navi_주저자_발표사진.JPG",
    kind: "activity",
  },
  {
    id: "navi-certificate",
    projectId: "navi",
    src: "/media/photos/navi-certificate.webp",
    full: "/media/photos/navi-certificate-full.webp",
    width: 1018,
    height: 1440,
    alt: "2026 전반기 학술발표대회 Navi 관련 상장 원문, 수상 등급 우수논문상",
    caption: "Navi · 학술발표대회 상장 원문",
    sourceFile: "Navi_한국산업기술융합학회_우수논문상.JPG",
    kind: "certificate",
  },
  {
    id: "bokji-award",
    projectId: "bokji",
    src: "/media/photos/bokji-award.webp",
    full: "/media/photos/bokji-award-full.webp",
    width: 1080,
    height: 1440,
    alt: "제10회 벤처창업경진대회에서 동상 수상 표식을 들고 촬영한 현장 사진",
    caption: "복지나루 · 벤처창업경진대회 동상 수상 현장",
    sourceFile: "복지나루_현장수상사진.JPG",
    kind: "award",
  },
];

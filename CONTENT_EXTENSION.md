# 콘텐츠 확장 및 개인 정체성 통합

2026-10-24 · 사용자 제공 Content Expansion & Personal Identity Update v1.0 반영.

## 구현

- 정보 구조는 00 Opening부터 09 Contact까지 10개 구간입니다. 방의 크기나 구조는 바꾸지 않았습니다.
- 학과 활동은 기존 보조 모니터, 업무 스타일·주변 평가는 자기소개 프레임을 공유합니다. 공유 전시물 사이에서는 불필요한 왕복 비행 없이 콘텐츠를 전환합니다.
- Achievements에 Academic Excellence를 추가했습니다. **2026학년도 2학년 1학기** 평점 4.5/4.5, 학과·전공 석차 각 1위를 표시합니다. 누적 평점이 아닙니다.
- 학과 홍보 근로장학생, 교수 업무 보조, 학생 인솔·행사 지원을 독립 활동으로 구성했습니다. 미제공 기간·업무 성과·배운 점은 비워 두었습니다.
- CONNECT / FOCUS / DELIVER는 펼칠 수 있는 카드입니다. 업무 방식, 연결 경험, 관련 기록을 표시하며 후속 사용자 원고로 동급생 학습 지원·팀장 역할·Spring 학습 및 단독 개발 완수 등 구체적인 사례를 추가했습니다.
- 후속 사용자 요청으로 접이식 관련 기록 영역을 전체 제거했습니다. 작품·학업·활동·진로 본문은 각각의 구간에서 볼 수 있습니다.
- Voices About Me는 실제 평가가 없는 상태를 표시합니다. 인용문 공개 동의가 있어야 노출되며 이름 공개는 별도 동의를 따릅니다. 동의가 없으면 익명으로 표시합니다.
- Beyond Code는 실제 제과·제빵 경력과 V1의 개인적 의미를 연결합니다. 추가 취향은 최초 확장 시 비워 두었으며, 후속 사용자 요청으로 예시 표시가 있는 더미 콘텐츠를 추가했습니다.
- 이전 요청의 깔끔한 초기 화면, 큰 글씨, 사진 확대, 수상·발표 분할 사진, 시연 영상, GitHub를 유지합니다. 스마트 제조 Navi는 앞선 삭제 요청을 유지합니다.

## 변경 파일

신규 데이터: `src/data/academics.ts`, `campusActivities.ts`, `personalTraits.ts`, `testimonials.ts`, `hobbies.ts`, `interests.ts`.

신규 화면: `src/sections/PersonalSections.tsx`.

통합: `src/sections/ArchiveSections.tsx`, `src/data/sections.ts`, `src/data/cameraRoutes.ts`, `src/app/App.tsx`, `src/components/Navigation.tsx`, `src/experience/CinematicCamera.tsx`, `src/objects/ExhibitionObjects.tsx`, `src/focus/FrameContent.tsx`, `src/data/stories.ts`, `src/style.css`.

검증: `tests/camera.test.mjs`, `tests/personal-content.test.mjs`.

## 추가 자료를 넣는 방법

- 성적 이미지: 개인정보를 마스킹한 파일을 웹용으로 준비하고 `academics.ts`의 `evidence`에 연결합니다. `masked`와 `approvedForPublic`이 모두 `true`여야 렌더링됩니다. 원본 성적표는 현재 포함하지 않았습니다.
- 학과 활동: `campusActivities.ts`에 실제 기간, 구체 업무, 배운 점, 공개 가능한 사진과 자료를 추가합니다. 값이 없는 날짜는 화면에 출력하지 않습니다.
- 행동 사례: `personalTraits.ts`의 `paragraphs`와 `highlights`에서 본문과 주요 경험을 편집합니다. 2026-10-25 사용자 원고의 실제 경험을 반영했습니다.
- 주변 평가: `testimonials.ts`에 실제 발언과 관계, 경험, 날짜, 관련 강점, 공개 동의 범위를 입력합니다. 가상의 추천사를 추가하지 않습니다. 이름 대신 익명 표기도 가능합니다. 사진·직책을 임의로 공개하는 필드는 없습니다.
- 취미: `hobbies.ts`에 실제 제작 결과물과 사진, 담당 업무, 본인이 설명한 연결점을 추가합니다.
- 개인 취향: `interests.ts`에 직접 확인된 관심사·목표·좋아하는 문구 등을 추가합니다.

다음 실제 자료가 더 필요합니다: 마스킹한 학기 성적 자료, 학과 활동 기간·구체 사례·사진, 강점별 실제 문제와 행동·결과, 동의받은 주변 평가, 제과·제빵 작업 사진·결과물, 추가 취미·취향, 자기소개 영상과 자막.

## 검증

- TypeScript와 Vite 프로덕션 빌드 성공.
- 자동 테스트 20개 통과: 10개 구간 매핑, 화면비별 프레임 투영과 실내 경로, 입력 잠금, 미디어 매핑, 성적의 학기 범위, 마스킹·공개 허용 조건, 추천사 동의·익명 처리, 미확인 사실 공란 보존.
- 브라우저에서 구간 이동, 학업 성과, 학과 활동, 강점 카드와 관련 기록의 확대 상태 유지, Beyond Code, 연락처 및 HTML 이력서를 확인합니다. 실제 확인 범위는 `VALIDATION.md`에 기록합니다.
- Three.js 기존 대용량 청크 경고는 유지됩니다. 성적 증빙·추천사가 실제 파일/자료로 제공되지 않아 그 자료의 실제 내용 검증은 대상이 아닙니다.

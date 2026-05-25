import type { InsightArticle, InsightCategory } from "@/features/insights/types";

export const INSIGHT_CATEGORIES: InsightCategory[] = [
  { id: "all", label: "전체" },
  { id: "hiring", label: "채용소식" },
  { id: "operations", label: "운영팁" },
  { id: "career", label: "트레이너 커리어" },
  { id: "education", label: "교육/대회" }
];

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    id: "fitness-hiring-guide",
    category: "hiring",
    title: "센터 구인글은 급여보다 근무 구조가 먼저 읽힙니다",
    summary:
      "트레이너가 지원 전에 가장 먼저 확인하는 항목은 근무 요일, 수업 배정 방식, 인센티브 기준입니다. 공고 첫 화면에서 이 세 가지가 보이면 문의 전환이 좋아집니다.",
    sourceName: "GymIn 편집",
    publishedAt: "2026-05-24",
    readTime: "3분",
    href: "/jobs/hiring"
  },
  {
    id: "trainer-interview-checklist",
    category: "career",
    title: "트레이너 면접 전 확인하면 좋은 질문 6가지",
    summary:
      "회원 배정 방식, 수업 단가, 정산일, 개인 영업 범위, 프로필 촬영 지원, 퇴사 시 회원 인계 기준은 계약 전에 확인해야 합니다.",
    sourceName: "GymIn 편집",
    publishedAt: "2026-05-23",
    readTime: "4분",
    href: "/trainers/new"
  },
  {
    id: "center-equipment-cost",
    category: "operations",
    title: "중고 운동기구 거래가 많아지는 이유",
    summary:
      "신규 센터 오픈 비용 부담이 커지면서 리스, 중고 구매, 일부 품목 선도입 방식이 함께 검토되고 있습니다. 장비 선택은 채용 공고의 센터 신뢰감에도 영향을 줍니다.",
    sourceName: "GymIn 편집",
    publishedAt: "2026-05-22",
    readTime: "3분",
    href: "/gyms/new"
  },
  {
    id: "pilates-instructor-market",
    category: "hiring",
    title: "필라테스 강사 채용은 시간대 조건이 핵심입니다",
    summary:
      "오전, 점심, 퇴근 후 피크타임에 따라 구인글 반응이 달라집니다. 파트타임 공고는 가능한 수업 시간대를 구체적으로 적는 편이 좋습니다.",
    sourceName: "GymIn 편집",
    publishedAt: "2026-05-21",
    readTime: "2분",
    href: "/jobs/hiring"
  },
  {
    id: "trainer-profile-photo",
    category: "career",
    title: "트레이너 프로필에서 사진보다 중요한 것",
    summary:
      "사진은 신뢰의 시작이지만, 실제 지원 전환은 전문 분야, 수업 가능 지역, 경력 요약, 자격 정보가 한 번에 보일 때 높아집니다.",
    sourceName: "GymIn 편집",
    publishedAt: "2026-05-20",
    readTime: "3분",
    href: "/trainers/new"
  },
  {
    id: "education-event-calendar",
    category: "education",
    title: "교육과 대회 정보는 커리어 이동의 신호가 됩니다",
    summary:
      "자격 과정, 세미나, 피트니스 대회 일정은 강사와 트레이너가 다음 일자리를 탐색하는 타이밍과 맞물립니다. GymIn은 이 흐름을 채용과 연결해 갈 수 있습니다.",
    sourceName: "GymIn 편집",
    publishedAt: "2026-05-19",
    readTime: "2분",
    href: "/jobs/hiring"
  }
];

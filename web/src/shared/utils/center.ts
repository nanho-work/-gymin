type CenterRegion = {
  sido?: string | null;
  sigungu?: string | null;
  detail_address?: string | null;
};

const industryLabels: Record<string, string> = {
  health_pt: "헬스/PT",
  pilates: "필라테스",
  yoga: "요가",
  crossfit: "크로스핏",
  rehab: "재활/교정",
  mixed: "복합 센터",
  etc: "기타"
};

const statusLabels: Record<string, string> = {
  active: "운영 중",
  draft: "등록 준비",
  hidden: "비공개",
  deleted: "삭제됨"
};

const verificationStatusLabels: Record<string, string> = {
  not_requested: "인증 전",
  pending: "인증 확인 중",
  verified: "인증 완료",
  rejected: "인증 반려"
};

export function formatCenterIndustry(industry: string | null | undefined) {
  return industry ? industryLabels[industry] ?? industry : "업종 미입력";
}

export function formatCenterStatus(status: string | null | undefined) {
  return status ? statusLabels[status] ?? status : "상태 미입력";
}

export function formatCenterVerificationStatus(status: string | null | undefined) {
  return verificationStatusLabels[status ?? ""] ?? "인증 전";
}

export function getCenterArea(center: CenterRegion) {
  return [center.sido, center.sigungu].filter(Boolean).join(" ") || "지역 정보 없음";
}

export function getCenterAddress(center: CenterRegion) {
  return [center.sido, center.sigungu, center.detail_address].filter(Boolean).join(" ") || "주소 미입력";
}

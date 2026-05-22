const jobRoleLabels: Record<string, string> = {
  pt_trainer: "PT 트레이너",
  pilates_instructor: "필라테스 강사",
  yoga_instructor: "요가 강사",
  gx_instructor: "GX 강사",
  rehab_trainer: "재활/교정 트레이너",
  etc: "기타"
};

const employmentTypeLabels: Record<string, string> = {
  full_time: "정규직",
  part_time: "파트타임",
  freelance: "프리랜서",
  schedule: "스케줄 근무",
  negotiable: "협의"
};

const insuranceTypeLabels: Record<string, string> = {
  included: "가입",
  negotiable: "협의",
  not_included: "미가입",
  not_applicable: "해당 없음"
};

const salesPressureLabels: Record<string, string> = {
  none: "영업 압박 없음",
  low: "영업 압박 낮음",
  high: "영업 압박 있음",
  interview: "면접 시 안내"
};

const memberHandoverLabels: Record<string, string> = {
  provided: "회원 인계 있음",
  none: "회원 인계 없음",
  negotiable: "회원 인계 협의",
  new_members: "신규 배정"
};

const jobStatusLabels: Record<string, string> = {
  draft: "작성 중",
  open: "지원 가능",
  closed: "마감",
  hidden: "숨김",
  deleted: "삭제됨"
};

export function formatJobRole(value: string | null | undefined) {
  return value ? jobRoleLabels[value] ?? value : "직무 미입력";
}

export function formatEmploymentType(value: string | null | undefined) {
  return value ? employmentTypeLabels[value] ?? value : "근무 형태 미입력";
}

export function formatInsuranceType(value: string | null | undefined) {
  return value ? insuranceTypeLabels[value] ?? value : "보험 협의";
}

export function formatSalesPressure(value: string | null | undefined) {
  return value ? salesPressureLabels[value] ?? value : "영업 압박 미입력";
}

export function formatMemberHandover(value: string | null | undefined) {
  return value ? memberHandoverLabels[value] ?? value : "회원 인계 미입력";
}

export function formatJobStatus(value: string | null | undefined) {
  return value ? jobStatusLabels[value] ?? value : "상태 미입력";
}

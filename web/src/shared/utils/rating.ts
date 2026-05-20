import type { RatingBreakdown } from "@/shared/types/domain";

export const ratingLabels: Record<keyof RatingBreakdown, string> = {
  settlement: "정산 정확도",
  workEnvironment: "근무 환경",
  contractClarity: "계약 명확성",
  dayOff: "휴무 보장",
  salesPressure: "회원 강매 압박",
  incentive: "인센티브 구조"
};

export function getAverageRating(ratings: RatingBreakdown) {
  const values = Object.values(ratings);
  return (values.reduce((sum, rating) => sum + rating, 0) / values.length).toFixed(1);
}

export function getRatingPercent(value: number) {
  return `${Math.max(0, Math.min(100, value * 20))}%`;
}

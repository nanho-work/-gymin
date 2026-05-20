import type { RatingBreakdown as RatingBreakdownType } from "@/shared/types/domain";
import { getRatingPercent, ratingLabels } from "@/shared/utils/rating";

export function RatingBreakdown({ ratings }: { ratings: RatingBreakdownType }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-ink">헬스장 평가 항목</h2>
      <div className="mt-5 space-y-4">
        {Object.entries(ratings).map(([key, value]) => (
          <div key={key}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-black text-ink">{ratingLabels[key as keyof RatingBreakdownType]}</p>
              <p className="text-sm font-black text-forest">{value.toFixed(1)}</p>
            </div>
            <div className="mt-2 h-2 rounded-full bg-paper">
              <div className="h-2 rounded-full bg-green" style={{ width: getRatingPercent(value) }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 border-t border-line pt-4 text-sm leading-6 text-muted">
        텍스트 리뷰는 제한적으로만 노출하고, 신고 또는 검수 대상 문구는 블라인드 처리하는 정책을 전제로 한
        목업입니다.
      </p>
    </section>
  );
}

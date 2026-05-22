import type { JobPostRead } from "@/shared/api/serverTypes";
import {
  formatInsuranceType,
  formatMemberHandover,
  formatSalesPressure
} from "@/shared/utils/job";
import { formatWorkDays, parseWorkDayCodes, weekdayOptions } from "@/shared/utils/weekdays";
import { JobInfoGrid } from "@/features/jobs/components/JobInfoGrid";

export function JobConditionGrid({ job }: { job: JobPostRead }) {
  return (
    <section className="border-b border-line py-8">
      <h2 className="text-xl font-black text-ink">근무 조건</h2>
      <WeekdaySummary value={job.work_days} />
      <JobInfoGrid
        variant="compact"
        items={[
          { label: "근무 시작", value: job.start_date_text || "협의" },
          { label: "근무 시간", value: job.work_hours || "협의" },
          { label: "휴게 시간", value: job.rest_time || "협의" },
          { label: "기본급", value: job.base_pay || "협의" },
          { label: "수업료/인센티브", value: job.incentive || "협의" },
          { label: "정산 방식", value: job.settlement_type || "협의" },
          { label: "4대보험", value: formatInsuranceType(job.insurance_type) },
          { label: "영업 압박", value: formatSalesPressure(job.sales_pressure) },
          { label: "회원 인계", value: formatMemberHandover(job.member_handover) },
          { label: "휴가/월차", value: job.vacation || "협의" },
          { label: "추가 지원", value: job.support_detail || "미입력" }
        ]}
      />
    </section>
  );
}

function WeekdaySummary({ value }: { value: string | null }) {
  const selectedCodes = parseWorkDayCodes(value);

  return (
    <div className="mt-5">
      <p className="text-sm font-black text-ink">근무 요일</p>
      <div className="mt-2 grid grid-cols-7 gap-1.5 sm:max-w-lg">
        {weekdayOptions.map((day) => {
          const isSelected = selectedCodes.includes(day.value);

          return (
            <span
              className={`grid h-10 place-items-center border text-sm font-black ${
                isSelected ? "border-green bg-green text-white" : "border-line bg-paper text-muted"
              }`}
              key={day.value}
            >
              {day.label}
            </span>
          );
        })}
      </div>
      {selectedCodes.length === 0 ? <p className="mt-2 text-sm font-bold text-muted">{formatWorkDays(value)}</p> : null}
    </div>
  );
}

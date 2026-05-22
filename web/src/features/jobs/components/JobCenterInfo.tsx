import type { CenterSummary } from "@/shared/api/serverTypes";
import { formatCenterIndustry, getCenterAddress, getCenterArea } from "@/shared/utils/center";
import { JobInfoGrid } from "@/features/jobs/components/JobInfoGrid";

export function JobCenterInfo({ center }: { center: CenterSummary | null }) {
  if (!center) {
    return null;
  }

  return (
    <section className="py-8">
      <h2 className="text-xl font-black text-ink">업장 정보</h2>
      <JobInfoGrid
        variant="spacious"
        items={[
          { label: "센터명", value: center.name },
          { label: "지역", value: getCenterArea(center) },
          { label: "주소", value: getCenterAddress(center) },
          { label: "업종", value: formatCenterIndustry(center.industry) }
        ]}
      />
    </section>
  );
}

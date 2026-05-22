import type { Metadata } from "next";

import { JobDetailPage } from "@/features/jobs/pages/JobDetailPage";
import type { JobPostRead } from "@/shared/api/serverTypes";
import { fetchPublicApi } from "@/shared/seo/serverApi";
import { createSeoMetadata } from "@/shared/seo/metadata";
import { truncateMetaDescription } from "@/shared/seo/site";
import { getCenterArea } from "@/shared/utils/center";
import { formatEmploymentType, formatJobRole } from "@/shared/utils/job";

type PageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { jobId } = await params;

  try {
    const job = await fetchPublicApi<JobPostRead>(`/jobs/${jobId}`);
    const center = job.center;
    const title = `${job.title} - ${center?.name ?? "피트니스 구인글"}`;
    const metaParts = [
      center ? getCenterArea(center) : "",
      formatJobRole(job.job_role),
      formatEmploymentType(job.employment_type),
      job.base_pay || job.incentive || "",
      job.description || job.support_detail || ""
    ].filter(Boolean);

    return createSeoMetadata({
      title,
      description: truncateMetaDescription(metaParts.join(" · "), "피트니스 시설의 구인글 상세 정보입니다."),
      path: `/jobs/hiring/${job.id}`,
      type: "article"
    });
  } catch {
    return createSeoMetadata({
      title: "피트니스 구인글",
      description: "피트니스 구인글 상세 정보를 확인합니다.",
      path: `/jobs/hiring/${jobId}`,
      type: "article"
    });
  }
}

export default function Page() {
  return <JobDetailPage />;
}

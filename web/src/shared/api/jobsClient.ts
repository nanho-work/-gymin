import { apiGet, apiPatch, apiPost } from "@/shared/api/httpClient";
import type { JobPostCreate, JobPostRead } from "@/shared/api/serverTypes";
import type { Page } from "@/shared/api/types";
import type { JobPost } from "@/shared/types/domain";

export function listJobPosts(params: { page?: number; size?: number } = {}) {
  return apiGet<Page<JobPostRead>>("/jobs", params);
}

export function getJobPost(jobId: string) {
  return apiGet<JobPostRead>(`/jobs/${jobId}`);
}

export function createJobPost(payload: JobPostCreate) {
  return apiPost<JobPostRead>("/jobs", payload);
}

export function closeJobPost(jobId: string) {
  return apiPatch<JobPostRead>(`/jobs/${jobId}/close`);
}

export function toDomainJobPost(job: JobPostRead): JobPost {
  const tags = [job.job_role, job.sales_pressure, job.member_handover, job.insurance_type].filter(Boolean) as string[];
  const schedule = [job.work_days, job.work_hours].filter(Boolean).join(" · ") || "협의";

  return {
    id: job.id,
    type: "hiring",
    gymId: job.center_id,
    title: job.title,
    authorName: "센터 정보 연동 예정",
    area: "지역 연동 예정",
    employmentType: job.employment_type,
    compensation: job.base_pay || job.incentive || "협의",
    schedule,
    postedAt: formatDate(job.published_at ?? job.created_at),
    tags,
    summary: job.description || job.support_detail || "상세 내용은 구인글에서 확인해 주세요.",
    status: job.status === "open" ? "지원 가능" : "마감"
  };
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

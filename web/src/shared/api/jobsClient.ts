import { apiGet, apiPatch, apiPost } from "@/shared/api/httpClient";
import type { JobPostCreate, JobPostRead, OwnerJobPostRead } from "@/shared/api/serverTypes";
import type { Page } from "@/shared/api/types";
import type { JobPost } from "@/shared/types/domain";
import { getCenterArea } from "@/shared/utils/center";
import {
  formatEmploymentType,
  formatInsuranceType,
  formatJobRole,
  formatJobStatus,
  formatMemberHandover,
  formatSalesPressure
} from "@/shared/utils/job";

export function listJobPosts(params: { page?: number; size?: number } = {}) {
  return apiGet<Page<JobPostRead>>("/jobs", params);
}

export function listMyJobPosts(params: { page?: number; size?: number } = {}) {
  return apiGet<Page<OwnerJobPostRead>>("/jobs/me", params);
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
  const tags = [
    formatJobRole(job.job_role),
    job.sales_pressure ? formatSalesPressure(job.sales_pressure) : "",
    job.member_handover ? formatMemberHandover(job.member_handover) : "",
    job.insurance_type ? `4대보험 ${formatInsuranceType(job.insurance_type)}` : ""
  ].filter(Boolean);
  const schedule = [job.work_days, job.work_hours].filter(Boolean).join(" · ") || "협의";
  const center = job.center;

  return {
    id: job.id,
    type: "hiring",
    gymId: job.center_id,
    title: job.title,
    authorName: center?.name ?? "센터 정보 없음",
    area: center ? getCenterArea(center) : "지역 정보 없음",
    employmentType: formatEmploymentType(job.employment_type),
    compensation: job.base_pay || job.incentive || "협의",
    schedule,
    postedAt: formatDate(job.published_at ?? job.created_at),
    tags,
    summary: job.description || job.support_detail || "상세 내용은 구인글에서 확인해 주세요.",
    status: formatJobStatus(job.status)
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

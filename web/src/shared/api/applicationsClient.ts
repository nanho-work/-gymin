import { apiGet, apiPost } from "@/shared/api/httpClient";
import type { JobApplicationCreate, JobApplicationRead } from "@/shared/api/serverTypes";
import type { Page } from "@/shared/api/types";

export function listJobApplications(jobPostId: string, params: { page?: number; size?: number } = {}) {
  return apiGet<Page<JobApplicationRead>>(`/applications/jobs/${jobPostId}`, params);
}

export function createJobApplication(payload: JobApplicationCreate) {
  return apiPost<JobApplicationRead>("/applications", payload);
}

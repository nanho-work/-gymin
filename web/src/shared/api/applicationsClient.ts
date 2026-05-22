import { apiGet, apiPost } from "@/shared/api/httpClient";
import type {
  JobApplicationCreate,
  JobApplicationRead,
  JobApplicationWithTrainerRead,
  MyJobApplicationRead
} from "@/shared/api/serverTypes";
import type { Page } from "@/shared/api/types";

export function listJobApplications(jobPostId: string, params: { page?: number; size?: number } = {}) {
  return apiGet<Page<JobApplicationWithTrainerRead>>(`/applications/jobs/${jobPostId}`, params);
}

export function listMyJobApplications(params: { page?: number; size?: number } = {}) {
  return apiGet<Page<MyJobApplicationRead>>("/applications/me", params);
}

export function createJobApplication(payload: JobApplicationCreate) {
  return apiPost<JobApplicationRead>("/applications", payload);
}

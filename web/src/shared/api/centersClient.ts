import { apiGet, apiPost } from "@/shared/api/httpClient";
import type { CenterCreate, CenterRead } from "@/shared/api/serverTypes";
import type { Page } from "@/shared/api/types";

export function listCenters(params: { page?: number; size?: number } = {}) {
  return apiGet<Page<CenterRead>>("/centers", params);
}

export function getCenter(centerId: string) {
  return apiGet<CenterRead>(`/centers/${centerId}`);
}

export function createCenter(payload: CenterCreate) {
  return apiPost<CenterRead>("/centers", payload);
}

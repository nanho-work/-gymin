import { apiGet, apiPost, apiPut } from "@/shared/api/httpClient";
import type { CenterCreate, CenterRead, CenterUpdate } from "@/shared/api/serverTypes";
import type { Page } from "@/shared/api/types";

export function listCenters(params: { page?: number; size?: number } = {}) {
  return apiGet<Page<CenterRead>>("/centers", params);
}

export function listMyCenters(params: { page?: number; size?: number } = {}) {
  return apiGet<Page<CenterRead>>("/centers/me", params);
}

export function getCenter(centerId: string) {
  return apiGet<CenterRead>(`/centers/${centerId}`);
}

export function createCenter(payload: CenterCreate) {
  return apiPost<CenterRead>("/centers", payload);
}

export function updateCenter(centerId: string, payload: CenterUpdate) {
  return apiPut<CenterRead>(`/centers/${centerId}`, payload);
}

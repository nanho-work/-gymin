import { apiGet } from "@/shared/api/httpClient";
import type { PlatformStats } from "@/shared/api/types";

export function getPlatformStats() {
  return apiGet<PlatformStats>("/stats/summary");
}

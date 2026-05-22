import { apiGet } from "@/shared/api/httpClient";
import type { BusinessProfileRead } from "@/shared/api/serverTypes";

export function getMyBusinessProfile() {
  return apiGet<BusinessProfileRead>("/business-profiles/me");
}

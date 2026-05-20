import { apiPost } from "@/shared/api/httpClient";
import type { PresignedUploadRequest, PresignedUploadResponse } from "@/shared/api/serverTypes";

export function createPresignedUpload(payload: PresignedUploadRequest) {
  return apiPost<PresignedUploadResponse>("/media/presigned-upload", payload);
}

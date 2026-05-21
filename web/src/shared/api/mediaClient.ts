import { apiPost } from "@/shared/api/httpClient";
import type {
  CompleteUploadRequest,
  CompleteUploadResponse,
  PresignedUploadRequest,
  PresignedUploadResponse
} from "@/shared/api/serverTypes";

export function createPresignedUpload(payload: PresignedUploadRequest) {
  return apiPost<PresignedUploadResponse>("/media/presigned-upload", payload);
}

export function completeUpload(payload: CompleteUploadRequest) {
  return apiPost<CompleteUploadResponse>("/media/complete-upload", payload);
}

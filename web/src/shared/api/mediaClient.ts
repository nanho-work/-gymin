import { apiGet, apiPost } from "@/shared/api/httpClient";
import type {
  CompleteUploadRequest,
  CompleteUploadResponse,
  MediaFileResponse,
  PresignedUploadRequest,
  PresignedUploadResponse
} from "@/shared/api/serverTypes";

export function createPresignedUpload(payload: PresignedUploadRequest) {
  return apiPost<PresignedUploadResponse>("/media/presigned-upload", payload);
}

export function completeUpload(payload: CompleteUploadRequest) {
  return apiPost<CompleteUploadResponse>("/media/complete-upload", payload);
}

export function listMediaFiles(params: {
  entity_type: PresignedUploadRequest["entity_type"];
  entity_id: string;
  purpose?: PresignedUploadRequest["purpose"];
}) {
  return apiGet<MediaFileResponse[]>("/media", params);
}

export function getMediaDisplayUrl(mediaFile: MediaFileResponse | undefined) {
  if (!mediaFile) {
    return "";
  }

  const preferredVariant =
    mediaFile.variants.find((item) => item.variant_type === "medium") ??
    mediaFile.variants.find((item) => item.variant_type === "thumbnail") ??
    mediaFile.variants.find((item) => item.variant_type === "original");

  return preferredVariant?.url ?? "";
}

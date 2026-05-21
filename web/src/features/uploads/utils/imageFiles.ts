const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export const defaultImageAccept = allowedImageTypes.join(",");

export function validateImageFile(file: File, maxFileSizeMB: number) {
  if (!allowedImageTypes.includes(file.type)) {
    return "jpg, png, webp 이미지만 업로드할 수 있습니다.";
  }

  const maxBytes = maxFileSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `이미지는 ${maxFileSizeMB}MB 이하만 업로드할 수 있습니다.`;
  }

  return null;
}

export function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))}KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}

export function createUploadId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createDraftUuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return "00000000-0000-4000-8000-000000000000";
}


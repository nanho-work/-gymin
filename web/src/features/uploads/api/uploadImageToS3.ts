import { completeUpload, createPresignedUpload } from "@/shared/api/mediaClient";
import type { UploadEntityType, UploadPurpose } from "@/features/uploads/types";

export type UploadImageToS3Params = {
  file: File;
  entityType: UploadEntityType;
  entityId: string;
  purpose: UploadPurpose;
  sortOrder: number;
};

export async function uploadImageToS3({ file, entityType, entityId, purpose, sortOrder }: UploadImageToS3Params) {
  const presigned = await createPresignedUpload({
    entity_type: entityType,
    entity_id: entityId,
    purpose,
    filename: file.name,
    content_type: file.type
  });

  const uploadResponse = await fetch(presigned.upload_url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type
    },
    body: file
  });

  if (!uploadResponse.ok) {
    throw new Error("S3 이미지 업로드에 실패했습니다.");
  }

  const completed = await completeUpload({
    entity_type: entityType,
    entity_id: entityId,
    purpose,
    object_key: presigned.object_key,
    original_filename: file.name,
    content_type: file.type,
    file_size: file.size,
    sort_order: sortOrder
  });

  return {
    bucket: completed.bucket,
    objectKey: completed.object_key,
    expiresIn: presigned.expires_in,
    height: completed.height,
    mediaFileId: completed.id,
    variants: completed.variants.map((variant) => ({
      variantType: variant.variant_type,
      objectKey: variant.object_key,
      width: variant.width,
      height: variant.height,
      fileSize: variant.file_size,
      contentType: variant.content_type
    })),
    width: completed.width
  };
}

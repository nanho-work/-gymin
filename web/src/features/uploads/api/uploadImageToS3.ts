import { createPresignedUpload } from "@/shared/api/mediaClient";
import type { UploadEntityType, UploadPurpose } from "@/features/uploads/types";

export type UploadImageToS3Params = {
  file: File;
  entityType: UploadEntityType;
  entityId: string;
  purpose: UploadPurpose;
};

export async function uploadImageToS3({ file, entityType, entityId, purpose }: UploadImageToS3Params) {
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

  return {
    bucket: presigned.bucket,
    objectKey: presigned.object_key,
    expiresIn: presigned.expires_in
  };
}


import type { PresignedUploadRequest } from "@/shared/api/serverTypes";

export type UploadEntityType = PresignedUploadRequest["entity_type"];
export type UploadPurpose = PresignedUploadRequest["purpose"];

export type ImageUploadSlotInput =
  | string
  | {
      id?: string;
      label: string;
      helperText?: string;
      purpose?: UploadPurpose;
      required?: boolean;
    };

export type ImageUploadSlot = {
  id: string;
  label: string;
  helperText: string;
  purpose?: UploadPurpose;
  required: boolean;
};

export type UploadedImageStatus = "uploading" | "uploaded" | "error";

export type UploadedImage = {
  id: string;
  mediaFileId?: string;
  slotId: string;
  slotLabel: string;
  purpose: UploadPurpose;
  fileName: string;
  contentType: string;
  fileSize: number;
  previewUrl: string;
  status: UploadedImageStatus;
  bucket?: string;
  objectKey?: string;
  width?: number;
  height?: number;
  variants?: {
    variantType: "original" | "medium" | "thumbnail";
    objectKey: string;
    width: number;
    height: number;
    fileSize: number;
    contentType: string;
  }[];
  error?: string;
};

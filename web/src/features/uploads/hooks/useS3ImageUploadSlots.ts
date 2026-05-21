"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { uploadImageToS3 } from "@/features/uploads/api/uploadImageToS3";
import type { ImageUploadSlot, UploadedImage, UploadEntityType, UploadPurpose } from "@/features/uploads/types";
import { createUploadId, validateImageFile } from "@/features/uploads/utils/imageFiles";

export function useS3ImageUploadSlots({
  defaultPurpose,
  entityId,
  entityType,
  maxFileSizeMB = 8,
  onUploaded,
  slots
}: {
  defaultPurpose: UploadPurpose;
  entityId: string;
  entityType: UploadEntityType;
  maxFileSizeMB?: number;
  onUploaded?: (image: UploadedImage) => void;
  slots: ImageUploadSlot[];
}) {
  const uploadedImagesRef = useRef<UploadedImage[]>([]);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    uploadedImagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      uploadedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  const uploadToSlot = useCallback(
    async (slot: ImageUploadSlot, file: File) => {
      const validationError = validateImageFile(file, maxFileSizeMB);
      const purpose = slot.purpose ?? defaultPurpose;
      const sortOrder = Math.max(
        0,
        slots.findIndex((item) => item.id === slot.id)
      );
      const id = createUploadId();
      const previewUrl = URL.createObjectURL(file);

      const pendingImage: UploadedImage = {
        id,
        slotId: slot.id,
        slotLabel: slot.label,
        purpose,
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
        previewUrl,
        status: validationError ? "error" : "uploading",
        error: validationError ?? undefined
      };

      setImages((current) => [...current.filter((image) => image.slotId !== slot.id), pendingImage]);

      if (validationError) {
        setNotice(validationError);
        return;
      }

      try {
        const result = await uploadImageToS3({
          entityId,
          entityType,
          file,
          purpose,
          sortOrder
        });

        const uploadedImage: UploadedImage = {
          ...pendingImage,
          bucket: result.bucket,
          height: result.height,
          mediaFileId: result.mediaFileId,
          objectKey: result.objectKey,
          status: "uploaded",
          variants: result.variants,
          width: result.width
        };

        setImages((current) => current.map((image) => (image.id === id ? uploadedImage : image)));
        setNotice(null);
        onUploaded?.(uploadedImage);
      } catch (error) {
        const message = error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.";
        setImages((current) =>
          current.map((image) => (image.id === id ? { ...image, error: message, status: "error" } : image))
        );
        setNotice(message);
      }
    },
    [defaultPurpose, entityId, entityType, maxFileSizeMB, onUploaded, slots]
  );

  const uploadFiles = useCallback(
    (files: File[]) => {
      const occupiedSlotIds = new Set(images.map((image) => image.slotId));
      const availableSlots = slots.filter((slot) => !occupiedSlotIds.has(slot.id));

      files.slice(0, availableSlots.length).forEach((file, index) => {
        void uploadToSlot(availableSlots[index], file);
      });

      if (files.length > availableSlots.length) {
        setNotice(`최대 ${slots.length}장까지 업로드할 수 있습니다.`);
      }
    },
    [images, slots, uploadToSlot]
  );

  const uploadFileToSlot = useCallback(
    (slotId: string, file: File) => {
      const slot = slots.find((item) => item.id === slotId);
      if (slot) {
        void uploadToSlot(slot, file);
      }
    },
    [slots, uploadToSlot]
  );

  const removeImage = useCallback((imageId: string) => {
    setImages((current) => {
      const target = current.find((image) => image.id === imageId);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }

      return current.filter((image) => image.id !== imageId);
    });
  }, []);

  return {
    images,
    notice,
    removeImage,
    uploadFiles,
    uploadFileToSlot
  };
}

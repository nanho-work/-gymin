"use client";

import { ChangeEvent } from "react";

import { useImageDropzone } from "@/features/uploads/hooks/useImageDropzone";
import { useImageUploadSlots } from "@/features/uploads/hooks/useImageUploadSlots";
import { useS3ImageUploadSlots } from "@/features/uploads/hooks/useS3ImageUploadSlots";
import type {
  ImageUploadSlotInput,
  UploadedImage,
  UploadEntityType,
  UploadPurpose
} from "@/features/uploads/types";
import { defaultImageAccept } from "@/features/uploads/utils/imageFiles";

export function ImageUploadSection({
  accept = defaultImageAccept,
  defaultPurpose,
  description,
  entityId,
  entityType,
  maxFileSizeMB = 8,
  onUploaded,
  optional = false,
  requiredFirst = false,
  requiredLabel = "필수 등록",
  slots,
  title
}: {
  accept?: string;
  defaultPurpose: UploadPurpose;
  description: string;
  entityId: string;
  entityType: UploadEntityType;
  maxFileSizeMB?: number;
  onUploaded?: (image: UploadedImage) => void;
  optional?: boolean;
  requiredFirst?: boolean;
  requiredLabel?: string;
  slots: ImageUploadSlotInput[];
  title: string;
}) {
  const uploadSlots = useImageUploadSlots({
    optional,
    requiredFirst,
    requiredLabel,
    slots
  });

  const { images, notice, removeImage, uploadFiles, uploadFileToSlot } = useS3ImageUploadSlots({
    defaultPurpose,
    entityId,
    entityType,
    maxFileSizeMB,
    onUploaded,
    slots: uploadSlots
  });

  const { inputRef, isDragging, openFileDialog, rootProps } = useImageDropzone({
    onFiles: uploadFiles
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    uploadFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const slotGridClass =
    uploadSlots.length === 1 ? "grid max-w-xl grid-cols-1 gap-4" : "grid gap-4 md:grid-cols-2 2xl:grid-cols-3";
  const slotSizeClass = uploadSlots.length === 1 ? "min-h-[280px]" : "min-h-[210px]";

  return (
    <section
      className={`space-y-4 transition ${isDragging ? "outline outline-2 outline-offset-8 outline-green" : ""}`}
      {...rootProps}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
          <h2 className="text-xl font-black text-ink">{title}</h2>
          {optional ? <span className="text-xs font-black text-muted">선택</span> : null}
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <p className="text-xs font-bold text-muted">드래그앤드랍 또는 슬롯 클릭으로 업로드 · jpg, png, webp · {maxFileSizeMB}MB 이하</p>
        <button className="border border-line bg-white px-4 py-2 text-sm font-black text-ink" onClick={openFileDialog} type="button">
          파일 선택
        </button>
        <input accept={accept} className="sr-only" multiple onChange={handleInputChange} ref={inputRef} type="file" />
      </div>

      {notice ? <p className="border-l-2 border-green pl-3 text-sm font-bold text-muted">{notice}</p> : null}

      <div className={slotGridClass}>
        {uploadSlots.map((slot, index) => {
          const image = images.find((item) => item.slotId === slot.id);

          return (
            <label
              className={`group relative flex ${slotSizeClass} cursor-pointer flex-col overflow-hidden border border-line bg-white text-center transition hover:border-green`}
              key={slot.id}
            >
              <input
                accept={accept}
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    uploadFileToSlot(slot.id, file);
                  }
                  event.target.value = "";
                }}
                type="file"
              />
              {image ? (
                <>
                  <img alt={slot.label} className="h-full w-full object-cover" src={image.previewUrl} />
                  <span className="absolute inset-x-0 bottom-0 bg-ink/80 px-2 py-2 text-left text-xs font-bold text-white">
                    {image.status === "uploading" ? "업로드 중" : image.status === "uploaded" ? "업로드 완료" : image.error}
                  </span>
                  <button
                    className="absolute right-2 top-2 bg-white px-2 py-1 text-xs font-black text-ink"
                    onClick={(event) => {
                      event.preventDefault();
                      void removeImage(image.id);
                    }}
                    type="button"
                  >
                    제거
                  </button>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-5">
                  <span className="grid h-12 w-12 place-items-center border border-line text-lg font-black text-forest group-hover:border-green">
                    {index + 1}
                  </span>
                  <span className="mt-4 max-w-full break-keep text-base font-black leading-6 text-ink">{slot.label}</span>
                  <span className="mt-2 max-w-full break-keep text-sm font-bold leading-5 text-muted">{slot.helperText}</span>
                </div>
              )}
            </label>
          );
        })}
      </div>

    </section>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { createUploadId, validateImageFile } from "@/features/uploads/utils/imageFiles";

export type DeferredImage = {
  id: string;
  file: File;
  previewUrl: string;
};

type DeferredImageResult = {
  ok: boolean;
  message: string;
};

type DeferredImageOptions = {
  maxFileSizeMB?: number;
};

type DeferredImageListOptions = DeferredImageOptions & {
  maxImages: number;
};

export function useDeferredSingleImage({ maxFileSizeMB = 8 }: DeferredImageOptions = {}) {
  const imageRef = useRef<DeferredImage | null>(null);
  const [image, setImage] = useState<DeferredImage | null>(null);

  useEffect(() => {
    imageRef.current = image;
  }, [image]);

  useEffect(() => {
    return () => {
      revokeDeferredImage(imageRef.current);
    };
  }, []);

  const setFile = useCallback(
    (file: File): DeferredImageResult => {
      const validationError = validateImageFile(file, maxFileSizeMB);
      if (validationError) {
        return { ok: false, message: validationError };
      }

      const nextImage = createDeferredImage(file);
      setImage((current) => {
        revokeDeferredImage(current);
        return nextImage;
      });

      return { ok: true, message: "" };
    },
    [maxFileSizeMB]
  );

  const clearImage = useCallback(() => {
    setImage((current) => {
      revokeDeferredImage(current);
      return null;
    });
  }, []);

  return {
    clearImage,
    image,
    setFile
  };
}

export function useDeferredImageList({ maxFileSizeMB = 8, maxImages }: DeferredImageListOptions) {
  const imagesRef = useRef<DeferredImage[]>([]);
  const [images, setImages] = useState<DeferredImage[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      revokeDeferredImages(imagesRef.current);
    };
  }, []);

  const addFiles = useCallback(
    (files: File[]): DeferredImageResult => {
      const availableCount = Math.max(maxImages - imagesRef.current.length, 0);
      if (availableCount === 0) {
        return { ok: false, message: `최대 ${maxImages}장까지 선택할 수 있습니다.` };
      }

      const nextImages: DeferredImage[] = [];
      let message = "";

      for (const file of files) {
        if (nextImages.length >= availableCount) {
          message = `최대 ${maxImages}장까지 선택할 수 있습니다.`;
          break;
        }

        const validationError = validateImageFile(file, maxFileSizeMB);
        if (validationError) {
          message = validationError;
          continue;
        }

        nextImages.push(createDeferredImage(file));
      }

      if (nextImages.length === 0) {
        return { ok: false, message };
      }

      setImages((current) => [...current, ...nextImages].slice(0, maxImages));
      return { ok: true, message };
    },
    [maxFileSizeMB, maxImages]
  );

  const removeImage = useCallback((imageId: string) => {
    setImages((current) => {
      const target = current.find((image) => image.id === imageId);
      revokeDeferredImage(target ?? null);
      return current.filter((image) => image.id !== imageId);
    });
  }, []);

  const clearImages = useCallback(() => {
    setImages((current) => {
      revokeDeferredImages(current);
      return [];
    });
  }, []);

  return {
    addFiles,
    clearImages,
    images,
    removeImage
  };
}

function createDeferredImage(file: File): DeferredImage {
  return {
    id: createUploadId(),
    file,
    previewUrl: URL.createObjectURL(file)
  };
}

function revokeDeferredImage(image: DeferredImage | null) {
  if (image) {
    URL.revokeObjectURL(image.previewUrl);
  }
}

function revokeDeferredImages(images: DeferredImage[]) {
  images.forEach(revokeDeferredImage);
}

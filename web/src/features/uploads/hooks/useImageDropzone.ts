"use client";

import { DragEvent, useCallback, useRef, useState } from "react";

export function useImageDropzone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const dragDepth = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleDragEnter = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      dragDepth.current = 0;
      setIsDragging(false);

      const files = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
      if (files.length > 0) {
        onFiles(files);
      }
    },
    [onFiles]
  );

  return {
    inputRef,
    isDragging,
    openFileDialog,
    rootProps: {
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop
    }
  };
}


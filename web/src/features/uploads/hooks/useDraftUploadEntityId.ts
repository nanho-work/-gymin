"use client";

import { useMemo } from "react";

import { createDraftUuid } from "@/features/uploads/utils/imageFiles";

export function useDraftUploadEntityId() {
  return useMemo(() => createDraftUuid(), []);
}


import type { ImageUploadSlot, ImageUploadSlotInput } from "@/features/uploads/types";

export function useImageUploadSlots({
  optional,
  requiredFirst,
  requiredLabel,
  slots
}: {
  optional: boolean;
  requiredFirst: boolean;
  requiredLabel: string;
  slots: ImageUploadSlotInput[];
}): ImageUploadSlot[] {
  return slots.map((slot, index) => {
    const slotConfig = typeof slot === "string" ? { label: slot } : slot;
    const required = slotConfig.required ?? (requiredFirst && index === 0);

    return {
      id: slotConfig.id ?? `${slotConfig.label}-${index}`,
      label: slotConfig.label,
      helperText: slotConfig.helperText ?? (required ? requiredLabel : optional ? "선택 등록" : "이미지 등록"),
      purpose: slotConfig.purpose,
      required
    };
  });
}

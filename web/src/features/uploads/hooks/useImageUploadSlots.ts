export type ImageUploadSlot = {
  id: string;
  label: string;
  helperText: string;
  required: boolean;
};

export function useImageUploadSlots({
  optional,
  requiredFirst,
  requiredLabel,
  slots
}: {
  optional: boolean;
  requiredFirst: boolean;
  requiredLabel: string;
  slots: string[];
}): ImageUploadSlot[] {
  return slots.map((slot, index) => {
    const required = requiredFirst && index === 0;

    return {
      id: `${slot}-${index}`,
      label: slot,
      helperText: required ? requiredLabel : optional ? "선택 등록" : "이미지 선택 UI",
      required
    };
  });
}

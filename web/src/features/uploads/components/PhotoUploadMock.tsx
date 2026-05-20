import { useImageUploadSlots } from "@/features/uploads/hooks/useImageUploadSlots";

const defaultPhotoSlots = ["대표 사진", "수업 사진", "프로필 사진", "자격/수료", "추가 이미지"];

export function PhotoUploadMock({
  title = "프로필 사진",
  description = "최대 5장까지 등록하는 목업 UI입니다. 실제 파일 업로드와 저장은 서버 연동 단계에서 처리합니다.",
  slots = defaultPhotoSlots,
  optional = false,
  requiredFirst = false,
  requiredLabel = "필수 등록",
  accept = "image/*"
}: {
  title?: string;
  description?: string;
  slots?: string[];
  optional?: boolean;
  requiredFirst?: boolean;
  requiredLabel?: string;
  accept?: string;
}) {
  const uploadSlots = useImageUploadSlots({
    optional,
    requiredFirst,
    requiredLabel,
    slots
  });

  return (
    <section className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
          <h2 className="text-xl font-black text-ink">{title}</h2>
          {optional ? <span className="text-xs font-black text-muted">선택</span> : null}
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {uploadSlots.map((slot, index) => (
          <label
            className="group flex aspect-[4/3] cursor-pointer flex-col items-center justify-center border border-dashed border-line bg-white p-4 text-center transition hover:border-green"
            key={slot.id}
          >
            <input accept={accept} className="sr-only" type="file" />
            <span className="grid h-10 w-10 place-items-center border border-line text-lg font-black text-forest group-hover:border-green">
              {index + 1}
            </span>
            <span className="mt-3 text-sm font-black text-ink">{slot.label}</span>
            <span className="mt-1 text-xs font-bold text-muted">{slot.helperText}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { uploadImageToS3 } from "@/features/uploads/api/uploadImageToS3";
import { createUploadId, defaultImageAccept, validateImageFile } from "@/features/uploads/utils/imageFiles";
import { createCenter, listMyCenters, updateCenter } from "@/shared/api/centersClient";
import { deleteMediaFile, getMediaDisplayUrl, listMediaFiles } from "@/shared/api/mediaClient";
import type { CenterCreate, CenterRead, MediaFileResponse } from "@/shared/api/serverTypes";
import { RegionSelect } from "@/shared/components/forms/RegionSelect";
import { Container } from "@/shared/components/ui/Container";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

type PendingImage = {
  id: string;
  file: File;
  previewUrl: string;
};

type CenterFormState = {
  name: string;
  sido: string;
  sigungu: string;
  detailAddress: string;
  industry: string;
  operationType: string;
  homepageUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  introduction: string;
};

const industryOptions = [
  { label: "헬스/PT", value: "health_pt" },
  { label: "필라테스", value: "pilates" },
  { label: "요가", value: "yoga" },
  { label: "크로스핏", value: "crossfit" },
  { label: "재활/교정", value: "rehab" },
  { label: "복합 센터", value: "mixed" },
  { label: "기타", value: "etc" }
];

const emptyForm: CenterFormState = {
  name: "",
  sido: "",
  sigungu: "",
  detailAddress: "",
  industry: "health_pt",
  operationType: "",
  homepageUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  introduction: ""
};

export function GymRegisterPage() {
  useDocumentTitle("센터 등록");
  const [center, setCenter] = useState<CenterRead | null>(null);
  const [form, setForm] = useState<CenterFormState>(emptyForm);
  const [mediaFiles, setMediaFiles] = useState<MediaFileResponse[]>([]);
  const [representativeImage, setRepresentativeImage] = useState<PendingImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<PendingImage[]>([]);
  const [deletedMediaIds, setDeletedMediaIds] = useState<Set<string>>(() => new Set());
  const [loadStatus, setLoadStatus] = useState<"loading" | "ready" | "error">("loading");
  const [isEditing, setIsEditing] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [notice, setNotice] = useState("");
  const pendingImagesRef = useRef<{ representativeImage: PendingImage | null; galleryImages: PendingImage[] }>({
    representativeImage: null,
    galleryImages: []
  });

  useEffect(() => {
    let isMounted = true;

    listMyCenters({ page: 1, size: 1 })
      .then(async (page) => {
        if (!isMounted) {
          return;
        }

        const myCenter = page.items[0] ?? null;
        setCenter(myCenter);

        if (!myCenter) {
          setForm(emptyForm);
          setMediaFiles([]);
          setIsEditing(true);
          setLoadStatus("ready");
          return;
        }

        setForm(toFormState(myCenter));
        setIsEditing(false);

        try {
          const nextMediaFiles = await listMediaFiles({
            entity_type: "center",
            entity_id: myCenter.id
          });
          if (isMounted) {
            setMediaFiles(nextMediaFiles);
          }
        } catch {
          if (isMounted) {
            setMediaFiles([]);
          }
        }

        if (isMounted) {
          setLoadStatus("ready");
        }
      })
      .catch((error: Error) => {
        if (!isMounted) {
          return;
        }

        setNotice(error.message);
        setLoadStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    pendingImagesRef.current = { representativeImage, galleryImages };
  }, [galleryImages, representativeImage]);

  useEffect(() => {
    return () => {
      clearPendingImages(pendingImagesRef.current.representativeImage, pendingImagesRef.current.galleryImages);
    };
  }, []);

  const existingRepresentativeImage = useMemo(
    () => mediaFiles.find((item) => item.purpose === "representative" && !deletedMediaIds.has(item.id)),
    [deletedMediaIds, mediaFiles]
  );
  const existingGalleryImages = useMemo(
    () => mediaFiles.filter((item) => item.purpose === "gallery" && !deletedMediaIds.has(item.id)),
    [deletedMediaIds, mediaFiles]
  );
  const readinessChecks = useMemo(
    () => [
      { label: "대표 사진", ready: Boolean(representativeImage || existingRepresentativeImage) },
      { label: "센터명", ready: Boolean(form.name.trim()) },
      { label: "지역", ready: Boolean(form.sido.trim() && form.sigungu.trim()) },
      { label: "상세주소", ready: Boolean(form.detailAddress.trim()) },
      { label: "업종", ready: Boolean(form.industry.trim()) }
    ],
    [existingRepresentativeImage, form.detailAddress, form.industry, form.name, form.sido, form.sigungu, representativeImage]
  );
  const canSave = readinessChecks.every((check) => check.ready);
  const representativeImageUrl = getMediaDisplayUrl(existingRepresentativeImage);

  const handleFieldChange =
    (field: keyof Omit<CenterFormState, "sido" | "sigungu">) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setSaveStatus("idle");
    };

  const handleRegionChange = (value: { sido: string; sigungu: string }) => {
    setForm((current) => ({ ...current, sido: value.sido, sigungu: value.sigungu }));
    setSaveStatus("idle");
  };

  const handleRepresentativeImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const validationError = validateImageFile(file, 8);
    if (validationError) {
      setNotice(validationError);
      return;
    }

    setRepresentativeImage((current) => {
      if (current) {
        URL.revokeObjectURL(current.previewUrl);
      }
      return {
        id: createUploadId(),
        file,
        previewUrl: URL.createObjectURL(file)
      };
    });
    setSaveStatus("idle");
    setNotice("대표 사진이 선택되었습니다. 저장 버튼을 누르면 업로드됩니다.");
  };

  const handleGalleryImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const validImages: PendingImage[] = [];
    for (const file of files) {
      const validationError = validateImageFile(file, 8);
      if (validationError) {
        setNotice(validationError);
        continue;
      }

      validImages.push({
        id: createUploadId(),
        file,
        previewUrl: URL.createObjectURL(file)
      });
    }

    if (validImages.length > 0) {
      setGalleryImages((current) => [...current, ...validImages].slice(0, 4));
      setSaveStatus("idle");
      setNotice("센터 사진이 선택되었습니다. 저장 버튼을 누르면 업로드됩니다.");
    }
  };

  const removeRepresentativeImage = () => {
    if (representativeImage) {
      URL.revokeObjectURL(representativeImage.previewUrl);
      setRepresentativeImage(null);
      setSaveStatus("idle");
      setNotice("선택한 대표 사진을 취소했습니다.");
      return;
    }

    if (existingRepresentativeImage) {
      markMediaForDeletion(existingRepresentativeImage.id);
    }
  };

  const removePendingGalleryImage = (imageId: string) => {
    setGalleryImages((current) => {
      const target = current.find((image) => image.id === imageId);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((image) => image.id !== imageId);
    });
    setSaveStatus("idle");
  };

  const markMediaForDeletion = (mediaFileId: string) => {
    setDeletedMediaIds((current) => new Set(current).add(mediaFileId));
    setSaveStatus("idle");
    setNotice("삭제할 사진이 표시되었습니다. 저장 버튼을 누르면 반영됩니다.");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isEditing) {
      return;
    }

    if (!canSave) {
      setNotice("대표 사진, 센터명, 지역, 상세주소, 업종을 입력해 주세요.");
      return;
    }

    setSaveStatus("saving");
    setNotice("");

    let savedCenter: CenterRead | null = null;
    try {
      const payload = toCenterPayload(form);
      const nextCenter = center ? await updateCenter(center.id, payload) : await createCenter(payload);
      savedCenter = nextCenter;
      setCenter(nextCenter);
      setForm(toFormState(nextCenter));

      const mediaIdsToDelete = Array.from(deletedMediaIds);
      if (mediaIdsToDelete.length > 0) {
        await Promise.all(mediaIdsToDelete.map((mediaFileId) => deleteMediaFile(mediaFileId)));
      }

      if (representativeImage) {
        if (existingRepresentativeImage && !deletedMediaIds.has(existingRepresentativeImage.id)) {
          await deleteMediaFile(existingRepresentativeImage.id);
        }

        await uploadImageToS3({
          entityId: nextCenter.id,
          entityType: "center",
          file: representativeImage.file,
          purpose: "representative",
          sortOrder: 0
        });
      }

      await Promise.all(
        galleryImages.map((image, index) =>
          uploadImageToS3({
            entityId: nextCenter.id,
            entityType: "center",
            file: image.file,
            purpose: "gallery",
            sortOrder: existingGalleryImages.length + index
          })
        )
      );

      const refreshedMediaFiles = await listMediaFiles({
        entity_type: "center",
        entity_id: nextCenter.id
      });

      setCenter(nextCenter);
      setForm(toFormState(nextCenter));
      setMediaFiles(refreshedMediaFiles);
      clearPendingImages(representativeImage, galleryImages);
      setRepresentativeImage(null);
      setGalleryImages([]);
      setDeletedMediaIds(new Set());
      setIsEditing(false);
      setSaveStatus("saved");
      setNotice("센터 정보가 저장되었습니다.");
    } catch (error) {
      setSaveStatus("error");
      const message = error instanceof Error ? error.message : "센터 정보 저장에 실패했습니다.";
      setNotice(savedCenter ? `센터 정보는 저장되었지만 이미지 반영에 실패했습니다. ${message}` : message);
    }
  };

  if (loadStatus === "loading") {
    return (
      <Container className="py-12">
        <section className="border-y border-line py-10">
          <h1 className="text-3xl font-black tracking-tight text-ink">센터 정보를 불러오는 중입니다</h1>
        </section>
      </Container>
    );
  }

  if (loadStatus === "error") {
    return (
      <Container className="py-12">
        <section className="border-y border-line py-10">
          <h1 className="text-3xl font-black tracking-tight text-ink">센터 등록 화면을 불러오지 못했습니다</h1>
          <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-muted">{notice}</p>
        </section>
      </Container>
    );
  }

  return (
    <Container className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form className="space-y-8" onSubmit={handleSubmit}>
        <CenterFormActions
          center={center}
          isEditing={isEditing}
          notice={notice}
          onEdit={() => {
            setIsEditing(true);
            setSaveStatus("idle");
          }}
          saveStatus={saveStatus}
        />

        <section className="space-y-4">
          <SectionTitle title="대표 사진" />
          <div className="grid gap-4 md:grid-cols-[260px_1fr]">
            <div className="relative overflow-hidden border border-line bg-paper">
              {representativeImage ? (
                <img alt="선택한 센터 대표 사진" className="h-56 w-full object-cover" src={representativeImage.previewUrl} />
              ) : representativeImageUrl ? (
                <img alt="현재 센터 대표 사진" className="h-56 w-full object-cover" src={representativeImageUrl} />
              ) : (
                <div className="grid h-56 place-items-center text-sm font-black text-muted">대표 사진 없음</div>
              )}
              {isEditing && (representativeImage || existingRepresentativeImage) ? (
                <button
                  className="absolute right-3 top-3 rounded-md bg-ink/85 px-3 py-2 text-xs font-black text-white"
                  onClick={removeRepresentativeImage}
                  type="button"
                >
                  {representativeImage ? "취소" : "삭제"}
                </button>
              ) : null}
            </div>
            <div className="flex flex-col justify-center gap-3">
              <label className={`inline-flex w-fit ${isEditing ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}>
                <span className="border border-line bg-white px-4 py-2 text-sm font-black text-ink">사진 선택</span>
                <input
                  accept={defaultImageAccept}
                  className="sr-only"
                  disabled={!isEditing}
                  onChange={handleRepresentativeImageChange}
                  type="file"
                />
              </label>
              <p className="text-xs font-bold leading-5 text-muted">jpg, png, webp · 8MB 이하</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle title="센터 사진" />
          <p className="text-sm leading-6 text-muted">운동 공간, 상담 공간, 샤워/탈의실 등 센터 상세에서 보여줄 사진을 선택 등록합니다.</p>
          <div className="grid gap-3 md:grid-cols-3">
            {existingGalleryImages.map((image) => (
              <ImagePreviewCard image={image} isEditing={isEditing} key={image.id} onRemove={markMediaForDeletion} />
            ))}
            {galleryImages.map((image) => (
              <PendingImageCard image={image} key={image.id} onRemove={removePendingGalleryImage} />
            ))}
            {isEditing ? (
              <label className="grid min-h-40 cursor-pointer place-items-center border border-dashed border-line bg-white p-4 text-center transition hover:border-green">
                <span className="text-sm font-black text-ink">사진 선택</span>
                <span className="mt-2 block text-xs font-bold text-muted">최대 4장 선택 가능</span>
                <input
                  accept={defaultImageAccept}
                  className="sr-only"
                  multiple
                  onChange={handleGalleryImagesChange}
                  type="file"
                />
              </label>
            ) : null}
          </div>
        </section>

        <SectionTitle title="기본 정보" />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField disabled={!isEditing} label="센터명" onChange={handleFieldChange("name")} placeholder="예: 피크바디짐 강남점" value={form.name} />
          <RegionSelect
            disabled={!isEditing}
            onChange={handleRegionChange}
            value={{ sido: form.sido, sigungu: form.sigungu }}
          />
          <TextField disabled={!isEditing} label="상세주소" onChange={handleFieldChange("detailAddress")} placeholder="예: 테헤란로 118, 지하 1층" value={form.detailAddress} />
          <SelectField disabled={!isEditing} label="업종" onChange={handleFieldChange("industry")} options={industryOptions} value={form.industry} />
          <TextField disabled={!isEditing} label="운영형태" onChange={handleFieldChange("operationType")} placeholder="예: 1:1 PT 중심, 기구 필라테스 6:1 그룹수업" value={form.operationType} />
        </div>

        <SectionTitle title="외부 채널" />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField disabled={!isEditing} label="홈페이지" onChange={handleFieldChange("homepageUrl")} placeholder="예: https://peakbody.kr" value={form.homepageUrl} />
          <TextField disabled={!isEditing} label="인스타그램" onChange={handleFieldChange("instagramUrl")} placeholder="예: https://instagram.com/peakbody" value={form.instagramUrl} />
          <TextField disabled={!isEditing} label="유튜브 채널" onChange={handleFieldChange("youtubeUrl")} placeholder="예: https://youtube.com/@peakbody" value={form.youtubeUrl} />
        </div>

        <SectionTitle title="업장 소개" />
        <TextField
          disabled={!isEditing}
          label="업장 소개"
          onChange={handleFieldChange("introduction")}
          placeholder="센터의 분위기, 주요 수업, 공간 특징처럼 자주 바뀌지 않는 기본 소개를 적어주세요."
          textarea
          value={form.introduction}
        />

        <CenterFormActions
          center={center}
          isEditing={isEditing}
          notice=""
          onEdit={() => {
            setIsEditing(true);
            setSaveStatus("idle");
          }}
          placement="bottom"
          saveStatus={saveStatus}
        />
      </form>

      <div className="space-y-8 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
        <aside className="border-t border-line pt-5">
          <h2 className="text-xl font-black text-ink">등록 조건</h2>
          <p className="mt-4 text-sm leading-6 text-muted">저장은 한 번에 반영됩니다. 사진과 내용을 모두 정리한 뒤 저장하세요.</p>
          <div className="mt-5 space-y-2">
            {readinessChecks.map((item) => (
              <div className="flex items-center justify-between border-b border-line py-2" key={item.label}>
                <span className="text-sm font-bold text-muted">{item.label}</span>
                <span className={`text-xs font-black ${item.ready ? "text-forest" : "text-amber-800"}`}>
                  {item.ready ? "완료" : "필요"}
                </span>
              </div>
            ))}
          </div>
        </aside>
        <aside className="border-t border-line pt-5 text-sm leading-6 text-muted">
          <h2 className="text-lg font-black text-ink">구인글 연결</h2>
          <p className="mt-3">센터를 저장하면 구인글 등록 시 이 센터 정보를 기준으로 공고와 지원자 관리가 연결됩니다.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <PrimaryLink to="/owner" variant="light">
              사업장 관리
            </PrimaryLink>
            <PrimaryLink to="/jobs/hiring/new" variant="light">
              구인글 등록
            </PrimaryLink>
          </div>
        </aside>
      </div>
    </Container>
  );
}

function CenterFormActions({
  center,
  isEditing,
  notice,
  onEdit,
  placement = "top",
  saveStatus
}: {
  center: CenterRead | null;
  isEditing: boolean;
  notice: string;
  onEdit: () => void;
  placement?: "top" | "bottom";
  saveStatus: "idle" | "saving" | "saved" | "error";
}) {
  return (
    <section className={placement === "top" ? "border-b border-line pb-5" : "border-t border-line pt-6"}>
      <div className="flex justify-end gap-2">
        {center && !isEditing ? (
          <button
            className="rounded-md border border-line bg-white px-5 py-3 text-sm font-black text-ink transition hover:border-green"
            onClick={onEdit}
            type="button"
          >
            수정
          </button>
        ) : null}
        {isEditing ? (
          <button
            className="rounded-md bg-ink px-5 py-3 text-sm font-black text-white transition hover:bg-forest disabled:opacity-60"
            disabled={saveStatus === "saving"}
            type="submit"
          >
            {saveStatus === "saving" ? "저장 중" : "저장"}
          </button>
        ) : null}
      </div>
      {notice ? <p className="mt-3 border-l-2 border-green pl-3 text-sm font-bold text-muted">{notice}</p> : null}
    </section>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="border-b border-line pb-3 text-xl font-black text-ink">{title}</h2>;
}

function TextField({
  disabled,
  label,
  onChange,
  placeholder,
  textarea = false,
  value
}: {
  disabled: boolean;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  textarea?: boolean;
  value: string;
}) {
  const className =
    "mt-2 w-full border border-line bg-white px-3 text-sm outline-none transition focus:border-green disabled:bg-paper disabled:text-muted";

  return (
    <label className="block">
      <span className="text-sm font-black text-ink">{label}</span>
      {textarea ? (
        <textarea className={`${className} min-h-32 py-3`} disabled={disabled} onChange={onChange} placeholder={placeholder} value={value} />
      ) : (
        <input className={`${className} h-11`} disabled={disabled} onChange={onChange} placeholder={placeholder} type="text" value={value} />
      )}
    </label>
  );
}

function SelectField({
  disabled,
  label,
  onChange,
  options,
  value
}: {
  disabled: boolean;
  label: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-ink">{label}</span>
      <select
        className="mt-2 h-11 w-full border border-line bg-white px-3 text-sm outline-none transition focus:border-green disabled:bg-paper disabled:text-muted"
        disabled={disabled}
        onChange={onChange}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function PendingImageCard({ image, onRemove }: { image: PendingImage; onRemove: (imageId: string) => void }) {
  return (
    <div className="relative min-h-40 overflow-hidden border border-line bg-paper">
      <img alt="선택한 센터 사진" className="h-40 w-full object-cover" src={image.previewUrl} />
      <button
        className="absolute right-2 top-2 rounded-md bg-ink/85 px-2 py-1 text-xs font-black text-white"
        onClick={() => onRemove(image.id)}
        type="button"
      >
        취소
      </button>
    </div>
  );
}

function ImagePreviewCard({
  image,
  isEditing,
  onRemove
}: {
  image: MediaFileResponse;
  isEditing: boolean;
  onRemove: (mediaFileId: string) => void;
}) {
  const imageUrl = getMediaDisplayUrl(image);

  return (
    <div className="relative min-h-40 overflow-hidden border border-line bg-paper">
      {imageUrl ? (
        <img alt="등록된 센터 사진" className="h-40 w-full object-cover" src={imageUrl} />
      ) : (
        <div className="grid h-40 place-items-center text-sm font-black text-muted">이미지 준비 중</div>
      )}
      {isEditing ? (
        <button
          className="absolute right-2 top-2 rounded-md bg-ink/85 px-2 py-1 text-xs font-black text-white"
          onClick={() => onRemove(image.id)}
          type="button"
        >
          삭제
        </button>
      ) : null}
    </div>
  );
}

function toFormState(center: CenterRead): CenterFormState {
  return {
    name: center.name,
    sido: center.sido,
    sigungu: center.sigungu,
    detailAddress: center.detail_address,
    industry: center.industry,
    operationType: center.operation_type ?? "",
    homepageUrl: center.homepage_url ?? "",
    instagramUrl: center.instagram_url ?? "",
    youtubeUrl: center.youtube_url ?? "",
    introduction: center.introduction ?? ""
  };
}

function toCenterPayload(form: CenterFormState): CenterCreate {
  return {
    name: form.name.trim(),
    sido: form.sido.trim(),
    sigungu: form.sigungu.trim(),
    detail_address: form.detailAddress.trim(),
    industry: form.industry,
    operation_type: trimOptional(form.operationType),
    homepage_url: trimOptional(form.homepageUrl),
    instagram_url: trimOptional(form.instagramUrl),
    youtube_url: trimOptional(form.youtubeUrl),
    introduction: trimOptional(form.introduction)
  };
}

function trimOptional(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function clearPendingImages(representativeImage: PendingImage | null, galleryImages: PendingImage[]) {
  if (representativeImage) {
    URL.revokeObjectURL(representativeImage.previewUrl);
  }

  galleryImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
}

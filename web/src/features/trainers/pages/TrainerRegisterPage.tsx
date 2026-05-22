"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";

import { uploadImageToS3 } from "@/features/uploads/api/uploadImageToS3";
import { useDeferredImageList, useDeferredSingleImage, type DeferredImage } from "@/features/uploads/hooks/useDeferredImages";
import { defaultImageAccept } from "@/features/uploads/utils/imageFiles";
import { RegionSelect } from "@/shared/components/forms/RegionSelect";
import { Container } from "@/shared/components/ui/Container";
import { deleteMediaFile, getMediaDisplayUrl } from "@/shared/api/mediaClient";
import { getMyTrainerProfile, upsertMyTrainerProfile } from "@/shared/api/trainersClient";
import type { MediaFileResponse, TrainerProfileRead, TrainerProfileUpsert } from "@/shared/api/serverTypes";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { formatKoreanPhoneNumber, normalizePhoneDigits } from "@/shared/utils/phone";

type WorkExperienceForm = {
  id: string;
  centerName: string;
  periodText: string;
  roleDescription: string;
};

type CredentialForm = {
  id: string;
  title: string;
  issuedBy: string;
};

type PortfolioLinkForm = {
  id: string;
  label: string;
  url: string;
};

type TrainerFormState = {
  name: string;
  birthYear: string;
  gender: string;
  phone: string;
  residenceSido: string;
  residenceSigungu: string;
  desiredAreaText: string;
  headline: string;
  experienceYears: string;
  specialtiesText: string;
  workType: string;
  availability: string;
  summary: string;
  workExperiences: WorkExperienceForm[];
  credentials: CredentialForm[];
  portfolioLinks: PortfolioLinkForm[];
};

const emptyForm: TrainerFormState = {
  name: "",
  birthYear: "",
  gender: "",
  phone: "",
  residenceSido: "",
  residenceSigungu: "",
  desiredAreaText: "",
  headline: "",
  experienceYears: "",
  specialtiesText: "",
  workType: "",
  availability: "",
  summary: "",
  workExperiences: [createWorkExperience()],
  credentials: [createCredential()],
  portfolioLinks: [createPortfolioLink(), createPortfolioLink()]
};

export function TrainerRegisterPage() {
  useDocumentTitle("트레이너 정보 등록");
  const [form, setForm] = useState<TrainerFormState>(emptyForm);
  const [profile, setProfile] = useState<TrainerProfileRead | null>(null);
  const [loadStatus, setLoadStatus] = useState<"loading" | "ready" | "error">("loading");
  const [isEditing, setIsEditing] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [notice, setNotice] = useState("");
  const [deletedMediaIds, setDeletedMediaIds] = useState<Set<string>>(() => new Set());
  const {
    clearImage: clearProfileImage,
    image: profileImage,
    setFile: setProfileImageFile
  } = useDeferredSingleImage();
  const {
    addFiles: addPortfolioImages,
    clearImages: clearPortfolioImages,
    images: portfolioImages,
    removeImage: removeSelectedPortfolioImage
  } = useDeferredImageList({ maxImages: 5 });

  useEffect(() => {
    let isMounted = true;

    getMyTrainerProfile()
      .then((nextProfile) => {
        if (!isMounted) {
          return;
        }

        setProfile(nextProfile);
        setForm(toFormState(nextProfile));
        setDeletedMediaIds(new Set());
        setIsEditing(false);
        setLoadStatus("ready");
      })
      .catch((error: Error) => {
        if (!isMounted) {
          return;
        }

        if (error.message.includes("찾을 수 없습니다")) {
          setProfile(null);
          setForm(emptyForm);
          setDeletedMediaIds(new Set());
          setIsEditing(true);
          setLoadStatus("ready");
          return;
        }

        setNotice(error.message);
        setLoadStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const existingProfileImage = useMemo(
    () => profile?.media.find((item) => item.purpose === "profile" && !deletedMediaIds.has(item.id)),
    [deletedMediaIds, profile]
  );
  const existingPortfolioImages = useMemo(
    () =>
      profile?.media.filter(
        (item) => (item.purpose === "portfolio" || item.purpose === "gallery") && !deletedMediaIds.has(item.id)
      ) ?? [],
    [deletedMediaIds, profile]
  );
  const readinessChecks = useMemo(
    () => [
      { label: "대표 프로필 사진", ready: Boolean(profileImage || existingProfileImage) },
      { label: "이름", ready: Boolean(form.name.trim()) },
      { label: "출생년도", ready: Boolean(parseOptionalNumber(form.birthYear)) },
      { label: "성별", ready: Boolean(form.gender) },
      { label: "연락처", ready: Boolean(normalizePhoneDigits(form.phone)) },
      { label: "거주지역", ready: Boolean(form.residenceSido.trim() && form.residenceSigungu.trim()) }
    ],
    [existingProfileImage, form.birthYear, form.gender, form.name, form.phone, form.residenceSido, form.residenceSigungu, profileImage]
  );
  const isReadyForApply = readinessChecks.every((check) => check.ready);
  const existingProfileUrl = getMediaDisplayUrl(existingProfileImage);

  const handleFieldChange =
    (field: keyof Omit<TrainerFormState, "workExperiences" | "credentials" | "portfolioLinks">) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setSaveStatus("idle");
    };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, phone: formatKoreanPhoneNumber(event.target.value) }));
    setSaveStatus("idle");
  };

  const handleRegionChange = (value: { sido: string; sigungu: string }) => {
    setForm((current) => ({ ...current, residenceSido: value.sido, residenceSigungu: value.sigungu }));
    setSaveStatus("idle");
  };

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const result = setProfileImageFile(file);
    if (!result.ok) {
      setNotice(result.message);
      return;
    }

    setSaveStatus("idle");
    setNotice("대표 사진이 선택되었습니다. 저장 버튼을 누르면 업로드됩니다.");
  };

  const handlePortfolioImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const result = addPortfolioImages(files);
    if (result.ok) {
      setSaveStatus("idle");
      setNotice(result.message || "운동 사진이 선택되었습니다. 저장 버튼을 누르면 업로드됩니다.");
      return;
    }

    setNotice(result.message);
  };

  const removeProfileImage = () => {
    if (profileImage) {
      clearProfileImage();
      setSaveStatus("idle");
      setNotice("선택한 대표 사진을 취소했습니다.");
      return;
    }

    if (existingProfileImage) {
      markMediaForDeletion(existingProfileImage.id);
    }
  };

  const removePortfolioImage = (imageId: string) => {
    removeSelectedPortfolioImage(imageId);
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

    setSaveStatus("saving");
    setNotice("");

    try {
      const shouldDeferReadyUntilImageUpload = Boolean(profileImage && !existingProfileImage && isReadyForApply);
      const savedProfile = await upsertMyTrainerProfile(
        toUpsertPayload(form, isReadyForApply && !shouldDeferReadyUntilImageUpload)
      );

      const mediaIdsToDelete = Array.from(deletedMediaIds);
      if (mediaIdsToDelete.length > 0) {
        await Promise.all(mediaIdsToDelete.map((mediaFileId) => deleteMediaFile(mediaFileId)));
      }

      if (profileImage) {
        await uploadImageToS3({
          entityId: savedProfile.id,
          entityType: "trainer_profile",
          file: profileImage.file,
          purpose: "profile",
          sortOrder: 0
        });
      }

      await Promise.all(
        portfolioImages.map((image, index) =>
          uploadImageToS3({
            entityId: savedProfile.id,
            entityType: "trainer_profile",
            file: image.file,
            purpose: "portfolio",
            sortOrder: existingPortfolioImages.length + index
          })
        )
      );

      if (shouldDeferReadyUntilImageUpload) {
        await upsertMyTrainerProfile(toUpsertPayload(form, true));
      }

      const refreshedProfile = await getMyTrainerProfile();
      setProfile(refreshedProfile);
      setForm(toFormState(refreshedProfile));
      clearProfileImage();
      clearPortfolioImages();
      setDeletedMediaIds(new Set());
      setIsEditing(false);
      setSaveStatus("saved");
      setNotice("프로필이 저장되었습니다.");
    } catch (error) {
      setSaveStatus("error");
      setNotice(error instanceof Error ? error.message : "프로필 저장에 실패했습니다.");
    }
  };

  if (loadStatus === "loading") {
    return (
      <Container className="py-12">
        <section className="border-y border-line py-10">
          <h1 className="text-3xl font-black tracking-tight text-ink">트레이너 프로필을 불러오는 중입니다</h1>
        </section>
      </Container>
    );
  }

  if (loadStatus === "error") {
    return (
      <Container className="py-12">
        <section className="border-y border-line py-10">
          <h1 className="text-3xl font-black tracking-tight text-ink">프로필 편집 화면을 불러오지 못했습니다</h1>
          <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-muted">{notice}</p>
        </section>
      </Container>
    );
  }

  return (
    <Container className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form className="space-y-8" onSubmit={handleSubmit}>
        <ProfileFormActions
          isEditing={isEditing}
          notice={notice}
          onEdit={() => {
            setIsEditing(true);
            setSaveStatus("idle");
          }}
          profile={profile}
          saveStatus={saveStatus}
        />

        <section className="space-y-4">
          <SectionTitle title="대표 프로필 사진" />
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <div className="relative overflow-hidden border border-line bg-paper">
              {profileImage ? (
                <img alt="선택한 대표 프로필 사진" className="h-72 w-full object-contain" src={profileImage.previewUrl} />
              ) : existingProfileUrl ? (
                <img alt="현재 대표 프로필 사진" className="h-72 w-full object-contain" src={existingProfileUrl} />
              ) : (
                <div className="grid h-72 place-items-center text-sm font-black text-muted">대표 사진 없음</div>
              )}
              {isEditing && (profileImage || existingProfileImage) ? (
                <button
                  className="absolute right-3 top-3 rounded-md bg-ink/85 px-3 py-2 text-xs font-black text-white"
                  onClick={removeProfileImage}
                  type="button"
                >
                  {profileImage ? "취소" : "삭제"}
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
                  onChange={handleProfileImageChange}
                  type="file"
                />
              </label>
              <p className="text-xs font-bold leading-5 text-muted">jpg, png, webp · 8MB 이하</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle title="운동 사진" />
          <p className="text-sm leading-6 text-muted">
            전신, 운동 사진, 바디프로필, 회원 수업 장면 등 포트폴리오 사진을 선택 등록합니다.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {existingPortfolioImages.map((image) => (
              <ImagePreviewCard image={image} isEditing={isEditing} key={image.id} onRemove={markMediaForDeletion} />
            ))}
            {portfolioImages.map((image) => (
              <PendingImageCard image={image} key={image.id} onRemove={removePortfolioImage} />
            ))}
            {isEditing ? (
              <label className="grid min-h-40 cursor-pointer place-items-center border border-dashed border-line bg-white p-4 text-center transition hover:border-green">
                <span className="text-sm font-black text-ink">사진 선택</span>
                <span className="mt-2 block text-xs font-bold text-muted">최대 5장 선택 가능</span>
                <input
                  accept={defaultImageAccept}
                  className="sr-only"
                  multiple
                  onChange={handlePortfolioImagesChange}
                  type="file"
                />
              </label>
            ) : null}
          </div>
        </section>

        <SectionTitle title="지원 시 필요한 기본 정보" />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField disabled={!isEditing} label="이름 (지원 필수)" onChange={handleFieldChange("name")} placeholder="예: 김민준" value={form.name} />
          <TextField disabled={!isEditing} label="출생년도 (지원 필수)" onChange={handleFieldChange("birthYear")} placeholder="예: 1997" type="number" value={form.birthYear} />
          <SelectField disabled={!isEditing} label="성별 (지원 필수)" onChange={handleFieldChange("gender")} value={form.gender} />
          <TextField disabled={!isEditing} label="연락처 (지원 필수)" onChange={handlePhoneChange} placeholder="예: 010-1234-5678" value={form.phone} />
          <RegionSelect
            disabled={!isEditing}
            onChange={handleRegionChange}
            required
            value={{ sido: form.residenceSido, sigungu: form.residenceSigungu }}
          />
        </div>

        <SectionTitle title="추가 프로필 정보" />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField disabled={!isEditing} label="희망 활동 지역" onChange={handleFieldChange("desiredAreaText")} placeholder="예: 서울 강남 · 서초" value={form.desiredAreaText} />
          <TextField disabled={!isEditing} label="총 경력" onChange={handleFieldChange("experienceYears")} placeholder="예: 5" type="number" value={form.experienceYears} />
          <TextField disabled={!isEditing} label="전문 분야" onChange={handleFieldChange("specialtiesText")} placeholder="예: 재활 PT, 바디프로필" value={form.specialtiesText} />
          <TextField disabled={!isEditing} label="근무 형태" onChange={handleFieldChange("workType")} placeholder="예: 프리랜서, 파트타임, 정규직" value={form.workType} />
          <TextField disabled={!isEditing} label="가능 시간" onChange={handleFieldChange("availability")} placeholder="예: 평일 저녁, 주말" value={form.availability} />
          <TextField disabled={!isEditing} label="한 줄 소개" onChange={handleFieldChange("headline")} placeholder="예: 재활과 체형 교정에 강한 트레이너" value={form.headline} />
        </div>

        <SectionTitle title="경력 및 이력" />
        <div className="space-y-3">
          {form.workExperiences.map((row, index) => (
            <CareerRow disabled={!isEditing} index={index + 1} key={row.id} row={row} setForm={setForm} />
          ))}
        </div>
        {isEditing ? <AddRowButton label="경력 및 이력 추가" onClick={() => setForm((current) => ({ ...current, workExperiences: [...current.workExperiences, createWorkExperience()] }))} /> : null}

        <SectionTitle title="자격증 또는 수상경력" />
        <div className="space-y-3">
          {form.credentials.map((row, index) => (
            <CredentialRow disabled={!isEditing} index={index + 1} key={row.id} row={row} setForm={setForm} />
          ))}
        </div>
        {isEditing ? <AddRowButton label="자격증 또는 수상경력 추가" onClick={() => setForm((current) => ({ ...current, credentials: [...current.credentials, createCredential()] }))} /> : null}

        <SectionTitle title="포트폴리오 링크" />
        <div className="space-y-3">
          {form.portfolioLinks.map((row, index) => (
            <PortfolioRow disabled={!isEditing} index={index + 1} key={row.id} row={row} setForm={setForm} />
          ))}
        </div>
        {isEditing ? <AddRowButton label="포트폴리오 링크 추가" onClick={() => setForm((current) => ({ ...current, portfolioLinks: [...current.portfolioLinks, createPortfolioLink()] }))} /> : null}

        <SectionTitle title="자기소개" />
        <TextField
          disabled={!isEditing}
          label="자기소개"
          onChange={handleFieldChange("summary")}
          placeholder="수업 스타일, 회원 관리 방식, 본인의 강점과 일하는 방식을 자유롭게 적어주세요."
          textarea
          value={form.summary}
        />

        <ProfileFormActions
          isEditing={isEditing}
          notice=""
          onEdit={() => {
            setIsEditing(true);
            setSaveStatus("idle");
          }}
          placement="bottom"
          profile={profile}
          saveStatus={saveStatus}
        />
      </form>

      <div className="space-y-8 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
        <aside className="border-t border-line pt-5">
          <h2 className="text-xl font-black text-ink">지원 가능 조건</h2>
          <p className="mt-4 text-sm leading-6 text-muted">
            저장은 언제든 가능하고, 구인글 지원 시 아래 항목을 확인합니다.
          </p>
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
      </div>
    </Container>
  );
}

function ProfileFormActions({
  isEditing,
  notice,
  onEdit,
  placement = "top",
  profile,
  saveStatus
}: {
  isEditing: boolean;
  notice: string;
  onEdit: () => void;
  placement?: "top" | "bottom";
  profile: TrainerProfileRead | null;
  saveStatus: "idle" | "saving" | "saved" | "error";
}) {
  return (
    <section className={placement === "top" ? "border-b border-line pb-5" : "border-t border-line pt-6"}>
      <div className="flex justify-end gap-2">
        {profile && !isEditing ? (
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
  type = "text",
  value
}: {
  disabled: boolean;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  textarea?: boolean;
  type?: string;
  value: string;
}) {
  const className =
    "mt-2 w-full border border-line bg-white px-3 text-sm outline-none transition focus:border-green disabled:bg-paper disabled:text-muted";

  return (
    <label className="block">
      <span className="text-sm font-black text-ink">{label}</span>
      {textarea ? (
        <textarea className={`${className} min-h-28 py-3`} disabled={disabled} onChange={onChange} placeholder={placeholder} value={value} />
      ) : (
        <input className={`${className} h-11`} disabled={disabled} onChange={onChange} placeholder={placeholder} type={type} value={value} />
      )}
    </label>
  );
}

function SelectField({
  disabled,
  label,
  onChange,
  value
}: {
  disabled: boolean;
  label: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
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
        <option value="">선택</option>
        <option value="male">남성</option>
        <option value="female">여성</option>
        <option value="other">기타</option>
        <option value="undisclosed">비공개</option>
      </select>
    </label>
  );
}

function AddRowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="flex w-full items-center justify-center gap-3 border border-dashed border-line bg-white px-4 py-3 text-sm font-black text-muted transition hover:border-green hover:text-forest"
      onClick={onClick}
      type="button"
    >
      <span className="h-px flex-1 bg-line" />
      <span>+ {label}</span>
      <span className="h-px flex-1 bg-line" />
    </button>
  );
}

function CareerRow({
  disabled,
  index,
  row,
  setForm
}: {
  disabled: boolean;
  index: number;
  row: WorkExperienceForm;
  setForm: Dispatch<SetStateAction<TrainerFormState>>;
}) {
  const changeRow = (field: keyof WorkExperienceForm) => (event: ChangeEvent<HTMLInputElement>) => {
    updateWorkExperience(setForm, row.id, field, event.target.value);
  };

  return (
    <div className="grid gap-3 border-b border-line py-3 md:grid-cols-[80px_1fr_1fr_1.4fr] md:items-center">
      <span className="text-sm font-black text-muted">이력 {index}</span>
      <input className={rowInputClassName} disabled={disabled} onChange={changeRow("centerName")} placeholder="근무했던 헬스장/센터" value={row.centerName} />
      <input className={rowInputClassName} disabled={disabled} onChange={changeRow("periodText")} placeholder="근무 기간" value={row.periodText} />
      <input className={rowInputClassName} disabled={disabled} onChange={changeRow("roleDescription")} placeholder="담당 업무" value={row.roleDescription} />
    </div>
  );
}

function CredentialRow({
  disabled,
  index,
  row,
  setForm
}: {
  disabled: boolean;
  index: number;
  row: CredentialForm;
  setForm: Dispatch<SetStateAction<TrainerFormState>>;
}) {
  const changeRow = (field: keyof CredentialForm) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({
      ...current,
      credentials: current.credentials.map((item) => (item.id === row.id ? { ...item, [field]: event.target.value } : item))
    }));
  };

  return (
    <div className="grid gap-3 border-b border-line py-3 md:grid-cols-[110px_1fr_1fr] md:items-center">
      <span className="text-sm font-black text-muted">자격/수상 {index}</span>
      <input className={rowInputClassName} disabled={disabled} onChange={changeRow("title")} placeholder="예: 생활스포츠지도사 2급" value={row.title} />
      <input className={rowInputClassName} disabled={disabled} onChange={changeRow("issuedBy")} placeholder="발급/주최 기관" value={row.issuedBy} />
    </div>
  );
}

function PortfolioRow({
  disabled,
  index,
  row,
  setForm
}: {
  disabled: boolean;
  index: number;
  row: PortfolioLinkForm;
  setForm: Dispatch<SetStateAction<TrainerFormState>>;
}) {
  const changeRow = (field: keyof PortfolioLinkForm) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({
      ...current,
      portfolioLinks: current.portfolioLinks.map((item) => (item.id === row.id ? { ...item, [field]: event.target.value } : item))
    }));
  };

  return (
    <div className="grid gap-3 border-b border-line py-3 md:grid-cols-[110px_180px_1fr] md:items-center">
      <span className="text-sm font-black text-muted">링크 {index}</span>
      <input className={rowInputClassName} disabled={disabled} onChange={changeRow("label")} placeholder="예: Instagram" value={row.label} />
      <input className={rowInputClassName} disabled={disabled} onChange={changeRow("url")} placeholder="예: instagram.com/trainer" value={row.url} />
    </div>
  );
}

function PendingImageCard({ image, onRemove }: { image: DeferredImage; onRemove: (imageId: string) => void }) {
  return (
    <figure className="relative overflow-hidden border border-line bg-white">
      <img alt="선택한 운동 사진" className="h-40 w-full object-cover" src={image.previewUrl} />
      <span className="absolute inset-x-0 bottom-0 bg-ink/80 px-3 py-2 text-xs font-black text-white">저장 대기</span>
      <button
        className="absolute right-2 top-2 rounded-md bg-white px-2 py-1 text-xs font-black text-ink shadow-sm"
        onClick={() => onRemove(image.id)}
        type="button"
      >
        취소
      </button>
    </figure>
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
  const url = getMediaDisplayUrl(image);

  return (
    <figure className="relative overflow-hidden border border-line bg-white">
      {url ? <img alt="등록된 운동 사진" className="h-40 w-full object-cover" src={url} /> : null}
      {isEditing ? (
        <button
          className="absolute right-2 top-2 rounded-md bg-white px-2 py-1 text-xs font-black text-ink shadow-sm"
          onClick={() => onRemove(image.id)}
          type="button"
        >
          삭제
        </button>
      ) : null}
    </figure>
  );
}

const rowInputClassName =
  "h-11 w-full border border-line bg-white px-3 text-sm outline-none transition focus:border-green disabled:bg-paper disabled:text-muted";

function toFormState(profile: TrainerProfileRead): TrainerFormState {
  return {
    name: profile.name ?? "",
    birthYear: profile.birth_year?.toString() ?? "",
    gender: profile.gender ?? "",
    phone: profile.phone ? formatKoreanPhoneNumber(profile.phone) : "",
    residenceSido: profile.residence_sido ?? "",
    residenceSigungu: profile.residence_sigungu ?? "",
    desiredAreaText: profile.desired_area_text ?? "",
    headline: profile.headline ?? "",
    experienceYears: profile.experience_years?.toString() ?? "",
    specialtiesText: profile.specialties.map((item) => item.name).join(", "),
    workType: profile.work_type ?? "",
    availability: profile.availability ?? "",
    summary: profile.summary ?? "",
    workExperiences:
      profile.work_experiences.length > 0
        ? profile.work_experiences.map((item) => ({
            id: item.id,
            centerName: item.center_name,
            periodText: item.period_text ?? "",
            roleDescription: item.role_description
          }))
        : [createWorkExperience()],
    credentials:
      profile.credentials.length > 0
        ? profile.credentials.map((item) => ({
            id: item.id,
            title: item.title,
            issuedBy: item.issued_by ?? ""
          }))
        : [createCredential()],
    portfolioLinks:
      profile.portfolio_links.length > 0
        ? profile.portfolio_links.map((item) => ({
            id: item.id,
            label: item.label,
            url: item.url
          }))
        : [createPortfolioLink(), createPortfolioLink()]
  };
}

function toUpsertPayload(form: TrainerFormState, isReadyForApply: boolean): TrainerProfileUpsert {
  return {
    name: toNullableString(form.name),
    birth_year: parseOptionalNumber(form.birthYear),
    gender: toNullableString(form.gender),
    phone: toNullableString(normalizePhoneDigits(form.phone)),
    residence_sido: toNullableString(form.residenceSido),
    residence_sigungu: toNullableString(form.residenceSigungu),
    desired_area_text: toNullableString(form.desiredAreaText),
    headline: toNullableString(form.headline),
    experience_years: parseOptionalNumber(form.experienceYears),
    work_type: toNullableString(form.workType),
    availability: toNullableString(form.availability),
    summary: toNullableString(form.summary),
    profile_status: isReadyForApply ? "ready" : "draft",
    specialties: splitList(form.specialtiesText).map((name, index) => ({ name, sort_order: index })),
    work_experiences: form.workExperiences
      .filter((item) => item.centerName.trim() || item.periodText.trim() || item.roleDescription.trim())
      .map((item, index) => ({
        center_name: item.centerName.trim() || "근무처 미입력",
        start_date: null,
        end_date: null,
        period_text: toNullableString(item.periodText),
        role_description: item.roleDescription.trim() || "담당 업무 미입력",
        sort_order: index
      })),
    credentials: form.credentials
      .filter((item) => item.title.trim() || item.issuedBy.trim())
      .map((item, index) => ({
        credential_type: "certificate",
        title: item.title.trim() || "자격/수상명 미입력",
        issued_by: toNullableString(item.issuedBy),
        issued_at: null,
        sort_order: index
      })),
    portfolio_links: form.portfolioLinks
      .filter((item) => item.label.trim() || item.url.trim())
      .map((item, index) => ({
        label: item.label.trim() || "포트폴리오",
        url: item.url.trim(),
        sort_order: index
      }))
  };
}

function updateWorkExperience(
  setForm: Dispatch<SetStateAction<TrainerFormState>>,
  rowId: string,
  field: keyof WorkExperienceForm,
  value: string
) {
  setForm((current) => ({
    ...current,
    workExperiences: current.workExperiences.map((item) => (item.id === rowId ? { ...item, [field]: value } : item))
  }));
}

function createWorkExperience(): WorkExperienceForm {
  return {
    id: createLocalId(),
    centerName: "",
    periodText: "",
    roleDescription: ""
  };
}

function createCredential(): CredentialForm {
  return {
    id: createLocalId(),
    title: "",
    issuedBy: ""
  };
}

function createPortfolioLink(): PortfolioLinkForm {
  return {
    id: createLocalId(),
    label: "",
    url: ""
  };
}

function createLocalId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseOptionalNumber(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toNullableString(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

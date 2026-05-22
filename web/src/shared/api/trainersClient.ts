import { apiGet, apiPost, apiPut } from "@/shared/api/httpClient";
import { getMediaDisplayUrl } from "@/shared/api/mediaClient";
import type { TrainerProfileCreate, TrainerProfileRead, TrainerProfileUpsert } from "@/shared/api/serverTypes";
import type { Page } from "@/shared/api/types";
import type { Trainer } from "@/shared/types/domain";
import { formatKoreanPhoneNumber } from "@/shared/utils/phone";

export function listTrainerProfiles(params: { page?: number; size?: number } = {}) {
  return apiGet<Page<TrainerProfileRead>>("/trainers", params);
}

export function getTrainerProfile(trainerId: string) {
  return apiGet<TrainerProfileRead>(`/trainers/${trainerId}`);
}

export function getMyTrainerProfile() {
  return apiGet<TrainerProfileRead>("/trainers/me");
}

export function createTrainerProfile(payload: TrainerProfileCreate) {
  return apiPost<TrainerProfileRead>("/trainers", payload);
}

export function upsertMyTrainerProfile(payload: TrainerProfileUpsert) {
  return apiPut<TrainerProfileRead>("/trainers/me", payload);
}

export type TrainerReadiness = {
  canApply: boolean;
  checks: Array<{
    label: string;
    ready: boolean;
  }>;
};

export function getTrainerReadiness(trainer: Trainer): TrainerReadiness {
  const checks = [
    { label: "대표 사진", ready: Boolean(trainer.profileImage) },
    { label: "이름", ready: Boolean(trainer.name && trainer.name !== "이름 미입력") },
    { label: "출생년도/성별", ready: Boolean(trainer.age && trainer.gender) },
    { label: "연락처", ready: Boolean(trainer.contact) },
    { label: "거주지역", ready: Boolean(trainer.residenceRegion) }
  ];

  return {
    canApply: checks.every((check) => check.ready),
    checks
  };
}

export function toDomainTrainer(profile: TrainerProfileRead): Trainer {
  const profileImage = getMediaDisplayUrl(profile.media.find((item) => item.purpose === "profile"));
  const portfolioMedia = profile.media.filter((item) => item.purpose === "portfolio" || item.purpose === "gallery");
  const mediaImages = portfolioMedia
    .map((item, index) => ({
      label: item.original_filename || `포트폴리오 사진 ${index + 1}`,
      url: getMediaDisplayUrl(item)
    }))
    .filter((item) => item.url);

  return {
    id: profile.id,
    name: profile.name || "이름 미입력",
    age: profile.age ?? 0,
    birthYear: profile.birth_year ? `${profile.birth_year}` : "",
    gender: formatGender(profile.gender),
    contact: profile.phone ? formatKoreanPhoneNumber(profile.phone) : "",
    residenceRegion: [profile.residence_sido, profile.residence_sigungu].filter(Boolean).join(" "),
    profileImage,
    headline: profile.headline || "트레이너 소개 문구를 입력해 주세요.",
    area: profile.desired_area_text || [profile.residence_sido, profile.residence_sigungu].filter(Boolean).join(" ") || "희망 지역 미입력",
    experienceYears: profile.experience_years ?? 0,
    specialties: profile.specialties.map((item) => item.name),
    workType: profile.work_type || "근무 형태 미입력",
    desiredRoles: [],
    availability: profile.availability || "협의",
    verifiedProfile: profile.profile_status === "ready",
    summary: profile.summary || "자기소개가 아직 등록되지 않았습니다.",
    workHistory: profile.work_experiences.map((item) => ({
      gymName: item.center_name,
      period: item.period_text || [formatDate(item.start_date), formatDate(item.end_date)].filter(Boolean).join(" - ") || "기간 미입력",
      role: item.role_description
    })),
    certifications: profile.credentials.map((item) =>
      [item.title, item.issued_by, formatDate(item.issued_at)].filter(Boolean).join(" · ")
    ),
    portfolioLinks: profile.portfolio_links.map((item) => ({
      label: item.label,
      url: item.url
    })),
    mediaItems: mediaImages.map((item) => item.label),
    mediaImages,
    preferredConditions: [],
    portfolioNotes: []
  };
}

function formatGender(value: string | null) {
  if (value === "male") {
    return "남성";
  }
  if (value === "female") {
    return "여성";
  }
  if (value === "other") {
    return "기타";
  }
  if (value === "undisclosed") {
    return "비공개";
  }
  return value || "";
}

function formatDate(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

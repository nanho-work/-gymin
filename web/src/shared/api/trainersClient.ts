import { apiGet, apiPost, apiPut } from "@/shared/api/httpClient";
import type { TrainerProfileCreate, TrainerProfileRead, TrainerProfileUpsert } from "@/shared/api/serverTypes";
import type { Page } from "@/shared/api/types";

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

export type BusinessProfileRead = {
  id: string;
  user_id: string;
  owner_name: string | null;
  phone: string | null;
  verification_status: string;
  created_at: string;
};

export type CenterRead = {
  id: string;
  business_profile_id: string;
  name: string;
  sido: string;
  sigungu: string;
  detail_address: string;
  industry: string;
  operation_type: string | null;
  introduction: string | null;
  homepage_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  verification_status: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CenterCreate = Omit<
  CenterRead,
  "id" | "business_profile_id" | "verification_status" | "status" | "created_at" | "updated_at"
>;

export type CenterUpdate = CenterCreate;

export type JobPostRead = {
  id: string;
  center_id: string;
  business_profile_id: string;
  title: string;
  job_role: string;
  employment_type: string;
  start_date_text: string | null;
  work_days: string | null;
  work_hours: string | null;
  rest_time: string | null;
  base_pay: string | null;
  insurance_type: string | null;
  incentive: string | null;
  settlement_type: string | null;
  sales_pressure: string | null;
  member_handover: string | null;
  vacation: string | null;
  support_detail: string | null;
  description: string | null;
  status: string;
  published_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type JobPostCreate = Omit<JobPostRead, "id" | "status" | "published_at" | "closed_at" | "created_at" | "updated_at">;

export type OwnerJobPostRead = JobPostRead & {
  applicant_count: number;
  reviewed_applicant_count: number;
};

export type TrainerProfileRead = {
  id: string;
  user_id: string;
  name: string | null;
  birth_year: number | null;
  age: number | null;
  gender: string | null;
  phone: string | null;
  residence_sido: string | null;
  residence_sigungu: string | null;
  desired_area_text: string | null;
  headline: string | null;
  experience_years: number | null;
  work_type: string | null;
  availability: string | null;
  summary: string | null;
  profile_status: string;
  created_at: string;
  updated_at: string;
  specialties: TrainerSpecialtyRead[];
  work_experiences: TrainerWorkExperienceRead[];
  credentials: TrainerCredentialRead[];
  portfolio_links: TrainerPortfolioLinkRead[];
  media: MediaFileResponse[];
};

export type TrainerProfileCreate = Omit<
  TrainerProfileRead,
  | "id"
  | "age"
  | "profile_status"
  | "created_at"
  | "updated_at"
  | "specialties"
  | "work_experiences"
  | "credentials"
  | "portfolio_links"
  | "media"
>;

export type TrainerSpecialtyWrite = {
  name: string;
  sort_order: number;
};

export type TrainerSpecialtyRead = TrainerSpecialtyWrite & {
  id: string;
};

export type TrainerWorkExperienceWrite = {
  center_name: string;
  start_date: string | null;
  end_date: string | null;
  period_text: string | null;
  role_description: string;
  sort_order: number;
};

export type TrainerWorkExperienceRead = TrainerWorkExperienceWrite & {
  id: string;
};

export type TrainerCredentialWrite = {
  credential_type: string;
  title: string;
  issued_by: string | null;
  issued_at: string | null;
  sort_order: number;
};

export type TrainerCredentialRead = TrainerCredentialWrite & {
  id: string;
};

export type TrainerPortfolioLinkWrite = {
  label: string;
  url: string;
  sort_order: number;
};

export type TrainerPortfolioLinkRead = TrainerPortfolioLinkWrite & {
  id: string;
};

export type TrainerProfileUpsert = {
  name: string | null;
  birth_year: number | null;
  gender: string | null;
  phone: string | null;
  residence_sido: string | null;
  residence_sigungu: string | null;
  desired_area_text: string | null;
  headline: string | null;
  experience_years: number | null;
  work_type: string | null;
  availability: string | null;
  summary: string | null;
  profile_status: string;
  specialties: TrainerSpecialtyWrite[];
  work_experiences: TrainerWorkExperienceWrite[];
  credentials: TrainerCredentialWrite[];
  portfolio_links: TrainerPortfolioLinkWrite[];
};

export type JobApplicationRead = {
  id: string;
  job_post_id: string;
  trainer_profile_id: string;
  message: string | null;
  status: string;
  applied_at: string;
  reviewed_at: string | null;
};

export type JobApplicationCreate = {
  job_post_id: string;
  message: string | null;
};

export type MyJobApplicationRead = JobApplicationRead & {
  job_post: JobPostRead;
};

export type JobApplicationWithTrainerRead = JobApplicationRead & {
  trainer_profile: TrainerProfileRead;
};

export type PresignedUploadRequest = {
  entity_type: "center" | "trainer_profile" | "job_post" | "business_verification";
  entity_id: string;
  purpose: "profile" | "representative" | "gallery" | "verification" | "portfolio" | "content";
  filename: string;
  content_type: string;
};

export type PresignedUploadResponse = {
  upload_url: string;
  object_key: string;
  bucket: string;
  expires_in: number;
};

export type CompleteUploadRequest = {
  entity_type: PresignedUploadRequest["entity_type"];
  entity_id: string;
  purpose: PresignedUploadRequest["purpose"];
  object_key: string;
  original_filename: string;
  content_type: string;
  file_size: number;
  sort_order: number;
};

export type MediaVariantResponse = {
  variant_type: "original" | "medium" | "thumbnail";
  object_key: string;
  width: number;
  height: number;
  file_size: number;
  content_type: string;
  url: string | null;
};

export type CompleteUploadResponse = {
  id: string;
  bucket: string;
  object_key: string;
  width: number;
  height: number;
  variants: MediaVariantResponse[];
};

export type MediaFileResponse = {
  id: string;
  entity_type: PresignedUploadRequest["entity_type"];
  entity_id: string;
  purpose: PresignedUploadRequest["purpose"];
  bucket: string;
  object_key: string;
  original_filename: string | null;
  content_type: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  created_at: string;
  variants: MediaVariantResponse[];
};

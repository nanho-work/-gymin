-- GymIn current PostgreSQL schema.
-- Keep this file in sync whenever a migration query is added or changed.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name varchar(80) NOT NULL,
  email varchar(255),
  phone varchar(30),
  status varchar(30) NOT NULL DEFAULT 'active',
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT users_status_check CHECK (status IN ('active', 'blocked', 'deleted'))
);

DROP TRIGGER IF EXISTS users_set_updated_at ON users;
CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role varchar(30) NOT NULL,
  status varchar(30) NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_roles_role_check CHECK (role IN ('trainer', 'business', 'admin')),
  CONSTRAINT user_roles_status_check CHECK (status IN ('active', 'pending', 'blocked'))
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_user_roles_user_role
ON user_roles(user_id, role);

CREATE INDEX IF NOT EXISTS ix_user_roles_role
ON user_roles(role);

DROP TRIGGER IF EXISTS user_roles_set_updated_at ON user_roles;
CREATE TRIGGER user_roles_set_updated_at
BEFORE UPDATE ON user_roles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role varchar(30) NOT NULL,
  provider varchar(30) NOT NULL,
  provider_user_id varchar(255) NOT NULL,
  provider_email varchar(255),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT social_accounts_role_check CHECK (role IN ('trainer', 'business', 'admin')),
  CONSTRAINT social_accounts_provider_check CHECK (provider IN ('kakao', 'google'))
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_social_accounts_provider_user_role
ON social_accounts(provider, provider_user_id, role);

CREATE INDEX IF NOT EXISTS ix_social_accounts_user_id
ON social_accounts(user_id);

DROP TRIGGER IF EXISTS social_accounts_set_updated_at ON social_accounts;
CREATE TRIGGER social_accounts_set_updated_at
BEFORE UPDATE ON social_accounts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_name varchar(80),
  phone varchar(30),
  verification_status varchar(30) NOT NULL DEFAULT 'not_requested',
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT business_profiles_verification_status_check
    CHECK (verification_status IN ('not_requested', 'pending', 'verified', 'rejected'))
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_business_profiles_user_id
ON business_profiles(user_id);

DROP TRIGGER IF EXISTS business_profiles_set_updated_at ON business_profiles;
CREATE TRIGGER business_profiles_set_updated_at
BEFORE UPDATE ON business_profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_profile_id uuid NOT NULL REFERENCES business_profiles(id) ON DELETE RESTRICT,
  name varchar(120) NOT NULL,
  sido varchar(40) NOT NULL,
  sigungu varchar(60) NOT NULL,
  detail_address varchar(255) NOT NULL,
  industry varchar(40) NOT NULL,
  operation_type varchar(255),
  introduction text,
  homepage_url varchar(500),
  instagram_url varchar(500),
  youtube_url varchar(500),
  verification_status varchar(30) NOT NULL DEFAULT 'not_requested',
  status varchar(30) NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT centers_industry_check
    CHECK (industry IN ('health_pt', 'pilates', 'yoga', 'crossfit', 'rehab', 'mixed', 'etc')),
  CONSTRAINT centers_verification_status_check
    CHECK (verification_status IN ('not_requested', 'pending', 'verified', 'rejected')),
  CONSTRAINT centers_status_check
    CHECK (status IN ('draft', 'active', 'hidden', 'deleted'))
);

CREATE INDEX IF NOT EXISTS ix_centers_business_profile_id
ON centers(business_profile_id);

CREATE INDEX IF NOT EXISTS ix_centers_name_trgm
ON centers USING gin (name public.gin_trgm_ops);

CREATE INDEX IF NOT EXISTS ix_centers_region
ON centers(sido, sigungu);

CREATE INDEX IF NOT EXISTS ix_centers_industry
ON centers(industry);

CREATE INDEX IF NOT EXISTS ix_centers_status
ON centers(status);

DROP TRIGGER IF EXISTS centers_set_updated_at ON centers;
CREATE TRIGGER centers_set_updated_at
BEFORE UPDATE ON centers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS trainer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name varchar(80),
  birth_year smallint,
  birth_date date,
  age smallint,
  gender varchar(20),
  phone varchar(30),
  residence_sido varchar(40),
  residence_sigungu varchar(60),
  desired_area_text varchar(255),
  headline varchar(160),
  experience_years smallint,
  work_type varchar(80),
  availability varchar(255),
  summary text,
  profile_status varchar(30) NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT trainer_profiles_birth_year_check
    CHECK (birth_year IS NULL OR (birth_year >= 1900 AND birth_year <= 2100)),
  CONSTRAINT trainer_profiles_phone_digits_check
    CHECK (phone IS NULL OR phone ~ '^[0-9]+$'),
  CONSTRAINT trainer_profiles_age_check CHECK (age IS NULL OR (age >= 14 AND age <= 100)),
  CONSTRAINT trainer_profiles_experience_years_check
    CHECK (experience_years IS NULL OR (experience_years >= 0 AND experience_years <= 80)),
  CONSTRAINT trainer_profiles_gender_check
    CHECK (gender IS NULL OR gender IN ('male', 'female', 'other', 'undisclosed')),
  CONSTRAINT trainer_profiles_status_check
    CHECK (profile_status IN ('draft', 'ready', 'hidden', 'deleted'))
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_trainer_profiles_user_id
ON trainer_profiles(user_id);

CREATE INDEX IF NOT EXISTS ix_trainer_profiles_region
ON trainer_profiles(residence_sido, residence_sigungu);

CREATE INDEX IF NOT EXISTS ix_trainer_profiles_status
ON trainer_profiles(profile_status);

DROP TRIGGER IF EXISTS trainer_profiles_set_updated_at ON trainer_profiles;
CREATE TRIGGER trainer_profiles_set_updated_at
BEFORE UPDATE ON trainer_profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS trainer_specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_profile_id uuid NOT NULL REFERENCES trainer_profiles(id) ON DELETE CASCADE,
  name varchar(80) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS ix_trainer_specialties_profile_id
ON trainer_specialties(trainer_profile_id);

CREATE INDEX IF NOT EXISTS ix_trainer_specialties_name
ON trainer_specialties(name);

CREATE TABLE IF NOT EXISTS trainer_work_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_profile_id uuid NOT NULL REFERENCES trainer_profiles(id) ON DELETE CASCADE,
  center_name varchar(120) NOT NULL,
  start_date date,
  end_date date,
  period_text varchar(80),
  role_description varchar(500) NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  CONSTRAINT trainer_work_experiences_date_check
    CHECK (start_date IS NULL OR end_date IS NULL OR start_date <= end_date)
);

CREATE INDEX IF NOT EXISTS ix_trainer_work_experiences_profile_id
ON trainer_work_experiences(trainer_profile_id);

CREATE TABLE IF NOT EXISTS trainer_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_profile_id uuid NOT NULL REFERENCES trainer_profiles(id) ON DELETE CASCADE,
  credential_type varchar(40) NOT NULL DEFAULT 'certificate',
  title varchar(160) NOT NULL,
  issued_by varchar(160),
  issued_at date,
  sort_order int NOT NULL DEFAULT 0,
  CONSTRAINT trainer_credentials_type_check
    CHECK (credential_type IN ('certificate', 'award', 'education', 'etc'))
);

CREATE INDEX IF NOT EXISTS ix_trainer_credentials_profile_id
ON trainer_credentials(trainer_profile_id);

CREATE INDEX IF NOT EXISTS ix_trainer_credentials_type
ON trainer_credentials(credential_type);

CREATE TABLE IF NOT EXISTS trainer_portfolio_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_profile_id uuid NOT NULL REFERENCES trainer_profiles(id) ON DELETE CASCADE,
  label varchar(80) NOT NULL,
  url varchar(500) NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS ix_trainer_portfolio_links_profile_id
ON trainer_portfolio_links(trainer_profile_id);

CREATE TABLE IF NOT EXISTS job_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id uuid NOT NULL REFERENCES centers(id) ON DELETE RESTRICT,
  business_profile_id uuid NOT NULL REFERENCES business_profiles(id) ON DELETE RESTRICT,
  title varchar(160) NOT NULL,
  job_role varchar(60) NOT NULL,
  employment_type varchar(60) NOT NULL,
  start_date_text varchar(120),
  work_days varchar(160),
  work_hours varchar(160),
  rest_time varchar(160),
  base_pay varchar(160),
  insurance_type varchar(60),
  incentive varchar(255),
  settlement_type varchar(255),
  sales_pressure varchar(60),
  member_handover varchar(60),
  vacation varchar(160),
  support_detail varchar(255),
  description text,
  status varchar(30) NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT job_posts_status_check
    CHECK (status IN ('draft', 'open', 'closed', 'hidden', 'deleted'))
);

CREATE INDEX IF NOT EXISTS ix_job_posts_center_id
ON job_posts(center_id);

CREATE INDEX IF NOT EXISTS ix_job_posts_business_profile_id
ON job_posts(business_profile_id);

CREATE INDEX IF NOT EXISTS ix_job_posts_status_published_at
ON job_posts(status, published_at DESC);

CREATE INDEX IF NOT EXISTS ix_job_posts_job_role
ON job_posts(job_role);

CREATE INDEX IF NOT EXISTS ix_job_posts_employment_type
ON job_posts(employment_type);

CREATE INDEX IF NOT EXISTS ix_job_posts_title_trgm
ON job_posts USING gin (title public.gin_trgm_ops);

DROP TRIGGER IF EXISTS job_posts_set_updated_at ON job_posts;
CREATE TRIGGER job_posts_set_updated_at
BEFORE UPDATE ON job_posts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_post_id uuid NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
  trainer_profile_id uuid NOT NULL REFERENCES trainer_profiles(id) ON DELETE RESTRICT,
  message text,
  status varchar(30) NOT NULL DEFAULT 'submitted',
  applied_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT job_applications_status_check
    CHECK (status IN ('submitted', 'reviewing', 'accepted', 'rejected', 'cancelled'))
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_job_applications_job_trainer
ON job_applications(job_post_id, trainer_profile_id);

CREATE INDEX IF NOT EXISTS ix_job_applications_trainer_profile_id
ON job_applications(trainer_profile_id);

CREATE INDEX IF NOT EXISTS ix_job_applications_status
ON job_applications(status);

DROP TRIGGER IF EXISTS job_applications_set_updated_at ON job_applications;
CREATE TRIGGER job_applications_set_updated_at
BEFORE UPDATE ON job_applications
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  entity_type varchar(40) NOT NULL,
  entity_id uuid NOT NULL,
  purpose varchar(40) NOT NULL,
  bucket varchar(120) NOT NULL,
  object_key varchar(500) NOT NULL,
  original_filename varchar(255),
  content_type varchar(100),
  file_size bigint,
  width int,
  height int,
  sort_order int NOT NULL DEFAULT 0,
  status varchar(30) NOT NULL DEFAULT 'uploaded',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT media_files_entity_type_check
    CHECK (entity_type IN ('center', 'trainer_profile', 'job_post', 'business_verification')),
  CONSTRAINT media_files_purpose_check
    CHECK (purpose IN ('profile', 'representative', 'gallery', 'verification', 'portfolio', 'content')),
  CONSTRAINT media_files_status_check
    CHECK (status IN ('uploaded', 'attached', 'deleted')),
  CONSTRAINT media_files_file_size_check CHECK (file_size IS NULL OR file_size >= 0),
  CONSTRAINT media_files_dimensions_check
    CHECK ((width IS NULL OR width > 0) AND (height IS NULL OR height > 0))
);

CREATE INDEX IF NOT EXISTS ix_media_files_entity
ON media_files(entity_type, entity_id, purpose);

CREATE INDEX IF NOT EXISTS ix_media_files_owner_user_id
ON media_files(owner_user_id);

CREATE UNIQUE INDEX IF NOT EXISTS ux_media_files_single_primary
ON media_files(entity_type, entity_id, purpose)
WHERE deleted_at IS NULL AND purpose IN ('profile', 'representative');

DROP TRIGGER IF EXISTS media_files_set_updated_at ON media_files;
CREATE TRIGGER media_files_set_updated_at
BEFORE UPDATE ON media_files
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS media_file_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_file_id uuid NOT NULL REFERENCES media_files(id) ON DELETE CASCADE,
  variant_type varchar(30) NOT NULL,
  bucket varchar(120) NOT NULL,
  object_key varchar(500) NOT NULL,
  content_type varchar(100) NOT NULL DEFAULT 'image/webp',
  file_size bigint NOT NULL,
  width int NOT NULL,
  height int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT media_file_variants_type_check
    CHECK (variant_type IN ('original', 'medium', 'thumbnail')),
  CONSTRAINT media_file_variants_file_size_check CHECK (file_size >= 0),
  CONSTRAINT media_file_variants_dimensions_check CHECK (width > 0 AND height > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_media_file_variants_file_type
ON media_file_variants(media_file_id, variant_type);

CREATE INDEX IF NOT EXISTS ix_media_file_variants_media_file_id
ON media_file_variants(media_file_id);

-- 0004를 API 재배포보다 먼저 실행해 birth_date/age가 삭제된 DB를 복구한다.
-- 새 API는 birth_year만 사용하지만, 구버전 API 컨테이너가 떠 있는 동안 500을 막기 위해 호환 컬럼을 보존한다.
ALTER TABLE trainer_profiles
  ADD COLUMN IF NOT EXISTS birth_date date,
  ADD COLUMN IF NOT EXISTS age smallint;

UPDATE trainer_profiles
SET birth_date = make_date(birth_year, 1, 1)
WHERE birth_date IS NULL
  AND birth_year IS NOT NULL;

UPDATE trainer_profiles
SET age = EXTRACT(YEAR FROM CURRENT_DATE)::int - birth_year
WHERE age IS NULL
  AND birth_year IS NOT NULL;

ALTER TABLE trainer_profiles
  DROP CONSTRAINT IF EXISTS trainer_profiles_age_check;

ALTER TABLE trainer_profiles
  ADD CONSTRAINT trainer_profiles_age_check
  CHECK (age IS NULL OR (age >= 14 AND age <= 100));

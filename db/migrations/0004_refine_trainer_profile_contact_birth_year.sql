-- 트레이너 프로필의 연락처 저장값을 숫자만 남기고, 나이는 출생년도 기반 서버 계산값으로 전환한다.
ALTER TABLE trainer_profiles
  ADD COLUMN IF NOT EXISTS birth_year smallint;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'trainer_profiles'
      AND column_name = 'birth_date'
  ) THEN
    UPDATE trainer_profiles
    SET birth_year = COALESCE(
      EXTRACT(YEAR FROM birth_date)::smallint,
      CASE
        WHEN age IS NOT NULL THEN (EXTRACT(YEAR FROM CURRENT_DATE)::int - age)::smallint
        ELSE NULL
      END
    )
    WHERE birth_year IS NULL;
  ELSIF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'trainer_profiles'
      AND column_name = 'age'
  ) THEN
    UPDATE trainer_profiles
    SET birth_year = (EXTRACT(YEAR FROM CURRENT_DATE)::int - age)::smallint
    WHERE birth_year IS NULL
      AND age IS NOT NULL;
  END IF;
END $$;

UPDATE trainer_profiles
SET phone = NULLIF(regexp_replace(phone, '\D', '', 'g'), '')
WHERE phone IS NOT NULL;

ALTER TABLE trainer_profiles
  ADD CONSTRAINT trainer_profiles_birth_year_check
  CHECK (birth_year IS NULL OR (birth_year >= 1900 AND birth_year <= 2100));

ALTER TABLE trainer_profiles
  ADD CONSTRAINT trainer_profiles_phone_digits_check
  CHECK (phone IS NULL OR phone ~ '^[0-9]+$');

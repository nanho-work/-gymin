BEGIN;

ALTER TABLE media_files
  DROP CONSTRAINT IF EXISTS media_files_purpose_check;

ALTER TABLE media_files
  ADD CONSTRAINT media_files_purpose_check
  CHECK (purpose IN ('profile', 'representative', 'gallery', 'verification', 'portfolio', 'content'));

COMMIT;

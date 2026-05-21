-- 업로드 원본을 original/medium/thumbnail 변환본으로 저장하기 위한 테이블이다.
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

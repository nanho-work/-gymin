-- 공개 구인글 서버 검색을 위한 인덱스다.
-- 지역/업종은 센터 테이블의 기존 btree 인덱스를 보강하고, 제목/센터명 부분 검색은 pg_trgm GIN 인덱스를 사용한다.
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;

CREATE INDEX IF NOT EXISTS ix_centers_region
ON centers(sido, sigungu);

CREATE INDEX IF NOT EXISTS ix_centers_industry
ON centers(industry);

CREATE INDEX IF NOT EXISTS ix_centers_name_trgm
ON centers USING gin (name public.gin_trgm_ops);

CREATE INDEX IF NOT EXISTS ix_job_posts_title_trgm
ON job_posts USING gin (title public.gin_trgm_ops);

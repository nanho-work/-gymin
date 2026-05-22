# DBeaver에서 실행할 쿼리

이 파일은 사람이 직접 DB에 반영해야 하는 쿼리를 순서대로 알려준다. 쿼리를 추가하거나 변경하면 항상 이 파일을 최신화한다.

## 현재 실행 상태

- `db/manual/00_create_database.sql`: 실행 완료
- `db/migrations/0001_initial_schema.sql`: 실행 완료
- `db/migrations/0002_add_media_content_purpose.sql`: 실행 완료
- `db/migrations/0003_add_media_file_variants.sql`: 실행 필요
- `db/migrations/0004_refine_trainer_profile_contact_birth_year.sql`: 실행 필요

## 현재 실행 순서

### 1. 기본 DB에 접속

DBeaver에서 RDS 기본 데이터베이스 `postgres`에 접속한다.

- Host: RDS endpoint
- Port: `5432`
- Database: `postgres`
- Username: RDS 마스터 사용자

### 2. 서비스 DB 생성

아래 파일의 쿼리를 실행한다.

```text
db/manual/00_create_database.sql
```

이미 `gymin` 데이터베이스가 있으면 건너뛴다.

### 3. `gymin` DB로 새 연결 생성

DBeaver에서 같은 RDS endpoint로 새 연결을 만들고 Database 값을 `gymin`으로 입력한다.

### 4. 초기 스키마 생성

`gymin` 데이터베이스에 연결한 상태에서 아래 파일의 쿼리를 실행한다.

```text
db/migrations/0001_initial_schema.sql
```

### 5. 게시글 본문 이미지 purpose 추가

이미 운영 DB에 `0001_initial_schema.sql`을 실행했다면 `gymin` 데이터베이스에 연결한 상태에서 아래 파일의 쿼리를 추가로 실행한다.

```text
db/migrations/0002_add_media_content_purpose.sql
```

### 6. 이미지 변환본 테이블 추가

이미지 업로드 완료 후 `original`, `medium`, `thumbnail` 변환본을 저장하려면 `gymin` 데이터베이스에 연결한 상태에서 아래 파일의 쿼리를 추가로 실행한다.

```text
db/migrations/0003_add_media_file_variants.sql
```

### 7. 트레이너 연락처/출생년도 정리

트레이너 프로필 연락처를 숫자 저장값으로 정규화하고, 나이 저장 컬럼을 출생년도 기반 계산값으로 전환하려면 아래 파일의 쿼리를 추가로 실행한다.

```text
db/migrations/0004_refine_trainer_profile_contact_birth_year.sql
```

## 실행 후 확인 쿼리

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

아래 테이블들이 보여야 한다.

- `users`
- `user_roles`
- `social_accounts`
- `business_profiles`
- `centers`
- `trainer_profiles`
- `trainer_specialties`
- `trainer_work_experiences`
- `trainer_credentials`
- `trainer_portfolio_links`
- `job_posts`
- `job_applications`
- `media_files`
- `media_file_variants`

## 관리 규칙

DB에 새 쿼리를 반영할 일이 생기면 아래 파일을 함께 수정한다.

- `db/migrations/XXXX_description.sql`: 실제 추가/변경 쿼리
- `db/all-queries.sql`: 지금까지의 누적 쿼리
- `db/schema.sql`: 최신 전체 스키마
- `db/queries-to-run.md`: 사람이 실행해야 하는 순서
- `docs/database-schema.md`: 사람이 읽는 스키마 설명

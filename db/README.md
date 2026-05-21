# GymIn DB 관리 규칙

GymIn은 PostgreSQL을 기준으로 DB를 관리한다. 초기에는 사용자가 DBeaver에서 직접 쿼리를 실행하고, FastAPI 서버가 붙은 뒤에는 SQLAlchemy + Alembic으로 전환한다.

## 파일 역할

- `manual/00_create_database.sql`
  - RDS 기본 `postgres` DB에 접속해서 `gymin` 데이터베이스를 만들 때 실행한다.

- `migrations/0001_initial_schema.sql`
  - `gymin` 데이터베이스에 최초 테이블, FK, index, trigger를 생성하는 쿼리다.

- `schema.sql`
  - 항상 최신 상태의 전체 스키마다.
  - DB 구조가 바뀌면 이 파일도 반드시 최신화한다.

- `all-queries.sql`
  - 지금까지 추가/변경된 모든 쿼리를 누적해서 보관하는 파일이다.
  - 사람이 전체 쿼리 흐름을 한 파일에서 보고 싶을 때 사용한다.

- `queries-to-run.md`
  - 사용자가 DBeaver에서 어떤 쿼리를 어떤 순서로 실행해야 하는지 알려주는 파일이다.

## 변경 규칙

DB 변경이 생기면 아래 순서를 따른다.

1. `migrations/XXXX_description.sql` 파일을 새로 만든다.
2. `all-queries.sql`에 해당 쿼리를 누적한다.
3. `schema.sql`을 최신 전체 스키마로 갱신한다.
4. `queries-to-run.md`에 실행해야 하는 쿼리와 순서를 적는다.
5. `docs/database-schema.md` 설명도 맞춰 수정한다.

## 주의

- 비밀번호, RDS endpoint, `DATABASE_URL`은 이 폴더에 기록하지 않는다.
- 이미지 파일은 DB에 직접 저장하지 않는다. 원본급 파일은 `media_files`, 화면용 변환본은 `media_file_variants`에 S3 object key만 저장한다.
- FK와 index 없이 새 테이블을 만들지 않는다.
- DBeaver에서 직접 실행하기 전에는 실행 대상 DB가 `postgres`인지 `gymin`인지 반드시 확인한다.

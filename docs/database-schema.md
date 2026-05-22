# GymIn 데이터베이스 스키마 초안

GymIn의 1차 운영 범위는 센터 사장님이 구인글을 올리고, 트레이너가 본인 프로필로 지원하는 흐름이다. PostgreSQL + FastAPI + SQLAlchemy 기준으로 현재 운영 스키마를 정리한다.

## 설계 원칙

- 로그인 계정과 서비스 역할을 분리한다.
- 같은 소셜 계정이라도 트레이너 계정과 사업자 계정은 별도로 가입할 수 있다.
- 이미지 파일은 DB에 직접 저장하지 않고 S3 object key와 메타데이터만 저장한다.
- 트레이너 이력, 자격증, 포트폴리오처럼 개수가 늘어나는 데이터는 별도 테이블로 분리한다.
- 구인글 검색에 필요한 값은 자유 본문이 아니라 컬럼으로 둔다.
- 모든 주요 테이블은 `created_at`, `updated_at`을 가진다.
- 실제 삭제보다 `deleted_at` 또는 상태값을 우선 사용한다.

## 1차 핵심 테이블

```text
users
  -> user_roles
  -> social_accounts
  -> trainer_profiles
  -> business_profiles

business_profiles
  -> centers
  -> job_posts

trainer_profiles
  -> trainer_work_experiences
  -> trainer_credentials
  -> trainer_portfolio_links
  -> job_applications

media_files
  -> centers / trainer_profiles / job_posts 등에서 참조
```

## users

로그인 사용자의 기본 단위다. 실제 서비스에서는 소셜 로그인으로 생성된다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid pk | 사용자 ID |
| display_name | varchar(80) | 표시 이름 |
| email | varchar(255) nullable | 소셜 계정 이메일 |
| phone | varchar(30) nullable | 연락처 |
| status | varchar(30) | `active`, `blocked`, `deleted` |
| last_login_at | timestamptz nullable | 마지막 로그인 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |
| deleted_at | timestamptz nullable | 탈퇴/삭제 |

## user_roles

한 사용자가 트레이너와 사업자 역할을 동시에 가질 수 있게 분리한다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid pk | 역할 ID |
| user_id | uuid fk users.id | 사용자 |
| role | varchar(30) | `trainer`, `business` |
| status | varchar(30) | `active`, `pending`, `blocked` |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

제약:

- unique `(user_id, role)`

## social_accounts

카카오/구글 로그인 연결 정보다. 같은 provider 계정이라도 role별 가입을 허용하기 위해 role을 unique key에 포함한다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid pk | 소셜 계정 ID |
| user_id | uuid fk users.id | 사용자 |
| role | varchar(30) | 로그인 역할 |
| provider | varchar(30) | `kakao`, `google` |
| provider_user_id | varchar(255) | provider의 user id |
| provider_email | varchar(255) nullable | provider 이메일 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

제약:

- unique `(provider, provider_user_id, role)`

## business_profiles

센터 사장님 계정의 사업자 프로필이다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid pk | 사업자 프로필 ID |
| user_id | uuid fk users.id | 사용자 |
| owner_name | varchar(80) nullable | 대표자명 |
| phone | varchar(30) nullable | 연락처 |
| verification_status | varchar(30) | `not_requested`, `pending`, `verified`, `rejected` |
| verified_at | timestamptz nullable | 인증 완료일 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

제약:

- unique `(user_id)`

## centers

센터/헬스장/필라테스 업장 기본 정보다. 구인글에 자동 노출되는 원본 정보다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid pk | 센터 ID |
| business_profile_id | uuid fk business_profiles.id | 소유 사업자 |
| name | varchar(120) | 센터명 |
| sido | varchar(40) | 시/도 |
| sigungu | varchar(60) | 구/시/군 |
| detail_address | varchar(255) | 상세주소 |
| industry | varchar(40) | `health_pt`, `pilates`, `yoga`, `crossfit`, `rehab`, `mixed`, `etc` |
| operation_type | varchar(255) nullable | 운영형태 자유 입력 |
| introduction | text nullable | 업장 소개 |
| homepage_url | varchar(500) nullable | 홈페이지 |
| instagram_url | varchar(500) nullable | 인스타그램 |
| youtube_url | varchar(500) nullable | 유튜브 |
| verification_status | varchar(30) | `not_requested`, `pending`, `verified`, `rejected` |
| status | varchar(30) | `draft`, `active`, `hidden`, `deleted` |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |
| deleted_at | timestamptz nullable | 삭제일 |

인덱스:

- `(sido, sigungu)`
- `(industry)`
- `(business_profile_id)`
- `name public.gin_trgm_ops`

## trainer_profiles

트레이너의 지원용 프로필이다. 저장은 자유롭게 가능하지만 지원 시 필수값을 검사한다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid pk | 트레이너 프로필 ID |
| user_id | uuid fk users.id | 사용자 |
| name | varchar(80) nullable | 이름 |
| birth_year | smallint nullable | 출생년도, 나이는 서버 응답에서 계산 |
| birth_date | date nullable | 구버전 API 호환용, 새 로직에서는 사용하지 않음 |
| age | smallint nullable | 구버전 API 호환용, 새 로직에서는 서버 계산값을 응답에만 포함 |
| gender | varchar(20) nullable | 성별 |
| phone | varchar(30) nullable | 숫자만 저장하는 연락처 |
| residence_sido | varchar(40) nullable | 거주 시/도 |
| residence_sigungu | varchar(60) nullable | 거주 구/시/군 |
| desired_area_text | varchar(255) nullable | 희망 활동 지역 자유 입력 |
| headline | varchar(160) nullable | 한줄 소개 |
| experience_years | smallint nullable | 총 경력 |
| work_type | varchar(80) nullable | 희망 근무 형태 |
| availability | varchar(255) nullable | 가능 시간 |
| summary | text nullable | 자기소개 |
| profile_status | varchar(30) | `draft`, `ready`, `hidden`, `deleted` |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |
| deleted_at | timestamptz nullable | 삭제일 |

제약:

- unique `(user_id)`

지원 가능 조건:

- 대표 사진 존재
- name
- birth_year
- gender
- phone
- residence_sido/residence_sigungu

## trainer_specialties

트레이너 전문 분야다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid pk | ID |
| trainer_profile_id | uuid fk trainer_profiles.id | 트레이너 |
| name | varchar(80) | 전문 분야 |
| sort_order | int | 노출 순서 |

## trainer_work_experiences

트레이너 경력 사항이다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid pk | ID |
| trainer_profile_id | uuid fk trainer_profiles.id | 트레이너 |
| center_name | varchar(120) | 근무했던 센터명 |
| start_date | date nullable | 시작일 |
| end_date | date nullable | 종료일 |
| period_text | varchar(80) nullable | 자유 기간 표시 |
| role_description | varchar(500) | 담당 업무 |
| sort_order | int | 노출 순서 |

## trainer_credentials

자격증/수상경력/교육 이력이다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid pk | ID |
| trainer_profile_id | uuid fk trainer_profiles.id | 트레이너 |
| credential_type | varchar(40) | `certificate`, `award`, `education`, `etc` |
| title | varchar(160) | 이름 |
| issued_by | varchar(160) nullable | 발급/주관 |
| issued_at | date nullable | 취득일 |
| sort_order | int | 노출 순서 |

## trainer_portfolio_links

인스타그램, 블로그 등 외부 링크다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid pk | ID |
| trainer_profile_id | uuid fk trainer_profiles.id | 트레이너 |
| label | varchar(80) | 링크명 |
| url | varchar(500) | URL |
| sort_order | int | 노출 순서 |

## job_posts

센터 사장님이 등록하는 구인글이다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid pk | 구인글 ID |
| center_id | uuid fk centers.id | 센터 |
| business_profile_id | uuid fk business_profiles.id | 작성자 |
| title | varchar(160) | 공고 제목 |
| job_role | varchar(60) | 모집 직무 |
| employment_type | varchar(60) | 근무 형태 |
| start_date_text | varchar(120) nullable | 근무 시작일 자유 입력 |
| work_days | varchar(160) nullable | 근무 요일 |
| work_hours | varchar(160) nullable | 근무 시간 |
| rest_time | varchar(160) nullable | 휴게 시간 |
| base_pay | varchar(160) nullable | 기본급 |
| insurance_type | varchar(60) nullable | 4대보험 |
| incentive | varchar(255) nullable | 수업료/인센티브 |
| settlement_type | varchar(255) nullable | 정산 방식 |
| sales_pressure | varchar(60) nullable | 매출 압박/구간제 |
| member_handover | varchar(60) nullable | 회원 인계 |
| vacation | varchar(160) nullable | 휴가/월차 |
| support_detail | varchar(255) nullable | 추가 지원 |
| description | text nullable | 상세 설명 |
| status | varchar(30) | `draft`, `open`, `closed`, `hidden`, `deleted` |
| published_at | timestamptz nullable | 게시일 |
| closed_at | timestamptz nullable | 마감일 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |
| deleted_at | timestamptz nullable | 삭제일 |

인덱스:

- `(center_id)`
- `(business_profile_id)`
- `(status, published_at desc)`
- `(job_role)`
- `(employment_type)`
- `title public.gin_trgm_ops`

## job_applications

트레이너가 구인글에 지원한 기록이다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid pk | 지원 ID |
| job_post_id | uuid fk job_posts.id | 구인글 |
| trainer_profile_id | uuid fk trainer_profiles.id | 지원자 |
| message | text nullable | 지원 메시지 |
| status | varchar(30) | `submitted`, `reviewing`, `accepted`, `rejected`, `cancelled` |
| applied_at | timestamptz | 지원일 |
| reviewed_at | timestamptz nullable | 확인일 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

제약:

- unique `(job_post_id, trainer_profile_id)`

## media_files

S3 업로드 파일 메타데이터다. 한 테이블에서 여러 도메인에 연결한다. 실제 화면 표시에는 `media_file_variants`의 변환본을 우선 사용한다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid pk | 파일 ID |
| owner_user_id | uuid fk users.id | 업로드 사용자 |
| entity_type | varchar(40) | `center`, `trainer_profile`, `job_post`, `business_verification` |
| entity_id | uuid | 연결 대상 ID |
| purpose | varchar(40) | `profile`, `representative`, `gallery`, `verification`, `portfolio`, `content` |
| bucket | varchar(120) | S3 버킷 |
| object_key | varchar(500) | original 변환본 S3 key |
| original_filename | varchar(255) nullable | 원본 파일명 |
| content_type | varchar(100) nullable | MIME type |
| file_size | bigint nullable | byte |
| width | int nullable | 이미지 너비 |
| height | int nullable | 이미지 높이 |
| sort_order | int | 노출 순서 |
| status | varchar(30) | `uploaded`, `attached`, `deleted` |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |
| deleted_at | timestamptz nullable | 삭제일 |

인덱스:

- `(entity_type, entity_id, purpose)`
- `(owner_user_id)`

## media_file_variants

S3 업로드 이미지의 변환본이다. 목록은 `thumbnail`, 상세는 `medium`, 필요 시 원본급 이미지는 `original`을 사용한다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid pk | 변환본 ID |
| media_file_id | uuid fk media_files.id | 원본 메타데이터 |
| variant_type | varchar(30) | `original`, `medium`, `thumbnail` |
| bucket | varchar(120) | S3 버킷 |
| object_key | varchar(500) | 변환본 S3 key |
| content_type | varchar(100) | 기본 `image/webp` |
| file_size | bigint | byte |
| width | int | 이미지 너비 |
| height | int | 이미지 높이 |
| created_at | timestamptz | 생성일 |

인덱스:

- unique `(media_file_id, variant_type)`
- `(media_file_id)`

## 추후 확장 테이블

초기에는 만들지 않고 필요해질 때 추가한다.

- notices: 공지사항
- reports: 신고/검수
- center_reviews: 센터 평판/항목 평가
- trainer_reviews: 사업장 전용 트레이너 평가
- subscriptions: SaaS 구독
- payments: 결제 내역
- audit_logs: 운영 로그
- notifications: 알림

## 초기 Alembic 생성 순서

1. users
2. user_roles
3. social_accounts
4. business_profiles
5. centers
6. trainer_profiles
7. trainer_specialties
8. trainer_work_experiences
9. trainer_credentials
10. trainer_portfolio_links
11. job_posts
12. job_applications
13. media_files
14. media_file_variants

## 현재 DB 반영 상태

- `db/manual/00_create_database.sql`: 실행 완료
- `db/migrations/0001_initial_schema.sql`: 실행 완료
- `db/migrations/0002_add_media_content_purpose.sql`: 실행 완료
- `db/migrations/0003_add_media_file_variants.sql`: 실행 필요
- `db/migrations/0004_refine_trainer_profile_contact_birth_year.sql`: 운영 DB 실행 완료
- `db/migrations/0005_restore_trainer_profile_legacy_birth_columns.sql`: 운영 DB 수동 복구 완료
- `db/migrations/0006_add_job_search_indexes.sql`: 실행 필요

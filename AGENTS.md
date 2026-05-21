# GymIn 작업 규칙

이 문서는 새 채팅창이나 다른 작업자가 GymIn 프로젝트를 이어받을 때 먼저 확인할 기준이다.

## 프로젝트 방향

- GymIn은 피트니스 업계용 구인 플랫폼이다.
- 기존 목업 화면을 단순히 API 호출로 바꾸는 것이 아니라, mock 데이터가 표현하던 사용자 흐름을 실제 서버 상태, DB, 인증, S3 로직으로 치환한다.
- 운영 배포 기준은 EC2 + Docker + Nginx다. Vercel은 운영 배포 경로로 보지 않는다.
- S3 버킷은 private이다. 프론트에서 `object_key`를 직접 이미지 URL로 쓰지 않고, 서버가 presigned GET URL을 내려준다.

## 파일 구조 원칙

- 서버는 기능 단위로 `server/app/features/{domain}/` 아래에 둔다.
- 기능 폴더는 필요한 파일만 사용하며, 기본 구조는 `model.py`, `schema.py`, `crud.py`, `service.py`, `router.py`다.
- 모든 기능 라우터는 `server/app/api/router.py`에서 등록한다.
- 서버 공용 로직은 기능 폴더에 중복하지 않고 `server/app/common`, `server/app/core`, `server/app/db`에 둔다.
- 프론트 화면 구현은 `web/src/features/{domain}/pages`에 둔다.
- URL 진입점인 `web/app/**/page.tsx`는 얇게 유지하고 feature page를 import한다.
- 전역 공용 컴포넌트, API, hook, type, util은 `web/src/shared`에 둔다.
- 특정 기능에만 속하지만 여러 화면에서 재사용되는 코드는 해당 feature 폴더 안에 둔다. 예: `web/src/features/uploads`.

## 레이아웃 규칙

- 최상위 레이아웃은 `web/app/layout.tsx`다.
- 최상위에서 `AuthProvider`와 `SiteLayout`을 감싸므로, 일반 페이지는 이 흐름을 따른다.
- 사장님 영역은 `web/app/(owner)/layout.tsx`를 사용한다.
- 트레이너 영역은 `web/app/(trainer)/layout.tsx`를 사용한다.
- 새 페이지에서 헤더/푸터/사이드바를 직접 반복 구현하지 않고 기존 레이아웃을 상속한다.

## 공용화 규칙

- 페이지네이션은 `server/app/common/pagination.py`를 사용한다.
- API 요청은 `web/src/shared/api/httpClient.ts`를 통한다.
- 서버 응답 타입은 `web/src/shared/api/serverTypes.ts`에 둔다.
- 기능별 API client는 `web/src/shared/api/*Client.ts`에 둔다.
- 이미지 업로드 UI와 훅은 `web/src/features/uploads`를 재사용하거나 확장한다.
- 공용 UI는 `web/src/shared/components/ui`에 둔다.
- 공용 레이아웃은 `web/src/shared/components/layout`에 둔다.
- 같은 로직을 새 페이지에 복붙하기보다 기존 hook/client/component 확장을 먼저 검토한다.

## DB 및 마이그레이션 규칙

- DB 테이블, 컬럼, 인덱스, 제약조건이 바뀌면 새 migration 파일을 `db/migrations/000X_*.sql`에 추가한다.
- `db/schema.sql`은 현재 최종 스키마와 항상 동기화한다.
- 운영자가 직접 실행해야 하는 쿼리나 순서가 있으면 `db/queries-to-run.md` 또는 `db/manual/*`에 기록한다.
- DB 구조 변경과 함께 서버 모델 `server/app/features/*/model.py`를 갱신한다.
- 요청/응답이 바뀌면 서버 schema와 프론트 `serverTypes.ts`, 관련 API client도 함께 갱신한다.
- 마이그레이션이 필요 없는 엔드포인트/API 변경은 DB 파일을 억지로 수정하지 않는다.

## 기능 기록 규칙

- 완성된 기능이나 운영 흐름이 바뀌면 관련 문서를 갱신한다.
- 전체 실행법, 페이지 목록, 현재 연결 상태는 `README.md`에 반영한다.
- 서버 구조와 규칙은 `server/README.md`에 반영한다.
- DB 설계 설명은 `docs/database-schema.md`에 반영한다.
- S3 업로드/조회 흐름은 `docs/s3-upload.md`에 반영한다.
- Firebase 인증 흐름은 `docs/firebase-auth.md`에 반영한다.
- 배포 경계와 운영 절차는 `docs/deployment-boundaries.md`, `docs/deploy-server.md`, `docs/aws-rds.md`에 반영한다.

## 트레이너 프로필 전환 기준

- 트레이너 로그인 후 내 프로필은 로그인 세션 기준 API를 사용한다.
- 클라이언트가 `user_id`를 직접 들고 다니며 내 프로필을 생성하지 않는다.
- 내 프로필 조회/저장은 `/api/trainers/me` 흐름을 기준으로 한다.
- 대표 사진과 포트폴리오 이미지는 실제 `trainer_profile.id`에 연결한다.
- private S3 이미지는 media 응답의 variant별 presigned URL을 사용해 렌더링한다.

## 검증 규칙

- 서버 변경 후 최소한 `npm run check:server`를 실행한다.
- 프론트 타입/API 변경 후 `npm run build`를 실행한다.
- Next/Turbopack 빌드가 샌드박스 포트 바인딩 문제로 실패하면 승인된 실행으로 다시 검증한다.
- 변경과 무관하게 생성 파일이 자동 변경되면 의도한 변경인지 확인하고, 불필요한 변경은 되돌린다.

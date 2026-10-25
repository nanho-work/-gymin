# 게임 기획 기록실 작업 규칙

이 문서는 새 채팅창이나 다른 작업자가 GymIn 프로젝트를 이어받을 때 먼저 확인할 기준이다.

## 프로젝트 방향

- 확정 세계관: 후삼국 시대, 왕건 주인공, 역사의 큰 흐름을 유지하는 역사 판타지. 시작점·판타지 규칙·초기 동료는 미정. 가상 국가 해온 설정을 현행 설정으로 사용하지 않는다.

- 현재 프로젝트는 기존 GymIn에서 한국풍 턴제 RPG의 시각적 기획 기록실로 전환 중이다.
- 홈(`/`)은 `web/src/features/game-world`에서 구현한다. 게임 이름과 설정은 사용자 확정 전까지 제안 초안으로 표시한다.
- 세계관과 이력의 기준은 `web/src/features/game-world/data/world.json`이다. 사이트는 읽기 전용이며 대화에서 결정한 설정을 로컬 파일에 반영하고 history에 날짜·이유·이전/이후를 남긴다. 사이트 편집·브라우저 저장·내보내기·별도 DB는 도입하지 않는다.
- 세계관 → 캐릭터와 이미지 → 병과·스킬 → 시나리오 순서로 확장한다. 수정 이유와 이전/이후 내용을 기록한다.
- 기존 구인 서비스 코드, DB, 운영 인프라는 전환 참고 자료로 보존 중이다. 기존 서비스 관련 아래 규칙은 해당 코드를 수정할 때만 적용한다.
- 운영 배포 기준은 Vercel이다. EC2는 사용을 종료했으며 EC2 배포 워크플로는 제거했다. Vercel Root Directory는 `web`이다.
- 커밋·푸시·실제 배포는 사용자가 직접 진행한다. 별도 요청 없이 수행하지 않는다.
- 이전 프로젝트 안내와 규칙은 `docs/game/legacy-project-readme.md`, `docs/game/legacy-agents.md`를 참고한다.

- 전체 캠페인 설계는 `web/src/features/game-world/data/campaign.json`에서 관리한다. 현재 6막·44개 고유 전투·한 회차36개는 제안이며 사용자 확정으로 간주하지 않는다. 역사적 패배와 임무 실패를 구분하고 두 분기 모두 역사적 통일을 유지한다.

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
- `ProjectShell`은 홈에 게임 기록실을 표시하고, 기존 경로에만 `AuthProvider`와 `SiteLayout`을 적용한다.
- 사장님 영역은 `web/app/(owner)/layout.tsx`를 사용하며, 센터관리 허브형 화면이라 별도 사이드바를 두지 않는다.
- 트레이너 영역은 `web/app/(trainer)/layout.tsx`를 사용하며, 내 활동 관리 허브형 화면이라 별도 사이드바를 두지 않는다.
- 새 페이지에서 헤더/푸터를 직접 반복 구현하지 않고 기존 레이아웃을 상속한다. 관리 영역은 전역 헤더와 각 화면의 내부 액션으로 이동 흐름을 구성한다.

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
- EC2 식별자, 운영 구조, 확인 명령, 용량 정책은 `docs/infra-inventory.md`에 반영한다. 단, private key, `.env`, `DATABASE_URL`, DB 비밀번호, Firebase service account 내용은 문서에 기록하지 않는다.

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

## 게임 이미지 저장·인물 카드 기준

- 사용자는 작은 로컬 저장 용량을 우선한다. 새 인물 이미지는 전신 최대 512×512px WebP와 작은 128×160px WebP 썸네일로 저장한다. 기본 품질은 76 전후이며 실제 그림을 확인하면서 조절한다. 인물당 두 파일 합계 약 50KB를 목표로 한다.
- 생성 도구가 대형 원본을 반환하면 경량본 변환·이미지 확인·페이지 연결 후 해당 작업의 대형 원본과 불필요한 복사본을 정리한다. 다른 작업의 이미지에는 손대지 않는다. 원본 보관을 따로 요청한 경우는 제외한다.
- 생성 프롬프트, 경량본 경로, 원본 정리 여부를 기록하여 재작업할 수 있게 한다. 대형 PNG를 저장소에 추가하지 않는다.
- 인물 카드는 왼쪽 작은 썸네일 → 가운데 이름·교체 이름 → 오른쪽 전신 배치를 공통으로 사용한다. 교체 이름이 없는 신규·설화 인물은 화살표와 교체 이름을 생략한다. 전신 클릭 시 경량 확대 이미지를 연다.
- 커밋·푸시·배포는 사용자가 직접 한다.
- 새 캐릭터 초상화·모션은 `docs/game/character-art-workflow.md`의 공통 절차를 따른다. 프로필은 전신 축소로 대체하지 않고 얼굴·어깨 중심으로 제작한다. 모션 UI는 `CharacterMotion`을 재사용한다.

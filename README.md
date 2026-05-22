# GymIn

피트니스 업계용 무료 구인 게시판 웹 서비스입니다.

새 채팅창이나 다른 작업자가 프로젝트를 이어받을 때는 [AGENTS.md](AGENTS.md)의 작업 규칙을 먼저 확인합니다.

## 기술 스택

- React 18
- Next.js 16
- TypeScript
- Tailwind CSS

의존성은 안정성과 호환성을 우선해 `latest` 대신 고정 버전을 사용합니다.

## 실행

루트에서는 웹 실행을 바로 위임할 수 있습니다.

```bash
npm run dev
```

처음 설치하거나 웹만 따로 확인할 때는 `web` 폴더에서 실행합니다.

```bash
cd web
npm install
npm run dev
```

## 서버 실행

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
vi .env
uvicorn app.main:app --reload
```

서버 코드는 기능별로 `server/app/features/*` 아래에 분리한다.

## 빌드

```bash
npm run build
```

운영 배포는 EC2 + Docker + Nginx 기준이다. Vercel은 더 이상 운영 배포 경로로 사용하지 않는다.

## 운영 메모

- AWS RDS 생성 기록: [docs/aws-rds.md](docs/aws-rds.md)
- Firebase 로그인 설정: [docs/firebase-auth.md](docs/firebase-auth.md)
- PostgreSQL 스키마 초안: [docs/database-schema.md](docs/database-schema.md)
- DB 실행 쿼리 안내: [db/queries-to-run.md](db/queries-to-run.md)
- 운영 인프라 인벤토리: [docs/infra-inventory.md](docs/infra-inventory.md)
- EC2 배포 절차: [docs/deploy-server.md](docs/deploy-server.md)
- 배포 경계: [docs/deployment-boundaries.md](docs/deployment-boundaries.md)
- S3 이미지 업로드: [docs/s3-upload.md](docs/s3-upload.md)

## 페이지

- 홈: `/`
- 로그인/회원가입 선택: `/login`
- 사업자 회원가입: `/signup/business`
- 일반 회원가입: `/signup/general`
- 센터 등록: `/gyms/new`
- 센터 상세보기: `/gyms/[gymId]`
- 구인글 페이지: `/jobs/hiring`
- 구인글 상세보기: `/jobs/hiring/[jobId]`
- 구인글 등록: `/jobs/hiring/new`
- 사업장 관리: `/owner`
- 공고 지원자 목록: `/owner/jobs/[jobId]/applicants`
- 내 활동 관리: `/trainer`
- 트레이너 정보 등록: `/trainers/new`
- 트레이너 상세보기: `/trainers/[trainerId]`

## 구조

```text
web/
  app/
    layout.tsx               # 전역 HTML + 헤더/푸터 프레임
    (owner)/layout.tsx       # 사업장 관리 영역 공통 사이드바
    (trainer)/layout.tsx     # 트레이너 영역 공통 사이드바
    **/page.tsx              # URL 라우트 진입점
  src/
    features/
      auth/                  # 로그인/회원가입 화면
      centers/               # 센터 등록/상세 UI
      jobs/                  # 구인글 목록/등록 UI
      owner/                 # 사업장 관리/지원자 관리 화면
      trainers/              # 내 활동 관리/등록/상세 화면
      uploads/               # S3 이미지 업로드 API와 저장 전 선택 훅
    shared/
      api/                   # FastAPI client
      components/            # 전역 레이아웃과 공용 UI
      data/                  # 정적 지역 선택 데이터
      hooks/                 # 도메인에 묶이지 않는 공용 훅
      types/                 # 공용 도메인 타입
      utils/                 # 공용 계산 유틸
    styles/

server/
  app/
    main.py
    api/
    core/
    db/
    features/

db/
  schema.sql
  migrations/
  manual/

docs/
```

현재 로그인, 로그아웃, 홈 통계/최신 구인글, 이미지 업로드/삭제, 센터 등록/수정/상세, 구인글 목록/등록, 트레이너 프로필 등록/수정/입력값 정규화/내 프로필/상세 노출, 트레이너 구인글 지원/지원 현황, 사업장 관리, 지원자 목록/확인 신호는 FastAPI와 연결되어 있다. 회원가입 목업 화면 등 일부 미완성 흐름은 아직 `MockField`를 사용한다.

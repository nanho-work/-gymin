# GymIn

피트니스 업계용 무료 구인 게시판 목업 웹 서비스입니다.

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

처음 설치하거나 Vercel 배포 기준으로 확인할 때는 `web` 폴더에서 실행합니다.

```bash
cd web
npm install
npm run dev
```

## 서버 실행 예정

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

Vercel에서는 프로젝트 설정의 Root Directory를 `web`으로 둔다.

## 운영 메모

- AWS RDS 생성 기록: [docs/aws-rds.md](docs/aws-rds.md)
- Firebase 로그인 설정: [docs/firebase-auth.md](docs/firebase-auth.md)
- PostgreSQL 스키마 초안: [docs/database-schema.md](docs/database-schema.md)
- DB 실행 쿼리 안내: [db/queries-to-run.md](db/queries-to-run.md)

## 페이지

- 홈: `/`
- 로그인/회원가입 선택: `/login`
- 사업자 회원가입: `/signup/business`
- 일반 회원가입: `/signup/general`
- 센터 등록: `/gyms/new`
- 센터 상세보기: `/gyms/[gymId]`
- 구인글 페이지: `/jobs/hiring`
- 구인글 등록: `/jobs/hiring/new`
- 사장님 전용: `/owner`
- 공고 지원자 목록: `/owner/jobs/[jobId]/applicants`
- 트레이너 전용: `/trainer`
- 트레이너 정보 등록: `/trainers/new`
- 트레이너 상세보기: `/trainers/[trainerId]`

## 구조

```text
web/
  app/
    layout.tsx               # 전역 HTML + 헤더/푸터 프레임
    (owner)/layout.tsx       # 사장님 영역 공통 사이드바
    (trainer)/layout.tsx     # 트레이너 영역 공통 사이드바
    **/page.tsx              # URL 라우트 진입점
  src/
    data/mock/               # 서버 연결 전 JSON 목업 데이터
    features/
      auth/                  # 로그인/회원가입 화면
      centers/               # 센터 등록/상세/검증 UI
      jobs/                  # 구인글 목록/등록 UI
      owner/                 # 사장님 홈/지원자 관리 화면
      trainers/              # 트레이너 홈/등록/상세 화면
      uploads/               # 이미지 업로드 목업 UI와 훅
    shared/
      api/                   # mockRepository, 이후 FastAPI client 교체 위치
      components/            # 전역 레이아웃과 공용 UI
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

현재 웹 화면은 아직 `web/src/data/mock/*.json` mock data를 사용합니다. 나중에 FastAPI를 붙일 때는 `web/src/shared/api/mockRepository.ts`의 데이터 접근 부분을 API client로 교체하는 흐름을 고려했습니다.

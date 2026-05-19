# GymIn

피트니스 업계용 무료 구인 게시판 목업 웹 서비스입니다.

## 기술 스택

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

의존성은 안정성과 호환성을 우선해 `latest` 대신 고정 버전을 사용합니다.

## 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

## 페이지

- 홈: `/`
- 로그인/회원가입 선택: `/login`
- 사업자 회원가입: `/signup/business`
- 일반 회원가입: `/signup/general`
- 센터 등록: `/gyms/new`
- 센터 상세보기: `/gyms/:gymId`
- 구인글 페이지: `/jobs/hiring`
- 구인글 등록: `/jobs/hiring/new`
- 사장님 전용: `/owner`
- 트레이너 전용: `/trainer`
- 트레이너 정보 등록: `/trainers/new`
- 트레이너 상세보기: `/trainers/:trainerId`

## 구조

```text
src/
  components/
  data/
  hooks/
  pages/
  types/
  utils/
```

현재 버전은 서버, DB, 인증, 실제 파일 업로드 없이 `src/data/*.json` mock data만 사용합니다. 나중에 FastAPI를 붙일 때는 `src/utils/mockRepository.ts`의 데이터 접근 부분을 API client로 교체하는 흐름을 고려했습니다.

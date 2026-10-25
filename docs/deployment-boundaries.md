# 게임 기획 기록실 배포 경계

2026-10-25 기준 배포 대상은 Vercel이다. EC2 사용은 종료했다.

## 배포 흐름

사용자가 GitHub main에 커밋·푸시 → 연결된 Vercel 프로젝트가 web을 빌드 → 배포 결과와 도메인 확인.
커밋·푸시·실제 배포는 사용자가 직접 수행한다. 로컬 빌드 성공은 Vercel 배포 성공을 뜻하지 않는다.

## 프로젝트 설정

- Root Directory: web
- Framework: Next.js
- Build Command: npm run build
- Output Directory, Install Command: Next.js / 패키지 관리자 기본값
- Ignored Build Step: Automatic
- Node.js: 22.x

기존 루트 vercel.json의 ignoreCommand, scripts/vercel-ignore.mjs, package.json의 vercel:ignore 명령을 제거했다. web에는 별도의 빌드 생략 설정을 두지 않는다.

## EC2 종료 범위

.github/workflows/deploy-server.yml을 제거하여 push 및 수동 실행으로 EC2에 접속하는 작업을 없앴다. 과거 워크플로는 Git 기록에 남는다. Docker·Nginx·서버 파일은 참고 자료로 유지하며 자동 실행하지 않는다. GitHub의 기존 시크릿과 외부 클라우드 리소스는 이번 로컬 변경에서 조작하지 않는다.

## 기능과 데이터 범위

신규 게임 기획 홈은 프로젝트 JSON만 읽는다. 설정과 이력은 대화 후 로컬 파일에서 수정하고 사용자가 커밋·푸시·배포한다. 사이트 편집과 브라우저 저장은 사용하지 않는다. 기존 구인 서비스의 서버 API와 DB는 이번 배포 대상이 아니며, 남아 있는 구인 경로가 완전히 동작한다는 의미가 아니다.

기존 인프라 문서는 과거 운영 참고용이다. 종료된 EC2에서 환경변수나 인증 파일을 가져오는 절차는 실행하지 않는다.

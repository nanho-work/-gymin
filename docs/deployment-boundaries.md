# GymIn 배포 경계

현재 운영 배포는 Vercel을 사용하지 않고 EC2 한 대에서 웹과 서버를 같이 관리한다.

## 운영 구조

```txt
GitHub main push
-> GitHub Actions
-> EC2 /opt/gymin
-> Docker Compose
   -> gymin-web  : Next.js, 127.0.0.1:3000
   -> gymin-api  : FastAPI, 127.0.0.1:8000
-> Nginx
   -> /      : gymin-web
   -> /api   : gymin-api
   -> /health: gymin-api
```

## 배포 실행 조건

아래 파일이 바뀌면 EC2 배포가 실행된다.

```txt
web/**
server/**
infra/**
docker-compose.prod.yml
.github/workflows/deploy-server.yml
```

## Vercel 처리

Vercel 프로젝트가 아직 GitHub에 연결되어 있어도 빌드를 진행하지 않도록 한다.

```txt
vercel.json
-> ignoreCommand
-> npm run vercel:ignore
-> 항상 exit 0
```

즉 Vercel은 더 이상 실제 배포 경로가 아니다.

## EC2에서 필요한 비공개 파일

GitHub에는 올리지 않고 EC2에만 둔다.

```txt
/opt/gymin/web/.env
/opt/gymin/server/.env
/opt/gymin/secrets/firebase-service-account.json
```

## 웹 환경변수

Next.js의 `NEXT_PUBLIC_*` 값은 빌드 시점에 필요하다.
그래서 GitHub Actions가 EC2에서 Docker Compose를 실행하기 전에 `/opt/gymin/web/.env`를 읽어서 빌드 인자로 전달한다.

## 서버 환경변수

FastAPI는 런타임에 `/opt/gymin/server/.env`를 읽는다.
Firebase Admin SDK JSON은 Docker 볼륨으로 `/run/secrets/firebase-service-account.json`에 연결된다.

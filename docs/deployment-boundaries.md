# GymIn 배포 경계

이 문서는 어떤 파일이 바뀔 때 어떤 배포가 실행되어야 하는지 정리한다.

## 서버 배포

서버 배포는 GitHub Actions가 담당한다.

파일:

```txt
.github/workflows/deploy-server.yml
```

현재 서버 배포가 실행되는 변경 범위:

```txt
server/**
infra/**
docker-compose.prod.yml
.github/workflows/deploy-server.yml
```

즉 아래 파일만 바뀌면 서버 배포가 실행된다.

```txt
FastAPI 코드
Dockerfile
Nginx 설정
EC2 배포 스크립트
docker-compose.prod.yml
서버 배포 workflow
```

웹 파일만 바뀌면 서버 배포는 실행되지 않는다.

## 웹 배포

웹 배포는 Vercel이 담당한다.

Vercel은 기본값으로는 GitHub push가 있을 때마다 배포를 시도할 수 있다.
서버 파일만 바뀌었을 때 Vercel 웹 배포를 건너뛰려면 Vercel 프로젝트에 Ignored Build Step을 설정한다.

Vercel 설정 위치:

```txt
Vercel 프로젝트
-> Settings
-> Build and Deployment
-> Ignored Build Step
```

입력할 명령:

```bash
npm run vercel:ignore
```

이 명령은 아래 파일이 바뀐 경우에만 Vercel build를 진행시킨다.

```txt
web/**
package.json
package-lock.json
vercel.json
scripts/vercel-ignore.mjs
```

서버 파일만 바뀌면 Vercel build를 skip한다.

## 현재 의도한 동작

서버만 수정:

```txt
server/** 변경
-> GitHub Actions 서버 배포 실행
-> Vercel 웹 배포 skip
```

웹만 수정:

```txt
web/** 변경
-> Vercel 웹 배포 실행
-> GitHub Actions 서버 배포 미실행
```

서버와 웹을 같이 수정:

```txt
server/** 변경
web/** 변경
-> GitHub Actions 서버 배포 실행
-> Vercel 웹 배포 실행
```

문서만 수정:

```txt
docs/** 변경
-> 서버 배포 미실행
-> Vercel 웹 배포 skip
```

## 주의

Vercel에서 `Ignored Build Step`을 설정하지 않으면 서버 파일만 바뀌어도 Vercel이 웹 배포를 시도할 수 있다.
정확한 배포 경계를 원하면 반드시 아래 명령을 Vercel에 설정한다.

```bash
npm run vercel:ignore
```

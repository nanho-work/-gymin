# GymIn Firebase Auth

Firebase는 Google 로그인 인증에만 사용한다. 서비스 데이터는 PostgreSQL, 이미지는 S3를 사용한다.

## 웹 환경변수

파일 위치:

```text
web/.env
```

Firebase 콘솔에서 확인 위치:

```text
프로젝트 개요
-> 프로젝트 설정
-> 일반
-> 내 앱
-> 웹 앱
-> SDK 설정 및 구성
-> 구성
```

`firebaseConfig` 값을 아래처럼 넣는다.

```env
NEXT_PUBLIC_API_BASE_URL=/api

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

EC2 배포 시에는 `/opt/gymin/web/.env`에도 같은 `NEXT_PUBLIC_*` 값을 넣는다. `NEXT_PUBLIC_API_BASE_URL`은 같은 도메인에서 Nginx가 `/api`로 프록시하므로 `/api`를 사용한다.

현재 운영 Firebase 프로젝트:

```text
프로젝트 ID: gymin-69ae6
운영 승인 도메인: gymin.co.kr, www.gymin.co.kr
```

## 서버 환경변수

파일 위치:

```text
server/.env
```

필요한 Firebase 값:

```env
FIREBASE_PROJECT_ID=gymin-69ae6
FIREBASE_CREDENTIALS_FILE=/run/secrets/firebase-service-account.json
```

확인 위치:

```text
Firebase 콘솔
-> 프로젝트 설정
-> 일반
-> 프로젝트 ID
```

서비스 계정 키 발급 위치:

```text
Firebase 콘솔
-> 프로젝트 설정
-> 서비스 계정
-> 새 비공개 키 생성
```

받은 JSON 파일은 Git에 올리지 않는다. 예시 위치:

```text
server/firebase-service-account.json
```

그 경우 `server/.env`에는 이렇게 둔다.

```env
FIREBASE_CREDENTIALS_FILE=./firebase-service-account.json
```

EC2 운영 서버에서는 아래 위치에 JSON 파일을 둔다.

```text
/opt/gymin/secrets/firebase-service-account.json
```

Docker 컨테이너 안에서는 아래 경로로 마운트된다.

```text
/run/secrets/firebase-service-account.json
```

## Firebase 콘솔 설정

Google 로그인:

```text
Authentication
-> 로그인 방법
-> Google
-> 사용 설정
```

승인된 도메인:

```text
Authentication
-> 설정
-> 승인된 도메인
```

필요 도메인:

- `localhost`
- `gymin.co.kr`
- `www.gymin.co.kr`

## 로그인 흐름

```text
Next.js Google 로그인
-> Firebase ID token 발급
-> FastAPI /api/auth/firebase/login
-> Firebase Admin SDK로 token 검증
-> users, user_roles, social_accounts 저장 또는 조회
-> FastAPI가 httpOnly cookie 세션 설정
```

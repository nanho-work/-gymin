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
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

Vercel 배포 시에는 Vercel 프로젝트의 Environment Variables에도 같은 `NEXT_PUBLIC_*` 값을 넣는다. `NEXT_PUBLIC_API_BASE_URL`은 운영 FastAPI 주소로 바꾼다.

## 서버 환경변수

파일 위치:

```text
server/.env
```

필요한 Firebase 값:

```env
FIREBASE_PROJECT_ID=...
FIREBASE_CREDENTIALS_FILE=...
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

EC2 운영 서버에서는 서버 안의 안전한 경로에 JSON 파일을 두고, `FIREBASE_CREDENTIALS_FILE`에 그 절대 경로를 적는다.

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
- Vercel 배포 도메인
- 실제 운영 도메인

## 로그인 흐름

```text
Next.js Google 로그인
-> Firebase ID token 발급
-> FastAPI /api/auth/firebase/login
-> Firebase Admin SDK로 token 검증
-> users, user_roles, social_accounts 저장 또는 조회
```

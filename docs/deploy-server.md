# GymIn EC2 배포 절차

프론트와 FastAPI 서버를 모두 EC2 + Docker + Nginx로 배포한다.
Vercel은 더 이상 운영 배포 경로로 사용하지 않는다.

## 전체 순서

1. 로컬에서 EC2 접속 확인
2. EC2 최초 세팅
3. EC2에 웹/서버 운영 `.env` 작성
4. EC2에 Firebase 서비스 계정 JSON 업로드
5. GitHub Secrets 등록
6. `main` 브랜치 push 또는 GitHub Actions 수동 실행
7. 서버 상태 확인

## 1. 로컬에서 EC2 접속 확인

현재 확인된 EC2 정보:

```txt
인스턴스 ID: i-08a957884fd3a5583
퍼블릭 IPv4 주소: 3.39.23.9
키페어 이름: gymin-ec2-key
플랫폼: Linux/UNIX
AMI: Amazon Linux 2023
EC2 사용자명: ec2-user
```

로컬 터미널에서 실행한다.

```bash
chmod 400 "/Users/choenamho/Downloads/app/gymin/gymin-ec2-key.pem"
ssh -i "/Users/choenamho/Downloads/00. 앱/gymin/gymin-ec2-key.pem" ec2-user@3.39.23.9
```

현재 확인된 pem 파일 위치:

```bash
/Users/choenamho/Downloads/00. 앱/gymin/gymin-ec2-key.pem
```

퍼블릭 IPv4 주소를 다시 확인해야 하면 아래 위치에서 본다.

```txt
AWS 콘솔
-> EC2
-> 인스턴스
-> 인스턴스 ID i-08a957884fd3a5583 선택
-> 네트워킹 탭
-> 퍼블릭 IPv4 주소 확인
```

퍼블릭 DNS를 쓰고 싶으면 같은 화면에서 아래 값을 확인한다.

```txt
퍼블릭 IPv4 DNS
예: ec2-12-34-56-78.ap-northeast-2.compute.amazonaws.com
```

처음에는 DNS보다 `3.39.23.9`를 `EC2_HOST`로 쓰는 것이 가장 단순하다.
접속이 되면 EC2 안에서 다음 단계로 진행한다.

## 2. EC2 최초 세팅

EC2 터미널에서 실행한다.

```bash
sudo dnf update -y
sudo dnf install -y docker nginx git docker-compose-plugin
sudo systemctl enable --now docker
sudo systemctl enable --now nginx
sudo mkdir -p /opt/gymin/web /opt/gymin/server /opt/gymin/secrets
sudo chmod 750 /opt/gymin/secrets
sudo docker compose version
nginx -v
```

만약 `docker-compose-plugin` 설치가 실패하면 아래처럼 한 번 더 확인한다.

```bash
sudo dnf install -y docker nginx git
sudo systemctl enable --now docker
sudo docker compose version
```

`sudo docker compose version`이 정상 출력되어야 GitHub Actions 배포가 가능하다.

## 3. EC2에 운영 환경변수 작성

### 3-1. 웹 환경변수

EC2 터미널에서 실행한다.

```bash
sudo nano /opt/gymin/web/.env
```

아래 내용을 넣고 실제 Firebase 값으로 바꾼다.

```bash
NEXT_PUBLIC_API_BASE_URL=/api

NEXT_PUBLIC_FIREBASE_API_KEY=CHANGE_ME
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gymin-78912.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gymin-78912
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gymin-78912.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=CHANGE_ME
NEXT_PUBLIC_FIREBASE_APP_ID=CHANGE_ME
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=CHANGE_ME
```

저장:

```txt
Ctrl + O
Enter
Ctrl + X
```

권한 정리:

```bash
sudo chmod 600 /opt/gymin/web/.env
```

### 3-2. 서버 환경변수

EC2 터미널에서 실행한다.

```bash
sudo nano /opt/gymin/server/.env
```

아래 내용을 넣고 값만 실제 운영 값으로 바꾼다.

```bash
APP_NAME=GymIn API
APP_ENV=production
API_PREFIX=/api
CORS_ORIGINS=http://3.39.23.9

DATABASE_URL=postgresql+psycopg://gymin_admin:YOUR_DB_PASSWORD@YOUR_RDS_ENDPOINT:5432/gymin

AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=gymin-media-prod
S3_PRESIGNED_URL_EXPIRES_SECONDS=300

FIREBASE_PROJECT_ID=gymin-78912
FIREBASE_CREDENTIALS_FILE=/run/secrets/firebase-service-account.json
```

저장:

```txt
Ctrl + O
Enter
Ctrl + X
```

권한 정리:

```bash
sudo chmod 600 /opt/gymin/server/.env
```

중요:

- 이 파일은 GitHub에 올리지 않는다.
- EC2 안에만 둔다.
- AWS S3는 EC2 IAM Role을 쓰므로 `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`를 넣지 않는다.
- 웹 `.env`의 `NEXT_PUBLIC_*` 값은 브라우저에 노출되는 공개 설정이다.

## 4. Firebase 서비스 계정 JSON 업로드

로컬 터미널에서 실행한다.

```bash
scp -i /path/to/gymin-ec2-key.pem \
  /path/to/firebase-service-account.json \
  ec2-user@3.39.23.9:/tmp/firebase-service-account.json
```

현재 확인된 실제 경로 기준:

```bash
scp -i "/Users/choenamho/Downloads/00. 앱/gymin/gymin-ec2-key.pem" \
  "/Users/choenamho/Downloads/00. 앱/gymin/gymin-78912-firebase-adminsdk-fbsvc-8ccabed6ba.json" \
  ec2-user@3.39.23.9:/tmp/firebase-service-account.json
```

현재 EC2 퍼블릭 IPv4 주소는 `3.39.23.9`다.

그 다음 EC2 터미널에서 실행한다.

```bash
sudo mv /tmp/firebase-service-account.json /opt/gymin/secrets/firebase-service-account.json
sudo chown root:root /opt/gymin/secrets/firebase-service-account.json
sudo chmod 644 /opt/gymin/secrets/firebase-service-account.json
sudo ls -l /opt/gymin/secrets/firebase-service-account.json
```

Docker 컨테이너 안에서는 이 파일이 아래 경로로 연결된다.

```bash
/run/secrets/firebase-service-account.json
```

그래서 `.env`에는 반드시 이렇게 적는다.

```bash
FIREBASE_CREDENTIALS_FILE=/run/secrets/firebase-service-account.json
```

컨테이너는 `app` 사용자로 실행되므로 Firebase JSON은 컨테이너 안에서 읽을 수 있어야 한다.
그래서 파일은 `644`, 상위 디렉터리는 `750`으로 둔다.

## 5. GitHub Secrets 등록

GitHub 웹에서 등록한다.

```txt
Repository -> Settings -> Secrets and variables -> Actions -> New repository secret
```

필수:

```txt
EC2_HOST=3.39.23.9
EC2_USER=ec2-user
EC2_SSH_KEY_B64=base64로 변환한 gymin-ec2-key.pem 내용
```

선택:

```txt
EC2_PORT=22
SITE_DOMAIN=your-domain.com
SYNC_NGINX=true
```

`EC2_SSH_KEY_B64`는 `.pem` 파일을 base64로 변환한 값을 넣는다.
여러 줄 private key를 그대로 붙여넣으면 GitHub Actions에서 `error in libcrypto`가 날 수 있으므로 base64 방식을 사용한다.

로컬 터미널에서 아래 명령을 실행하면 값이 클립보드에 복사된다.

```bash
base64 -i "/Users/choenamho/Downloads/00. 앱/gymin/gymin-ec2-key.pem" | tr -d '\n' | pbcopy
```

그 다음 GitHub Secret에 아래처럼 등록한다.

```txt
Name: EC2_SSH_KEY_B64
Value: 방금 클립보드에 복사된 base64 문자열
```

GitHub CLI를 이미 쓰고 있다면 아래 명령으로도 등록할 수 있다.

```bash
gh secret set EC2_HOST --body "3.39.23.9"
gh secret set EC2_USER --body "ec2-user"
gh secret set EC2_PORT --body "22"
gh secret set SITE_DOMAIN --body "your-domain.com"
gh secret set SYNC_NGINX --body "true"
base64 -i "/Users/choenamho/Downloads/00. 앱/gymin/gymin-ec2-key.pem" | tr -d '\n' | gh secret set EC2_SSH_KEY_B64 --body-file -
```

GitHub CLI를 안 쓰면 웹에서 등록하면 된다.

## 5-1. EC2 보안 그룹에서 GitHub Actions SSH 허용

현재 배포 방식은 GitHub Actions 서버가 EC2에 SSH로 접속하는 방식이다.
그래서 EC2 보안 그룹의 SSH 22번 포트가 내 로컬 IP만 허용되어 있으면 GitHub Actions가 접속하지 못한다.

확인 위치:

```txt
AWS 콘솔
-> EC2
-> 인스턴스
-> i-08a957884fd3a5583 선택
-> 보안 탭
-> 보안 그룹 클릭
-> 인바운드 규칙 편집
```

현재 방식으로 GitHub Actions 배포를 먼저 성공시키려면 SSH 규칙이 필요하다.

```txt
유형: SSH
프로토콜: TCP
포트: 22
소스: 0.0.0.0/0
설명: GitHub Actions deploy ssh
```

주의:

```txt
이 방식은 빠르게 배포 확인하기 위한 설정이다.
운영 보안을 더 올리려면 나중에 self-hosted runner, SSM 배포, 또는 고정 배포 서버 방식으로 바꾸는 것이 좋다.
```

## 6. 배포 실행

자동 배포 조건:

```txt
main 브랜치에 push
```

웹/서버 관련 파일이 바뀌면 `.github/workflows/deploy-server.yml`이 실행된다.

자동 배포 대상 파일:

```txt
web/**
server/**
infra/**
docker-compose.prod.yml
.github/workflows/deploy-server.yml
```

수동 실행:

```txt
GitHub -> Actions -> Deploy EC2 -> Run workflow
```

배포가 성공하면 GitHub Actions가 EC2에서 아래 작업을 자동으로 한다.

```txt
EC2의 /opt/gymin/web/.env 읽기
GitHub Actions 러너에서 Docker 이미지 빌드
/opt/gymin에 배포 파일 업로드
EC2에 Docker 이미지 업로드
EC2에서 Docker 이미지 load
gymin-web 컨테이너 재시작
gymin-api 컨테이너 재시작
Nginx 설정 반영
nginx -t
Nginx reload
```

## 7. 서버 상태 확인

EC2 터미널에서 실행한다.

```bash
sudo docker compose -f /opt/gymin/docker-compose.prod.yml ps
sudo docker logs gymin-web --tail 100
sudo docker logs gymin-api --tail 100
curl http://127.0.0.1:3000
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/health/db
```

외부에서 확인한다.

```bash
curl http://3.39.23.9/health
curl http://3.39.23.9
```

도메인을 연결했다면:

```bash
curl http://your-domain.com/health
curl http://your-domain.com
```

## 8. Nginx 설정 위치

Git에 있는 원본:

```bash
infra/nginx/gymin-api.conf
```

배포 후 EC2에 반영되는 위치:

```bash
/etc/nginx/conf.d/gymin-api.conf
```

직접 확인:

```bash
sudo nginx -t
sudo systemctl status nginx
sudo cat /etc/nginx/conf.d/gymin-api.conf
```

수동 reload:

```bash
sudo systemctl reload nginx
```

## 9. 현재 운영 구조

```txt
EC2
  -> Nginx :80
  -> Docker Next.js :127.0.0.1:3000
  -> Docker FastAPI :127.0.0.1:8000
  -> RDS PostgreSQL
  -> S3 private bucket
```

## 10. 아직 자동화하지 않은 것

현재는 아래 항목은 자동화하지 않는다.

```txt
DB migration
SSL 인증서 발급
도메인 DNS 설정
운영 .env 생성
Firebase 서비스 계정 JSON 업로드
```

DB 스키마는 당분간 직접 SQL을 실행한다.
나중에 Alembic을 붙이면 DB migration도 CI/CD에 포함할 수 있다.

SSL은 도메인 연결 후 Certbot으로 붙인다.

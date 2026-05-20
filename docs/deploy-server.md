# GymIn 서버 배포 절차

프론트는 Vercel에서 자동 배포한다.
이 문서는 FastAPI 서버를 EC2 + Docker + Nginx로 배포하는 절차다.

## 전체 순서

1. 로컬에서 EC2 접속 확인
2. EC2 최초 세팅
3. EC2에 운영 `.env` 작성
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
sudo mkdir -p /opt/gymin/server /opt/gymin/secrets
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

EC2 터미널에서 실행한다.

```bash
sudo nano /opt/gymin/server/.env
```

아래 내용을 넣고 값만 실제 운영 값으로 바꾼다.

```bash
APP_NAME=GymIn API
APP_ENV=production
API_PREFIX=/api
CORS_ORIGINS=https://YOUR_VERCEL_DOMAIN

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
sudo chmod 600 /opt/gymin/secrets/firebase-service-account.json
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

## 5. GitHub Secrets 등록

GitHub 웹에서 등록한다.

```txt
Repository -> Settings -> Secrets and variables -> Actions -> New repository secret
```

필수:

```txt
EC2_HOST=3.39.23.9
EC2_USER=ec2-user
EC2_SSH_KEY=gymin-ec2-key.pem 파일 내용 전체
```

선택:

```txt
EC2_PORT=22
API_DOMAIN=api.your-domain.com
SYNC_NGINX=true
```

`EC2_SSH_KEY`는 `.pem` 파일 내용을 그대로 넣는다.

로컬 터미널에서 내용 확인:

```bash
cat "/Users/choenamho/Downloads/00. 앱/gymin/gymin-ec2-key.pem"
```

GitHub CLI를 이미 쓰고 있다면 아래 명령으로도 등록할 수 있다.

```bash
gh secret set EC2_HOST --body "3.39.23.9"
gh secret set EC2_USER --body "ec2-user"
gh secret set EC2_PORT --body "22"
gh secret set API_DOMAIN --body "api.your-domain.com"
gh secret set SYNC_NGINX --body "true"
gh secret set EC2_SSH_KEY < "/Users/choenamho/Downloads/00. 앱/gymin/gymin-ec2-key.pem"
```

GitHub CLI를 안 쓰면 웹에서 등록하면 된다.

## 6. 배포 실행

자동 배포 조건:

```txt
main 브랜치에 push
```

서버 관련 파일이 바뀌면 `.github/workflows/deploy-server.yml`이 실행된다.

자동 배포 대상 파일:

```txt
server/**
infra/**
docker-compose.prod.yml
.github/workflows/deploy-server.yml
```

수동 실행:

```txt
GitHub -> Actions -> Deploy Server -> Run workflow
```

배포가 성공하면 GitHub Actions가 EC2에서 아래 작업을 자동으로 한다.

```txt
/opt/gymin에 서버 파일 업로드
Docker 이미지 빌드
gymin-api 컨테이너 재시작
Nginx 설정 반영
nginx -t
Nginx reload
```

## 7. 서버 상태 확인

EC2 터미널에서 실행한다.

```bash
sudo docker compose -f /opt/gymin/docker-compose.prod.yml ps
sudo docker logs gymin-api --tail 100
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/health/db
```

외부에서 확인한다.

```bash
curl http://3.39.23.9/health
```

도메인을 연결했다면:

```bash
curl http://api.your-domain.com/health
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
Vercel frontend
  -> API domain

EC2
  -> Nginx :80
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

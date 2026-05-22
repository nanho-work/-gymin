# GymIn 운영 인프라 인벤토리

새 채팅창이나 다른 작업자가 운영 환경을 이어받을 때 먼저 확인할 기준이다.
비밀값은 기록하지 않고, 어디서 확인해야 하는지만 남긴다.

## 현재 운영 구조

```txt
GitHub main push
-> GitHub Actions
-> EC2
-> Docker Compose
   -> gymin-web : Next.js, 127.0.0.1:3000
   -> gymin-api : FastAPI, 127.0.0.1:8000
-> Nginx
   -> /      : gymin-web
   -> /api   : gymin-api
   -> /health: gymin-api
```

운영 배포 기준은 EC2 + Docker + Nginx다.
Vercel은 운영 배포 경로로 사용하지 않는다.

## 현재 확인된 값

2026-05-22 기준으로 확인된 값이다.
AWS 콘솔이나 EC2 터미널에서 값이 바뀌면 이 문서를 갱신한다.

```txt
AWS 리전: ap-northeast-2
가용 영역: ap-northeast-2c
인스턴스 ID: i-08a957884fd3a5583
인스턴스 유형: t3.micro
인스턴스 상태: running
퍼블릭 IPv4 주소: 13.125.133.220
퍼블릭 IPv4 DNS: ec2-13-125-133-220.ap-northeast-2.compute.amazonaws.com
프라이빗 IPv4 주소: 172.31.45.146
프라이빗 IPv4 DNS: ip-172-31-45-146.ap-northeast-2.compute.internal
탄력적 IP 주소: 없음
퍼블릭 IP 할당 방식: 자동 할당
키페어 이름: gymin-ec2-key
플랫폼: Linux/UNIX
AMI: Amazon Linux 2023
AMI ID: ami-010502f62836f0c67
AMI 이름: al2023-ami-2023.11.20260514.0-kernel-6.1-x86_64
EC2 사용자명: ec2-user
IAM 역할: gymin-ec2-s3-role
IMDSv2: Required
VPC ID: vpc-083823764a0e8fc9a
서브넷 ID: subnet-0f7ef720ee05d4af0
운영 도메인: gymin.co.kr
EC2 배포 경로: /opt/gymin
Docker Compose 파일: /opt/gymin/docker-compose.prod.yml
웹 컨테이너: gymin-web
API 컨테이너: gymin-api
웹 내부 포트: 127.0.0.1:3000
API 내부 포트: 127.0.0.1:8000
S3 리전: ap-northeast-2
S3 버킷: gymin-media-prod
```

현재 퍼블릭 IP는 탄력적 IP가 아니라 자동 할당 IP다.
인스턴스를 중지했다가 다시 시작하면 IP가 바뀔 수 있으므로, 운영 도메인을 안정적으로 유지하려면 나중에 Elastic IP 연결을 검토한다.

현재 비용 절감 기준으로 루트 볼륨은 작은 용량으로 운영한다.
2026-05-22 EC2 스토리지 탭과 장애 확인 당시 EC2 디스크 상태는 아래와 같았다.

```txt
루트 디바이스 이름: /dev/xvda
루트 디바이스 유형: EBS
루트 EBS 볼륨 ID: vol-0d9988caa318ced2f
루트 EBS 볼륨 크기: 8 GiB
EBS 최적화: 활성
암호화: 아니요
루트 파일시스템: /dev/nvme0n1p1
운영체제에서 보이는 루트 볼륨 크기: 8.0GB
루트 사용량: 7.4GB / 8.0GB, 93%
/var/lib/docker 사용량: 6.4GB
/tmp 사용량: 205MB
/opt/gymin 사용량: 15MB
Docker images reclaimable: 3.867GB
Docker build cache reclaimable: 1.531GB
```

그래서 배포 워크플로우는 Docker 이미지와 빌드 캐시 정리를 자동 실행해야 한다.

루트 볼륨을 늘리면 EBS provisioned storage 기준으로 추가 과금될 수 있다.
정확한 단가는 볼륨 타입과 AWS 계정의 Free Tier/크레딧 상태에 따라 달라진다.

볼륨 타입과 비용을 확인할 때는 아래 위치를 본다.

```txt
AWS 콘솔
-> EC2
-> Elastic Block Store
-> 볼륨
-> vol-0d9988caa318ced2f 선택
-> 볼륨 유형, 크기, IOPS, 처리량 확인
```

무료 사용량이나 크레딧 적용 여부는 아래 위치에서 확인한다.

```txt
AWS 콘솔
-> Billing and Cost Management
-> Free Tier
-> Credits
-> Bills
```

## AWS 콘솔에서 확인할 위치

EC2 기본 정보:

```txt
AWS 콘솔
-> EC2
-> 인스턴스
-> i-08a957884fd3a5583 선택
-> 세부 정보 탭
```

여기서 확인한다.

```txt
인스턴스 ID
인스턴스 유형
AMI ID
키 페어 이름
IAM 역할
플랫폼
가용 영역
```

퍼블릭 IP와 네트워크:

```txt
AWS 콘솔
-> EC2
-> 인스턴스
-> i-08a957884fd3a5583 선택
-> 네트워킹 탭
```

여기서 확인한다.

```txt
퍼블릭 IPv4 주소
퍼블릭 IPv4 DNS
프라이빗 IPv4 주소
VPC ID
서브넷 ID
보안 그룹
```

디스크 용량:

```txt
AWS 콘솔
-> EC2
-> 인스턴스
-> i-08a957884fd3a5583 선택
-> 스토리지 탭
-> 볼륨 ID 클릭
```

여기서 확인한다.

```txt
볼륨 ID
볼륨 크기
볼륨 유형
루트 디바이스 이름
```

보안 그룹 인바운드:

```txt
AWS 콘솔
-> EC2
-> 보안 그룹
-> 연결된 보안 그룹 선택
-> 인바운드 규칙
```

여기서 확인한다.

```txt
22 SSH
80 HTTP
443 HTTPS
허용된 소스 IP
```

S3:

```txt
AWS 콘솔
-> S3
-> gymin-media-prod
```

여기서 확인한다.

```txt
버킷 리전
Block Public Access
버킷 정책
CORS
업로드된 object prefix
```

RDS:

```txt
AWS 콘솔
-> RDS
-> Databases
-> GymIn 운영 DB 선택
```

RDS endpoint, DB 사용자명, 비밀번호, `DATABASE_URL`은 이 문서에 기록하지 않는다.
필요하면 AWS 콘솔, EC2의 `/opt/gymin/server/.env`, 또는 GitHub Secrets에서 확인한다.

## EC2 접속 후 확인 명령

로컬에서 EC2 접속:

```bash
ssh -i "/Users/choenamho/Downloads/00. 앱/gymin/gymin-ec2-key.pem" ec2-user@13.125.133.220
```

디스크 상태:

```bash
df -h
lsblk
sudo du -sh /var/lib/docker /tmp /opt/gymin 2>/dev/null
```

Docker 용량:

```bash
sudo docker system df
sudo docker images
sudo docker ps
sudo docker compose -f /opt/gymin/docker-compose.prod.yml ps
```

컨테이너 로그:

```bash
sudo docker logs gymin-web --tail 100
sudo docker logs gymin-api --tail 100
```

서비스 상태:

```bash
curl http://127.0.0.1:3000
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/health/db
```

EC2 내부 메타데이터 확인:

```bash
TOKEN=$(curl -sX PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -sH "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id
curl -sH "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-type
curl -sH "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/dynamic/instance-identity/document
```

메타데이터 명령은 EC2 안에서만 실행한다.

## 기록하면 안 되는 값

아래 값은 GitHub 문서에 기록하지 않는다.

```txt
.pem private key 내용
EC2_SSH_KEY_B64 값
/opt/gymin/web/.env 실제 값
/opt/gymin/server/.env 실제 값
DATABASE_URL
RDS endpoint
DB 사용자명
DB 비밀번호
JWT_SECRET_KEY
Firebase service account JSON 내용
AWS access key
AWS secret key
쿠키, 토큰, 세션 값
```

경로 자체는 운영 절차를 위해 기록할 수 있지만, 파일 내용은 기록하지 않는다.

## 새 채팅에서 먼저 볼 문서

새 채팅창에서 GymIn 작업을 이어갈 때는 아래 순서로 보면 된다.

```txt
AGENTS.md
README.md
docs/infra-inventory.md
docs/deploy-server.md
docs/deployment-boundaries.md
docs/s3-upload.md
db/queries-to-run.md
```

운영 장애를 물어볼 때는 아래 값을 같이 전달하면 원인 파악이 빠르다.

```txt
GitHub Actions 실패 로그의 마지막 100줄
df -h
sudo docker system df
sudo du -sh /var/lib/docker /tmp /opt/gymin 2>/dev/null
sudo docker compose -f /opt/gymin/docker-compose.prod.yml ps
sudo docker logs gymin-api --tail 100
sudo docker logs gymin-web --tail 100
```

## 업데이트 규칙

아래 중 하나가 바뀌면 이 문서도 같이 갱신한다.

```txt
EC2 인스턴스 교체
인스턴스 유형 변경
루트 볼륨 크기 변경
퍼블릭 IPv4 변경
Elastic IP 연결
도메인 변경
보안 그룹 변경
Docker 컨테이너 이름 변경
Docker Compose 경로 변경
Nginx 프록시 경로 변경
S3 버킷 변경
RDS 교체
배포 워크플로우 변경
```

# GymIn AWS 운영 메모

이 문서는 GymIn의 초기 AWS 인프라 생성 설정을 기록한다. 비밀번호, 실제 endpoint, AWS 계정 ID, 고정 IP 같은 민감 정보는 레포에 남기지 않는다.

## RDS 생성 정보

- 리전: `ap-northeast-2` 서울
- DB 식별자: `gymin-db`
- 엔진: PostgreSQL
- 역할: RDS DB 인스턴스
- 인스턴스 클래스: `db.t4g.micro`
- 배포: Single-AZ
- 스토리지: 범용 SSD `gp2`
- 할당 스토리지: `20 GiB`
- 퍼블릭 액세스: 초기 로컬 접속용 `Yes`
- VPC 보안 그룹: `gymin-rds-sg`
- RDS Proxy: 비활성화
- Database Insights: 표준
- Enhanced Monitoring: 비활성화 권장
- DevOps Guru: 비활성화
- 로그 내보내기: 초기에는 비활성화

## 비밀값 보관 위치

아래 값은 Git에 커밋하지 않는다.

- RDS endpoint
- 마스터 사용자명
- 마스터 비밀번호
- `DATABASE_URL`
- 보안 그룹에 등록한 로컬 IP

권장 보관 위치:

- 1Password, iCloud Keychain, Bitwarden 같은 비밀번호 관리자
- 개인 비공개 운영 노트
- 배포 서버의 `.env`

## S3 접근 방식

운영 서버는 Access Key를 `.env`에 저장하지 않는다. EC2 인스턴스에 IAM Role을 연결하고, FastAPI의 boto3 클라이언트는 해당 Role 권한으로 S3에 접근한다.

- IAM Role 이름: `gymin-ec2-s3-role`
- 신뢰할 수 있는 엔터티: EC2
- 현재 권한: `AmazonS3FullAccess`
- 운영 전 목표: 전체 S3 권한 대신 GymIn media bucket만 접근 가능한 커스텀 정책으로 축소
- S3 bucket 이름: `gymin-media-prod`

운영 `server/.env`에는 아래 값만 둔다.

```env
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=gymin-media-prod
S3_PRESIGNED_URL_EXPIRES_SECONDS=300
```

EC2 Docker 컨테이너에서 boto3가 IAM Role을 읽으려면 EC2 설정이 아래와 같아야 한다.

- EC2 인스턴스 `i-08a957884fd3a5583`에 IAM Role `gymin-ec2-s3-role` 연결
- EC2 metadata option의 `IMDSv2`는 `Required` 유지
- EC2 metadata option의 `Metadata response hop limit`은 `2`

확인 명령:

```bash
TOKEN=$(curl -sS -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -sS -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/iam/security-credentials/
sudo docker exec gymin-api python -c "import boto3; print(boto3.client('sts', region_name='ap-northeast-2').get_caller_identity()['Arn'])"
```

## 로컬 접속 체크리스트

1. RDS 상태가 `Available`인지 확인한다.
2. 보안 그룹 `gymin-rds-sg`의 inbound rule에 PostgreSQL `5432`를 내 현재 IP만 허용한다.
3. DBeaver에서 PostgreSQL 연결을 생성한다.
4. DB 이름, 사용자명, 비밀번호, endpoint, port `5432`를 입력한다.
5. 접속 후 `gymin` 데이터베이스가 있는지 확인한다.

## 운영 전 변경 예정

초기에는 로컬 접속 편의를 위해 퍼블릭 액세스를 열 수 있다. FastAPI 서버를 EC2 Docker로 올린 뒤에는 아래처럼 바꾸는 것을 목표로 한다.

- RDS inbound: 로컬 IP 대신 EC2 보안 그룹만 허용
- RDS public access: 가능하면 `No`
- 백업 보존 기간: 운영 전 `7일` 이상 검토
- 삭제 방지: 운영 전 활성화 검토
- DB 스펙: 트래픽 발생 시 `db.t4g.small` 이상 검토

## 비용 주의

현재 계정은 프리티어 대상이 아닐 가능성이 있으므로 RDS는 월 고정비가 발생할 수 있다.

- 예산 알림을 항상 유지한다.
- 사용하지 않을 경우 스냅샷 후 RDS 중지/삭제를 검토한다.
- 스토리지 자동 증가는 초기에는 꺼두고 필요할 때 조정한다.

## EC2 생성 정보

- 리전: `ap-northeast-2` 서울
- 용도: FastAPI Docker 배포 및 DBeaver SSH 터널 경유지
- AMI: Amazon Linux 2023
- 인스턴스 타입: `t3.micro`
- 키페어: `gymin-ec2-key`
- 키 파일 형식: `.pem`
- 스토리지: 기본 `8 GiB`
- 보안 그룹: 새 보안 그룹

### EC2 인바운드 규칙

- SSH `22`: GitHub Actions 배포를 위해 현재 `0.0.0.0/0` 허용
- SSH `22`: 내 로컬 IP 허용 규칙도 별도 유지 가능
- HTTP `80`: `0.0.0.0/0`
- HTTPS `443`: `0.0.0.0/0`

초기에는 FastAPI 직접 포트 `8000`을 열지 않는다. 이후 Nginx에서 `80/443` 요청을 Docker 컨테이너의 FastAPI 포트로 프록시한다.

운영 보안을 더 올릴 때는 SSH `0.0.0.0/0` 규칙을 self-hosted runner, SSM, 고정 배포 서버 방식으로 대체하는 것을 검토한다.

## DBeaver SSH 터널 목표 구조

최종적으로는 DBeaver가 EC2를 통해 RDS에 접속하는 구조를 목표로 한다.

```text
DBeaver
  -> EC2 SSH tunnel
  -> RDS PostgreSQL
```

RDS 보안 그룹은 운영 전 아래처럼 정리한다.

- PostgreSQL `5432`: EC2 보안 그룹만 허용
- 로컬 IP 직접 허용 규칙은 제거 검토
- 가능하면 RDS public access 비활성화 검토

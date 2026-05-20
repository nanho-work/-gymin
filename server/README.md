# GymIn FastAPI Server

GymIn 서버는 기능별로 코드를 분리한다. 한 기능 안에서 CRUD, service, router, schema가 같이 보이도록 구성해서 나중에 수정 위치를 쉽게 찾는 것을 우선한다.

## 구조

```text
server/
  app/
    main.py
    api/
      router.py
    common/
      pagination.py
    core/
      config.py
      security.py
    db/
      base.py
      session.py
    features/
      auth/
      users/
      business/
      centers/
      trainers/
      jobs/
      applications/
      media/
      stats/
```

## 기능 폴더 규칙

각 기능은 필요한 파일만 가진다.

```text
features/jobs/
  model.py      # SQLAlchemy model
  schema.py     # Pydantic request/response schema
  crud.py       # DB query
  service.py    # 비즈니스 로직
  router.py     # FastAPI endpoint
```

규칙:

- 모든 라우터는 `app/api/router.py`에 모아서 등록한다.
- DB 접근은 router에서 직접 하지 않고 service 또는 crud를 통한다.
- 페이지네이션은 `app/common/pagination.py`를 사용한다.
- 헤더/상단 카운터용 집계 API는 `features/stats`에서 관리한다.
- S3 업로드 URL 생성은 `features/media`에서 관리한다.
- 인증은 `features/auth`, 사용자/역할은 `features/users`에서 관리한다.
- 실제 RDS endpoint, DB 비밀번호, S3 bucket 이름은 `server/.env`에만 둔다.
- 운영 EC2에서는 `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`를 `.env`에 넣지 않고 EC2 IAM Role로 S3 권한을 받는다.
- `server/.env`는 Git에 올리지 않는다.

## 로컬 실행 예정

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
vi .env
uvicorn app.main:app --reload
```

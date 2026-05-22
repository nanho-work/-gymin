# S3 이미지 업로드 설정

GymIn은 이미지를 DB에 직접 저장하지 않고 S3에 업로드한 뒤 object key만 DB에 연결한다.

## 업로드 흐름

1. 프론트에서 로그인 쿠키를 포함해 `POST /api/media/presigned-upload`를 호출한다.
2. 서버가 현재 로그인 사용자를 확인하고 S3 presigned PUT URL을 발급한다.
3. 프론트가 해당 URL로 이미지 파일을 직접 PUT 업로드한다.
4. 프론트가 `POST /api/media/complete-upload`를 호출한다.
5. 서버가 S3 원본을 읽어 `original`, `medium`, `thumbnail` WebP 변환본을 생성한다.
6. 서버가 `media_files`, `media_file_variants`에 파일 메타데이터를 저장한다.

## 조회 흐름

S3 버킷은 private으로 운영한다. 프론트는 `object_key`를 직접 이미지 URL로 사용하지 않는다.
사용자 화면에는 원본 파일명이나 S3 object key를 노출하지 않는다. 파일명은 업로드 추적용 메타데이터로만 저장한다.

- 트레이너 내 프로필은 `GET /api/trainers/me` 응답의 `media`를 사용한다.
- 트레이너 공개 상세는 `GET /api/trainers/{trainer_id}` 응답의 `media`를 사용한다.
- 센터 공개 상세는 `GET /api/centers/{center_id}` 응답의 `media`를 사용한다.
- 소유자 관리용 미디어 목록은 `GET /api/media?entity_type=...&entity_id=...&purpose=...`를 사용한다.
- 서버는 각 `media_file_variants` 항목에 짧은 만료 시간의 presigned GET URL을 포함해 내려준다.
- 프론트는 `medium`, `thumbnail`, `original` 순서로 표시용 URL을 선택한다.

## 삭제 흐름

1. 프론트에서 로그인 쿠키를 포함해 `DELETE /api/media/{media_file_id}`를 호출한다.
2. 서버는 `media_files.owner_user_id`와 현재 로그인 사용자를 비교해 소유권을 확인한다.
3. 서버는 `media_files.status = 'deleted'`, `deleted_at = now()`로 soft delete한다.
4. S3의 WebP 변환본은 best-effort로 삭제한다.

트레이너 프로필 수정 화면에서는 기존 저장 이미지를 바로 삭제하지 않고, 편집 모드에서 삭제 표시 후 저장 버튼을 누를 때 삭제 API를 호출한다.
신규 업로드 직후 슬롯에서 제거하는 경우에는 해당 media file을 즉시 삭제한다.

## S3 key 규칙

업로드 파일은 로그인 사용자 ID 아래에 저장한다.

```text
users/{owner_user_id}/{entity_type}/{entity_id}/{purpose}/{file_uuid}.{ext}
```

업로드 직후 임시 원본 예시:

```text
users/0f4b.../trainer_profile/7a91.../portfolio/2d5c....jpg
```

변환 완료 후 실제 저장 예시:

```text
users/0f4b.../trainer_profile/7a91.../portfolio/2d5c.../original.webp
users/0f4b.../trainer_profile/7a91.../portfolio/2d5c.../medium.webp
users/0f4b.../trainer_profile/7a91.../portfolio/2d5c.../thumbnail.webp
```

사용자별 정리와 권한 검사를 쉽게 하기 위해 S3 경로에도 `owner_user_id`를 포함한다. DB에는 같은 값을 `media_files.owner_user_id`에 저장한다. 변환 완료 후 임시 원본은 삭제하고 WebP 변환본만 사용한다.

## 이미지 변환 규칙

- 대표/센터 사진: `thumbnail` 최대 240x320, `medium` 최대 600x800
- 포트폴리오/본문 사진: `thumbnail` 최대 360x360, `medium` 최대 1400x1400
- `original`: 긴 변 기준 최대 2000px
- 모든 변환본은 `image/webp`로 저장한다.

## 허용 파일

- `image/jpeg`
- `image/png`
- `image/webp`

프론트 기본 제한은 파일당 8MB다.

## S3 CORS

브라우저에서 S3 presigned PUT 업로드를 하려면 버킷 `gymin-media-prod`에 아래 CORS를 설정해야 한다.

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedOrigins": [
      "https://gymin.co.kr",
      "https://www.gymin.co.kr",
      "http://localhost:3000"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## purpose 값

- `profile`: 트레이너 대표 프로필 사진
- `representative`: 센터 대표 사진
- `gallery`: 센터 갤러리 사진
- `verification`: 사업자/센터 인증 자료
- `portfolio`: 트레이너 포트폴리오 사진
- `content`: 구인글 본문 이미지

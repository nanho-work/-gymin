# S3 이미지 업로드 설정

GymIn은 이미지를 DB에 직접 저장하지 않고 S3에 업로드한 뒤 object key만 DB에 연결한다.

## 업로드 흐름

1. 프론트에서 로그인 쿠키를 포함해 `POST /api/media/presigned-upload`를 호출한다.
2. 서버가 현재 로그인 사용자를 확인하고 S3 presigned PUT URL을 발급한다.
3. 프론트가 해당 URL로 이미지 파일을 직접 PUT 업로드한다.
4. 프로필, 센터, 구인글 저장 시 S3 object key를 `media_files`에 연결한다.

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


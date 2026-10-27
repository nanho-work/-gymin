# 왕건 기본 장비 모션 v1

2026-10-26. 이미지 생성 스킬과 built-in imagegen 사용.

- 조조 → 왕건, 군웅·이동6·원본 능력치 유지.
- 단검·가죽찰갑·기본 말·보조 없음. 왕관/왕복 초상화와 초기 전투 장비는 구분.
- 전용 머리·몸통·소매·하마 다리·탑승 다리 앞(SE)/뒤(NW) 10부품 + 단검1개. WebP 최대96px, 총35,992bytes.
- 경로: web/public/images/playable/wang-geon/base-v1/.
- 홍유 공통 리그에 선택적 skin을 추가. 기존 홍유 기본 경로와 동작 유지. 왕건은 단검52×52, 잡는점13/39(방향별), y39를 손 좌표에 등록.
- 부품 분리 원본 행 경계: 0/320/705/955/1265/1536, 열512. 반투명 외부 halo는 alpha128 미만만 제거 후 경량화. 앞/뒤 소매를 어깨·손 기준에 연결하고 실제 합성으로 확인.
- 4방향 × 탑승/하마 × 4동작 × 4단계. 말 보행은 cavalryMount 공통 자산. 인물 공격·스킬·하마 이동은 관절 조합 초안이며 손으로 그린 완성 애니메이션이나 게임 판정이 아님.
- 승급 및 다른 무기·탈것 선택은 후속 제작. 현재 UI에 미제작 선택지는 넣지 않음.
- 네 방향 대기 및 동작 핵심 단계 합성 시각 확인, 프로덕션 빌드 통과. 실제 브라우저/휴대폰 화면 검증은 미실시.
- 이번 생성 원본3개는 경량화·합성 확인 후 정리. 커밋·푸시 없음.

## 생성 프롬프트

{
  "parts": "Use case: stylized-concept. Transparent modular sprite PARTS SHEET for Wang Geon protagonist of Korean tactical RPG. Reference portrait is identity ONLY, not royal robes: same calm mature face and short black beard. Mobile pixel art strong dark outlines simple 3-tone shading, slim athletic body, NO chubby proportions. Exactly TWO columns FIVE rows ten disconnected parts with large transparent gutters, no labels. Left column front SE 5 o'clock facing right; right column back NW 11 o'clock facing left no face. Row1 head only short neck: black topknot restrained navy headband, NO crown (initial basic equipment). Row2 torso only no arms head legs: basic brown leather lamellar vest over navy tunic, ivory collar restrained burgundy belt, short skirt panels. Row3 single bent sleeve and fist only: front shoulder upper-left to fist lower-right; back shoulder upper-right to fist lower-left; navy sleeve small leather shoulder guard no weapon. Row4 pair standing trouser legs boots only, navy slim pants brown boots. Row5 pair bent seated riding legs boots only with gap for saddle, no horse. Same scale and palette across directions. Everything strictly within its cell. Clean true transparent exterior, no glow shadow background. No weapon no horse no duplicate limbs. Battle sprite parts NOT portrait painting.",
  "weapon": "Use case: stylized-concept. Single transparent game sprite of basic Korean short iron sword, blade points diagonally upper-right, pommel lower-left. No hand no scabbard no text no glow. Plain iron straight double-edged short blade, small dark bronze crossguard and dark brown wrapped grip. Grip center at approximately 25% width 75% height. Strong dark pixel-art outline, simple silver 3 tone shading, readable at 48px. Entire sword visible with transparent margin. Lowest tier basic equipment, not treasure."
}

## 색면 단순화 v2

왕건만 수정. 남색/갈색 중심, 붉은 허리띠 제거, 갑옷 잔무늬와 미세 반사광 축소. 얼굴·아이보리 옷깃과 외곽 경계 강조. 기본 말과 단검 및 홍유 자산 유지. base-v2 부품10개 총33,588bytes. 기존 리그 좌표와 동작 유지, 4방향 탑승·하마 합성 확인.

Use case: style-transfer. Edit this EXACT modular Korean game sprite sheet, 2 columns 5 rows. Preserve every part's exact silhouette, position, pose, face identity, anatomy, garment construction, direction and transparent gaps. Change ONLY palette and rendering: much simpler restrained pixel art, large flat color clusters, at most THREE tones per material. Navy blue cloth with clear light/mid/dark blocks; neutral muted medium brown leather armor, NOT yellow gold, NO metallic sparkles. Change red sash to dark navy to REMOVE an accent color. Bright ivory collar and face are the focus. Remove tiny armor rivets, tiny crosshatch, grain and micro-highlights: keep only a few broad horizontal lamellar divisions. Boots dark brown, clean near-black outline. NO added colors, no saturation boost, no royal embellishments. Readable small tactical sprite, not colorful illustration. No glow no shadows outside sprite; true transparent background. Maintain EXACT original cell locations and proportions, no new objects or merged pieces.

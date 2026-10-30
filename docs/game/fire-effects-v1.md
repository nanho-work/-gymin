# 화염 이펙트 추가 초안 — 2026-10-30

내장 image_gen으로 불벼락·화염 폭발·화룡·화염 파동·주작의 불꽃을 제작했다. 기존 파이어볼은 유지한다.

- 각 WebP 512×256, 4열2행, 128px 셀 8프레임. 각 원본 셀을 동일 배율로 104px 안에 축소하고 투명 여백으로 격리했다.
- 120ms/frame, 효과 8프레임 뒤 8틱 공백. 재생·정지·처음·프레임 선택 지원.
- 불벼락은 단일 타격, 화염 폭발/화룡은 십자, 화염 파동은 직선, 주작은 새 형상의 광역 연출 초안이다. 실제 범위는 카드의 기존 칸 도식을 따른다.
- 기존 기능·MP·사거리·범위·습득 조건은 변경하지 않았다. 전투 판정·시전자 동작·효과음·방향별 연출은 연결 전이다.
- 이미지 육안 점검, 화룡 브라우저 재생/정지/프레임 선택, Next 빌드 통과. 게임 내 전투 검증이나 최종 애니메이션 승인까지 뜻하지 않는다.
- 경량본 확인 후 이번 생성 PNG 5개만 정리했다.

| 경로 (web/public/images/skills/) | 바이트 |
|---|---:|
| firebolt-v1/sheet.webp |33330|
| fireburst-v1/sheet.webp |31140|
| firedragon-v1/sheet.webp |43646|
| firewave-v1/sheet.webp |32096|
| phoenix-v1/sheet.webp |59060|

새 파일 합계 199,272바이트. 기존 파이어볼 포함 221,992바이트.

## 생성 프롬프트 규격
Transparent pixel-art Korean fantasy tactical RPG VFX spritesheet. Exactly 4 columns by 2 rows equal cells, 8 sequential animation frames left-to-right top-to-bottom. No letters no borders no grid no characters. Strong readable orange red gold cream palette, crisp chunky pixel clusters, mobile-readable, matching classic tactical RPG fire spell. Each frame centered on same center and within central 65% of cell, generous fully transparent margins, nothing crosses cells. Sequence emergence, growth, peak, peak variation, contraction, breaking into embers, fewer embers, tiny final sparks.

효과별 지시: 불벼락은 아래로 내리치는 불길, 화염 폭발은 중심과 상하좌우의 십자 불길, 화룡은 뿔과 수염이 있는 동양 용, 화염 파동은 오른쪽으로 진행하는 파도형 불길, 주작은 날개를 펼친 불새. 모두 투명 배경 생성 후 동일 셀 규격으로 경량화한다.

# 홍유 모바일 가독성 시안 v1

2026-10-26. 중기병·5시·짧은창·기본 말의 정지 모습만 제작. 기존 모션/장비 리그는 교체하지 않는다. 승인 후 방향과 승급, 장비 부품 확장을 검토한다.

## 디자인

- 철색 갑옷·남색 옷·붉은 허리끈으로 갈색 말과 분리.
- 몸통·팔·어깨 보호구의 덩어리를 정돈하고 단순한 명암/윤곽으로 작은 화면의 구분 개선을 목표로 한다.
- 손으로 픽셀을 정리한 완성 게임 스프라이트가 아니라 생성 도구 기반 도트풍 초안이다.
- 초상화 일러스트는 그대로 유지. 실제 이동/공격 프레임 제작 완료가 아니다.

## 비교

HongMobileComparison: 64/80/96px, 풀밭/흙길/어두운 땅, 같은 기본 장비의 중기병 정지 리그와 나란히 비교. 표시 크기는 여백 포함. 기존 compact viewBox의 인물 높이에 맞춰 새 그림의 알파 영역을 긴 변98px로 축소하고128px 캔버스의 아래118px 기준에 배치했다. 생성 원화의 자세가 달라 픽셀 단위 일치 비교는 아니다.

파일: web/public/images/playable/hong-yu/mobile-heavy-se-v1.webp, 128×128 RGBA WebP quality82, 4,446bytes. 대형 원본은 경량본 검증 이후 이 작업분만 정리.

## 생성

Built-in imagegen. 참고: promotion-v3.webp의 가운데 중기병. 최종 프롬프트:

```text
Use case: style-transfer. Reference image is a three-rank Hong Yu Korean tactical RPG cavalry concept strip. Create ONE isolated single mounted character, based ONLY on the MIDDLE rank: Hong Yu heavy cavalry, silver metal forehead band (NOT helmet), black topknot, short black moustache and beard, silver lamellar cuirass, short basic spear, plain brown horse. New MOBILE GAMEPLAY sprite style, clearly readable at 64 to 96 pixels high, crisp pixel-art-like clusters, strong one-pixel-looking dark outline, flat three-level shading rather than painterly gradients, compact limited palette. Keep the recognizable Korean general face but make proportions notably less squat and less bulky: narrower torso, small flat shoulder guards, slim separated forearms, longer readable waist, normal athletic human, not huge head chibi. Face has simple expressive dark brows and peach skin separated from hair. Silver-blue armor highlights, dark indigo sleeves/trousers, small brick-red waist tie, muted warm chestnut horse with charcoal mane. Strong value separation between cool rider and warm horse. Three-quarter FRONT view facing lower-right / 5 o'clock / southeast, rider and horse aligned together. RIGHT anatomical hand holds short spear diagonally upward-forward toward image upper-right, other hand holds reins in front; no crossed arms, far leg behind horse and only near leg visible in front. Horse standing still naturally, four legs anatomically clear; no bulky horse armor, no fancy tack. Whole horse and rider and spear visible with safe padding, ground plane consistent. Native retro tactical sprite appearance, deliberate hard-edged pixel clusters, NOT smooth cartoon render, NOT illustration portrait, NOT photoreal. Single sprite on truly transparent square canvas, no labels, no text, no grid, no shadow disk, no panels, no duplicated figures. This is a new gameplay readability proposal, not a miniature detailed painting.
```

## 검증과 정리

로컬 빌드 성공. 브라우저에서64px 풀밭,96px 어두운 땅,80px 흙길 전환과 비교 표시 확인. 실물 모바일 기기에서의 확인은 아직 하지 않았다. 대형 생성 PNG 한 개는 경량본 연결·검수 후 정리했다.

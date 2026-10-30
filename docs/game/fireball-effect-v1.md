# 파이어볼 이펙트 초안 — 2026-10-30

- 제작: 내장 image_gen. 완성 캐릭터와 분리된 투명 VFX.
- 경량본: web/public/images/skills/fireball-v1/sheet.webp (384×288, 22,720바이트).
- 셀: 96×96, 4열3행. 0–3 투사체 반복, 4–11 명중부터 잔불.
- 미리보기: 100ms/frame. 전체는 비행12틱, 명중8틱, 공백8틱 후 반복. 실제 게임 타이밍은 미확정.
- 공통 축소 비율과 셀 내부 여백 유지. 모바일 판독성을 위한 제한 색감. 방향별·캐릭터 시전·효과음·판정은 후속.
- 원본 정리: 경량본과 화면 확인 뒤 이번 생성 PNG 삭제. 다른 원본은 변경하지 않음.

생성 프롬프트:
Create a production game VFX sprite sheet, stylized-concept, transparent alpha background. EXACT 4 columns x 3 rows equal cells, square overall. 12 animation frames read left to right then top to bottom. No labels, no grid lines, no text, no background, no characters. Korean historical fantasy tactical pixel-art RPG, crisp limited palette orange red golden yellow cream hot core, strong readable silhouette, hand-pixeled look not photoreal or blurry. Each cell generous empty transparent margin all around, no flame crosses cell boundaries. Row1 frames1-4: small fireball traveling RIGHT, stable ball center at cell center, leftward tail flickers between frames, same scale. Rows2-3 frames5-12: single stationary impact explosion centered EXACTLY at cell center: small ignition, swelling orange flash, larger peak flame burst, widest peak with pointed tongues, contracting red flames, scattered embers, fewer fading embers, tiny last sparks. Biggest burst fits within central 65 percent of its cell. All frames standalone, no connecting trails between cells. For low resolution mobile game display, visible chunky clusters, no tiny filigree. This is only a fire projectile and hit effect asset.

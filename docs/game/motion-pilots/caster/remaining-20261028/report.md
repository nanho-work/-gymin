# 술법·무용수 잔여 모션 — 2026-10-28

담당9종은 사전 조사 당시 승인5시 정지 모델만 존재: 완성 모션 실제 미제작, 재사용 완성프레임0장. 기존 책사24/25/26과 공통 연결 코드는 보존. 신규 경로의 UI 연결은 총괄 담당.

현재 상태: 담당9종720장 저장 및 정적 시간순 검수 완료. 공통UI 연결·실제 브라우저 재생·사용자 승인은 총괄 후속 범위.

|병과|단계|프레임|용량(bytes)|검수|
|---|---|---:|---:|---|
|36 무용수|0|80|325442|static-reviewed-draft|
|37 무희|1|80|368398|static-reviewed-draft|
|38 무녀|2|80|356098|static-reviewed-draft|
|27 풍수사|0|80|345864|static-reviewed-draft|
|28 방술사|1|80|371180|static-reviewed-draft|
|29 선술사|2|80|356586|static-reviewed-draft|
|30 도사|0|80|292806|static-reviewed-draft|
|31 환술사|1|80|318938|static-reviewed-draft|
|32 요술사|2|80|329504|static-reviewed-draft|

## 공통 규격과 검수 범위

160×160 투명WebP 품질78, 발 중심x80·하단y150. 기본체고106px, 방향별16프레임 공통배율. 전체 인물 연결영역 추출·경량화만 수행하며 신체조합·좌우반전·정지복사 없음. 4방향×4동작×4프레임=전투64장, 빈손 시나리오16장. 대기320/이동170/공격190/스킬240/시나리오360ms. 정적80장 검수와 정확4프레임 루프파일 제공. 실시간 브라우저 재생·실게임 동작·사용자승인은 별도. 프레임 수 검사는 완성도 판정이 아님.

생성은 내장 image_gen. 아래 모든 프롬프트와 원본SHA, 파일SHA는 manifest에 보존. 큰 원본 정리는 경량본 검수 후 이번 작업분에만 적용.

## 36 무용수

참조: `web/public/images/job-models/se-v1/job-36.webp`

- combat: `/images/class-motion-pilot/caster/job-36/remaining-20261028/combat-v1` (64장)
- scenario: `/images/class-motion-pilot/caster/job-36/remaining-20261028/scenario-v1` (16장)

남은 한계:
- 정적 시간순 검수 완료, 실제 브라우저 연속재생 미검수. 사용자 최종 승인 전 초안.
- 긴 치마/도포가 무릎을 가려 이동1/3 교대보행 가독성이 제한됨.
- 공격2→3 회복이 한 프레임이고 머리카락/옷자락이 변해 실제 타이밍 검수 필요.
- 머리장식·옷 세부 문양과 무기 원근 길이에 작은 생성 편차.

프롬프트:

### r-nw

```text
Use case: identity-preserve. Asset: complete-character tactical RPG animation sprite sheet. Use reference ONLY for exact identity, hair, face, clothing colors, silhouette, trim and fixed weapon. Entire connected figure per cell, never body part collage or mirrored hands. True transparent background. Exactly FOUR ROWS FOUR COLUMNS, 16 equal square cells. Same head/body scale in every cell. Each figure INCLUDING weapon confined to central60% cell with20% transparent gutters; feet baseline80%. Crisp outlined softly shaded small game sprites like reference. No text, grid, glow, shadows or particles.
Rows are actions, columns time0..3.
Row1 idle: small breathing changes shoulders and sleeves, feet planted.
Row2 walk: distinct in-place foot phases left stride, passing, right stride, passing; knees and cloth respond, no whole-image translation substitute.
Row3 attack:0 bent elbow ready weapon close;1 windup;2 short forward strike;3 recover elbow bent weapon close matching0. Keep compact reach.
Row4 skill:0 ready;1 lift free hand and weapon;2 ritual gesture with small upper-body motion;3 lower hands recover matching0. No magic effects.
Weapon always anatomical RIGHT hand, left empty. No extra weapons. Arms neck wrists legs connected. NO crossing or swapping arms. Preserve exact costume stage and correct direction for every pose.
ALL16 face NORTHWEST11, BACK LEFT AWAY viewer. Show back of head and clothing; nose and toes point screen LEFT. Right weapon arm near viewer.
Adult female dancer, burgundy skirt, cream loose sleeves, dark hair half-up red ribbon, modest cream/burgundy top. Preserve SHORT SLENDER STRAIGHT METAL BLADE from approved reference, NOT a fan or a large club. No invented upgrade.
```

### fix-nw

```text
REDRAW EVERY ONE of16 figures facing NORTHWEST: BACK LEFT 11 o'clock. Currently many incorrectly face FRONT RIGHT! Show BACK of torso and head, nose/toes LEFT; NO front chest or frontal face. Anatomical right hand retains weapon, NO MIRROR. Preserve exact costume, face identity and16 action poses/order: rows idle/walk/attack/skill, columns0..3. Entire connected bodies. Attack and skill end at ready position. True transparency, no effects/text. Compact full figures with20% transparent gutters; uniform scale all16. Crucial ALL16 BACK LEFT.
```

### hand-nw

```text
Fix WEAPON HAND consistency in this NW BACK LEFT sheet. In ALL16 cells weapon must stay in NEAR anatomical RIGHT arm on screen LEFT, empty FAR LEFT arm on screen RIGHT. In attack row3 column2 and skill row4 columns2/3 weapon is incorrectly held screenRIGHT: REDRAW those full figures raising weapon on screenLEFT near shoulder and raise EMPTY palm on screenRIGHT. Do NOT turn torso to opposite side or exchange hands. Face/back LEFT throughout. Preserve exact costume weapon identity and all other poses,4x4layout true alpha, wide gutters. Entire bodies no collage.
```

### r-ne

```text
Use case: identity-preserve. Asset: complete-character tactical RPG animation sprite sheet. Use reference ONLY for exact identity, hair, face, clothing colors, silhouette, trim and fixed weapon. Entire connected figure per cell, never body part collage or mirrored hands. True transparent background. Exactly FOUR ROWS FOUR COLUMNS, 16 equal square cells. Same head/body scale in every cell. Each figure INCLUDING weapon confined to central60% cell with20% transparent gutters; feet baseline80%. Crisp outlined softly shaded small game sprites like reference. No text, grid, glow, shadows or particles.
Rows are actions, columns time0..3.
Row1 idle: small breathing changes shoulders and sleeves, feet planted.
Row2 walk: distinct in-place foot phases left stride, passing, right stride, passing; knees and cloth respond, no whole-image translation substitute.
Row3 attack:0 bent elbow ready weapon close;1 windup;2 short forward strike;3 recover elbow bent weapon close matching0. Keep compact reach.
Row4 skill:0 ready;1 lift free hand and weapon;2 ritual gesture with small upper-body motion;3 lower hands recover matching0. No magic effects.
Weapon always anatomical RIGHT hand, left empty. No extra weapons. Arms neck wrists legs connected. NO crossing or swapping arms. Preserve exact costume stage and correct direction for every pose.
ALL16 face NORTHEAST2, BACK RIGHT AWAY viewer. Show back of head and clothing; nose and toes point screen RIGHT. Right weapon arm FAR from viewer.
Adult female dancer, burgundy skirt, cream loose sleeves, dark hair half-up red ribbon, modest cream/burgundy top. Preserve SHORT SLENDER STRAIGHT METAL BLADE from approved reference, NOT a fan or a large club. No invented upgrade.
```

### r-se

```text
Use case: identity-preserve. Asset: complete-character tactical RPG animation sprite sheet. Use reference ONLY for exact identity, hair, face, clothing colors, silhouette, trim and fixed weapon. Entire connected figure per cell, never body part collage or mirrored hands. True transparent background. Exactly FOUR ROWS FOUR COLUMNS, 16 equal square cells. Same head/body scale in every cell. Each figure INCLUDING weapon confined to central60% cell with20% transparent gutters; feet baseline80%. Crisp outlined softly shaded small game sprites like reference. No text, grid, glow, shadows or particles.
Rows are actions, columns time0..3.
Row1 idle: small breathing changes shoulders and sleeves, feet planted.
Row2 walk: distinct in-place foot phases left stride, passing, right stride, passing; knees and cloth respond, no whole-image translation substitute.
Row3 attack:0 bent elbow ready weapon close;1 windup;2 short forward strike;3 recover elbow bent weapon close matching0. Keep compact reach.
Row4 skill:0 ready;1 lift free hand and weapon;2 ritual gesture with small upper-body motion;3 lower hands recover matching0. No magic effects.
Weapon always anatomical RIGHT hand, left empty. No extra weapons. Arms neck wrists legs connected. NO crossing or swapping arms. Preserve exact costume stage and correct direction for every pose.
ALL16 face SOUTHEAST5, FRONT RIGHT toward viewer, nose and toes screen RIGHT. Right weapon arm near viewer.
Adult female dancer, burgundy skirt, cream loose sleeves, dark hair half-up red ribbon, modest cream/burgundy top. Preserve SHORT SLENDER STRAIGHT METAL BLADE from approved reference, NOT a fan or a large club. No invented upgrade.
```

### r-sw

```text
Use case: identity-preserve. Asset: complete-character tactical RPG animation sprite sheet. Use reference ONLY for exact identity, hair, face, clothing colors, silhouette, trim and fixed weapon. Entire connected figure per cell, never body part collage or mirrored hands. True transparent background. Exactly FOUR ROWS FOUR COLUMNS, 16 equal square cells. Same head/body scale in every cell. Each figure INCLUDING weapon confined to central60% cell with20% transparent gutters; feet baseline80%. Crisp outlined softly shaded small game sprites like reference. No text, grid, glow, shadows or particles.
Rows are actions, columns time0..3.
Row1 idle: small breathing changes shoulders and sleeves, feet planted.
Row2 walk: distinct in-place foot phases left stride, passing, right stride, passing; knees and cloth respond, no whole-image translation substitute.
Row3 attack:0 bent elbow ready weapon close;1 windup;2 short forward strike;3 recover elbow bent weapon close matching0. Keep compact reach.
Row4 skill:0 ready;1 lift free hand and weapon;2 ritual gesture with small upper-body motion;3 lower hands recover matching0. No magic effects.
Weapon always anatomical RIGHT hand, left empty. No extra weapons. Arms neck wrists legs connected. NO crossing or swapping arms. Preserve exact costume stage and correct direction for every pose.
ALL16 face SOUTHWEST7, FRONT LEFT toward viewer, nose and toes screen LEFT. Right weapon arm FAR from viewer on screen LEFT. Near left arm EMPTY on screen RIGHT.
Adult female dancer, burgundy skirt, cream loose sleeves, dark hair half-up red ribbon, modest cream/burgundy top. Preserve SHORT SLENDER STRAIGHT METAL BLADE from approved reference, NOT a fan or a large club. No invented upgrade.
```

### fix-sw

```text
CORRECT ALL16 figures to SOUTHWEST FRONT LEFT7 o'clock. Every nose, torso, toes points screen LEFT, never RIGHT. Redraw whole figures; DO NOT MIRROR. Right weapon hand is FAR on screen LEFT holding short straight blade; near LEFT hand screen RIGHT empty. Preserve female face hairstyle burgundy skirt cream blouse,4x4 layout, rows idle walk attack skill, four time frames per row with recovery at3. Attack extends blade toward LEFT. Full connected bodies. All same scale,20% transparent gutters, no effects text. No front-right pose anywhere.
```

### r-scenario

```text
Use case: identity-preserve. Create complete-body peaceful standing sprite sheet matching approved reference identity hair and costume exactly. REMOVE weapon and scabbard completely; both hands empty naturally relaxed. Exactly4 rows x4 columns equal cells. Row1 northwest11 BACK LEFT; row2 northeast2 BACK RIGHT; row3 southeast5 FRONT RIGHT; row4 southwest7 FRONT LEFT. Columns0..3 distinct subtle breathing poses shoulders sleeves and chest, planted feet, frame3 nearly matches0. Full connected bodies, NO parts collage, no mirroring. Same scale all16. Figure central60% cell,20% clear transparent gutters, feet at80%. True alpha, no shadow/text/grid/effects. Crisp small tactical RPG reference style.
Adult female dancer, burgundy skirt, cream loose sleeves, dark hair half-up red ribbon, modest cream/burgundy top. Preserve SHORT SLENDER STRAIGHT METAL BLADE from approved reference, NOT a fan or a large club. No invented upgrade.
```

## 37 무희

참조: `web/public/images/job-models/promotion-se-v1/job-37.webp`

- combat: `/images/class-motion-pilot/caster/job-37/remaining-20261028/combat-v1` (64장)
- scenario: `/images/class-motion-pilot/caster/job-37/remaining-20261028/scenario-v1` (16장)

남은 한계:
- 정적 시간순 검수 완료, 실제 브라우저 연속재생 미검수. 사용자 최종 승인 전 초안.
- 긴 치마/도포가 무릎을 가려 이동1/3 교대보행 가독성이 제한됨.
- 공격2→3 회복이 한 프레임이고 머리카락/옷자락이 변해 실제 타이밍 검수 필요.
- 머리장식·옷 세부 문양과 무기 원근 길이에 작은 생성 편차.

프롬프트:

### r-nw

```text
Use case: identity-preserve. Asset: complete-character tactical RPG animation sprite sheet. Use reference ONLY for exact identity, hair, face, clothing colors, silhouette, trim and fixed weapon. Entire connected figure per cell, never body part collage or mirrored hands. True transparent background. Exactly FOUR ROWS FOUR COLUMNS, 16 equal square cells. Same head/body scale in every cell. Each figure INCLUDING weapon confined to central60% cell with20% transparent gutters; feet baseline80%. Crisp outlined softly shaded small game sprites like reference. No text, grid, glow, shadows or particles.
Rows are actions, columns time0..3.
Row1 idle: small breathing changes shoulders and sleeves, feet planted.
Row2 walk: distinct in-place foot phases left stride, passing, right stride, passing; knees and cloth respond, no whole-image translation substitute.
Row3 attack:0 bent elbow ready weapon close;1 windup;2 short forward strike;3 recover elbow bent weapon close matching0. Keep compact reach.
Row4 skill:0 ready;1 lift free hand and weapon;2 ritual gesture with small upper-body motion;3 lower hands recover matching0. No magic effects.
Weapon always anatomical RIGHT hand, left empty. No extra weapons. Arms neck wrists legs connected. NO crossing or swapping arms. Preserve exact costume stage and correct direction for every pose.
ALL16 face NORTHWEST11, BACK LEFT AWAY viewer. Show back of head and clothing; nose and toes point screen LEFT. Right weapon arm near viewer.
Adult female dancer, burgundy/cream layered robe with patterned cream lower panels, burgundy hair ribbons. Right hand iron-banded wooden club EXACT reference.
```

### hand-nw

```text
Fix WEAPON HAND consistency in this NW BACK LEFT sheet. In ALL16 cells weapon must stay in NEAR anatomical RIGHT arm on screen LEFT, empty FAR LEFT arm on screen RIGHT. In attack row3 column2 and skill row4 columns2/3 weapon is incorrectly held screenRIGHT: REDRAW those full figures raising weapon on screenLEFT near shoulder and raise EMPTY palm on screenRIGHT. Do NOT turn torso to opposite side or exchange hands. Face/back LEFT throughout. Preserve exact costume weapon identity and all other poses,4x4layout true alpha, wide gutters. Entire bodies no collage.
```

### hand2--nw

```text
Fix ONLY row4 column3 skill pose weapon hand: club must be held in NEAR anatomical RIGHT hand on screen LEFT, same hand as row4 column2. EMPTY far left hand on screenRIGHT. No hands exchange club. Preserve back-left head/torso direction and all other15 cells. Full connected figure, no mirror. True transparency,4x4.
```

### r-ne

```text
Use case: identity-preserve. Asset: complete-character tactical RPG animation sprite sheet. Use reference ONLY for exact identity, hair, face, clothing colors, silhouette, trim and fixed weapon. Entire connected figure per cell, never body part collage or mirrored hands. True transparent background. Exactly FOUR ROWS FOUR COLUMNS, 16 equal square cells. Same head/body scale in every cell. Each figure INCLUDING weapon confined to central60% cell with20% transparent gutters; feet baseline80%. Crisp outlined softly shaded small game sprites like reference. No text, grid, glow, shadows or particles.
Rows are actions, columns time0..3.
Row1 idle: small breathing changes shoulders and sleeves, feet planted.
Row2 walk: distinct in-place foot phases left stride, passing, right stride, passing; knees and cloth respond, no whole-image translation substitute.
Row3 attack:0 bent elbow ready weapon close;1 windup;2 short forward strike;3 recover elbow bent weapon close matching0. Keep compact reach.
Row4 skill:0 ready;1 lift free hand and weapon;2 ritual gesture with small upper-body motion;3 lower hands recover matching0. No magic effects.
Weapon always anatomical RIGHT hand, left empty. No extra weapons. Arms neck wrists legs connected. NO crossing or swapping arms. Preserve exact costume stage and correct direction for every pose.
ALL16 face NORTHEAST2, BACK RIGHT AWAY viewer. Show back of head and clothing; nose and toes point screen RIGHT. Right weapon arm FAR from viewer.
Adult female dancer, burgundy/cream layered robe with patterned cream lower panels, burgundy hair ribbons. Right hand iron-banded wooden club EXACT reference.
```

### r-se

```text
Use case: identity-preserve. Asset: complete-character tactical RPG animation sprite sheet. Use reference ONLY for exact identity, hair, face, clothing colors, silhouette, trim and fixed weapon. Entire connected figure per cell, never body part collage or mirrored hands. True transparent background. Exactly FOUR ROWS FOUR COLUMNS, 16 equal square cells. Same head/body scale in every cell. Each figure INCLUDING weapon confined to central60% cell with20% transparent gutters; feet baseline80%. Crisp outlined softly shaded small game sprites like reference. No text, grid, glow, shadows or particles.
Rows are actions, columns time0..3.
Row1 idle: small breathing changes shoulders and sleeves, feet planted.
Row2 walk: distinct in-place foot phases left stride, passing, right stride, passing; knees and cloth respond, no whole-image translation substitute.
Row3 attack:0 bent elbow ready weapon close;1 windup;2 short forward strike;3 recover elbow bent weapon close matching0. Keep compact reach.
Row4 skill:0 ready;1 lift free hand and weapon;2 ritual gesture with small upper-body motion;3 lower hands recover matching0. No magic effects.
Weapon always anatomical RIGHT hand, left empty. No extra weapons. Arms neck wrists legs connected. NO crossing or swapping arms. Preserve exact costume stage and correct direction for every pose.
ALL16 face SOUTHEAST5, FRONT RIGHT toward viewer, nose and toes screen RIGHT. Right weapon arm near viewer.
Adult female dancer, burgundy/cream layered robe with patterned cream lower panels, burgundy hair ribbons. Right hand iron-banded wooden club EXACT reference.
```

### r-sw

```text
Use case: identity-preserve. Asset: complete-character tactical RPG animation sprite sheet. Use reference ONLY for exact identity, hair, face, clothing colors, silhouette, trim and fixed weapon. Entire connected figure per cell, never body part collage or mirrored hands. True transparent background. Exactly FOUR ROWS FOUR COLUMNS, 16 equal square cells. Same head/body scale in every cell. Each figure INCLUDING weapon confined to central60% cell with20% transparent gutters; feet baseline80%. Crisp outlined softly shaded small game sprites like reference. No text, grid, glow, shadows or particles.
Rows are actions, columns time0..3.
Row1 idle: small breathing changes shoulders and sleeves, feet planted.
Row2 walk: distinct in-place foot phases left stride, passing, right stride, passing; knees and cloth respond, no whole-image translation substitute.
Row3 attack:0 bent elbow ready weapon close;1 windup;2 short forward strike;3 recover elbow bent weapon close matching0. Keep compact reach.
Row4 skill:0 ready;1 lift free hand and weapon;2 ritual gesture with small upper-body motion;3 lower hands recover matching0. No magic effects.
Weapon always anatomical RIGHT hand, left empty. No extra weapons. Arms neck wrists legs connected. NO crossing or swapping arms. Preserve exact costume stage and correct direction for every pose.
ALL16 face SOUTHWEST7, FRONT LEFT toward viewer, nose and toes screen LEFT. Right weapon arm FAR from viewer on screen LEFT. Near left arm EMPTY on screen RIGHT.
Adult female dancer, burgundy/cream layered robe with patterned cream lower panels, burgundy hair ribbons. Right hand iron-banded wooden club EXACT reference.
```

### fix-sw

```text
REDRAW ALL16 as FRONT LEFT SOUTHWEST7 o'clock. Nose, torso, toes LEFT in every cell, NOT RIGHT. Entire figure changes view, not gaze only. Anatomical RIGHT hand far screen LEFT holds same iron-banded wooden club, near LEFT hand screen RIGHT empty. Do not mirror. Same adult woman, burgundy/cream embroidered robe and hair. Keep4x4 actions idle/walk/attack/skill, columns0..3, end attack/skill at ready. Compact strike toward LEFT. True transparency20% gutters, no effects text.
```

### fix2--sw

```text
Fix ONLY ROW3 COLUMN3 (attack release). It wrongly attacks RIGHT. Redraw that ONE complete figure attacking LEFT facing southwest FRONT LEFT, nose LEFT, right arm extends club LEFT, left arm empty. Same club and woman. Keep ALL OTHER15 cells pixel appearance, exact4x4 arrangement, true alpha. The target whole figure head torso boots and club must all face LEFT like idle row1. Compact reach with wide gutters, no effects.
```

### fix3--sw

```text
Correct gaze/direction of row3 column2 and row4 columns2,3: female face NOSE points screenLEFT, head and torso stay SOUTHWEST FRONT LEFT like row1. Preserve raised right club arm, empty left arm, costume and all16poses. No faces looking right. Exact4x4 true transparency, no mirroring no effects.
```

### r-scenario

```text
Use case: identity-preserve. Create complete-body peaceful standing sprite sheet matching approved reference identity hair and costume exactly. REMOVE weapon and scabbard completely; both hands empty naturally relaxed. Exactly4 rows x4 columns equal cells. Row1 northwest11 BACK LEFT; row2 northeast2 BACK RIGHT; row3 southeast5 FRONT RIGHT; row4 southwest7 FRONT LEFT. Columns0..3 distinct subtle breathing poses shoulders sleeves and chest, planted feet, frame3 nearly matches0. Full connected bodies, NO parts collage, no mirroring. Same scale all16. Figure central60% cell,20% clear transparent gutters, feet at80%. True alpha, no shadow/text/grid/effects. Crisp small tactical RPG reference style.
Adult female dancer, burgundy/cream layered robe with patterned cream lower panels, burgundy hair ribbons. Right hand iron-banded wooden club EXACT reference.
```

## 38 무녀

참조: `web/public/images/job-models/promotion-se-v1/job-38.webp`

- combat: `/images/class-motion-pilot/caster/job-38/remaining-20261028/combat-v1` (64장)
- scenario: `/images/class-motion-pilot/caster/job-38/remaining-20261028/scenario-v1` (16장)

남은 한계:
- 시각 초안, 실제 전투판정 및 사이트 연결 미작업
- 브라우저 실제 연속재생 육안 검수 미완료

프롬프트:

### r-nw

```text
Use case: identity-preserve. Asset: complete-character tactical RPG animation sprite sheet. Use reference ONLY for exact identity, hair, face, clothing colors, silhouette, trim and fixed weapon. Entire connected figure per cell, never body part collage or mirrored hands. True transparent background. Exactly FOUR ROWS FOUR COLUMNS, 16 equal square cells. Same head/body scale in every cell. Each figure INCLUDING weapon confined to central60% cell with20% transparent gutters; feet baseline80%. Crisp outlined softly shaded small game sprites like reference. No text, grid, glow, shadows or particles.
Rows are actions, columns time0..3.
Row1 idle: small breathing changes shoulders and sleeves, feet planted.
Row2 walk: distinct in-place foot phases left stride, passing, right stride, passing; knees and cloth respond, no whole-image translation substitute.
Row3 attack:0 bent elbow ready weapon close;1 windup;2 short forward strike;3 recover elbow bent weapon close matching0. Keep compact reach.
Row4 skill:0 ready;1 lift free hand and weapon;2 ritual gesture with small upper-body motion;3 lower hands recover matching0. No magic effects.
Weapon always anatomical RIGHT hand, left empty. No extra weapons. Arms neck wrists legs connected. NO crossing or swapping arms. Preserve exact costume stage and correct direction for every pose.
ALL16 face NORTHWEST11, BACK LEFT AWAY viewer. Show back of head and clothing; nose and toes point screen LEFT. Right weapon arm near viewer.
Adult female dancer, ornate burgundy/ivory/gold long robe, gold hair ornaments, gold-trimmed sleeves. Right hand gold/iron-studded heavy wooden club EXACT reference.
```

### fix-nw

```text
REDRAW EVERY ONE of16 figures facing NORTHWEST: BACK LEFT 11 o'clock. Currently many incorrectly face FRONT RIGHT! Show BACK of torso and head, nose/toes LEFT; NO front chest or frontal face. Anatomical right hand retains weapon, NO MIRROR. Preserve exact costume, face identity and16 action poses/order: rows idle/walk/attack/skill, columns0..3. Entire connected bodies. Attack and skill end at ready position. True transparency, no effects/text. Compact full figures with20% transparent gutters; uniform scale all16. Crucial ALL16 BACK LEFT.
```

### fix2--nw

```text
Fix ONLY row4 column3 skill pose weapon hand: club must be held in NEAR anatomical RIGHT hand on screen LEFT, same hand as row4 column2. EMPTY far left hand on screenRIGHT. No hands exchange club. Preserve back-left head/torso direction and all other15 cells. Full connected figure, no mirror. True transparency, wide gutters, no text/effects, exact4x4.
```

### r-ne

```text
Use case: identity-preserve. Asset: complete-character tactical RPG animation sprite sheet. Use reference ONLY for exact identity, hair, face, clothing colors, silhouette, trim and fixed weapon. Entire connected figure per cell, never body part collage or mirrored hands. True transparent background. Exactly FOUR ROWS FOUR COLUMNS, 16 equal square cells. Same head/body scale in every cell. Each figure INCLUDING weapon confined to central60% cell with20% transparent gutters; feet baseline80%. Crisp outlined softly shaded small game sprites like reference. No text, grid, glow, shadows or particles.
Rows are actions, columns time0..3.
Row1 idle: small breathing changes shoulders and sleeves, feet planted.
Row2 walk: distinct in-place foot phases left stride, passing, right stride, passing; knees and cloth respond, no whole-image translation substitute.
Row3 attack:0 bent elbow ready weapon close;1 windup;2 short forward strike;3 recover elbow bent weapon close matching0. Keep compact reach.
Row4 skill:0 ready;1 lift free hand and weapon;2 ritual gesture with small upper-body motion;3 lower hands recover matching0. No magic effects.
Weapon always anatomical RIGHT hand, left empty. No extra weapons. Arms neck wrists legs connected. NO crossing or swapping arms. Preserve exact costume stage and correct direction for every pose.
ALL16 face NORTHEAST2, BACK RIGHT AWAY viewer. Show back of head and clothing; nose and toes point screen RIGHT. Right weapon arm FAR from viewer.
Adult female dancer, ornate burgundy/ivory/gold long robe, gold hair ornaments, gold-trimmed sleeves. Right hand gold/iron-studded heavy wooden club EXACT reference.
```

### reach-ne

```text
Fix ONLY row3 column3 attack release. Bring club+weapon hand 20% CLOSER to torso by bending elbow; shorten reach, full club remains visible. Keep head/body/feet same scale, exact ornate burgundy gold costume, backRIGHT direction. Other15cells unchanged. Do not shrink individual character. Transparent4x4 no effects.
```

### r-se

```text
Use case: identity-preserve. Asset: complete-character tactical RPG animation sprite sheet. Use reference ONLY for exact identity, hair, face, clothing colors, silhouette, trim and fixed weapon. Entire connected figure per cell, never body part collage or mirrored hands. True transparent background. Exactly FOUR ROWS FOUR COLUMNS, 16 equal square cells. Same head/body scale in every cell. Each figure INCLUDING weapon confined to central60% cell with20% transparent gutters; feet baseline80%. Crisp outlined softly shaded small game sprites like reference. No text, grid, glow, shadows or particles.
Rows are actions, columns time0..3.
Row1 idle: small breathing changes shoulders and sleeves, feet planted.
Row2 walk: distinct in-place foot phases left stride, passing, right stride, passing; knees and cloth respond, no whole-image translation substitute.
Row3 attack:0 bent elbow ready weapon close;1 windup;2 short forward strike;3 recover elbow bent weapon close matching0. Keep compact reach.
Row4 skill:0 ready;1 lift free hand and weapon;2 ritual gesture with small upper-body motion;3 lower hands recover matching0. No magic effects.
Weapon always anatomical RIGHT hand, left empty. No extra weapons. Arms neck wrists legs connected. NO crossing or swapping arms. Preserve exact costume stage and correct direction for every pose.
ALL16 face SOUTHEAST5, FRONT RIGHT toward viewer, nose and toes screen RIGHT. Right weapon arm near viewer.
Adult female dancer, ornate burgundy/ivory/gold long robe, gold hair ornaments, gold-trimmed sleeves. Right hand gold/iron-studded heavy wooden club EXACT reference.
```

### r-sw

```text
Use case: identity-preserve. Asset: complete-character tactical RPG animation sprite sheet. Use reference ONLY for exact identity, hair, face, clothing colors, silhouette, trim and fixed weapon. Entire connected figure per cell, never body part collage or mirrored hands. True transparent background. Exactly FOUR ROWS FOUR COLUMNS, 16 equal square cells. Same head/body scale in every cell. Each figure INCLUDING weapon confined to central60% cell with20% transparent gutters; feet baseline80%. Crisp outlined softly shaded small game sprites like reference. No text, grid, glow, shadows or particles.
Rows are actions, columns time0..3.
Row1 idle: small breathing changes shoulders and sleeves, feet planted.
Row2 walk: distinct in-place foot phases left stride, passing, right stride, passing; knees and cloth respond, no whole-image translation substitute.
Row3 attack:0 bent elbow ready weapon close;1 windup;2 short forward strike;3 recover elbow bent weapon close matching0. Keep compact reach.
Row4 skill:0 ready;1 lift free hand and weapon;2 ritual gesture with small upper-body motion;3 lower hands recover matching0. No magic effects.
Weapon always anatomical RIGHT hand, left empty. No extra weapons. Arms neck wrists legs connected. NO crossing or swapping arms. Preserve exact costume stage and correct direction for every pose.
ALL16 face SOUTHWEST7, FRONT LEFT toward viewer, nose and toes screen LEFT. Right weapon arm FAR from viewer on screen LEFT. Near left arm EMPTY on screen RIGHT.
Adult female dancer, ornate burgundy/ivory/gold long robe, gold hair ornaments, gold-trimmed sleeves. Right hand gold/iron-studded heavy wooden club EXACT reference.
```

### fix-sw

```text
REDRAW ALL16 as FRONT LEFT SOUTHWEST7 o'clock. Nose, torso, toes LEFT in every cell, NOT RIGHT. Entire figure changes view, not gaze only. Anatomical RIGHT hand far screen LEFT holds same gold iron studded wooden club, near LEFT hand screen RIGHT empty. Do not mirror. Same adult woman ornate burgundy/ivory/gold robe and gold hair ornaments. Keep4x4 actions idle/walk/attack/skill, columns0..3, end attack/skill at ready. Compact strike toward LEFT. True transparency20% gutters, no effects text.
```

### fix2--sw

```text
Correct row3 column2 attack windup and row4 column2 skill windup: head, face, torso and boots face FRONT LEFT southwest like other cells, never face right. Keep right hand far screenLEFT on club, near left hand empty. Keep exact all16 poses layout ornate costume. Full connected figures, no mirror. True transparency, wide gutters, no text/effects, exact4x4.
```

### fix3--sw

```text
Correct gaze/direction of row3 column2 and row4 column2: female face NOSE points screenLEFT, head and torso stay SOUTHWEST FRONT LEFT like row1. Preserve raised right club arm, empty left arm, ornate burgundy gold costume and all16poses. No faces looking right. Exact4x4 true transparency, no mirroring no effects.
```

### fix4--sw

```text
ONE CELL CORRECTION: bottom row SECOND column (row4 col2) still looks RIGHT. Replace its WHOLE pose with a woman standing facing LEFT, nose LEFT, both eyes looking LEFT, chin above LEFT shoulder. Right hand holds club VERTICALLY beside LEFT side of her face at shoulder height, left empty palm held LOW near waist. Do NOT retain current overhead windup. Same ornate robe and hair. Other15 cells unchanged. True transparent4x4 sheet.
```

### r-scenario

```text
Use case: identity-preserve. Create complete-body peaceful standing sprite sheet matching approved reference identity hair and costume exactly. REMOVE weapon and scabbard completely; both hands empty naturally relaxed. Exactly4 rows x4 columns equal cells. Row1 northwest11 BACK LEFT; row2 northeast2 BACK RIGHT; row3 southeast5 FRONT RIGHT; row4 southwest7 FRONT LEFT. Columns0..3 distinct subtle breathing poses shoulders sleeves and chest, planted feet, frame3 nearly matches0. Full connected bodies, NO parts collage, no mirroring. Same scale all16. Figure central60% cell,20% clear transparent gutters, feet at80%. True alpha, no shadow/text/grid/effects. Crisp small tactical RPG reference style.
Adult female dancer, ornate burgundy/ivory/gold long robe, gold hair ornaments, gold-trimmed sleeves. Right hand gold/iron-studded heavy wooden club EXACT reference. REMOVE ALL weapons from reference.
```

## 27 풍수사

참조: `web/public/images/job-models/se-v1/job-27.webp`

- combat: `/images/class-motion-pilot/caster/job-27/remaining-20261028/combat-v1` (64장)
- scenario: `/images/class-motion-pilot/caster/job-27/remaining-20261028/scenario-v1` (16장)

남은 한계:
- 정적 시간순 검수 완료, 실제 브라우저 연속재생 미검수. 사용자 최종 승인 전 초안.
- 긴 치마/도포가 무릎을 가려 이동1/3 교대보행 가독성이 제한됨.
- 공격2→3 회복이 한 프레임이고 머리카락/옷자락이 변해 실제 타이밍 검수 필요.
- 머리장식·옷 세부 문양과 무기 원근 길이에 작은 생성 편차.

프롬프트:

### r-nw

```text
Use case identity-preserve. Image1 is POSE/LAYOUT reference ONLY, Image2 is exact NEW CHARACTER identity clothing weapon. Redraw EVERY complete figure of image1 as image2's geomancer, preserving ALL16 poses and actual viewing directions, NEVER copy dancer costume/hair/face. Adult female geomancer, same pale youthful face and dark half-up long hair, sage muted green outer robe cream ivory inner robe and cuffs, brown sash. Right hand short straight iron ritual blade pointed down as reference. Left hand empty. Preserve4rows idle/walk/attack/skill and columns0..3, weapon remains anatomical right hand, left empty. ALL16 face NORTHWEST11, BACK LEFT AWAY viewer. Show back of head and clothing; nose and toes point screen LEFT. Right weapon arm near viewer. Same scale throughout, full bodies not collage, compact blade reach,20% clear transparent cell margins. True alpha. No text glow grid shadow.
```

### hand-nw

```text
Fix WEAPON HAND consistency in this NW BACK LEFT sheet. In ALL16 cells weapon must stay in NEAR anatomical RIGHT arm on screen LEFT, empty FAR LEFT arm on screen RIGHT. In attack row3 column2 and skill row4 columns2/3 weapon is incorrectly held screenRIGHT: REDRAW those full figures raising weapon on screenLEFT near shoulder and raise EMPTY palm on screenRIGHT. Do NOT turn torso to opposite side or exchange hands. Face/back LEFT throughout. Preserve exact costume weapon identity and all other poses,4x4layout true alpha, wide gutters. Entire bodies no collage.
```

### r-ne

```text
Use case identity-preserve. Image1 is POSE/LAYOUT reference ONLY, Image2 is exact NEW CHARACTER identity clothing weapon. Redraw EVERY complete figure of image1 as image2's geomancer, preserving ALL16 poses and actual viewing directions, NEVER copy dancer costume/hair/face. Adult female geomancer, same pale youthful face and dark half-up long hair, sage muted green outer robe cream ivory inner robe and cuffs, brown sash. Right hand short straight iron ritual blade pointed down as reference. Left hand empty. Preserve4rows idle/walk/attack/skill and columns0..3, weapon remains anatomical right hand, left empty. ALL16 face NORTHEAST2, BACK RIGHT AWAY viewer. Show back of head and clothing; nose and toes point screen RIGHT. Right weapon arm FAR from viewer. Same scale throughout, full bodies not collage, compact blade reach,20% clear transparent cell margins. True alpha. No text glow grid shadow.
```

### r-se

```text
Use case identity-preserve. Image1 is POSE/LAYOUT reference ONLY, Image2 is exact NEW CHARACTER identity clothing weapon. Redraw EVERY complete figure of image1 as image2's geomancer, preserving ALL16 poses and actual viewing directions, NEVER copy dancer costume/hair/face. Adult female geomancer, same pale youthful face and dark half-up long hair, sage muted green outer robe cream ivory inner robe and cuffs, brown sash. Right hand short straight iron ritual blade pointed down as reference. Left hand empty. Preserve4rows idle/walk/attack/skill and columns0..3, weapon remains anatomical right hand, left empty. ALL16 face SOUTHEAST5, FRONT RIGHT toward viewer, nose and toes screen RIGHT. Right weapon arm near viewer. Same scale throughout, full bodies not collage, compact blade reach,20% clear transparent cell margins. True alpha. No text glow grid shadow.
```

### r-sw

```text
Use case identity-preserve. Image1 is POSE/LAYOUT reference ONLY, Image2 is exact NEW CHARACTER identity clothing weapon. Redraw EVERY complete figure of image1 as image2's geomancer, preserving ALL16 poses and actual viewing directions, NEVER copy dancer costume/hair/face. Adult female geomancer, same pale youthful face and dark half-up long hair, sage muted green outer robe cream ivory inner robe and cuffs, brown sash. Right hand short straight iron ritual blade pointed down as reference. Left hand empty. Preserve4rows idle/walk/attack/skill and columns0..3, weapon remains anatomical right hand, left empty. ALL16 face SOUTHWEST7, FRONT LEFT toward viewer, nose and toes screen LEFT. Right weapon arm FAR from viewer on screen LEFT. Near left arm EMPTY on screen RIGHT. Same scale throughout, full bodies not collage, compact blade reach,20% clear transparent cell margins. True alpha. No text glow grid shadow.
```

### r-scenario

```text
Use case identity-preserve. Image1 is POSE/LAYOUT reference ONLY, Image2 is exact NEW CHARACTER identity clothing weapon. Redraw EVERY complete figure of image1 as image2's geomancer, preserving ALL16 poses and actual viewing directions, NEVER copy dancer costume/hair/face. Adult female geomancer, same pale youthful face and dark half-up long hair, sage muted green outer robe cream ivory inner robe and cuffs, brown sash. Right hand short straight iron ritual blade pointed down as reference. Left hand empty. All16 peaceful empty-handed breathing; remove weapons scabbards, preserve rows directions as pose sheet. Same scale throughout, full bodies not collage, compact blade reach,20% clear transparent cell margins. True alpha. No text glow grid shadow.
```

### fix-scenario

```text
REMOVE ALL SWORDS BLADES SCABBARDS in ALL16 cells. This is peaceful scenario dialogue idle, both hands EMPTY relaxed open hands, nothing held. Preserve exact16 figures directions robe green/ivory face hair and4x4layout. Redraw hands naturally. No invisible gripping. True transparency no text/effects. Remove metal blades by legs particularly both BACK rows and bottom row.
```

## 28 방술사

참조: `web/public/images/job-models/promotion-se-v1/job-28.webp`

- combat: `/images/class-motion-pilot/caster/job-28/remaining-20261028/combat-v1` (64장)
- scenario: `/images/class-motion-pilot/caster/job-28/remaining-20261028/scenario-v1` (16장)

남은 한계:
- 시각 초안, 실제 전투판정 및 사이트 연결 미작업
- 브라우저 실제 연속재생 육안 검수 미완료
- SW 공격2 왼쪽 여백3px: 잘림 없음, 고정 접지점과 크기를 유지함.
- 긴 옷의 교대보행 가독성 제한. 공격 회복1프레임과 장식 편차 실제 재생 검수 필요.

프롬프트:

### r-nw

```text
Use case identity-preserve. Image1 POSE and DIRECTIONS ONLY. Replace EVERY whole figure costume, hair ornament and weapon to EXACT approved promotion in image2. Adult female geomancer, same pale face dark tied long hair and modest hairpin, layered pale sage/ivory robe with dark green trim, brown sash and small red hanging talisman. Right hand long pale bronze straight ritual sword EXACT reference, no huge glow. DO NOT retain base green robe if different from image2; carefully match image2 cream layers and trims. Preserve all16 action poses,4x4 rows idle/walk/attack/skill columns0..3, recover at3. ALL16 face NORTHWEST11, BACK LEFT AWAY viewer. Show back of head and clothing; nose and toes point screen LEFT. Right weapon arm near viewer. Full connected figures, not part collage, right hand weapon left empty. Same scale all16, compact sword reach bent elbow,20% transparent margins, no effects/text/shadow.
```

### hand-nw

```text
Fix WEAPON HAND consistency in this NW BACK LEFT sheet. In ALL16 cells weapon must stay in NEAR anatomical RIGHT arm on screen LEFT, empty FAR LEFT arm on screen RIGHT. In attack row3 column2 and skill row4 columns2/3 weapon is incorrectly held screenRIGHT: REDRAW those full figures raising weapon on screenLEFT near shoulder and raise EMPTY palm on screenRIGHT. Do NOT turn torso to opposite side or exchange hands. Face/back LEFT throughout. Preserve exact costume weapon identity and all other poses,4x4layout true alpha, wide gutters. Entire bodies no collage.
```

### hand2--nw

```text
Image1 EXACT poses and hands. Image2 NEW costume and weapon. Redraw all16 complete figures as image2's geomancer. Adult female geomancer, same pale face dark tied long hair and modest hairpin, layered pale sage/ivory robe with dark green trim, brown sash and small red hanging talisman. Right hand long pale bronze straight ritual sword EXACT reference, no huge glow. ALL backLEFT. Preserve EXACT image1 hand arrangement: NEAR screenLEFT hand holds sword in EVERY cell, EMPTY hand screenRIGHT. Attack row3col3 extends sword LEFT; skill row4col2/3 raises sword NEAR LEFT shoulder. Never swap or omit weapon. Preserve4x4 actions/time, same scale, wide transparent gutters no text/effects.
```

### r-ne

```text
Use case identity-preserve. Image1 POSE and DIRECTIONS ONLY. Replace EVERY whole figure costume, hair ornament and weapon to EXACT approved promotion in image2. Adult female geomancer, same pale face dark tied long hair and modest hairpin, layered pale sage/ivory robe with dark green trim, brown sash and small red hanging talisman. Right hand long pale bronze straight ritual sword EXACT reference, no huge glow. DO NOT retain base green robe if different from image2; carefully match image2 cream layers and trims. Preserve all16 action poses,4x4 rows idle/walk/attack/skill columns0..3, recover at3. ALL16 face NORTHEAST2, BACK RIGHT AWAY viewer. Show back of head and clothing; nose and toes point screen RIGHT. Right weapon arm FAR from viewer. Full connected figures, not part collage, right hand weapon left empty. Same scale all16, compact sword reach bent elbow,20% transparent margins, no effects/text/shadow.
```

### r-se

```text
Use case identity-preserve. Image1 POSE and DIRECTIONS ONLY. Replace EVERY whole figure costume, hair ornament and weapon to EXACT approved promotion in image2. Adult female geomancer, same pale face dark tied long hair and modest hairpin, layered pale sage/ivory robe with dark green trim, brown sash and small red hanging talisman. Right hand long pale bronze straight ritual sword EXACT reference, no huge glow. DO NOT retain base green robe if different from image2; carefully match image2 cream layers and trims. Preserve all16 action poses,4x4 rows idle/walk/attack/skill columns0..3, recover at3. ALL16 face SOUTHEAST5, FRONT RIGHT toward viewer, nose and toes screen RIGHT. Right weapon arm near viewer. Full connected figures, not part collage, right hand weapon left empty. Same scale all16, compact sword reach bent elbow,20% transparent margins, no effects/text/shadow.
```

### r-sw

```text
Use case identity-preserve. Image1 POSE and DIRECTIONS ONLY. Replace EVERY whole figure costume, hair ornament and weapon to EXACT approved promotion in image2. Adult female geomancer, same pale face dark tied long hair and modest hairpin, layered pale sage/ivory robe with dark green trim, brown sash and small red hanging talisman. Right hand long pale bronze straight ritual sword EXACT reference, no huge glow. DO NOT retain base green robe if different from image2; carefully match image2 cream layers and trims. Preserve all16 action poses,4x4 rows idle/walk/attack/skill columns0..3, recover at3. ALL16 face SOUTHWEST7, FRONT LEFT toward viewer, nose and toes screen LEFT. Right weapon arm FAR from viewer on screen LEFT. Near left arm EMPTY on screen RIGHT. Full connected figures, not part collage, right hand weapon left empty. Same scale all16, compact sword reach bent elbow,20% transparent margins, no effects/text/shadow.
```

### r-scenario

```text
Image1 is empty-handed pose/direction layout. Image2 exact approved costume identity. Redraw16 figures with image2 costume/hair/face, BUT ABSOLUTELY NO WEAPON, no swords or scabbards anywhere. Peaceful scenario breathing both hands EMPTY naturally down. Adult female geomancer, same pale face dark tied long hair and modest hairpin, layered pale sage/ivory robe with dark green trim, brown sash and small red hanging talisman.  Four rows preserve actual image1 directions BACK RIGHT/BACK LEFT/FRONT RIGHT/FRONT LEFT, four breathing frames columns, wholebody same scale, true alpha20% gutters, no text/effects. Do not carry reference weapon into output.
```

### resume-ne

```text
Change only row3column3 attack release pose to bent right elbow and compact strike reach 25% shorter. Preserve weapon length through foreshortening, hold sword hand closer to shoulder. All16 BACK RIGHT NE, exact same elderly/female identity costume weapon other15poses, uniform scale, transparent4x4 full body sheet. No cropping no text.
```

### resume-se

```text
Preserve exact female sage/ivory outfit bronze sword red tassel identity and all16 SE frontRIGHT poses. Redraw transparent4x4 sprite sheet with substantially wider gutters and outer bottom margin. ALL boots and swordtips fully visible. Figures uniform size inside central65% each square cell; no touching rows. Row3col3 compact bent elbow attack to keep full sword inside cell. No text effects floor, true alpha.
```

## 29 선술사

참조: `web/public/images/job-models/promotion-se-v1/job-29.webp`

- combat: `/images/class-motion-pilot/caster/job-29/remaining-20261028/combat-v1` (64장)
- scenario: `/images/class-motion-pilot/caster/job-29/remaining-20261028/scenario-v1` (16장)

남은 한계:
- 시각 초안, 실제 전투판정 및 사이트 연결 미작업
- 브라우저 실제 연속재생 육안 검수 미완료
- 긴 옷으로 교대보행 가독성 제한. 공격2→3 회복1프레임과 장식·무기 원근 편차의 실제 재생 검수 필요.

프롬프트:

### r-nw

```text
Use case identity-preserve. Image1 POSE and DIRECTIONS ONLY. Replace EVERY whole figure costume, hair ornament and weapon to EXACT approved promotion in image2. Adult female geomancer, dark tied hair ivory ornamental hairpin, layered ivory and pale sage robe with grey embroidered borders, small purple belt tassel. Right hand dark iron straight ritual sword with small ring ornaments near hilt EXACT reference. DO NOT retain base green robe if different from image2; carefully match image2 cream layers and trims. Preserve all16 action poses,4x4 rows idle/walk/attack/skill columns0..3, recover at3. ALL16 face NORTHWEST11, BACK LEFT AWAY viewer. Show back of head and clothing; nose and toes point screen LEFT. Right weapon arm near viewer. Full connected figures, not part collage, right hand weapon left empty. Same scale all16, compact sword reach bent elbow,20% transparent margins, no effects/text/shadow.
```

### hand-nw

```text
Fix WEAPON HAND consistency in this NW BACK LEFT sheet. In ALL16 cells weapon must stay in NEAR anatomical RIGHT arm on screen LEFT, empty FAR LEFT arm on screen RIGHT. In attack row3 column2 and skill row4 columns2/3 weapon is incorrectly held screenRIGHT: REDRAW those full figures raising weapon on screenLEFT near shoulder and raise EMPTY palm on screenRIGHT. Do NOT turn torso to opposite side or exchange hands. Face/back LEFT throughout. Preserve exact costume weapon identity and all other poses,4x4layout true alpha, wide gutters. Entire bodies no collage.
```

### hand2--nw

```text
Image1 EXACT poses and hands. Image2 NEW costume and weapon. Redraw all16 complete figures as image2's geomancer. Adult female geomancer, dark tied hair ivory ornamental hairpin, layered ivory and pale sage robe with grey embroidered borders, small purple belt tassel. Right hand dark iron straight ritual sword with small ring ornaments near hilt EXACT reference. ALL backLEFT. Preserve EXACT image1 hand arrangement: NEAR screenLEFT hand holds sword in EVERY cell, EMPTY hand screenRIGHT. Attack row3col3 extends sword LEFT; skill row4col2/3 raises sword NEAR LEFT shoulder. Never swap or omit weapon. Preserve4x4 actions/time, same scale, wide transparent gutters no text/effects.
```

### r-ne

```text
Use case identity-preserve. Image1 POSE and DIRECTIONS ONLY. Replace EVERY whole figure costume, hair ornament and weapon to EXACT approved promotion in image2. Adult female geomancer, dark tied hair ivory ornamental hairpin, layered ivory and pale sage robe with grey embroidered borders, small purple belt tassel. Right hand dark iron straight ritual sword with small ring ornaments near hilt EXACT reference. DO NOT retain base green robe if different from image2; carefully match image2 cream layers and trims. Preserve all16 action poses,4x4 rows idle/walk/attack/skill columns0..3, recover at3. ALL16 face NORTHEAST2, BACK RIGHT AWAY viewer. Show back of head and clothing; nose and toes point screen RIGHT. Right weapon arm FAR from viewer. Full connected figures, not part collage, right hand weapon left empty. Same scale all16, compact sword reach bent elbow,20% transparent margins, no effects/text/shadow.
```

### r-se

```text
Use case identity-preserve. Image1 POSE and DIRECTIONS ONLY. Replace EVERY whole figure costume, hair ornament and weapon to EXACT approved promotion in image2. Adult female geomancer, dark tied hair ivory ornamental hairpin, layered ivory and pale sage robe with grey embroidered borders, small purple belt tassel. Right hand dark iron straight ritual sword with small ring ornaments near hilt EXACT reference. DO NOT retain base green robe if different from image2; carefully match image2 cream layers and trims. Preserve all16 action poses,4x4 rows idle/walk/attack/skill columns0..3, recover at3. ALL16 face SOUTHEAST5, FRONT RIGHT toward viewer, nose and toes screen RIGHT. Right weapon arm near viewer. Full connected figures, not part collage, right hand weapon left empty. Same scale all16, compact sword reach bent elbow,20% transparent margins, no effects/text/shadow.
```

### fix-se

```text
Fix ONLY row1 column1: has a duplicate blade pointing down-left. REMOVE extra down-left blade and extra hilt. Keep ONE sword in right hand pointing DOWN RIGHT exactly like row1 columns2/3/4. Do not change other15 figures, keep entire robe, hand, ring-ornamented iron blade,4x4transparent layout.
```

### r-sw

```text
Use case identity-preserve. Image1 POSE and DIRECTIONS ONLY. Replace EVERY whole figure costume, hair ornament and weapon to EXACT approved promotion in image2. Adult female geomancer, dark tied hair ivory ornamental hairpin, layered ivory and pale sage robe with grey embroidered borders, small purple belt tassel. Right hand dark iron straight ritual sword with small ring ornaments near hilt EXACT reference. DO NOT retain base green robe if different from image2; carefully match image2 cream layers and trims. Preserve all16 action poses,4x4 rows idle/walk/attack/skill columns0..3, recover at3. ALL16 face SOUTHWEST7, FRONT LEFT toward viewer, nose and toes screen LEFT. Right weapon arm FAR from viewer on screen LEFT. Near left arm EMPTY on screen RIGHT. Full connected figures, not part collage, right hand weapon left empty. Same scale all16, compact sword reach bent elbow,20% transparent margins, no effects/text/shadow.
```

### r-scenario

```text
Image1 is empty-handed pose/direction layout. Image2 exact approved costume identity. Redraw16 figures with image2 costume/hair/face, BUT ABSOLUTELY NO WEAPON, no swords or scabbards anywhere. Peaceful scenario breathing both hands EMPTY naturally down. Adult female geomancer, dark tied hair ivory ornamental hairpin, layered ivory and pale sage robe with grey embroidered borders, small purple belt tassel.  Four rows preserve actual image1 directions BACK RIGHT/BACK LEFT/FRONT RIGHT/FRONT LEFT, four breathing frames columns, wholebody same scale, true alpha20% gutters, no text/effects. Do not carry reference weapon into output.
```

### resume-se

```text
Preserve all16 complete character drawings, exact costume weapon face poses and SE frontRIGHT direction. Redraw sheet with MUCH WIDER clear transparent gutters between rows: 4x4 equal cells, each figure entirely inside central65% of its cell including raised sword. Row3col2 raised sword currently touches row2col2 boots; separate them with ample empty space. No touching neighbors. Uniform body scale, full bodies no cropping, true alpha, no text effects.
```

## 30 도사

참조: `web/public/images/job-models/se-v1/job-30.webp`

- combat: `/images/class-motion-pilot/caster/job-30/remaining-20261028/combat-v1` (64장)
- scenario: `/images/class-motion-pilot/caster/job-30/remaining-20261028/scenario-v1` (16장)

남은 한계:
- 시각 초안, 실제 전투판정 및 사이트 연결 미작업
- 브라우저 실제 연속재생 육안 검수 미완료
- 긴 도포로 보행 무릎 교대 가독성 제한; 공격 회복1프레임과 장식 편차의 실재생 검수 필요

프롬프트:

### r-nw

```text
Use case identity-preserve. Image1 POSE/LAYOUT ONLY. Image2 exact NEW ELDERLY MALE identity costume. Redraw all16 full figures as image2's elderly Taoist, MALE elderly face grey beard moustache grey topknot, NOT young woman. Elderly male Taoist, grey hair topknot, grey moustache and beard, charcoal/slate grey robe ivory inner collar and sleeve lining, plain brown belt, black boots. Right hand short straight iron ritual blade lowered as reference, left empty. NO dancer skirts or hair ribbons. 4rows idle/walk/attack/skill columns0..3, preserve all poses but restrained elderly movement. ALL16 face NORTHWEST11, BACK LEFT AWAY viewer. Show back of head and clothing; nose and toes point screen LEFT. Right weapon arm near viewer. Fixed scale, full bodies no collage,20% transparent gutters, compact blade, real alpha no text/glow/grid.
```

### hand-nw

```text
Fix WEAPON HAND consistency in this NW BACK LEFT sheet. In ALL16 cells sword stays NEAR anatomical RIGHT hand on screen LEFT. Empty FAR left arm on screenRIGHT. Redraw attack row3 column2 and skill row4 columns2/3 raising sword on LEFT near shoulder, EMPTY palm on RIGHT. Do not twist torso opposite or exchange hands. Face/back LEFT throughout. Same elderly male grey hair beard charcoal robe, preserve all16poses4x4, full bodies true alpha.
```

### hand2--nw

```text
Image1 is EXACT POSE and HAND assignment ONLY. Image2 character identity. Redraw all16 complete figures as elderly MALE Taoist of image2: grey hair topknot, long grey beard, charcoal robe cream lining plain belt. NO WOMAN hair or dress. Preserve EXACT image1 poses and NEAR screenLEFT hand holding sword in ALL16 cells including raising sword at row3c2,row4c2,c3; empty palm screenRIGHT. All backLEFT11o'clock. Same4x4 layout idle/walk/attack/skill, uniform scale wide transparent gutters, true alpha no effects.
```

### r-ne

```text
Use case identity-preserve. Image1 POSE/LAYOUT ONLY. Image2 exact NEW ELDERLY MALE identity costume. Redraw all16 full figures as image2's elderly Taoist, MALE elderly face grey beard moustache grey topknot, NOT young woman. Elderly male Taoist, grey hair topknot, grey moustache and beard, charcoal/slate grey robe ivory inner collar and sleeve lining, plain brown belt, black boots. Right hand short straight iron ritual blade lowered as reference, left empty. NO dancer skirts or hair ribbons. 4rows idle/walk/attack/skill columns0..3, preserve all poses but restrained elderly movement. ALL16 face NORTHEAST2, BACK RIGHT AWAY viewer. Show back of head and clothing; nose and toes point screen RIGHT. Right weapon arm FAR from viewer. Fixed scale, full bodies no collage,20% transparent gutters, compact blade, real alpha no text/glow/grid.
```

### r-se

```text
Use case identity-preserve. Image1 POSE/LAYOUT ONLY. Image2 exact NEW ELDERLY MALE identity costume. Redraw all16 full figures as image2's elderly Taoist, MALE elderly face grey beard moustache grey topknot, NOT young woman. Elderly male Taoist, grey hair topknot, grey moustache and beard, charcoal/slate grey robe ivory inner collar and sleeve lining, plain brown belt, black boots. Right hand short straight iron ritual blade lowered as reference, left empty. NO dancer skirts or hair ribbons. 4rows idle/walk/attack/skill columns0..3, preserve all poses but restrained elderly movement. ALL16 face SOUTHEAST5, FRONT RIGHT toward viewer, nose and toes screen RIGHT. Right weapon arm near viewer. Fixed scale, full bodies no collage,20% transparent gutters, compact blade, real alpha no text/glow/grid.
```

### r-sw

```text
Use case identity-preserve. Image1 POSE/LAYOUT ONLY. Image2 exact NEW ELDERLY MALE identity costume. Redraw all16 full figures as image2's elderly Taoist, MALE elderly face grey beard moustache grey topknot, NOT young woman. Elderly male Taoist, grey hair topknot, grey moustache and beard, charcoal/slate grey robe ivory inner collar and sleeve lining, plain brown belt, black boots. Right hand short straight iron ritual blade lowered as reference, left empty. NO dancer skirts or hair ribbons. 4rows idle/walk/attack/skill columns0..3, preserve all poses but restrained elderly movement. ALL16 face SOUTHWEST7, FRONT LEFT toward viewer, nose and toes screen LEFT. Right weapon arm FAR from viewer on screen LEFT. Near left arm EMPTY on screen RIGHT. Fixed scale, full bodies no collage,20% transparent gutters, compact blade, real alpha no text/glow/grid.
```

### r-scenario

```text
Use case identity-preserve. Image1 POSE/LAYOUT ONLY. Image2 exact NEW ELDERLY MALE identity costume. Redraw all16 full figures as image2's elderly Taoist, MALE elderly face grey beard moustache grey topknot, NOT young woman. Elderly male Taoist, grey hair topknot, grey moustache and beard, charcoal/slate grey robe ivory inner collar and sleeve lining, plain brown belt, black boots. Right hand short straight iron ritual blade lowered as reference, left empty. NO dancer skirts or hair ribbons. Empty handed peaceful standing, no weapon/scabbard, preserve all directions of pose sheet. Fixed scale, full bodies no collage,20% transparent gutters, compact blade, real alpha no text/glow/grid.
```

## 31 환술사

참조: `web/public/images/job-models/promotion-se-v1/job-31.webp`

- combat: `/images/class-motion-pilot/caster/job-31/remaining-20261028/combat-v1` (64장)
- scenario: `/images/class-motion-pilot/caster/job-31/remaining-20261028/scenario-v1` (16장)

남은 한계:
- 시각 초안, 실제 전투판정 및 사이트 연결 미작업
- 브라우저 실제 연속재생 육안 검수 미완료
- 긴 옷으로 교대보행 가독성 제한. 공격2→3 회복1프레임과 장식·무기 원근 편차의 실제 재생 검수 필요.

프롬프트:

### r-nw

```text
Image1 POSE/DIRECTION only. Image2 exact approved elderly MALE Taoist promotion costume face hair weapon. Redraw16 whole figures as image2's man. Elderly male Taoist, same grey topknot beard moustache, charcoal slate robe with light grey collar/cuffs and patterned grey inner skirt, bronze belt red tassel. Right hand long BRONZE gold straight ritual blade EXACT reference. ALL16 face NORTHWEST11, BACK LEFT AWAY viewer. Show back of head and clothing; nose and toes point screen LEFT. Right weapon arm near viewer. Preserve4rows idle/walk/attack/skill,4frames. EXACT hand assignments of image1, NW weapon NEAR screenLEFT always including lifted poses. Costume from image2, not image1. Entire connected figures not parts, fixed scale20% transparent gutters compact sword, no text effects. True alpha.
```

### r-ne

```text
Image1 POSE/DIRECTION only. Image2 exact approved elderly MALE Taoist promotion costume face hair weapon. Redraw16 whole figures as image2's man. Elderly male Taoist, same grey topknot beard moustache, charcoal slate robe with light grey collar/cuffs and patterned grey inner skirt, bronze belt red tassel. Right hand long BRONZE gold straight ritual blade EXACT reference. ALL16 face NORTHEAST2, BACK RIGHT AWAY viewer. Show back of head and clothing; nose and toes point screen RIGHT. Right weapon arm FAR from viewer. Preserve4rows idle/walk/attack/skill,4frames. EXACT hand assignments of image1, NW weapon NEAR screenLEFT always including lifted poses. Costume from image2, not image1. Entire connected figures not parts, fixed scale20% transparent gutters compact sword, no text effects. True alpha.
```

### r-se

```text
Image1 POSE/DIRECTION only. Image2 exact approved elderly MALE Taoist promotion costume face hair weapon. Redraw16 whole figures as image2's man. Elderly male Taoist, same grey topknot beard moustache, charcoal slate robe with light grey collar/cuffs and patterned grey inner skirt, bronze belt red tassel. Right hand long BRONZE gold straight ritual blade EXACT reference. ALL16 face SOUTHEAST5, FRONT RIGHT toward viewer, nose and toes screen RIGHT. Right weapon arm near viewer. Preserve4rows idle/walk/attack/skill,4frames. EXACT hand assignments of image1, NW weapon NEAR screenLEFT always including lifted poses. Costume from image2, not image1. Entire connected figures not parts, fixed scale20% transparent gutters compact sword, no text effects. True alpha.
```

### r-sw

```text
Image1 POSE/DIRECTION only. Image2 exact approved elderly MALE Taoist promotion costume face hair weapon. Redraw16 whole figures as image2's man. Elderly male Taoist, same grey topknot beard moustache, charcoal slate robe with light grey collar/cuffs and patterned grey inner skirt, bronze belt red tassel. Right hand long BRONZE gold straight ritual blade EXACT reference. ALL16 face SOUTHWEST7, FRONT LEFT toward viewer, nose and toes screen LEFT. Right weapon arm FAR from viewer on screen LEFT. Near left arm EMPTY on screen RIGHT. Preserve4rows idle/walk/attack/skill,4frames. EXACT hand assignments of image1, NW weapon NEAR screenLEFT always including lifted poses. Costume from image2, not image1. Entire connected figures not parts, fixed scale20% transparent gutters compact sword, no text effects. True alpha.
```

### r-scenario

```text
Image1 POSE/DIRECTION only. Image2 exact approved elderly MALE Taoist promotion costume face hair weapon. Redraw16 whole figures as image2's man. Elderly male Taoist, same grey topknot beard moustache, charcoal slate robe with light grey collar/cuffs and patterned grey inner skirt, bronze belt red tassel.  ABSOLUTELY EMPTY HANDS no weapon/scabbard anywhere; preserve4rows BACK RIGHT/BACK LEFT/FRONT RIGHT/FRONT LEFT. Costume from image2, not image1. Entire connected figures not parts, fixed scale20% transparent gutters compact sword, no text effects. True alpha.
```

### resume-ne

```text
Change only row3column3 attack release pose to bent right elbow and compact strike reach 25% shorter. Preserve weapon length through foreshortening, hold sword hand closer to shoulder. All16 BACK RIGHT NE, exact same elderly/female identity costume weapon other15poses, uniform scale, transparent4x4 full body sheet. No cropping no text.
```

## 32 요술사

참조: `web/public/images/job-models/promotion-se-v1/job-32.webp`

- combat: `/images/class-motion-pilot/caster/job-32/remaining-20261028/combat-v1` (64장)
- scenario: `/images/class-motion-pilot/caster/job-32/remaining-20261028/scenario-v1` (16장)

남은 한계:
- 시각 초안, 실제 전투판정 및 사이트 연결 미작업
- 브라우저 실제 연속재생 육안 검수 미완료
- 긴 옷으로 교대보행 가독성 제한. 공격2→3 회복1프레임과 장식·무기 원근 편차의 실제 재생 검수 필요.

프롬프트:

### r-nw

```text
Image1 POSE/DIRECTION only. Image2 exact approved elderly MALE Taoist promotion costume face hair weapon. Redraw16 whole figures as image2's man. Elderly male Taoist, same grey topknot beard moustache, dark charcoal outer robe ornate ivory silver cloud embroidered trim and cuffs, grey patterned inner robe, purple/green belt tassels. Right hand dark iron straight ritual blade silver rings near hilt EXACT reference. ALL16 face NORTHWEST11, BACK LEFT AWAY viewer. Show back of head and clothing; nose and toes point screen LEFT. Right weapon arm near viewer. Preserve4rows idle/walk/attack/skill,4frames. EXACT hand assignments of image1, NW weapon NEAR screenLEFT always including lifted poses. Costume from image2, not image1. Entire connected figures not parts, fixed scale20% transparent gutters compact sword, no text effects. True alpha.
```

### r-ne

```text
Image1 POSE/DIRECTION only. Image2 exact approved elderly MALE Taoist promotion costume face hair weapon. Redraw16 whole figures as image2's man. Elderly male Taoist, same grey topknot beard moustache, dark charcoal outer robe ornate ivory silver cloud embroidered trim and cuffs, grey patterned inner robe, purple/green belt tassels. Right hand dark iron straight ritual blade silver rings near hilt EXACT reference. ALL16 face NORTHEAST2, BACK RIGHT AWAY viewer. Show back of head and clothing; nose and toes point screen RIGHT. Right weapon arm FAR from viewer. Preserve4rows idle/walk/attack/skill,4frames. EXACT hand assignments of image1, NW weapon NEAR screenLEFT always including lifted poses. Costume from image2, not image1. Entire connected figures not parts, fixed scale20% transparent gutters compact sword, no text effects. True alpha.
```

### r-se

```text
Image1 POSE/DIRECTION only. Image2 exact approved elderly MALE Taoist promotion costume face hair weapon. Redraw16 whole figures as image2's man. Elderly male Taoist, same grey topknot beard moustache, dark charcoal outer robe ornate ivory silver cloud embroidered trim and cuffs, grey patterned inner robe, purple/green belt tassels. Right hand dark iron straight ritual blade silver rings near hilt EXACT reference. ALL16 face SOUTHEAST5, FRONT RIGHT toward viewer, nose and toes screen RIGHT. Right weapon arm near viewer. Preserve4rows idle/walk/attack/skill,4frames. EXACT hand assignments of image1, NW weapon NEAR screenLEFT always including lifted poses. Costume from image2, not image1. Entire connected figures not parts, fixed scale20% transparent gutters compact sword, no text effects. True alpha.
```

### r-sw

```text
Image1 POSE/DIRECTION only. Image2 exact approved elderly MALE Taoist promotion costume face hair weapon. Redraw16 whole figures as image2's man. Elderly male Taoist, same grey topknot beard moustache, dark charcoal outer robe ornate ivory silver cloud embroidered trim and cuffs, grey patterned inner robe, purple/green belt tassels. Right hand dark iron straight ritual blade silver rings near hilt EXACT reference. ALL16 face SOUTHWEST7, FRONT LEFT toward viewer, nose and toes screen LEFT. Right weapon arm FAR from viewer on screen LEFT. Near left arm EMPTY on screen RIGHT. Preserve4rows idle/walk/attack/skill,4frames. EXACT hand assignments of image1, NW weapon NEAR screenLEFT always including lifted poses. Costume from image2, not image1. Entire connected figures not parts, fixed scale20% transparent gutters compact sword, no text effects. True alpha.
```

### r-scenario

```text
Image1 POSE/DIRECTION only. Image2 exact approved elderly MALE Taoist promotion costume face hair weapon. Redraw16 whole figures as image2's man. Elderly male Taoist, same grey topknot beard moustache, dark charcoal outer robe ornate ivory silver cloud embroidered trim and cuffs, grey patterned inner robe, purple/green belt tassels.  ABSOLUTELY EMPTY HANDS no weapon/scabbard anywhere; preserve4rows BACK RIGHT/BACK LEFT/FRONT RIGHT/FRONT LEFT. Costume from image2, not image1. Entire connected figures not parts, fixed scale20% transparent gutters compact sword, no text effects. True alpha.
```

### resume-ne

```text
Preserve elderly male Taoist dark ornate ivory embroidered robe purple sash, all16 full connected poses backRIGHT NE. Redraw with wide transparent outer and intercell margins 4x4. Last column sword tips currently cropped, restore full blade tips. Row3col3 attack should be compact bent-elbow strike 25% shorter reach. SAME body scale all16, all characters within central65% equal cell. True alpha, no shadow/grid/effect. Do not mirror.
```

## 최종 파일 감사 및 인계

- 9종(27/28/29/30/31/32/36/37/38), 전투576장 + 빈손 시나리오144장 =720장. 누락0.
- 전부160×160 실제 알파WebP, 발 하단150px. 각 병과80개 디코딩 픽셀 해시 모두 달라 정지 파일 복제 없음. 수치상 차이만으로 자연스러운 보행을 보장하지 않음.
- 게임 프레임3,064,816bytes, 검수시트·루프4,092,056bytes. 각 병과5개 검수시트와 정확4프레임 루프5개.
- 모든 완성 경량본 정적 시간순 검수. 실제 브라우저 연속재생 검수 미완료. 긴 치마/도포의 보행 가독성, 공격 회복1프레임, 장식·무기 원근 변화가 남은 검수 항목.
- 원본74개는 영구 삭제에 대한 명시적 승인 부족으로 자동 승인 검토가 삭제를 거부하여 보존. SHA256·용량·경로와 프롬프트는 manifest에 보존.
- 공통 motion-pilots.json·컴포넌트·world.json·README 변경 없음. 커밋·푸시·배포 없음. 위 단계별 combat/scenario root로 연결 가능.
- 재개 시 기존27/30/36/37의80장씩은 재생성하지 않고 재사용·검수보고 보완. 나머지5단계는 중단 전 원본을 이어 받아 경량화하고 필요한 경계/손/방향 문제만 imagegen으로 보정.

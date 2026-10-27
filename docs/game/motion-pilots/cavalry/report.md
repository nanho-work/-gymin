# 경기병 job 9 모션 v2 — 기본 오류 보정 초안

2026-10-26. 상태: corrected-draft-review-required. 주요 크기·접지·반복 오류를 보정했으며, 아래 가림/동작 가독성 문제는 검토 대상으로 남겼다. 최종 승인·게임 적용 완료를 뜻하지 않는다.

## 결과와 사용 경로

- web/public/images/class-motion-pilot/cavalry/job-9/combat-v2: 64장, 333,056bytes.
- 같은 상위 경로의 scenario-v2: 16장, 47,540bytes. v1과 바이트 동일한 빈손 하마 시나리오 프레임.
- weakened-v2: 16장, 80,348bytes. 전투와 동일 배율의 탑승 쇠약.
- 개별 프레임 총96장 460,944bytes. 검수시트6장/재생WebP6장 657,956bytes. 전체1,118,900bytes.
- 새로 그린76장, v1 SW 이동을 공통 크기로 리사이즈한4장, 그대로 재사용한 시나리오16장. v1 이미지 전부 보존.
- 모두160×160 투명 WebP. 파일명 {direction}-{action}-{frame}.webp, frame0~3.
- combat action0 대기320ms, 1 이동170ms, 2 공격190ms, 3 스킬240ms. scenario0 360ms, weakened0 300ms.
- contact-{action}.webp: 행 NW/NE/SE/SW, 열 시간0/1/2/3. preview-{action}.webp: 네 방향을 나란히 재생.

## 수정 내용

방향별 대기 높이를127~128px로 맞추고 전투/쇠약에 같은 배율을 적용했다. 발 기준y150과 말 하체 중심 정렬로 정지 동작의 좌우 흔들림을 줄였다. 무기를 크게 그린 프레임 때문에 말 전체가 작아지지 않도록 창 길이·원근을 그림 단계에서 수정했다. 공격·스킬의 말 들림을 낮추고, 복귀 프레임과 첫 프레임을 가깝게 수정했다. SE 스킬의 창끝 좌우 반전과 양끝 날, NW 공격의 팔 표현, NE 말 색과 금색 마구를 수정했다. SW 이동은 새 시트보다 기존 네 보행 단계가 선명하여 v1 완성 프레임을 확대 재사용했다.

부품 합성·좌우 반전은 하지 않았다. 내장 image_gen으로 말+기수 완성 프레임을 생성/수정하고 PIL은 추출·투명도 정리·리사이즈·평행이동·WebP 저장에 사용했다. 원본 생성 시트의 셀 여백은 요청치를 모두 만족하지 않아 연결 성분 단위로 추출했다. 최종 개별 프레임 외곽 잘림은 별도로 검사했다.

## 남은 검토점 — 완료 표시하지 않음

- combat-v2/nw-2-1.webp, nw-2-2.webp: 몸 뒤의 오른손이 일부 가려지고 찌르기 폭이 작아 무기 손과 공격 가독성 검토 필요.
- combat-v2/ne-2-1.webp, ne-2-2.webp, ne-3-1.webp, ne-3-2.webp: 고삐 손이 가려지는 부분은160px에서 접촉 해부학을 확정하기 어렵다.
- combat-v2/se-3-1.webp, se-3-2.webp: 큰 방향/위치 변화는 수정했으나 머리·갑옷·말 윤곽의 미세한 그림 차이가 남아 있다.
- weakened-v2/sw-0-0.webp~sw-0-3.webp: 마지막 프레임의 큰 변화는 제거했지만 피로 표현 자체는 약하다.

## 검증과 한계

96개 크기/알파/파일 해시, v1 보존 해시, 시나리오16개 동일성, 재생파일6개의 네 프레임/지속시간을 확인했다. 전체 프레임은 동작별 검수시트로 확인하고 브라우저에서 여섯 재생파일을 열어 표본 화면을 확인했다. 연속 재생 전 구간이나 실제 게임UI 통합 검사를 의미하지 않는다.

공격/스킬 마지막→첫 프레임 말 하체 중심 이동은0.147~0.678px, 쇠약은0.093~0.613px이다. NW 공격의 v1 9.489px 이탈은0.147px로 줄었다. 수치는 알파 하체 중심의 진단값이며 관절·작화 품질 합격 판정은 아니다. 초기 horizontal anchor adjusted 기록은 클리핑 오류가 아니라 정렬 이력이다.

승급 병종·게임 로직·공통 UI 연결·배포는 이번 작업 범위가 아니다.

## 생성 출처와 재현

승인 외형: web/public/images/job-models/se-v1/job-9.webp. 방향별 기존 완성 시트와 수정 시트를 참조했다. 최종 SE는 v2seSpear, 스킬1/2만 v2seSkillStyle. NW는 v2nwAttackRepair, 스킬2만 v2nwSkillRecovery. SW는 v2swReach, 이동0~3은 v1 완성 프레임을128/122 배율로 리사이즈. NE는 v2neTack. 시나리오는 v1 복사.

pack-v2.py는 기술 변환 절차를 기록한다. 마지막 SW 재사용은 완성 WebP를 기준으로 정렬했으며 원본 시트 변환의 중간 반올림과 바이트 수준 재현이 다를 수 있다. 생성 프롬프트는 의도 기록이며 결과의 정확성 증거가 아니다. 특히 초기 NE/NW 프롬프트의 가까운/먼 팔 설명에 오류가 있어 후속 수정 및 최종 시각 검토를 우선한다.

### 이번 v2 생성 경로 기록

- v2se: /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-d04f6dc6-d4cd-4404-90af-54d4beeb9f9b.png
- v2nw: /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-147283f5-90fa-4a2f-829e-58239be4077f.png
- v2sw: /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-7edbe6ce-4e78-48eb-9100-b2b85ff31bb1.png
- v2ne: /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-081caf6e-0b22-46aa-b788-eac7f79c2477.png
- v2swRepair: /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-6d82cf0c-0a74-43de-ba22-396d8bac0899.png
- v2neRepair: /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-a296b7cb-ffae-4439-b46a-400b9d251f06.png
- v2nwHands: /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-3817b3e2-cd52-4ff0-bb38-0f8787252e17.png
- v2seSpear: /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-2913c1a3-332e-471f-8760-86f0c289264a.png
- v2nwAttackRepair: /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-d2a53429-14ef-458c-9446-1aee8d4eb488.png
- v2swReach: /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-910257a9-0c13-42f2-9d06-91c780d06c01.png
- v2neReach: /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-20974b76-1d1e-440c-9c0d-8fed53f9026c.png
- v2seSkillRecovery: /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-b277b3e6-7d43-4733-9b75-d91bc9e17bc1.png
- v2nwSkillRecovery: /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-7e87a7c4-c124-4e80-b874-3d98b0862b3e.png
- v2neTack: /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-73ec0cc6-701d-4a47-9a12-eee36e93844b.png
- v2seSkillStyle: /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-e632f6ef-59f4-4ad6-8a78-5a56e4a1f7be.png

### v2 실제 프롬프트 이력

#### se

```text
Use case identity-preserve sprite correction. Create a PRODUCTION CORRECTION sheet of the approved light cavalry male and brown horse in reference1. Preserve EXACT young male face, BLACK headband and small topknot (not long loose hair), muted BLUE-GRAY sleeves, brown leather lamellar armor and skirt, red waist sash, pale cream trim, brown boots, SHORT wooden spear with gray leaf blade and small red tassel. Horse is muted dark chestnut brown, dark mane and tail, simple BROWN leather tack with small brass circles, white short socks. NOT orange, not golden harness. Whole connected horse+rider drawing per cell; no separate parts. Same restrained crisp outlined game style. EXACTLY FOUR columns and FIVE rows, TWENTY separate sprites on a portrait 4:5 canvas. Equal square cells; each sprite within CENTRAL 64% of cell width and height INCLUDING spear, minimum18% transparent margin on all sides. Same horse size, rider size, saddle center and foot baseline across ALL twenty cells. No labels, grid, effects, shadow, background. True transparent alpha.
Rows and time columns: Row1 IDLE 4 very subtle breathing frames, all four horse hooves planted. Row2 WALK 4 coherent alternating horse leg phases only place with raised hooves. Row3 SPEAR ATTACK 4 stages: relaxed spear at waist; compact foreshortened forward thrust; return halfway; relaxed waist stance very close to first frame. Horse identical planted stance to row1 in ALL attack cells, no jumping lunging or rearing. Row4 COMMAND SKILL: relaxed spear waist; right hand lifts spear to SHOULDER height only; lowers halfway; relaxed waist pose very close to first. Horse identical standing planted feet, never rears. Row5 WEAKENED: rider head and shoulders slightly bowed, tiny breathing down/up, fourth pose nearly matches first. Horse identical size/shape/stance/position to idle, all hooves planted. No big left-right lean, no changing direction. Spear tip never above rider topknot; shortened via perspective so total silhouette max 110% idle height/width. Entire rider stays seated in saddle, left hand holds reins, RIGHT hand spear. Match anatomy and tack in every cell.
ALL 20 cells face SOUTHEAST 5 o'clock, screen RIGHT and TOWARD viewer. Show front/right three quarter as approved reference. Anatomical RIGHT weapon arm is near viewer at screen LEFT side of rider, left reins hand on opposite side.
```

#### nw

```text
Use case identity-preserve sprite correction. Create a PRODUCTION CORRECTION sheet of the approved light cavalry male and brown horse in reference1. Preserve EXACT young male face, BLACK headband and small topknot (not long loose hair), muted BLUE-GRAY sleeves, brown leather lamellar armor and skirt, red waist sash, pale cream trim, brown boots, SHORT wooden spear with gray leaf blade and small red tassel. Horse is muted dark chestnut brown, dark mane and tail, simple BROWN leather tack with small brass circles, white short socks. NOT orange, not golden harness. Whole connected horse+rider drawing per cell; no separate parts. Same restrained crisp outlined game style. EXACTLY FOUR columns and FIVE rows, TWENTY separate sprites on a portrait 4:5 canvas. Equal square cells; each sprite within CENTRAL 64% of cell width and height INCLUDING spear, minimum18% transparent margin on all sides. Same horse size, rider size, saddle center and foot baseline across ALL twenty cells. No labels, grid, effects, shadow, background. True transparent alpha.
Rows and time columns: Row1 IDLE 4 very subtle breathing frames, all four horse hooves planted. Row2 WALK 4 coherent alternating horse leg phases only place with raised hooves. Row3 SPEAR ATTACK 4 stages: relaxed spear at waist; compact foreshortened forward thrust; return halfway; relaxed waist stance very close to first frame. Horse identical planted stance to row1 in ALL attack cells, no jumping lunging or rearing. Row4 COMMAND SKILL: relaxed spear waist; right hand lifts spear to SHOULDER height only; lowers halfway; relaxed waist pose very close to first. Horse identical standing planted feet, never rears. Row5 WEAKENED: rider head and shoulders slightly bowed, tiny breathing down/up, fourth pose nearly matches first. Horse identical size/shape/stance/position to idle, all hooves planted. No big left-right lean, no changing direction. Spear tip never above rider topknot; shortened via perspective so total silhouette max 110% idle height/width. Entire rider stays seated in saddle, left hand holds reins, RIGHT hand spear. Match anatomy and tack in every cell.
ALL TWENTY cells face NORTHWEST 11 o'clock, screen LEFT and AWAY from viewer, back-left three-quarter. See rider BACK, horse rump, horse head upper LEFT. Anatomical RIGHT weapon arm is near viewer on screen RIGHT of rider; left hand reins forward at horse neck. Image1 approved design, image2 precise SAME horse/rider colors and twenty-frame motion structure to preserve while redrawing for this rear NW view. Do not change horse proportions between cells.
```

#### sw

```text
Use case identity-preserve sprite correction. Create a PRODUCTION CORRECTION sheet of the approved light cavalry male and brown horse in reference1. Preserve EXACT young male face, BLACK headband and small topknot (not long loose hair), muted BLUE-GRAY sleeves, brown leather lamellar armor and skirt, red waist sash, pale cream trim, brown boots, SHORT wooden spear with gray leaf blade and small red tassel. Horse is muted dark chestnut brown, dark mane and tail, simple BROWN leather tack with small brass circles, white short socks. NOT orange, not golden harness. Whole connected horse+rider drawing per cell; no separate parts. Same restrained crisp outlined game style. EXACTLY FOUR columns and FIVE rows, TWENTY separate sprites on a portrait 4:5 canvas. Equal square cells; each sprite within CENTRAL 64% of cell width and height INCLUDING spear, minimum18% transparent margin on all sides. Same horse size, rider size, saddle center and foot baseline across ALL twenty cells. No labels, grid, effects, shadow, background. True transparent alpha.
Rows and time columns: Row1 IDLE 4 very subtle breathing frames, all four horse hooves planted. Row2 WALK 4 coherent alternating horse leg phases only place with raised hooves. Row3 SPEAR ATTACK 4 stages: relaxed spear at waist; compact foreshortened forward thrust; return halfway; relaxed waist stance very close to first frame. Horse identical planted stance to row1 in ALL attack cells, no jumping lunging or rearing. Row4 COMMAND SKILL: relaxed spear waist; right hand lifts spear to SHOULDER height only; lowers halfway; relaxed waist pose very close to first. Horse identical standing planted feet, never rears. Row5 WEAKENED: rider head and shoulders slightly bowed, tiny breathing down/up, fourth pose nearly matches first. Horse identical size/shape/stance/position to idle, all hooves planted. No big left-right lean, no changing direction. Spear tip never above rider topknot; shortened via perspective so total silhouette max 110% idle height/width. Entire rider stays seated in saddle, left hand holds reins, RIGHT hand spear. Match anatomy and tack in every cell.
ALL TWENTY cells face SOUTHWEST 7 o'clock, screen LEFT and TOWARD viewer, FRONT LEFT three-quarter. Horse nose lower LEFT in EVERY cell. Anatomical RIGHT weapon hand is FAR SIDE (screen LEFT of torso, partly behind horse neck). Visible near LEFT arm at screen RIGHT MUST ALWAYS be bent down holding reins. Spear goes in far RIGHT arm only. NEVER mirror weapon hand. Image1 approved identity; image2 exact same colors horse/rider style and twenty-frame structure, redraw to SW with correct hands. No right-facing sprites anywhere.
```

#### ne

```text
Use case identity-preserve sprite correction. Create a PRODUCTION CORRECTION sheet of the approved light cavalry male and brown horse in reference1. Preserve EXACT young male face, BLACK headband and small topknot (not long loose hair), muted BLUE-GRAY sleeves, brown leather lamellar armor and skirt, red waist sash, pale cream trim, brown boots, SHORT wooden spear with gray leaf blade and small red tassel. Horse is muted dark chestnut brown, dark mane and tail, simple BROWN leather tack with small brass circles, white short socks. NOT orange, not golden harness. Whole connected horse+rider drawing per cell; no separate parts. Same restrained crisp outlined game style. EXACTLY FOUR columns and FIVE rows, TWENTY separate sprites on a portrait 4:5 canvas. Equal square cells; each sprite within CENTRAL 64% of cell width and height INCLUDING spear, minimum18% transparent margin on all sides. Same horse size, rider size, saddle center and foot baseline across ALL twenty cells. No labels, grid, effects, shadow, background. True transparent alpha.
Rows and time columns: Row1 IDLE 4 very subtle breathing frames, all four horse hooves planted. Row2 WALK 4 coherent alternating horse leg phases only place with raised hooves. Row3 SPEAR ATTACK 4 stages: relaxed spear at waist; compact foreshortened forward thrust; return halfway; relaxed waist stance very close to first frame. Horse identical planted stance to row1 in ALL attack cells, no jumping lunging or rearing. Row4 COMMAND SKILL: relaxed spear waist; right hand lifts spear to SHOULDER height only; lowers halfway; relaxed waist pose very close to first. Horse identical standing planted feet, never rears. Row5 WEAKENED: rider head and shoulders slightly bowed, tiny breathing down/up, fourth pose nearly matches first. Horse identical size/shape/stance/position to idle, all hooves planted. No big left-right lean, no changing direction. Spear tip never above rider topknot; shortened via perspective so total silhouette max 110% idle height/width. Entire rider stays seated in saddle, left hand holds reins, RIGHT hand spear. Match anatomy and tack in every cell.
ALL TWENTY cells face NORTHEAST 2 o'clock, screen RIGHT and AWAY from viewer, BACK RIGHT three-quarter. Horse nose upper RIGHT in EVERY cell. Anatomical RIGHT weapon hand is FAR SIDE (screen RIGHT of torso, partly hidden by the rider back and horse neck). Visible near LEFT ARM must stay DOWN in EVERY cell with hand on reins. It NEVER carries or lifts spear. Far right shoulder/arm extends beyond far screen-right side of torso for thrust and command, visible near left arm stays down. Independently redraw this view, DO NOT mirror NW. Image1 approved identity; image2 exact correct muted chestnut horse brown leather tack small brass discs white socks and SAME rider proportions. Match horse brown shade exactly; NO orange horse, gold harness, extra dangling ornaments or long loose hair. All twenty frames same horse and equipment.
```

#### swRepair

```text
EDIT this SOUTHWEST 7 o'clock light cavalry sheet; ALL horse and rider sprites keep this correct FRONT LEFT direction. Rebuild into FOUR columns FIVE rows, 20 complete sprites. Preserve exact current SW camera, same young male black headband topknot blue-gray sleeves brown leather armor red sash, muted chestnut brown horse and plain brown tack. Anatomical RIGHT weapon hand is FAR side, near LEFT hand reins. Do not flip.
Row1 four gentle idle frames. Row2 four WALK frames alternating horse legs. Row3 compact SPEAR THRUST: relaxed, forward thrust, halfway retract, relaxed. Row4 command: relaxed, lift spear to shoulder level, halfway lower, relaxed. Row5 bowed head tired breathing: four almost identical slumped poses, last close to first. CRITICAL rows1 3 4 5 horse all four hooves stay on ground in identical idle stance, NO LIFTED FRONT LEGS, no rearing or lunging. Only row2 horse legs move. All 20 same rider and horse body sizes and centered saddle/ground baseline. Spear has ONE silver blade and ONE small red tassel at ONE end only, other end plain brown wood. No second blade. Keep spear compact and foreshortened within same silhouette size, never above topknot. Complete connected horse+rider per cell, no parts. Equal square cells, at least18% transparent padding on all sides including spear. TRUE transparent background, remove gray background, no labels or grid.
```

#### neRepair

```text
EDIT this NORTHEAST 2 o'clock cavalry sheet. Preserve its correct horse AND rider BACK-RIGHT camera: horse rump near bottom left, head upper right, see rider back. Rebuild 4 columns x5 rows=20 sprites. Identity same young male black headband SMALL TOPKNOT (no long loose hair), brown lamellar leather blue-gray sleeves red sash boots. Change horse orange color to muted DARK CHESTNUT BROWN, simple BROWN leather tack with small brass circles, no bright orange coat/gold harness. Consistent across20.
RIGHT hand on FAR SIDE holds spear; clearly show near LEFT arm bent DOWN to reins in ALL cells. Near left arm NEVER lifts. Far right arm partly occluded by back, right hand reaches beyond far screen-right shoulder for thrust/command. One silver blade+one red tassel at ONE end; other end brown wood.
Rows1 IDLE subtle breathing; row2 WALK alternating leg steps; row3 ATTACK relaxed spear low, compact foreshortened forward thrust, halfway retract, relaxed low; row4 command relaxed low, shoulder-level spear, halfway lower, relaxed low; row5 WEAKENED bowed head little breathing four nearly identical poses, last close to first. Horse all four hooves PLANTED in same idle stance in rows1/3/4/5. NO rearing front leg lifting lunging except walk row2. SAME horse and rider size across all rows, never enlarge weak. Spear compact within total silhouette max110% idle, not above head. Complete horse+rider per cell, identical ground baseline, generous18% empty cell margins. Transparent background, remove gray background. No text grid effects.
```

#### nwHands

```text
Edit only weapon/arm errors in this 4-column 5-row NW back-left cavalry sheet. Preserve all 20 horses, positions, sizes, planted hooves, rider costumes and direction exactly.
Spear must have ONLY ONE silver blade at ONE end and one red tassel; opposite end is plain blunt brown WOOD. In row4 col2 currently two silver tips: REMOVE the lower-right silver blade and tassel, replace with plain shaft end. Keep upper-left silver blade.
Anatomical RIGHT hand weapon, LEFT reins. In NW back-left view the RIGHT shoulder is on screen RIGHT of torso, farther from camera; near LEFT arm on screen LEFT must stay DOWN touching reins. In row3 col2 and col3, redraw thrust so RIGHT arm starts at screen-RIGHT shoulder, swings forward over far side of horse neck while LEFT near arm stays bent DOWN on reins. Do not place weapon in the near left arm. No extra arm or spear. Row3 col1 and col4 unchanged. Entire connected character no separated parts. Keep all twenty and transparent background, no labels.
```

#### seSpear

```text
Targeted correction ONLY to cell row FOUR column TWO in this 4-column 5-row cavalry sprite sheet. It currently has a spear with silver blades at both ends. Spear is SINGLE-HEADED. Keep the silver leaf blade at upper-right tip, with red tassel below it. Replace lower-left silver blade and its tassel with plain blunt BROWN WOOD shaft end. Keep the right hand holding same shaft, no second weapon. Preserve all other19 sprites completely and preserve horse/rider size/pose and all hooves. Do not move any sprite. True transparent background.
```

#### nwAttackRepair

```text
Fix ONLY ROW THREE COLUMN TWO and ROW THREE COLUMN THREE of this 4x5 NW cavalry sheet. Current visible left forearm is raised incorrectly. COPY the same LOWERED LEFT REIN ARM anatomy from row3 col1 into these poses by redrawing the complete character. Keep near left hand down at horse withers. The weapon is held only by RIGHT hand on far hip at SCREEN RIGHT edge of torso, just like row3 col1. For attack animate a small forward push from that right hip: far right elbow straightens slightly, spear shaft passes BEHIND torso and horse neck toward screen upper LEFT, blade visible beyond horse ear. Right weapon hand stays near screen-right waist, NOT near screen-left shoulder. Most weapon arm is hidden behind back. Do not raise either visible forearm across horse neck. Row3 col2 slight torso lean forward 5 degrees and short push; col3 halfway recover. Horse stance and all hooves identical row3col1. Keep rest of 18 cells unchanged, same size, same transparency and no new objects.
```

#### swReach

```text
Technical weapon reach correction to this SOUTHWEST 4-column5-row sheet. Preserve ALL horse/rider bodies, planted feet, exact sizes, positions, directions, clothing, colors and pose order. ONLY modify spears in row3 col2 and col3 (attack), row4 col2 and col3 (skill): shorten exposed shaft by 25% and use perspective foreshortening so entire spear stays within the same horizontal extent as row1 idle sprite, and top blade NEVER rises higher than rider topknot. Keep ONE silver leaf blade, small red tassel, plain brown butt end, RIGHT far hand only. Command gesture can be compact shoulder-level diagonal, not above head. Do not make horse or rider smaller. Keep all20 connected figures and transparent background unchanged.
```

#### neReach

```text
Edit only spear reach in this NE back-right 4x5 cavalry sheet. Preserve all horse and rider bodies, poses, feet, direction, scale, saddle and color. Spears currently extend too far right and force body downsizing. Use a SHORT spear: reduce exposed shaft length 30% in ALL20 cells, keep same one gray leaf blade and one small red tassel. In row3 col2/3 foreshorten thrust and bend right elbow slightly so full silhouette including spear fits within width105% of standing horse+rider height. In row4 col2/3 command spear stays SHOULDER LEVEL with blade no higher than topknot, compact elbow. Do not shrink horse/rider. Anatomical right weapon hand stays same, left rein hand fixed. All20 sprites same size with full transparent margins, no clipped blade, no extra weapon or parts.
```

#### seSkillRecovery

```text
Fix ONLY ROW FOUR columns TWO and THREE of this 4-column5-row SE cavalry sheet for smooth command animation. All other18 sprites unchanged. Spear tip must stay on SCREEN LEFT side of the right hand in every frame, just like row4col1/4; do NOT swing blade to screen right. Row4col2: rider raises anatomical right hand on screen-left side of chest up toward shoulder, holding short spear whose SINGLE silver blade points diagonally UPPER LEFT, plain wooden butt toward lower right. Blade never above topknot. Row4col3: right hand halfway lowering toward waist, spear blade points LEFT horizontally, midway between raised and idle lowered-left pose. Left hand always on reins. Horse, all four planted hooves, rider body, seat, head, camera and scale EXACTLY same as row4col1. No torso lunge, no second blade, no extra arms. Whole connected sprites. Transparent background. Smooth little salute, not overhead spin.
```

#### nwSkillRecovery

```text
Edit ONLY ROW FOUR COLUMN THREE of this 4-column5-row NW cavalry sheet. This is command recovery frame. Draw the complete same horse+rider with right weapon hand halfway LOWERED from row4col2 raised position, at right SHOULDER height. Spear single silver blade points upper LEFT just at rider head height, plain wooden butt lower right. The pose must visually interpolate between row4col2 and row4col4, not instantly return to neutral. LEFT hand on reins stays down. Horse and all four hooves EXACT same as row4col1, no movement, no size change. Keep all other19 cells unchanged, true transparent background, no extra blade/arm.
```

#### neTack

```text
Color-only edit to this 4-column5-row NE cavalry sheet. In ALL20 sprites, recolor the bright yellow/gold rim of the saddle and harness edging to DARK BROWN LEATHER, matching the horse's brown bridle and plain leather tack. Keep only small round brass buckles/discs metallic; no long golden edging. Preserve EXACT horse shape and muted brown coat, rider armor and red waist sash, hair, weapon/hand, positions, planted feet, all20 motion poses, all sizes and transparent background. No other edits, no resizing or reframing.
```

#### seSkillStyle

```text
IMAGE1 is the EDIT TARGET: 4 columns5 rows20 small SE cavalry sprites. IMAGE2 is ONLY a reference for right hand and spear orientation, NOT for horse/rider design or body proportions. Output the ENTIRE SAME20-cell sheet as image1. Edit ONLY row4 col2 and col3: adopt image2's single-blade spear pose pointing screen LEFT, raised at col2 then halfway lowered leftward at col3. Keep image1's EXACT head size, face, armor detail, horse body, horse legs, horse muzzle, tack, saddle, scale and position in those two cells; change only right forearm/hand and spear orientation. Left reins hand stays fixed. All other18 cells absolutely unchanged. Do not enlarge details or change linework. All four horse hooves planted. Entire connected characters, true transparent background.
```

---

# v1 보존 기록

# 경기병 job 9 모션 시각 초안

2026-10-26. 내장 image_gen 사용. 사용자 검토 필요. 사이트 UI와 실제 게임 판정은 연결하지 않았다.

## 결과

- 전투 4방향 × 4동작 × 4프레임 = 64장.
- 빈손 하마 시나리오 4방향 × 4프레임 = 16장.
- 전투 탑승 쇠약 4방향 × 4프레임 = 16장.
- 총96장, 모두160×160 투명 WebP 품질78. 프레임479,648bytes, 검수시트6장·재생WebP6장689,714bytes. 이미지 전체1,169,362bytes.
- 출력: web/public/images/class-motion-pilot/cavalry/job-9/{combat-v1,scenario-v1,weakened-v1}/.
- 파일명 {direction}-{action}-{frame}.webp. NW/NE/SE/SW = 11시 등왼쪽/2시 등오른쪽/5시 앞오른쪽/7시 앞왼쪽.
- combat action0 대기320ms, action1 이동170ms, action2 공격190ms, action3 스킬240ms. scenario action0 360ms, weakened action0 300ms.
- 하단 발 기준y150, 중심x80. 동일 시트 전체에 같은 배율을 적용하고 발 영역 중심으로 정렬. 무기 포함 최대외곽140px. 프레임별 확대 및 부품 합성·반전 없음.
- 기준 대기 높이는 SE117px/NW117px/SW123~124px/NE113~114px. 하마111~114px, 쇠약124~131px. 창과 여백 확보 때문에 일부 방향은 목표128px보다 작다. 방향·상태 간 크기 완전 일치는 미달이며 후속 보완점이다.

## 참고 이미지

- 외형 승인: web/public/images/job-models/se-v1/job-9.webp (view_image로 확인 후 모든 최초 생성에 참조).
- 공통 스타일·크기: web/public/images/playable/wang-geon/full-frame-v1/se-0-0.webp.
- 빈손 시나리오: web/public/images/playable/wang-geon/scenario-standing-v2/se-0-0.webp.
- 쇠약: web/public/images/playable/wang-geon/weakened-v1/se-0-0.webp.
- 왕건 얼굴/왕복을 복제하지 않고 경기병 검은 머리띠·상투·갈색 경갑·청회색 소매·붉은 허리 장식·창·갈색 말 정체성을 유지했다.

## 검수와 수정

1. 최초 SW 시트에서 오른쪽 방향 혼입 발견 → 내장 이미지 도구로 전16프레임을 SW로 수정. 무기손을 유지하는 별도 원화이며 수평반전하지 않았다.
2. 첫 전투 시트의 창끝과 셀 여백 부족 → 내장 이미지 도구로 전체 레이아웃 수정. 여전히 규칙적인 셀 경계를 넘는 자세가 있어 완전한 연결영역 전체를 추출했다. 셀별 직사각형 잘라내기로 창끝을 버리지 않았다.
3. NE의 가까운 왼손 무기 문제 → 먼 오른팔 무기/가까운 왼팔 고삐를 명시해 이미지 수정. 수정 과정에서 동작 단계가 획일화되어 공격 준비→찌르기→후속→복귀, 스킬 준비→들기→유지→복귀를 추가 수정했다. 가려지는 손의 정밀 해부학적 확인은 사용자 검토 대상으로 남긴다.
4. NE 창이 길어 다른 방향보다 몸체가 작아짐 → 창길이·원근 단축 추가 수정. 105px에서113~114px로 개선했지만 다른 방향과 완전 동일하지 않다.
5. 쇠약 마지막 열의 방향 뒤집힘 → 이미지 수정 후 남은 SE/SW 마지막 완성 프레임 두 개를 올바른 행에 재배치. 신체·무기 조각 합성은 하지 않았다.
6. pack.py는 알파 연결영역 추출, 작은 고립 픽셀 제거, 고정배율 리사이즈, 발 정렬, WebP 저장만 수행한다. 이미지 그림을 코드로 재작성하지 않았다.
7. 96장 모두 디코딩·파일명·크기160×160·알파0/255·경계여백·누락 검사를 통과했다. 모든 bboxes는 manifest.json에 기록. 저장 프레임의 최소 외곽 여백은 7px 이상, 바닥은y150 이하. 결과 contact 시트는224px 셀 안에 프레임을 배치해 좌우최소39px, 상하최소41/42px 여백을 확보한다. 생성 원시 시트의 12~15% 여백은 전셀 충족하지 못했고 이를 만족한다고 주장하지 않는다.
8. 밝은 배경의 contact 시트6장으로96프레임 모두 육안 확인: 방향, 말/기수 연결, 창 끝, 발, 빈손 시나리오, 인접 셀 조각 혼입을 검토했다. 확인 범위에서 잘린 부품이나 분리된 팔은 보이지 않는다.
9. 임시 로컬 읽기 전용 서버와 in-app browser로6개 animated WebP(대기·이동·공격·스킬·시나리오·쇠약)를 열어 시간차 화면을 확인했다. 말다리 자세 변경과 공격/스킬 단계 변경을 확인했다. 게임 사이트 컴포넌트 연결 및 모바일 실기기 검수는 하지 않았다.

## 남은 문제·미제작

- 모든 프레임 제작·저장 완료는 최종 게임용 모션 승인과 다르다. status=visual-draft-review-required.
- 공격 복귀 때 기수 상체/말 자세 전환이 크고, NW/SW 공격·스킬에서 말 앞다리가 들리는 원화가 남아 있다. 완벽히 지면 고정된 전투 동작은 아니다.
- 쇠약 SE/SW 마지막 프레임의 머리각·창 가림 및 말 체형 변화가 보여 루프 연결 보완 여지가 있다. 쇠약의 말 위치가 완전히 고정된 것은 아니다.
- NE 말색/마구 디테일과 방향별 얼굴·몸체 크기 차이가 남아 있다. 창 손이 몸에 가려지는 프레임은 정밀 검토 필요.
- HP30% 이하/상태 이상은 시각 시안의 용도이며 실제 판정 코드나 행동 불능 규칙을 만들지 않았다.
- 승급·다른 병과·하마 이동/공격/스킬/쇠약 미제작. 개별 아이템 외형·능력치·병과·공통컴포넌트·기존이미지·데이터JSON은 수정하지 않았다.
- 빌드·UI 연결·커밋·푸시·배포는 수행하지 않았다.

## 생성 원본 정리

아래 이번 작업 생성 PNG14장만 경량본 검수 후 삭제 완료했다. 프롬프트·경량 프레임·contact 시트·animated WebP·manifest·변환 스크립트는 보존한다. pack.py 재생성에는 아래 프롬프트로 원본 재생성이 필요하다.

- /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-b839dedf-e9df-417d-9215-e35e95c67965.png
- /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-a519de03-c102-4e57-962a-e540f0ce8a4a.png
- /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-17886b26-6c0d-4991-a426-294f2533139b.png
- /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-e13fe6e9-71e0-4ef7-8562-fa81d2b32bf4.png
- /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-8b36883a-6741-4630-854c-75d44b1271cb.png
- /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-443a99de-8138-4f6f-a130-44457fa03b84.png
- /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-90ae4e51-6ede-4363-bb68-f2a3d395ab9c.png
- /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-caa732b7-785b-41e4-9e3d-e06ddf77112d.png
- /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-3a602ed0-6f28-4a71-80f8-216a569f208d.png
- /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-e93483ab-59c6-4482-a05a-c1bde644d5e6.png
- /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-2807dbfa-4d4b-4e66-ab5f-5e0e1c7f2e40.png
- /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-da8b51e7-4ec2-4e76-aa18-20866a2bbdff.png
- /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-0d8022b1-89a5-4f2a-9d22-3b524e635b7c.png
- /Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-eb2e2f9f-bf10-49c6-8807-18caaa291e64.png

## 전체 최종 프롬프트 및 수정 이력

최종 사용 체인: SE → seFix, SW → swFix, NW → nwFix, NE → neFix → neHandFix → neActionFix → neProportionFix, scenario, weakened → weakenedFix.

### se

```text
Use case: stylized-concept. Create a transparent tactical RPG animation sprite sheet. Reference image is the APPROVED light cavalry job9: preserve exactly this male young adult face, black headband and topknot, brown leather lamellar armor over muted slate blue sleeves, red waist cloth, boots, plain brown horse with dark mane, leather tack and short spear with iron leaf tip and red tassel. NOT a king, no crown, no blue royal robe. Crisp dark outlined compact game sprites matching reference. Draw COMPLETE connected horse and rider together, no separated parts. Exactly 4 columns x 4 rows on a square canvas, sixteen equal square cells. Each complete figure including spear occupies only central 68% of cell, at least 15% transparent margins all sides. Consistent scale and planted ground anchor across all cells. No text, grid, background, shadows, glow or floating effects. Spear always in anatomical RIGHT hand, left holds reins; never mirror weapon hands. Horse and rider face same direction. Anatomically connected arms, two rider legs straddling saddle, four horse legs only. ALL cells face SOUTHEAST 5 o'clock, screen RIGHT and TOWARD viewer, front three quarter. Rows: 1 four subtle breathing idle frames; 2 four distinct sequential horse WALK cycle frames with alternating planted and lifted legs and synchronized rider pelvis, in place; 3 spear attack anticipation pull back, forward thrust, follow through, recover, horse grounded; 4 command skill prepare spear, raise spear diagonally, hold command, lower to recover. Four columns are time frames 0 1 2 3. Keep entire spear within cell, use foreshortening for thrust, no cropped tips.
```

### sw

```text
Use case: stylized-concept. Create a transparent tactical RPG animation sprite sheet. Reference image is the APPROVED light cavalry job9: preserve exactly this male young adult face, black headband and topknot, brown leather lamellar armor over muted slate blue sleeves, red waist cloth, boots, plain brown horse with dark mane, leather tack and short spear with iron leaf tip and red tassel. NOT a king, no crown, no blue royal robe. Crisp dark outlined compact game sprites matching reference. Draw COMPLETE connected horse and rider together, no separated parts. Exactly 4 columns x 4 rows on a square canvas, sixteen equal square cells. Each complete figure including spear occupies only central 68% of cell, at least 15% transparent margins all sides. Consistent scale and planted ground anchor across all cells. No text, grid, background, shadows, glow or floating effects. Spear always in anatomical RIGHT hand, left holds reins; never mirror weapon hands. Horse and rider face same direction. Anatomically connected arms, two rider legs straddling saddle, four horse legs only. ALL cells face SOUTHWEST 7 o'clock, screen LEFT and TOWARD viewer, front three quarter. Anatomical RIGHT weapon hand is far side, LEFT reins hand near side. Independently draw, do not mirror. Rows: 1 four subtle breathing idle frames; 2 four sequential horse WALK cycle frames alternating lifted legs and support legs, synchronized rider; 3 spear attack pull back, thrust, follow through, recover; 4 command skill prepare, raise spear, hold, recover. Columns time 0-3. Full spear contained with foreshortening, no cropped tips.
```

### nw

```text
Use case: stylized-concept. Create a transparent tactical RPG animation sprite sheet. Reference image is the APPROVED light cavalry job9: preserve exactly this male young adult face, black headband and topknot, brown leather lamellar armor over muted slate blue sleeves, red waist cloth, boots, plain brown horse with dark mane, leather tack and short spear with iron leaf tip and red tassel. NOT a king, no crown, no blue royal robe. Crisp dark outlined compact game sprites matching reference. Draw COMPLETE connected horse and rider together, no separated parts. Exactly 4 columns x 4 rows on a square canvas, sixteen equal square cells. Each complete figure including spear occupies only central 68% of cell, at least 15% transparent margins all sides. Consistent scale and planted ground anchor across all cells. No text, grid, background, shadows, glow or floating effects. Spear always in anatomical RIGHT hand, left holds reins; never mirror weapon hands. Horse and rider face same direction. Anatomically connected arms, two rider legs straddling saddle, four horse legs only. ALL cells face NORTHWEST 11 o'clock, screen LEFT and AWAY from viewer, REAR three quarter. See rider's BACK and horse rump, horse head toward upper left. Anatomical right hand spear, left reins. Rows: 1 four subtle breathing idle frames; 2 four sequential horse WALK cycle frames alternating lifted legs and support legs, synchronized rider; 3 spear attack pull back, thrust, follow through, recover; 4 command skill prepare, raise spear, hold, recover. Columns time 0-3. Full spear contained with foreshortening, no cropped tips.
```

### ne

```text
Use case: stylized-concept. Create a transparent tactical RPG animation sprite sheet. Reference image is the APPROVED light cavalry job9: preserve exactly this male young adult face, black headband and topknot, brown leather lamellar armor over muted slate blue sleeves, red waist cloth, boots, plain brown horse with dark mane, leather tack and short spear with iron leaf tip and red tassel. NOT a king, no crown, no blue royal robe. Crisp dark outlined compact game sprites matching reference. Draw COMPLETE connected horse and rider together, no separated parts. Exactly 4 columns x 4 rows on a square canvas, sixteen equal square cells. Each complete figure including spear occupies only central 68% of cell, at least 15% transparent margins all sides. Consistent scale and planted ground anchor across all cells. No text, grid, background, shadows, glow or floating effects. Spear always in anatomical RIGHT hand, left holds reins; never mirror weapon hands. Horse and rider face same direction. Anatomically connected arms, two rider legs straddling saddle, four horse legs only. ALL cells face NORTHEAST 2 o'clock, screen RIGHT and AWAY from viewer, REAR three quarter. See rider's BACK and horse rump, horse head toward upper right. Anatomical right hand spear far side, left reins near side. Independently draw, no mirror. Rows: 1 four subtle breathing idle frames; 2 four sequential horse WALK cycle frames alternating lifted legs and support legs, synchronized rider; 3 spear attack pull back, thrust, follow through, recover; 4 command skill prepare, raise spear, hold, recover. Columns time 0-3. Full spear contained with foreshortening, no cropped tips.
```

### swFix

```text
Edit this 4x4 light cavalry animation sheet. CRITICAL EVERY horse and rider in all 16 cells must face screen LEFT and toward viewer (7 o'clock SOUTHWEST FRONT three-quarter). Currently many face right incorrectly. Redraw those to left, preserving same face brown leather armor slate sleeves black headband topknot red sash brown horse and spear. Weapon ALWAYS anatomical RIGHT hand (far arm in this view), left hand near viewer holds reins. No horizontal flipping that changes weapon hand. Rows idle, walk, spear thrust attack, spear command skill; four time frames per row. ALSO reduce ALL figures to central 64% width and height of their equal square cell, 18% clear transparent margins every side INCLUDING spear tips. Each ground anchor at 82% cell height. Identical body scale in all frames. Whole connected horse+rider. No crop, no effects, no text, no grid, true transparent.
```

### seFix

```text
Edit this 4x4 light cavalry sprite sheet for TECHNICAL LAYOUT ONLY. Keep all sixteen poses, same SE front screen-right direction, same character identity costume horse spear and anatomical right weapon hand. Shrink every COMPLETE connected horse+rider+spear to fit within middle 64% width and height of its equal square cell. 18% transparent margin on EVERY side including all spear tips. Ground anchor at 82% of each cell height. Maintain identical horse and rider body scale across ALL actions; no individual pose enlargement. Repair any cropped spear tip or hooves, keep separate sprites. Preserve rows idle/walk/thrust/command and 4 columns time. No effects, glow, shadow, grid or text. TRUE transparent background.
```

### nwFix

```text
Edit this 4x4 light cavalry sprite sheet for TECHNICAL LAYOUT. Preserve ALL sixteen poses and NW rear screen-left direction, identity costume horse spear, RIGHT weapon hand. Shrink every COMPLETE horse+rider+spear into middle 64% width and height of its equal square cell. 18% TRANSPARENT margin on EVERY side including spear tips. Ground anchor at 82% cell height. SAME horse and rider body scale across all actions. Reconstruct cropped tips if any. Rows idle/walk/thrust/command and four time columns unchanged. Horse stays standing in command row, not rearing. No effects, shadows, grid, text, detached parts. True transparent.
```

### neFix

```text
Edit 4x4 light cavalry sprite sheet. Keep NE 2 o'clock REAR screen-right direction in ALL cells, identity brown armor black topknot horse. Correct weapon hand: character anatomical RIGHT hand on FAR side holds spear, near visible LEFT hand holds reins. Never swap hands. Draw right arm reaching on far side, partly occluded by torso, not spear in visible near left hand. Also SHRINK all complete sprites including spear to central 64% of each equal square cell, 18% EMPTY transparent margin every side. Ground baseline82% cell. Same horse/rider scale across every action. Preserve rows idle/walk/thrust/command, four time columns. No cutoffs, grid, text, effects or shadows. True transparent.
```

### scenario

```text
Use case stylized-concept. Transparent tactical RPG sprite sheet of approved light cavalry reference, DISMOUNTED, NO HORSE, NO SPEAR, NO WEAPON, NO SCABBARD, NO SHIELD. Keep same young adult male face, black headband topknot, slate blue sleeves under brown leather lamellar vest and skirt, red sash, pants and boots. Natural standing with both hands EMPTY and relaxed at sides, no gripping. Entire connected body, normal compact game proportions matching reference. FOUR rows FOUR columns equal square cells. Row1 NW 11 o'clock BACK upper LEFT; row2 NE 2 o'clock BACK upper RIGHT; row3 SE 5 o'clock FRONT lower RIGHT; row4 SW 7 o'clock FRONT lower LEFT. Four columns subtle breathing 0 1 2 3, feet fixed, no turning. Every figure within central64% of cell, 18% transparent margins on all sides. Same body scale and ground baseline82% per cell. Crisp outlined limited palette, no effects shadows text grid or background. True alpha.
```

### weakened

```text
Use case stylized-concept. Transparent tactical RPG sprite sheet of APPROVED light cavalry on his brown horse. Same young male face black headband topknot brown leather lamellar armor slate sleeves red sash boots plain brown horse dark mane leather tack short spear red tassel iron leaf tip. COMPLETE connected rider+horse, no parts assembly. FOUR rows FOUR columns equal square cells. Row1 NW 11 o'clock BACK upper LEFT; row2 NE 2 o'clock BACK upper RIGHT; row3 SE 5 o'clock FRONT lower RIGHT; row4 SW 7 o'clock FRONT lower LEFT. Every cell in a row keeps direction. Four columns weakened breathing loop: head visibly lowered, shoulders slumped, slight tired lean center-left-center-right. HORSE STANDING still feet planted, never walking or rearing. Rider stays securely seated, left hand reins, anatomical RIGHT hand spear low safely. Hands never swap with direction. Entire sprite including spear within central64% of each cell with 18% transparent margins every side. Identical horse/rider body scale and ground baseline82%. No stars blood glow effects shadows grid text. True alpha. Match reference crisp outlined game style.
```

### weakenedFix

```text
Correct this weakened cavalry 4x4 sheet. In EACH row the FOURTH cell must face exactly same direction as first 3: row1 BACK LEFT NW; row2 BACK RIGHT NE; row3 FRONT RIGHT SE; row4 FRONT LEFT SW. Correct all four last-column reversed poses by redrawing, keep weakened breathing. Also correct rows2 and4 weapon: RIGHT hand on far side holds spear, LEFT hand near viewer holds reins, spear on FAR side partially hidden behind torso, not visible near-side arm. Row1 and3 weapon hand unchanged. Horse stands still, rider head slumped. Keep face costume brown horse scale. Reduce all figures to central60% of each cell with20% transparent padding, ground baseline80%, including spear. Four columns are subtle slump frames, not turning frames. True transparency, no text lines effects.
```

### neHandFix

```text
Redraw the ARMS AND SPEAR in this northeast back-right cavalry 4x4 sheet. Current visible near-side LEFT ARM incorrectly carries spear. Change that near-side LEFT arm in EVERY CELL to bend DOWN with LEFT HAND touching reins at horse withers. It must NEVER lift or hold spear. Put spear in FAR-SIDE RIGHT HAND: right shoulder/arm partly occluded behind rider's upper back, right hand visible beyond far shoulder on screen RIGHT. For attack far right arm extends over far side of horse neck, for command far right arm lifts above far RIGHT shoulder; visible near left arm remains DOWN at reins in all 16 cells. Keep all faces horse costume directions poses rows layout scale, transparent background. No extra weapons, no separate parts. Ensure 15% empty cell margins.
```

### neActionFix

```text
Keep this NE rear-right cavalry character and corrected hand assignment: visible near LEFT arm down on reins, far RIGHT arm holds spear. Change ONLY right spear arm poses to restore animation sequence. Row1 all4: right spear hand held LOW at waist far side, spear points forward low, quiet idle. Row2 all4: same lowered spear while horse walks. Row3 col1: RIGHT arm pulls spear back preparing thrust; col2: RIGHT arm thrusts spear HORIZONTALLY forward toward upper right; col3 follow-through horizontal thrust with torso leaning forward; col4 right arm lowers spear and torso upright. Row4 col1 right hand spear at waist; col2 right arm raises spear diagonally; col3 hold raised; col4 lowers to waist. Near left hand ALWAYS DOWN on reins; NEVER carries spear. Preserve all horses, directions, costume identity. Complete connected sprites, adequate transparent margins, no text grid effects.
```

### neProportionFix

```text
Edit this NE rear-right 4x4 light cavalry sheet ONLY spear proportions and weapon reach. The spear is too long and forces sprite body to shrink. Make short spear 25% shorter in EVERY cell, preserve leaf blade and red tassel. Attack thrust use perspective foreshortening, keep entire silhouette no wider than the horse+rider standing height. Command raise spear at shallow diagonal just above head, entire silhouette no taller than 110% standing horse+rider height. Preserve same body/horse size and exact directions, corrected right far weapon arm and left near reins arm, rows idle walk attack skill, 4 time columns. Never scale rider or horse per action. Keep transparent background and clean separated frames.
```

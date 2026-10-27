# 중기병 ID10 승급 모션 제작·검수 기록

2026-10-27. 내장 image_gen 사용. 상태: **미해결 보완점이 있는 시각 초안**. 파일 세트는 갖췄으나 최종 게임용 승인이나 원본 동작 재현 완료를 뜻하지 않는다.

## 산출물

- baseJobId9, stage1. 전투64 + 무기·칼집 없는 하마 시나리오16 + 탑승 쇠약16 =96프레임.
- 개별 프레임 497,988bytes. 검수시트6장·재생WebP6장 722,334bytes. 합계 1,220,322bytes.
- 160×160 투명 WebP, quality78, 접지 y150. 프레임명 {direction}-{action}-{frame}.webp.
- 방향 NW11시 등/NE2시 등/SE5시 앞/SW7시 앞. combat action0대기/1이동/2공격/3스킬, frame0~3.
- 재생시간 대기320ms, 이동170ms, 공격190ms, 스킬240ms, 시나리오360ms, 쇠약300ms.
- contact-{action}.webp: 행NW/NE/SE/SW, 열시간0~3. preview-{action}.webp: 네 방향을 나란히 재생.

- combat: web/public/images/class-motion-pilot/cavalry/job-10/combat-v1 (64장, 364,336bytes)
- scenario: web/public/images/class-motion-pilot/cavalry/job-10/scenario-v1 (16장, 50,590bytes)
- weakened: web/public/images/class-motion-pilot/cavalry/job-10/weakened-v1 (16장, 83,062bytes)

## 승인 외형과 작업 경계

기준: web/public/images/job-models/promotion-se-v1/job-10.webp. 먼저 이미지를 열어 확인했다. 승급 데이터 실제 경로는 web/src/features/game-world/data/promotion-models.json이며 대표 무기는 긴창이다. 중기병의 밤색 말과 친위대의 어두운 마갑 말을 구분하고 얼굴·성별·체격을 유지하도록 제작했다.

머리·팔·무기 부품을 조립하거나 좌우 반전하지 않았다. 완성 말+기수 시트를 생성하고 연결 영역을 추출했다. 방향 공통 배율, 알파 정리, 발 기준 y150 및 하체 중심 평행이동으로 정렬했다. 시나리오는 약112px, 탑승 대기 목표128px, 쇠약 목표120px로 고개 숙임을 반영했다. 쇠약의 말 체격과 시점은 전투와 완전히 일치하지 않을 수 있어 아래 한계에 구분했다.

공통 UI·데이터·기본 ID9 manifest·다른 담당 파일·전투 수치는 수정하지 않았다. 사이트 통합과 HP30%/상태 이상 자동 판정은 통합 담당 범위이며 여기서는 이미지 자산만 제작했다. 커밋·푸시·배포 없음.

## 수정·재사용 기록

손 바뀜, 중복 창, 창끝 누락, 잘못된 방향, 마갑 누락을 생성 단계에서 수정했다. 넓은 여백을 요청했지만 일부 원본은 이를 지키지 않아 접촉/잘림 시트를 추가 생성했다. 완성 프레임 전체만 교체했으며 원본 시트가 모두 여백12% 검사를 통과했다고 주장하지 않는다. 최종 분리 파일은 외곽과 투명 여백을 따로 검사했다.

복귀·준비 자세 재사용(새 작화가 아님):

- ne-0-3.webp ← ne-0-0.webp
- ne-1-3.webp ← ne-1-1.webp
- ne-2-3.webp ← ne-2-0.webp
- ne-3-3.webp ← ne-3-0.webp
- nw-3-3.webp ← nw-3-0.webp
- sw-2-0.webp ← sw-0-0.webp
- sw-3-0.webp ← sw-0-0.webp

북동 마지막 프레임의 별도 복원본은 색·체형 변화가 커 최종 사용에서 제외했다. 북동 이동3은 같은 보행 주기의 중립 지지 자세1을 재사용한다. 북동 방향 전체에128/123 배율을 한 번 적용했고 실제 알파 대기 높이는126~127px이다.

## 미해결 문제 — 정확한 대상

아래 항목은 완료 처리하지 않았다.

- combat-v1/nw-2-1.webp, combat-v1/nw-2-2.webp: 몸 뒤 오른손이 일부 가려져 작은 찌르기의 손 연결·가독성을 완전히 확정하기 어렵다.
- combat-v1/sw-2-1.webp, combat-v1/sw-2-2.webp, weakened-v1/sw-0-0.webp, weakened-v1/sw-0-1.webp, weakened-v1/sw-0-2.webp, weakened-v1/sw-0-3.webp: 왼손 고삐와 창대가 겹쳐 보이는 부분이 남아 있다. 고삐 손 분리 표현은 추가 작화 검토 대상.
- combat-v1/ne-2-0.webp, combat-v1/ne-2-1.webp, combat-v1/ne-2-2.webp, combat-v1/ne-2-3.webp: 창 길이를 원근으로 줄인 뒤 공격 진폭이 작아졌다. 게임 표시 크기에서 타격 가독성 보완 필요.
- combat-v1/se-2-0.webp, combat-v1/se-2-1.webp, combat-v1/nw-2-0.webp, combat-v1/nw-2-1.webp: 준비에서 찌르기로 전환할 때 창의 각도 변화가 크다. 4프레임 사이 중간 동작은 미제작.
- combat-v1/nw-0-0.webp, combat-v1/nw-0-1.webp, combat-v1/nw-0-2.webp, combat-v1/nw-0-3.webp, combat-v1/ne-0-0.webp, combat-v1/ne-0-1.webp, combat-v1/ne-0-2.webp, combat-v1/ne-0-3.webp, combat-v1/se-0-0.webp, combat-v1/se-0-1.webp, combat-v1/se-0-2.webp, combat-v1/se-0-3.webp, combat-v1/sw-0-0.webp, combat-v1/sw-0-1.webp, combat-v1/sw-0-2.webp, combat-v1/sw-0-3.webp: 대기 실루엣은 대략125~130px이며 방향별 체격·세부 갑주가 픽셀 수준으로 완전히 같지는 않다.

## 검증

96개 파일의 존재·크기·알파·SHA256·접지·캔버스 외곽을 확인했다. 6개 재생WebP는 모두4프레임이고 지정 지속시간을 갖는다. 6개 동작별 검수시트에서 모든 프레임을 검토하고 브라우저 임시 읽기 전용 미리보기에서 재생 표본을 확인했다. 실제 게임 UI 통합·모바일 실기기 검사는 하지 않았다.

3→0 알파 실루엣 차이를 manifest.loopDiagnostics에 기록했다. 이는 프레임간 그림 차이를 찾는 보조값이며 동작 품질 합격 수치가 아니다. 보행의 마지막→처음은 다리 위상 차이가 있어 대기와 같은 수치 기준을 쓰지 않는다.

## 프롬프트 및 생성 원본 이력

경량본·브라우저 검수 후 이번 승급 생성 원본 16장 정리 완료. 원본 SHA256과 사용 여부 추적용 경로는 manifest.prompts에 보존한다. 삭제 후 재추출하려면 기록된 프롬프트로 재생성해야 한다.

### p10se

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-0ac451bf-1a06-4fed-85b2-16846db90e71.png

```text
Use case: identity-preserve. Tactical RPG production animation sheet of the EXACT approved HEAVY CAVALRY in reference1: same young male face and build, dark open-faced helmet with red plume, charcoal metal lamellar with bronze edging, blue-gray sleeves, red waist sash and red hanging cloth. SAME chestnut brown horse, black mane/tail, white short socks, brown bridle and red saddle cloth, no full horse armor. Long dark wooden SPEAR with ONE silver leaf-shaped blade and red tassel at ONE end; plain wooden butt. Preserve approved costume, face and gear, do not invent another promotion. Crisp outlined detailed but mobile-readable reference style.
Exactly FOUR columns FOUR rows=16 equal square cells on square transparent sheet. Each complete connected horse+rider within central64% cell width AND height including spear. At least18% empty transparent margin on ALL sides. Same horse body/rider scale and same saddle center and ground baseline across every cell, no shadows/text/grid/effects. No detached parts, no mirroring.
Rows:1 IDLE four gentle breathing frames all hooves planted.2 WALK four distinct coherent alternating leg phases, rider follows saddle, IN PLACE.3 ATTACK spear ready low, forward compact foreshortened thrust, halfway retract, ready low almost identical to first.4 COMMAND SKILL spear low, hand raised toward shoulder, halfway lower, spear low almost identical to first. Rows1/3/4 horse stands still same four grounded hooves, NEVER rear or lunge. Weapon's physical length stays same; use perspective to contain silhouette, NOT huge overhead sweep. One blade only; blade direction changes smoothly without flipping ends. RIGHT anatomical hand grips shaft visibly; LEFT hand holds reins visibly. Both arms connected to shoulders, no duplicated hands. Pose3 to0 must loop smoothly.
All16 face SOUTHEAST5 o'clock, horse nose screen RIGHT and toward viewer, front three-quarter. Right weapon arm on screen-left of chest, left rein hand on other side. Reference1 matches this direction.
```

### p10nw

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-e3bc3350-e6d5-4a33-9e43-356129631220.png

```text
Use case: identity-preserve. Tactical RPG production animation sheet of the EXACT approved HEAVY CAVALRY in reference1: same young male face and build, dark open-faced helmet with red plume, charcoal metal lamellar with bronze edging, blue-gray sleeves, red waist sash and red hanging cloth. SAME chestnut brown horse, black mane/tail, white short socks, brown bridle and red saddle cloth, no full horse armor. Long dark wooden SPEAR with ONE silver leaf-shaped blade and red tassel at ONE end; plain wooden butt. Preserve approved costume, face and gear, do not invent another promotion. Crisp outlined detailed but mobile-readable reference style.
Exactly FOUR columns FOUR rows=16 equal square cells on square transparent sheet. Each complete connected horse+rider within central64% cell width AND height including spear. At least18% empty transparent margin on ALL sides. Same horse body/rider scale and same saddle center and ground baseline across every cell, no shadows/text/grid/effects. No detached parts, no mirroring.
Rows:1 IDLE four gentle breathing frames all hooves planted.2 WALK four distinct coherent alternating leg phases, rider follows saddle, IN PLACE.3 ATTACK spear ready low, forward compact foreshortened thrust, halfway retract, ready low almost identical to first.4 COMMAND SKILL spear low, hand raised toward shoulder, halfway lower, spear low almost identical to first. Rows1/3/4 horse stands still same four grounded hooves, NEVER rear or lunge. Weapon's physical length stays same; use perspective to contain silhouette, NOT huge overhead sweep. One blade only; blade direction changes smoothly without flipping ends. RIGHT anatomical hand grips shaft visibly; LEFT hand holds reins visibly. Both arms connected to shoulders, no duplicated hands. Pose3 to0 must loop smoothly.
All16 face NORTHWEST11 o'clock, horse head screen upper LEFT and rump lower right, rider BACK visible. Independently draw back-left view, never mirror. The far right weapon arm may be partly occluded by torso but show hand gripping shaft at right hip, near left hand down at reins.
Keep spear blade on the forward upper-left side during attacks. Left hand stays on reins, never grips spear. Ensure wide empty gutters.
```

### p10ne

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-1f65f846-4109-48db-925c-e2dd8540170b.png

```text
Use case: identity-preserve. Tactical RPG production animation sheet of the EXACT approved HEAVY CAVALRY in reference1: same young male face and build, dark open-faced helmet with red plume, charcoal metal lamellar with bronze edging, blue-gray sleeves, red waist sash and red hanging cloth. SAME chestnut brown horse, black mane/tail, white short socks, brown bridle and red saddle cloth, no full horse armor. Long dark wooden SPEAR with ONE silver leaf-shaped blade and red tassel at ONE end; plain wooden butt. Preserve approved costume, face and gear, do not invent another promotion. Crisp outlined detailed but mobile-readable reference style.
Exactly FOUR columns FOUR rows=16 equal square cells on square transparent sheet. Each complete connected horse+rider within central64% cell width AND height including spear. At least18% empty transparent margin on ALL sides. Same horse body/rider scale and same saddle center and ground baseline across every cell, no shadows/text/grid/effects. No detached parts, no mirroring.
Rows:1 IDLE four gentle breathing frames all hooves planted.2 WALK four distinct coherent alternating leg phases, rider follows saddle, IN PLACE.3 ATTACK spear ready low, forward compact foreshortened thrust, halfway retract, ready low almost identical to first.4 COMMAND SKILL spear low, hand raised toward shoulder, halfway lower, spear low almost identical to first. Rows1/3/4 horse stands still same four grounded hooves, NEVER rear or lunge. Weapon's physical length stays same; use perspective to contain silhouette, NOT huge overhead sweep. One blade only; blade direction changes smoothly without flipping ends. RIGHT anatomical hand grips shaft visibly; LEFT hand holds reins visibly. Both arms connected to shoulders, no duplicated hands. Pose3 to0 must loop smoothly.
All16 face NORTHEAST2 o'clock, horse head screen upper RIGHT and rump lower left, rider BACK visible. Independently draw back-right view, never mirror. Right weapon arm visible on screen-right side, left rein arm reaches forward on opposite side, distinct gripping hands.
For attack keep right hand at right hip, extend RIGHT elbow slightly forward while left rein hand NEVER changes. Both hands must not hold spear.
```

### p10sw

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-c93f36da-bcb9-4daa-b779-6cd190a77072.png

```text
Use case: identity-preserve. Tactical RPG production animation sheet of the EXACT approved HEAVY CAVALRY in reference1: same young male face and build, dark open-faced helmet with red plume, charcoal metal lamellar with bronze edging, blue-gray sleeves, red waist sash and red hanging cloth. SAME chestnut brown horse, black mane/tail, white short socks, brown bridle and red saddle cloth, no full horse armor. Long dark wooden SPEAR with ONE silver leaf-shaped blade and red tassel at ONE end; plain wooden butt. Preserve approved costume, face and gear, do not invent another promotion. Crisp outlined detailed but mobile-readable reference style.
Exactly FOUR columns FOUR rows=16 equal square cells on square transparent sheet. Each complete connected horse+rider within central64% cell width AND height including spear. At least18% empty transparent margin on ALL sides. Same horse body/rider scale and same saddle center and ground baseline across every cell, no shadows/text/grid/effects. No detached parts, no mirroring.
Rows:1 IDLE four gentle breathing frames all hooves planted.2 WALK four distinct coherent alternating leg phases, rider follows saddle, IN PLACE.3 ATTACK spear ready low, forward compact foreshortened thrust, halfway retract, ready low almost identical to first.4 COMMAND SKILL spear low, hand raised toward shoulder, halfway lower, spear low almost identical to first. Rows1/3/4 horse stands still same four grounded hooves, NEVER rear or lunge. Weapon's physical length stays same; use perspective to contain silhouette, NOT huge overhead sweep. One blade only; blade direction changes smoothly without flipping ends. RIGHT anatomical hand grips shaft visibly; LEFT hand holds reins visibly. Both arms connected to shoulders, no duplicated hands. Pose3 to0 must loop smoothly.
All16 face SOUTHWEST7 o'clock, horse nose screen LEFT and toward viewer, rider FRONT visible. Independently draw front-left view, never mirror. Right weapon hand on far screen-left side gripping shaft, near left hand on reins at screen-right side. Do not switch weapon into left hand.
For attacks far RIGHT hand pushes spear from right hip across far side of horse neck. Visible near LEFT arm must remain bent down on reins. No raised near arm. Same hand grips same shaft in all16.
```

### p10swFix

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-d02fca43-56ce-46fb-b538-a61372171e58.png

```text
EDIT this16-sprite sheet. CRITICAL WRONG DIRECTION: every horse currently looks screen RIGHT. REDRAW EVERY horse and rider so they face SCREEN LEFT and slightly TOWARD CAMERA, SOUTHWEST7 o'clock. Horse muzzle on LEFT, horse tail on RIGHT. Show rider FRONT, never back. Do NOT leave any right-facing horse. Preserve same approved male face, dark helmet red plume, charcoal bronze-edge armor red sash blue-gray sleeves, chestnut horse red saddlecloth and spear. DO NOT horizontally mirror the finished image: redraw anatomy with RIGHT weapon hand on FAR screen-left side, LEFT near hand at screen-right holds reins. Same4x4 layout, rows idle/walk/attack/command and columns0~3. Idle stance same planted feet in rows1/3/4, only row2 walking. Attack right hand pushes spear forward LEFT from right hip, third cell half retract, fourth neutral identical first. Command right forearm raises spear to shoulder then halfway lower, fourth neutral. Spear blade always LEFT side of grip, blunt butt to RIGHT, no double blades. Same body size all16. Reduce whole sprites inside cells to CENTRAL64%, generous18% empty gutters including spear, true transparent background. No text/effects.
```

### p10swHands

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-b605ae7d-5457-462f-a279-1df179992ad5.png

```text
Precise edit this4x4 LEFT-FACING horse rider sheet. Keep all16 whole characters and direction, horse shape, size, costume, weapon identical. Fix LEFT REIN HAND only: the hand on SCREEN RIGHT of rider is LEFT hand and must release spear in EVERY cell. Bend that screen-right forearm downward, place EMPTY hand on reins at horse withers in FRONT of rider, around horse mane center. This hand NEVER grips brown spear shaft at screen-right hip. The other hand on screen LEFT is RIGHT weapon hand and keeps spear. In attack row3 both hands currently on shaft: remove screen-right hand from shaft and put it low on reins. In skill row4 likewise. NO extra third arm/hand. Additionally row3 col1 and row4 col1 must be neutral ready poses almost same as row1 col1 so frame4→1 loop is gentle. Preserve all other pose progression and all feet. True transparent background, no text.
```

### p10neHands

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-125c20b3-a402-45a8-9b7c-7e5c8e0d11e3.png

```text
Edit this16-sprite BACK-RIGHT horse rider sheet to fix weapon handedness. Keep all horses/poses/direction/costume/size. The arm on SCREEN RIGHT of rider is RIGHT WEAPON arm in this BACK view. In idle row1, walk row2, and col1/4 of attack/skill, redraw spear shaft so visible RIGHT hand on screen-right side of rider grips shaft at hip. Blade end extends diagonally FORWARD to SCREEN RIGHT beside horse head, never behind on screen-left. Left arm on screen-left stays bent forward down and holds reins. In attack/skill middle frames right arm already extends forward screen-right, preserve it, but make left hand clearly on reins. In ALL16 the blade must remain forward RIGHT of grip, no end-flip between idle and attack. Put tip around horse ear height in idle, shoulder height command, NEVER above rider plume. ONE blade, red tassel, blunt butt back-left. Full connected rider+horse, same grounded horse in rows1/3/4, no rear. Wide transparent gutters, no text.
```

### p10neBlade

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-1a8b066d-28da-49b0-8ce4-03a6257293cb.png

```text
Fix spear and layout ONLY. This4x4 sheet has an erroneous SILVER BLADE at BACK LEFT end of every spear. REMOVE ALL16 back-left silver tips; replace with plain rounded BROWN WOOD butt. Keep ONE silver blade at FORWARD RIGHT end with red tassel. No metal at butt. Also redraw complete sprites SMALLER inside same16 square cells with at least15% empty margin all sides; some forward spear tips touch right canvas edge, restore complete tips. Keep long spear proportions but foreshorten forward segment slightly when necessary. Horse+rider SAME size across16. Keep all poses/handedness/direction exactly, no body changes. Transparent background.
```

### p10nwFix

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-05c08568-7f50-4a7a-90cc-69e725ec9ac9.png

```text
Edit ONLY ROW THREE COLUMN TWO in this4x4 NW back-left sheet. Near LEFT ARM is incorrectly extended forward holding spear. Put that near left forearm DOWN with hand on reins, exactly like row3col3. Weapon belongs to FAR RIGHT hand at screen-right waist; show right shoulder connected to bent elbow and gripping spear behind torso. Spear passes BEHIND torso toward upper-left, blade beyond horse ear. For stronger thrust than col3 lean rider forward5degrees and straighten far right arm modestly, keep near left hand down. No extra limbs, no second blade. Horse/feet/costume/size unchanged. Other15 sprites unchanged. Transparent background.
```

### p10scenario

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-ffdc7c15-76df-4e8f-959e-92a035e81bc3.png

```text
Use case identity-preserve. Create SCENARIO unarmed dismounted idle sheet of EXACT young male heavy cavalry rider reference. Same face/build, dark open-face helmet red plume, charcoal lamellar bronze edging, blue-gray sleeves, red sash, long armored skirt and boots. NO HORSE. NO weapon, spear, sword, scabbard, shield or invisible handle. Both EMPTY hands relaxed naturally near thighs. Whole connected standing man.
4 columns4 rows=16 sprites, equal square cells. Rows directions:1 NW11 o'clock BACK upper LEFT;2 NE2 o'clock BACK upper RIGHT;3 SE5 o'clock FRONT lower RIGHT;4 SW7 o'clock FRONT lower LEFT. Each row4 tiny breathing frames, planted feet and same body size, last nearly matches first. At least18% transparent gutters all sides, same baseline and scale, central64% ofcell. Same crisp outlined reference art, no text/grid/shadow/effects, true transparency. Do not mirror asymmetric costume.
```

### p10weakened

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-183fa88f-5254-4972-bfcd-eb14a9593e15.png

```text
Use case identity-preserve. Transparent4x4 sprite sheet of exact heavy cavalry male and chestnut horse reference. Same charcoal bronze-edged armor blue-gray sleeves red sash, dark helmet red plume, chestnut horse black mane white socks red saddlecloth, ONE silver-headed long spear red tassel plain wooden butt. Complete connected rider+horse eachcell.
Rows:1 NW11 o'clock BACK upperLEFT;2 NE2 o'clock BACK upperRIGHT;3 SE5 o'clock FRONT lowerRIGHT;4 SW7 o'clock FRONT lowerLEFT. Horse AND rider face same requested direction. Four columns are WEAKENED breathing: bowed head and slumped shoulders, tiny down/up breath, fourth veryclose first. Horse stays STILL all four hooves planted, same horse body/scale/saddle position all16; do not enlarge or rear. RIGHT weapon hand safely holds spear low, LEFT hand reins, no swapped hands. Spear tip stays above hooves, foreshorten to fit, single blade only. Clearly tired seated rider, no falling, no stars/blood/effects. All16 within central64% ofequal square cells,18% transparent margins, same baseline, crisp outlined approved style.
```

### p10weakFix

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-260a168d-1f75-46be-a01e-145e78cc345c.png

```text
Fix wrong weapon hand in ONLY ROW TWO and ROW FOUR of this4x4 tired cavalry sheet. Keep horse/rider/direction/size/tired pose all16.
ROW TWO back-right: visible SCREEN RIGHT hand is anatomical RIGHT hand and MUST grip spear at right hip, blade extending forward toward SCREEN RIGHT beside horse head, blunt brown butt behind screenleft. Other screenleft hand holds reins.
ROW FOUR front-left: far SCREEN LEFT hand is RIGHT weapon hand, grip spear at far right hip beside horse neck, blade extending forward DOWN LEFT near horse muzzle, NOT behind screenright. Near SCREEN RIGHT arm is LEFT arm, bend down placing empty hand on reins at mane center, no spear in this hand.
Rows1 and3 unchanged. Spear has ONE blade red tassel, blunt wooden butt. All16 horses planted feet, true transparent, all complete sprites comfortably inside canvas with15% margins; no clipped tips.
```

### p10seFix

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-3895b3e2-3e96-48de-bc02-82344cc65362.png

```text
Fix ONLY row3 col3 and row4 col3 of this4x4 southeast cavalry sheet. Left rein hand (screen RIGHT side of chest) incorrectly grips spear in row3 col3. Lower that LEFT hand onto reins at horse mane exactly as idle row1col1, clearly separate it from spear shaft. Right hand on screen LEFT side retains spear at waist. In both targetcells keep spear blade pointing RIGHT as existing, halfway recovered from previous frame. Do not change body/horse/feet/scale. All other14 unchanged. No extra limbs, transparent background.
```

### p10neReach

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-6706d674-7145-421a-ba79-43f12394b86b.png

```text
Technical reach edit ONLY. Preserve this4x4 NE horse+rider sheet's bodies absolutely. In ROW3 COL2 and COL3, foreshorten spear exposed shaft toward right by30%, drawing thrust more toward depth, so total sprite width is no greater than idle row1 sprite width. Keep ONE same silver blade at right tip and red tassel, no rear metal blade. Bend right elbow slightly to contain rightward reach if needed. Do not shrink horse or rider; keep all other14 sprites exactly. Ensure COMPLETE spear tip inside canvas allcells. Transparent background.
```

### p10nwLayout

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-4eb4066b-e989-4450-8df0-c5c356b9b850.png

```text
LAYOUT ONLY: keep exact16 NW cavalry characters/poses in same4x4square sheet but each complete sprite at HALF current width/height centered its cell. Huge empty transparent gutters, do not crop canvas tight. Restore complete spear tips at rightmost column, no clipped blade. Preserve every armor detail horse body hand pose gait and spear motion. No new content, true transparent.
```

### p10neLayout

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-1786e24f-287a-4bc8-8072-bd9bb9dd3fbe.png

```text
LAYOUT ONLY. Keep exact16 back-right heavy cavalry poses in4x4 square sheet. Make EACH WHOLE sprite HALF current width and height inside its cell, centered. Huge transparent empty gutters, do not crop canvas tight afterward. Restore all rightmost spear tips fully, no clipping. Preserve horse sizes proportional, costume, handedness, movement and all16 pose order. True transparent, no effects/text.
```

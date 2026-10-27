# 친위대 ID11 승급 모션 제작·검수 기록

2026-10-27. 내장 image_gen 사용. 상태: **미해결 보완점이 있는 시각 초안**. 파일 세트는 갖췄으나 최종 게임용 승인이나 원본 동작 재현 완료를 뜻하지 않는다.

## 산출물

- baseJobId9, stage2. 전투64 + 무기·칼집 없는 하마 시나리오16 + 탑승 쇠약16 =96프레임.
- 개별 프레임 498,136bytes. 검수시트6장·재생WebP6장 724,004bytes. 합계 1,222,140bytes.
- 160×160 투명 WebP, quality78, 접지 y150. 프레임명 {direction}-{action}-{frame}.webp.
- 방향 NW11시 등/NE2시 등/SE5시 앞/SW7시 앞. combat action0대기/1이동/2공격/3스킬, frame0~3.
- 재생시간 대기320ms, 이동170ms, 공격190ms, 스킬240ms, 시나리오360ms, 쇠약300ms.
- contact-{action}.webp: 행NW/NE/SE/SW, 열시간0~3. preview-{action}.webp: 네 방향을 나란히 재생.

- combat: web/public/images/class-motion-pilot/cavalry/job-11/combat-v1 (64장, 373,934bytes)
- scenario: web/public/images/class-motion-pilot/cavalry/job-11/scenario-v1 (16장, 50,886bytes)
- weakened: web/public/images/class-motion-pilot/cavalry/job-11/weakened-v1 (16장, 73,316bytes)

## 승인 외형과 작업 경계

기준: web/public/images/job-models/promotion-se-v1/job-11.webp. 먼저 이미지를 열어 확인했다. 승급 데이터 실제 경로는 web/src/features/game-world/data/promotion-models.json이며 대표 무기는 쇠등창이다. 중기병의 밤색 말과 친위대의 어두운 마갑 말을 구분하고 얼굴·성별·체격을 유지하도록 제작했다.

머리·팔·무기 부품을 조립하거나 좌우 반전하지 않았다. 완성 말+기수 시트를 생성하고 연결 영역을 추출했다. 방향 공통 배율, 알파 정리, 발 기준 y150 및 하체 중심 평행이동으로 정렬했다. 시나리오는 약112px, 탑승 대기 목표128px, 쇠약 목표120px로 고개 숙임을 반영했다. 쇠약의 말 체격과 시점은 전투와 완전히 일치하지 않을 수 있어 아래 한계에 구분했다.

공통 UI·데이터·기본 ID9 manifest·다른 담당 파일·전투 수치는 수정하지 않았다. 사이트 통합과 HP30%/상태 이상 자동 판정은 통합 담당 범위이며 여기서는 이미지 자산만 제작했다. 커밋·푸시·배포 없음.

## 수정·재사용 기록

손 바뀜, 중복 창, 창끝 누락, 잘못된 방향, 마갑 누락을 생성 단계에서 수정했다. 넓은 여백을 요청했지만 일부 원본은 이를 지키지 않아 접촉/잘림 시트를 추가 생성했다. 완성 프레임 전체만 교체했으며 원본 시트가 모두 여백12% 검사를 통과했다고 주장하지 않는다. 최종 분리 파일은 외곽과 투명 여백을 따로 검사했다.

복귀·준비 자세 재사용(새 작화가 아님):

- sw-2-0.webp ← sw-0-0.webp
- sw-3-0.webp ← sw-0-0.webp

창끝 복원 프레임과 작은 원근 찌르기는 manifest.wholeFrameOverrides에 출처·인덱스를 기록했다. 친위대 남서의 추가 창 길이 보정은 이미지 생성 서비스의 violence 안전 필터에 차단되었다. 출력이 생성되지 않았고 우회 재시도하지 않았다.

## 미해결 문제 — 정확한 대상

아래 항목은 완료 처리하지 않았다.

- combat-v1/sw-0-0.webp, combat-v1/sw-0-1.webp, combat-v1/sw-0-2.webp, combat-v1/sw-0-3.webp, combat-v1/sw-1-0.webp, combat-v1/sw-1-1.webp, combat-v1/sw-1-2.webp, combat-v1/sw-1-3.webp, combat-v1/sw-2-0.webp, combat-v1/sw-2-1.webp, combat-v1/sw-2-2.webp, combat-v1/sw-2-3.webp, combat-v1/sw-3-0.webp, combat-v1/sw-3-1.webp, combat-v1/sw-3-2.webp, combat-v1/sw-3-3.webp: 남서 대기 높이121px로 다른 방향 약127~129px보다 작다. 최대 외곽140px를 지키기 위한 방향 공통 축소. 추가 창 원근 보정 생성은 서비스 안전 필터에 거절되어 미해결.
- combat-v1/ne-3-1.webp, combat-v1/ne-3-2.webp: 여백 보정 뒤 지휘 동작이 공격 자세와 비슷해 동작 구분이 약하다.
- combat-v1/sw-2-1.webp, combat-v1/sw-2-2.webp, combat-v1/sw-3-1.webp, combat-v1/sw-3-2.webp: 왼손 고삐와 창대가 가까워 160px에서 손 접점이 모호하다. 완전한 해부학 검증으로 표시하지 않는다.
- weakened-v1/nw-0-0.webp, weakened-v1/nw-0-1.webp, weakened-v1/nw-0-2.webp, weakened-v1/nw-0-3.webp, weakened-v1/ne-0-0.webp, weakened-v1/ne-0-1.webp, weakened-v1/ne-0-2.webp, weakened-v1/ne-0-3.webp: 전투 대기보다 더 뒤쪽을 보는 시점이다. 대기→쇠약 전환 시 말 방향·마갑 윤곽 변화가 남아 있다.
- combat-v1/se-2-1.webp, combat-v1/se-2-2.webp: 찌르기 원근 단축으로 창의 화면상 길이 변화가 크다. 무기 길이 일관성 추가 검토 필요.

## 검증

96개 파일의 존재·크기·알파·SHA256·접지·캔버스 외곽을 확인했다. 6개 재생WebP는 모두4프레임이고 지정 지속시간을 갖는다. 6개 동작별 검수시트에서 모든 프레임을 검토하고 브라우저 임시 읽기 전용 미리보기에서 재생 표본을 확인했다. 실제 게임 UI 통합·모바일 실기기 검사는 하지 않았다.

3→0 알파 실루엣 차이를 manifest.loopDiagnostics에 기록했다. 이는 프레임간 그림 차이를 찾는 보조값이며 동작 품질 합격 수치가 아니다. 보행의 마지막→처음은 다리 위상 차이가 있어 대기와 같은 수치 기준을 쓰지 않는다.

## 프롬프트 및 생성 원본 이력

경량본·브라우저 검수 후 이번 승급 생성 원본 14장 정리 완료. 원본 SHA256과 사용 여부 추적용 경로는 manifest.prompts에 보존한다. 삭제 후 재추출하려면 기록된 프롬프트로 재생성해야 한다.

### p11se

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-4fe460f1-c324-4320-be72-75ba21daa7be.png

```text
Use case: identity-preserve. Create production tactical RPG animation of EXACT royal GUARD CAVALRY in reference1. Same young male face/build, dark open-faced helmet short red plume, dark charcoal steel lamellar with pale metal edging, blue-gray sleeves, red sash and red skirt panels. SAME dark charcoal brown horse wearing layered dark steel lamellar neck/chest/side BARDING with pale edging and red fabric panels, dark mane/tail, short white socks. Preserve this fixed promotion kit. Representative weapon is iron-ridged SPEAR: dark shaft, ONE broad angular silver spearhead with dark central spine and red tassel at ONE end, plain blunt dark wood butt. No extra blade at butt.
Complete connected horse+rider, no parts/mirroring. FOUR columns FOUR rows16 sprites equal square cells on square TRANSPARENT sheet. Central64% percell including spear, minimum18% transparent empty gutters on all sides. SAME horse and rider size and foot baseline all16, same saddlecenter. No text/grid/effects/shadow.
Rows:1 gentle IDLE4 frames grounded hooves.2 WALK4 distinct alternating leg phases with synchronized rider, in place.3 ATTACK ready spear low FORWARD, compact forward thrust, half retract, ready low close to first.4 COMMAND ready low, right hand lifts to shoulder, halfway lower, ready low close first. Horse stationary grounded rows1/3/4, no rearing or lunging. Spear blade stays FORWARD of same gripping RIGHT hand throughout all16, never switches blade to opposite end. Left hand remains DOWN on reins, never grips spear; both arms connected to shoulders. No arm crossed over chest, no duplicated hands. Foreshorten weapon in depth to fit silhouette instead of enlarging bounds.
All16 face SOUTHEAST5 o'clock, horse nose screen RIGHT and toward viewer, front three-quarter. Right weapon arm on screen-left of chest, left rein hand on other side. Reference1 matches this direction.
```

### p11nw

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-bc222de6-0ec7-40fa-a3e0-2a36f98cb1e5.png

```text
Use case: identity-preserve. Create production tactical RPG animation of EXACT royal GUARD CAVALRY in reference1. Same young male face/build, dark open-faced helmet short red plume, dark charcoal steel lamellar with pale metal edging, blue-gray sleeves, red sash and red skirt panels. SAME dark charcoal brown horse wearing layered dark steel lamellar neck/chest/side BARDING with pale edging and red fabric panels, dark mane/tail, short white socks. Preserve this fixed promotion kit. Representative weapon is iron-ridged SPEAR: dark shaft, ONE broad angular silver spearhead with dark central spine and red tassel at ONE end, plain blunt dark wood butt. No extra blade at butt.
Complete connected horse+rider, no parts/mirroring. FOUR columns FOUR rows16 sprites equal square cells on square TRANSPARENT sheet. Central64% percell including spear, minimum18% transparent empty gutters on all sides. SAME horse and rider size and foot baseline all16, same saddlecenter. No text/grid/effects/shadow.
Rows:1 gentle IDLE4 frames grounded hooves.2 WALK4 distinct alternating leg phases with synchronized rider, in place.3 ATTACK ready spear low FORWARD, compact forward thrust, half retract, ready low close to first.4 COMMAND ready low, right hand lifts to shoulder, halfway lower, ready low close first. Horse stationary grounded rows1/3/4, no rearing or lunging. Spear blade stays FORWARD of same gripping RIGHT hand throughout all16, never switches blade to opposite end. Left hand remains DOWN on reins, never grips spear; both arms connected to shoulders. No arm crossed over chest, no duplicated hands. Foreshorten weapon in depth to fit silhouette instead of enlarging bounds.
All16 face NORTHWEST11 o'clock, horse head screen upper LEFT and rump lower right, rider BACK visible. Independently draw back-left view, never mirror. The far right weapon arm may be partly occluded by torso but show hand gripping shaft at right hip, near left hand down at reins.
Reference2 is ONLY correct BACK LEFT direction and pose layout. Replace all rider/horse design with reference1 GUARD armor and fully armored DARK horse. For attack keep near left hand on reins, far right hand at right waist pushes spear behind torso toward upperleft. Never lift nearleft forearm. Do NOT copy chestnut unarmored horse from reference2.
```

### p11ne

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-aebb9e44-1ea5-472c-9b66-6e2044f0dd7c.png

```text
Use case: identity-preserve. Create production tactical RPG animation of EXACT royal GUARD CAVALRY in reference1. Same young male face/build, dark open-faced helmet short red plume, dark charcoal steel lamellar with pale metal edging, blue-gray sleeves, red sash and red skirt panels. SAME dark charcoal brown horse wearing layered dark steel lamellar neck/chest/side BARDING with pale edging and red fabric panels, dark mane/tail, short white socks. Preserve this fixed promotion kit. Representative weapon is iron-ridged SPEAR: dark shaft, ONE broad angular silver spearhead with dark central spine and red tassel at ONE end, plain blunt dark wood butt. No extra blade at butt.
Complete connected horse+rider, no parts/mirroring. FOUR columns FOUR rows16 sprites equal square cells on square TRANSPARENT sheet. Central64% percell including spear, minimum18% transparent empty gutters on all sides. SAME horse and rider size and foot baseline all16, same saddlecenter. No text/grid/effects/shadow.
Rows:1 gentle IDLE4 frames grounded hooves.2 WALK4 distinct alternating leg phases with synchronized rider, in place.3 ATTACK ready spear low FORWARD, compact forward thrust, half retract, ready low close to first.4 COMMAND ready low, right hand lifts to shoulder, halfway lower, ready low close first. Horse stationary grounded rows1/3/4, no rearing or lunging. Spear blade stays FORWARD of same gripping RIGHT hand throughout all16, never switches blade to opposite end. Left hand remains DOWN on reins, never grips spear; both arms connected to shoulders. No arm crossed over chest, no duplicated hands. Foreshorten weapon in depth to fit silhouette instead of enlarging bounds.
All16 face NORTHEAST2 o'clock, horse head screen upper RIGHT and rump lower left, rider BACK visible. Independently draw back-right view, never mirror. Right weapon arm visible on screen-right side, left rein arm reaches forward on opposite side, distinct gripping hands.
Reference2 is ONLY back-right direction and consistent RIGHT weapon hand pose layout. All16 spear blade FORWARD screenRIGHT, plain butt backLEFT. Replace clothing/horse with reference1 exact guard and ARMORED DARK horse. No chestnut unarmored horse. Compact thrust, blade not above plume.
```

### p11sw

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-658174f3-306f-477b-8e9a-266ed39ebf70.png

```text
Use case: identity-preserve. Create production tactical RPG animation of EXACT royal GUARD CAVALRY in reference1. Same young male face/build, dark open-faced helmet short red plume, dark charcoal steel lamellar with pale metal edging, blue-gray sleeves, red sash and red skirt panels. SAME dark charcoal brown horse wearing layered dark steel lamellar neck/chest/side BARDING with pale edging and red fabric panels, dark mane/tail, short white socks. Preserve this fixed promotion kit. Representative weapon is iron-ridged SPEAR: dark shaft, ONE broad angular silver spearhead with dark central spine and red tassel at ONE end, plain blunt dark wood butt. No extra blade at butt.
Complete connected horse+rider, no parts/mirroring. FOUR columns FOUR rows16 sprites equal square cells on square TRANSPARENT sheet. Central64% percell including spear, minimum18% transparent empty gutters on all sides. SAME horse and rider size and foot baseline all16, same saddlecenter. No text/grid/effects/shadow.
Rows:1 gentle IDLE4 frames grounded hooves.2 WALK4 distinct alternating leg phases with synchronized rider, in place.3 ATTACK ready spear low FORWARD, compact forward thrust, half retract, ready low close to first.4 COMMAND ready low, right hand lifts to shoulder, halfway lower, ready low close first. Horse stationary grounded rows1/3/4, no rearing or lunging. Spear blade stays FORWARD of same gripping RIGHT hand throughout all16, never switches blade to opposite end. Left hand remains DOWN on reins, never grips spear; both arms connected to shoulders. No arm crossed over chest, no duplicated hands. Foreshorten weapon in depth to fit silhouette instead of enlarging bounds.
All16 face SOUTHWEST7 o'clock, horse nose screen LEFT and toward viewer, rider FRONT visible. Independently draw front-left view, never mirror. Right weapon hand on far screen-left side gripping shaft, near left hand on reins at screen-right side. Do not switch weapon into left hand.
Reference2 controls direction ONLY: horse muzzle SCREEN LEFT, FRONT view, tailRIGHT. All16 must face LEFT. Redraw GUARD outfit/armored dark horse from reference1, no chestnut horse. Keep LEFT rein hand (near hand on screenRIGHT) clearly DOWN on mane and separated from spear. RIGHT far hand on screenLEFT holds spear, blade forwardLEFT. Ready at row3/4 col1 same as idle.
```

### p11swFix

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-c67d05d4-518e-4130-ad9b-70848d586f89.png

```text
Edit target image1: preserve all16 SW LEFT-facing complete horse+rider poses. Reference2 is approved guard design. Restore missing horse NECK BARDING in ALL16 target cells: dark steel overlapping lamellar plates wrap sides and TOP of neck from chest up toward ears/behind jaw, matching reference2, visible over horse's bare brown upper neck. Keep muzzle and eyes exposed, no invented face mask. Preserve head shape and body size. LEFT hand screenright must rest on reins below shaft, distinct from spear, RIGHT far hand only grips spear. In row3col1 replace ready stance with same relaxed pose as row1col1 for loop. All other pose timing and hooves unchanged. Transparent background, one blade only, no new items.
```

### p11seFix

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-85b7a483-fae5-4b5a-8b71-036b876c6c2e.png

```text
Edit ONLY ROW4 COLUMN3 of this4x4 cavalry sheet. Replace this downward right spear pose with a HALF-LOWERED recovery between row4col2 raised and row4col4 relaxed: right forearm on screen-left bends down near chest, spear shaft angled up-right about20degrees, blade at right shoulder height not at horse muzzle. Left hand stays on reins low. Same horse/rider body, saddle, plantedfeet, armor and scale. Entire connected sprite, single blade. Other15 unchanged. Transparent background.
```

### p11scenario

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-4b2f9edb-b1ca-4da6-bb64-99ec57ed06db.png

```text
Use case identity-preserve. Create SCENARIO unarmed dismounted standing sheet of EXACT GUARD CAVALRY young male reference: same face/build, dark open-faced helmet short red plume, charcoal steel lamellar pale edging, blue-gray sleeves, red sash red skirtpanels, boots. NO HORSE, NO weapons/spears/swords/scabbards/shields. Both empty relaxed hands beside thighs, complete connected man.
Exactly4columns4rows16 cells. Each ROW one direction:1 BACK facing upperLEFT11 o'clock NW;2 BACK facing upperRIGHT2 o'clock NE;3 FRONT facing lowerRIGHT5 o'clock SE;4 FRONT facing lowerLEFT7 o'clock SW. Four columns very subtle breathing, feet planted, lastclosefirst. Same body height112px target after resizing, normal human proportions consistent. Each sprite central64% ofcell with18% transparent gutter all around. True transparent alpha, no text/grid/shadow/effects.
```

### p11weakened

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-3f8c919f-b170-4930-9f5c-15f5747bd355.png

```text
Use case identity-preserve. WEAKENED mounted sprite sheet of EXACT GUARD rider and armored DARK horse in reference1: young male same helmet short red plume charcoal steel armor pale edging blue-gray sleeves red sash. Horse dark charcoal brown with layered dark steel NECK chest and side barding red cloth panels. Iron-ridged spear ONE broad silver angular blade dark spine redtassel and plain blunt wooden butt. Whole connected rider+horse.
4rows4columns16 equal square cells. Rows1 NW BACK upperLEFT;2 NE BACK upperRIGHT;3 SE FRONT lowerRIGHT;4 SW FRONT lowerLEFT. Four columns tired breathing, head bowed visibly and shoulders slumped, tiny down/up movement, fourth nearly first. Horse stands still same scale/stance allfour grounded hooves, no rear or walking. Weapon RIGHT hand only, LEFT hand reins: for NE near screenright hand weapon, for SW far screenleft hand weapon; never mirror hand. Spear blade stays safely FORWARD of gripping hand, above ground, compact perspective. No changes in horse body between frames. Each sprite central64%cell,18%transparent gutters, same baseline, no shadow/text/grid/stars/blood/effects.
```

### p11weakFix

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-56b12c64-436c-43ab-a3f6-cd83ebd85e60.png

```text
Fix ONLY ROW2 and ROW4 hands in this4x4 weakened cavalry sheet. Keep all horse armor/poses/scales/directions exactly.
ROW2 back-left NW: near LEFT hand at SCREEN LEFT must drop to reins; far RIGHT hand at SCREEN RIGHT HIP holds spear pointing forward upperLEFT behind torso. Draw same gripping arrangement as reference2 NW combat: weapon hand at far right waist, shaft occluded by torso, left hand down reins. Bowed head unchanged.
ROW4 front-left SW: near LEFT hand SCREEN RIGHT should bend downward to reins at center mane, no spear. Far RIGHT hand SCREEN LEFT must grip spear beside neck, blade pointing downLEFT beside horse muzzle, blunt butt toRIGHT. Keep single silver blade+redtassel only, no double head.
Rows1/3 unchanged. Whole connected sprites, no mirror, true transparent and complete tips within canvas.
```

### p11weakClean

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-46053a07-1e1d-4541-8aa1-24240abbe587.png

```text
Precise cleanup only: this4x4 sheet has duplicate spear in ROW2. In all FOUR ROW2 sprites, REMOVE the LOW spear crossing near left hand and pointing down-left, including its low blade and tassel. Keep ONLY the HIGH spear behind rider torso with silver blade by left shoulder pointing upper-left and plain butt screen-right, held by far right hand. Near left hand must now just hold reins. Do not remove high spear. In ROW4 COLUMN2, restore missing silver spearhead and red tassel at forward lower-left shaft tip beside horse cheek, exactly matching row4col1/3/4. Keep all horses, rider poses, clothes, size, transparency unchanged. No other edits.
```

### p11swLayout

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-a6eaa91c-387a-405c-af22-bbf353322f34.png

```text
LAYOUT REPAIR. All16 sprites currently too large and touching adjacent cells. Output SAME square4x4 sheet, but make EACH COMPLETE sprite exactly HALF its CURRENT displayed width and height, centered in its cell. This means huge empty transparent gutters around all16 figures. Do not fill the empty space. Preserve ALL16 poses/costumes/horse armor/directions/handedness. Restore any tail/spear edges cut by canvas. Each figure about150px high on a1254px sheet, not300px. At least70px empty on each side per cell. True transparent alpha, no new images/text. Important keep16 figures, do not crop sheet tighter after downsizing.
```

### p11neLayout

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-fcd17e24-75bd-4cb5-9d34-2d610e61e0e5.png

```text
LAYOUT REPAIR ONLY. Preserve16 NE back-right armored cavalry sprites, ALL poses and details. They currently touch right border. Make EACH whole horse+rider+spear HALF current displayed width/height, centered in own cell, SAME4x4 square canvas. Huge empty transparent gutters, about150px figure on1254px sheet. Restore COMPLETE spearheads including rightmost col4 tips, never crop. Do NOT crop canvas tight. Maintain horsebody size across16. Additionally foreshorten exposed spear in row3col2 by20% so entire width≤110% idle height, and lower row4col2 spear tip to rider head height. Do not change costume or hand. No text/grid/shadow.
```

### p11weakLayout

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-69ba6436-e30d-45af-9531-b0150a9fa754.png

```text
LAYOUT ONLY. Keep exact16 weakened mounted armored guard poses and4x4square grid. Each whole horse+rider+spear HALF current size centered in owncell, huge transparent gutters. Restore spear tips touching outer canvas fully. All pose/body/costume/weapon/hand directions unchanged; one spear only each. Preserve tired bowedhead and four planted horsefeet. Do not crop canvas tight. True transparent, no text or effects.
```

### p11seReach

/Users/choenamho/.codex/generated_images/01a17855-8b79-7661-9ff9-52c25fcc8209/exec-85f47ad2-f462-417e-91ee-f9b9cafd976e.png

```text
Edit ONLY ROW3 COL2 of this4x4 SE armored cavalry sheet: foreshorten exposed spear shaft toward screenright by30% and bend right elbow slightly, so fullsprite width matches row1col1 width. Keep horse/rider identical size and body pose, single silver blade redtassel. No change to other15 cells. This is compact thrust in depth, not shorter weapon type. True transparent.
```

### p11swReach

image generation safety filter rejected request (violence); no image created; no retry

```text
Keep all16 LEFT-facing guard horse/rider bodies EXACTLY unchanged including size and positions on spacious4x4sheet. Technical WEAPON REACH correction only: foreshorten exposed spear shaft segments by20% in all16 cells, so complete silhouette width no wider than1.08times idle body height. Keep same ONE broad silver spearhead/redtassel, plain butt, RIGHT hand grip. Row4col2 skill blade must lower to helmet plume height (never above it), right hand shoulder level, compact command. Row4col3 halfwaylower with blade headheight. Do NOT scale horse/rider or change any legs or armor. Preserve wide transparent gutters.
```

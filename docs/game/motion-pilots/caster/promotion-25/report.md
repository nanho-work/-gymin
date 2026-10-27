# 참모 (job25) 승급 모션 시각 초안

baseJobId24, stage1. 전투64+빈손 시나리오16=80장. 프레임 295,872bytes, 검수10개 401,604bytes. 출력은 web/public/images/class-motion-pilot/caster/job-25/combat-v1 및 scenario-v1. 각 모드 완전한 세트, 이름 {direction}-{action}-{frame}. 참조: web/public/images/job-models/promotion-se-v1/job-25.webp — view_image로 승인 외형을 확인하고 image_gen에 전달. 내장 image_gen만 사용.

160×160 투명WebP 품질78, 발 중심x80·하단y150. 넓은 부채의 여백 때문에 모든 방향/모드의 준비·대기 기준체고106px로 통일(112px에서6px 축소). 각 전투방향16장은 고정배율, 시나리오 각방향4장도 고정배율. 프레임별 확대·신체분할·좌우반전 없음. PIL/numpy는 투명 간격 분할·낮은알파 정리·리사이즈·접지정렬·경량 저장에만 사용했다. 실제 균등셀 배치가 아니어서 투명 간격 중간선을 찾아 온전한 프레임으로 분리했다. 결과 시트는200px 셀에 여백을 추가했다.

5개 경량 시트에서80프레임 전체를 육안 확인했다. NW11시 등왼쪽, NE2시 등오른쪽, SE5시 앞오른쪽, SW7시 앞왼쪽; 손·목·발 연결과 부채, 빈손 시나리오 확인. 공격은 낮은 전방 시전, 스킬은 높은 부채 시전. 큰 발광효과 없음. 공격/스킬 frame3은 부채를 가슴 쪽으로 거두며0번으로 돌아가는 자세를 확인했다. 관모·자수·부채의 세부무늬는 생성에 따른 작은 차이가 남는다.

80장 크기·알파·접지·해시 확인. 동작별 정확한4프레임 루프5개 제공: 대기320/이동170/공격190/스킬240/시나리오360ms. 각 review-loop-N.webp는 NW,NE,SE,SW 가로배치. 실제 브라우저 연속재생은 미검수이며 정적 시간순 및3→0 비교까지만 확인. loopMetrics의 실루엣 IoU는 보조수치이며 애니메이션 품질 판정이 아니다.

## 한계와 특정 검토 지점

- SW action2 frame1/2의 팔 뻗기 차이가 작아 중간단계 구분이 약함; frame3은 가슴앞으로 회복 확인.
- SE action1 frame3→0의 자락과 발 자세 변화, 모든 방향 세부 자수·부채무늬 편차는 실제 재생 후 검토 필요.
- SW 초기 방향/손 오류를 image_gen으로 재제작. 발 검출 하단6.5%는 한쪽 신발만 잡아 중심이 흔들려10%로 확대; SW idle3→0 IoU0.4464→0.9244.
- 초기2개 생성은 시트 지시 전달 누락으로 단일인물만 나와 폐기. 최종 프롬프트와 수정 이력만 실제 프레임에 적용.

모든 제작 결과는 사용자 검토 전 시각 초안. 실제 게임 수치·판정·UI연결·빌드·커밋·푸시·배포 변경 없음. 기본job24와 다른 담당 파일은 수정하지 않았다.

## 프롬프트 기록

### se

```text
Use case: identity-preserve tactical RPG complete-character animation. Follow approved reference EXACTLY: same slim youthful male face, black scholar cap, ornate dark indigo long robe, cream inner sleeves and lapels, approved embroidered trim, sash, boots and unique fan design. Never change costume tier. Entire connected body+fan in each cell, no part compositing. Anatomical RIGHT hand holds fan at ALL times, left hand empty. Draw same anatomy independently for direction, never mirror hands.
Transparent square sprite sheet, exactly 4 columns x4 rows,16 equal cells. Figure INCLUDING fan occupies only middle60% of cell, clear15% transparent margins all sides, same planted foot baseline. Same body/head/cap size across all16 cells. No camera motion. Subtle game sprite shading, readable at112px body height. No text/grid/shadow/glow/particles.
Row1 idle: four subtle breathing frames, fan close to chest, feet planted.
Row2 walk: four in-place sequential alternating walking phases left forward/passing/right forward/passing, small stride; frame3 smoothly returns to0, no clothing inflation.
Row3 low fan attack: frame0 upright fan CLOSE TO CHEST, elbow bent; frame1 half-extension at waist; frame2 full forward casting fan; frame3 UPRIGHT RECOVERY elbow BENT fan returned CLOSE TO CHEST and empty hand lowered, nearly identical to0. Frame3 MUST NOT keep arm extended.
Row4 high ritual skill: frame0 fan close to chest; frame1 raise fan beside head; frame2 high fan and empty left palm outward; frame3 fan lowered CLOSE TO CHEST with elbow bent and left palm lowered, nearly identical to0. No effect.
Keep all limbs/neck/wrists/fan grip connected. Feet and head return to same positions at each loop end.
Approved tier job25 참모: patterned purple-blue folding fan (진법부채), navy/indigo robe with pale geometric embroidered borders as reference. ALL16 face southeast SE 5 o'clock, FRONT RIGHT toward viewer.
```

### ne

```text
Use case: identity-preserve tactical RPG complete-character animation. Follow approved reference EXACTLY: same slim youthful male face, black scholar cap, ornate dark indigo long robe, cream inner sleeves and lapels, approved embroidered trim, sash, boots and unique fan design. Never change costume tier. Entire connected body+fan in each cell, no part compositing. Anatomical RIGHT hand holds fan at ALL times, left hand empty. Draw same anatomy independently for direction, never mirror hands.
Transparent square sprite sheet, exactly 4 columns x4 rows,16 equal cells. Figure INCLUDING fan occupies only middle60% of cell, clear15% transparent margins all sides, same planted foot baseline. Same body/head/cap size across all16 cells. No camera motion. Subtle game sprite shading, readable at112px body height. No text/grid/shadow/glow/particles.
Row1 idle: four subtle breathing frames, fan close to chest, feet planted.
Row2 walk: four in-place sequential alternating walking phases left forward/passing/right forward/passing, small stride; frame3 smoothly returns to0, no clothing inflation.
Row3 low fan attack: frame0 upright fan CLOSE TO CHEST, elbow bent; frame1 half-extension at waist; frame2 full forward casting fan; frame3 UPRIGHT RECOVERY elbow BENT fan returned CLOSE TO CHEST and empty hand lowered, nearly identical to0. Frame3 MUST NOT keep arm extended.
Row4 high ritual skill: frame0 fan close to chest; frame1 raise fan beside head; frame2 high fan and empty left palm outward; frame3 fan lowered CLOSE TO CHEST with elbow bent and left palm lowered, nearly identical to0. No effect.
Keep all limbs/neck/wrists/fan grip connected. Feet and head return to same positions at each loop end.
Approved tier job25 참모: patterned purple-blue folding fan (진법부채), navy/indigo robe with pale geometric embroidered borders as reference. ALL16 face northeast NE 2 o'clock, BACK RIGHT AWAY from viewer. Show back of cap/head/robe. No front chest, no front-facing face. Right fan arm far from viewer, near left arm empty. No mirroring. Keep the fan's purple patterned fabric.
```

### scenario

```text
Use case identity-preserve. Transparent tactical RPG sheet of SAME approved male strategist, exact face, slim body, black cap, ornate indigo robe, cream sleeves/lapels, sash, boots and approved embroidery. Peaceful scenario standing, BOTH HANDS EMPTY naturally relaxed, NO FAN, weapon, scabbard or battle prop. Complete connected bodies, no part collage.
Exactly4 rows x4 columns,16 equal cells. Row1 NW BACK LEFT11 o'clock; row2 NE BACK RIGHT2 o'clock; row3 SE FRONT RIGHT5 o'clock; row4 SW FRONT LEFT7 o'clock. Four columns subtle breathing idle with planted feet, frame3 nearly same as0; constant head/cap/body scale. All figures occupy middle60% cell, at least15% clear transparent margin, same foot baseline. Restrained outlined game style matching reference. No text/grid/shadow/glow, true transparency. No new accessories.
Tier job25 참모: pale geometric embroidered borders and navy-indigo robe exactly reference, remove only fan.
```

### nw

```text
Use case: identity-preserve tactical RPG complete-character animation. Follow approved reference EXACTLY: same slim youthful male face, black scholar cap, ornate dark indigo long robe, cream inner sleeves and lapels, approved embroidered trim, sash, boots and unique fan design. Never change costume tier. Entire connected body+fan in each cell, no part compositing. Anatomical RIGHT hand holds fan at ALL times, left hand empty. Draw same anatomy independently for direction, never mirror hands.
Transparent square sprite sheet, exactly 4 columns x4 rows,16 equal cells. Figure INCLUDING fan occupies only middle60% of cell, clear15% transparent margins all sides, same planted foot baseline. Same body/head/cap size across all16 cells. No camera motion. Subtle game sprite shading, readable at112px body height. No text/grid/shadow/glow/particles.
Row1 idle: four subtle breathing frames, fan close to chest, feet planted.
Row2 walk: four in-place sequential alternating walking phases left forward/passing/right forward/passing, small stride; frame3 smoothly returns to0, no clothing inflation.
Row3 low fan attack: frame0 upright fan CLOSE TO CHEST, elbow bent; frame1 half-extension at waist; frame2 full forward casting fan; frame3 UPRIGHT RECOVERY elbow BENT fan returned CLOSE TO CHEST and empty hand lowered, nearly identical to0. Frame3 MUST NOT keep arm extended.
Row4 high ritual skill: frame0 fan close to chest; frame1 raise fan beside head; frame2 high fan and empty left palm outward; frame3 fan lowered CLOSE TO CHEST with elbow bent and left palm lowered, nearly identical to0. No effect.
Keep all limbs/neck/wrists/fan grip connected. Feet and head return to same positions at each loop end.
Tier job25 참모 approved purple patterned fan and embroidered indigo robe. ALL16 BACK LEFT northwest11 o'clock, facing AWAY, back of cap/head/robe visible, no frontal chest. Right fan arm nearest viewer, left empty. Preserve original approved image costume without extra ornaments.
```

### sw

```text
Use case: identity-preserve tactical RPG complete-character animation. Follow approved reference EXACTLY: same slim youthful male face, black scholar cap, ornate dark indigo long robe, cream inner sleeves and lapels, approved embroidered trim, sash, boots and unique fan design. Never change costume tier. Entire connected body+fan in each cell, no part compositing. Anatomical RIGHT hand holds fan at ALL times, left hand empty. Draw same anatomy independently for direction, never mirror hands.
Transparent square sprite sheet, exactly 4 columns x4 rows,16 equal cells. Figure INCLUDING fan occupies only middle60% of cell, clear15% transparent margins all sides, same planted foot baseline. Same body/head/cap size across all16 cells. No camera motion. Subtle game sprite shading, readable at112px body height. No text/grid/shadow/glow/particles.
Row1 idle: four subtle breathing frames, fan close to chest, feet planted.
Row2 walk: four in-place sequential alternating walking phases left forward/passing/right forward/passing, small stride; frame3 smoothly returns to0, no clothing inflation.
Row3 low fan attack: frame0 upright fan CLOSE TO CHEST, elbow bent; frame1 half-extension at waist; frame2 full forward casting fan; frame3 UPRIGHT RECOVERY elbow BENT fan returned CLOSE TO CHEST and empty hand lowered, nearly identical to0. Frame3 MUST NOT keep arm extended.
Row4 high ritual skill: frame0 fan close to chest; frame1 raise fan beside head; frame2 high fan and empty left palm outward; frame3 fan lowered CLOSE TO CHEST with elbow bent and left palm lowered, nearly identical to0. No effect.
Keep all limbs/neck/wrists/fan grip connected. Feet and head return to same positions at each loop end.
Tier job25 참모 approved purple patterned fan and embroidered indigo robe. ALL16 FRONT LEFT southwest7 o'clock. Far anatomical RIGHT arm screen-left holds fan throughout, near LEFT arm empty. Nose and toes point LEFT. Preserve original approved image costume without extra ornaments.
```

### nwFix

```text
CORRECT DIRECTION in ALL16 cells. Currently characters face BACK RIGHT, incorrect. REDRAW ALL16 characters facing BACK LEFT, NORTHWEST11 o'clock. Head nose and boots point screen LEFT, viewer sees back of cap/head/robe, leftward profile only. Fan projects screen LEFT. Maintain anatomical RIGHT hand holds fan, never mirror. Same youthful male, black cap, embroidered indigo robe, purple patterned fan. Exactly preserve4x4 layout and idle/walk/attack/skill rows; columns0..3 time sequence. Row3/4 frame3 fan close to chest matches0; no extended recovery. Same figure scale, generous15% transparent gutters. No text/glow, true transparency. This is a full redrawing to opposite view, not merely change gaze.
```

### swFix

```text
CORRECT DIRECTION of this entire16-pose sprite sheet. Every character currently incorrectly faces RIGHT. REDRAW every face, nose, cap, torso, robe and boots to face LEFT, southwest7 o'clock FRONT LEFT three-quarter view. Nose points LEFT, never right. Preserve EXACT purple patterned fan, embroidered indigo robe, youthful male face and16 poses/order. Fan stays anatomical RIGHT hand, FAR arm on screen LEFT. Near LEFT hand screen RIGHT remains empty. Do not just mirror.4x4 cells: idle/walk/low fan attack/high fan skill rows. Each row frame3 returns fan to chest matching frame0. Much smaller figures, 60% cell size with15% transparent margins. TRUE TRANSPARENCY, no glow text grid.
```

### swHand

```text
Fix ONLY fan-hand consistency in first reference4x4 sheet. The idle/walk/recovery figures incorrectly hold fan with near LEFT hand. In EVERY cell place fan in far anatomical RIGHT HAND on screen LEFT, like image2's hand assignment. Near anatomical LEFT arm on screen RIGHT must be empty and lowered or gesturing. Do not mirror, keep all bodies facing southwest FRONT LEFT. Preserve ornate purple fan and embroidered indigo costume of image1; image2 is hand placement ONLY, not costume. Keep16 poses/order and last frame of attack/skill returning fan to chest. Entire connected figure no collage. True transparency,15% cell gutters.
```


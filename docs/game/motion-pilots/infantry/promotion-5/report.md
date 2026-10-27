# 근위병 job5 승급 모션 — 2026-10-27

상태: **검토용 세트 제작, NW 보행 정밀 보완 미완료**. 파일 누락 없이80장 저장했지만 게임용 최종 모션 완료로 표시하지 않는다. baseJobId3, stage2. 기본 단계의 manifest/report와 기존 자산은 수정하지 않았다.

## 전달 경로·규격

- 전투: `web/public/images/class-motion-pilot/infantry/job-5/combat-v1` 64장. nw/ne/se/sw × action0대기/1이동/2공격/3스킬 × frame0~3.
- 시나리오: `web/public/images/class-motion-pilot/infantry/job-5/scenario-v1` 16장.4방향 action0 frame0~3, 무기·칼집·방패 없이 빈손.
-160×160 투명WebP quality78, 발 기준y150. 프레임 총404,304bytes, 검수자료 포함1,270,932bytes.
- 중보병 기본 실루엣112px, 근위병은 붉은 술 포함120px로 몸체 약112px 기준. 방향별 전체 동작에 공통 배율. 프레임별 몸체 확대 없음.
- 가로 기준은 붉은 허리띠 중앙값을x80에 정렬. 지지발x좌표를 중앙에 고정하지 않는다. 공격의 검끝이 경계에 닿지 않도록 전체 프레임 위치만 보정.
- 재생320/170/190/240/360ms. review-*-sequence는0,1,2,3,0 순서. review-*-loop는 각 동작의 지정속도 재생. review파일은 실제80프레임에 포함하지 않는다.

## 제작 근거·도구

- 승인 이미지 `web/public/images/job-models/promotion-se-v1/job-5.webp`를view_image로 보고 참조했다. 병과명/승급/대표무기는 web/src/features/game-world/data/promotion-models.json의 경보병 그룹을 읽었다.
- 중보병은 강화 금속찰갑·테두리·붉은 허리띠·넓은날검, 근위병은 짧은 붉은 술·밝은 테두리의 강화 갑옷·벼림장검의 고정세트. 남성 얼굴과 체격을 유지하도록 지시했다. 이미지생성 특성상 세부 얼굴·장식은 승인 모델과 미세 차이가 남는다.
- 내장 image_gen 사용. 완성된 인체/무기 전체 프레임으로 생성, 부품 합성·좌우반전 없음. 기본v2의 수정된NW 오른손 공격과 중보병의 방향별 경량 시트는 자세 참조로 사용했으나, 승인 승급 이미지가 외형 기준이다.
- 기술 처리: 원본을긴변960 이내로 축소→alpha>55 연결영역으로 완성인물 추출→행/열 정렬→공통 배율로160px캔버스에 배치→허리띠x80 및 alpha>40 발y150 정렬→WebP 저장. 셀 경계로 칼/발을 자르지 않음. 작은 분리 픽셀만 제거.

## 수정과 루프 처리

- 중보병SW 최초 생성은SE방향이 섞여 폐기하고 방향을 고정해 재생성. NW 최초 생성은 공격 손이 바뀌어 폐기하고 기본v2의 확인된 오른손 자세를 참조해 재생성.
- 근위병은 승인 모델과 검수한 중보병 자세 시트를 함께 참조. NE 스킬은 검날 전체가 보이도록 별도 지시.
- 공격·스킬 frame3은 frame0의 완성 준비 자세를 그대로 재사용했다.3→0에서 자세가 바뀌지 않지만4개 독립적인 고유원화가 아니다. 일반적으로3개 고유자세+복귀홀드이며, 회수2→3의 부드러움은 별도 검토 대상.
- 중보병NE스킬 frame1은 검날이 가려져 사라져 보였으므로 frame2의 완성 거양 자세로 교체. 해당 시퀀스는2개 고유자세의4프레임 홀드이며 새로운 중간프레임을 만들었다고 표시하지 않는다.
- NW보행 개선을 추가 생성·편집2회 시도했으나 배경 불투명/무기 누락/위상 중복 문제가 있어 미채택. 이 시도는 아래 프롬프트에 보존하며 문제 해결로 표시하지 않는다.

## 검수 결과와 정확한 미해결 범위

- 80/80 파일크기160×160, 투명알파, 실루엣 존재, 출력경계 비접촉, 발y150 검사 통과. manifest 개별 SHA256/bytes/출처/배율 기록.
- 모든 전투·시나리오 프레임을 결과 시트로 육안 확인.4방향 앞/뒤, 오른손 검, 몸·팔·발 연결과 잘림,0→1→2→3→0 비교.
- 로컬 브라우저에서20개 루프를 지정속도로 재생, 전투와 빈손시나리오를 여러 시점에서 확인. 모바일실기기·실제 사이트연결·전투판정은 미검수/미구현.
- **NW 이동 `nw-1-0, nw-1-1, nw-1-2, nw-1-3`**: 다리 교차와 지지발 단계의 연결감은 남는다. 완성 보행으로 승인하지 않는다.
- **SW 공격 `sw-2-2→sw-2-3`**: 낮은 회수에서 높은 준비자세로 변화가 크다.3→0 동일프레임 처리만으로 회수 전체가 부드러워진 것은 아니다.
- 얼굴·관모·갑옷 디테일과 걸음 사이의 작은 형태 변화는 사용자검토 필요. 원본 전투 수치·게임 판정 재현 완료 아님.

## 보존·정리

기존 기본단계와 다른 담당 파일은 유지했다. 공통UI/데이터/AGENTS/README/world.json 수정, 커밋/푸시/배포 없음. 이번 승급 생성 대형PNG14개만 경량본 검수 후 정리. 프롬프트와 경량 프레임·결과시트·재생본은 보존. 원본 삭제 후 재추출하려면 기록 프롬프트로 다시 생성해야 한다.

## 프롬프트

### nw

```text
ALL16 must face NORTHWEST BACK-LEFT, show back and LEFT cheek. Retain image1 correct RIGHT arm: sword in hand screenRIGHT of spine; strike forward UPPER LEFT with right arm partly occluded by chest, never transfer to screenLEFT arm. Image1 is4x4 complete sprite POSE/DIRECTION reference. Image2 is APPROVED final promotion job5 GUARD infantry outfit/identity. Repaint EVERY complete character from image1 into EXACT outfit of image2: dark reinforced iron lamellar armor with pale brass/silver edging and larger angular shoulder plates, dark helmet with short RED PLUME trailing back, red waist accents, dark gray sleeves pants boots, refined long straight forged sword. Same male face and body proportions; don't make bulkier or larger. Preserve BACK-LEFT northwest11 direction and anatomical RIGHT sword hand, LEFT empty, pose order rows idle/walk/attack/skill columns0..3. Improve walk feet contacts, no tangled knees. Attack strike frame1 points UPPER LEFT ahead, not sideways, compact guard frame0/3. Skill small upright sword lift. Complete connected humans NO part compositing and NO mirroring. 4x4 exactly, same body and head scale all16, fixed pelvis and ground, body60% eachcell and all weapons within central70%, wide15% transparent gutters. True transparency no text grid effects shadows. Red plume consistent size every cell. Use image2 for costume only, not direction.
```

### ne

```text
ALL16 face NORTHEAST BACK-RIGHT2 o'clock showing back not chest. RIGHT weapon arm attached screenRIGHT of spine, left arm screenLEFT empty. Image1 is4x4 complete sprite POSE/DIRECTION reference. Image2 is APPROVED final promotion job5 GUARD infantry outfit/identity. Repaint EVERY complete character from image1 into EXACT outfit of image2: dark reinforced iron lamellar armor with pale brass/silver edging and larger angular shoulder plates, dark helmet with short RED PLUME trailing back, red waist accents, dark gray sleeves pants boots, refined long straight forged sword. Same male face and body proportions; don't make bulkier or larger. Preserve BACK-RIGHT northeast2 direction and anatomical RIGHT sword hand, LEFT empty, pose order rows idle/walk/attack/skill columns0..3. Improve walk feet contacts, no tangled knees. Attack strike frame1 points UPPER RIGHT ahead, not sideways, compact guard frame0/3. Skill small upright sword lift. Complete connected humans NO part compositing and NO mirroring. 4x4 exactly, same body and head scale all16, fixed pelvis and ground, body60% eachcell and all weapons within central70%, wide15% transparent gutters. True transparency no text grid effects shadows. Red plume consistent size every cell. Use image2 for costume only, not direction. IMPORTANT skill row4: frame0 visible sword upright by right shoulder; frame1 raise sword with FULL BLADE VISIBLE; frame2 settle upright FULL BLADE VISIBLE; frame3 shoulder guard. Do not copy hidden/missing blade pose from reference row4col2.
```

### se

```text
Image1 is4x4 complete sprite POSE/DIRECTION reference. Image2 is APPROVED final promotion job5 GUARD infantry outfit/identity. Repaint EVERY complete character from image1 into EXACT outfit of image2: dark reinforced iron lamellar armor with pale brass/silver edging and larger angular shoulder plates, dark helmet with short RED PLUME trailing back, red waist accents, dark gray sleeves pants boots, refined long straight forged sword. Same male face and body proportions; don't make bulkier or larger. Preserve FRONT-RIGHT southeast5 direction and anatomical RIGHT sword hand, LEFT empty, pose order rows idle/walk/attack/skill columns0..3. Improve walk feet contacts, no tangled knees. Attack strike frame1 points LOWER RIGHT ahead, not sideways, compact guard frame0/3. Skill small upright sword lift. Complete connected humans NO part compositing and NO mirroring. 4x4 exactly, same body and head scale all16, fixed pelvis and ground, body60% eachcell and all weapons within central70%, wide15% transparent gutters. True transparency no text grid effects shadows. Red plume consistent size every cell. Use image2 for costume only, not direction.
```

### sw

```text
ALL16 must face SOUTHWEST FRONT-LEFT, never turn right. Image1 is4x4 complete sprite POSE/DIRECTION reference. Image2 is APPROVED final promotion job5 GUARD infantry outfit/identity. Repaint EVERY complete character from image1 into EXACT outfit of image2: dark reinforced iron lamellar armor with pale brass/silver edging and larger angular shoulder plates, dark helmet with short RED PLUME trailing back, red waist accents, dark gray sleeves pants boots, refined long straight forged sword. Same male face and body proportions; don't make bulkier or larger. Preserve FRONT-LEFT southwest7 direction and anatomical RIGHT sword hand, LEFT empty, pose order rows idle/walk/attack/skill columns0..3. Improve walk feet contacts, no tangled knees. Attack strike frame1 points LOWER LEFT ahead, not sideways, compact guard frame0/3. Skill small upright sword lift. Complete connected humans NO part compositing and NO mirroring. 4x4 exactly, same body and head scale all16, fixed pelvis and ground, body60% eachcell and all weapons within central70%, wide15% transparent gutters. True transparency no text grid effects shadows. Red plume consistent size every cell. Use image2 for costume only, not direction.
```

### scenario

```text
Approved reference job5 GUARD infantry male, dark helmet with short RED PLUME trailing back, dark reinforced iron lamellar armor broad angular shoulder plates and skirt with pale silver/brass edging red waist sash dark gray sleeves trousers boots, same face/proportions. Generate true transparent4x4 scenario standing sheet. NO WEAPON, NO SCABBARD, NO SHIELD, empty hands relaxed naturally. Complete connected full figures. Row1 NW11 BACK faces LEFT; row2 NE2 BACK faces RIGHT; row3 SE5 FRONT faces RIGHT; row4 SW7 FRONT faces LEFT. All4 columns subtle breathing cycle, feet planted, pelvis centered, identical body scale and baseline. Frame3 nearly0. Exactly16 figures separated by15% transparent gutters each side, figure body60% cell height. No grid text effects shadows. Do not copy reference direction to other rows. No detached parts, crisp outlined game style. Match attached approved final promotion armor exactly; no reverting to lower tier. Plume size consistent and does not change body/face scale.
```

### nwWalkAttempt

```text
Create EXACTLY TWO ROWS by FOUR COLUMNS transparent tactical RPG walk-cycle sheet. Row1 is approved reference1 job4 heavy infantry (dark gold-trim armor, pointed helmet NO plume, broad sword). Row2 approved reference2 job5 guard (dark pale-edged armor, short RED helmet plume, forged sword). Both same male size and identity. EVERY figure faces NORTHWEST upper LEFT11 o'clock, show BACK and LEFT cheek. RIGHT hand screenRIGHT of spine holds sword LOW safely angled right; LEFT hand empty. No weapon hand swaps. FOUR chronological walking phases: column0 LEFT foot forward/contact with straight left knee and right heel just lifted behind; column1 RIGHT knee raised forward, left leg supports, visible GAP between calves; column2 RIGHT foot forward/contact, left heel lifted behind; column3 LEFT knee raised forward, right leg supports, gap between calves. Shallow stepping in place, feet do not cross midline, NEVER crossed ankles or tangled overlapping knees. Two legs anatomically connected to pelvis. Fixed pelvis and head position, uniform scale across4, small vertical bob only, each supported sole same ground baseline. Clear alternating LEFT/RIGHT leg cycle, col3 leads naturally into col0. Full integrated characters not paper cutout. Minimal arm motion sword remains right hand low. Keep promotion outfits separate exact reference. Each figure in central60% cell, generous15% gutters including sword, no contact between cells. True alpha transparency no text grid effects shadows.
```

### nwWalkEdit

```text
Correct this TWO ROWS FOUR COLUMNS infantry walking sheet. REMOVE background entirely to true transparent alpha, no shadows or glow. In FOURTH COLUMN of BOTH ROWS the sword blade is missing: restore full straight blade attached to right-hand hilt, same blade as other columns. All 8 complete characters smaller within cells, including blade occupies at most70% cell width and height with15% clear margins. Preserve exact costume, right hand weapon, back LEFT orientation and two-row4column order. Fix walking phase col3: LEFT knee forward lifted with RIGHT supporting straight leg, not a duplicate of col1. Col1 RIGHT knee lifted LEFT supports. Anatomical LEFT and RIGHT from character's perspective. Keep fixed pelvis center and ground baseline. No added props text grid. Existing figures otherwise remain same.
```

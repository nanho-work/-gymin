# 궁병 기본 모션 v2 수정 결과

2026-10-26. **NE 손 일관성 수정 및 정적 검수 통과. 실제 사이트 연속 재생 검수는 미완료.** 기존 v1 자산은 변경하지 않고 비교용으로 보존했다.

## 통합할 완전한 모드

- 전투: `web/public/images/class-motion-pilot/archer/job-6/combat-v2/` — 4방향×4동작×4프레임,64장, 292,654bytes.
- 시나리오: `web/public/images/class-motion-pilot/archer/job-6/scenario-v2/` — 4방향×4프레임,16장, 55,172bytes. v1 내용 그대로 복사해 완전한 폴더로 제공.
- 프레임 총 347,826bytes. v2 검수 시트/애니메이션 포함 711,552bytes. v1 용량은 합계에서 제외.
- 160×160 투명 WebP 품질78. 발y150, 방향별 대기 몸체112px 기준으로 같은 방향 모든 동작에 동일 배율. 프레임별 확대와 좌우반전·신체 분할 합성 없음.

## 원인과 수정

NE v1은 화면 방향을 바꾸는 생성 과정에서 가까운 오른팔이 활을 들게 되었다. 시트 전체 수정만 반복하면 손을 고친 대신 반대 조준 또는 활 중복이 생겼다. 이번에는 단일 완성 자세에서 **먼 왼팔은 활을 향해 뻗고, 가까운 오른팔은 팔꿈치를 낮게 굽혀 시위를 당기는 구조**를 먼저 확보했다. 이 단일 자세를 참조해16장을 생성했다. NE action0/1은 왼손 활·오른손 빈손, action2 frame0~2는 왼손 활·오른손 시위와 release, frame3은 대기 복귀. 등과 조준은2시다.

SW도 공격 시 팔 연결이 반대로 읽히는 문제를 발견해 단일 자세의 **가까운 왼팔이 가슴 앞을 가로질러 왼쪽의 활을 잡고, 먼 오른손이 당기는 구조**를 확보한 뒤16장을 생성했다. SW의 전투 자세와 조준은7시이며 공격 중 상체는 대기보다 측면으로 회전한다.

NE/SW 스킬은 왼손에 활을 내린 채 빈 오른손을 들어 명령하고 내리는 창작 시각 동작이다. 활을 두 개 들거나 손을 바꾸지 않는다. 전투 판정·기존 스킬 데이터는 수정하지 않았다.

네 방향 action2/3의 마지막 frame3은 해당 방향 action0 frame0 전체 이미지를 재사용했다. 발 기준선만 맞춘 유사 자세가 아니라 정확히 대기 자세로 돌아간다. release→recover의 큰 자세 차이는4프레임 한계로 남으며 부드러운 보간을 구현한 것은 아니다.

## 검수

- 80/80 프레임의 크기, RGBA, 알파0/255, 캔버스 경계 비접촉, 발하단y150 검사 통과.
- NE/SW 생성 원화와 최종160px 시트, NW/SE 보존 시트 전체를 육안 확인. 손·조준·신체 연결·활 중복·잘림 확인.
- 전투 동작별 비교 애니메이션4개, 각4프레임을 디코딩하고320/170/190/240ms 확인. 상단v1/하단v2, 열NW/NE/SE/SW. 경로 `combat-v2/review-action-0.webp`부터3까지.
- 공격4단계를 정적 시간순 비교. 최종→대기 복귀8개는 바이트 동일 검사 통과. 생성 특유의 머리·옷자락 미세 변화는 남는다.
- Chrome으로 로컬 애니메이션을 열려 했으나 브라우저 도구의 보안 정책이 file:// URL을 차단했다. 우회하지 않았다. **실시간 육안 재생 검사 통과로 기록하지 않으며 통합 화면에서 후속 확인 필요.**
- 프레임 비교표인 `contact-nw/ne/se/sw.webp`는 각4행(대기/이동/공격/스킬)×4열(시간순)이다.
- 공통UI·데이터·기존 자산·다른 담당 파일은 수정하지 않았다. 커밋·푸시·배포 없음.

## 도구·참고·재현

내장 image_gen. 승인 모델 `web/public/images/job-models/se-v1/job-6.webp`, 기존 v1 경량 프레임 및 시트를 view_image로 읽었다. NE draw 단일자세→NE sheet, SW draw→팔 연결 수정→SW sheet 순서. 기술 변환은 pack-archer-v2.py. 경량본 검수 후 이번 생성 원본5장만 정리 완료했다. 원본 삭제 후 변환 스크립트 재실행에는 아래 프롬프트로 생성 원화를 다시 준비해야 한다.

### neDraw

```text
Use case: identity-preserve. Redraw this approved archer as ONE full connected character, in a right-handed archery FULL DRAW pose viewed from BEHIND, aimed diagonally AWAY from viewer toward UPPER RIGHT (2 o'clock northeast). Keep the black ponytail, olive rolled sleeves, brown leather vest, navy cream-edged coat panels, trousers, boots and quiver. Tactical game sprite, transparent background, generous margin.
CRITICAL ARM ANATOMY: anatomical LEFT shoulder is at UPPER LEFT of the back. That LEFT arm is the FAR arm, extending behind/above the torso silhouette to the bow at UPPER RIGHT. Anatomical RIGHT shoulder is at LOWER RIGHT of the back. RIGHT upper arm bends backwards and DOWN toward viewer; the RIGHT elbow is LOW, near waist height on the near side, and RIGHT forearm folds UP to the right cheek to draw string. This low right elbow makes handedness readable. The torso may rotate slightly, but we must see the back, never chest. Exactly one bow. LEFT hand grips bow, RIGHT hand grips string. Bow arrow points upper-right away, NOT horizontally left. Do not use the familiar mirrored pose with a straight near arm and elbow high on left; the NEAR RIGHT ARM is BENT DOWN, far LEFT ARM straight. Do not detach arms. No text, floor, shadow or effects.
```

### neSheet

```text
Use case: identity-preserve. Make a 4 columns x 4 rows complete animation sheet of THIS SAME archer facing northeast upper-right with back visible. The reference has the CORRECT hand anatomy: far LEFT arm straight to bow upper-right; near RIGHT arm bends DOWN with low elbow and hand at cheek. PRESERVE THIS EXACT DRAW ARM GEOMETRY in attack. One connected full body per cell, boots and all bow tips fully inside cells, consistent character scale, very generous 15% transparent gutters.
ROW1 idle: 4 subtle breathing frames. Both arms lowered. LEFT hand holds single bow on FAR screen-left side, partially occluded by torso. Near RIGHT hand hangs EMPTY on screen-right. Body and head face upper-right.
ROW2 walk: alternating foot support four steps in place, same left bow hand and empty right.
ROW3 attack: frame0 nock arrow with left bow raised halfway; frame1 EXACT reference drawn pose (far straight left arm, near low bent right elbow); frame2 release with LEFT bow arm unchanged, RIGHT fingers release string close to cheek with low right elbow unchanged, arrow disappears; frame3 recover identical to row1 frame0, bow down left and right hand empty.
ROW4 skill: bow stays lowered in LEFT hand like idle, near empty RIGHT hand lifts in open-palm command then holds then lowers; frames prepare, raise, hold, recover. No extra bows or arrows. Same brown leather, olive sleeves, navy cream panels, black ponytail, quiver and boots. Simplify detail to crisp outlined small tactical sprite matching identity. No text grids shadows magic. True transparent. No reflection or change in handedness. All characters smaller than 65% cell height including raised bow.
```

### swDraw

```text
Edit this single archer FULL DRAW pose to correct hand anatomy while preserving costume face and SOUTHWEST facing screen LEFT toward viewer. LEFT hand must hold bow. Since the viewer sees FRONT and LEFT side of body, the NEAR LEFT shoulder is on screen RIGHT of chest and its arm extends ACROSS IN FRONT OF CHEST toward the bow on screen LEFT. Show that continuous near arm crossing the chest, not originating on the far shoulder. FAR RIGHT arm is bent, mostly occluded behind torso, right fingers at cheek pulling string; do not put a visible high elbow above right shoulder. Keep ONE bow aimed lower-left, normal human proportions, ponytail olive brown navy cream identity, complete connected body and both boots with generous20% margins. No horizontal mirror. No text effects shadow. True transparency.
```

### swDrawCorrection

```text
Redraw this archer aimed SOUTHWEST screen LEFT, viewed from FRONT-LEFT, with torso turned strongly LEFT, nearly SIDE PROFILE. Correct handedness: visible NEAR LEFT upper arm must start at shoulder on SCREEN RIGHT and cross HORIZONTALLY ACROSS THE ENTIRE CHEST in front of it, continuing to LEFT hand gripping bow at far screen LEFT. This long near arm should OCCLUDE the chest and vest at shoulder height. FAR RIGHT draw arm is mostly HIDDEN by torso, only fingers near cheek and a small LOW bent elbow visible, never an elbow high above screen-right shoulder. There must NOT be an extended bow arm attached to the screen-left shoulder of a front-facing chest, that is the WRONG hand. Side-on torso, face looks left and slightly toward viewer, not back view. Same costume, ponytail, ONE bow, quiver. Full connected body with both boots. Transparent generous20% margins, no text effects.
```

### swSheet

```text
Create 4x4 transparent tactical RPG animation sheet. Reference1 gives CORRECT SOUTHWEST archery anatomy; reference2 gives exact approved costume and small sprite proportions. Keep black ponytail brown leather vest olive sleeves navy cream panels dark boots and back quiver. All face 7 o'clock SOUTHWEST, screen LEFT toward viewer. NO mirroring. Complete connected bodies, constant body/head scale and wide transparent gutters15%.
Row1 four idle breathing poses, anatomical LEFT hand (near side, screen-right when relaxed) holds ONE lowered bow, RIGHT hand empty.
Row2 four alternating walking steps, bow stays left hand.
Row3 nock, draw, release, recover. Use reference1 EXACT near LEFT shoulder on screen-right, LEFT arm crossing IN FRONT OF ENTIRE CHEST toward bow on screen LEFT, far RIGHT hand at cheek and elbow hidden behind torso. Frame0 nock with bow partly raised and right hand at string, frame1 full draw reference pose, frame2 left arm identical but right fingers release near cheek, arrow absent, frame3 same as row1 frame0 bow lowered left.
Row4 command skill: left hand keeps bow lowered same as idle, empty RIGHT hand raises open palm, holds, lowers. No spell effects.
Maintain actual SOUTHWEST view not pure profile, but left extended arm must hide chest in draw. One bow per figure. Same scale each cell, figures only60% cell height including bow, no clipping. Exactly 4 rows and 4 columns. No text shadow grids or effects.
```


---

# 이전 v1 기록 (보존)

# 궁병 기본 단계 모션 시각 초안

2026-10-26. jobId 6 / 궁병. 내장 image_gen 사용. **80프레임 제작·기술 검사 완료, NE 활 손 일관성은 미해결이므로 전체 승인 및 통합 완료가 아니다.**

## 파일과 용량

- 전투: `web/public/images/class-motion-pilot/archer/job-6/combat-v1/` — nw/ne/se/sw × action0~3 × frame0~3 = 64장.
- 시나리오: `web/public/images/class-motion-pilot/archer/job-6/scenario-v1/` — 4방향 × action0 × frame0~3 = 16장.
- 개별 프레임 총 343,744 bytes. 검수 시트 5장 및 review-animation.webp 포함 이미지 합계 810,522 bytes.
- 160×160 RGBA WebP, 품질78. 발 기준 y150, 중심 x80, 대기 몸체 약112px. 같은 방향의 모든 전투 동작은 동일 배율. 스킬의 활 상승분은 몸체 확대가 아니다.
- 시간: 대기320 / 이동170 / 공격190 / 스킬240 / 시나리오360ms. 쇠약300ms는 규격만 기록, 미제작.
- contact-{direction}.webp는 방향별 4행(대기/이동/공격/스킬)×4열(시간), contact-scenario.webp는 4행(nw/ne/se/sw)×4열. 240px 셀에 프레임을 넣어 여백을 확보했다.
- review-animation.webp는 열 nw/ne/se/sw, 행 대기/이동/공격/스킬/시나리오. 비교용 전체240ms이며 실제 동작별 속도 구현과 다르다.

## 참고 이미지

승인 외형: `web/public/images/job-models/se-v1/job-6.webp`를 view_image로 확인했다. 검은 묶은 머리, 젊은 얼굴, 갈색 가죽 상의·올리브 소매·남색과 아이보리 옷자락·바지·장화·활·화살통을 기준으로 삼았다.
스타일·크기 참고: 왕건 `full-frame-v1/se-0-0.webp`, `scenario-standing-v2/se-0-0.webp`, `weakened-v1/se-0-0.webp`를 확인했다. 왕건 복식이나 얼굴을 복제하지 않았다.

## 검사와 수정

- 80/80 파일 크기160×160, 알파0/255 존재, 잘린 캔버스 경계 없음, 발 아래 투명10px 확인. 자동 검사 결과와 각 파일 bbox/배율/SHA256은 manifest에 기록했다.
- 5개 결과 시트 전 프레임 육안 확인. 머리·몸·팔·다리는 연결된 생성 원화이며 분할 관절 합성이나 좌우반전은 사용하지 않았다. 인접 셀 혼입과 잘림은 확인되지 않았다.
- 원본 시트의 균일한 셀 경계 일부에 발이 가까워, 실제 빈 투명 띠 중앙에서 행을 분할했다. 그림 자체를 잘라 지우지 않았다. 최종 결과 시트는 여백을 넓혀 저장했다.
- SE의 좁은 여백은 image_gen 편집으로 보완했다. SW 공격이 화면 오른쪽을 향하던 오류는 image_gen 편집 후 왼쪽 조준으로 수정했다.
- 시나리오16장은 활·화살·화살통·칼집 없는 빈손을 확인했다.
- 4단계 비교 이미지를 시간순으로 확인했다. 대기와 시나리오의 크기 변동은 작고, 걷기는 다리 교대가 보인다. 공격·스킬 전환에는 생성 특유의 손·머리·옷자락 형태 변화가 남는다. 실제 사이트 연속 재생/모바일 실기기 검수는 아직 하지 않았다.
- NE는 활 손이 다른 방향과 일치하지 않는 문제가 남는다. 편집, 재생성, 공격4장 별도 생성까지 시도했으나 손을 고치면 조준 방향이 뒤집히거나 활이 중복되었다. 해당 후속 결과는 채택하지 않았다. 현재 NE는 최초 방향 일관성 있는 초안이며, **왼손 활/오른손 당김 기준 미통과**다. 이 상태를 완성된 최종 모션으로 사용하지 않는다.
- Pillow/NumPy로 분리·동일 배율 축소·알파 경계 정리만 수행했다. SciPy 로딩 오류로 그 의존성을 제거했다. pack-archer.py는 기술 변환 기록이며, 생성 원본 정리 후 재실행하려면 아래 프롬프트로 원본을 다시 생성하고 경로를 갱신해야 한다.

## 미제작·미연결

승급, 포차, 쇠약, 다른 병과, 실제 발사체/명중/스킬 판정, 사이트 UI 연결 및 빌드. 공통 코드·데이터·기존 이미지·README·AGENTS는 수정하지 않았다. 커밋·푸시·배포하지 않았다.
이번 생성 대형 PNG만 검수 후 정리했다. 선택된 경량 프레임과 모든 프롬프트를 보존한다.

## 프롬프트

채택 원본: SE는 se+seCorrection, SW는 sw+swCorrection, NW는 nw, NE는 ne, 시나리오는 scenario. 이후 NE 수정 프롬프트는 실패 이력으로만 남긴다.

### se

```text
Use case: stylized-concept. Create a transparent tactical RPG animation sprite sheet using attached approved job-6 archer as identity reference. Preserve exactly this youthful clean-shaven face and gender presentation, black tied hair, brown leather vest, muted olive sleeves, cream-edged navy split skirt panels, dark trousers and boots, brown recurved bow and back quiver. Do not copy a ruler costume. Complete anatomically connected character per cell, not separated parts. Crisp outlined restrained painted game sprite matching reference.
Exactly 4 columns x 4 rows on square canvas. All 16 figures face SOUTHEAST 5 o'clock, front three-quarter view facing screen RIGHT toward viewer. Columns are time frames 0,1,2,3. Row1: subtle ready idle breathing bow lowered. Row2: four distinct in-place walking cycle poses alternating legs, bow safely held. Row3: archery attack nock arrow, draw string to cheek, release (arrow gone, right hand follows through), recover bow lowered. Anatomical LEFT hand holds bow, RIGHT hand draws string consistently. Row4: skill preparation, bow raised diagonally in focused command, hold focus, lower recover; no magical effects or flying projectile.
Same body height, head size, costume and ground baseline in EVERY cell. Figure including all bow tips occupies middle 65% of cell maximum, minimum 15% clear margin on ALL sides. No overlapping neighboring cells. No detached limbs, extra weapons, duplicate bows, texts, borders, grids, ground shadows. Genuine transparent background.
```

### sw

```text
Use case: stylized-concept. Create a transparent tactical RPG animation sprite sheet using attached approved job-6 archer as identity reference. Preserve exactly this youthful clean-shaven face and gender presentation, black tied hair, brown leather vest, muted olive sleeves, cream-edged navy split skirt panels, dark trousers and boots, brown recurved bow and back quiver. Do not copy a ruler costume. Complete anatomically connected character per cell, not separated parts. Crisp outlined restrained painted game sprite matching reference.
Exactly 4 columns x 4 rows on square canvas. All 16 figures face SOUTHWEST 7 o'clock, front three-quarter view facing screen LEFT toward viewer. Columns are time frames 0,1,2,3. Row1: subtle ready idle breathing bow lowered. Row2: four distinct in-place walking cycle poses alternating legs, bow safely held. Row3: archery attack nock arrow, draw string to cheek, release (arrow gone, right hand follows through), recover bow lowered. Anatomical LEFT hand holds bow, RIGHT hand draws string consistently. Row4: skill preparation, bow raised diagonally in focused command, hold focus, lower recover; no magical effects or flying projectile.
Same body height, head size, costume and ground baseline in EVERY cell. Figure including all bow tips occupies middle 65% of cell maximum, minimum 15% clear margin on ALL sides. No overlapping neighboring cells. No detached limbs, extra weapons, duplicate bows, texts, borders, grids, ground shadows. Genuine transparent background. Draw this direction independently, NOT a horizontal mirror: the anatomical LEFT hand still holds bow and RIGHT hand draws. Keep entire figures smaller with much wider vertical gutters than reference sheet.
```

### nw

```text
Use case: stylized-concept. Create a transparent tactical RPG animation sprite sheet using attached approved job-6 archer as identity reference. Preserve exactly this youthful clean-shaven face and gender presentation, black tied hair, brown leather vest, muted olive sleeves, cream-edged navy split skirt panels, dark trousers and boots, brown recurved bow and back quiver. Do not copy a ruler costume. Complete anatomically connected character per cell, not separated parts. Crisp outlined restrained painted game sprite matching reference.
Exactly 4 columns x 4 rows on square canvas. All 16 figures face NORTHWEST 11 o'clock, rear three-quarter view facing screen LEFT and AWAY from viewer; show BACK of head and leather vest, face mostly hidden. Columns are time frames 0,1,2,3. Row1: subtle ready idle breathing bow lowered. Row2: four distinct in-place walking cycle poses alternating legs, bow safely held. Row3: archery attack nock arrow, draw string to cheek, release (arrow gone, right hand follows through), recover bow lowered. Anatomical LEFT hand holds bow, RIGHT hand draws string consistently. Row4: skill preparation, bow raised diagonally in focused command, hold focus, lower recover; no magical effects or flying projectile.
Same body height, head size, costume and ground baseline in EVERY cell. Figure including all bow tips occupies middle 65% of cell maximum, minimum 15% clear margin on ALL sides. No overlapping neighboring cells. No detached limbs, extra weapons, duplicate bows, texts, borders, grids, ground shadows. Genuine transparent background. CRITICAL use small sprites only 60% cell height with wide transparent space above and below. Back-facing archer in EVERY pose including attack. Left bow hand, right string hand, quiver on back. No mirroring.
```

### ne

```text
Use case: stylized-concept. Create a transparent tactical RPG animation sprite sheet using attached approved job-6 archer as identity reference. Preserve exactly this youthful clean-shaven face and gender presentation, black tied hair, brown leather vest, muted olive sleeves, cream-edged navy split skirt panels, dark trousers and boots, brown recurved bow and back quiver. Do not copy a ruler costume. Complete anatomically connected character per cell, not separated parts. Crisp outlined restrained painted game sprite matching reference.
Exactly 4 columns x 4 rows on square canvas. All 16 figures face NORTHEAST 2 o'clock, rear three-quarter view facing screen RIGHT and AWAY from viewer; show BACK of head and leather vest, face mostly hidden. Columns are time frames 0,1,2,3. Row1: subtle ready idle breathing bow lowered. Row2: four distinct in-place walking cycle poses alternating legs, bow safely held. Row3: archery attack nock arrow, draw string to cheek, release (arrow gone, right hand follows through), recover bow lowered. Anatomical LEFT hand holds bow, RIGHT hand draws string consistently. Row4: skill preparation, bow raised diagonally in focused command, hold focus, lower recover; no magical effects or flying projectile.
Same body height, head size, costume and ground baseline in EVERY cell. Figure including all bow tips occupies middle 65% of cell maximum, minimum 15% clear margin on ALL sides. No overlapping neighboring cells. No detached limbs, extra weapons, duplicate bows, texts, borders, grids, ground shadows. Genuine transparent background. CRITICAL use small sprites only 60% cell height with wide transparent space above and below. Back-facing archer in EVERY pose including attack. Left bow hand, right string hand, quiver on back. No mirroring.
```

### scenario

```text
Use case: stylized-concept. Create transparent 4x4 tactical RPG sprite sheet of the attached approved job-6 archer. Preserve youthful clean-shaven face and gender presentation, black tied ponytail, olive sleeves, brown leather vest, cream-edged navy skirt panels, dark trousers boots. Complete connected body. Peaceful scenario standing, BOTH HANDS EMPTY and naturally relaxed. Remove ALL bow, arrows, quiver, weapon straps, scabbards, weapons. Exactly 4 equal rows and 4 columns. Row1 NW 11 o'clock BACK facing upper LEFT. Row2 NE 2 o'clock BACK facing upper RIGHT. Row3 SE 5 o'clock FRONT facing lower RIGHT. Row4 SW 7 o'clock FRONT facing lower LEFT. Columns four subtle breathing frames with feet fixed, no walking. Same body scale across all cells. Body maximum 60% cell height, middle of each cell, minimum 15% empty margin every side. Same baseline. Crisp restrained outlined painted style as reference, not ruler clothes. No text grid shadows effects. True transparent background.
```

### seCorrection

```text
Edit ONLY layout and transparent gutters of this 4x4 archer animation sheet. Preserve exactly all sixteen complete connected poses, direction southeast facing RIGHT, costumes, identities, bow hands, row ordering. Uniformly reduce all sprites to 65% of their cell height, leaving at least 15% transparent margin on EVERY side of EACH equal square cell. No sword, no new effects, no change of pose. Genuine transparent background. No grid lines or labels. Keep same body size across all rows and frames and same foot baseline within each cell. All bow tips must fit safely.
```

### neCorrection

```text
Correct the anatomy of the attached NORTHEAST BACK-facing archer 4x4 sheet. ALL figures face 2 o'clock screen RIGHT and AWAY, back visible. CRITICAL this is a LEFT-HAND-BOW right-handed archer: anatomical LEFT hand holds bow, RIGHT hand draws string. In this rear-right view the anatomical RIGHT shoulder/arm is the NEAR arm visible on screen RIGHT side of back. It must NOT hold the bow. At idle/walking/recovery, NEAR RIGHT hand hangs empty visibly beside right hip; bow is held by FAR LEFT hand on the far side of body, partially occluded by torso. During attack row3, near RIGHT elbow is bent back toward screen LEFT, RIGHT hand at cheek pulling string; FAR LEFT arm extends forward toward upper-right holding bow, partly hidden behind torso. Draw distinct anatomically correct arms, do not mirror. Preserve same ponytail, leather vest olive sleeves cream/navy panels quiver, face and body size. Rows idle/walk/nock-draw-release-recover/raise-bow skill. 4 columns time frames. All whole connected sprites with ample transparent gutters and equal body size. True transparent, no text effects grids.
```

### neRedraw

```text
Create a NEW 4x4 transparent sprite sheet of reference archer, facing NORTHEAST 2 o'clock, BACK view turned slightly toward screen RIGHT. Preserve character and costume. Anatomically LEFT-handed bow grip, RIGHT drawing hand. Unlike previous sheet do NOT put the bow in the screen-right hanging hand. IDLE: bow and LEFT hand are on SCREEN LEFT of body, RIGHT hand is empty on SCREEN RIGHT. WALK: same. ATTACK: LEFT shoulder is on screen LEFT; left arm extends across far side toward upper right to hold bow. RIGHT shoulder on screen RIGHT, right elbow bends outward to screen RIGHT, RIGHT hand draws beside the right cheek. Show right elbow silhouette protruding to screen RIGHT behind draw hand, far left arm partly occluded by body. Do not reproduce reversed hands. 4 rows idle, walk, attack(nock/draw/release/recover), skill(prepare/raise bow/hold/lower). 4 columns sequential frames. Body and head same size all 16, 65% cell height and wide transparent gutters. Complete connected body not pieces. Brown leather vest olive sleeves navy cream skirt trousers boots ponytail quiver. No text, glow, projectiles, grid, shadows.
```

### neFinal

```text
Edit the supplied archer 4x4 sheet. KEEP first two rows unchanged (correct bow in anatomical left hand, empty right hand). FIX bottom TWO rows: the archer must AIM the bow to UPPER RIGHT (northeast) in ALL attack and skill poses, never aim left. Left arm crosses on FAR side of torso and extends toward UPPER RIGHT holding bow. RIGHT hand pulls string beside right cheek, right elbow bends back toward LOWER LEFT behind the body. Show the BACK of character facing upper-right. Do NOT swap bow hand in recovery: bow must be in LEFT hand on screen LEFT like top row. Third row: nocking, fully drawn bow aimed upper-right, released string with bow still upper-right, recovery identical to first idle. Fourth row: prepare, raise bow upper-right, hold raised bow upper-right, recovery identical to first idle. Preserve costume and human identity. Resize layout to SQUARE regular4x4 with generous15% clear transparent margins per cell, full connected figure, constant body size. No text grids effects or flying arrows.
```

### neAttack

```text
Create ONE sequence of four complete archer poses in a transparent 2x2 sheet, read top-left top-right bottom-left bottom-right. Reference approved character. BACK three-quarter facing NORTHEAST upper-right. This is a RIGHT-HANDED archer: LEFT hand grips bow toward upper-right, RIGHT hand draws string, right elbow extends behind toward lower-left. Camera sees back and right arm. Draw anatomically correct archery, no swapped hands. Pose0 nock arrow with bow low toward upper-right. Pose1 full draw with left arm reaching upper-right, right hand at cheek and bent right elbow prominent on lower-left side of torso. Pose2 release: same left arm and bow, right hand relaxed back near ear, arrow absent. Pose3 recover: both arms down, LEFT hand and bow on screen LEFT side, RIGHT hand EMPTY screen RIGHT. Same youthful ponytail leather olive/navy/cream archer. Exactly ONE bow and TWO connected arms per figure. Same scale and anchor, entirely separated in each cell with generous20% margins. Crisp tactical RPG sprite, no labels, no effects no shadows, true transparency.
```

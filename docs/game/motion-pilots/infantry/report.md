# 경보병 v2 기본 모션 오류 수정 — 2026-10-26

상태: **수정본 제작, 보완 검토 필요**. 모든 문제 해결 완료가 아니다. 승급 제작은 보류했다. v1 폴더/프레임/검수자료를 그대로 보존한다. 아래 기존 v1 기록도 유지한다.

## 통합 경로와 용량

- `web/public/images/class-motion-pilot/infantry/job-3/combat-v2/`: 완전한64프레임 모드. 4방향×대기/이동/공격/스킬×4프레임.
- `web/public/images/class-motion-pilot/infantry/job-3/scenario-v2/`: 완전한16프레임 빈손 시나리오 모드.
- 80프레임160×160 투명WebP quality78, **303450bytes**. 검수자료29개 포함 **948228bytes**. review-* 파일은 실제 프레임 목록에서 제외.
- 시간순 결과 시트는0,1,2,3,0 순서로 마지막→첫 프레임 비교 가능. 개별 동작 재생 WebP는 대기320/이동170/공격190/스킬240/시나리오360ms 적용.
- manifest 최상위는v2이며 versions.v1에 이전 목록/수치를 보존. 전체 모드 연결에는 위 새 경로 사용. 사이트 UI·데이터·빌드·커밋·푸시·배포는 수행하지 않았다.

## 원인과 변경

1. v1 변환기는 가장 낮은 발의 x중앙값을80에 맞췄다. 지지발 변경 시 몸 전체가 이동했다. 예: NW 보행 몸통 중심 추정66/80/95/68px, SW 대기89/62/67/68px. v2는 갈색 몸통 영역(y82~111)의 중앙값으로 전체 프레임을 수평 정렬한다. 팔/무기를 분리해서 옮긴 것이 아니다.
2. v2 출력의 동일 기준 몸통 중심은77~83px. NE 타격1은 검끝 여백 보존 때문에77px이며 나머지 미세 편차에는 WebP 재인코딩 색상 차이와 포즈가 포함된다. 이 색상 지표는 해부학적 중심의 절대 보증이 아니다.
3. 공격4방향16프레임은 내장image_gen으로 재제작. NW는 오른팔이 몸 앞쪽으로 돌아가고 검끝이11시를 향하게 수정. NE2시/SE5시/SW7시도 타격 방향을 맞추고 준비→타격→회수→준비에 가까운 자세로 연결.
4. 스킬16프레임을 짧은 검 거양 동작으로 교체. 첫4x4시트의NW가NE처럼 보이고SW에 손 교환이 생겨 해당8장은 제외, NW/SW는 각 방향 새 공격 시트를 참조해2x2로 재제작. NE/SE행만 첫 시트에서 채택.
5. 새 시트 분할 중 SE스킬에 이웃 셀의 유리 조각이 포함된 것을 확인. 연결영역으로 기술적으로 제거한 뒤 발 기준을 다시 맞췄다. 부품 합성·수평반전·가짜 중간프레임 생성은 사용하지 않았다.
6. 보행·대기·시나리오48장은 기존 완성 프레임을 재정렬. 새 원화32장은 원화별 일정한 배율로112px 몸체 기준에 맞췄고 프레임마다 독립적으로 키우지 않았다.

## 검수

- 80/80 크기160×160, 알파 존재, 실루엣 존재, 출력 경계 비접촉 확인. alpha>40 기준 발 하단 전부y150.
- 전투4개·시나리오4개 결과 시트의 전체 프레임을view_image로 확인. 방향, 오른손, 신체 연결, 검끝 잘림, 3→0 복귀를0/1/2/3/0 시간순으로 비교.
- 로컬 브라우저에서20개 루프를 지정 속도로 재생하고 여러 시점의 화면을 확인. 초기 중심 밀림과 크게 벌어지던 공격은 개선됐다. 모바일 실기기와 통합 사이트 동작 전환은 미검수.

## 정확한 미해결 범위

- `nw-1-2→nw-1-3→nw-1-0`: 보행 다리 교차·옷자락의 원화 형태 변화 잔존. 중심 정렬은 수정됐지만 보행 자체의 최종 보간 품질은 미완료.
- `se-1-0→se-1-1`, `sw-1-2→sw-1-3`: 지지발 교체의 상체 기울기와 소매·바지 형태 차이 잔존.
- `ne-2-1`: 검끝 여백 확보에 따른 몸통 중심3px 편차(77px).
- `se-2-3→se-2-0`, `sw-2-3→sw-2-0`: 자세는 가까워졌지만 얼굴·투구/체형의 미세 생성 차이는 남음.
- 실제 게임 판정·장비별 외형·승급·보행 쇠약은 미제작. 이번 수정으로 최종 게임 모션 완료를 선언하지 않는다.

## 도구·참고·프롬프트

imagegen 스킬 및 내장image_gen 사용. v1 경량 review-nw/ne/se/sw.webp를view_image로 확인하고 공격 참조로 사용. 스킬 최초 시트는 승인 job-3.webp, 재수정NW/SW는 이번 새 공격 시트 참조. Pillow/NumPy는 분할·동일배율 축소·알파 정리·전체 프레임 이동에만 사용. 기술 스크립트 pack-infantry-v2.py 보존. 이번 생성PNG7개만 경량본 검수 후 삭제한다.

### v2 nw

```text
Edit/recreate the attached infantry sprite reference into ONE FOUR-FRAME looping sword attack, arranged exactly 2 columns x 2 rows in chronological order 0,1 / 2,3. Same male infantry, brown lamellar armor, dark pointed helmet, gray clothing, short iron sword ANATOMICAL RIGHT HAND, left hand empty. Facing NORTHWEST 11 o'clock away and LEFT, showing back and left profile. Critical correct attack: target is upper LEFT in front of his face. His RIGHT shoulder and elbow rotate FORWARD around his right side; the right FOREARM and sword can be partly OCCLUDED BY HIS TORSO because camera sees his BACK. NEVER draw the sword extending toward upper RIGHT behind him. Sword tip aims upper LEFT at impact, right hand reaches across in FRONT of chest, NOT across visible back. Never transfer sword to LEFT hand. Complete connected body poses only, NO separate limbs, NO mirroring. Frame0 compact ready sword beside RIGHT shoulder, knees slightly flexed. Frame1 short controlled forward diagonal slash toward upper LEFT target, minimal torso lean. Frame2 blade retracting from upper LEFT toward right shoulder, elbow folds. Frame3 almost same compact ready pose as frame0 to close loop smoothly. Same foot positions, pelvis location, helmet size, body scale and camera in all4. Body upright around112px when reduced to160, do not squat or stretch. 2x2 equal cells, every figure including sword within central65% each cell, large15% transparent gutters all sides. True transparency. Crisp game sprite matching reference exact identity and colors. No effects or grid or text or shadows. Reference sheet shows old WRONG sideways attacks: do NOT copy its attack poses, only identity.
```

### v2 ne

```text
Create a corrected FOUR FRAME seamless looping sword attack sprite sequence, exactly2x2 cells chronological0,1/2,3. Reference sheet ONLY identity, not old attack movement. Same light infantry male dark pointed helmet brown lamellar cuirass shoulder plates skirt gray clothes dark boots short iron sword in anatomical RIGHT HAND, LEFT empty. Entire connected human each frame. NE northeast2 o'clock BACK three-quarter facing screen RIGHT and UP away from viewer. Show back helmet and armor, no front chest. Target upper RIGHT. Right sword shoulder and hand on screen RIGHT of spine, left empty arm screen LEFT. Frame0 compact sword-ready guard at chest with right elbow bent. Frame1 short controlled forward diagonal sword strike aiming upper RIGHT in front of face, sword tip higher than hand, no horizontal sideways extension. Frame2 retract sword half way, elbow bent, same body heading. Frame3 nearly same guard as frame0 with small recovery, smooth loop3->0. Feet planted SAME two positions; head, waist and pelvis stay same location; minimal torso lean, no huge squat or spreading arms. All4 same body112px at160 output; consistent face/helmet scale. Central65% each equal square cell including weapon, wide15% transparent margins. True transparent background no ground shadow text grid magic. Right hand always same side/shoulder; no mirrored frames. Retain reference armor style and proportions.
```

### v2 se

```text
Create a corrected FOUR FRAME seamless looping sword attack sprite sequence, exactly2x2 cells chronological0,1/2,3. Reference sheet ONLY identity, not old attack movement. Same light infantry male dark pointed helmet brown lamellar cuirass shoulder plates skirt gray clothes dark boots short iron sword in anatomical RIGHT HAND, LEFT empty. Entire connected human each frame. SE southeast5 o'clock FRONT three-quarter facing screen RIGHT and slightly DOWN towards viewer. Target lower RIGHT. Frame0 compact sword-ready guard at chest with right elbow bent. Frame1 short controlled forward diagonal sword strike aiming lower RIGHT in front of face, sword tip lower than hand, no horizontal sideways extension. Frame2 retract sword half way, elbow bent, same body heading. Frame3 nearly same guard as frame0 with small recovery, smooth loop3->0. Feet planted SAME two positions; head, waist and pelvis stay same location; minimal torso lean, no huge squat or spreading arms. All4 same body112px at160 output; consistent face/helmet scale. Central65% each equal square cell including weapon, wide15% transparent margins. True transparent background no ground shadow text grid magic. Right hand always same side/shoulder; no mirrored frames. Retain reference armor style and proportions.
```

### v2 sw

```text
Create a corrected FOUR FRAME seamless looping sword attack sprite sequence, exactly2x2 cells chronological0,1/2,3. Reference sheet ONLY identity, not old attack movement. Same light infantry male dark pointed helmet brown lamellar cuirass shoulder plates skirt gray clothes dark boots short iron sword in anatomical RIGHT HAND, LEFT empty. Entire connected human each frame. SW southwest7 o'clock FRONT three-quarter facing screen LEFT and slightly DOWN towards viewer. Target lower LEFT. Anatomical right weapon arm is FAR side of body and originates from shoulder on screen LEFT, left empty arm near screen RIGHT. Frame0 compact sword-ready guard at chest with right elbow bent. Frame1 short controlled forward diagonal sword strike aiming lower LEFT in front of face, sword tip lower than hand, no horizontal sideways extension. Frame2 retract sword half way, elbow bent, same body heading. Frame3 nearly same guard as frame0 with small recovery, smooth loop3->0. Feet planted SAME two positions; head, waist and pelvis stay same location; minimal torso lean, no huge squat or spreading arms. All4 same body112px at160 output; consistent face/helmet scale. Central65% each equal square cell including weapon, wide15% transparent margins. True transparent background no ground shadow text grid magic. Right hand always same side/shoulder; no mirrored frames. Retain reference armor style and proportions.
```

### v2 skill

```text
Create transparent4x4 sprite sheet of SAME approved infantry male dark pointed helmet brown lamellar armor shoulders skirt gray sleeves trousers black boots short iron sword RIGHT hand, left empty. Complete connected whole figures. Four ROWS are NW back upper LEFT11, NE back upper RIGHT2, SE front lower RIGHT5, SW front lower LEFT7. Four COLUMNS coherent compact SKILL command loop: frame0 sword held upright near RIGHT shoulder at head height; frame1 right sword gently raised a little higher; frame2 same sword settles halfway down; frame3 nearly frame0 upright shoulder guard. No attack sweep, no crouch, no spreading limbs, no effects. Feet planted same two points, pelvis centered, same head size body scale all16. Minimal breathing upright command posture. Anatomical RIGHT sword hand: in back rows arm originates screen RIGHT of spine, in front rows arm originates screen LEFT of chest. Never swap hands or mirror. NW face upperleft but sword stays upright near right shoulder, not pointed sideways; NE upperright; SE downright; SW downleft. Use attached approved single model for identity, not ruler. Body only60% cell height, swords all within central70% each square cell,15% transparent gutters, fixed ground baseline. Crisp outlined tactical game sprite, no grids text shadows. Actual alpha transparency. No new costume. Smooth seam frame3 to0.
```

### v2 skill-nw

```text
Produce exactly2x2 connected complete infantry frames of a subtle SKILL command loop. Copy identity AND BACK LEFT northwest11 o'clock direction from attached 2x2 attack reference. Same brown armor gray clothes dark helmet short sword. RIGHT hand is same as reference at SCREEN RIGHT shoulder, LEFT hand at screen LEFT empty. Do not change direction, do not swap hands. Replace attack with: frame0 upright sword near right shoulder, frame1 sword raised a little higher upright, frame2 settle halfway, frame3 nearly frame0. Do NOT point weapon outwards; no strike. All bodies and feet identical position, same body proportions and helmet size, no crouch or wide arm gesture. Show back and LEFT cheek on LEFT, not right-facing back. True transparent2x2 equal cells with15% clear margins, full figure no clipping, no text grid shadows effects. 4 unique subtle frames, smooth loop.
```

### v2 skill-sw

```text
Produce exactly2x2 connected complete infantry frames of a subtle SKILL command loop. Copy identity AND FRONT LEFT southwest7 o'clock direction from attached2x2 attack reference. Same male brown armor gray clothes dark helmet short sword. RIGHT hand is same as reference on SCREEN LEFT side of chest, LEFT EMPTY hand at screen RIGHT. DO NOT swap hands; sword in screen LEFT hand in ALL4 poses. Replace attack with: frame0 upright sword near right shoulder(screen LEFT), frame1 sword raised a little higher upright, frame2 settle halfway, frame3 nearly frame0. Do NOT point weapon sideways or attack. All bodies and feet same position, head size and proportions constant, no crouch or spreading arms. Face points screen LEFT toward viewer. True transparent2x2 equal cells with15% clear margins, full figure no clipping, no text grid shadows effects. Four unique subtle frames, smooth loop3->0. No mirror.
```

---

# 경보병 기본 단계 모션 시각 초안 — 2026-10-26

job ID 3, 경보병. 내장 image_gen 사용. 전투64장 + 빈손 시나리오16장 =80장. 사용자 승인 전 검토용 초안이며 실제 전투 판정·사이트 연결 완료가 아니다.

## 저장 위치와 용량

- `web/public/images/class-motion-pilot/infantry/job-3/combat-v1/`: `{direction}-{action}-{frame}.webp`, 4방향×4동작×4프레임.
- `web/public/images/class-motion-pilot/infantry/job-3/scenario-v1/`: `{direction}-0-{frame}.webp`, 4방향×4프레임.
- 160×160 RGBA WebP, quality78. 발 기준 y150, 기본 몸체 높이 약112px. 각 전투 방향의 전체 동작에 동일 배율 적용; 동작별 확대 없음.
- 개별80장307,362bytes. 정적 검수 시트5개와 재생 WebP5개 포함882,044bytes. 각 폴더의 review-* 파일은 게임 프레임이 아닌 검수 자료.
- 재생 계약(ms/프레임): 대기320, 이동170, 공격190, 스킬240, 시나리오360. 쇠약300은 예약값이며 이번 쇠약 파일은 없다. 비교용 전투 애니메이션 스트립은 동시 비교를 위해240ms, 시나리오360ms로 저장했다.

## 참고 이미지

- 정체성 승인: `web/public/images/job-models/se-v1/job-3.webp` (view_image로 확인하고 모든 최초 생성에 참조).
- 그림체·체급만 참고: `web/public/images/playable/wang-geon/full-frame-v1/se-0-0.webp`, `scenario-standing-v2/se-0-0.webp`, `weakened-v1/se-0-0.webp` (모두 view_image 확인). 왕건 얼굴·복식 복제하지 않음.
- 남성 경보병의 어두운 투구, 갈색 찰갑·어깨 보호구·자락, 회갈색 소매·바지, 검은 장화와 짧은 철검을 유지. 시나리오는 무기·칼집·방패 없이 빈손.

## 검수와 수정

- 5개 최종 결과 시트 전80프레임 육안 확인: 앞se/sw, 뒤nw/ne, 신체 연결, 검·손 접점, 시나리오 빈손 확인. 전체 반전이나 부품 재합성은 하지 않았다.
- 최초 NW는 검을 든 손이 프레임 사이 바뀌고 스킬 준비에 검이 빠졌다. 편집1회와 새 생성1회는 개선 불충분으로 제외. 승인 모델을 다시 참조한 독립 재생성에서 후면 왼쪽 방향과 화면 오른쪽 무기 손을 고정했다.
- 원본 시트의15% 여백 요청은 일부 공격 셀에서 충족되지 않았다. 셀 경계로 자르지 않고 연결된 완성 인물 단위로 추출하여 이웃 셀 조각과 검 잘림을 피했다. Pillow/NumPy 기술 처리만 사용했고 몸·무기 재합성은 하지 않았다.
- 80/80 크기160×160, 알파 존재, 비어 있지 않은 실루엣, 출력 경계 비접촉 확인. 원화의 작은 유리 픽셀은 연결영역 마스크로 정리. 알파40 초과 발 하단 y150으로 정렬. 세부 배율·알파 경계는 manifest 파일별 기록.
- 로컬 브라우저에서5개 재생 스트립을 열어 다른 시점의 재생 화면을 확인. 투명 배경, 방향, 손 연결과 발 높이를 확인했다. 프레임별 정적 비교도 병행했다. 모바일 실기기와 통합 사이트 UI는 미검수.

## 남은 문제·미제작 범위

- NW 공격/스킬은 몸이11시를 보지만 검을 옆/뒤로 크게 벌리는 자세다. 목표 방향으로 일관된 타격을 표현하는 최종 원화로는 추가 조정 필요.
- 공격3→0, 스킬3→0 복귀의 자세 변화가 크고, 일부 보행 실루엣·갑옷 세부·머리 각도에 미세한 변화가 남는다. 정렬만으로 최종 게임용 모션 품질을 보장하지 않는다.
- 시나리오 대기는 매우 미세한 호흡 차이. 스킬은 창작 검 준비/거양 동작이며 스킬 효과·게임 판정 구현 아님.
- 승급, 다른 병과, 보행 쇠약, 장비별 외형, 공통 UI 연결, 빌드, 전투 로직은 미제작/이번 범위 밖.
- 기존 이미지·공통 데이터·컴포넌트·AGENTS·README는 수정하지 않았다. 커밋·푸시·배포 없음.
- 이번 생성 PNG8개만 경량 검수 후 삭제. 경량 파일과 아래 전체 프롬프트 보존. 재생성 없이 원본 재추출 불가. 기술 변환 스크립트는 pack-infantry.py에 보존.

## 내장 image_gen 프롬프트

최종 채택: se, sw, ne, nw-new, scenario. nw / nw-fix / nw-final은 폐기된 수정 이력을 설명하기 위해 보존한다.

### se

```text
Use case: stylized-concept. Create a transparent 4x4 tactical RPG animation sprite sheet, 16 equal square cells. Reference image is the approved LIGHT INFANTRY job3: preserve male face, dark iron helmet small top point, brown lamellar cuirass and shoulder guards, gray brown sleeves, segmented brown skirt, dark trousers boots, short straight iron sword in anatomical RIGHT hand, empty LEFT hand. Complete connected human in every cell. Direction ALL cells southeast 5 o'clock, FRONT facing screen RIGHT. Restrained crisp outlined hand-painted game sprite, same approved proportions, no horse, shield, new costume or ruler features. Rows: 1 four subtle breathing battle idle; 2 four distinct alternating-leg in-place walking phases; 3 sword attack anticipation, strike, follow-through, recovery; 4 restrained sword-ready skill prepare, lift sword, hold, recover WITHOUT magic effects. Four columns chronological frames. Fixed camera, SAME body and head size in all 16 cells. Feet at same ground level. Each figure including sword within central 70% cell, minimum 15% transparent margins on all sides, wide clear gutters. Keep sword held in right hand throughout, anatomically attached shoulders elbows wrists; two arms two legs only. True alpha transparent background, no grid, text, shadows or labels. No cropped weapons, no pieces in neighboring cells.
```

### sw

```text
Use case: stylized-concept. Create a transparent 4x4 tactical RPG animation sprite sheet, 16 equal square cells. Reference image is the approved LIGHT INFANTRY job3: preserve male face, dark iron helmet small top point, brown lamellar cuirass and shoulder guards, gray brown sleeves, segmented brown skirt, dark trousers boots, short straight iron sword in anatomical RIGHT hand, empty LEFT hand. Complete connected human in every cell. Direction ALL cells southwest 7 o'clock, FRONT facing screen LEFT, draw new viewpoint NOT mirrored: anatomical right sword arm is on far side and left empty arm near viewer. Restrained crisp outlined hand-painted game sprite, same approved proportions, no horse, shield, new costume or ruler features. Rows: 1 four subtle breathing battle idle; 2 four distinct alternating-leg in-place walking phases; 3 sword attack anticipation, strike, follow-through, recovery; 4 restrained sword-ready skill prepare, lift sword, hold, recover WITHOUT magic effects. Four columns chronological frames. Fixed camera, SAME body and head size in all 16 cells. Feet at same ground level. Each figure including sword within central 70% cell, minimum 15% transparent margins on all sides, wide clear gutters. Keep sword held in right hand throughout, anatomically attached shoulders elbows wrists; two arms two legs only. True alpha transparent background, no grid, text, shadows or labels. No cropped weapons, no pieces in neighboring cells. Make figures small enough: body height 60% cell, weapons no more than70% cell width.
```

### nw

```text
Use case: stylized-concept. Create a transparent 4x4 tactical RPG animation sprite sheet, 16 equal square cells. Reference image is the approved LIGHT INFANTRY job3: preserve male face, dark iron helmet small top point, brown lamellar cuirass and shoulder guards, gray brown sleeves, segmented brown skirt, dark trousers boots, short straight iron sword in anatomical RIGHT hand, empty LEFT hand. Complete connected human in every cell. Direction ALL cells northwest 11 o'clock, BACK facing screen LEFT and AWAY from viewer, back of helmet and back armor dominate; do not show chest. Anatomical RIGHT sword arm is near viewer. Restrained crisp outlined hand-painted game sprite, same approved proportions, no horse, shield, new costume or ruler features. Rows: 1 four subtle breathing battle idle; 2 four distinct alternating-leg in-place walking phases; 3 sword attack anticipation, strike, follow-through, recovery; 4 restrained sword-ready skill prepare, lift sword, hold, recover WITHOUT magic effects. Four columns chronological frames. Fixed camera, SAME body and head size in all 16 cells. Feet at same ground level. Each figure including sword within central 70% cell, minimum 15% transparent margins on all sides, wide clear gutters. Keep sword held in right hand throughout, anatomically attached shoulders elbows wrists; two arms two legs only. True alpha transparent background, no grid, text, shadows or labels. No cropped weapons, no pieces in neighboring cells. Every sprite body only 60% cell height; weapons entirely within central70%. Rear view all frames even attacks.
```

### ne

```text
Use case: stylized-concept. Create a transparent 4x4 tactical RPG animation sprite sheet, 16 equal square cells. Reference image is the approved LIGHT INFANTRY job3: preserve male face, dark iron helmet small top point, brown lamellar cuirass and shoulder guards, gray brown sleeves, segmented brown skirt, dark trousers boots, short straight iron sword in anatomical RIGHT hand, empty LEFT hand. Complete connected human in every cell. Direction ALL cells northeast 2 o'clock, BACK facing screen RIGHT and AWAY from viewer, back of helmet and back armor dominate; do not show chest. Sword ALWAYS anatomical RIGHT hand, appearing on screen RIGHT side of torso in this back view; empty LEFT hand on screen LEFT. Restrained crisp outlined hand-painted game sprite, same approved proportions, no horse, shield, new costume or ruler features. Rows: 1 four subtle breathing battle idle; 2 four distinct alternating-leg in-place walking phases; 3 sword attack anticipation, strike, follow-through, recovery; 4 restrained sword-ready skill prepare, lift sword, hold, recover WITHOUT magic effects. Four columns chronological frames. Fixed camera, SAME body and head size in all 16 cells. Feet at same ground level. Each figure including sword within central 70% cell, minimum 15% transparent margins on all sides, wide clear gutters. Keep sword held in right hand throughout, anatomically attached shoulders elbows wrists; two arms two legs only. True alpha transparent background, no grid, text, shadows or labels. No cropped weapons, no pieces in neighboring cells. Every sprite body only 60% cell height; weapons entirely within central70%. Rear view all frames even attacks. No changing hands.
```

### nw-fix

```text
Edit this NW BACK-view 4x4 infantry animation sheet. Fix sword hand consistency in ALL sixteen cells: sword ALWAYS in anatomical RIGHT HAND (the arm attached to shoulder at SCREEN RIGHT of the spine in this rear view). Left hand attached SCREEN LEFT is ALWAYS EMPTY. Do NOT mirror the figures. Keep facing northwest upper LEFT, showing BACK, same helmet, brown armor, clothes, exact identity and row action order idle/walk/attack/skill. Regenerate naturally connected full figures, right sword arm can swing forward toward upper left crossing in FRONT of torso and be occluded by back; it must never transfer to left arm. Idle sword can be held low on screen right, prepare skill must retain sword. Also give all cells at least15% clear transparent margin, body 60% cell height, weapons within central70%, all same scale. Exactly4x4, true transparency, no lines/text/effects. Preserve coherent four-frame cycles.
```

### nw-final

```text
Use case stylized-concept. NEW transparent infantry sprite sheet 4 columns x4 rows. Use attached RIGHT-HANDED back view infantry as identity and hand reference. ROTATE his body to face northwest, upper LEFT 11 o'clock, showing BACK; DO NOT MIRROR image. Retain sword in right hand on SCREEN RIGHT, empty left hand screen LEFT. Sword held out to screen right in idle; right elbow raised on screen right for attacks. The empty left arm must never hold sword. All cells back-left orientation. Same dark pointed iron helmet, brown lamellar shoulders cuirass skirt, gray sleeves trousers black boots. Rows idle breathing / alternating legs walking / right-arm sword attack ready strike follow-through return / right-arm sword raising skill ready raise hold lower. 4 sequential frames per row, connected whole human, fixed body size ground baseline. BODY ONLY 55% CELL HEIGHT, complete silhouette including sword inside central70%, 15% gutters every side. No effects grid text ground shadows. Transparent alpha. No left-handed pose, no missing sword.
```

### nw-new

```text
Create a NEW 4x4 transparent sprite sheet of reference male brown-armored infantry soldier viewed from BEHIND and his LEFT side. He faces upper LEFT northwest 11 o'clock in EVERY cell. We see his BACK and LEFT cheek pointing LEFT, never front chest. The arm on the LEFT of image is his LEFT arm and has EMPTY OPEN HAND throughout. His RIGHT arm on RIGHT side of image holds short iron sword, held to the RIGHT of his body. Brown lamellar armor, gray sleeves trousers dark boots pointed dark helmet identical to reference. Right sword hand ALWAYS SCREEN RIGHT; left empty hand ALWAYS SCREEN LEFT. He NEVER switches weapon hand. Rows 1 idle 4 subtly different breathing frames; row2 four walking alternating leg phases; row3 right sword lifted on right, raised forward over right shoulder, right arm follow through still at right, return; row4 right sword lift as skill then hold then return. Four frames per row, 16 complete connected bodies, full figure with feet. No horizontal mirror, no composites. Small figures occupy only60% of each square cell height,15% gutters around all weapons. Constant scale, consistent feet baseline. No text, grid, effects, ground shadow. Actual transparent background. Use approved reference for identity only; change view to REAR LEFT. Critical sword in RIGHT hand screen RIGHT unlike any left-handed pose.
```

### scenario

```text
Create true transparent 4x4 tactical RPG scenario idle sprite sheet of approved LIGHT INFANTRY male reference. Preserve face, dark pointed iron helmet, brown lamellar cuirass shoulders skirt, gray sleeves trousers black boots proportions. REMOVE SWORD and ALL SCABBARDS, no shield or weapon. Both hands EMPTY relaxed naturally beside body, no gripping invisible handles. Complete connected human figures, no separated parts. Four rows = directions: row1 northwest11 o'clock BACK facing LEFT away; row2 northeast2 o'clock BACK facing RIGHT away; row3 southeast5 o'clock FRONT facing RIGHT viewer; row4 southwest7 o'clock FRONT facing LEFT viewer. Each row four subtle breathing animation frames, planted feet, constant head body size and same baseline, no walking. Equal square cells, each body only60% cell height, at least15% transparent gutters all sides. Crisp restrained handpainted outlined game sprite matching approved model. NO ruler clothing, no horse, text, grid, ground shadows or effects. All16 figures same identity and scale.
```

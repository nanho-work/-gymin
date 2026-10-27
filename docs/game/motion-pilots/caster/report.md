# 책사 기본 모션 v2 — SW 공격 복귀 수정

현행 전투 경로: `web/public/images/class-motion-pilot/caster/job-24/combat-v2/` — 완전한64장, 225,384bytes. 기존60장 byte-identical 복사 + SW 공격4장 재제작. 시나리오는 기존 `scenario-v1/`16장 유지. 현재80프레임 합계 275,146bytes. 신규 검수/경량원본3개 72,664bytes. 이번 신규 폴더 전체 298,048bytes. v1은80장 모두 해시 불변 확인.

최우선 원인: v1 SW 공격의0번·3번 모두 팔이 펼쳐져 준비와 복귀가 부족했다. 기존 경량 sw-0-0 / sw-2-2를 view_image로 확인하고 내장 image_gen 참조로 전달,4프레임 전체를 한 시퀀스로 다시 그렸다. 부품 합성·반전 없음. 오른손 부채·7시 앞왼쪽 방향 유지.

수정: frame0 가슴앞 준비 → frame1 반쯤 뻗기 → frame2 전방 시전 → frame3 팔꿈치를 접고 가슴앞 회복. frame3과0의 외곽은 모두(46,38,112,150), 실루엣 IoU99.79%(v1 87.10%). 이는 정렬 보조수치이며 실제 재생 품질의 증명은 아니다. 원본과 수정본0/1/2/3/0을 함께 육안 확인해 가슴앞 복귀·연결된 팔·손·부채·잘림 없음을 확인했다.

PIL/numpy로 투명 간격 분리, 낮은 알파 정리, 네 장 공통 배율 0.21497121, 112px 준비 높이, 발 중심x80·하단y150 정렬.160px 품질78 투명WebP. 가장 넓은 시전 frame2 x5~126로 잘리지 않음.80장 크기·투명성·발기준 통과. 네 장에 개별 확대 없음.

검수 자료: `combat-v2/review-sw-attack-v1-v2.webp` 상단v1/하단v2, 열0·1·2·3·0. `review-sw-attack-loop.webp` 왼쪽v1/오른쪽v2, 정확히190ms×4=760ms 무한루프(기존 다중모션 검수파일의4.8초 끊김 없음). 파일 프레임수·루프 메타데이터 확인. 실제 브라우저 재생은 이전 로컬URL 정책 차단에 따라 미수행, 정적 시간순 검수만 완료.

다른 방향·동작 검토: 기존NW/NE/SE/SW 전체 시트 재확인. 대기 높이112~113px, 보행 NW108~109/NE112~114/SE114~115/SW112~114px. 관모의 방향별 원근·소매주름·부채 펼침 차이가 남아 있으며 일관성 완성으로 표시하지 않는다. 특히 NW 보행→대기 체고3~4px 차이와 전체 보행3→0 자락 전환은 실제 재생 검토 필요. SW 공격2→3은190ms 한 단계 회복이라 속도감 검수가 남는다. 이를 숨기려고 기존 다른 프레임을 반복하거나 관절 합성하지 않았다.

승급 보류. 공통UI·데이터·다른 담당 결과·커밋·푸시·배포 변경 없음. 기존v1 전체 유지. 이번 대형 생성PNG1장만 경량 원본과 결과 검수 후 정리.

## v2 프롬프트

```text
Use case identity-preserve. Create corrected FOUR FRAME fan attack animation of this exact male strategist. Image1 is idle identity/scale/clothes reference; image2 is extended attack pose reference. Render ONE ROW FOUR COLUMNS, equal square cells on transparent wide sheet. All face SOUTHWEST front LEFT 7 o'clock. Same youthful face, black scholar cap, navy robe cream cuffs, brown belt/pouch, black boots. Fan ALWAYS anatomical right hand on far screen-left arm; near left arm is empty. No mirroring. Entire connected character every frame, no body parts collage. Frame0: upright preparation matching image1, right elbow bent, fan held CLOSE TO CHEST vertically. Frame1: modest forward casting windup, right forearm extends halfway left at waist, torso leans slightly. Frame2: full forward release matching image2, fan extended LEFT, left palm outward. Frame3 IMPORTANT: RECOVER, torso upright, right elbow firmly BENT and tucked toward ribs, fan RETURNED CLOSE TO CHEST vertical, empty left hand LOWERED by waist, feet and head return almost exactly to frame0 position. Frame3 must NOT retain extended right arm. Loop3->0 should have minimal changes. All figures same body and head scale, planted boots same anchor, no camera drift. Fixed cap width across4 frames. Each whole figure fits middle65% cell with at least15% transparent margins. Crisp hand-painted outlined tactical RPG style matching references, no glow shadows text grid. Real alpha transparency.
```

---

# 이하 v1 제작 이력 (현행 상태는 위 v2 및 manifest 참조)

# 책사(job24) 기본 단계 모션 시각 초안

내장 image_gen 사용. 전투64장 + 빈손 시나리오16장. 사용자 승인/최종 애니메이션 완성 판정은 아님. 다른 병과·승급·무용수·쇠약·전투 판정·UI 연결·빌드·커밋·푸시·배포는 수행하지 않았다.

## 출력

- `web/public/images/class-motion-pilot/caster/job-24/combat-v1/{nw,ne,se,sw}-{0,1,2,3}-{0,1,2,3}.webp`
- `web/public/images/class-motion-pilot/caster/job-24/scenario-v1/{nw,ne,se,sw}-0-{0,1,2,3}.webp`
- 동일 폴더의 review-*.webp: 전투 방향별4장과 시나리오1장. 200px 셀에 실제160px 출력 배치, 투명 여백 확보.
- combat-v1/review-animation.webp: 행 NW/NE/SE/SW, 열 대기/이동/공격/스킬/시나리오. 전체20동작 비교용4.8초 루프. 40ms 샘플링으로 원래 ms에서 최대39ms 양자화, 앱용 원본 타이밍은 manifest 사용. 끝에서 일부 주기가 끊기므로 최종 모션 루프 검증 자료로 단독 사용하지 않는다.

프레임277,718bytes. 정적/재생 검수 자료848,184bytes. 총1,125,902bytes (문서 제외).

## 참고 이미지

- 승인 외형: web/public/images/job-models/se-v1/job-24.webp — view_image로 확인 후 모든 최초 생성의 이미지 참조로 전달.
- 스타일 육안 참고: web/public/images/playable/wang-geon/full-frame-v1/se-0-0.webp, scenario-standing-v2/se-0-0.webp, weakened-v1/se-0-0.webp. 왕건의 얼굴·복식은 생성 참조에 넣지 않았다.
- 책사: 수염 없는 젊은 남성, 검은 관모, 남색 도포·크림색 깃/소매, 갈색 허리띠·주머니, 오른손 부채. 시나리오는 빈손.

## 변환·검수

완성 연결 프레임을 생성했다. 신체 부품 합성·좌우반전 없음. PIL/numpy는 투명한 행/열 간격 검출·분리·알파20미만 정리·리사이즈·접지 정렬·WebP 저장에만 사용했다. 동일 전투 방향의16장 전체에 하나의 배율 적용. 대기 높이 중앙값112px, 발 중심x80/하단y150. 시나리오는 방향별4장에 고정 배율. 출력160×160 품질78.

80장 크기·RGBA·접지y150·경계 여백 검사 통과. 전체 외곽 범위 x8~156, y30~150; 일부 옷/부채의 옅은 가장자리 때문에 최소 우측여백4px. 결과 검수 시트는 별도200px 셀로 여백을 확대했다. 생성 원본의 셀 여백은 지시대로 일정하지 않아, 균등 칸 자르기 대신 실제 투명 간격을 찾아 온전한 인물을 분리했다.

최종5개 경량 시트의80프레임을 육안 확인: NW/NE는 등, SE/SW는 앞; 신체·손·부채 연결과 빈손 시나리오 확인. 뚜렷한 신체 절단·옆 셀 인물 혼입은 보이지 않았다. 밝은 배경 확대도 확인했다. 공격은 전방 낮은 부채 시전, 스킬은 높은 부채와 빈손 시전으로 구별한다. 큰 발광효과 없음.

재생 시 튐은 정적 시간순 비교까지만 수행. 실제 브라우저 연속 재생은 로컬 file URL 보안정책 차단으로 미완료. localhost 임시 서버도 샌드박스 바인딩 제한으로 시작하지 못했다. 우회하지 않았다. 통합 담당의 사이트 연결 후 재생 검수가 필요하다.

## 문제와 수정 / 남은 문제

1. 최초SW에 SE 방향이 섞여 이미지 도구로 왼쪽 전면을 다시 그렸다.
2. SE 하단 시전 부채가 윗행 가까이에 있어 이미지 도구로 전체 인물을 축소하고 여백을 늘렸다.
3. SW 대기/이동의 부채 손이 잘못되어 이미지 도구로 먼 오른손 부채·가까운 왼손 빈손을 수정했다.
4. 생성 시트의 실제 행 기준선이 불균등해 고정 셀 분할 시 발 잘림이 검출됐다. 기술 변환에서 투명 간격 기반 분리로 해결했다. 잘린 원화를 사용하지 않았다.
5. **남음:** SW 공격0/3도 부채를 앞으로 내민 상태라 준비→회복 구분이 약하고 3→0 또는 대기 전환이 급하다. 최종 승인 전 해당 공격 행 재제작 권장. 모든 동작을 완성으로 표시하지 않는다.
6. **남음:** 방향별 관모 폭·부채 펼침·옷자락 모양의 미세한 차이, 보행 발의 변형 및 공격 복귀 연결. 실제 재생/모바일 검수 미완료.

## 최종 프롬프트

### se 최초 생성

```text
Use case: stylized-concept. Create a transparent tactical RPG animation sprite sheet based on image 1, the approved male Korean strategist job24. Preserve his slim youthful clean-shaven face, tall plain black scholar cap, long dark navy robe with cream lapels and cuffs, brown sash and hanging brown pouch, dark boots, pale bamboo folding fan in his anatomical RIGHT hand. Do NOT copy the face or clothes of any other character. Crisp restrained outlined hand-painted small game sprites, complete connected anatomy in each cell, no separated parts.
Exactly 4 columns x 4 rows equal square cells on square canvas. Same direction throughout. Each entire figure including fan fits central 65% of cell, at least 15% transparent gutters. Fixed camera, consistent body/head size, identical ground baseline. No grid, labels, text, shadows, glow, particles, trails or effects. 
Row1 action0: four subtle breathing idle poses holding fan near chest, feet planted.
Row2 action1: four genuine sequential in-place walking phases with alternating feet, robe hem follows legs, no whole-picture translation.
Row3 action2 offensive fan casting: 0 draw fan toward chest preparing; 1 sweep right-hand fan forward at waist; 2 extend fan forward decisive release with slight torso lean; 3 recover toward chest. Low compact casting gesture.
Row4 action3 ceremonial skill casting: 0 gather focus with fan upright; 1 raise right-hand fan near head and left empty palm near chest; 2 hold high fan and extend left palm in a restrained invocation; 3 lower both hands recovering. Distinct from row3, no luminous effect.
All four frames preserve hand identity, clothing, proportions, connected neck shoulders wrists and fan grip. No new weapons or props.
Direction ALL sixteen cells: southeast SE 5 o'clock, FRONT three-quarter view facing screen RIGHT and toward viewer.
```

### sw 최초 생성

```text
Use case: stylized-concept. Create a transparent tactical RPG animation sprite sheet based on image 1, the approved male Korean strategist job24. Preserve his slim youthful clean-shaven face, tall plain black scholar cap, long dark navy robe with cream lapels and cuffs, brown sash and hanging brown pouch, dark boots, pale bamboo folding fan in his anatomical RIGHT hand. Do NOT copy the face or clothes of any other character. Crisp restrained outlined hand-painted small game sprites, complete connected anatomy in each cell, no separated parts.
Exactly 4 columns x 4 rows equal square cells on square canvas. Same direction throughout. Each entire figure including fan fits central 65% of cell, at least 15% transparent gutters. Fixed camera, consistent body/head size, identical ground baseline. No grid, labels, text, shadows, glow, particles, trails or effects. 
Row1 action0: four subtle breathing idle poses holding fan near chest, feet planted.
Row2 action1: four genuine sequential in-place walking phases with alternating feet, robe hem follows legs, no whole-picture translation.
Row3 action2 offensive fan casting: 0 draw fan toward chest preparing; 1 sweep right-hand fan forward at waist; 2 extend fan forward decisive release with slight torso lean; 3 recover toward chest. Low compact casting gesture.
Row4 action3 ceremonial skill casting: 0 gather focus with fan upright; 1 raise right-hand fan near head and left empty palm near chest; 2 hold high fan and extend left palm in a restrained invocation; 3 lower both hands recovering. Distinct from row3, no luminous effect.
All four frames preserve hand identity, clothing, proportions, connected neck shoulders wrists and fan grip. No new weapons or props.
Direction ALL sixteen cells: southwest SW 7 o'clock, FRONT three-quarter view facing screen LEFT and toward viewer. Draw the actual opposite view, do not mirror the character or swap the right-hand fan.
```

### nw 최초 생성

```text
Use case: stylized-concept. Create a transparent tactical RPG animation sprite sheet based on image 1, the approved male Korean strategist job24. Preserve his slim youthful clean-shaven face, tall plain black scholar cap, long dark navy robe with cream lapels and cuffs, brown sash and hanging brown pouch, dark boots, pale bamboo folding fan in his anatomical RIGHT hand. Do NOT copy the face or clothes of any other character. Crisp restrained outlined hand-painted small game sprites, complete connected anatomy in each cell, no separated parts.
Exactly 4 columns x 4 rows equal square cells on square canvas. Same direction throughout. Each entire figure including fan fits central 65% of cell, at least 15% transparent gutters. Fixed camera, consistent body/head size, identical ground baseline. No grid, labels, text, shadows, glow, particles, trails or effects. 
Row1 action0: four subtle breathing idle poses holding fan near chest, feet planted.
Row2 action1: four genuine sequential in-place walking phases with alternating feet, robe hem follows legs, no whole-picture translation.
Row3 action2 offensive fan casting: 0 draw fan toward chest preparing; 1 sweep right-hand fan forward at waist; 2 extend fan forward decisive release with slight torso lean; 3 recover toward chest. Low compact casting gesture.
Row4 action3 ceremonial skill casting: 0 gather focus with fan upright; 1 raise right-hand fan near head and left empty palm near chest; 2 hold high fan and extend left palm in a restrained invocation; 3 lower both hands recovering. Distinct from row3, no luminous effect.
All four frames preserve hand identity, clothing, proportions, connected neck shoulders wrists and fan grip. No new weapons or props.
MOST IMPORTANT Direction ALL sixteen cells: northwest NW 11 o'clock, BACK three-quarter view facing screen LEFT and AWAY from viewer. Show back of black cap, back of head and robe, no frontal face/chest. Right weapon arm is nearest viewer in this back-left view. Fan projects upper-left during attack. Clear 15% empty cell margins: draw figures small.
```

### ne 최초 생성

```text
Use case: stylized-concept. Create a transparent tactical RPG animation sprite sheet based on image 1, the approved male Korean strategist job24. Preserve his slim youthful clean-shaven face, tall plain black scholar cap, long dark navy robe with cream lapels and cuffs, brown sash and hanging brown pouch, dark boots, pale bamboo folding fan in his anatomical RIGHT hand. Do NOT copy the face or clothes of any other character. Crisp restrained outlined hand-painted small game sprites, complete connected anatomy in each cell, no separated parts.
Exactly 4 columns x 4 rows equal square cells on square canvas. Same direction throughout. Each entire figure including fan fits central 65% of cell, at least 15% transparent gutters. Fixed camera, consistent body/head size, identical ground baseline. No grid, labels, text, shadows, glow, particles, trails or effects. 
Row1 action0: four subtle breathing idle poses holding fan near chest, feet planted.
Row2 action1: four genuine sequential in-place walking phases with alternating feet, robe hem follows legs, no whole-picture translation.
Row3 action2 offensive fan casting: 0 draw fan toward chest preparing; 1 sweep right-hand fan forward at waist; 2 extend fan forward decisive release with slight torso lean; 3 recover toward chest. Low compact casting gesture.
Row4 action3 ceremonial skill casting: 0 gather focus with fan upright; 1 raise right-hand fan near head and left empty palm near chest; 2 hold high fan and extend left palm in a restrained invocation; 3 lower both hands recovering. Distinct from row3, no luminous effect.
All four frames preserve hand identity, clothing, proportions, connected neck shoulders wrists and fan grip. No new weapons or props.
MOST IMPORTANT Direction ALL sixteen cells: northeast NE 2 o'clock, BACK three-quarter view facing screen RIGHT and AWAY from viewer. Show back of black cap, back of head and robe, no frontal face/chest. Right weapon arm is farther from viewer in this back-right view; left arm is nearest. Fan projects upper-right during attack. Clear 15% empty cell margins: figures only 60% cell height, feet at 80% cell height.
```

### se 수정 (최종본에 적용)

```text
Edit this 4x4 animation sprite sheet for layout ONLY. Preserve all 16 characters and poses, same exact face clothing fan hand and southeast FRONT RIGHT direction. Each figure MUST be much SMALLER within its own equal square cell: only 60% cell height and at most 65% width INCLUDING raised fan. Align feet at 80% cell height. At least 15% transparent margin on ALL FOUR SIDES of EVERY CELL. The raised fan in bottom row column3 currently touches the cell above: completely separate them with wide transparent gutters. No body part cutoffs. Same body scale in all sixteen cells; do not individually enlarge any action. No text, lines, glow, backdrop. True transparent background. Preserve complete connected bodies.
```

### sw 수정 (최종본에 적용)

```text
Edit the attached 4x4 strategist animation sheet. CRITICAL ALL SIXTEEN characters must face LEFT toward southwest, 7 o'clock, FRONT LEFT three-quarter view. Currently most face RIGHT: redraw their whole body, head, nose, feet and gaze to LEFT. NOT a mirrored image: preserve fan in anatomical RIGHT hand, which is the FAR arm in this front-left view; left arm is nearest viewer. Preserve exact male clean-shaven identity, black tall cap, navy cream-edged robe, sash, pouch and fan. Four rows remain idle/walk/low forward fan casting/high fan ritual casting, four sequential frames each. Draw each figure SMALLER, central 65% of square cell, 15% clear gutters on every side. TRUE transparency. Entire connected character, no composited parts, no glow or text. Nose and toes MUST point screen LEFT in every cell. No front-right faces.
```

### swHand 수정 (최종본에 적용)

```text
Correct weapon hand consistency in this front-LEFT southwest strategist sheet. Keep all 16 poses facing LEFT, black cap navy robe identity. In idle row1 and walking row2 and bottom row frame0/frame3, the near left hand incorrectly holds the fan. Put the fan into the FAR anatomical RIGHT HAND (on LEFT side of picture, far sleeve) consistently in EVERY frame, including high ritual casts. The NEAR anatomical LEFT hand on screen RIGHT is empty relaxed or gesturing. Match attack row3 which correctly extends the far right arm LEFT. Do NOT mirror bodies or change direction. Shrink all sixteen figures uniformly to 60% equal cell height, feet at80% cell height, at least15% transparent gutter. 4 rows x4 columns remain idle/walk/forward fan attack/high fan ritual. Complete connected body per cell, true transparency, no effects, no text.
```

## 원본 정리

경량본·5개 결과 시트 검수 후 이번 생성 PNG8장만 삭제. 승인 외형·왕건 참고·다른 담당 결과는 수정/삭제하지 않았다. 프롬프트, 경량본, 변환 스크립트, 각 프레임 SHA256을 보존한다. UI 연결은 통합 담당 범위.

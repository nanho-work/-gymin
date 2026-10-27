# 노병 모션 제작·검수 기록

2026-10-27. jobId7, baseJobId6, stage1. **전투64장+시나리오16장 시각 초안 제작 및 정적 검수 완료. 실제 사이트 연속 재생·최종 사용자 승인은 미완료.**

## 승인 기준과 산출물

- 승인 모델: `web/public/images/job-models/promotion-se-v1/job-7.webp`. 데이터: `web/src/features/game-world/data/promotion-models.json`. 대표 무기 **쇠뿔겹활**. 병과 이름으로 석궁을 추정하지 않고 승인된 활을 사용했다.
- 포즈 참고: 기본 궁병 `job-6/combat-v2/contact-nw/ne/se/sw.webp`. 승인 모델과 포즈 시트를 view_image로 확인하고 내장 image_gen에 각 역할을 명시했다.
- 전투: `web/public/images/class-motion-pilot/archer/job-7/combat-v1` —64장,310,152bytes.
- 시나리오: `web/public/images/class-motion-pilot/archer/job-7/scenario-v1` —16장,61,860bytes.
- 프레임 합계 372,012bytes. 검수 시트5장·애니메이션5개 포함 684,254bytes.
- 파일명 `{direction}-{action}-{frame}.webp`. NW11시 등/왼쪽,NE2시 등/오른쪽,SE5시 앞/오른쪽,SW7시 앞/왼쪽. 전투action0대기/1이동/2공격/3스킬,시나리오action0. frame0~3.
- 160×160 투명 WebP 품질78. 발y150,중심x80,대기 몸체약112px. 방향별 대기 높이 중앙값으로 결정한 배율을 모든 해당 동작에 동일 적용. 시나리오는16장 공통 배율. 프레임마다 따로 확대하지 않았다.
- 대기320/이동170/공격190/스킬240/시나리오360ms. 각 모드 폴더는 독립적으로 연결 가능한 완전한 세트다.

## 기술 처리와 검수

Pillow/NumPy로 알파24이하 경계 노이즈 정리, 원화의 빈 투명 띠에서 행 분리,셀 크롭,동일배율 축소,발 정렬,WebP 저장을 수행했다. 머리·몸·팔·무기는 분리 합성하지 않았으며 좌우반전하지 않았다. 경계에 닿는 원화는 검출한다. 공격·스킬의frame3은 같은 방향 대기frame0의 완전한 이미지를 재사용한다. 대기·시나리오frame3도frame0과 같아3→0 호흡 복귀를 고정했다. 걷기는 네 자세를 모두 사용하며3→0 연결을 시간순 비교했다.

- 80/80 크기·RGBA·알파0/255·캔버스 경계·발y150 검사 통과.
- 5개 결과 비교표의 전체80프레임과 생성 원화를 육안 확인. 방향,신체 연결,왼손 활/오른손 당김,활 중복,시나리오 빈손,인접 셀 혼입을 확인했다.
- 공격·스킬 마지막→대기8개,대기·시나리오3→0 8개는 바이트 동일 검사 통과.
- 애니메이션5개×4프레임 디코딩과 프레임시간 검사 통과. 정적 시간순 비교를 실제 연속 재생 육안 검사로 기록하지 않는다. 이전 브라우저 도구에서 file URL이 차단된 제약을 우회하지 않았다.
- `contact-방향.webp`: 행 대기/이동/공격/스킬,열frame0~3. 시나리오 비교표 행NW/NE/SE/SW. `review-action-번호.webp`: 네 방향을 한 줄에 배치한 해당 속도 애니메이션.

## 문제와 수정

- 기본v2의 수정된 NE/SW 팔 연결을 참조해 승급 복식만 적용했다.
- NW 전체16프레임의 붉은 활 술을 image_gen으로 복원한 뒤 재검수했다.

## 남은 한계

- 완성 프레임 시각 초안으로 사용자 최종 승인 및 실제 게임 동작 재현 완료가 아니다.
- 실제 사이트 연속 재생 및 모바일 실기기 검수 미진행. 정적 시간순 비교와 WebP 디코딩/시간 검사를 구분한다.
- 머리카락·자락·활 곡률·장식의 미세한 프레임 변화가 남는다. 동일 손·대표 무기·복식 세트의 큰 형태를 검수했으며 픽셀 단위 동일성은 보장하지 않는다.
- 4프레임의 release(2)→recover(3) 자세 변화는 크다. recover→idle/prepare 연결을 검사했으며 보간 프레임을 추가한 것은 아니다.
- SW 공격은 대기보다 측면으로 상체가 회전한다. NE/SW 스킬은 빈 오른손 명령, NW/SE는 활을 드는 시각 동작이며 실제 스킬 판정과 무관하다.
- 사이트 UI/공통 데이터/전투 판정/수치/빌드는 수정하지 않았다. 포차·쇠약·다른 병과는 범위 밖이다.

구체적으로 확인된 잘못된 방향·손 교체·잘린 최종 프레임은 현재 없다. 최종 게임용 품질 보증과 구분한다. 기본 단계 manifest와 기존 이미지·공통UI·데이터·다른 담당 파일은 수정하지 않았다. 커밋·푸시·배포하지 않았다.

## 생성 프롬프트

내장 image_gen 사용. 아래 생성·수정 프롬프트와 경량 결과를 보존한다. 대형 원본은 경량본 검수 뒤 이번 단계에서 생성한 6장(7,038,689bytes)만 정리 완료했다.

### ne

```text
Use case: identity-preserve. Produce a transparent 4 columns x4 rows tactical RPG animation sprite sheet. Image1 is APPROVED PROMOTION COSTUME AND IDENTITY; image2 is POSE/ANATOMY reference only. Redraw every whole connected character from image2 wearing image1's exact fixed promoted set. Preserve youthful face/gender/slim build and black tied ponytail. JOB7: dark reinforced brown leather vest, OFF-WHITE sleeves, dark navy split coat with cream edges and small metal/gold edging, red sash and narrow red cloth ties at waist and hair, dark long boots with red bands. Bow is the approved dark red-brown recurved horn composite bow with red binding and short red tassel; one bow, back quiver. No crossbow, no sword, no horse. Do not keep base olive sleeves. Same restrained crisp painted sprite style.
Keep the 16 exact body poses and handedness of pose reference. Four rows idle/walk/attack/skill; four columns consecutive frames. LEFT hand always bow, RIGHT hand string or empty. Attack nock/draw/release/recover, arrow absent after release. Idle subtle breath, walk alternating legs, skill visual command. Final attack and skill frame matches first idle.
Generous transparent gutters at least15% per cell; full figure including bow only65% cell height, centered consistent foot anchor. Constant body/head scale ALL frames; no detached parts or adjacent-cell overlap. True transparent background (REMOVE gray reference backdrop), no text grid shadow effect.
ALL face NORTHEAST2 o'clock, BACK upper-right. CRITICAL preserve reference far LEFT bow arm and near RIGHT arm bent LOW at elbow when drawing. At rest bow on far screen-left, near right hand EMPTY. Never mirror.
```

### sw

```text
Use case: identity-preserve. Produce a transparent 4 columns x4 rows tactical RPG animation sprite sheet. Image1 is APPROVED PROMOTION COSTUME AND IDENTITY; image2 is POSE/ANATOMY reference only. Redraw every whole connected character from image2 wearing image1's exact fixed promoted set. Preserve youthful face/gender/slim build and black tied ponytail. JOB7: dark reinforced brown leather vest, OFF-WHITE sleeves, dark navy split coat with cream edges and small metal/gold edging, red sash and narrow red cloth ties at waist and hair, dark long boots with red bands. Bow is the approved dark red-brown recurved horn composite bow with red binding and short red tassel; one bow, back quiver. No crossbow, no sword, no horse. Do not keep base olive sleeves. Same restrained crisp painted sprite style.
Keep the 16 exact body poses and handedness of pose reference. Four rows idle/walk/attack/skill; four columns consecutive frames. LEFT hand always bow, RIGHT hand string or empty. Attack nock/draw/release/recover, arrow absent after release. Idle subtle breath, walk alternating legs, skill visual command. Final attack and skill frame matches first idle.
Generous transparent gutters at least15% per cell; full figure including bow only65% cell height, centered consistent foot anchor. Constant body/head scale ALL frames; no detached parts or adjacent-cell overlap. True transparent background (REMOVE gray reference backdrop), no text grid shadow effect.
ALL face SOUTHWEST7 o'clock FRONT lower-left. Preserve reference LEFT arm crossing IN FRONT OF CHEST from near screen-right shoulder to bow at screen-left; far RIGHT hand draws near cheek, elbow obscured. At rest bow left hand screen-right, right empty. Never mirror.
```

### se

```text
Use case: identity-preserve. Produce a transparent 4 columns x4 rows tactical RPG animation sprite sheet. Image1 is APPROVED PROMOTION COSTUME AND IDENTITY; image2 is POSE/ANATOMY reference only. Redraw every whole connected character from image2 wearing image1's exact fixed promoted set. Preserve youthful face/gender/slim build and black tied ponytail. JOB7: dark reinforced brown leather vest, OFF-WHITE sleeves, dark navy split coat with cream edges and small metal/gold edging, red sash and narrow red cloth ties at waist and hair, dark long boots with red bands. Bow is the approved dark red-brown recurved horn composite bow with red binding and short red tassel; one bow, back quiver. No crossbow, no sword, no horse. Do not keep base olive sleeves. Same restrained crisp painted sprite style.
Keep the 16 exact body poses and handedness of pose reference. Four rows idle/walk/attack/skill; four columns consecutive frames. LEFT hand always bow, RIGHT hand string or empty. Attack nock/draw/release/recover, arrow absent after release. Idle subtle breath, walk alternating legs, skill visual command. Final attack and skill frame matches first idle.
Generous transparent gutters at least15% per cell; full figure including bow only65% cell height, centered consistent foot anchor. Constant body/head scale ALL frames; no detached parts or adjacent-cell overlap. True transparent background (REMOVE gray reference backdrop), no text grid shadow effect.
ALL face SOUTHEAST5 o'clock FRONT lower-right. Preserve anatomical LEFT bow arm on screen-right, RIGHT draw arm bent on screen-left.
```

### scenario

```text
Use case: identity-preserve. Transparent tactical RPG 4x4 scenario standing sprite sheet of approved JOB7 archer promotion reference. Same youthful face gender slim body black ponytail and red hair tie/headband, dark brown reinforced leather vest, OFF-WHITE sleeves, navy cream-edged long split coat with small metallic edging, red sash and waist ties, dark boots red bands. REMOVE ALL weapons, bow, arrows, quiver, weapon harness, scabbard. Both hands EMPTY and relaxed naturally, complete connected body. Rows are directions: row1 NORTHWEST11 o'clock BACK upper-left; row2 NORTHEAST2 o'clock BACK upper-right; row3 SOUTHEAST5 o'clock FRONT lower-right; row4 SOUTHWEST7 o'clock FRONT lower-left. Four columns subtle breathing cycle with feet planted, column3 returns to column0 posture. No walking. Constant body/head size and same ground baseline all16. Entire figure occupies middle60% each equal cell,15% transparent margins all sides. Crisp restrained painted sprite matching reference. No text grid effects shadows, true transparent background.
```

### nwOrnament

```text
Edit only weapon ornament continuity of this NW4x4 promotion archer sheet. This is JOB7 red-brown horn composite bow with red binding and a SHORT RED TASSEL. Add/restore that small red tassel attached beneath bow grip in ALL16 figures, especially raised attack row3 and skill row4. No jade or blue; those belong to a different promotion. Keep exact pose, LEFT bow hand, right draw hand, NW back direction, head, clothing and all body sizes. No second weapon, no effect, no text. True transparent background with existing layout.
```

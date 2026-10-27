# 연노병 모션 제작·검수 기록

2026-10-27. jobId8, baseJobId6, stage2. **전투64장+시나리오16장 시각 초안 제작 및 정적 검수 완료. 실제 사이트 연속 재생·최종 사용자 승인은 미완료.**

## 승인 기준과 산출물

- 승인 모델: `web/public/images/job-models/promotion-se-v1/job-8.webp`. 데이터: `web/src/features/game-world/data/promotion-models.json`. 대표 무기 **힘줄각궁**. 병과 이름으로 석궁을 추정하지 않고 승인된 활을 사용했다.
- 포즈 참고: 기본 궁병 `job-6/combat-v2/contact-nw/ne/se/sw.webp`. 승인 모델과 포즈 시트를 view_image로 확인하고 내장 image_gen에 각 역할을 명시했다.
- 전투: `web/public/images/class-motion-pilot/archer/job-8/combat-v1` —64장,318,926bytes.
- 시나리오: `web/public/images/class-motion-pilot/archer/job-8/scenario-v1` —16장,64,176bytes.
- 프레임 합계 383,102bytes. 검수 시트5장·애니메이션5개 포함 710,206bytes.
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

- SW 최초 생성에서 이동·공격 행과 관모가 누락되어 채택하지 않았다. 검수된 노병 SW 시트의 전체 자세를 유지하며 승인 연노병 복식·관모·활로 재생성했다.
- NE 공격0~2 및 NW/SE 공격·스킬0~2의 옥 장식과 푸른 술 누락을 image_gen 편집으로 복원했다.
- 시나리오 원화의 첫 행은NE,둘째 행은NW였으므로 실제 방향으로 파일명을 배정했다. 이미지 좌우반전 없음.
- NW 원화 action3-frame3의 발끝 경계 접촉을 검사에서 발견했다. 그 칸은 분리 대상에서 제외하고 같은 방향의 완전한 대기0 전체 프레임을 사용했다. 최종 nw-3-3.webp는 nw-0-0.webp와 바이트 동일하다.

## 남은 한계

- 완성 프레임 시각 초안으로 사용자 최종 승인 및 실제 게임 동작 재현 완료가 아니다.
- 실제 사이트 연속 재생 및 모바일 실기기 검수 미진행. 정적 시간순 비교와 WebP 디코딩/시간 검사를 구분한다.
- 머리카락·자락·활 곡률·장식의 미세한 프레임 변화가 남는다. 동일 손·대표 무기·복식 세트의 큰 형태를 검수했으며 픽셀 단위 동일성은 보장하지 않는다.
- 4프레임의 release(2)→recover(3) 자세 변화는 크다. recover→idle/prepare 연결을 검사했으며 보간 프레임을 추가한 것은 아니다.
- SW 공격은 대기보다 측면으로 상체가 회전한다. NE/SW 스킬은 빈 오른손 명령, NW/SE는 활을 드는 시각 동작이며 실제 스킬 판정과 무관하다.
- 사이트 UI/공통 데이터/전투 판정/수치/빌드는 수정하지 않았다. 포차·쇠약·다른 병과는 범위 밖이다.

구체적으로 확인된 잘못된 방향·손 교체·잘린 최종 프레임은 현재 없다. 최종 게임용 품질 보증과 구분한다. 기본 단계 manifest와 기존 이미지·공통UI·데이터·다른 담당 파일은 수정하지 않았다. 커밋·푸시·배포하지 않았다.

## 생성 프롬프트

내장 image_gen 사용. 아래 생성·수정 프롬프트와 경량 결과를 보존한다. 대형 원본은 경량본 검수 뒤 이번 단계에서 생성한 9장(10,931,027bytes)만 정리 완료했다.

### sw

```text
undefined
ALL face SOUTHWEST7 o'clock FRONT lower-left. Preserve near LEFT arm crossing IN FRONT of chest from screen-right shoulder to bow at screen-left, far RIGHT hand at cheek and far bent elbow partly hidden. At rest left hand screen-right bow, right empty. Skill raises empty right palm while left holds bow low. Never mirror.
```

### nw

```text
Use case: identity-preserve. Transparent 4 columns x4 rows tactical RPG animation sheet. Image1 is APPROVED JOB8 FINAL PROMOTION COSTUME and character identity; image2 POSE/ANATOMY only. Redraw every whole connected pose wearing exact image1 fixed set: same youthful face and slim body, black ponytail; GOLD/BRONZE metal brow circlet with small raised central crown around ponytail base; olive-green and bronze reinforced lamellar armor with GOLD edged shoulder guards, ivory sleeve cuffs, long olive-green gold-trimmed coat panels over ivory/navy inner layers, red belt cords, dark reinforced boots. This is a substantially more armored final rank than leather job7. Approved ornate brown-gold recurved sinew horn bow with jade-green ornament and short DARK BLUE tassel. Back quiver. No crossbow, sword, horse. Do NOT keep base brown vest or bare green cloth shoulders.
Keep exactly image2's sixteen connected body poses, same body/head scale and handedness. Rows idle/walk/attack/skill. Columns four time frames. LEFT hand always holds ONE bow, RIGHT draws string or empty. Attack nock/draw/release/recover; release has no arrow. Final attack/skill matches first idle. Walk alternating feet, not whole-image sliding. Complete body no parts. Wide transparent gutters15% per cell, figure including bow max65% cell height. Identical foot baseline and body size all16. True transparent (remove gray background), no text grid floor shadow glow.
ALL face NORTHWEST11 o'clock BACK upper-left. Anatomical LEFT arm holds bow at screen-left, RIGHT arm draws at screen-right; preserve all pose-reference geometry.
```

### se

```text
Use case: identity-preserve. Transparent 4 columns x4 rows tactical RPG animation sheet. Image1 is APPROVED JOB8 FINAL PROMOTION COSTUME and character identity; image2 POSE/ANATOMY only. Redraw every whole connected pose wearing exact image1 fixed set: same youthful face and slim body, black ponytail; GOLD/BRONZE metal brow circlet with small raised central crown around ponytail base; olive-green and bronze reinforced lamellar armor with GOLD edged shoulder guards, ivory sleeve cuffs, long olive-green gold-trimmed coat panels over ivory/navy inner layers, red belt cords, dark reinforced boots. This is a substantially more armored final rank than leather job7. Approved ornate brown-gold recurved sinew horn bow with jade-green ornament and short DARK BLUE tassel. Back quiver. No crossbow, sword, horse. Do NOT keep base brown vest or bare green cloth shoulders.
Keep exactly image2's sixteen connected body poses, same body/head scale and handedness. Rows idle/walk/attack/skill. Columns four time frames. LEFT hand always holds ONE bow, RIGHT draws string or empty. Attack nock/draw/release/recover; release has no arrow. Final attack/skill matches first idle. Walk alternating feet, not whole-image sliding. Complete body no parts. Wide transparent gutters15% per cell, figure including bow max65% cell height. Identical foot baseline and body size all16. True transparent (remove gray background), no text grid floor shadow glow.
ALL face SOUTHEAST5 o'clock FRONT lower-right. Anatomical LEFT arm holds bow at screen-right, RIGHT arm draws at screen-left. Preserve exact pose-reference geometry.
```

### scenario

```text
Use case: identity-preserve. Transparent 4x4 scenario idle sprite sheet of approved JOB8 final promotion archer. Same slim youthful face/gender black ponytail. GOLD/BRONZE brow circlet with small raised metal central crown; OLIVE-GREEN reinforced lamellar armor and gold/bronze shoulder guards, ivory sleeve cuffs and underskirt, green long coat panels with GOLD edges, red belt cords, dark reinforced boots. Match approved identity and complete costume. NO WEAPONS, no bow, arrows, quiver, weapon harness, scabbards. Both hands EMPTY naturally beside body. Four rows: NW11 BACK upper-left, NE2 BACK upper-right, SE5 FRONT lower-right, SW7 FRONT lower-left. Four columns breathing idle, feet planted, last returns to first. Constant human body/head size and foot baseline all16. Full connected figures only60% each cell height with15% clear transparent margins all sides. No grid text shadows effects. True transparent.
```

### seOrnament

```text
Edit ONLY bow ornament continuity in this 4x4 sprite sheet. Every bow in ALL sixteen cells must retain the SAME approved ornate golden-brown horn bow with small JADE GREEN bead and short DARK BLUE tassel. In rows3 and4 columns1,2,3 the raised bows lost that ornament; ADD jade and blue tassel hanging just below the handgrip, attached to bow, following gravity. Match the idle bow decoration, no enlargement. Keep all poses, exactly same arms/hands, crown armor clothes directions sizes, 4x4 layout and transparency unchanged. Do not add another bow, projectile, effects, text, floor, or move any figure. Whole characters remain connected.
```

### neOrnament

```text
Edit ONLY bow decoration continuity. In this back-facing NE 4x4 archer sheet, every raised bow in row3 columns1,2,3 needs the SAME small jade-green bead and short dark-blue tassel attached to bow below handgrip as the idle bow. Add them without changing any body or hand anatomy. LEFT far arm remains holding bow upper-right, RIGHT near low-bent arm draws/releases. Preserve all sixteen poses, armor and crown, full connected bodies, exact layout and sizes, transparent background. No extra bow, no effects or labels. Do not change any other cell.
```

### nwOrnament

```text
Edit only BOW ORNAMENTS in this 4x4 NW archer sheet. Rows3 and4 columns1,2,3 raised bows must retain the SAME golden-brown ornate bow and a small JADE GREEN bead with short DARK BLUE tassel attached BELOW GRIP. Currently these decorations disappear during attack/skill. Add them clearly but modestly, same size as idle. Preserve every single pose, LEFT bow hand and RIGHT draw hand, back upper-left direction, costume crown body sizes, transparency and grid layout. No extra bow, effects or text.
```

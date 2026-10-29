# 궁기병·포차 남은 모션 제작 결과

2026-10-28 시작, 2026-10-29 갱신. **6단계 528장 제작 및 정적 검수. 실제 사이트 연결·연속 재생·최종 사용자 승인은 별도.**

## 산출물

| ID | 병과 | 전투 | 시나리오 | 탑승 쇠약 | 프레임 bytes | 검수 파일 포함 bytes |
|---|---|---:|---:|---:|---:|---:|
|12|궁기병|64|16|16|522,124|947,142|
|13|노기병|64|16|16|573,122|1,059,772|
|14|연노기병|64|16|16|585,262|1,091,162|
|15|경포차|64|16|0|521,660|1,002,806|
|16|중포차|64|16|0|527,704|1,036,562|
|17|벽력차|64|16|0|530,678|1,032,230|

프레임 합계 **3,260,550bytes**, 비교표·애니메이션 포함 **6,169,674bytes**. 모든 프레임은 160×160 투명 WebP 품질78.

실제 루트는 `web/public/images/class-motion-pilot/archer/job-{12..17}/combat-v1`, `scenario-v1`, 기병12~14만 `weakened-v1`. 각 mode는 독립된 완전한 세트다. 파일명 `{nw|ne|se|sw}-{action}-{frame}.webp`; 전투 action0대기/1이동/2공격/3스킬, 다른 모드는action0. frame0~3. publicPath와 개별 파일 SHA256은 manifest에 기록했다.

## 조사·재사용

AGENTS.md, character-art-workflow.md 최신2026-10-26 규칙, 기존 archer manifest/report, job-models.json·promotion-models.json을 확인했다. 12~17은 승인 SE 정지 모델만 존재하고 모션 폴더는 없었다. 기존 모션 재사용0장/신규528장. 기존 궁병6·7·8 자산과 문서는 보존했다.

승급별 얼굴·복식·대표 기구·말을 고정 세트로 제작했다. 기병은 말+기수 전체를 함께 생성했고, 시나리오는 무기·화살통·말 없이 빈손 서기, 쇠약은 탑승 상태로만 제작했다. 포차 승인 모델은 사람+장치이며 기병 규칙을 적용하지 않았다. 포차 시나리오는 장치 없이 빈손 조작병이다.

## 제작·검사

- 내장 image_gen 사용. 승인 모델을 identity, 검수된 기본형을 pose 참고로 구분했다. 아래 생성 로그에 실제 프롬프트와 채택/수정 원본 경로를 남겼다.
- Pillow/NumPy는 알파 경계 노이즈24이하 정리, 투명 띠에서 전체 셀 분리, 축소와 정렬, WebP 변환에만 사용했다. 신체·기구 부품을 잘라 합성하지 않았고 좌우반전하지 않았다.
- 방향별 한 배율을 전투16장에 공통 적용했다. 시나리오·쇠약은 각16장 공통 배율. 중심x80·기본접지y150. 장식이 낮은 벽력차 SE 준비 프레임은 바퀴 기준 정렬 offset을 manifest에 명시했다.
- 528장 크기/RGBA/투명도/캔버스 경계/기록 SHA256 검사를 통과했다. 셀 잘림·투명 간격 없음·잘못된 방향·불투명 배경은 수정 후 재검사했다.
- 모든 방향×동작의4프레임은 디코딩 픽셀 해시가 서로 다르다. 정지 이미지를 복사하거나 평행이동해 파일 수를 채우지 않았다. 해시 차이는 자연스러운 모션 품질을 보증하지 않는다.
- 33개 동작별 animated WebP, 각4프레임 디코딩·시간 검사. 대기320/이동170/공격190/스킬240/시나리오360/쇠약300ms.
- 생성 원화와 최종 contact 비교표33장의 모든 프레임을 정적으로 검토했다. 접지·방향·전체 신체 연결·말 발 변화·궁수 손·포차 장치 형태와 빈손 시나리오를 확인했다.

## 수정과 한계

- 궁기병 SW 발사 방향을 말과 같은 왼쪽으로 수정했다. 시나리오 일부 원화의 NW/NE 행이 바뀌어 실제 방향 기준으로 파일명을 배정했다.
- 경포차 SW 방향 오류, 중포차 시나리오 NW 중복 방향, 벽력차 작동 중 숟가락형 받침이 주머니로 바뀐 오류를 image_gen으로 수정했다. 가장자리 잘림과 행·열 겹침은 여백 확대 재생성으로 해결했다.
- 원본을 모사한 게임 동작·전투 판정 구현이 아닌 시각 모션 초안이다. 실제 사이트 연결과 실시간 연속 재생·모바일 실기기 검수는 수행하지 않았다. 공통 UI 연결은 총괄 담당이며 이 채팅에서 연결 완료로 표시하지 않는다.
- 작은 장식·갑옷 선·활 곡률·차체 원근은 프레임 간 미세하게 달라진다. 특히 활 장식의 일관성, 포차 발걸음·바퀴 회전·투척기 역학·발사체 분리는 추가 다듬기 대상이다. 기구 각도 변화가 실제 기계 시뮬레이션의 정확성을 뜻하지 않는다.
- 공격·스킬 복귀와3→0 루프는 새로 그린 프레임을 그대로 사용한다. 정확한 픽셀 동일 복귀나 보간 프레임을 추가하지 않았다.
- 실제 브라우저 연속 재생 대신 정적 시간순 검토와 디코딩 검사를 했음을 구분한다. 최종 사용자 승인 전이다.
- 공통 motion-pilots.json·컴포넌트·world.json·README를 수정하지 않았고 커밋·푸시·배포하지 않았다.

## 재생성 프롬프트

사용 도구: built-in image_gen. 원본 파일은 이번 생성 로그의 정확한 경로만 경량본 검수 후 정리하며 다른 채팅 파일은 건드리지 않는다.

### job12 se

```text
Use case: identity-preserve. Create a transparent 4 columns x4 rows game animation sprite sheet. Reference is approved basic mounted archer JOB12; preserve same youthful face, dark ponytail red tie, dark burgundy tunic leather armor pale cuffs, brown boots, simple wooden recurved bow, quiver and chestnut horse black mane simple brown saddle. Whole rider AND horse connected in every cell, exactly one rider and one horse. ALL sixteen face SOUTHEAST lower right 5 o'clock, matching reference. Row1 four distinct breathing idle poses, row2 four real horse walking phases with alternating lifted fore/hind hooves and rider following saddle (not rigid translations); row3 nock arrow, draw string to cheek, release, lower bow recovery; row4 prepare, raise bow signal, lower signaling hand, recover. Anatomical LEFT hand holds bow, RIGHT draws string. Keep hands attached, proper saddle legs. Same horse body and human head sizes in all16. Exactly16 evenly spaced cells; complete figures only65% of each cell width/height, large transparent gutters at all cell boundaries, no cropping even bow. No shadow floor labels grid effects or extra objects. Genuine alpha transparency. Crisp restrained pixel-art tactical RPG style of reference. Last pose of attack/skill returns to idle. Never mirror handedness.
```

### job12 seFix

```text
Edit this sprite sheet to fix framing ONLY. Redraw all sixteen complete horse+rider sprites smaller, each 70% of current size INSIDE its own equally sized grid cell. Add very wide EMPTY transparent margins on all four sides of EACH cell. Especially restore fully visible horse noses and ears in the rightmost column, currently cut off by outer canvas. Every cell must have minimum40px clear space around all extremities. Keep exact same 4x4 arrangement, costumes, horse, bow handedness, motion poses and front-right SE direction. Complete rider+horse together, no detached pieces. Do not add border text background or shadow. Genuine transparent background. Render square 1536x1536 if possible.
```

### job12 nw

```text
Use case: identity-preserve. Create a transparent 4 columns x4 rows game animation sprite sheet. Reference is approved basic mounted archer JOB12; preserve same youthful face, dark ponytail red tie, dark burgundy tunic leather armor pale cuffs, brown boots, simple wooden recurved bow, quiver and chestnut horse black mane simple brown saddle. Whole rider AND horse connected in every cell, exactly one rider and one horse. ALL sixteen face NORTHWEST upper-left 11 o'clock: horse head toward upper left, horse hindquarters toward viewer lower right; rider BACK, back of head, quiver and back armor visible. Never front-facing. Anatomical LEFT bow hand is near-side, RIGHT draw hand far-side. Row1 four distinct breathing idle poses, row2 four real horse walking phases with alternating lifted fore/hind hooves and rider following saddle (not rigid translations); row3 nock arrow, draw string to cheek, release, lower bow recovery; row4 prepare, raise bow signal, lower signaling hand, recover. Anatomical LEFT hand holds bow, RIGHT draws string. Keep hands attached, proper saddle legs. Same horse body and human head sizes in all16. Exactly16 evenly spaced cells; complete figures only50% of each cell width/height, large transparent gutters at all cell boundaries, no cropping even bow. No shadow floor labels grid effects or extra objects. Genuine alpha transparency. Crisp restrained pixel-art tactical RPG style of reference. Last pose of attack/skill returns to idle. Never mirror handedness. Each cell must have at least45px completely clear transparent space on all sides. Keep outermost figures FAR from canvas edges.
```

### job12 ne

```text
Use case: identity-preserve. Create a transparent 4 columns x4 rows game animation sprite sheet. Reference is approved basic mounted archer JOB12; preserve same youthful face, dark ponytail red tie, dark burgundy tunic leather armor pale cuffs, brown boots, simple wooden recurved bow, quiver and chestnut horse black mane simple brown saddle. Whole rider AND horse connected in every cell, exactly one rider and one horse. ALL sixteen face NORTHEAST upper-right 2 o'clock: horse head toward upper right, hindquarters toward viewer lower left; rider BACK visible. RIGHT draw elbow is near-side low bent, LEFT bow arm far-side. Never front-facing or mirror hands. Row1 four distinct breathing idle poses, row2 four real horse walking phases with alternating lifted fore/hind hooves and rider following saddle (not rigid translations); row3 nock arrow, draw string to cheek, release, lower bow recovery; row4 prepare, raise bow signal, lower signaling hand, recover. Anatomical LEFT hand holds bow, RIGHT draws string. Keep hands attached, proper saddle legs. Same horse body and human head sizes in all16. Exactly16 evenly spaced cells; complete figures only50% of each cell width/height, large transparent gutters at all cell boundaries, no cropping even bow. No shadow floor labels grid effects or extra objects. Genuine alpha transparency. Crisp restrained pixel-art tactical RPG style of reference. Last pose of attack/skill returns to idle. Never mirror handedness. Square image; each cell has at least45px EMPTY transparent border, including outermost cells. No horse hoof or nose touches edge.
```

### job12 sw

```text
Use case: identity-preserve. Create a transparent 4 columns x4 rows game animation sprite sheet. Reference is approved basic mounted archer JOB12; preserve same youthful face, dark ponytail red tie, dark burgundy tunic leather armor pale cuffs, brown boots, simple wooden recurved bow, quiver and chestnut horse black mane simple brown saddle. Whole rider AND horse connected in every cell, exactly one rider and one horse. ALL sixteen face SOUTHWEST lower-left 7 o'clock: horse head toward lower left and rider FRONT left-facing. Anatomical LEFT near-side bow arm crosses IN FRONT of chest from screen-right shoulder toward bow at screen-left, RIGHT far-side draw hand reaches cheek with mostly hidden far elbow. Never mirror handedness. Row1 four distinct breathing idle poses, row2 four real horse walking phases with alternating lifted fore/hind hooves and rider following saddle (not rigid translations); row3 nock arrow, draw string to cheek, release, lower bow recovery; row4 prepare, raise bow signal, lower signaling hand, recover. Anatomical LEFT hand holds bow, RIGHT draws string. Keep hands attached, proper saddle legs. Same horse body and human head sizes in all16. Exactly16 evenly spaced cells; complete figures only50% of each cell width/height, large transparent gutters at all cell boundaries, no cropping even bow. No shadow floor labels grid effects or extra objects. Genuine alpha transparency. Crisp restrained pixel-art tactical RPG style of reference. Last pose of attack/skill returns to idle. Never mirror handedness. Square image; each cell has at least45px EMPTY transparent border, including outermost cells. No horse hoof or nose touches edge.
```

### job12 swFix

```text
Edit image1 mounted archer sheet ONLY the ATTACK third row columns1,2,3. They must shoot toward LEFT, same direction as horse faces. Use image2 third row's UPPER BODY arm geometry as pose reference: near anatomical LEFT arm starts at screen-right shoulder crosses OVER FRONT OF CHEST to extend toward bow at screen-left; far anatomical RIGHT hand draws to cheek at screen-right, far elbow mostly obscured. Bow must be on LEFT of rider during nock, full draw, release, arrow points LEFT. Keep exact same burgundy costume, rider identity and horse from image1. Keep rider seated, horse unchanged, four rows16whole sprites. Do not import green costume or legs from image2. Leave all other cells intact. Wide transparent gutters, no cropping. Real alpha transparency.
```

### job12 scenario

```text
Use case identity-preserve. Create transparent4x4 scenario standing breathing sheet of approved reference rider WITHOUT HORSE. Same youthful face black ponytail red tie dark burgundy tunic leather vest ivory cuffs and undergarment dark trousers and boots, same body/head scale. NO bow quiver arrows weapon harness sword scabbard reins. Both hands EMPTY naturally at sides. Rows: 1 NW upper-left BACK, 2 NE upper-right BACK, 3 SE lower-right FRONT, 4 SW lower-left FRONT. Four columns subtle distinct breathing phases with shoulders/chest/hair changing, feet planted. Whole connected human each cell. All cells equal size, sprites only55% cell height with wide transparent margins on every side. No labels grid shadow floor glow. True transparent background, crisp pixel-art same reference style.
```

### job12 weakened

```text
Use case identity-preserve. Transparent 4x4 MOUNTED WEAKENED breathing animation sheet of exact reference JOB12. Keep chestnut horse, saddle, burgundy leather-armored rider black ponytail red tie, wooden bow/quiver. Rider stays mounted but shoulders slump forward, head hangs tired, bow lowered safely, free hand rests saddle. Horse rests, head slightly lowered, all four hooves grounded, no walking or collapse. Four rows directions: NW upper-left BACK, NE upper-right BACK, SE lower-right FRONT, SW lower-left FRONT. Four columns distinct fatigue breathing sequence shallow slump/deeper slump/exhale/recover shallow slump, subtle horse head/ear movement. Whole connected rider and horse each cell, no bodypart montage, no duplicated limbs. Same body sizes and costume all16, clear full silhouettes including hooves. Each sprite fits within CENTER60% of cell, large transparent gutters and outer border. No words grid shadows ground glow. Crisp reference game sprite style, actual alpha background.
```

### job12 weakenedFix

```text
Fix only TOP ROW of this 4x4 mounted weakened sprite sheet. TOP ROW must face NORTHWEST upper LEFT11 o'clock: horse muzzle points upper-LEFT, hindquarters lower-right, rider BACK facing upper-left. Redraw those four complete horse+rider poses anatomically correct, same burgundy rider and chestnut horse, slumped fatigue breathing phases. Do not merely flip hands or quiver; left hand bow stays anatomical left. Other rows unchanged: row2 NE back-right, row3 SE front-right,row4 SW front-left. Also ensure ample transparent empty outer margin around all16 figures; scale all sprites down modestly if needed. No cut off noses or hooves. Genuine transparency no labels.
```

### job13 se

```text
Use case identity-preserve. Image1 APPROVED JOB13 promoted mounted archer identity costume horse bow. Image2 POSES ONLY. Redraw all16 whole horse+rider sprites from image2 in exact image1 promotion fixed set: dark burgundy reinforced lamellar armor with cream/gold edging and larger shoulder protection, same youthful face dark ponytail red tie, ivory cuffs, dark boots, chestnut horse with burgundy cream-edged saddlecloth, same horn recurved bow with small RED tassel. DO NOT keep plain base tunic. Keep image2's four rows idle/walk/nock-draw-release-recover/skill;4 columns times, ALL SE front-right. Exact correct LEFT bowhand RIGHT drawhand. Horse walk must alternate limbs, no rigid sliding. Constant human/horse size all16. Full connected sprites no separated parts. True transparent background remove gray, NO labels shadow glow. All figures occupy CENTER60% of each cell, wide transparent margins and outer border. No clipping hooves noses or bows.
```

### job13 nw

```text
Use case identity-preserve. Image1 APPROVED JOB13 promoted mounted archer identity costume horse bow. Image2 POSES ONLY. Redraw all16 whole horse+rider sprites from image2 in exact image1 promotion fixed set: dark burgundy reinforced lamellar armor with cream/gold edging and larger shoulder protection, same youthful face dark ponytail red tie, ivory cuffs, dark boots, chestnut horse with burgundy cream-edged saddlecloth, same horn recurved bow with small RED tassel. DO NOT keep plain base tunic. Keep image2's four rows idle/walk/nock-draw-release-recover/skill;4 columns times, ALL NW back-upper-left, horse head upper-left and hindquarters lower-right, rider back visible. Exact correct LEFT bowhand RIGHT drawhand. Horse walk must alternate limbs, no rigid sliding. Constant human/horse size all16. Full connected sprites no separated parts. True transparent background remove gray, NO labels shadow glow. All figures occupy CENTER60% of each cell, wide transparent margins and outer border. No clipping hooves noses or bows.
```

### job13 ne

```text
Use case identity-preserve. Image1 APPROVED JOB13 promoted mounted archer identity costume horse bow. Image2 POSES ONLY. Redraw all16 whole horse+rider sprites from image2 in exact image1 promotion fixed set: dark burgundy reinforced lamellar armor with cream/gold edging and larger shoulder protection, same youthful face dark ponytail red tie, ivory cuffs, dark boots, chestnut horse with burgundy cream-edged saddlecloth, same horn recurved bow with small RED tassel. DO NOT keep plain base tunic. Keep image2's four rows idle/walk/nock-draw-release-recover/skill;4 columns times, ALL NE back-upper-right, horse muzzle upper-right, hindquarters lower-left, rider BACK visible. Near RIGHT elbow bent low drawing string, far LEFT hand holds bow. Exact correct LEFT bowhand RIGHT drawhand. Horse walk must alternate limbs, no rigid sliding. Constant human/horse size all16. Full connected sprites no separated parts. True transparent background remove gray, NO labels shadow glow. All figures occupy CENTER60% of each cell, wide transparent margins and outer border. No clipping hooves noses or bows.
```

### job13 neFix

```text
Fix framing only of this 4x4 sheet: REDUCE all sixteen whole horse+rider figures to70% their current size, centered individually in each cell. Restore fully complete horse NOSES in rightmost column currently clipped. At least40 pixels empty transparency on all sides of every figure, including outer canvas. Keep all poses/directions/identity/costume/horse/handedness identical, all connected whole figures. No text border floor shadow. Transparent background.
```

### job13 sw

```text
Use case identity-preserve. Image1 APPROVED JOB13 promoted mounted archer identity costume horse bow. Image2 POSES ONLY. Redraw all16 whole horse+rider sprites from image2 in exact image1 promotion fixed set: dark burgundy reinforced lamellar armor with cream/gold edging and larger shoulder protection, same youthful face dark ponytail red tie, ivory cuffs, dark boots, chestnut horse with burgundy cream-edged saddlecloth, same horn recurved bow with small RED tassel. DO NOT keep plain base tunic. Keep image2's four rows idle/walk/nock-draw-release-recover/skill;4 columns times, ALL SW front-lower-left, horse and rider face LEFT. Attack bow points LEFT as in pose reference; near LEFT arm crosses in front of chest toward bow at screen-left and far RIGHT hand draws to cheek. Preserve pose reference exactly. Exact correct LEFT bowhand RIGHT drawhand. Horse walk must alternate limbs, no rigid sliding. Constant human/horse size all16. Full connected sprites no separated parts. True transparent background remove gray, NO labels shadow glow. All figures occupy CENTER60% of each cell, wide transparent margins and outer border. No clipping hooves noses or bows.
```

### job13 swFix

```text
Use case background-extraction. Remove ALL brown/black gradient background from this 4x4 mounted archer sheet, making it genuinely TRANSPARENT alpha0. Keep every complete horse+rider sprite and exact pose, costume, all limbs and bowstrings. Also retain approved bow's tiny RED tassel below handgrip in every cell. No ground or cast shadow. Add comfortable transparent margins between rows and outer edge; each entire sprite fits cell without touching. Do not add background of any color, no checkerboard pixels. Real transparent RGBA.
```

### job13 swFinal

```text
Use case identity-preserve. Image1 APPROVED JOB13 promoted mounted archer identity costume horse bow. Image2 POSES ONLY. Redraw all16 whole horse+rider sprites from image2 in exact image1 promotion fixed set: dark burgundy reinforced lamellar armor with cream/gold edging and larger shoulder protection, same youthful face dark ponytail red tie, ivory cuffs, dark boots, chestnut horse with burgundy cream-edged saddlecloth, same horn recurved bow with small RED tassel. DO NOT keep plain base tunic. Keep image2's four rows idle/walk/nock-draw-release-recover/skill;4 columns times, ALL SW front-lower-left, horse and rider face LEFT. Attack bow points LEFT as in pose reference; near LEFT arm crosses in front of chest toward bow at screen-left and far RIGHT hand draws to cheek. Preserve pose reference exactly. Exact correct LEFT bowhand RIGHT drawhand. Horse walk must alternate limbs, no rigid sliding. Constant human/horse size all16. Full connected sprites no separated parts. True transparent background remove gray, NO labels shadow glow. All figures occupy CENTER60% of each cell, wide transparent margins and outer border. No clipping hooves noses or bows. IMPORTANT output MUST BE TRUE TRANSPARENT, all space between silhouettes alpha ZERO, absolutely no brown gradient backdrop. Reference2 transparent source poses only. Make square image. Restrained dark burgundy color not bright red.
```

### job13 swSpace

```text
Fix only spacing in this transparent4x4 mounted archer sheet. Every figure must become MUCH SMALLER, 60% current figure size within its own cell. Critical row3 horse hooves and row4 raised bow overlap their cell boundary; separate them by at least60px EMPTY transparency. Keep sixteen complete connected horse+rider poses, costume, directions and correct left-pointing attacks. No cropping or erasing body parts. Entire sprite including raised bow fits center55% of its cell. Preserve transparency, no background no labels. Square sheet four rows four columns.
```

### job13 scenario

```text
Use case identity-preserve. Image1 approved JOB13 costume identity. Image2 exact scenario POSE reference only. Redraw sixteen complete humans in image2's four rows and breathing phases wearing image1's promoted burgundy reinforced lamellar armor with cream edging, shoulder guards, ivory cuffs, layered skirt panels,dark boots, same youthful face and black ponytail red tie. NO horse, bow, arrows, quiver, weapon harness, sword or scabbard; both hands EMPTY. Preserve distinct four directions from image2: row1 NE BACK right, row2 NW BACK left,row3 SE FRONT right,row4 SW FRONT left. Four columns breathing subtle shoulder and cloth changes, planted feet. Same body/head size all16. Full connected figures only55% cell height, wide transparent gutters and outer border. Transparent background no gray no labels ground shadows effects. Match crisp pixel game art.
```

### job13 weakened

```text
Use case identity-preserve. Image1 approved JOB13 promotion fixed set; image2 exact sixteen mounted weakened POSES ONLY. Redraw all16 complete horse+rider with image1's burgundy reinforced lamellar armor, cream/gold trim, shoulder guards, ivory cuffs, dark boots, red tied black ponytail, horn bow red tassel, chestnut horse and burgundy cream-trim saddlecloth. Keep four row directions EXACTLY image2: NW back-left,NE back-right,SE front-right,SW front-left.4 columns fatigued slump/shallow breath/deeper slump/recovery. Horse standing head low, rider stays mounted, no walking/falling. Real pose variations not sliding. Same character and horse sizes. Transparent background remove gray; no text shadow floor effect. Each whole unit within central55% cell width/height, large transparent gutters and outer margins.
```

### job14 se

```text
Use case identity-preserve. Image1 APPROVED JOB14 FINAL promoted mounted archer identity costume horse bow. Image2 POSES ONLY. Redraw all16 whole horse+rider sprites from image2 in exact image1 promotion fixed set: rich dark burgundy heavy lamellar armor with broad GOLD edges, strong gold-trim shoulder plates, ornate GOLD brow circlet, same youthful face dark ponytail red tie, ivory cuffs, dark boots, DARK GRAY horse with black mane, burgundy GOLD-edged saddlecloth, ornate gold harness, same golden horn recurved bow with jade bead and small DARK BLUE tassel. DO NOT keep plain base tunic. Keep image2's four rows idle/walk/nock-draw-release-recover/skill;4 columns times, ALL SE front-right. Exact correct LEFT bowhand RIGHT drawhand. Horse walk must alternate limbs, no rigid sliding. Constant human/horse size all16. Full connected sprites no separated parts. True transparent background remove gray, NO labels shadow glow. All figures occupy CENTER60% of each cell, wide transparent margins and outer border. No clipping hooves noses or bows. Keep exact promoted bow ornaments every frame, no missing tassels. Horse gray NOT brown.
```

### job14 nw

```text
Use case identity-preserve. Image1 APPROVED JOB14 FINAL promoted mounted archer identity costume horse bow. Image2 POSES ONLY. Redraw all16 whole horse+rider sprites from image2 in exact image1 promotion fixed set: rich dark burgundy heavy lamellar armor with broad GOLD edges, strong gold-trim shoulder plates, ornate GOLD brow circlet, same youthful face dark ponytail red tie, ivory cuffs, dark boots, DARK GRAY horse with black mane, burgundy GOLD-edged saddlecloth, ornate gold harness, same golden horn recurved bow with jade bead and small DARK BLUE tassel. DO NOT keep plain base tunic. Keep image2's four rows idle/walk/nock-draw-release-recover/skill;4 columns times, ALL NW back-upper-left, rider back and horse hindquarters visible. Preserve reference2 LEFT bowhand near-side and RIGHT drawhand far-side.. Exact correct LEFT bowhand RIGHT drawhand. Horse walk must alternate limbs, no rigid sliding. Constant human/horse size all16. Full connected sprites no separated parts. True transparent background remove gray, NO labels shadow glow. All figures occupy CENTER60% of each cell, wide transparent margins and outer border. No clipping hooves noses or bows. Keep exact promoted bow ornaments every frame, no missing tassels. Horse gray NOT brown.
```

### job14 ne

```text
Use case identity-preserve. Image1 APPROVED JOB14 FINAL promoted mounted archer identity costume horse bow. Image2 POSES ONLY. Redraw all16 whole horse+rider sprites from image2 in exact image1 promotion fixed set: rich dark burgundy heavy lamellar armor with broad GOLD edges, strong gold-trim shoulder plates, ornate GOLD brow circlet, same youthful face dark ponytail red tie, ivory cuffs, dark boots, DARK GRAY horse with black mane, burgundy GOLD-edged saddlecloth, ornate gold harness, same golden horn recurved bow with jade bead and small DARK BLUE tassel. DO NOT keep plain base tunic. Keep image2's four rows idle/walk/nock-draw-release-recover/skill;4 columns times, ALL NE back-upper-right: horse muzzle upper-right, hindquarters lower-left, rider BACK. Near RIGHT elbow bent low draws string; far LEFT arm holds bow. Keep exact reference2 poses. Exact correct LEFT bowhand RIGHT drawhand. Horse walk must alternate limbs, no rigid sliding. Constant human/horse size all16. Full connected sprites no separated parts. True transparent background remove gray, NO labels shadow glow. All figures occupy CENTER60% of each cell, wide transparent margins and outer border. No clipping hooves noses or bows. Keep exact promoted bow ornaments every frame, no missing tassels. Horse gray NOT brown.
```

### job14 sw

```text
Use case identity-preserve. Image1 APPROVED JOB14 FINAL promoted mounted archer identity costume horse bow. Image2 POSES ONLY. Redraw all16 whole horse+rider sprites from image2 in exact image1 promotion fixed set: rich dark burgundy heavy lamellar armor with broad GOLD edges, strong gold-trim shoulder plates, ornate GOLD brow circlet, same youthful face dark ponytail red tie, ivory cuffs, dark boots, DARK GRAY horse with black mane, burgundy GOLD-edged saddlecloth, ornate gold harness, same golden horn recurved bow with jade bead and small DARK BLUE tassel. DO NOT keep plain base tunic. Keep image2's four rows idle/walk/nock-draw-release-recover/skill;4 columns times, ALL SW front-lower-left. Exact reference2 attack bow points LEFT; anatomical near LEFT arm crosses chest and far RIGHT hand draws cheek. Horse and rider face left. Exact correct LEFT bowhand RIGHT drawhand. Horse walk must alternate limbs, no rigid sliding. Constant human/horse size all16. Full connected sprites no separated parts. True transparent background remove gray, NO labels shadow glow. All figures occupy CENTER60% of each cell, wide transparent margins and outer border. No clipping hooves noses or bows. Keep exact promoted bow ornaments every frame, no missing tassels. Horse gray NOT brown.
```

### job14 swSpace

```text
Fix only spacing in this transparent4x4 mounted archer sheet. Every figure must become MUCH SMALLER, 60% current figure size within its own cell. Critical row3 horse hooves and row4 raised bow overlap their cell boundary; separate them by at least60px EMPTY transparency. Keep sixteen complete connected horse+rider poses, gold trim costume and gray horse, directions and correct left-pointing attacks. No cropping or erasing body parts. Entire sprite including raised bow fits center55% of its cell. Preserve transparency, no background no labels. Square sheet four rows four columns.
```

### job14 scenario

```text
Use case identity-preserve. Image1 approved JOB14 FINAL costume identity. Image2 exact scenario POSE reference only. Redraw sixteen complete humans in image2's four rows and breathing phases wearing image1's final burgundy heavy lamellar armor with broad GOLD edging, GOLD shoulder guards, GOLD brow circlet, ivory cuffs, layered skirt panels,dark boots, same youthful face and black ponytail red tie. NO horse, bow, arrows, quiver, weapon harness, sword or scabbard; both hands EMPTY. Preserve distinct four directions from image2: row1 NE BACK right, row2 NW BACK left,row3 SE FRONT right,row4 SW FRONT left. Four columns breathing subtle shoulder and cloth changes, planted feet. Same body/head size all16. Full connected figures only55% cell height, wide transparent gutters and outer border. Transparent background no gray no labels ground shadows effects. Match crisp pixel game art.
```

### job14 weakened

```text
Use case identity-preserve. Image1 approved JOB14 FINAL promotion fixed set; image2 exact sixteen mounted weakened POSES ONLY. Redraw all16 complete horse+rider with image1's burgundy heavy lamellar armor, broad GOLD trim, gold-edged shoulder guards and GOLD brow circlet, ivory cuffs, dark boots, red tied black ponytail, ornate golden horn bow jade bead dark BLUE tassel, DARK GRAY horse black mane and burgundy GOLD-trim saddlecloth. Keep four row directions EXACTLY image2: NW back-left,NE back-right,SE front-right,SW front-left.4 columns fatigued slump/shallow breath/deeper slump/recovery. Horse standing head low, rider stays mounted, no walking/falling. Real pose variations not sliding. Same character and horse sizes. Transparent background remove gray; no text shadow floor effect. Each whole unit within central55% cell width/height, large transparent gutters and outer margins.
```

### job15 se

```text
Use case identity-preserve. Transparent square4x4 tactical RPG motion sheet. Exact reference JOB15 light catapult unit: young engineer brown cloth cap, ochre tan work coat ivory sleeves dark trousers boots, compact brown wood four-wheel sling catapult plain rope and iron pivots. Always ONE engineer beside ONE machine together as whole connected unit, same design/material/scale. ALL16 face SOUTHEAST front-right same reference: operator behind left of machine, firing direction lower-right. Row1 four subtle idle breathing poses hands near crank. Row2 four WALKING PUSH phases, operator legs alternate forward/back bent knees, hands gripping frame, wheel spokes rotate quarterturn per frame. Row3 firing cycle: engineer cranks arm DOWN to load sling, arm drawn back loaded, sling arm swings UP to release stone (no detached flying projectile), returns ready. Clear arm angle change with realistic pivot and attached rope. Row4 skill: checks mechanism, raises empty hand command while other holds frame, points forward, returns. No horse rider bow sword. Fixed camera size and groundline. Each COMPLETE unit including arm/sling fits CENTER55% of each cell with HUGE transparent gutters, minimum40px empty border around each; no clipping or overlap. Crisp dark outlined game sprite style, restrained colors. TRUE alpha transparent background NO floor shadows labels grid glow. Four columns successive times.
```

### job15 nw

```text
Use case identity-preserve. Transparent square4x4 tactical RPG motion sheet. Exact reference JOB15 light catapult unit: young engineer brown cloth cap, ochre tan work coat ivory sleeves dark trousers boots, compact brown wood four-wheel sling catapult plain rope and iron pivots. Always ONE engineer beside ONE machine together as whole connected unit, same design/material/scale. ALL16 face NORTHWEST upper-LEFT11 o'clock: see engineer BACK and machine REAR, firing arm aims toward upper-left AWAY from viewer. Engineer stands behind/right of machine in perspective. Entire machine and operator rotate together. Row1 four subtle idle breathing poses hands near crank. Row2 four WALKING PUSH phases, operator legs alternate forward/back bent knees, hands gripping frame, wheel spokes rotate quarterturn per frame. Row3 firing cycle: engineer cranks arm DOWN to load sling, arm drawn back loaded, sling arm swings UP to release stone, EMPTY sling pouch at release (no detached flying projectile), returns ready. Clear arm angle change with realistic pivot and attached rope. Row4 skill: checks mechanism, raises empty hand command while other holds frame, points forward, returns. No horse rider bow sword. Fixed camera size and groundline. Each COMPLETE unit including arm/sling fits CENTER55% of each cell with HUGE transparent gutters, minimum40px empty border around each; no clipping or overlap. Crisp dark outlined game sprite style, restrained colors. TRUE alpha transparent background NO floor shadows labels grid glow. Four columns successive times.
```

### job15 ne

```text
Use case identity-preserve. Transparent square4x4 tactical RPG motion sheet. Exact reference JOB15 light catapult unit: young engineer brown cloth cap, ochre tan work coat ivory sleeves dark trousers boots, compact brown wood four-wheel sling catapult plain rope and iron pivots. Always ONE engineer beside ONE machine together as whole connected unit, same design/material/scale. ALL16 face NORTHEAST upper-RIGHT2 o'clock: engineer BACK and catapult REAR toward viewer lower-left, firing arm aims upper-right AWAY from viewer. Entire machine and operator rotate together. Row1 four subtle idle breathing poses hands near crank. Row2 four WALKING PUSH phases, operator legs alternate forward/back bent knees, hands gripping frame, wheel spokes rotate quarterturn per frame. Row3 firing cycle: engineer cranks arm DOWN to load sling, arm drawn back loaded, sling arm swings UP to release stone with EMPTY sling pouch after release (no detached projectile), returns ready. Clear arm angle change with realistic pivot and attached rope. Row4 skill: checks mechanism, raises empty hand command while other holds frame, points forward, returns. No horse rider bow sword. Fixed camera size and groundline. Each COMPLETE unit including arm/sling fits CENTER55% of each cell with HUGE transparent gutters, minimum40px empty border around each; no clipping or overlap. Crisp dark outlined game sprite style, restrained colors. TRUE alpha transparent background NO floor shadows labels grid glow. Four columns successive times.
```

### job15 sw

```text
Use case identity-preserve. Transparent square4x4 tactical RPG motion sheet. Exact reference JOB15 light catapult unit: young engineer brown cloth cap, ochre tan work coat ivory sleeves dark trousers boots, compact brown wood four-wheel sling catapult plain rope and iron pivots. Always ONE engineer beside ONE machine together as whole connected unit, same design/material/scale. ALL16 face SOUTHWEST lower-LEFT7 o'clock: engineer FRONT visible behind/right of machine, firing arm aims toward lower-left. Entire machine and operator rotate together. Row1 four subtle idle breathing poses hands near crank. Row2 four WALKING PUSH phases, operator legs alternate forward/back bent knees, hands gripping frame, wheel spokes rotate quarterturn per frame. Row3 firing cycle: engineer cranks arm DOWN to load sling, arm drawn back loaded, sling arm swings UP to release stone with EMPTY sling pouch at release (no detached projectile), returns ready. Clear arm angle change with realistic pivot and attached rope. Row4 skill: checks mechanism, raises empty hand command while other holds frame, points forward, returns. No horse rider bow sword. Fixed camera size and groundline. Each COMPLETE unit including arm/sling fits CENTER55% of each cell with HUGE transparent gutters, minimum40px empty border around each; no clipping or overlap. Crisp dark outlined game sprite style, restrained colors. TRUE alpha transparent background NO floor shadows labels grid glow. Four columns successive times.
```

### job15 swFix

```text
Correct facing direction of ALL sixteen units. They currently face RIGHT incorrectly. Redraw entire engineer+catapult assemblies facing SOUTHWEST LEFT, mirrored composition but anatomically redrawn. Engineer FRONT visible on RIGHT SIDE of each cell, catapult machine to LEFT of him, sling tip on FAR LEFT. All walking pushes, firing aim, pointing gestures go LEFT. Keep brown cloth cap ochre tunic same young face and exact wooden catapult design and action sequence.4x4 transparent sheet with wide gutters and outer margins, no clipping labels shadow or floor. All16 face lower-left7 o'clock consistently.
```

### job15 swSpace

```text
Fix framing of this4x4 transparent engineering cart sprite sheet ONLY: all sixteen complete engineer+cart sprites SMALLER to65% of current size, individually centered in cells. Restore cropped right-edge boots and cloth, full wheels rope and beam. Huge transparent empty gutters on every side each sprite; bottom row clear of canvas. Keep left-facing front direction, costume and16 poses.4 rows4 columns. Real transparent background no labels no shadows.
```

### job15 scenario

```text
Use case identity-preserve. Transparent4x4 SCENARIO standing idle sheet of ONLY the engineer in approved JOB15 reference. Same young face brown cloth cap, ochre tan short work coat ivory collar/sleeves, dark belt dark trousers brown boots. NO machine, horse, weapon, tools in hands, shield or sword. Both hands empty naturally at sides. Four rows directions: NW upper-left BACK, NE upper-right BACK, SE lower-right FRONT, SW lower-left FRONT.4 columns distinct breathing loop with shoulders sleeves and cap ribbon moving subtly, feet planted. Whole connected body each cell, constant body/head size. Exactly16 humans, centered within60% cell height and wide fully transparent margins. True transparency no background grid labels shadow floor. Crisp restrained pixel game art matching reference.
```

### job16 se

```text
Use case identity-preserve. Image1 approved JOB16 middle-rank catapult: same young engineer now BLACK work cap, reinforced OCHRE gold-trim work coat and arm guards, ivory sleeves, dark boots; larger bronze/iron-braced wooden four-wheel sling catapult with RED painted bands on long throwing arm and brass fittings. Image2 POSE sequence ONLY. Redraw all16 COMPLETE engineer+machine units from image2 wearing exact image1 fixed costume and catapult design. Rows idle breathing / WALK PUSH alternating legs and rotating wheels / crank-down load, tension, arm-up RELEASE with EMPTY sling pouch, recover / inspect machine, raise empty hand, point, recover. All16 SE front-right. Same fixed camera, same human body/head and machine scale. Clear genuine pose changes, no rigid shifts. Preserve attached pivot rope and limbs. Transparent background no gray ground labels shadows glow. Whole units CENTER55% each cell, ample margins including raised arm and wheels.4x4 square layout.
```

### job16 nw

```text
Use case identity-preserve. Image1 approved JOB16 middle-rank catapult: same young engineer now BLACK work cap, reinforced OCHRE gold-trim work coat and arm guards, ivory sleeves, dark boots; larger bronze/iron-braced wooden four-wheel sling catapult with RED painted bands on long throwing arm and brass fittings. Image2 POSE sequence ONLY. Redraw all16 COMPLETE engineer+machine units from image2 wearing exact image1 fixed costume and catapult design. Rows idle breathing / WALK PUSH alternating legs and rotating wheels / crank-down load, tension, arm-up RELEASE with EMPTY sling pouch, recover / inspect machine, raise empty hand, point, recover. All16 NW back-upper-left, engineer BACK on right of machine, firing toward upper-left. Keep reference2 directions and all poses. Same fixed camera, same human body/head and machine scale. Clear genuine pose changes, no rigid shifts. Preserve attached pivot rope and limbs. Transparent background no gray ground labels shadows glow. Whole units CENTER55% each cell, ample margins including raised arm and wheels.4x4 square layout.
```

### job16 nwSafe

```text
Create a transparent4x4 game animation sheet of the harmless wooden engineering cart and its adult operator shown in image1. This is a stylized historical mechanics demonstration, no fighting, no targets, no harm. Use image2 for sixteen poses and back-left orientation. Preserve image1's black work cap, ochre gold-edged uniform, metal armguards, wooden cart with metal rims and red bands on pivoting wooden beam. Four rows: resting breathing; walking while pushing cart with alternating steps; operating crank so beam lowers then rises then rests; inspecting cart and gesturing with empty hand. Whole person and cart together in every cell. All face upper-left, back of operator visible on right of cart. Four times per row. Keep same sizes, no copies or sliding. Huge transparent gutters, complete wheels feet beam inside each cell, no text background shadow or ground. No projectiles or violence.
```

### job16 nwFinal

```text
Use case identity-preserve. Generate a SQUARE TRANSPARENT4x4 sprite sheet, real ALPHA0 outside sprites. Image1 approved adult engineer with BLACK cap, reinforced ochre gold-edged coat, metal armguards, bronze/iron-braced wooden cart RED-banded pivot beam. Image2 TRANSPARENT POSES ONLY. Repaint image2's sixteen whole person+cart figures with image1 exact upgraded design. All NW BACK upper-left: operator back on RIGHT, beam points LEFT. Four rows breathing / walking pushing cart alternating feet / lowering and raising pivot beam via crank / inspect, empty hand raised, point, return. Keep same sizes. No fighting damage targets or projectiles. IMPORTANT no brown gradient no ground no gray no checkerboard, only TRANSPARENCY. Large clear margins each cell.16 complete figures4x4.
```

### job16 nwSpace

```text
Framing correction only: shrink each complete person+cart sprite to60% current size inside its OWN cell. Maintain4x4 grid and all16 poses. Restore sling at LEFT edge row3 column1 and rightmost boots currently touching edge. All whole sprites need40px transparent margins on every side, no overlap. Keep BACK upper-left direction, black cap gold-edged ochre coat red-banded beam, wheel design. True transparency no backdrop shadow text.
```

### job16 ne

```text
Transparent4x4 stylized historical engineering-cart animation. Reference1 approved JOB16 uniform and cart design: black cap ochre gold-edged coat ivory sleeves metal armguards, large wooden cart metal wheel rims red-banded pivot beam. Reference2 sixteen POSES and orientation only. All16 face NORTHEAST upper-right, operator BACK visible on left of cart. Rows idle breathing; pushing cart with alternating footwork and turning wheels; crank operation lowers beam then raises then returns; inspect/raise empty hand/point/return. Four times each. Nonviolent mechanics demo no targets damage flying objects. Whole connected operator+cart always. Same body/vehicle sizes, wide60px transparent gutters and outer margins, figures only55% cell. Actual transparent background no gray floor shadow text.
```

### job16 sw

```text
Use case identity-preserve. True TRANSPARENT SQUARE4x4 game sprite sheet. Image1 approved JOB16 engineer+cart fixed set: BLACK cap, ochre coat with gold edges, ivory sleeves metal armguards; bronze/iron-braced wooden cart with RED-banded pivot beam. Image2 POSES and FRONT LEFT direction only. Redraw all16 complete units, operator on RIGHT of cart, beam points LEFT, face visible. Rows breathing idle; WALKING PUSH with distinctly alternating left foot forward/right foot forward and bent knees, wheels rotating; operating crank beam lowers/rises/returns; inspect/raise empty hand/point/return. Keep consistent design size. Nonviolent mechanics display no target damage projectile. Units only55% cell width/height with wide empty transparent gutters. No background gradient floor shadows text.
```

### job16 scenario

```text
Transparent square4x4 scenario idle sheet of approved reference JOB16 adult engineer only. Exact youthful face black work cap, reinforced ochre GOLD-edged work coat ivory sleeves metal forearm guards dark belt dark trousers boots. Remove entire machine, no weapons tools or objects in hands; both hands empty relaxed at sides. Rows NW back-left, NE back-right, SE front-right, SW front-left. Four distinct breathing poses per row, subtle shoulders and cloth changes, planted feet. Same body/head scale. Whole connected bodies. Real alpha0 transparent background, no gradient floor shadow text. Each sprite only55% cell height, generous transparent gutters.
```

### job16 scenarioFix

```text
Correct ONLY top row direction in this4x4 transparent idle sheet. TOP ROW all4 must face NORTHWEST BACK upper-LEFT, nose profile on LEFT edge of head, back of cap and coat visible, feet oriented upper-left. Current top row wrongly faces back-right. Redraw anatomically same black cap ochre gold-edged coat metal bracers and EMPTY hands. Row2 stays NE back-right,row3 SE front-right,row4 SW front-left. Keep breathing phases full bodies sizes spacing. No weapons machine labels shadow background. Real transparency.
```

### job17 se

```text
Use case identity-preserve. Transparent SQUARE4x4 game sprite sheet. Image1 approved JOB17 final engineering unit: same youthful adult operator, BLACK formal cap with small gold accent, NAVY dark-blue coat with gold borders, ivory sleeves dark boots; elaborate bronze/gold-braced wooden cart with heavy wheels and broad SPOON-CUP at tip of pivot arm, green JADE RING and dark BLUE TASSEL hanging beneath cup. Image2 POSES only. Redraw all16 whole operator+cart units with exact image1 fixed design, NOT middle-rank red-banded sling model. ALL SE front-right. Four rows idle breathing; walking pushing cart alternating feet and rotating wheels; operating crank cup arm lowers/raises/returns; inspection/raise empty hand/point/return. No detached projectiles targets damage or fighting, a mechanics demo. Same sizes, keep jade and blue tassel all frames, whole connected units. Center55% each cell wide40px margins. True alpha0 background no gray gradient floor shadows labels.
```

### job17 seFix

```text
Edit ONLY machine continuity in THIRD ROW of this4x4 sprite sheet. The machine is a rigid SPOON-ARM cart, NEVER a hanging sling. In row3 ALL4 cells, replace hanging rope pouch with same solid decorated bronze SPOON CUP rigidly attached to beam tip as other rows. Cup rotates rigidly with beam as beam lowers and rises; jade GREEN RING and dark BLUE tassel hang just beneath cup in all4 poses. No strings supporting cup, no floppy pouch. Preserve same operator navy uniform, connected hands, wheel frame, poses and all other cells. True transparent background, wide clear cell margins. No detached projectiles no labels effects.
```

### job17 seSpace

```text
Fix SPACING ONLY. Reduce each whole engineer+cart to60% its current size CENTERED within its individual cell. Exactly4x4, huge transparent gutters between rows and columns. In third row the jade/tassel must NOT overlap next row. Preserve full rigid spoon cup attached to beam, jade ring/blue tassel, navy uniform, all poses and directions. Restore any clipped extremities; all complete units at least40px from cell and canvas edges. True transparent no backdrop text shadow.
```

### job17 nw

```text
Transparent SQUARE4x4 historical game engineering animation. Image1 approved JOB17 final unit identity: black formal cap gold accent, navy coat gold trim ivory sleeves dark boots; ornate bronze-gold braced wooden cart, pivot arm ends in broad SPOON CUP, jade green ring and dark blue tassel below cup. Image2 poses and BACK LEFT view only. Replace plain brown cap/ochre clothes/plain sling machine with exact image1 final set. ALL16 NW back-upper-left, operator BACK on right of cart, cup at LEFT. Rows breathing; pushing with alternating feet rotating wheels; crank lowers/raises cup arm/returns; inspection/raise empty hand/point/return. Four times each. No targets projectiles damage. Consistent human and cart sizes, jade/tassel every frame. Whole units central55% cell with generous transparent margins, all wheels boots cup visible. True transparency no gradient no ground shadows text.
```

### job17 nwFix

```text
Edit ONLY machine continuity in THIRD ROW of this4x4 sprite sheet. The machine is a rigid SPOON-ARM cart, NEVER a hanging sling. In row3 ALL4 cells, replace hanging rope pouch with same solid decorated bronze SPOON CUP rigidly attached to beam tip as other rows. Cup rotates rigidly with beam as beam lowers and rises; jade GREEN RING and dark BLUE tassel hang just beneath cup in all4 poses. No strings supporting cup, no floppy pouch. Preserve same operator navy uniform, connected hands, wheel frame, poses and all other cells. True transparent background, wide clear cell margins. No detached projectiles no labels effects. Especially row3 column1: solid spoon must stay attached at lowered beam tip, jade ring and blue tassel remain visible, no hanging sling. Keep BACK LEFT direction.
```

### job17 nwSpace

```text
Fix framing only of this4x4 transparent navy-uniform engineer cart sheet. All16 complete units SHRINK to60% current size and CENTER within each cell with minimum40px transparent border. Restore full boots at right edge of row2 column4 and all cut parts; no body or wheel touching edge. Keep BACK LEFT orientation, exact16 poses, bronze rigid spoon arm jade ring blue tassel, navy costume. Huge transparent gutters. No labels shadow floor background.
```

### job17 ne

```text
Use case identity-preserve. Transparent SQUARE4x4 game sprite sheet. Image1 approved JOB17 final engineering unit: same youthful adult operator, BLACK formal cap with small gold accent, NAVY dark-blue coat with gold borders, ivory sleeves dark boots; elaborate bronze/gold-braced wooden cart with heavy wheels and broad SPOON-CUP at tip of pivot arm, green JADE RING and dark BLUE TASSEL hanging beneath cup. Image2 POSES only. Redraw all16 whole operator+cart units with exact image1 fixed design, NOT middle-rank red-banded sling model. ALL NE BACK upper-right: operator back on LEFT side, cup extends upper-RIGHT. Four rows idle breathing; walking pushing cart alternating feet and rotating wheels; operating crank rigid SPOON arm lowers/raises/returns; spoon stays SOLID rigidly attached to beam, NEVER hanging rope pouch, jade ring and blue tassel stay attached under cup; inspection/raise empty hand/point/return. No detached projectiles targets damage or fighting, a mechanics demo. Same sizes, keep jade and blue tassel all frames, whole connected units. Center55% each cell wide40px margins. True alpha0 background no gray gradient floor shadows labels.
```

### job17 sw

```text
Use case identity-preserve. Transparent SQUARE4x4 final engineering-cart sprites. Image1 identity design JOB17: adult engineer black formal cap gold accent NAVY coat gold trim ivory sleeves boots; ornate gold-bronze wood cart heavy wheels, rigid broad SPOON CUP at arm end, green JADE RING and dark BLUE TASSEL under cup. Image2 POSES only. ALL16 face SW FRONT lower-left: operator face visible on RIGHT side, cart extends LEFT. Rows idle; WALK push alternating feet; crank rotates rigid spoon arm down/up/return; inspect/raise empty hand/point/return. IMPORTANT spoon is rigid part of beam at ALL angles, NEVER hanging rope pouch, maintain jade/tassel every pose. No targets projectiles harm, nonviolent mechanical demo. Same human/cart sizes across16. Whole connected units occupy only55% cells,40px transparent gutters all around. No background floor shadows labels.
```

### job17 scenario

```text
Transparent4x4 SCENARIO standing breathing sheet of ONLY approved JOB17 adult engineer. Same young face black formal cap small gold ornament, NAVY dark-blue gold-bordered coat ivory collar and sleeves, brown waist apron belt dark trousers boots. No cart, weapon, tools, spoon, tassel or objects in hands. Both hands empty relaxed at sides. Four rows NW back-upper-LEFT, NE back-upper-RIGHT, SE front-lower-RIGHT, SW front-lower-LEFT; first two rows must be DIFFERENT left and right rear views. Four distinct subtle breathing frames per row, shoulder cloth and hat ribbon changes, planted feet. Same body/head size, full connected human. Center55% cell height large transparent margins. True alpha0 background no gradient floor shadow labels.
```

### job17 seGround

```text
Correct ornament length ONLY in row3 of this4x4 front-right engineer-cart sheet. When spoon arm is lowered, dangling JADE ring and BLUE tassel must be SHORT enough to remain ABOVE the bottom of cart wheels, never below ground level. Shorten the hanging cord/tassel and keep attached beneath rigid spoon cup in row3 columns1,2,3. Do not change wheel positions, machine geometry, person, poses or other rows. Keep cup rigidly attached to beam. Preserve transparent background and wide spacing. No shadow text floor.
```


## 원본 정리 완료

이번 생성 로그의 대형 PNG 51장, 79,941,560bytes만 삭제했다. 경량 프레임·비교표·애니메이션·프롬프트와 원본 SHA256은 보존했다.

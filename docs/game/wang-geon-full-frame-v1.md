# 왕건 완성 프레임 모션 v1

## 범위와 현재 상태

군웅 왕건의 기본 탑승 모델만 제작. 11시(nw), 2시(ne), 5시(se), 7시(sw) × 대기(0), 이동(1), 공격(2), 스킬(3) × 4프레임 = 64장. 하마와 영웅·패왕 승급 모션은 미제작이다. 완성 프레임 초안으로 사용자 확인 후 다른 병과의 기준으로 확정한다.

기준 이미지: `/images/job-models/se-v1/job-0-v2.webp`.
출력: `web/public/images/playable/wang-geon/full-frame-v1/{direction}-{action}-{frame}.webp`.

## 다른 채팅에 전달할 공통 제작 규격

- 승인된 해당 인물·승급의 정지 모델을 참고 이미지로 첨부하고 먼저 읽는다.
- 머리·몸·팔·무기를 분할하지 않는다. 기병은 말과 기수를 포함해 한 프레임으로 그린다.
- 개별 장비 외형 교체를 만들지 않는다. 승급별 복식·대표 무기·탈것은 고정 세트다.
- 11시/2시는 등, 5시/7시는 앞의 3/4 시점이다. 수평 반전으로 무기 손을 바꾸지 않는다.
- 네 방향의 얼굴·관모·옷·말·무기·체격과 색을 유지한다. 무기는 오른손, 고삐는 왼손.
- 각 방향 시트는 4열×4행. 행은 대기/이동/공격/스킬, 열은 시간순 0~3프레임.
- 각 셀의 12% 이상 투명 여백을 확보한다. 무기 끝과 효과도 이 여백을 침범하지 않는다.
- 말 보행은 각 다리의 접지와 들어 올림을 바꾸고 기수와 동기화한다. 전체 이미지를 흔드는 것으로 대체하지 않는다.
- 공격은 준비→타격→후속→복귀, 스킬은 준비→명령→유지→복귀. 이번 스킬은 전투 효과 구현이 아닌 창작 지휘 동작이다.
- WebP 160×160, 품질78. 기본 높이 약128px, 최대 외곽140px, 접지 y=150px. 프레임마다 따로 확대하지 않고 방향의 전체 프레임에 같은 배율을 사용한다.
- 분할 후 작은 유리 픽셀을 제거하고 발 기준선과 잘림을 확인한다. 검 등 부품을 임의로 다시 합성하지 않는다.
- 재생: 대기320ms, 이동170ms, 공격190ms, 스킬240ms/프레임. 방향/동작 변경 시 0프레임부터. 정지/이전/다음 버튼과 reduced-motion 지원.
- 전용 이미지 폴더와 결과 목록만 각 작업 채팅에서 수정한다. 공통 컴포넌트 연결은 통합 채팅에서 담당한다. 커밋·푸시 금지.
- 생성 원본은 경량본·연결 확인 후 해당 작업 파일만 삭제한다. 프롬프트와 경량 파일은 보존한다.

## 검토 한계

AI 생성 특성상 방향별 세부 복식과 동작 연결은 사용자 검토가 필요하다. 원본 게임 동작 재현 완료나 전투 판정 구현으로 간주하지 않는다. 원본 능력치와 이동거리는 수정하지 않았다. 과거 관절 모션은 WangGeonLegacyMotion.tsx에 참고용 보존했다.

## 생성 도구·프롬프트

내장 image_gen 사용. 첫 시트의 스킬 빛이 다른 셀 가까이 번져서 빛을 없애고 여백을 넓히는 2차 편집을 수행했다.

### se

Create a precise transparent animation sprite sheet for the attached Wang Geon mounted Korean ruler reference. Keep his black cap, navy long robe, cream edges, face, plain brown horse, plain saddle and short iron sword. SAME character and restrained crisp outlined game sprite style. One COMPLETE connected horse+rider per cell, not separated parts. Direction throughout ALL cells: 5 o'clock southeast, facing screen RIGHT and toward viewer. Orthographic tactical RPG three-quarter view.
Exactly 4 columns x 4 rows, sixteen equal square cells on a square canvas. No text, grid lines, backgrounds or shadows. Generous clear gutters, each figure occupies at most 72% cell height and 72% width, centered on identical ground anchor. SAME horse and rider scale in all sixteen cells. Feet baseline identical, no camera motion.
Row1 four subtle idle breathing frames, horse standing, hand on reins, sword low.
Row2 four sequential WALK CYCLE frames: distinct alternating horse leg support and lifted legs, synchronized subtle rider pelvis movement, in place. Clear articulated equine walking gait, NO sliding whole picture.
Row3 four sequential sword attack frames: anticipation sword raised, forward slash, follow through, recover. Horse stays grounded. Sword stays in right hand, left hand reins.
Row4 four sequential command skill frames: prepare sword, raise sword in command, restrained small pale gold light at sword tip, lower to recover. This is a fictional command animation.
Head neck shoulders arms connected anatomically; two rider legs straddle saddle, far leg occluded. No detached limbs, duplicated heads, extra legs or weapons. Sword not spear. Keep clear silhouettes and flat limited shading. All 16 cells separated with transparent margins.

수정 프롬프트:
Edit this animation sprite sheet for technical layout ONLY. Preserve all sixteen exact characters, poses, directions, colors and 4x4 ordering. Make every sprite substantially smaller inside its own equal square cell, maximum 65% of cell height and width including sword. Align each horse standing ground at 85% cell height. Each cell has at least 12% empty transparent margin on ALL four sides. CRITICAL remove ALL golden glow, sparks, magic effects from the bottom row, keep the raised sword command poses. The existing bottom-row glow overlaps horses above; REMOVE it entirely and reconstruct clean complete hooves above. Every sprite must be completely separated by wide transparent gutters. No added text, grid, borders, backdrop. True transparent background. Keep integrated horse/rider, same scale throughout.

### sw

Create a precise transparent animation sprite sheet for the attached Wang Geon mounted Korean ruler reference. Keep his black cap, navy long robe, cream edges, face, plain brown horse, plain saddle and short iron sword. SAME character and restrained crisp outlined game sprite style. One COMPLETE connected horse+rider per cell, not separated parts. Direction throughout ALL cells: 7 o'clock southwest, facing screen LEFT and toward viewer. Orthographic tactical RPG three-quarter view.
Exactly 4 columns x 4 rows, sixteen equal square cells on a square canvas. No text, grid lines, backgrounds or shadows. Generous clear gutters, each figure occupies at most 72% cell height and 72% width, centered on identical ground anchor. SAME horse and rider scale in all sixteen cells. Feet baseline identical, no camera motion.
Row1 four subtle idle breathing frames, horse standing, hand on reins, sword low.
Row2 four sequential WALK CYCLE frames: distinct alternating horse leg support and lifted legs, synchronized subtle rider pelvis movement, in place. Clear articulated equine walking gait, NO sliding whole picture.
Row3 four sequential sword attack frames: anticipation sword raised, forward slash, follow through, recover. Horse stays grounded. Sword stays in right hand, left hand reins.
Row4 four sequential command skill frames: prepare sword, raise sword in command, restrained small pale gold light at sword tip, lower to recover. This is a fictional command animation.
Head neck shoulders arms connected anatomically; two rider legs straddle saddle, far leg occluded. No detached limbs, duplicated heads, extra legs or weapons. Sword not spear. Keep clear silhouettes and flat limited shading. All 16 cells separated with transparent margins.

수정 프롬프트:
Edit this animation sprite sheet for technical layout ONLY. Preserve all sixteen exact characters, poses, directions, colors and 4x4 ordering. Make every sprite substantially smaller inside its own equal square cell, maximum 65% of cell height and width including sword. Align each horse standing ground at 85% cell height. Each cell has at least 12% empty transparent margin on ALL four sides. CRITICAL remove ALL golden glow, sparks, magic effects from the bottom row, keep the raised sword command poses. The existing bottom-row glow overlaps horses above; REMOVE it entirely and reconstruct clean complete hooves above. Every sprite must be completely separated by wide transparent gutters. No added text, grid, borders, backdrop. True transparent background. Keep integrated horse/rider, same scale throughout.

### nw

Create a precise transparent animation sprite sheet for the attached Wang Geon mounted Korean ruler reference. Keep his black cap, navy long robe, cream edges, face, plain brown horse, plain saddle and short iron sword. SAME character and restrained crisp outlined game sprite style. One COMPLETE connected horse+rider per cell, not separated parts. Direction throughout ALL cells: 11 o'clock northwest, facing screen LEFT and AWAY from viewer, show BACK. Orthographic tactical RPG three-quarter view.
Exactly 4 columns x 4 rows, sixteen equal square cells on a square canvas. No text, grid lines, backgrounds or shadows. Generous clear gutters, each figure occupies at most 72% cell height and 72% width, centered on identical ground anchor. SAME horse and rider scale in all sixteen cells. Feet baseline identical, no camera motion.
Row1 four subtle idle breathing frames, horse standing, hand on reins, sword low.
Row2 four sequential WALK CYCLE frames: distinct alternating horse leg support and lifted legs, synchronized subtle rider pelvis movement, in place. Clear articulated equine walking gait, NO sliding whole picture.
Row3 four sequential sword attack frames: anticipation sword raised, forward slash, follow through, recover. Horse stays grounded. Sword stays in right hand, left hand reins.
Row4 four sequential command skill frames: prepare sword, raise sword in command, restrained small pale gold light at sword tip, lower to recover. This is a fictional command animation.
Head neck shoulders arms connected anatomically; two rider legs straddle saddle, far leg occluded. No detached limbs, duplicated heads, extra legs or weapons. Sword not spear. Keep clear silhouettes and flat limited shading. All 16 cells separated with transparent margins.

수정 프롬프트:
Edit this animation sprite sheet for technical layout ONLY. Preserve all sixteen exact characters, poses, directions, colors and 4x4 ordering. Make every sprite substantially smaller inside its own equal square cell, maximum 65% of cell height and width including sword. Align each horse standing ground at 85% cell height. Each cell has at least 12% empty transparent margin on ALL four sides. CRITICAL remove ALL golden glow, sparks, magic effects from the bottom row, keep the raised sword command poses. The existing bottom-row glow overlaps horses above; REMOVE it entirely and reconstruct clean complete hooves above. Every sprite must be completely separated by wide transparent gutters. No added text, grid, borders, backdrop. True transparent background. Keep integrated horse/rider, same scale throughout.

### ne

Create a precise transparent animation sprite sheet for the attached Wang Geon mounted Korean ruler reference. Keep his black cap, navy long robe, cream edges, face, plain brown horse, plain saddle and short iron sword. SAME character and restrained crisp outlined game sprite style. One COMPLETE connected horse+rider per cell, not separated parts. Direction throughout ALL cells: 2 o'clock northeast, facing screen RIGHT and AWAY from viewer, show BACK. Orthographic tactical RPG three-quarter view.
Exactly 4 columns x 4 rows, sixteen equal square cells on a square canvas. No text, grid lines, backgrounds or shadows. Generous clear gutters, each figure occupies at most 72% cell height and 72% width, centered on identical ground anchor. SAME horse and rider scale in all sixteen cells. Feet baseline identical, no camera motion.
Row1 four subtle idle breathing frames, horse standing, hand on reins, sword low.
Row2 four sequential WALK CYCLE frames: distinct alternating horse leg support and lifted legs, synchronized subtle rider pelvis movement, in place. Clear articulated equine walking gait, NO sliding whole picture.
Row3 four sequential sword attack frames: anticipation sword raised, forward slash, follow through, recover. Horse stays grounded. Sword stays in right hand, left hand reins.
Row4 four sequential command skill frames: prepare sword, raise sword in command, restrained small pale gold light at sword tip, lower to recover. This is a fictional command animation.
Head neck shoulders arms connected anatomically; two rider legs straddle saddle, far leg occluded. No detached limbs, duplicated heads, extra legs or weapons. Sword not spear. Keep clear silhouettes and flat limited shading. All 16 cells separated with transparent margins.

수정 프롬프트:
Edit this animation sprite sheet for technical layout ONLY. Preserve all sixteen exact characters, poses, directions, colors and 4x4 ordering. Make every sprite substantially smaller inside its own equal square cell, maximum 65% of cell height and width including sword. Align each horse standing ground at 85% cell height. Each cell has at least 12% empty transparent margin on ALL four sides. CRITICAL remove ALL golden glow, sparks, magic effects from the bottom row, keep the raised sword command poses. The existing bottom-row glow overlaps horses above; REMOVE it entirely and reconstruct clean complete hooves above. Every sprite must be completely separated by wide transparent gutters. No added text, grid, borders, backdrop. True transparent background. Keep integrated horse/rider, same scale throughout.

최종 파일 합계: 387742 bytes.

검증: 64장 크기·투명 여백 검사, 시트 육안 확인, 프로덕션 빌드 성공, 로컬 /characters HTTP200 및 새 프레임 경로 확인. 실제 브라우저 재생·모바일 기기 검수는 별도이며 사용자 검토가 필요하다. 생성 대형 PNG8장 정리 완료.

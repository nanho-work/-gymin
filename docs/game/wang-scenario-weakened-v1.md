# 왕건 시나리오·쇠약 모션

군웅 기본 단계의 하마 서 있기 16장과 탑승 쇠약16장. 4방향(nw/ne/se/sw), 방향별4프레임, 160px 투명 WebP. 하마 높이112px, 탑승126px, 접지y150. 품질78, 합계142402bytes.

기병도 시나리오용 하마 서 있기 모습이 필요하다. HP30% 이하 또는 상태 이상은 전투 탑승 전용 쇠약 모션을 공유한다. 현재는 수동 비교 UI이며 실제 게임 판정과 행동 우선순위는 미연결이다. 모든 상태 이상이 행동 불능이라는 뜻은 아니다. 하마 쇠약, 하마 이동·공격, 승급 모션은 미제작이다.

출력: web/public/images/playable/wang-geon/scenario-standing-v1 및 weakened-v1. 파일명 {방향}-0-{프레임}.webp. 서 있기360ms, 쇠약300ms. 기수와 말이 연결된 완성 프레임, 말은 서 있고 기수가 숙이는 모습.

내장 image_gen 사용. 프롬프트:
standing
Create transparent tactical RPG sprite sheet of reference Korean ruler Wang Geon DISMOUNTED, standing on his own two feet, NO HORSE. Same black cap, navy long court robe with cream edges, brown belt, moustache, short iron sword lowered. Full connected body with long robe lower half, boots, normal slim human proportions. Exactly FOUR rows and FOUR columns in equal square cells, square sheet. Each ROW is a direction: row1 11 o'clock BACK facing upper left; row2 2 o'clock BACK facing upper right; row3 5 o'clock FRONT facing lower right; row4 7 o'clock FRONT facing lower left. Four columns are subtle breathing idle animation, feet remain planted, 4 frames same person, constant scale. Every sprite entirely within middle 65% of its cell, at least 15% transparent gutter all sides. Ground baseline same within each cell. This is scenario dialogue standing idle, NOT movement or fighting. Crisp outlined limited navy/cream/brown palette, mobile-readable matching reference. No text, grid, effects, detached body parts.

weakened
Create transparent tactical RPG sprite sheet of reference mounted Korean ruler Wang Geon and his brown horse. Same black cap, navy robe cream edges, brown horse, short sword and plain tack. Complete connected rider+horse. Exactly FOUR rows FOUR columns, equal square cells, square sheet. Row1 11 o'clock BACK upper left; row2 2 o'clock BACK upper right; row3 5 o'clock FRONT lower right; row4 7 o'clock FRONT lower left. Four columns are a looping weakened/dazed animation: rider bends forward head low, gently slumps left, center, gently slumps right. Head droops visibly, shoulders tired; both arms anatomically connected, left hand stays holding reins, right holds short sword low safely. Horse stands STILL with same planted feet, NO walking. Rider never falls off. Subtle coherent four frame motion with constant horse position, saddle and body scale. Every sprite within central65% of cell, generous transparent gutters at least15% each edge. Same ground baseline each cell. No stars, no glow, no blood, no text or lines. Strong readable silhouette, same restrained outlined game style. This is battle low HP/status incapacitated idle, not attack.
수정:
Edit ONLY cell at THIRD ROW FOURTH COLUMN of this 4x4 sprite sheet. It incorrectly faces left. Replace that single pose with SAME horse and rider facing RIGHT southeast 5 o'clock exactly like the other three cells in row3. Rider remains slumped tired, slightly leaning to his right, horse feet planted. Preserve every other fifteen cell unchanged, preserve layout and colors and transparent background. No mirroring of whole sheet. No new text. This corrects an animation direction error.

시나리오 하마 서 있기 기준 수정: 무기와 칼집 없이 빈손으로 자연스럽게 서 있는 모습으로 제작한다. 전투 탑승 무기와 구분한다. 왕건 scenario-standing-v2 4방향16프레임 적용.

image_gen v2 prompt:
Edit this 4x4 Korean ruler Wang Geon scenario idle sprite sheet. REMOVE every sword, weapon, scabbard from all sixteen figures. Both hands EMPTY, relaxed naturally beside robe, no gripping invisible handles. Preserve black cap navy robe cream trim brown belt face proportions and exact sixteen poses and direction ordering: row1 back upper left, row2 back upper right, row3 front lower right, row4 front lower left. Four columns subtle standing breathing. No horse. Preserve scale, ground anchor, wide transparent cell gutters. Remove green backdrop to TRUE TRANSPARENT background. No shadows, grids, text, effects. Complete connected character sprites with clean hands. This is peaceful scenario dialogue standing, absolutely no weapons.
16 WebP frames: 52262 bytes.

사용자 승인: 왕건의 현행 완성 프레임 세트(탑승 full-frame-v1, 무기 없는 시나리오 scenario-standing-v2, 탑승 쇠약 weakened-v1)를 왕건 카드의 적용 기준으로 확정했다. 승급·하마 이동 등 미제작 범위는 그대로 유지한다.

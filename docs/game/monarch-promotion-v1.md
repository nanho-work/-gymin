# 세 군주 승급 정지 초안 (2026-10-29)

기본 군웅→중간 영웅→최종 패왕, 5시 방향 탑승. 기본은 승인된 monarch-comparison-v1 그대로 유지. 새6개는 monarch-promotion-v1/{인물}-1.webp 및 -2.webp. 160×160 투명 WebP, 발굽 기준선150. 일체형 정지 초안이며 기존 모션을 대체하지 않음.

## 디자인
- 왕건: 남색과 흰 깃 유지. 중간 금테 관모·예복, 최종 왕관·왕의 망토·남색 금테 마갑.
- 궁예: 삭발과 먹빛·황토색 유지. 중간 넓은 가사·염주·의장 마구, 최종 의례관·겹가사·연꽃 마갑.
- 견훤: 수염과 붉은색·철색 유지. 중간 관형 투구·어깨 갑옷, 최종 붉은 술 투구·긴 망토·중갑 마갑.
복식은 판타지 창작. 역사적 복식 재현으로 단정하지 않음.

## 제작
built-in imagegen. 각 인물 기본 WebP를 참조해 두 칸 승급 시트 생성.
공통 프롬프트: TWO CELL transparent horizontal sprite sheet; LEFT middle promotion RIGHT final promotion; same face slim body proportions; southeast static whole connected horse and rider; crisp dark contour limited palette mobile readable; generous padding no clipping no text; distinct rank silhouettes via costume headgear and horse equipment.
인물별 프롬프트: 왕건 navy royal robe / gold edged cap / sovereign crown navy mantle gold barding; 궁예 charcoal monk ochre sash beads / three leaf ritual crown layered mantle lotus barding; 견훤 red charcoal lamellar / crown helmet / red plume cape heavy barding.
생성 원본 PNG는 저장소에 추가하지 않음. 경량화 및 연결 확인 후 이번 생성 원본만 정리.

검증: production build 성공, 로컬 인물 페이지 3열 표시 확인. 원본6개 이미지를 중간·최종 각각 독립160px 투명 파일로 저장.
이번 생성 원본 PNG 3개 정리 완료. 경량 WebP 6개 합계42,650바이트.

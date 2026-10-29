# 왕건·궁예·견훤 승급별 전용 모션 — 2026-10-29

## 범위
- 각 3승급, 4방향(11시/nw, 2시/ne, 5시/se, 7시/sw).
- 탑승 대기·이동·공격·스킬 각4프레임, 빈손 하마 서 있기4프레임, 탑승 쇠약4프레임.
- 총864프레임. 말과 기수를 함께 그린 일체형 이미지이며 관절 분할 합성이 아니다.
- 승급 고정 외형 세트. 개별 장비 선택에 따른 외형 교체 및 게임의 실제 HP/상태 판정 구현은 포함하지 않는다.
- 원본 능력치는 변경하지 않는다. 궁예의 3단계는 전용 외형 비교 단계이며 원본 서량기병 승급 규칙을 추가한 것이 아니다.

## 연결
`web/src/features/game-world/data/monarch-motions.json`이 전용 데이터다.
왕건 원본ID0, 궁예127, 견훤32·163. 병과ID가 아니라 인물ID가 우선하므로 다른 군웅은 기존 병과 모션을 사용한다.
`GeneralCompleteMotion`에서 승급·방향·동작·탑승/서 있기/쇠약을 선택하고 재생한다.
기존 정지 비교와 이전 모션 파일은 보존한다.

## 제작·패키징
승인된 monarch-comparison-v1 / monarch-promotion-v1 이미지를 참조하여 built-in imagegen으로 생성.
공통 프롬프트: exact reference identity/costume/mount; whole connected horse+rider; crisp dark outlined limited-palette tactical RPG sprites; four directions NW NE SE SW; equal scale; hooves baseline; clear margins; right weapon hand left reins; no background/text/grid; dismounted empty hands no scabbard; mounted weak droop/recover.
전투는8열8행, 서 있기/쇠약은8열4행으로 생성. 누락·잘못된 방향은4열2행으로 해당 동작을 재생성. 최종 견훤11시 쇠약은4열1행으로 재생성.
프레임별 실제 연결 개체 경계로 추출하여 불균등한 칸 간격을 보정한다. 시트 방향 순서는 육안 확인에 따라 매핑한다. 좌우반전으로 무기 손을 바꾸지 않는다.
160×160 투명 WebP, 품질78, 바닥 기준y150, 좌우 여백 최소6px. 동작별 개별 확대 대신 방향별 공통 배율을 사용하고 추가 생성 시트는 말 하부 크기로 배율을 맞춘다.

## 검증과 한계
전체 파일 수·크기·투명도·이미지 경계 검사, 인물ID 연결 검사, production build 및 브라우저 대표 동작 재생 확인.
프레임별 미세 복식·팔다리 형태 차이가 남을 수 있는4프레임 시각 초안이다. 실제 전투에 들어가는 최종 애니메이션/판정까지 검증한 것은 아니다.

최종 WebP 합계: 6,301,904바이트 (864개).

이번 작업 생성 원본 38개, 71,273,389바이트 정리 완료. 다른 작업 원본과 기존 모션은 보존.

# 이야기 메뉴 시나리오 열람 — 2026-10-30

기준 원고: `scenario-production-v1/`. 기존44전투 제안 데이터는 보존하고 사이트 이야기 메뉴만58전투 패키지 기준으로 교체했다.

- 상황 / 대본 / 배경·장애물 / 보상으로 구분한다.
- 464개 연출 장면, 연결 사건과 설화 동료, 제작 기준을 열람한다.
- 공통·역사·허구 필터와 검색을 제공한다. `?stage=B29&panel=script` 형태로 선택을 저장해 새로고침과 뒤로가기를 지원한다.
- 원본112개 배경/지도 PNG를 최대640×480 WebP(quality68, effort5)로 변환했다. 총3,026,534바이트. 원본 변경/삭제 없음.
- 448개는 지급 확정 아이템 수가 아니라 원본 전투/이야기의 op61·op89 획득/정산 요청 수다. 상호 배타적인 이벤트를 합산하지 않는다. 별도 금전 증감과 상점 거래는 제외했다.
- 지형 개수는 초기 맵 기준이며 실제 지형 효과나 전투 중 변경을 실행하지 않는다.
- `scripts/game/build-story-site.py`는 `JOJO_ASSETS` 환경변수로 기존 추출 assets 경로를 받는다. `STORY_OUTPUT`(기본 /tmp/story-site)에 화면 JSON과 이미지 변환 목록을 작성한다. 화면 JSON은 `web/src/features/game-world/data/story-site.json`에 복사한다.
- 이미지 변환은 목록의 source를 sharp로 읽어 resize({width:640,height:480,fit:'inside',withoutEnlargement:true}).webp({quality:68,effort:5})로 수행하며 `web/public/images/story-reference/`에 저장한다.

검증: 58개 고유 전투 ID,464장면, 각 전투 내 보상 키 중복 없음, 아이템 ID0~103, 모든 참조 이미지 존재, Next.js 프로덕션 빌드 성공. 로컬 UI에서 스테이지 검색·대본 펼치기·보상·배경 표시·새로고침 후 선택 유지와390px 모바일 폭을 확인했다. 엔진 통합·원본 대조 검증 완료를 뜻하지 않는다. 커밋·푸시·배포 없음.

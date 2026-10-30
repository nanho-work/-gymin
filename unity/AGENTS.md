# Unity 작업 지침

- 작업 전 README.md와 docs/architecture.md를 읽는다. 기존 웹/원본 macOS 복원 프로젝트는 보존한다.
- Assets/Game/Features/<기능>에 기능을 두고 Core(순수 데이터·엔진) / Infrastructure(입출력) / Presentation(화면)을 필요한 만큼 분리한다.
- Core에서 UnityEngine, MonoBehaviour, Resources, 파일/환경변수를 사용하지 않는다. 화면이 판정이나 데이터 로딩을 직접 구현하지 않는다.
- 공통 표시/캐시는 Shared, 시작·주입은 App에 둔다. 인물·스테이지마다 엔진 코드를 복사하지 않는다. 미구현 기능용 빈 틀을 완료로 표시하지 않는다.
- Resources/Campaign은 생성물이다. 대본은 기존 사이트 데이터, 배역 매핑은 config/unity/export.json, 실행 설정은 Resources/Settings/runtime.json에서 관리한다.
- 경로 환경변수는 scripts/game/unity/environment.mjs에서만 처리한다. 게임 번들에 비밀키를 넣지 않는다. env 파일은 자동 로딩하지 않는다.
- scripts/game/export-unity.mjs로 재생성하고 scripts/game/unity/check.mjs로 영향 범위를 검사한다. 에디터 가능 시 editor-check.mjs 및 Play 확인을 구분해 기록한다.
- Unity .meta는 파일 이동 시 함께 이동한다. 기존 씬과 빌드 씬 목록을 덮어쓰지 않는다. Library/Temp/Builds를 커밋하지 않는다.
- 사용자 승인 없는 커밋·푸시·배포는 하지 않는다.

- 게임 제작 순서와 단계 완료 기준은 docs/production-roadmap.md를 따른다. 기본 진입은 Game 씬이며 대본 뷰어 실행을 실제 전투 완성으로 보고하지 않는다.
- 지형은 export-unity-board.mjs로 재생성한다. 원본 데이터 경로는 SANHA_ORIGINAL_ASSETS. 지형 선택은 통행/이동 규칙 구현을 의미하지 않는다.

- B00 초기 병력은 docs/first-stage-deployment.md 기준. export-unity-units.mjs로 재생성하며 숨김 병력이나 도입 퇴장 병력을 초기에 표시/점유시키지 않는다. 턴 이벤트/AI를 재생한 상태로 보고하지 않는다.

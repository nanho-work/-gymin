# Unity 개발 구조와 반복 작업 기준

2026-10-30 사용자 요청 적용. 이 기준은 현재 시작 프로젝트와 이후 작업의 공통 규칙이다. 기존 웹사이트와 원본 macOS 복원 프로젝트는 별도로 보존한다.

## 책임과 의존 방향

```text
App/AppBootstrap (구성·시작·의존성 주입)
  ├─ Features/Scenario/Presentation (화면)
  │    ├─ Features/Scenario/Core (데이터 계약·진행 엔진)
  │    └─ Shared/UI, Shared/Assets (공통 표현 부품)
  ├─ Features/Scenario/Infrastructure (Resources 데이터 공급)
  │    └─ Core/ICampaignRepository
  └─ Shared/Configuration (게임 실행 설정)
```

- Core는 순수 C#이다. UnityEngine, MonoBehaviour, UI, Resources, 환경변수, 파일 시스템에 의존하지 않는다. asmdef의 noEngineReferences로 Unity 참조를 차단한다.
- Presentation은 사용자 입력을 엔진 명령으로 전달하고 상태를 표시한다. 대사 진행·전투 수식을 UI에 넣지 않는다.
- Infrastructure는 외부 데이터 읽기를 맡는다. ResourcesCampaignRepository를 파일/Addressables/서버 공급자로 바꾸더라도 ICampaignRepository와 엔진 계약은 유지한다. 현재는 Resources만 구현했다.
- App은 의존 객체를 만들고 연결하는 유일한 시작점이다. 전역 서비스 탐색기나 모든 씬에 자동 삽입되는 화면은 사용하지 않는다.
- Shared에는 기능명을 모르는 부품만 둔다. DialoguePanel은 화자/문자열/영역, PlaybackControls는 상태/콜백만 받는다. 왕건·B00·특정 스킬 판정을 넣지 않는다.
- ScenarioCursor는 시나리오 내부 공통 엔진이다. 엔진이라고 해서 무조건 Shared로 옮기지 않는다.

## 현재 파일 구조

```text
unity/
  Assets/Game/
    App/AppBootstrap.cs
    Features/Scenario/
      Core/Data/                  # 직렬화 DTO, 공급자 인터페이스
      Core/Domain/                # 대사 진행, 데이터 검사
      Infrastructure/            # Resources JSON 공급자
      Presentation/              # 스테이지 화면, 인물·배경 표시
    Shared/
      Assets/TextureCatalog.cs    # 이미지 경로 해석과 캐시
      Configuration/RuntimeSettings.cs
      UI/                        # 대화창, 조작부, 화면 좌표 변환
    Editor/                      # 씬 준비, Unity 데이터 검사
  Assets/Resources/
    Campaign/                    # 생성 데이터/이미지, 직접 편집 금지
    Settings/runtime.json        # 버전 관리하는 실행 설정
  Tests/ScenarioCoreTests.cs     # Unity 없이 실행하는 엔진 검사
  docs/architecture.md
config/unity/export.json         # 사람이 편집하는 장면·배역 매핑
scripts/game/export-unity.mjs    # 내보내기 진입점
scripts/game/unity/
  campaign.mjs                  # 순수 데이터 변환/검증
  environment.mjs               # 도구 환경변수 처리
  check.mjs                     # 코드/데이터 검사
  editor-check.mjs              # 실제 Unity 검증
  tests/                        # 변환 회귀 검사
```

Runtime / Scenario.Core / Battle.Core / Campaign.Core / Editor로 분리한다. Battle.Core는 격자 데이터/선택, Campaign.Core는 화면 전이를 담당한다. Editor는 에디터 전용으로 제한한다. 기능별 프로젝트가 더 커질 때 필요한 경계에만 asmdef를 추가한다. 구현하지 않은 Units/Items/Skills/Save 빈 폴더나 가짜 엔진은 만들지 않는다.

## 원본·생성 데이터·설정 구분

| 구분 | 기준 파일 | 편집 방법 |
|---|---|---|
| 시나리오 원고 | docs/game/scenario-production-v1/ | 집필 기준 수정 후 사이트 데이터 재생성 |
| Unity 입력 | web/src/features/game-world/data/story-site.json | 웹/게임 공통 집필 결과를 재사용 |
| 장면별 배역/위치 | config/unity/export.json | 실제 등장인물, 4방향, 프레임 매핑 수정 |
| 인물 이미지 버전 | monarch-motions.json / motion-pilots.json | 기존 에셋 목록의 최신 연결 사용 |
| Unity 생성 데이터 | Resources/Campaign/campaign.json | exporter 재실행; 직접 변경 금지 |
| 생성 이미지 추적 | unity/export-manifest.json | 원본 경로·SHA256·파일 크기 자동 기록 |
| 실행 설정 | Resources/Settings/runtime.json | 시작 스테이지, 데이터 키, 한글 폰트 후보, 개발 화면 기준 크기 |

campaign.json은 schemaVersion=1. 형식 변경 시 exporter·DTO·검증기를 함께 변경한다. ID로 연결하고 배열 순서나 표시 이름으로 스테이지 전이를 추정하지 않는다. 첫 시각 장면에만 배경·배역을 연결했으며 다른 전투는 대본 열람 상태다. 기능의 누락을 기본 성공이나 보상 지급으로 대신하지 않는다.

장면의 실제 지형 위치는 아직 구현 전이다. 현재 x는 화면상의 0~1 연출 위치이며 전투 좌표가 아니다. 무기/갑옷/말을 분할 조합하지 않고 기존 완성 프레임을 사용한다.

## 환경변수와 설정

환경변수는 개발 도구/CI의 머신별 경로만 담당한다. 환경변수 읽기는 environment.mjs 한 곳에서 한다. `.env`를 자동 읽지 않으며 셸에서 export하거나 명령 앞에 지정한다.

| 변수 | 용도 | 미지정 기본값 |
|---|---|---|
| SANHA_UNITY_EDITOR | Unity 실행 파일 절대 경로 | 설치된 macOS 6000.2.6f2 경로 |
| SANHA_UNITY_PROJECT | export/검사 대상 프로젝트 경로 | 저장소의 unity/ |
| SANHA_EXPORT_CONFIG | 배역·연출 매핑 설정 경로 | config/unity/export.json |

```sh
export SANHA_UNITY_EDITOR="/Applications/Unity/Hub/Editor/6000.2.6f2/Unity.app/Contents/MacOS/Unity"
node scripts/game/export-unity.mjs
node scripts/game/unity/check.mjs --compile-unity
node scripts/game/unity/editor-check.mjs
```

상대 경로 환경변수는 명령 실행 디렉터리를 기준으로 해석한다. 개인 환경 파일은 Git에 넣지 않는다. 게임에 번들되는 Resources JSON은 비밀 저장소가 아니다. 현재 서버/API가 없으므로 빈 API URL·가짜 키·미사용 환경별 프로필을 만들지 않는다. 이후 서버가 생기면 공개 endpoint 설정과 서버 비밀을 분리하고, 런타임 로더 한 곳에서 프로필을 검증한다.

runtime.json은 개발용 1280×800 좌표계이며 큰 캔버스에도 기존 고정 영역을 유지한다. 모바일용 반응형 게임 UI와 배포용 한글 폰트는 후속 작업이다. OS 폰트에 의존하는 현재 검토 화면을 모바일 배포 완료로 보지 않는다.

## 새 기능을 만드는 순서

1. 기존 기능과 데이터를 검색한다. 같은 로직이 있으면 공통 엔진/부품을 확장한다.
2. `Features/<기능>/` 아래 필요한 Core/Data·Core/Domain·Infrastructure·Presentation만 만든다.
3. 수치와 판정의 출처, 입출력, 상태 변화, 미지원 범위를 먼저 적는다. 원본 기능은 기존 추출 근거와 원본 실행 사례를 재사용한다.
4. UI와 분리한 엔진을 만들고 경계 조건을 검사한다. 인물별/스테이지별 코드 복사 대신 ID와 데이터를 주입한다.
5. 공통 UI가 실제로 재사용 가능한지 확인하고 Shared로 분리한다. 단순히 비슷한 모양이라는 이유로 전투 규칙까지 합치지 않는다.
6. 공급자를 연결하고 App에서 구성한다. 화면에서는 직접 JSON/환경변수를 읽지 않는다.
7. 영향 범위만 검사하고 생성 데이터/문서/개발 이력을 갱신한다. 사용자 저장과 기존 씬을 보존한다. 커밋·푸시는 사용자 담당.

## 반복 작업과 검증 단계

- export: 현재 필요한14이미지만 변환한다. 불필요한 전체 에셋 복사/원본 삭제 없음. 스키마·장면 참조·배역·입력 파일을 먼저 확인한다.
- check: 원고 불변·58패키지·첫9장면17대사·잘못된 매핑 거절, 순수 C# 이전/다음/경계·초기화·잘못된 데이터·중복ID를 검사한다.
- `--compile-unity`: 설치된 Unity 참조 DLL에 대해 Runtime/Editor 소스를 컴파일한다. 검사 산출물은 시스템 임시 폴더에 둔다.
- editor-check: 실제 에디터의 import/컴파일/Resources 로드/진행 경계 검사를 수행한다. 로그의 성공 표식도 확인하며 프로세스 exit 0만으로 통과 처리하지 않는다.
- 최종 검증: Play 화면·플랫폼 앱 빌드는 별도다. 외부 C# 컴파일 통과가 씬·그래픽·폰트 작동 확인을 대체하지 않는다.
- 2026-10-30 후속 요청으로 Rosetta 설치 및 잘못된 패키지 참조 수정 완료. 실제 import·B00 대본 Play 확인. 범위는 README의 실제 에디터 확인 기록 참고.

참고: Unity 공식 [어셈블리 정의 형식](https://docs.unity3d.com/es/2021.1/Manual/AssemblyDefinitionFileFormat.html), [씬 저장 확인 API](https://docs.unity3d.com/ja/2022.3/ScriptReference/SceneManagement.EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo.html).

## 첫 전장 추가

Features/Battle의 Core(BoardData/BoardState), Infrastructure(ResourcesBoardRepository), Presentation(BattleBoardView)를 분리했다. Features/Campaign의 Core(GameFlow)와 Presentation(GameFlowScreen)이 실제 화면 순서를 구성한다. App이 공급자를 주입한다. 제작 범위/순서는 production-roadmap.md 참고.

## B00 로컬 전투 어댑터

AppBootstrap이 IBattleSession 공급 함수를 주입한다. Battle.Core는 Unity/Swift/파일 경로를 모른다. NativeBattleSession은 프로세스와 JSON, BattleController/CombatUnitView는 입력·렌더링·완료 응답을 담당한다. 원본 실행 상태는 네이티브 엔진, 표시 상태는 Unity에 있다.

hasPending과 고유 token으로 완료 경계를 명시한다. JsonUtility는 누락 객체를 빈 객체로 복원할 수 있으므로 hasPending=false는 Infrastructure에서 null로 정규화한다. 재생 성공 전에 ack를 보내지 않는다. 승인된 미보유 자료는 미적용으로 기록하며 디코딩/재생 오류는 대기를 유지한다. C# 이식 시 IBattleSession 구현을 교체하며, 현재 macOS 백엔드를 모바일 대응 완료로 취급하지 않는다.

# 산하의 맹약 Unity 시작 프로젝트

Unity 6000.2.6f2 기준. 기존 웹의 기획/에셋을 재사용하며 Game 씬에서 실제 첫 전투를 개발한다.

## 현재 상태

- 58개 전투 패키지의 대본 데이터. 실제 한 회차 전투 수가 아님.
- 첫 B00은 I00 도입 포함9장면17대사와 기존 배경/인물 정지 프레임을 연결.
- 나머지는 대본 열람 상태이며 시각 연출/전투 실행 미구현.
- 시작 → 도입 → 출진 준비 → B00 전투 연결. macOS 로컬 복원 엔진으로 이동·취소·대기·공격·AI·증원·승패·보상을 시험한다. 후일담·다음 전투·저장은 후속이다.
- Rosetta2 설치 완료. Unity batch Play에서 B00의7턴 승리/보상과 책략 재생6회를 확인. macOS 전용 어댑터이며 독립 앱/모바일 빌드는 미검증이다. [실행 준비와 한계](docs/first-stage-runtime.md) 참조.

## 시작

1. 설치된 Unity가 요구하는 Rosetta 2를 준비한다(이 Mac은 설치 완료). Apple Silicon 에디터도 부속 도구 때문에 요구할 수 있다. 라이선스는 사용자 계정으로 Unity Hub에서 활성화한다.
2. [첫 전투 실행 연결](docs/first-stage-runtime.md)의 생성 명령을 순서대로 실행한다. web의 sharp와 Swift 컴파일러를 사용한다.
3. Unity Hub에서 이 unity 폴더를 Add 한다.
4. `Sanha > Create Game Scene`을 실행한다. 기존 씬은 덮어쓰지 않는다.
5. `Sanha > Validate Campaign`으로 데이터/에셋/대사 앞뒤 이동 경계를 검사한다.
6. `Assets/Scenes/Game.unity`를 열고 Play. 새 게임 → 이야기 → 출진 준비 → 전장 진입. 전장에서 클릭으로 칸 선택, 드래그/휠로 카메라 조작.

명령줄 검증: Unity 실행 파일에 `-batchmode -nographics -projectPath <unity폴더> -executeMethod Sanha.Editor.ProjectSetup.PrepareAndValidate -quit -logFile <로그경로>`를 전달한다.

## 전체 제작 범위와 순서

1. 현재 기초: ScenarioCursor / 대본 DTO / 기존 데이터 exporter / 첫 시각 미리보기.
2. 전투 도메인: 좌표·지형·유닛·행동·턴 상태와 원본 추출 데이터 연결. 웹 설명을 전투 수식으로 추정하지 않는다.
3. 첫 스테이지 연결: 도입 → 출진 → 실제 이동/공격/AI → 승패 → 조건별 보상 → 후일담. 원본 실행 근거를 재사용한다.
4. 공통 전투 기능: 병과·장비·스킬·상태·승급·증원·장애물. 원본 미지원 명령을 자동 성공 처리하지 않는다.
5. 전체 캠페인: 파일 번호+1이 아닌 조건부 전이 그래프, 역사/허구 분기, 인물 충돌 해결.
6. 세이브·불러오기·모바일 UI·한글 폰트 포함·음향·플랫폼 빌드·실제 플레이 확인.

규칙은 별도 C# 도메인으로, 데이터는 생성 JSON으로, 화면은 표현 계층으로 분리한다. 구조와 확장 규칙은 [개발 기준](docs/architecture.md)에 고정했다. 현재 IMGUI는 개발 열람용이다. OS 한글 폰트를 사용하므로 macOS 검토에 한정하며 모바일 배포 전 재배포 가능한 폰트를 포함해야 한다.

## 용량

전체 에셋을 복사하지 않는다. 첫 전투의 배경·인물 모션·원본 효과를 변환하고 아틀라스를 공유한다. 생성 목록/원본 해시는 export-manifest.json을 참고한다. WebP 원본 보존. Library/Temp/Builds는 Git에서 제외하지만 로컬에서는 Unity가 디스크를 사용한다. .meta는 Unity 생성 후 에셋과 함께 커밋한다. 커밋/푸시는 사용자 담당.

## 구조 변경 후 작업 명령

저장소 루트 기준:

```sh
node scripts/game/export-unity.mjs
node scripts/game/unity/check.mjs
node scripts/game/unity/check.mjs --compile-unity
node scripts/game/unity/editor-check.mjs
```

데이터/엔진/화면/설정 분리: Assets/Game/Features/Scenario, Shared, App, Editor. 설정은 Assets/Resources/Settings/runtime.json과 ../config/unity/export.json. 환경변수는 ../config/unity/environment.example 참고. 모든 신규 작업은 AGENTS.md 및 docs/architecture.md 기준을 따른다.

## 구조 정리 검증 — 2026-10-30

- Node 변환/잘못된 매핑/환경변수 검사3개 통과.
- 순수 C# 대사 진행의 앞뒤 경계·초기화·잘못된 데이터 검사 통과.
- 설치된 Unity DLL 대상으로 Core/Runtime/Editor 외부 컴파일 통과. Runtime은 UnityEditor 참조 없이 컴파일.
- 별도 환경변수 출력 경로의 JSON과14개 이미지가 프로젝트 생성물과 바이트 단위로 동일함을 확인. 이미지415,801바이트 유지.
- 실제 Unity import/Play/앱 빌드는 기존 Rosetta 제한으로 미검증. 테스트용 실행파일/DLL은 임시 폴더에만 생성.

## 실제 에디터 확인 — 2026-10-30

- Apple Rosetta 설치 성공 및 Unity 6000.2.6f2 시작 확인.
- Packages/manifest.json의 존재하지 않는 com.unity.modules.textrendering 참조 제거.
- editor-check.mjs 실제 import·컴파일·58패키지 검증 성공. Preview 씬 및 .meta 생성.
- Preview.unity를 열고 Play: B00 첫 장면에서 다음 버튼16회로 마지막9/9 장면 도달. 한글·배경·인물 표시, 전투 상황 배경 전환, 마지막 다음 비활성 확인.
- 이전 버튼으로8/9 장면의 마지막 대사 복귀, 처음부터 버튼으로1/9·1/5 복귀 확인.
- Game 뷰는16:10으로 확인. 9:16은 개발 화면이 축소되므로 모바일 UI 완료를 의미하지 않음.
- 관측한 Play 로그에 C# 컴파일 오류/Exception 없음. 시작 시 라이선스 토큰 갱신 경고가 있었지만 import와 Play는 성공.
- 현재는 대본 미리보기이며 실제 전투/승패/보상/독립 앱 빌드를 검증한 것은 아님.
- 로그: 시스템 임시 폴더 sanha-unity-editor-check.log, /tmp/sanha-unity-play.log.

제작 순서와 현재/다음 단계는 [게임 제작 계획](docs/production-roadmap.md)을 기준으로 진행한다.

## 첫 병력 연결

`node scripts/game/export-unity-units.mjs`로 원본 배치와 제작 캐릭터 연결을 재생성한다. 도입 직후 동맹3·적14, 등장 대기7·도입 퇴장2 구분. 준비 명단과 전장 칸 선택에서 확인한다. 생성 이미지12개 약80KB. 상세: docs/first-stage-deployment.md. 이동/공격/자동 등장은 아직 후속 작업.

# 산하의 맹약 — 게임 기획 기록실

기존 GymIn 프로젝트를 한국풍 턴제 RPG의 시각적 기획 공간으로 전환하고 있습니다. **게임명과 세계관은 아직 제안 초안**이며 사용자가 확정한 설정이 아닙니다.

## 현재 화면

- `/`: 세계관 카드 4개, 클릭 가능한 지역·세력 개념 지도, 미정 항목
- 이야기 흐름: 서막부터 종막까지의 제안 구조
- 인물 도감: 준비 공간. 등록된 인물과 제작된 초상화는 아직 없습니다.
- 변경 기록: 수정 전/후, 수정 이유, 초안/확정 상태
- 세계관과 변경 이력 조회

## 기록 보관 방식

사이트는 읽기 전용입니다. 대화에서 논의한 내용을 로컬의 `web/src/features/game-world/data/world.json`에 반영하고 history에 날짜·변경 이유·이전/이후 내용을 기록합니다. 사용자가 커밋·푸시·배포하면 모든 기기에 같은 내용이 표시됩니다.

사이트 편집·내보내기·브라우저 저장·별도 DB는 사용하지 않습니다. 기존 브라우저 저장값은 읽거나 삭제하지 않습니다.

## 개발

```sh
npm install
npm run dev
npm run build
```

Next.js + React + TypeScript. 화면 구현은 `web/src/features/game-world/pages`, 데이터는 `data`, 홈 진입점은 `web/app/page.tsx`에 있습니다. 모바일에서도 열 수 있는 반응형 화면입니다.

## 다음 작업

1. 시대감, 신령의 비중, 주인공 방식 결정
2. 세계관 확정 사항을 기준 데이터에 반영
3. 캐릭터 초상화·설정·관계·병과 기록 UI
4. 설정 변경 이력을 프로젝트 파일에 누적
5. 기존 서비스 경로 정리 후 도메인 운영 배포

## 기존 프로젝트와 배포

기존 구인 서비스의 서버·DB·인증·경로는 보존했습니다. 신규 홈에서는 기존 인증/API를 호출하지 않습니다. EC2는 사용을 종료했으며 자동 배포 워크플로와 Vercel 빌드 생략 설정을 제거했습니다. 현재 배포 대상은 Vercel의 `web` 프로젝트입니다. 커밋·푸시·실제 배포는 사용자가 직접 진행합니다. 검색 색인 제외 설정은 접근 제한이나 로그인 보안을 대신하지 않습니다.

이전 안내는 [기존 README](docs/game/legacy-project-readme.md), 이전 작업 규칙은 [기존 AGENTS](docs/game/legacy-agents.md)에 있습니다. 기존 인프라 문서는 참고용이며 게임 서버 연결 완료를 의미하지 않습니다.

## Vercel 배포 설정

- Root Directory: `web`
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory / Install Command: 기본값 (Override 끄기)
- Ignored Build Step: Automatic
- Node.js: 22.x (프로젝트의 `engines.node` 요구 범위 내)

현재 게임 기획 홈은 EC2 API 없이 동작합니다. 남겨 둔 기존 구인 서비스의 API 기능은 Vercel로 이식한 상태가 아닙니다. 설정 정리만으로 배포 완료를 의미하지 않으며, 푸시 이후 Vercel의 배포 결과를 확인해야 합니다. 자세한 경계는 [배포 안내](docs/deployment-boundaries.md)를 참고하세요.

## 소개 페이지 디자인

상단 메뉴와 한국풍 콘셉트 아트를 중심으로 세계관·이야기·인물·개발 기록을 소개합니다. 메인 이미지는 `web/public/images/world/sanha-key-art.png`이며 실제 게임 화면이 아닌 AI 생성 콘셉트 아트입니다. 프롬프트는 `docs/game/key-art-prompt.txt`에 기록했습니다.

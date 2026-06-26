# SPARK + IPO 하네스 템플릿

AI 에이전트(Claude Code · Codex CLI · Gemini CLI)와 함께 사용하는 **컨텍스트 엔지니어링 하네스 템플릿**입니다. 웹·모바일(React Native)·데스크탑(Electron)·데이터처리(Node/Python)·라이브러리 등 **프로젝트 유형에 무관하게** 사용합니다.

## 구조

```
project/
├── input/       # 입력·참고 데이터
├── proc/        # 명령 처리 규칙 (SPARK: Spec, Plan, Archive, Research, Knowhow)
│   ├── spec/        # 설계 명세
│   ├── plan/        # 작업 계획
│   ├── archive/     # 비활성 문서
│   ├── research/    # 조사·분석 결과
│   └── knowhow/     # 재사용 프롬프트
├── output/      # 출력 데이터
└── src/         # 소스 코드
```

## 사용법

1. 이 템플릿을 복사하여 새 프로젝트를 시작합니다.
2. 참고자료 또는 입력데이터가 있는 경우 `input/`에 넣고, AI에게 작업을 요청합니다.
3. AI는 `proc/spec/`에 명세를, `proc/plan/`에 계획을, `proc/research/`에 사전 조사를 작성하며 개발을 진행합니다.
4. 결과물이 있는 경우 `output/`에 저장하고, 소스코드는 `src/`에 생성됩니다.
5. AI가 적절한 skill을 호출하여 작업을 진행합니다.

## 멀티 에이전트 지원

Codex·Gemini 는 공용 위치 `.agents/skills/` 를, Claude 는 `.claude/skills/` 를 사용합니다 (Claude 는 `.agents/` 를 읽지 않음). 스킬 변경 시 두 위치를 동기화하세요.

| 플랫폼 | 스킬 위치 | 진입 문서 | 프롬프트 로깅 훅 |
|--------|-----------|-----------|------------------|
| Claude Code | `.claude/skills/<name>/SKILL.md` | `CLAUDE.md` | `.claude/settings.json` |
| Codex CLI | `.agents/skills/<name>/SKILL.md` | `AGENTS.md` | `.codex/config.toml` |
| Gemini CLI | `.agents/skills/<name>/SKILL.md` | `AGENTS.md` ¹ | `.gemini/settings.json` |

¹ Gemini 는 기본적으로 `GEMINI.md` 를 읽으므로, `AGENTS.md` 를 읽도록 `.gemini/settings.json` 의 `context.fileName` 에 지정해 두었습니다.

## 주요 스킬

| 명령 | 설명 |
|------|------|
| `/create-spec` | 명세(Spec) 작성 — `proc/spec/`에 항목별 문서 생성 |
| `/update-plan` | 작업 계획 생성·업데이트 — `proc/plan/` |
| `/update-spec` | 명세·업무규칙 업데이트 — FSD/rules/architecture/nfr/user-flow/api/work-rules/decisions 카테고리, ADR 지원 |
| `/update-research` | 사전 조사·연구 문서 작성 — `proc/research/`, 방안 비교 + 권장안 + 레이어별 구현 제안 |

# 활용 방안

## 개발 흐름 (유형 공통)

1. 이 템플릿을 복사하고, 샘플 `input/` 콘텐츠가 있으면 비웁니다.
2. 만들 프로젝트 유형을 정하고, 필요하면 아래 "프로젝트 유형별 초기화"로 소스 베이스를 생성합니다.
3. `input/` 에 참고 자료를 넣고 AI에게 작업을 요청합니다.
4. AI가 `proc/` 에 명세·계획·리서치를 작성하며 `src/` 에 소스를 만들고, 결과물은 `output/` 에 저장합니다.

## 프로젝트 유형별 초기화

템플릿(IPO 폴더 + SPARK `proc/` + AI 에이전트 설정 `.claude`/`.gemini`/`.codex`)은 유형과 무관하게 동일합니다. **소스 베이스만** 유형에 맞게 생성하세요. 문서·CLI·라이브러리처럼 별도 초기화가 필요 없으면 건너뜁니다.

| 유형 | 초기화 명령 (예시) |
|------|--------------------|
| 웹 (Vite + React + TS) | `npm create vite@latest . -- --template react-ts` |
| 데이터처리 — Node.js(JS/TS) | `npm init -y` |
| 데이터처리 — Python | `uv init` |
| 모바일 — React Native | `npx @react-native-community/cli init .` |
| 데스크탑 — Electron | `npm create @quick-start/electron@latest` |
| 비앱 · 문서 · 라이브러리 | 별도 초기화 없이 `src/` 에 바로 작성 |

> 스택은 강제하지 않습니다. 위는 예시일 뿐, 프로젝트에 맞는 런타임·프레임워크·도구를 자유롭게 선택하세요.

이후 IPO(Input/Process/Output) 폴더 구조, SPARK(Spec/Plan/Archive/Research/Knowhow) 구조, 공용 스킬(`.agents/skills/`), AI 에이전트 설정(`.claude/` + `CLAUDE.md`, `.codex/` + `AGENTS.md`, `.gemini/` + `AGENTS.md`)을 그대로 둔 채 작업을 시작합니다.

## 로깅 훅 (3개 에이전트 공통)

유저가 프롬프트를 입력할 때마다 `proc/archive/prompts/YYYY-MM-DD.md` 에 자동 기록되어 AI와의 대화 이력을 아카이브에 보존합니다. 세 에이전트가 동일한 스크립트(`hooks/log_user_input.ps1` / `.sh`)를 호출합니다.

| 에이전트 | 설정 파일 | 이벤트 |
|----------|-----------|--------|
| Claude Code | `.claude/settings.json` | `UserPromptSubmit` |
| Codex CLI | `.codex/config.toml` | `UserPromptSubmit` |
| Gemini CLI | `.gemini/settings.json` | `BeforeAgent` |

기본값은 **Windows(PowerShell)** 입니다. macOS·Linux 는 `.sh` 로 교체하세요 — 자세한 설정·전환 방법은 [`.claude/hooks/README.md`](.claude/hooks/README.md) 참고.

# Author
ins@doflab.com

# License
MIT License

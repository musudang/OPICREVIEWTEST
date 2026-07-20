# 기술 환경 및 개발 도구

> **작성일**: 2026-07-20 (유저 확정 사항 반영)

## 확정된 스택

| 영역 | 선택 | 비고 |
|---|---|---|
| 프론트엔드 | Vite + React + TypeScript | `npm create vite@latest . -- --template react-ts` 로 초기화 |
| 백엔드 | Node.js + Express (경량) | LLM/STT API 프록시 전용. 상태 없음(stateless) — 유저 데이터 영속 저장 안 함 |
| 데이터 저장 | 브라우저 로컬(IndexedDB) | 서버 DB 없음. 라이브러리는 `idb` 등 경량 래퍼 검토 |
| 패키지 매니저 | npm | |

## 확정 필요(후속 논의)

| 항목 | 옵션 | 비고 |
|---|---|---|
| LLM 제공자 | Anthropic Claude API (제안) / 기타 | API 키 발급·비용 확인 필요, Express 백엔드에서만 사용 |
| STT 방식 | 브라우저 Web Speech API(무료, 정확도 낮을 수 있음) / 외부 STT API(비용 발생, 정확도 높음) | Phase 4 착수 시 결정 |
| 문제 음성 소스 | TTS(자동 생성) / 자체 녹음 | 초기엔 TTS로 시작 검토 |
| 배포 환경 | 로컬 개발 우선, 배포처(Vercel/자체 서버 등) 미정 | 실제 배포 필요 시점에 논의 |

## 디렉토리 배치 (init-project 웹앱 컨벤션 기준)

```
app/    # Vite + React + TS 프론트엔드 (독립 package.json)
svr/    # Express 백엔드 — API 프록시 전용 (독립 package.json)
```

`src/`는 SPARK+IPO 템플릿의 범용 소스 폴더로 남겨두되, 웹앱 카테고리 초기화 컨벤션에 따라 실제 코드는 `app/`(프론트) · `svr/`(백엔드)에 위치한다.

## 실행/개발 정책

- 프론트/백엔드 각각 독립 `package.json` (모노레포 워크스페이스는 필요 시 후속 도입)
- 포트: 프론트 **9000**, 백엔드 **9001**
- 백엔드는 `0.0.0.0`으로 바인딩, **CORS 허용**
- 백엔드는 `.env`로 API 키 관리, 절대 커밋하지 않음(`.gitignore` 반영)

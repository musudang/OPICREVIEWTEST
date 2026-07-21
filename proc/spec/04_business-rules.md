# 운영 로직 및 비즈니스 정책

> **작성일**: 2026-07-20

## 핵심 비즈니스 규칙

| 규칙 | 내용 |
|---|---|
| 문항수 | 난이도 1~2단계: 12문항 / 3~6단계: 15문항 |
| 세트 구조(15문항 기준) | 1: 자기소개(채점제외) / 2~4·5~7: 설문기반 콤보 2세트 / 8~10: 돌발 콤보 / 11~13: 롤플레이 / 14~15: 어드밴스(5~6단계만) |
| 콤보셋 내부 순서 | 묘사 → 습관 또는 비교 → 과거 경험 (첫 문제 유형에 따라 세트 내 패턴이 고정) |
| 재생 제한 | 문제 음성 최대 2회 재생 |
| 녹음 | 재생 종료 후 자동 녹음 시작, 재녹음 불가(단발) |
| 스킵 | 문제 노출 후 10초 경과 시 Skip 버튼 활성화 |
| 난이도 재조정 | 실전 시뮬레이션 모드에서 중간 지점(세트2 종료 후) 1회, "쉬운 문제/그대로/어려운 문제" 3지선다 |
| 전체 시간 | 실전 모드 40분 소프트 타이머(경고만, 강제 종료는 Should 단계에서 정책 확정) |
| 설문-출제 매핑 | 배경설문에서 선택한 카테고리 = 세트1~2(설문기반) 출제 풀, 미선택 카테고리 = 세트3(돌발) 출제 풀 |
| 자유연습 문항수 | 5문제 또는 10문제 중 선택(최대 10). 필터 조건에 맞는 문제 중 무작위로 셔플 후 선택 개수만큼 추출 |
| 세션 시작 조건 | 이름(표시용, 로그인 아님)을 입력해야 "연습 시작" 가능 |

## 부가 기능

### TTS 보이스 선택 (`app/src/lib/tts.ts`)

- 문제 음성은 브라우저 `speechSynthesis`로 재생하되, `lang`이 `en`으로 시작하는 보이스만 후보로 삼는다(그 외 언어 보이스가 영어를 잘못된 억양으로 읽는 문제 방지).
- 자동 선택은 "Multilingual" 표기가 없는 단일 언어 보이스 중 en-US → en-GB → 그 외 순으로 고른다.
- `/settings/voice`에서 유저가 직접 미리듣고 고른 보이스(voiceURI)를 `localStorage`(`opic:tts-voice-uri`)에 저장하면 항상 그 보이스를 우선 사용한다.
- 보이스 목록은 최초 로드 후에도 매번 `getVoices()`를 다시 조회한다(브라우저가 나중에 보이스 카탈로그를 갱신하면 캐시된 배열의 voiceURI가 더 이상 유효하지 않을 수 있음).

### 배경 소음(시험장 웅성거림) (`app/src/lib/ambientNoise.ts`)

- 실제 시험장 소음에 대한 적응 연습을 위해 배경에 사람 웅성거림 소리를 깔아준다.
- **실제 녹음(저작권 있는 음원)을 사용하지 않는다** — Web Audio API로 여러 대역(450/850/1300Hz)의 밴드패스 필터링된 노이즈를 LFO로 천천히 흔들어 합성한 웅성거림이다.
- `/practice/setup`에서 기본값을 켜고 끌 수 있고(`localStorage: opic:ambient-noise-enabled`), `/practice/session` 중에도 실시간으로 토글 가능하다.
- 세션 종료·페이지 이탈 시 반드시 정지한다(메모리 누수·불필요한 오디오 노드 방지).

### 유튜브 배경 영상 팝업 (`app/src/components/YouTubeAmbientPopup.tsx`)

- 유저가 지정한 유튜브 영상(사람 말소리 예시)을 화면 우측 하단에 작은 팝업으로 띄운다.
- **영상을 다운로드하거나 오디오를 추출하지 않는다** — 유튜브 공식 embed(iframe, `youtube.com/embed/{videoId}`)로 유튜브 서버에서 그대로 스트리밍한다. 저작권자의 재생 권리를 그대로 따르므로 재배포·복제 문제가 없다.
- `/practice/setup`에서 기본값을 켤 수 있고, `/practice/session` 중 실시간 on/off 및 팝업 자체의 닫기(✕) 버튼으로도 끌 수 있다.
- 합성 배경 소음과 별개 기능으로, 동시에 켜거나 하나만 켤 수 있다.

## 채점/피드백 로직

### 즉시 규칙기반 점수 (자유연습 모드, STT/LLM 불필요 — 현재 구현됨)

세션 종료 직후 STT·LLM 없이 아래 값만으로 대략적인 등급 구간을 즉시 보여준다. `app/src/lib/scoring.ts`에 구현.

| 지표 | 정의 |
|---|---|
| 완료율 | (건너뛰지 않은 응답 수) / (전체 문항 수) |
| 평균 답변 길이 | 건너뛰지 않은 응답들의 평균 녹음 시간(초) |
| 추정 구간 | 완료율 50% 미만이면 NL~NM. 그 외엔 평균 답변 길이 구간(15초/40초/90초 기준)으로 NM~NH·IL~IM·IM~IH·IH~AL 중 하나 |

이 점수는 발화 내용을 전혀 분석하지 않은 **임시 추정치**이며, Should~Could 단계(아래 정량/정성 피드백)가 구현되면 대체된다. 화면에 "실제 발화 내용은 분석하지 않았다"는 고지를 항상 노출한다.

### 정량 지표 (Phase 4, STT 기반 — LLM 불필요)

문항별 응답 스크립트에서 아래 지표를 계산한다. 이 지표들은 결과 화면 "목표등급 받기 위한 Checklist"에서 Worst/Best/목표등급평균 막대비교로 노출된다(비교 UI 자체는 Phase 5에서 구현, 계산 로직은 Phase 4).

| 지표 | 정의 | 비고 |
|---|---|---|
| 말하기 속도(WPM) | 분당 발화 단어수 | 침묵 구간 제외한 순수 발화 시간 기준 |
| 호흡당 문장 길이 | 문장(또는 호흡 단위) 당 평균 단어수 | 마침표·긴 pause 기준으로 문장 분절 |
| 발화량 | 문항당 총 발화 단어수 | 최소 권장 1~2분 발화 기준과 비교 |
| 침묵/필러 비율 | uh/um 등 필러 및 무음 구간 비율 | |
| 시제 다양성 | 과거/현재/미래 사용 여부 키워드 매칭 | |
| 접속사 다양성 | because/although/however/moreover 등 사전 매칭 | |

### 목표등급 벤치마크 기준표

Worst/Best/목표등급평균 비교에는 **자체 추정 기준표**를 사용한다. 특정 경쟁 서비스의 실측 수치를 그대로 가져오지 않고, ACTFL 등급별 일반적 특징(2-9~10절 참고)을 바탕으로 등급 구간별 대략치(WPM 범위, 문장당 단어수 범위, 문항당 발화량 범위)를 자체적으로 정하여 `benchmarks` 데이터로 관리한다. 이 값은 확정 연구자료가 아닌 **휴리스틱 참고치**임을 결과 화면에 함께 고지한다.

### 정성 피드백 (Phase 5, LLM 기반)

프롬프트에 (1) 질문 원문 (2) 질문 유형(콤보-묘사/습관/비교/경험, 롤플레이, 돌발) (3) STT 스크립트 (4) 목표등급을 입력하여, 아래 두 체계를 함께 응답받는다(JSON).

1. **ACTFL 4대 기준(주 기준)**: Function / Accuracy / Content·Context / Text Type 각각에 대한 코멘트 + 참고용 예상 등급(NL~AH)
2. **보조 4축 레벨바**: Complexity(복잡성) / Accuracy(문법 정확성) / Fluency(유창성) / Coherence(주제 적합성) 각각 Lv 1~9로 표시. **Pronunciation(발음)은 텍스트 기반 STT+LLM 파이프라인으로 평가할 수 없어 현재 범위에서 제외**하고, 별도 음성 분석이 필요한 확장 과제로 로드맵에 남긴다.
   - 주의: ACTFL 기준의 "Accuracy"(문법·어휘·발음·유창성을 종합한 정성적 판단)와 보조축의 "Accuracy"(문법·수일치만 정량화한 하위 지표)는 이름은 같지만 산출 방식이 다르다. 화면에 함께 노출할 때 혼동되지 않도록 레이블을 구분한다(예: "종합 정확성" vs "문법 정확도").
3. **주제 적합도 피드백**: 답변이 질문 의도에서 벗어났는지 판단, 벗어났다면 "등급 하락 가능" 경고 + 구체적 사유 텍스트
4. **문법 교정**: 시제·수일치 오류 문장을 원문(✗) → 교정문(✓) 쌍으로 추출, 해당 구간의 녹음 재생 위치(timestamp)와 함께 반환
5. **롤플레이 논리 구조 평가**: "문제 인식 → 해결책 제안 → 재확인" 구조 충족 여부

LLM 응답은 항상 "AI 추정치이며 실제 ACTFL 평가와 다를 수 있음" 문구와 함께 노출한다.

### 다회차 집계 (Phase 5, 로컬 히스토리 기반)

- 여러 회차의 `llmFeedback`/`transcripts`를 문제 유형(콤보-묘사/습관/비교/경험, 롤플레이, 돌발)별·주제(카테고리)별로 집계해 가장 낮은 평균 등급/점수를 보이는 유형·주제를 "약점"으로 추출
- 결과 화면에 "가장 못한 유형 및 주제" 카드로 노출하고, 해당 유형/주제의 문제를 자유 연습 모드에서 바로 필터링해 재연습할 수 있는 링크 제공

## 로컬 데이터 스키마 (IndexedDB)

```
questions          { id, category, type(combo-desc/combo-habit/combo-compare/combo-exp/roleplay/unexpected/advance/intro), difficulty, promptText, promptAudioUrl }
attempts            { id, mode(practice/exam), userName, startedAt, level(1-6), targetGrade, background(survey선택항목[]), status }
responses           { id, attemptId, questionId, order, audioBlob, durationSec, replayCount, skipped }
transcripts         { responseId, text, wpm, wordsPerSentence, wordCount, fillerRatio, tenseVarietyScore, connectorVarietyScore }
llmFeedback         { responseId, function, accuracy, contentContext, textType, estimatedGrade,
                       auxLevels: { complexity, accuracy, fluency, coherence },
                       topicRelevance: { offTopic, reason },
                       grammarIssues: [{ original, corrected, tag, audioTimestamp }],
                       roleplayLogicCheck, generatedAt }
benchmarks          { targetGrade, wpmRange, wordsPerSentenceRange, wordVolumeRange }  # 자체 추정 기준표, 코드 내 정적 데이터
```

## Validation Rules

| 항목 | 제약 |
|---|---|
| 녹음 최소 길이 | 2초 미만이면 저장 전 경고("답변이 너무 짧습니다") |
| 녹음 최대 길이 | 문항당 3분 초과 시 자동 종료 |
| 배경설문 최소 선택 | Part 4(여가·취미·운동·여행)에서 총 12개 이상 선택 필요 — 여가활동 2개 이상, 취미·관심사 1개 이상, 운동 1개 이상, 휴가·출장 1개 이상 포함 (`05_content-data.md` 실제 화면 기준) |
| LLM 요청 페이로드 | STT 스크립트 없는(무음) 응답은 LLM 요청 생략, "응답 없음" 처리 |

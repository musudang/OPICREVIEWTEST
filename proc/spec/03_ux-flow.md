# 사용자 경험·사용 흐름

> **작성일**: 2026-07-20

## 사용 시나리오

### 시나리오 1 — 신규 유저, 실전 시뮬레이션 최초 이용
1. 홈에서 "실전 시뮬레이션" 선택
2. 배경설문 화면에서 관심 항목 선택(권장 문구: "12개 이상 선택 권장")
3. 난이도(1~6) 선택 → 문항수(12/15) 안내 확인
4. 세트1(2~4번) → 세트2(5~7번) → 중간 난이도 재조정 선택지 → 세트3 돌발(8~10) → 세트4 롤플레이(11~13) → 세트5 어드밴스(14~15, 5~6단계만)
5. 각 문제: 음성 재생(최대 2회) → 녹음(자동 시작) → 완료 시 다음 문제로 자동 이동 / 10초 후 Skip 가능
6. 40분 경과 또는 마지막 문항 종료 시 결과 요약 화면으로 이동
7. 결과 화면에서 정량 지표 + (Should/Could 단계 구현 시) LLM 피드백 확인, 로컬에 자동 저장됨

### 시나리오 2 — 재방문 유저, 짧게 자유 연습
1. 홈에서 "자유 연습" 선택
2. 원하는 유형(콤보/롤플레이/돌발) 또는 주제 태그로 문제 필터링
3. 시간제한 없이 1~3문제만 풀고 종료 가능
4. 결과는 선택적으로 기록보관함에 저장

### 시나리오 3 — 기록 확인
1. 홈 또는 `/history`에서 과거 회차 리스트 조회(날짜/모드/난이도/예상등급)
2. 회차 클릭 → 문항별 녹음 재생 + 피드백 재확인

## Navigation Flow

```
홈 ─┬─ 자유연습 설정 → 자유연습 진행 → (선택)결과저장 → 홈
    ├─ 배경설문 → 난이도선택 → 실전 진행(세트1~5) → 결과요약 → 기록보관함
    └─ 기록보관함 → 회차 상세
```

## UI Components (화면별)

| 화면 | 컴포넌트 |
|---|---|
| 문제 진행 화면 | `QuestionAudioPlayer`(재생횟수 제한), `RecordButton`(상태: idle/recording/done), `ProgressIndicator`(N/전체), `SetTypeBadge`(콤보/롤플레이/돌발/어드밴스), `SkipButton`(10초 딜레이 카운트다운), `SessionTimer`(실전 모드만) |
| 결과 화면 | `ResultHeader`(목표등급 vs 예상등급 배지 + 등급간 위치 progress bar), `ChecklistCard`(지표별: 제목/현재값·목표대비 부족치/개선 팁/`ComparisonBarChart`[Worst·Best·목표평균]), `TopicRelevanceCard`(문항 스크립트 + AI 경고 텍스트), `GrammarIssueList`(원문✗/교정문✓ 쌍 + `AudioSeekButton`), `WeaknessSummaryCard`(가장 못한 유형·주제 + 재연습 링크), `TranscriptView`, `Actfl4CriteriaTabs`, `AuxLevelBars`(Complexity/Accuracy/Fluency/Coherence Lv1-9, 발음 제외), `EstimatedGradeBadge`("AI 추정, 참고용" 라벨 필수), `DisclaimerBanner`, `RetryCTAButton` |
| 설문 화면 | `SurveyCategoryGroup`, `SelectionCounter` |

import type { ResponseRecord } from '../types'

export interface RuleBasedScore {
  totalCount: number
  answeredCount: number
  skippedCount: number
  completionRate: number
  avgDurationSec: number
  estimatedBand: string
  bandNote: string
}

// 규칙기반(임시) 점수: 답변 완료율·평균 녹음 길이만으로 대략적인 추정치를 낸다.
// STT/LLM 채점(proc/spec/04_business-rules.md Phase 4~5)이 연결되기 전까지 사용하는 자리표시자다.
export function computeRuleBasedScore(responses: ResponseRecord[]): RuleBasedScore {
  const totalCount = responses.length
  const answered = responses.filter((r) => !r.skipped)
  const answeredCount = answered.length
  const skippedCount = totalCount - answeredCount
  const completionRate = totalCount === 0 ? 0 : answeredCount / totalCount
  const avgDurationSec =
    answeredCount === 0
      ? 0
      : Math.round(
          (answered.reduce((sum, r) => sum + r.durationSec, 0) / answeredCount) * 10,
        ) / 10

  let estimatedBand = 'NL~NM'
  if (completionRate < 0.5) {
    estimatedBand = 'NL~NM'
  } else if (avgDurationSec < 15) {
    estimatedBand = 'NM~NH'
  } else if (avgDurationSec < 40) {
    estimatedBand = 'IL~IM'
  } else if (avgDurationSec < 90) {
    estimatedBand = 'IM~IH'
  } else {
    estimatedBand = 'IH~AL'
  }

  return {
    totalCount,
    answeredCount,
    skippedCount,
    completionRate,
    avgDurationSec,
    estimatedBand,
    bandNote:
      '답변 완료율과 평균 답변 길이만으로 낸 임시 추정치이며, 실제 발화 내용은 분석하지 않았습니다. AI 채점 연동 전까지 참고용으로만 사용하세요.',
  }
}

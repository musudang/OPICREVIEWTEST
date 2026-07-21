import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { QUESTIONS, CATEGORY_LABELS, TYPE_LABELS } from '../data/questions'
import type { QuestionType, Attempt, ResponseRecord } from '../types'
import { useRecorder } from '../hooks/useRecorder'
import { speak, stopSpeaking } from '../lib/tts'
import { createAttempt, saveResponse, updateAttemptStatus, listResponsesByAttempt } from '../db'
import { shuffle } from '../lib/shuffle'
import { computeRuleBasedScore, type RuleBasedScore } from '../lib/scoring'
import YouTubeAmbientPopup from '../components/YouTubeAmbientPopup'

interface SetupState {
  userName?: string
  categories?: string[]
  types?: QuestionType[]
  questionCount?: number
  youtubePopup?: boolean
}

export default function PracticeSession() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    userName = '익명',
    categories = [],
    types = [],
    questionCount = 10,
    youtubePopup: initialYoutubePopup = false,
  } = (location.state as SetupState) ?? {}

  const questions = useMemo(() => {
    const filtered = QUESTIONS.filter(
      (q) =>
        (categories.length === 0 || categories.includes(q.category)) &&
        (types.length === 0 || types.includes(q.type)),
    )
    const pool = filtered.length > 0 ? filtered : QUESTIONS
    return shuffle(pool).slice(0, questionCount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [index, setIndex] = useState(0)
  const [replayCount, setReplayCount] = useState(0)
  const [ttsError, setTtsError] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState<RuleBasedScore | null>(null)
  const [youtubePopupOn, setYoutubePopupOn] = useState(initialYoutubePopup)
  const attemptRef = useRef<Attempt | null>(null)
  const recorder = useRecorder()

  const current = questions[index]

  useEffect(() => {
    const attempt: Attempt = {
      id: crypto.randomUUID(),
      mode: 'practice',
      userName,
      startedAt: Date.now(),
      status: 'in-progress',
    }
    attemptRef.current = attempt
    createAttempt(attempt)
    return () => {
      stopSpeaking()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggleYoutubePopup() {
    setYoutubePopupOn((on) => !on)
  }

  async function handlePlay() {
    setReplayCount((c) => c + 1)
    const result = await speak(current.promptText)
    if (result.ok) {
      setTtsError(null)
    } else if (result.reason === 'no-english-voice') {
      setTtsError(
        '이 기기에 설치된 영어 음성이 없어 문제를 재생할 수 없습니다. Windows 설정 > 시간 및 언어 > 음성에서 영어 음성을 추가한 뒤 다시 시도해주세요.',
      )
    } else {
      setTtsError('이 브라우저는 음성 재생을 지원하지 않습니다.')
    }
  }

  async function persistResponse(skipped: boolean) {
    if (!attemptRef.current) return
    const blob = recorder.getBlob() ?? new Blob([], { type: 'audio/webm' })
    const response: ResponseRecord = {
      id: crypto.randomUUID(),
      attemptId: attemptRef.current.id,
      questionId: current.id,
      order: index,
      audioBlob: blob,
      durationSec: recorder.durationSec,
      replayCount,
      skipped,
      createdAt: Date.now(),
    }
    await saveResponse(response)
  }

  async function handleNext() {
    await persistResponse(recorder.state !== 'recorded')
    recorder.reset()
    setReplayCount(0)
    setTtsError(null)
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1)
    } else {
      await finishSession()
    }
  }

  async function handleSkip() {
    await persistResponse(true)
    recorder.reset()
    setReplayCount(0)
    setTtsError(null)
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1)
    } else {
      await finishSession()
    }
  }

  async function finishSession() {
    if (!attemptRef.current) return
    setYoutubePopupOn(false)
    await updateAttemptStatus(attemptRef.current.id, 'completed')
    const responses = await listResponsesByAttempt(attemptRef.current.id)
    setScore(computeRuleBasedScore(responses))
    setFinished(true)
  }

  if (finished) {
    return (
      <div className="page">
        <h1>{userName}님의 연습 결과</h1>
        <p className="disclaimer">
          이 프로그램은 OPIc 공식 시험이 아닌 연습용 프로그램이며, 아래 점수는 실제 채점 결과와 다릅니다.
        </p>

        {score && (
          <section className="score-card">
            <div className="score-band">추정 구간: {score.estimatedBand}</div>
            <div className="score-metrics">
              <div>
                <span className="metric-label">답변 완료</span>
                <span className="metric-value">
                  {score.answeredCount} / {score.totalCount}
                </span>
              </div>
              <div>
                <span className="metric-label">완료율</span>
                <span className="metric-value">{Math.round(score.completionRate * 100)}%</span>
              </div>
              <div>
                <span className="metric-label">평균 답변 길이</span>
                <span className="metric-value">{score.avgDurationSec}초</span>
              </div>
            </div>
            <p className="hint">{score.bandNote}</p>
          </section>
        )}

        <button className="primary" onClick={() => navigate('/')}>
          홈으로
        </button>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="session-header">
        <span className="badge">{userName}</span>
        <span className="badge">{index + 1} / {questions.length}</span>
        <span className="badge">{CATEGORY_LABELS[current.category] ?? current.category}</span>
        <span className="badge">{TYPE_LABELS[current.type]}</span>
        <button
          type="button"
          className={`badge-toggle ${youtubePopupOn ? 'badge-toggle-on' : ''}`}
          onClick={toggleYoutubePopup}
        >
          영상 팝업 {youtubePopupOn ? 'ON' : 'OFF'}
        </button>
      </div>

      {youtubePopupOn && <YouTubeAmbientPopup onClose={() => setYoutubePopupOn(false)} />}

      <p className="prompt-text">{current.promptText}</p>

      <div className="controls">
        <button onClick={handlePlay}>{replayCount === 0 ? '문제 듣기' : `다시 듣기 (${replayCount}회)`}</button>

        {recorder.state === 'idle' && <button onClick={recorder.start}>녹음 시작</button>}
        {recorder.state === 'recording' && (
          <button className="recording" onClick={recorder.stop}>
            녹음 중지
          </button>
        )}
        {recorder.state === 'recorded' && (
          <>
            <audio controls src={recorder.audioUrl ?? undefined} />
            <button onClick={recorder.reset}>다시 녹음</button>
          </>
        )}
      </div>

      {ttsError && <p className="disclaimer">{ttsError}</p>}
      {recorder.error && <p className="disclaimer">{recorder.error}</p>}

      <div className="controls">
        <button onClick={handleSkip}>건너뛰기</button>
        <button className="primary" disabled={recorder.state !== 'recorded'} onClick={handleNext}>
          {index + 1 < questions.length ? '저장하고 다음' : '저장하고 종료'}
        </button>
      </div>

      <p className="disclaimer">OPIc 공식 시험이 아닌 연습용 프로그램입니다.</p>
    </div>
  )
}

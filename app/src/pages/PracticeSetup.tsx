import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QUESTIONS, CATEGORY_LABELS, TYPE_LABELS } from '../data/questions'
import type { QuestionType } from '../types'

const QUESTION_COUNT_OPTIONS = [5, 10]

export default function PracticeSetup() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [types, setTypes] = useState<QuestionType[]>([])
  const [questionCount, setQuestionCount] = useState(10)

  const categoryOptions = useMemo(
    () => Array.from(new Set(QUESTIONS.map((q) => q.category))),
    [],
  )
  const typeOptions = useMemo(
    () => Array.from(new Set(QUESTIONS.map((q) => q.type))) as QuestionType[],
    [],
  )

  const matchCount = QUESTIONS.filter(
    (q) =>
      (categories.length === 0 || categories.includes(q.category)) &&
      (types.length === 0 || types.includes(q.type)),
  ).length

  const canStart = userName.trim().length > 0 && matchCount > 0

  function toggle<T>(list: T[], value: T, setter: (v: T[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  function handleStart() {
    navigate('/practice/session', {
      state: { userName: userName.trim(), categories, types, questionCount },
    })
  }

  return (
    <div className="page">
      <h1>자유 연습 설정</h1>

      <section>
        <h2>이름</h2>
        <input
          className="text-input"
          type="text"
          placeholder="이름을 입력하세요"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </section>

      <section>
        <h2>문제 수</h2>
        <div className="chip-group">
          {QUESTION_COUNT_OPTIONS.map((n) => (
            <label key={n} className={`chip ${questionCount === n ? 'chip-on' : ''}`}>
              <input
                type="radio"
                name="questionCount"
                checked={questionCount === n}
                onChange={() => setQuestionCount(n)}
              />
              {n}문제
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2>주제</h2>
        <p className="hint">선택하지 않으면 전체 주제에서 랜덤으로 출제합니다.</p>
        <div className="chip-group">
          {categoryOptions.map((c) => (
            <label key={c} className={`chip ${categories.includes(c) ? 'chip-on' : ''}`}>
              <input
                type="checkbox"
                checked={categories.includes(c)}
                onChange={() => toggle(categories, c, setCategories)}
              />
              {CATEGORY_LABELS[c] ?? c}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2>유형</h2>
        <div className="chip-group">
          {typeOptions.map((t) => (
            <label key={t} className={`chip ${types.includes(t) ? 'chip-on' : ''}`}>
              <input
                type="checkbox"
                checked={types.includes(t)}
                onChange={() => toggle(types, t, setTypes)}
              />
              {TYPE_LABELS[t]}
            </label>
          ))}
        </div>
      </section>

      <p className="hint">
        선택 조건에 맞는 문제: {matchCount}개 · 실제 출제: {Math.min(matchCount, questionCount)}문제
      </p>

      <button className="primary" disabled={!canStart} onClick={handleStart}>
        연습 시작
      </button>
    </div>
  )
}

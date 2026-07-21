import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { QUESTIONS, CATEGORY_LABELS, TYPE_LABELS } from '../data/questions'
import { getSavedUserName } from '../lib/userName'

export default function QuestionList() {
  const navigate = useNavigate()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const groups = useMemo(() => {
    const map = new Map<string, typeof QUESTIONS>()
    for (const q of QUESTIONS) {
      const list = map.get(q.category) ?? []
      list.push(q)
      map.set(q.category, list)
    }
    return Array.from(map.entries())
  }, [])

  function toggleSelect(questionId: string) {
    setSelectedIds((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    )
  }

  function startPractice(questionIds: string[]) {
    navigate('/practice/session', {
      state: {
        userName: getSavedUserName() || '익명',
        questionIds,
      },
    })
  }

  return (
    <div className="page">
      <h1>전체 문제 목록</h1>
      <p className="hint">
        현재 문제은행에 등록된 전체 {QUESTIONS.length}개 문제입니다. 문제를 눌러서 바로 연습하거나, 체크박스로 여러 개를 골라 묶어서 연습할 수 있습니다.
      </p>
      <Link to="/">홈으로</Link>

      <div className="selection-bar">
        <span className="hint">{selectedIds.length}개 선택됨</span>
        <button type="button" disabled={selectedIds.length === 0} onClick={() => setSelectedIds([])}>
          선택 해제
        </button>
        <button
          type="button"
          className="primary"
          disabled={selectedIds.length === 0}
          onClick={() => startPractice(selectedIds)}
        >
          선택한 문제로 연습하기
        </button>
      </div>

      {groups.map(([category, questions]) => (
        <section key={category}>
          <h2>{CATEGORY_LABELS[category] ?? category}</h2>
          {questions.map((q) => (
            <div
              key={q.id}
              className={`question-list-item ${selectedIds.includes(q.id) ? 'question-list-item-selected' : ''}`}
            >
              <label className="question-list-select">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(q.id)}
                  onChange={() => toggleSelect(q.id)}
                />
                선택
              </label>
              <div className="question-list-meta">
                <span className="badge">{TYPE_LABELS[q.type]}</span>
                <span className="badge">난이도 {q.difficulty[0]}~{q.difficulty[q.difficulty.length - 1]}</span>
              </div>
              <p className="question-list-text">{q.promptText}</p>
              <button type="button" onClick={() => startPractice([q.id])}>
                이 문제 연습하기
              </button>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

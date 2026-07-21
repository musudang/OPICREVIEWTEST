import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { QUESTIONS, CATEGORY_LABELS, TYPE_LABELS } from '../data/questions'
import { getSavedUserName } from '../lib/userName'

export default function QuestionList() {
  const navigate = useNavigate()

  const groups = useMemo(() => {
    const map = new Map<string, typeof QUESTIONS>()
    for (const q of QUESTIONS) {
      const list = map.get(q.category) ?? []
      list.push(q)
      map.set(q.category, list)
    }
    return Array.from(map.entries())
  }, [])

  function handlePractice(questionId: string) {
    navigate('/practice/session', {
      state: {
        userName: getSavedUserName() || '익명',
        questionIds: [questionId],
      },
    })
  }

  return (
    <div className="page">
      <h1>전체 문제 목록</h1>
      <p className="hint">현재 문제은행에 등록된 전체 {QUESTIONS.length}개 문제입니다. 문제를 눌러서 바로 연습할 수 있습니다.</p>
      <Link to="/">홈으로</Link>

      {groups.map(([category, questions]) => (
        <section key={category}>
          <h2>{CATEGORY_LABELS[category] ?? category}</h2>
          {questions.map((q) => (
            <div key={q.id} className="question-list-item">
              <div className="question-list-meta">
                <span className="badge">{TYPE_LABELS[q.type]}</span>
                <span className="badge">난이도 {q.difficulty[0]}~{q.difficulty[q.difficulty.length - 1]}</span>
              </div>
              <p className="question-list-text">{q.promptText}</p>
              <button type="button" onClick={() => handlePractice(q.id)}>
                이 문제 연습하기
              </button>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

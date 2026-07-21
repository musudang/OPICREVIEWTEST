import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Attempt } from '../types'
import { listAttempts } from '../db'

export default function Home() {
  const [attempts, setAttempts] = useState<Attempt[]>([])

  useEffect(() => {
    listAttempts().then(setAttempts)
  }, [])

  return (
    <div className="page">
      <h1>OPIc 연습</h1>
      <p className="disclaimer">
        이 프로그램은 OPIc 공식 시험이 아닌 연습용 프로그램이며, 실제 채점 결과와 다를 수 있습니다.
      </p>

      <section className="mode-cards">
        <Link className="mode-card" to="/practice/setup">
          <h2>자유 연습</h2>
          <p>주제·유형을 골라 시간 제한 없이 연습합니다.</p>
        </Link>
        <div className="mode-card mode-card-disabled">
          <h2>실전 시뮬레이션</h2>
          <p>배경설문·난이도 선택부터 재현하는 모드는 준비 중입니다.</p>
        </div>
      </section>

      <section className="mode-cards">
        <Link className="mode-card" to="/settings/voice">
          <h2>보이스 설정</h2>
          <p>문제 듣기에 사용할 영어 음성을 미리듣고 골라서 저장합니다.</p>
        </Link>
        <Link className="mode-card" to="/questions">
          <h2>전체 문제 목록</h2>
          <p>문제은행에 등록된 모든 문제를 주제별로 쭉 볼 수 있습니다.</p>
        </Link>
      </section>

      <section>
        <h2>최근 연습 기록</h2>
        {attempts.length === 0 ? (
          <p className="hint">아직 기록이 없습니다.</p>
        ) : (
          <ul className="attempt-list">
            {attempts.slice(0, 10).map((a) => (
              <li key={a.id}>
                {new Date(a.startedAt).toLocaleString()} · {a.userName ?? '익명'} · {a.mode === 'practice' ? '자유 연습' : '실전'} · {a.status === 'completed' ? '완료' : '진행중'}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

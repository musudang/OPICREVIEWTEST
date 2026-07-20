export type QuestionType =
  | 'intro'
  | 'combo-desc'
  | 'combo-habit'
  | 'combo-compare'
  | 'combo-exp'
  | 'roleplay'
  | 'unexpected'
  | 'advance'

export interface Question {
  id: string
  category: string
  type: QuestionType
  difficulty: number[]
  promptText: string
  setGroup?: string
  order?: number
}

export type AttemptMode = 'practice' | 'exam'
export type AttemptStatus = 'in-progress' | 'completed'

export interface Attempt {
  id: string
  mode: AttemptMode
  userName: string
  startedAt: number
  level?: number
  targetGrade?: string
  background?: string[]
  status: AttemptStatus
}

export interface ResponseRecord {
  id: string
  attemptId: string
  questionId: string
  order: number
  audioBlob: Blob
  durationSec: number
  replayCount: number
  skipped: boolean
  createdAt: number
}

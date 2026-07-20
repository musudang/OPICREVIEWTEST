// Phase 1 임시 문제 음성: 브라우저 내장 TTS 사용 (proc/spec/07_tech-stack.md — 음성 소스 미정 상태의 임시 구현)
// 시스템에 영어 음성이 설치되어 있지 않으면 기본 음성(예: 한국어 음성)이 영어 텍스트를 잘못된 발음으로 읽는 문제가 있어,
// 반드시 lang이 'en'으로 시작하는 보이스만 선택해서 사용한다. 그런 보이스가 하나도 없으면 재생하지 않고 에러를 알린다.

let currentUtterance: SpeechSynthesisUtterance | null = null
let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (voicesPromise) return voicesPromise
  voicesPromise = new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices()
    if (existing.length > 0) {
      resolve(existing)
      return
    }
    window.speechSynthesis.onvoiceschanged = () => resolve(window.speechSynthesis.getVoices())
    // 일부 브라우저는 onvoiceschanged를 안정적으로 쏘지 않으므로 짧은 타임아웃으로 보강한다.
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 800)
  })
  return voicesPromise
}

function isMultilingualVoice(v: SpeechSynthesisVoice): boolean {
  // "Multilingual" 신경망 보이스는 다른 언어 억양이 섞여 나오는 경우가 있어 우선순위를 낮춘다.
  return /multilingual/i.test(v.name) || /multilingual/i.test(v.voiceURI ?? '')
}

function pickEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const englishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
  if (englishVoices.length === 0) return null

  const singleLocale = englishVoices.filter((v) => !isMultilingualVoice(v))
  const pool = singleLocale.length > 0 ? singleLocale : englishVoices

  return (
    pool.find((v) => v.lang.toLowerCase() === 'en-us') ??
    pool.find((v) => v.lang.toLowerCase().startsWith('en-gb')) ??
    pool.find((v) => v.default) ??
    pool[0]
  )
}

export type SpeakFailureReason = 'no-english-voice' | 'unsupported'
export interface SpeakResult {
  ok: boolean
  reason?: SpeakFailureReason
}

export async function speak(text: string): Promise<SpeakResult> {
  if (!('speechSynthesis' in window)) {
    return { ok: false, reason: 'unsupported' }
  }

  const voices = await loadVoices()
  const voice = pickEnglishVoice(voices)
  if (!voice) {
    return { ok: false, reason: 'no-english-voice' }
  }

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.voice = voice
  utterance.lang = voice.lang
  utterance.rate = 0.95
  currentUtterance = utterance

  return new Promise((resolve) => {
    utterance.onend = () => resolve({ ok: true })
    utterance.onerror = () => resolve({ ok: false, reason: 'unsupported' })
    window.speechSynthesis.speak(utterance)
  })
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel()
  currentUtterance = null
}

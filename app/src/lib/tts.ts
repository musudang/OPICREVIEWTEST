// Phase 1 임시 문제 음성: 브라우저 내장 TTS 사용 (proc/spec/07_tech-stack.md — 음성 소스 미정 상태의 임시 구현)
// 시스템/브라우저에 따라 자동으로 고른 영어 보이스가 부자연스러운 경우가 있어(예: Multilingual 보이스가 다른 언어 억양을 섞어 냄),
// 유저가 직접 보이스를 미리듣고 골라서 저장할 수 있는 기능을 제공한다. 저장된 보이스가 있으면 항상 그것을 우선 사용한다.

const SAVED_VOICE_KEY = 'opic:tts-voice-uri'

let currentUtterance: SpeechSynthesisUtterance | null = null
let voicesReady = false
let voicesReadyPromise: Promise<void> | null = null

// getVoices()가 처음 채워질 때까지만 기다리고, 그 이후로는 매번 새로 getVoices()를 호출한다.
// (한 번 캐시해두면 브라우저가 나중에 보이스 목록을 갱신했을 때 voiceURI가 더 이상 일치하지 않아
//  "미리듣기가 항상 같은 보이스로만 재생되는" 문제가 생길 수 있다.)
function waitUntilVoicesReady(): Promise<void> {
  if (voicesReady) return Promise.resolve()
  if (voicesReadyPromise) return voicesReadyPromise
  voicesReadyPromise = new Promise((resolve) => {
    const check = () => {
      if (window.speechSynthesis.getVoices().length > 0) {
        voicesReady = true
        resolve()
        return true
      }
      return false
    }
    if (check()) return
    window.speechSynthesis.onvoiceschanged = () => {
      check()
    }
    // 일부 브라우저는 onvoiceschanged를 안정적으로 쏘지 않으므로 짧은 타임아웃으로 보강한다.
    setTimeout(() => {
      voicesReady = true
      resolve()
    }, 800)
  })
  return voicesReadyPromise
}

async function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  await waitUntilVoicesReady()
  return window.speechSynthesis.getVoices()
}

function isMultilingualVoice(v: SpeechSynthesisVoice): boolean {
  // "Multilingual" 신경망 보이스는 다른 언어 억양이 섞여 나오는 경우가 있어 자동 선택 시 우선순위를 낮춘다.
  return /multilingual/i.test(v.name) || /multilingual/i.test(v.voiceURI ?? '')
}

function pickEnglishVoiceAuto(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
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

const LANG_LABELS: Record<string, string> = {
  'en-us': '영어(미국)',
  'en-gb': '영어(영국)',
  'en-au': '영어(호주)',
  'en-ca': '영어(캐나다)',
  'en-in': '영어(인도)',
  'en-ie': '영어(아일랜드)',
  'en-nz': '영어(뉴질랜드)',
  'en-za': '영어(남아공)',
  'en-ph': '영어(필리핀)',
  'en-sg': '영어(싱가포르)',
  'en-hk': '영어(홍콩)',
  'en-ke': '영어(케냐)',
  'en-ng': '영어(나이지리아)',
  'en-tz': '영어(탄자니아)',
}

const LANG_SORT_ORDER = ['en-us', 'en-gb', 'en-au', 'en-ca']

function langSortKey(lang: string): number {
  const idx = LANG_SORT_ORDER.indexOf(lang.toLowerCase())
  return idx === -1 ? LANG_SORT_ORDER.length : idx
}

export interface VoiceOption {
  voiceURI: string
  label: string
  lang: string
}

export async function getEnglishVoiceOptions(): Promise<VoiceOption[]> {
  const voices = await loadVoices()
  const englishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))

  const countByLang = new Map<string, number>()
  const sorted = [...englishVoices].sort((a, b) => {
    const order = langSortKey(a.lang) - langSortKey(b.lang)
    return order !== 0 ? order : a.lang.localeCompare(b.lang)
  })

  return sorted.map((v) => {
    const langKey = v.lang.toLowerCase()
    const n = (countByLang.get(langKey) ?? 0) + 1
    countByLang.set(langKey, n)
    const cleanName = v.name && !/undefined/i.test(v.name) ? v.name : null
    const langLabel = LANG_LABELS[langKey] ?? v.lang
    const label = cleanName ? `${cleanName} (${v.lang})` : `${langLabel} 보이스 #${n}`
    return { voiceURI: v.voiceURI, label, lang: v.lang }
  })
}

export function getSavedVoiceURI(): string | null {
  try {
    return localStorage.getItem(SAVED_VOICE_KEY)
  } catch {
    return null
  }
}

export function saveVoiceURI(voiceURI: string | null): void {
  try {
    if (voiceURI) {
      localStorage.setItem(SAVED_VOICE_KEY, voiceURI)
    } else {
      localStorage.removeItem(SAVED_VOICE_KEY)
    }
  } catch {
    // localStorage 접근 불가 환경(프라이빗 모드 등)에서는 조용히 무시 — 세션 동안은 자동 선택으로 동작
  }
}

async function resolveVoice(preferredVoiceURI?: string | null): Promise<SpeechSynthesisVoice | null> {
  const voices = await loadVoices()
  if (preferredVoiceURI) {
    const saved = voices.find((v) => v.voiceURI === preferredVoiceURI)
    if (saved) return saved
  }
  return pickEnglishVoiceAuto(voices)
}

export type SpeakFailureReason = 'no-english-voice' | 'unsupported'
export interface SpeakResult {
  ok: boolean
  reason?: SpeakFailureReason
}

async function speakWithVoiceLookup(text: string, preferredVoiceURI: string | null | undefined): Promise<SpeakResult> {
  if (!('speechSynthesis' in window)) {
    return { ok: false, reason: 'unsupported' }
  }

  const voice = await resolveVoice(preferredVoiceURI)
  if (!voice) {
    return { ok: false, reason: 'no-english-voice' }
  }

  return new Promise((resolve) => {
    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = voice
      utterance.lang = voice.lang
      utterance.rate = 0.95
      currentUtterance = utterance
      utterance.onend = () => resolve({ ok: true })
      utterance.onerror = () => resolve({ ok: false, reason: 'unsupported' })
      window.speechSynthesis.speak(utterance)
    }

    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel()
      // Chrome/Edge는 cancel() 직후 바로 speak()를 호출하면 새 voice가 무시되고
      // 이전에 재생 중이던 보이스로 다시 재생되는 경우가 있어 한 틱 쉬었다가 호출한다.
      setTimeout(doSpeak, 50)
    } else {
      doSpeak()
    }
  })
}

// 문제 음성 재생: 저장된 보이스가 있으면 그걸 쓰고, 없으면 자동 선택 로직을 쓴다.
export function speak(text: string): Promise<SpeakResult> {
  return speakWithVoiceLookup(text, getSavedVoiceURI())
}

// 보이스 설정 화면의 "미리듣기" 전용: 저장 여부와 무관하게 특정 보이스로 재생한다.
export function previewVoice(voiceURI: string, sampleText = 'Hello, this is a sample of my voice.'): Promise<SpeakResult> {
  return speakWithVoiceLookup(sampleText, voiceURI)
}

export function stopSpeaking() {
  if (currentUtterance) {
    window.speechSynthesis?.cancel()
    currentUtterance = null
  }
}

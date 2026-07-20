import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getEnglishVoiceOptions,
  getSavedVoiceURI,
  saveVoiceURI,
  previewVoice,
  type VoiceOption,
} from '../lib/tts'

export default function VoiceSettings() {
  const [voices, setVoices] = useState<VoiceOption[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [previewing, setPreviewing] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getEnglishVoiceOptions().then((list) => {
      setVoices(list)
      setLoading(false)
    })
    setSelected(getSavedVoiceURI())
  }, [])

  async function handlePreview(voiceURI: string) {
    setPreviewing(voiceURI)
    await previewVoice(voiceURI)
    setPreviewing(null)
  }

  function handleSave() {
    saveVoiceURI(selected)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleUseAuto() {
    setSelected(null)
    saveVoiceURI(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="page">
      <h1>보이스 설정</h1>
      <p className="hint">
        문제 듣기에 사용할 영어 음성을 직접 골라보세요. "미리듣기"로 들어보고 가장 자연스러운 걸 선택한 뒤 저장하면, 앞으로 계속 그 보이스로 재생됩니다.
      </p>

      {loading && <p className="hint">사용 가능한 영어 음성을 불러오는 중입니다...</p>}
      {!loading && voices.length === 0 && (
        <p className="disclaimer">
          이 기기·브라우저에서 영어 음성을 찾지 못했습니다. Windows 설정 &gt; 시간 및 언어 &gt; 음성에서 영어 음성을 추가해주세요.
        </p>
      )}

      <div className="voice-list">
        {voices.map((v) => (
          <label key={v.voiceURI} className={`voice-row ${selected === v.voiceURI ? 'voice-row-selected' : ''}`}>
            <input
              type="radio"
              name="voice"
              checked={selected === v.voiceURI}
              onChange={() => setSelected(v.voiceURI)}
            />
            <span className="voice-label">{v.label}</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                handlePreview(v.voiceURI)
              }}
              disabled={previewing === v.voiceURI}
            >
              {previewing === v.voiceURI ? '재생 중...' : '미리듣기'}
            </button>
          </label>
        ))}
      </div>

      <div className="controls">
        <button className="primary" disabled={!selected} onClick={handleSave}>
          이 보이스로 저장
        </button>
        <button onClick={handleUseAuto}>자동 선택 사용</button>
        {saved && <span className="hint">저장했습니다.</span>}
      </div>

      <Link to="/">홈으로</Link>
    </div>
  )
}

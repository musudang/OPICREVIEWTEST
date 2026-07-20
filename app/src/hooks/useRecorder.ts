import { useCallback, useRef, useState } from 'react'

export type RecorderState = 'idle' | 'recording' | 'recorded'

export function useRecorder() {
  const [state, setState] = useState<RecorderState>('idle')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [durationSec, setDurationSec] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const startedAtRef = useRef<number>(0)
  const blobRef = useRef<Blob | null>(null)

  const start = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        blobRef.current = blob
        setAudioUrl(URL.createObjectURL(blob))
        setDurationSec(Math.round((Date.now() - startedAtRef.current) / 1000))
        streamRef.current?.getTracks().forEach((t) => t.stop())
        setState('recorded')
      }
      startedAtRef.current = Date.now()
      recorder.start()
      setState('recording')
    } catch {
      setError('마이크 접근 권한이 필요합니다. 브라우저 권한 설정을 확인해주세요.')
      setState('idle')
    }
  }, [])

  const stop = useCallback(() => {
    mediaRecorderRef.current?.stop()
  }, [])

  const reset = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    blobRef.current = null
    setAudioUrl(null)
    setDurationSec(0)
    setError(null)
    setState('idle')
  }, [audioUrl])

  const getBlob = useCallback(() => blobRef.current, [])

  return { state, audioUrl, durationSec, error, start, stop, reset, getBlob }
}

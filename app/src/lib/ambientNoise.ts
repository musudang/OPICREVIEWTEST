// 시험장 배경 소음(사람 말소리) 연습 기능.
// 실제 녹음(저작권 있는 유튜브 음원 등)을 그대로 사용하지 않고, Web Audio API로 "웅성거림" 소음을
// 합성해서 재현한다. 여러 대역(주파수)의 필터링된 노이즈를 LFO로 천천히 흔들어 겹쳐서
// 사람 여럿이 두런거리는 느낌을 낸다. 외부 파일·API·비용 없음.

const SAVED_ENABLED_KEY = 'opic:ambient-noise-enabled'

let audioContext: AudioContext | null = null
let masterGain: GainNode | null = null
let activeNodes: AudioScheduledSourceNode[] = []
let running = false

function getContext(): AudioContext {
  if (!audioContext) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioContext = new Ctor()
  }
  return audioContext
}

function createNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

function createMurmurLayer(ctx: AudioContext, destination: AudioNode, centerFreq: number): void {
  const source = ctx.createBufferSource()
  source.buffer = createNoiseBuffer(ctx, 4)
  source.loop = true

  const bandpass = ctx.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.value = centerFreq
  bandpass.Q.value = 0.6

  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.1 + Math.random() * 0.15
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = centerFreq * 0.35
  lfo.connect(lfoGain)
  lfoGain.connect(bandpass.frequency)

  const layerGain = ctx.createGain()
  layerGain.gain.value = 0.5

  source.connect(bandpass)
  bandpass.connect(layerGain)
  layerGain.connect(destination)

  source.start()
  lfo.start()

  activeNodes.push(source, lfo)
}

export function isAmbientNoisePlaying(): boolean {
  return running
}

export function startAmbientNoise(volume = 0.12) {
  if (running) return
  const ctx = getContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  masterGain = ctx.createGain()
  masterGain.gain.value = volume
  masterGain.connect(ctx.destination)

  createMurmurLayer(ctx, masterGain, 450)
  createMurmurLayer(ctx, masterGain, 850)
  createMurmurLayer(ctx, masterGain, 1300)

  running = true
}

export function stopAmbientNoise() {
  activeNodes.forEach((node) => {
    try {
      node.stop()
    } catch {
      // 이미 정지된 노드는 무시
    }
  })
  activeNodes = []
  if (masterGain) {
    masterGain.disconnect()
    masterGain = null
  }
  running = false
}

export function setAmbientNoiseVolume(volume: number) {
  if (masterGain) {
    masterGain.gain.value = volume
  }
}

export function getSavedAmbientNoisePref(): boolean {
  try {
    return localStorage.getItem(SAVED_ENABLED_KEY) === 'true'
  } catch {
    return false
  }
}

export function saveAmbientNoisePref(enabled: boolean) {
  try {
    localStorage.setItem(SAVED_ENABLED_KEY, String(enabled))
  } catch {
    // 저장 불가 환경은 조용히 무시
  }
}

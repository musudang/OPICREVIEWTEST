const SAVED_NAME_KEY = 'opic:last-username'

export function getSavedUserName(): string {
  try {
    return localStorage.getItem(SAVED_NAME_KEY) ?? ''
  } catch {
    return ''
  }
}

export function saveUserName(name: string) {
  try {
    if (name) {
      localStorage.setItem(SAVED_NAME_KEY, name)
    }
  } catch {
    // localStorage 접근 불가 환경은 조용히 무시
  }
}

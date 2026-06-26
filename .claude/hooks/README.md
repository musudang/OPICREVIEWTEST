# Hooks — 프롬프트 로깅 (Claude · Codex · Gemini 공통)

유저가 프롬프트를 입력하는 시점에 그 내용을 `proc/archive/prompts/YYYY-MM-DD.md` 에 자동 기록한다. 세 에이전트가 **동일한 스크립트**를 호출하며, 스크립트는 stdin 으로 들어오는 훅 JSON 에서 `prompt` 와 `cwd` 를 읽어 로그 경로를 스스로 결정한다.

## 스크립트

| 파일 | 플랫폼 | 비고 |
|------|--------|------|
| `log_user_input.ps1` | Windows (PowerShell)      | 추가 의존성 없음. stdin 을 UTF-8 로 디코딩(한글 보존) |
| `log_user_input.sh`  | macOS / Linux / Git Bash | `python3` 필요 |

동일한 사본이 각 에이전트 디렉토리에 들어 있다: `.claude/hooks/`, `.codex/hooks/`, `.gemini/hooks/`. 수정 시 세 곳을 동기화한다.

> 각 에이전트는 **저장소 루트에서 실행**해야 `-File` 상대경로와 로그 경로가 올바르게 해석된다.

## 에이전트별 설정 (기본값: Windows / PowerShell)

### Claude Code — `.claude/settings.json`
```json
{
  "hooks": {
    "UserPromptSubmit": [
      { "hooks": [ { "type": "command", "command": "powershell -NoProfile -ExecutionPolicy Bypass -File .claude/hooks/log_user_input.ps1" } ] }
    ]
  }
}
```

### Codex CLI — `.codex/config.toml`
```toml
[features]
hooks = true

[[hooks.UserPromptSubmit]]

[[hooks.UserPromptSubmit.hooks]]
type = "command"
command         = ".codex/hooks/log_user_input.sh"
command_windows = "powershell -NoProfile -ExecutionPolicy Bypass -File .codex/hooks/log_user_input.ps1"
timeout = 30
```
> Codex 는 `command`(POSIX)와 `command_windows`(Windows)를 자동 분기하므로, OS 가 달라도 그대로 동작한다.

### Gemini CLI — `.gemini/settings.json`
```json
{
  "context": { "fileName": ["AGENTS.md", "GEMINI.md"] },
  "hooks": {
    "BeforeAgent": [
      { "hooks": [ { "name": "log-user-prompt", "type": "command", "command": "powershell -NoProfile -ExecutionPolicy Bypass -File .gemini/hooks/log_user_input.ps1", "timeout": 10000 } ] }
    ]
  }
}
```
> `context.fileName` 은 Gemini 가 `AGENTS.md` 를 읽도록 하는 설정이다 (기본값은 `GEMINI.md`).

## macOS / Linux 로 전환

Codex 는 자동 분기되므로 변경할 필요가 없다. **Claude·Gemini** 는 `command` 한 줄만 `.sh` 호출로 바꾼다.

- Claude (`.claude/settings.json`): `"command": ".claude/hooks/log_user_input.sh"`
- Gemini (`.gemini/settings.json`): `"command": ".gemini/hooks/log_user_input.sh"`

> PowerShell 7+ 를 쓰면 `powershell` 대신 `pwsh` 로 바꿔도 된다.
> Windows 에서 Git Bash 를 쓰고 `python3` 가 있으면 `.sh` 명령을 그대로 써도 동작한다.

## 동작 확인

- 프롬프트를 한 번 입력한 뒤 `proc/archive/prompts/<오늘날짜>.md` 에 `## HH:MM:SS | session: ...` 항목과 프롬프트가 추가됐는지 확인한다.
- 기록되지 않으면: (1) 에이전트를 저장소 루트에서 실행했는지, (2) PowerShell 실행 정책(스크립트는 `-ExecutionPolicy Bypass` 로 우회), (3) 설정 파일을 에이전트가 다시 읽도록 재시작했는지 확인한다.

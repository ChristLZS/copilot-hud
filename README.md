# Copilot HUD

[中文文档](./README_CN.md)

A configurable status line for **GitHub Copilot CLI**. Shows model, context usage, git status, and more — pinned at the bottom of your terminal by Copilot's native statusline API.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ You: refactor the auth module                                               │
│ Copilot: I'll restructure the authentication flow...                        │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Sonnet 4 │ CTX ██████░░░░ 60% │ 8 reqs │ +156 -23 │  main ✱ │ 14:30     │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
npm install -g copilot-hud
copilot-hud setup
copilot   # status bar appears at the bottom!
```

Three commands. That's it.

## How It Works

Copilot HUD plugs into Copilot CLI's native **statusline API**. Copilot periodically calls `copilot-hud`, passes session data (model, tokens, cost) via stdin, and renders the output as a persistent status bar at the bottom of the terminal.

No hacks, no tmux, no shell wrappers.

## What It Shows

| Section | Description | Example |
|---------|-------------|---------|
| **Model** | Current AI model | ` Claude Sonnet 4` |
| **Context** | Token usage + progress bar | `CTX ██████░░░░ 60%` |
| **Cost** | Request count, API duration | `8 reqs 45.6s` |
| **Lines** | Lines added/removed this session | `+156 -23` |
| **Git** | Branch, dirty, ahead/behind, files | ` main ✱ ↑2 +3 ~1` |
| **Project** | Current directory | ` my-project` |
| **Memory** | System memory usage | `MEM ██████░░ 8.2GB` |
| **Time** | Current time | `14:30` |

## Configuration

### Presets

```bash
copilot-hud config preset full       # Everything (default)
copilot-hud config preset essential  # Model + context + git + time
copilot-hud config preset minimal    # Model + context + branch only
```

### Custom Config

```bash
copilot-hud config init   # Create default config file
copilot-hud config        # View current config
copilot-hud preview       # Preview the status line
```

Config file: `~/.config/copilot-hud/config.json`

#### Example

```json
{
  "preset": "full",
  "show": {
    "memoryUsage": false,
    "cost": false
  },
  "colors": {
    "branch": "brightCyan",
    "info": "cyan"
  }
}
```

Values in `show` override the preset. Run `copilot-hud config` to see all options.

#### Available Colors

`red` `green` `yellow` `blue` `magenta` `cyan` `white` `gray` `brightRed` `brightGreen` `brightYellow` `brightBlue` `brightMagenta` `brightCyan`

## Commands

| Command | Description |
|---------|-------------|
| `copilot-hud setup` | Configure as Copilot's status line |
| `copilot-hud uninstall` | Remove status line config |
| `copilot-hud preview` | Preview the status line |
| `copilot-hud config` | Show current config |
| `copilot-hud config init` | Create default config file |
| `copilot-hud config preset <name>` | Apply preset (full / essential / minimal) |
| `copilot-hud --help` | Show help |

## Uninstall

```bash
copilot-hud uninstall
npm uninstall -g copilot-hud
rm -rf ~/.config/copilot-hud   # optional: remove config
```

## Requirements

- Node.js >= 18
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli)
- Git (for git status)

## License

MIT

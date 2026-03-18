# Copilot HUD

[English](./README.md)

为 **GitHub Copilot CLI** 打造的可配置状态栏。在终端底部实时显示模型、上下文用量、Git 状态等信息 —— 基于 Copilot 原生 statusline API，与 Copilot 完美集成。

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ You: 重构一下认证模块                                                         │
│ Copilot: 好的，我来调整认证流程的结构...                                        │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Sonnet 4 │ CTX ██████░░░░ 60% │ 8 reqs │ +156 -23 │  main ✱ │ 14:30     │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 快速开始

```bash
# 从 GitHub 安装
npm install -g github:ChristLZS/copilot-hud

# 配置为 Copilot 的状态栏
copilot-hud setup

# 启动 Copilot —— 状态栏自动出现在底部！
copilot
```

## 工作原理

Copilot HUD 利用 Copilot CLI 原生的 **statusline API** 进行集成。Copilot 会周期性地调用 `copilot-hud`，通过 stdin 传入会话数据（模型、token 用量、开销等），然后将输出渲染为终端底部的固定状态栏。

无需 hack，无需 tmux，无需 shell wrapper。

## 展示内容

| 模块 | 说明 | 示例 |
|------|------|------|
| **模型** | 当前使用的 AI 模型 | ` Claude Sonnet 4` |
| **上下文** | Token 用量 + 进度条 | `CTX ██████░░░░ 60%` |
| **开销** | 请求次数、API 耗时 | `8 reqs 45.6s` |
| **代码行** | 本次会话增删行数 | `+156 -23` |
| **Git** | 分支、修改状态、远程差异、文件统计 | ` main ✱ ↑2 +3 ~1` |
| **项目** | 当前目录 | ` my-project` |
| **内存** | 系统内存使用情况 | `MEM ██████░░ 8.2GB` |
| **时间** | 当前时间 | `14:30` |

## 配置

### 预设

提供三种内置预设，适应不同信息密度需求：

```bash
copilot-hud config preset full       # 显示全部信息（默认）
copilot-hud config preset essential  # 仅显示关键信息
copilot-hud config preset minimal    # 最精简：模型 + 上下文 + 分支
```

### 自定义配置

```bash
copilot-hud config init   # 创建默认配置文件
copilot-hud config        # 查看当前配置
copilot-hud preview       # 预览状态栏效果
```

配置文件路径：`~/.config/copilot-hud/config.json`

#### 配置示例

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

`show` 中的值会覆盖预设默认值。运行 `copilot-hud config` 查看所有可配置项。

#### 可用颜色

`red` `green` `yellow` `blue` `magenta` `cyan` `white` `gray` `brightRed` `brightGreen` `brightYellow` `brightBlue` `brightMagenta` `brightCyan`

## 命令一览

| 命令 | 说明 |
|------|------|
| `copilot-hud setup` | 配置为 Copilot 的状态栏 |
| `copilot-hud uninstall` | 移除状态栏配置 |
| `copilot-hud preview` | 预览状态栏效果 |
| `copilot-hud config` | 查看当前配置 |
| `copilot-hud config init` | 创建默认配置文件 |
| `copilot-hud config preset <名称>` | 切换预设（full / essential / minimal） |
| `copilot-hud --help` | 显示帮助信息 |

## 卸载

```bash
copilot-hud uninstall
npm uninstall -g copilot-hud
rm -rf ~/.config/copilot-hud   # 可选：删除配置文件
```

## 环境要求

- Node.js >= 18
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli)
- Git（用于显示 Git 状态）

## 许可证

MIT

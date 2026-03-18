/** HUD configuration */
export interface HudConfig {
  /** Display preset: full / essential / minimal */
  preset: "full" | "essential" | "minimal";

  /** Individual display toggles */
  show: {
    model: boolean;
    contextWindow: boolean;
    contextBar: boolean;
    cost: boolean;
    linesChanged: boolean;
    git: boolean;
    gitBranch: boolean;
    gitDirty: boolean;
    gitAheadBehind: boolean;
    gitFileStats: boolean;
    project: boolean;
    projectDepth: number;
    system: boolean;
    memoryUsage: boolean;
    time: boolean;
    separator: boolean;
  };

  /** Color theme */
  colors: {
    branch: AnsiColor;
    project: AnsiColor;
    stats: AnsiColor;
    info: AnsiColor;
    warning: AnsiColor;
    error: AnsiColor;
    accent: AnsiColor;
    muted: AnsiColor;
  };

  /** Separator character between sections */
  separatorChar: string;
}

export type AnsiColor =
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray"
  | "brightRed"
  | "brightGreen"
  | "brightYellow"
  | "brightBlue"
  | "brightMagenta"
  | "brightCyan";

/** JSON data received from Copilot CLI via stdin */
export interface CopilotStdinData {
  cwd?: string;
  session_id?: string;
  model?: {
    id?: string;
    display_name?: string;
  };
  cost?: {
    total_premium_requests?: number;
    total_lines_added?: number;
    total_lines_removed?: number;
    total_api_duration_ms?: number;
  };
  context_window?: {
    total_tokens?: number;
    used_tokens?: number;
    available_tokens?: number;
    percent_used?: number;
  };
  workspace?: string;
  version?: string;
  transcript_path?: string;
}

export interface GitInfo {
  branch: string;
  dirty: boolean;
  staged: number;
  modified: number;
  untracked: number;
  ahead: number;
  behind: number;
  detached: boolean;
}

export interface SystemInfo {
  memoryUsed: number;
  memoryTotal: number;
  memoryPercent: number;
}

export interface RenderContext {
  stdin: CopilotStdinData;
  git: GitInfo | null;
  system: SystemInfo;
  projectPath: string;
  terminalWidth: number;
  config: HudConfig;
}

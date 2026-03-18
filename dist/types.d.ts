/** HUD configuration */
export interface HudConfig {
    /** Layout mode: compact (single line) or expanded (multi-line) */
    layout: "compact" | "expanded";
    /** Display preset: full / essential / minimal */
    preset: "full" | "essential" | "minimal";
    /** Individual display toggles */
    show: {
        git: boolean;
        gitBranch: boolean;
        gitDirty: boolean;
        gitAheadBehind: boolean;
        gitFileStats: boolean;
        project: boolean;
        projectDepth: number;
        nodeVersion: boolean;
        system: boolean;
        cpuUsage: boolean;
        memoryUsage: boolean;
        time: boolean;
        copilotStatus: boolean;
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
    /** Refresh interval in milliseconds (for watch mode) */
    refreshInterval: number;
}
export type AnsiColor = "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "brightRed" | "brightGreen" | "brightYellow" | "brightBlue" | "brightMagenta" | "brightCyan";
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
    cpuUsage: number;
    memoryUsed: number;
    memoryTotal: number;
    memoryPercent: number;
    platform: string;
    nodeVersion: string;
}
export interface CopilotInfo {
    installed: boolean;
    authenticated: boolean;
    version: string;
}
export interface RenderContext {
    git: GitInfo | null;
    system: SystemInfo;
    copilot: CopilotInfo | null;
    projectPath: string;
    terminalWidth: number;
    config: HudConfig;
}

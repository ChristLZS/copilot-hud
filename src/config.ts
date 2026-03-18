import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { HudConfig } from "./types.js";

const CONFIG_DIR = join(homedir(), ".config", "copilot-hud");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

const PRESETS: Record<string, Partial<HudConfig["show"]>> = {
  full: {
    model: true,
    contextWindow: true,
    contextBar: true,
    cost: true,
    linesChanged: true,
    git: true,
    gitBranch: true,
    gitDirty: true,
    gitAheadBehind: true,
    gitFileStats: true,
    project: true,
    projectDepth: 2,
    system: true,
    memoryUsage: true,
    time: true,
    separator: true,
  },
  essential: {
    model: true,
    contextWindow: true,
    contextBar: true,
    cost: false,
    linesChanged: true,
    git: true,
    gitBranch: true,
    gitDirty: true,
    gitAheadBehind: false,
    gitFileStats: false,
    project: true,
    projectDepth: 1,
    system: false,
    memoryUsage: false,
    time: true,
    separator: true,
  },
  minimal: {
    model: true,
    contextWindow: true,
    contextBar: false,
    cost: false,
    linesChanged: false,
    git: true,
    gitBranch: true,
    gitDirty: true,
    gitAheadBehind: false,
    gitFileStats: false,
    project: false,
    projectDepth: 1,
    system: false,
    memoryUsage: false,
    time: false,
    separator: true,
  },
};

export function getDefaultConfig(): HudConfig {
  return {
    preset: "full",
    show: { ...PRESETS.full } as HudConfig["show"],
    colors: {
      branch: "brightCyan",
      project: "brightBlue",
      stats: "brightGreen",
      info: "cyan",
      warning: "yellow",
      error: "red",
      accent: "magenta",
      muted: "gray",
    },
    separatorChar: " │ ",
  };
}

export function loadConfig(): HudConfig {
  const defaults = getDefaultConfig();

  if (!existsSync(CONFIG_FILE)) {
    return defaults;
  }

  try {
    const raw = readFileSync(CONFIG_FILE, "utf-8");
    const userConfig = JSON.parse(raw) as Partial<HudConfig>;

    const presetName = userConfig.preset || defaults.preset;
    const presetShow = PRESETS[presetName] || PRESETS.full;

    return {
      ...defaults,
      ...userConfig,
      show: { ...defaults.show, ...presetShow, ...(userConfig.show || {}) },
      colors: { ...defaults.colors, ...(userConfig.colors || {}) },
    };
  } catch {
    return defaults;
  }
}

export function savePartialConfig(partial: Partial<HudConfig>): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  let existing: Record<string, unknown> = {};
  if (existsSync(CONFIG_FILE)) {
    try {
      existing = JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
    } catch { /* ignore */ }
  }
  const merged = { ...existing, ...partial };
  if (partial.preset && !partial.show) {
    delete merged.show;
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2), "utf-8");
}

export function saveFullConfig(config: HudConfig): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}

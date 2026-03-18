import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
const CONFIG_DIR = join(homedir(), ".config", "copilot-hud");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");
const PRESETS = {
    full: {
        git: true,
        gitBranch: true,
        gitDirty: true,
        gitAheadBehind: true,
        gitFileStats: true,
        project: true,
        projectDepth: 2,
        nodeVersion: true,
        system: true,
        cpuUsage: true,
        memoryUsage: true,
        time: true,
        copilotStatus: true,
        separator: true,
    },
    essential: {
        git: true,
        gitBranch: true,
        gitDirty: true,
        gitAheadBehind: false,
        gitFileStats: false,
        project: true,
        projectDepth: 1,
        nodeVersion: false,
        system: false,
        cpuUsage: false,
        memoryUsage: true,
        time: true,
        copilotStatus: true,
        separator: true,
    },
    minimal: {
        git: true,
        gitBranch: true,
        gitDirty: true,
        gitAheadBehind: false,
        gitFileStats: false,
        project: false,
        projectDepth: 1,
        nodeVersion: false,
        system: false,
        cpuUsage: false,
        memoryUsage: false,
        time: false,
        copilotStatus: false,
        separator: false,
    },
};
export function getDefaultConfig() {
    return {
        layout: "compact",
        preset: "full",
        show: {
            git: true,
            gitBranch: true,
            gitDirty: true,
            gitAheadBehind: true,
            gitFileStats: true,
            project: true,
            projectDepth: 2,
            nodeVersion: true,
            system: true,
            cpuUsage: true,
            memoryUsage: true,
            time: true,
            copilotStatus: true,
            separator: true,
        },
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
        refreshInterval: 2000,
    };
}
export function loadConfig() {
    const defaults = getDefaultConfig();
    if (!existsSync(CONFIG_FILE)) {
        return defaults;
    }
    try {
        const raw = readFileSync(CONFIG_FILE, "utf-8");
        const userConfig = JSON.parse(raw);
        const merged = {
            ...defaults,
            ...userConfig,
            show: { ...defaults.show, ...(userConfig.show || {}) },
            colors: { ...defaults.colors, ...(userConfig.colors || {}) },
        };
        // Apply preset overrides if preset changed
        if (userConfig.preset && PRESETS[userConfig.preset]) {
            const presetShow = PRESETS[userConfig.preset];
            merged.show = { ...merged.show, ...presetShow };
            // Re-apply any explicit user show overrides on top
            if (userConfig.show) {
                merged.show = { ...merged.show, ...userConfig.show };
            }
        }
        return merged;
    }
    catch {
        return defaults;
    }
}
export function saveConfig(config) {
    if (!existsSync(CONFIG_DIR)) {
        mkdirSync(CONFIG_DIR, { recursive: true });
    }
    // Load existing raw config to merge
    let existing = {};
    if (existsSync(CONFIG_FILE)) {
        try {
            existing = JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
        }
        catch { /* ignore */ }
    }
    const merged = { ...existing, ...config };
    writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2), "utf-8");
}
/** Save only specific fields without full config dump */
export function savePartialConfig(partial) {
    if (!existsSync(CONFIG_DIR)) {
        mkdirSync(CONFIG_DIR, { recursive: true });
    }
    let existing = {};
    if (existsSync(CONFIG_FILE)) {
        try {
            existing = JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
        }
        catch { /* ignore */ }
    }
    const merged = { ...existing, ...partial };
    // When setting preset, remove show overrides so preset takes effect cleanly
    if (partial.preset && !partial.show) {
        delete merged.show;
    }
    writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2), "utf-8");
}
export function getConfigPath() {
    return CONFIG_FILE;
}

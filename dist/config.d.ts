import type { HudConfig } from "./types.js";
export declare function getDefaultConfig(): HudConfig;
export declare function loadConfig(): HudConfig;
export declare function saveConfig(config: Partial<HudConfig> & Pick<HudConfig, "preset" | "layout">): void;
/** Save only specific fields without full config dump */
export declare function savePartialConfig(partial: Partial<HudConfig>): void;
export declare function getConfigPath(): string;

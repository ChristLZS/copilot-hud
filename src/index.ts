#!/usr/bin/env node

import { loadConfig, saveConfig, savePartialConfig, getDefaultConfig, getConfigPath } from "./config.js";
import { getGitInfo } from "./git.js";
import { getSystemInfo } from "./system.js";
import { getCopilotInfo } from "./copilot.js";
import { render } from "./render.js";
import type { RenderContext } from "./types.js";

function getTerminalWidth(): number {
  return process.stdout.columns || 80;
}

function printHud(): void {
  const config = loadConfig();
  const git = getGitInfo();
  const system = getSystemInfo();
  const copilot = getCopilotInfo();
  const projectPath = process.cwd();

  const ctx: RenderContext = {
    git,
    system,
    copilot,
    projectPath,
    terminalWidth: getTerminalWidth(),
    config,
  };

  const output = render(ctx);
  process.stdout.write("\x1b[0m" + output + "\x1b[0m\n");
}

function printHelp(): void {
  console.log(`
copilot-hud - A configurable terminal HUD for GitHub Copilot CLI

Usage:
  copilot-hud              Show HUD once
  copilot-hud --watch      Watch mode (refresh periodically)
  copilot-hud --config     Show config file path
  copilot-hud --init       Create default config file
  copilot-hud --preset <n> Apply preset (full/essential/minimal)
  copilot-hud --layout <l> Set layout (compact/expanded)
  copilot-hud --help       Show this help

Config file: ~/.config/copilot-hud/config.json
`);
}

function handleArgs(): void {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }

  if (args.includes("--config")) {
    console.log(`Config path: ${getConfigPath()}`);
    const config = loadConfig();
    console.log(JSON.stringify(config, null, 2));
    return;
  }

  if (args.includes("--init")) {
    const config = getDefaultConfig();
    saveConfig(config);
    console.log(`Config created at: ${getConfigPath()}`);
    return;
  }

  const presetIdx = args.indexOf("--preset");
  if (presetIdx !== -1 && args[presetIdx + 1]) {
    const preset = args[presetIdx + 1] as "full" | "essential" | "minimal";
    if (!["full", "essential", "minimal"].includes(preset)) {
      console.error("Invalid preset. Choose: full, essential, minimal");
      process.exit(1);
    }
    savePartialConfig({ preset });
    console.log(`Preset set to: ${preset}`);
    return;
  }

  const layoutIdx = args.indexOf("--layout");
  if (layoutIdx !== -1 && args[layoutIdx + 1]) {
    const layout = args[layoutIdx + 1] as "compact" | "expanded";
    if (!["compact", "expanded"].includes(layout)) {
      console.error("Invalid layout. Choose: compact, expanded");
      process.exit(1);
    }
    savePartialConfig({ layout });
    console.log(`Layout set to: ${layout}`);
    return;
  }

  if (args.includes("--watch") || args.includes("-w")) {
    const config = loadConfig();
    const interval = config.refreshInterval || 2000;

    // Clear screen and hide cursor
    process.stdout.write("\x1b[?25l");

    const refresh = () => {
      // Move cursor to bottom
      const rows = process.stdout.rows || 24;
      process.stdout.write(`\x1b[${rows};1H`);
      process.stdout.write("\x1b[2K"); // Clear line
      printHud();
    };

    refresh();
    const timer = setInterval(refresh, interval);

    // Cleanup on exit
    const cleanup = () => {
      clearInterval(timer);
      process.stdout.write("\x1b[?25h"); // Show cursor
      process.exit(0);
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
    return;
  }

  // Default: print once
  printHud();
}

handleArgs();

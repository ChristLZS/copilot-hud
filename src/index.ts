#!/usr/bin/env node

import { loadConfig, savePartialConfig, saveFullConfig, getDefaultConfig, getConfigPath } from "./config.js";
import { getGitInfo } from "./git.js";
import { getSystemInfo } from "./system.js";
import { readStdin } from "./stdin.js";
import { renderStatusLine } from "./render.js";
import { setupCopilotStatusLine, uninstallCopilotStatusLine } from "./setup.js";
import { colorBold, dim, bold, color } from "./colors.js";
import type { RenderContext } from "./types.js";

function getTerminalWidth(): number {
  return process.stdout.columns || 80;
}

/**
 * Main statusline mode: read stdin from Copilot CLI, output formatted status.
 * This is what Copilot CLI calls periodically.
 */
async function runStatusLine(): Promise<void> {
  const config = loadConfig();
  const stdinData = await readStdin();
  const projectPath = stdinData.cwd || process.cwd();
  const git = getGitInfo(projectPath);
  const system = getSystemInfo();

  const ctx: RenderContext = {
    stdin: stdinData,
    git,
    system,
    projectPath,
    terminalWidth: getTerminalWidth(),
    config,
  };

  const output = renderStatusLine(ctx);
  process.stdout.write("\x1b[0m" + output + "\x1b[0m");
}

/** Preview mode: show what the status line would look like */
function printPreview(): void {
  const config = loadConfig();
  const git = getGitInfo(process.cwd());
  const system = getSystemInfo();

  // Simulate stdin data for preview
  const mockStdin = {
    cwd: process.cwd(),
    model: { display_name: "Claude Sonnet 4" },
    context_window: { total_tokens: 200000, used_tokens: 45000, percent_used: 22 },
    cost: { total_premium_requests: 3, total_lines_added: 42, total_lines_removed: 7, total_api_duration_ms: 12300 },
  };

  const ctx: RenderContext = {
    stdin: mockStdin,
    git,
    system,
    projectPath: process.cwd(),
    terminalWidth: getTerminalWidth(),
    config,
  };

  console.log("");
  console.log(colorBold("  Status line preview:", "cyan"));
  console.log("");
  console.log("  " + renderStatusLine(ctx));
  console.log("");
}

function printHelp(): void {
  console.log("");
  console.log(colorBold("  Copilot HUD", "cyan") + dim(" — Status line for GitHub Copilot CLI"));
  console.log("");
  console.log(bold("  Usage:"));
  console.log("");
  console.log("    " + colorBold("copilot-hud setup", "white") + "            Configure as Copilot status line");
  console.log("    " + colorBold("copilot-hud uninstall", "white") + "        Remove status line config");
  console.log("    " + colorBold("copilot-hud preview", "white") + "          Preview the status line");
  console.log("    " + colorBold("copilot-hud config", "white") + "           Show current config");
  console.log("    " + colorBold("copilot-hud config init", "white") + "      Create default config file");
  console.log("    " + colorBold("copilot-hud config preset", "white") + dim(" <name>") + "  Apply preset (full/essential/minimal)");
  console.log("");
  console.log(bold("  Quick Start:"));
  console.log("");
  console.log("    " + dim("$") + " npm install -g copilot-hud");
  console.log("    " + dim("$") + " copilot-hud setup");
  console.log("    " + dim("$") + " copilot  " + dim("← status bar appears at the bottom!"));
  console.log("");
  console.log(dim("  Config: ~/.config/copilot-hud/config.json"));
  console.log("");
}

function handleConfig(args: string[]): void {
  const sub = args[0];

  if (!sub) {
    console.log("");
    console.log(colorBold("  Current config", "cyan") + dim(` (${getConfigPath()})`));
    console.log("");
    const config = loadConfig();
    const json = JSON.stringify(config, null, 2);
    for (const line of json.split("\n")) {
      console.log("  " + line);
    }
    console.log("");
    return;
  }

  if (sub === "init") {
    saveFullConfig(getDefaultConfig());
    console.log("");
    console.log(color("  ✓", "brightGreen") + ` Config created at ${dim(getConfigPath())}`);
    console.log(dim("  Edit it to customize your status line."));
    console.log("");
    return;
  }

  if (sub === "preset") {
    const preset = args[1] as "full" | "essential" | "minimal";
    if (!preset || !["full", "essential", "minimal"].includes(preset)) {
      console.error("  Usage: copilot-hud config preset <full|essential|minimal>");
      process.exit(1);
    }
    savePartialConfig({ preset });
    console.log("");
    console.log(color("  ✓", "brightGreen") + ` Preset set to ${colorBold(preset, "cyan")}`);
    console.log("");
    printPreview();
    return;
  }

  console.error(`  Unknown config command: ${sub}`);
  process.exit(1);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const cmd = args[0];

  // No args + stdin is piped = Copilot CLI is calling us as status line
  if (!cmd && !process.stdin.isTTY) {
    await runStatusLine();
    return;
  }

  // No args + interactive terminal = show help
  if (!cmd) {
    printHelp();
    return;
  }

  if (cmd === "--help" || cmd === "-h" || cmd === "help") {
    printHelp();
    return;
  }

  if (cmd === "setup") {
    setupCopilotStatusLine();
    return;
  }

  if (cmd === "uninstall") {
    uninstallCopilotStatusLine();
    return;
  }

  if (cmd === "preview") {
    printPreview();
    return;
  }

  if (cmd === "config") {
    handleConfig(args.slice(1));
    return;
  }

  console.error(`Unknown command: ${cmd}`);
  console.error("Run copilot-hud --help for usage.");
  process.exit(1);
}

main();

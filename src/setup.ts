import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { execSync } from "child_process";
import { color, colorBold, dim, bold } from "./colors.js";

const COPILOT_CONFIG_DIR = join(homedir(), ".copilot");
const COPILOT_CONFIG_FILE = join(COPILOT_CONFIG_DIR, "config.json");

function getBinaryPath(): string {
  try {
    return execSync("which copilot-hud", { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch {
    return "copilot-hud";
  }
}

export function setupCopilotStatusLine(): void {
  const binPath = getBinaryPath();

  console.log("");
  console.log(colorBold("  Copilot HUD Setup", "cyan"));
  console.log(dim("  ─".repeat(25)));
  console.log("");

  if (!existsSync(COPILOT_CONFIG_DIR)) {
    mkdirSync(COPILOT_CONFIG_DIR, { recursive: true });
  }

  let copilotConfig: Record<string, unknown> = {};
  if (existsSync(COPILOT_CONFIG_FILE)) {
    try {
      copilotConfig = JSON.parse(readFileSync(COPILOT_CONFIG_FILE, "utf-8"));
    } catch { /* start fresh */ }
  }

  // Enable experimental features + set status_line
  copilotConfig["experimental"] = true;
  copilotConfig["status_line"] = {
    type: "command",
    command: binPath,
  };

  writeFileSync(COPILOT_CONFIG_FILE, JSON.stringify(copilotConfig, null, 2), "utf-8");

  console.log(color("  ✓", "brightGreen") + ` Configured status line in ${dim(COPILOT_CONFIG_FILE)}`);
  console.log("");
  console.log("  " + dim("What was done:"));
  console.log("  " + dim("- Enabled experimental features"));
  console.log("  " + dim(`- Set status_line command to ${binPath}`));
  console.log("");
  console.log("  " + bold("Now just run:"));
  console.log(`     ${colorBold("copilot", "cyan")}` + dim("  ← status bar appears at the bottom!"));
  console.log("");
  console.log(dim("  To customize:  copilot-hud config"));
  console.log(dim("  To uninstall:  copilot-hud uninstall"));
  console.log("");
}

export function uninstallCopilotStatusLine(): void {
  if (!existsSync(COPILOT_CONFIG_FILE)) {
    console.log(dim("  Nothing to uninstall."));
    return;
  }

  try {
    const copilotConfig = JSON.parse(readFileSync(COPILOT_CONFIG_FILE, "utf-8"));
    delete copilotConfig["status_line"];
    writeFileSync(COPILOT_CONFIG_FILE, JSON.stringify(copilotConfig, null, 2), "utf-8");

    console.log("");
    console.log(color("  ✓", "brightGreen") + ` Removed status_line from ${dim(COPILOT_CONFIG_FILE)}`);
    console.log("");
  } catch {
    console.log(dim("  Failed to update copilot config."));
  }
}

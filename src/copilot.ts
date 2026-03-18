import { execSync } from "child_process";
import type { CopilotInfo } from "./types.js";

function exec(cmd: string): string {
  try {
    return execSync(cmd, {
      encoding: "utf-8",
      timeout: 5000,
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
  } catch {
    return "";
  }
}

export function getCopilotInfo(): CopilotInfo | null {
  // Check if gh CLI is installed
  const ghVersion = exec("gh --version 2>/dev/null");
  if (!ghVersion) return null;

  // Check if copilot extension is installed
  const extensions = exec("gh extension list 2>/dev/null");
  const installed = extensions.includes("copilot");

  if (!installed) {
    return { installed: false, authenticated: false, version: "" };
  }

  // Get copilot version
  let version = "";
  const versionMatch = extensions.match(/gh-copilot\s+(\S+)/);
  if (versionMatch) {
    version = versionMatch[1];
  }

  // Check auth status
  const authStatus = exec("gh auth status 2>&1");
  const authenticated = authStatus.includes("Logged in");

  return { installed, authenticated, version };
}

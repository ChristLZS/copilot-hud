import { execSync } from "child_process";
import type { GitInfo } from "./types.js";

function exec(cmd: string): string {
  try {
    return execSync(cmd, {
      encoding: "utf-8",
      timeout: 3000,
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
  } catch {
    return "";
  }
}

export function getGitInfo(): GitInfo | null {
  // Check if we're in a git repo
  const isGit = exec("git rev-parse --is-inside-work-tree");
  if (isGit !== "true") return null;

  // Branch name
  let branch = exec("git symbolic-ref --short HEAD 2>/dev/null");
  let detached = false;
  if (!branch) {
    branch = exec("git rev-parse --short HEAD 2>/dev/null") || "unknown";
    detached = true;
  }

  // Dirty state
  const status = exec("git status --porcelain 2>/dev/null");
  const lines = status ? status.split("\n").filter(Boolean) : [];

  let staged = 0;
  let modified = 0;
  let untracked = 0;

  for (const line of lines) {
    const x = line[0];
    const y = line[1];
    if (x === "?" && y === "?") {
      untracked++;
    } else {
      if (x !== " " && x !== "?") staged++;
      if (y !== " " && y !== "?") modified++;
    }
  }

  const dirty = lines.length > 0;

  // Ahead/behind
  let ahead = 0;
  let behind = 0;
  const abStr = exec(
    "git rev-list --left-right --count HEAD...@{upstream} 2>/dev/null"
  );
  if (abStr) {
    const parts = abStr.split(/\s+/);
    ahead = parseInt(parts[0], 10) || 0;
    behind = parseInt(parts[1], 10) || 0;
  }

  return { branch, dirty, staged, modified, untracked, ahead, behind, detached };
}

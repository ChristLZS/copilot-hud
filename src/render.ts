import { color, colorBold, dim, progressBar } from "./colors.js";
import { formatBytes } from "./system.js";
import type { RenderContext, AnsiColor } from "./types.js";

function sep(config: RenderContext["config"]): string {
  return config.show.separator ? dim(config.separatorChar) : " ";
}

// ─── Section Renderers ─────────────────────────────────────

function renderModelSection(ctx: RenderContext): string {
  if (!ctx.config.show.model) return "";
  const model = ctx.stdin.model;
  if (!model) return "";

  const name = model.display_name || model.id || "";
  if (!name) return "";

  return color("", ctx.config.colors.accent) + " " + colorBold(name, ctx.config.colors.info);
}

function renderContextSection(ctx: RenderContext): string {
  if (!ctx.config.show.contextWindow) return "";
  const cw = ctx.stdin.context_window;
  if (!cw || !cw.total_tokens) return "";

  const percent = cw.percent_used ?? Math.round(((cw.used_tokens || 0) / cw.total_tokens) * 100);
  const c = ctx.config.colors;
  const barColor: AnsiColor = percent > 85 ? c.error : percent > 60 ? c.warning : c.stats;

  const parts: string[] = [];

  if (ctx.config.show.contextBar) {
    parts.push(progressBar(percent, 10, barColor, "gray"));
  }
  parts.push(color(`${percent}%`, barColor));

  return color("CTX", c.muted) + " " + parts.join(" ");
}

function renderCostSection(ctx: RenderContext): string {
  if (!ctx.config.show.cost) return "";
  const cost = ctx.stdin.cost;
  if (!cost) return "";

  const c = ctx.config.colors;
  const parts: string[] = [];

  if (cost.total_premium_requests !== undefined) {
    parts.push(color(`${cost.total_premium_requests} reqs`, c.info));
  }

  if (cost.total_api_duration_ms !== undefined) {
    const secs = (cost.total_api_duration_ms / 1000).toFixed(1);
    parts.push(dim(`${secs}s`));
  }

  if (!parts.length) return "";
  return parts.join(" ");
}

function renderLinesSection(ctx: RenderContext): string {
  if (!ctx.config.show.linesChanged) return "";
  const cost = ctx.stdin.cost;
  if (!cost) return "";

  const c = ctx.config.colors;
  const parts: string[] = [];

  if (cost.total_lines_added) {
    parts.push(color(`+${cost.total_lines_added}`, c.stats));
  }
  if (cost.total_lines_removed) {
    parts.push(color(`-${cost.total_lines_removed}`, c.error));
  }

  if (!parts.length) return "";
  return parts.join(" ");
}

function renderGitSection(ctx: RenderContext): string {
  if (!ctx.config.show.git || !ctx.git) return "";

  const parts: string[] = [];
  const c = ctx.config.colors;

  if (ctx.config.show.gitBranch) {
    const icon = ctx.git.detached ? " ➦" : "";
    parts.push(
      color("", c.branch) +
        " " +
        colorBold(ctx.git.branch, c.branch) +
        (icon ? " " + color(icon, c.warning) : "")
    );
  }

  if (ctx.config.show.gitDirty && ctx.git.dirty) {
    parts.push(color("✱", c.warning));
  }

  if (ctx.config.show.gitAheadBehind) {
    const ab: string[] = [];
    if (ctx.git.ahead > 0) ab.push(color(`↑${ctx.git.ahead}`, c.stats));
    if (ctx.git.behind > 0) ab.push(color(`↓${ctx.git.behind}`, c.error));
    if (ab.length) parts.push(ab.join(" "));
  }

  if (ctx.config.show.gitFileStats && ctx.git.dirty) {
    const stats: string[] = [];
    if (ctx.git.staged > 0) stats.push(color(`+${ctx.git.staged}`, c.stats));
    if (ctx.git.modified > 0) stats.push(color(`~${ctx.git.modified}`, c.warning));
    if (ctx.git.untracked > 0) stats.push(color(`?${ctx.git.untracked}`, c.muted));
    if (stats.length) parts.push(stats.join(" "));
  }

  return parts.join(" ");
}

function renderProjectSection(ctx: RenderContext): string {
  if (!ctx.config.show.project) return "";

  const c = ctx.config.colors;
  const depth = ctx.config.show.projectDepth || 2;
  const parts = ctx.projectPath.split("/").filter(Boolean);
  const displayPath = parts.slice(-depth).join("/");

  return color("", c.project) + " " + colorBold(displayPath, c.project);
}

function renderSystemSection(ctx: RenderContext): string {
  if (!ctx.config.show.system || !ctx.config.show.memoryUsage) return "";

  const c = ctx.config.colors;
  const memColor: AnsiColor =
    ctx.system.memoryPercent > 80
      ? c.error
      : ctx.system.memoryPercent > 60
        ? c.warning
        : c.stats;

  return (
    color("MEM", c.muted) +
    " " +
    progressBar(ctx.system.memoryPercent, 6, memColor, "gray") +
    " " +
    color(formatBytes(ctx.system.memoryUsed), memColor)
  );
}

function renderTimeSection(ctx: RenderContext): string {
  if (!ctx.config.show.time) return "";
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return dim(time);
}

// ─── Main Renderer ─────────────────────────────────────────

export function renderStatusLine(ctx: RenderContext): string {
  const sections = [
    renderModelSection(ctx),
    renderContextSection(ctx),
    renderCostSection(ctx),
    renderLinesSection(ctx),
    renderGitSection(ctx),
    renderProjectSection(ctx),
    renderSystemSection(ctx),
    renderTimeSection(ctx),
  ].filter(Boolean);

  return sections.join(sep(ctx.config));
}

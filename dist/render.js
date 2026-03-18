import { color, colorBold, dim, progressBar, visibleLength } from "./colors.js";
import { formatBytes } from "./system.js";
function sep(config) {
    return config.show.separator
        ? dim(config.separatorChar)
        : " ";
}
function renderGitSection(ctx) {
    if (!ctx.config.show.git || !ctx.git)
        return "";
    const parts = [];
    const c = ctx.config.colors;
    if (ctx.config.show.gitBranch) {
        const branchIcon = ctx.git.detached ? "➦" : "";
        parts.push(color("", c.branch) + " " + colorBold(ctx.git.branch, c.branch) +
            (branchIcon ? " " + color(branchIcon, c.warning) : ""));
    }
    if (ctx.config.show.gitDirty && ctx.git.dirty) {
        parts.push(color("✱", c.warning));
    }
    if (ctx.config.show.gitAheadBehind) {
        const ab = [];
        if (ctx.git.ahead > 0)
            ab.push(color(`↑${ctx.git.ahead}`, c.stats));
        if (ctx.git.behind > 0)
            ab.push(color(`↓${ctx.git.behind}`, c.error));
        if (ab.length)
            parts.push(ab.join(" "));
    }
    if (ctx.config.show.gitFileStats && ctx.git.dirty) {
        const stats = [];
        if (ctx.git.staged > 0)
            stats.push(color(`+${ctx.git.staged}`, c.stats));
        if (ctx.git.modified > 0)
            stats.push(color(`~${ctx.git.modified}`, c.warning));
        if (ctx.git.untracked > 0)
            stats.push(color(`?${ctx.git.untracked}`, c.muted));
        if (stats.length)
            parts.push(stats.join(" "));
    }
    return parts.join(" ");
}
function renderProjectSection(ctx) {
    if (!ctx.config.show.project)
        return "";
    const c = ctx.config.colors;
    const depth = ctx.config.show.projectDepth || 2;
    const parts = ctx.projectPath.split("/").filter(Boolean);
    const displayPath = parts.slice(-depth).join("/");
    return color("📁", c.project) + " " + colorBold(displayPath, c.project);
}
function renderCopilotSection(ctx) {
    if (!ctx.config.show.copilotStatus || !ctx.copilot)
        return "";
    const c = ctx.config.colors;
    if (!ctx.copilot.installed) {
        return color("⊘ Copilot", c.muted);
    }
    const statusIcon = ctx.copilot.authenticated ? "●" : "○";
    const statusColor = ctx.copilot.authenticated ? c.stats : c.error;
    const version = ctx.copilot.version ? ` v${ctx.copilot.version}` : "";
    return (color(statusIcon, statusColor) +
        " " +
        color("Copilot", c.info) +
        dim(version));
}
function renderSystemSection(ctx) {
    if (!ctx.config.show.system)
        return "";
    const c = ctx.config.colors;
    const parts = [];
    if (ctx.config.show.cpuUsage) {
        const cpuColor = ctx.system.cpuUsage > 80 ? c.error : ctx.system.cpuUsage > 50 ? c.warning : c.stats;
        parts.push(color("CPU", c.muted) + " " + color(`${ctx.system.cpuUsage}%`, cpuColor));
    }
    if (ctx.config.show.memoryUsage) {
        const memColor = ctx.system.memoryPercent > 80 ? c.error : ctx.system.memoryPercent > 60 ? c.warning : c.stats;
        parts.push(color("MEM", c.muted) +
            " " +
            progressBar(ctx.system.memoryPercent, 8, memColor, "gray") +
            " " +
            color(`${formatBytes(ctx.system.memoryUsed)}`, memColor));
    }
    return parts.join(" ");
}
function renderNodeSection(ctx) {
    if (!ctx.config.show.nodeVersion)
        return "";
    return color("⬢", ctx.config.colors.stats) + " " + dim(ctx.system.nodeVersion);
}
function renderTimeSection(ctx) {
    if (!ctx.config.show.time)
        return "";
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
    return color("🕐", ctx.config.colors.muted) + " " + dim(time);
}
export function renderCompact(ctx) {
    const sections = [
        renderCopilotSection(ctx),
        renderGitSection(ctx),
        renderProjectSection(ctx),
        renderSystemSection(ctx),
        renderNodeSection(ctx),
        renderTimeSection(ctx),
    ].filter(Boolean);
    const line = sections.join(sep(ctx.config));
    // Truncate to terminal width if needed
    const visible = visibleLength(line);
    if (visible > ctx.terminalWidth) {
        // Simple truncation - just output what fits
        return line + dim("…");
    }
    return line;
}
export function renderExpanded(ctx) {
    const lines = [];
    const c = ctx.config.colors;
    // Top border
    const borderWidth = Math.min(ctx.terminalWidth, 60);
    lines.push(dim("─".repeat(borderWidth)));
    const copilot = renderCopilotSection(ctx);
    if (copilot)
        lines.push(copilot);
    const git = renderGitSection(ctx);
    if (git)
        lines.push(git);
    const project = renderProjectSection(ctx);
    if (project)
        lines.push(project);
    const system = renderSystemSection(ctx);
    if (system)
        lines.push(system);
    const node = renderNodeSection(ctx);
    if (node)
        lines.push(node);
    const time = renderTimeSection(ctx);
    if (time)
        lines.push(time);
    return lines.join("\n");
}
export function render(ctx) {
    if (ctx.config.layout === "expanded") {
        return renderExpanded(ctx);
    }
    return renderCompact(ctx);
}

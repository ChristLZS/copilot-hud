import type { AnsiColor } from "./types.js";

const ANSI_CODES: Record<AnsiColor, string> = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightBlue: "\x1b[94m",
  brightMagenta: "\x1b[95m",
  brightCyan: "\x1b[96m",
};

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

export function color(text: string, c: AnsiColor): string {
  return `${ANSI_CODES[c]}${text}${RESET}`;
}

export function bold(text: string): string {
  return `${BOLD}${text}${RESET}`;
}

export function dim(text: string): string {
  return `${DIM}${text}${RESET}`;
}

export function colorBold(text: string, c: AnsiColor): string {
  return `${BOLD}${ANSI_CODES[c]}${text}${RESET}`;
}

/** Strip ANSI codes to get visible length */
export function visibleLength(text: string): number {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\x1b\[[0-9;]*m/g, "").length;
}

/** Build a progress bar */
export function progressBar(
  percent: number,
  width: number,
  filledColor: AnsiColor = "green",
  emptyColor: AnsiColor = "gray"
): string {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  const filledStr = color("█".repeat(filled), filledColor);
  const emptyStr = color("░".repeat(empty), emptyColor);
  return `${filledStr}${emptyStr}`;
}

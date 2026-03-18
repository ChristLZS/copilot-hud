import type { AnsiColor } from "./types.js";
export declare function color(text: string, c: AnsiColor): string;
export declare function bold(text: string): string;
export declare function dim(text: string): string;
export declare function colorBold(text: string, c: AnsiColor): string;
/** Strip ANSI codes to get visible length */
export declare function visibleLength(text: string): number;
/** Build a progress bar */
export declare function progressBar(percent: number, width: number, filledColor?: AnsiColor, emptyColor?: AnsiColor): string;

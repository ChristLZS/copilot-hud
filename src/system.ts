import { totalmem, freemem } from "os";
import type { SystemInfo } from "./types.js";

export function getSystemInfo(): SystemInfo {
  const memTotal = totalmem();
  const memFree = freemem();
  const memUsed = memTotal - memFree;
  const memoryPercent = Math.round((memUsed / memTotal) * 100);

  return {
    memoryUsed: memUsed,
    memoryTotal: memTotal,
    memoryPercent,
  };
}

export function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let idx = 0;
  let val = bytes;
  while (val >= 1024 && idx < units.length - 1) {
    val /= 1024;
    idx++;
  }
  return `${val.toFixed(1)}${units[idx]}`;
}

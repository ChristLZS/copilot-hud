import { cpus, totalmem, freemem, platform } from "os";
import type { SystemInfo } from "./types.js";

export function getSystemInfo(): SystemInfo {
  // CPU usage approximation
  const cpuList = cpus();
  let totalIdle = 0;
  let totalTick = 0;
  for (const cpu of cpuList) {
    for (const type in cpu.times) {
      totalTick += cpu.times[type as keyof typeof cpu.times];
    }
    totalIdle += cpu.times.idle;
  }
  const cpuUsage = Math.round(((totalTick - totalIdle) / totalTick) * 100);

  const memTotal = totalmem();
  const memFree = freemem();
  const memUsed = memTotal - memFree;
  const memoryPercent = Math.round((memUsed / memTotal) * 100);

  return {
    cpuUsage,
    memoryUsed: memUsed,
    memoryTotal: memTotal,
    memoryPercent,
    platform: platform(),
    nodeVersion: process.version,
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

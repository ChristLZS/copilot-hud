import type { CopilotStdinData } from "./types.js";

/** Read and parse JSON data from Copilot CLI via stdin */
export async function readStdin(): Promise<CopilotStdinData> {
  return new Promise((resolve) => {
    let data = "";

    // If stdin is a TTY (no piped data), return empty object immediately
    if (process.stdin.isTTY) {
      resolve({});
      return;
    }

    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      if (!data.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data) as CopilotStdinData);
      } catch {
        resolve({});
      }
    });
    process.stdin.on("error", () => {
      resolve({});
    });

    // Timeout: don't hang forever waiting for stdin
    setTimeout(() => {
      resolve(data.trim() ? (JSON.parse(data) as CopilotStdinData) : {});
    }, 500);
  });
}

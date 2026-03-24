#!/usr/bin/env node

import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { readFile, writeFile, access, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const STUDY_DIR = path.join(REPO_ROOT, "study");
const PUBLIC_DIR = path.join(__dirname, "public");

const PORT = Number(process.env.OPENCLAW_MONITOR_PORT || 18890);
const GATEWAY_PORT = Number(process.env.OPENCLAW_GATEWAY_PORT || 18789);
const MAX_BODY_BYTES = 1024 * 1024;

const OPENCLAW_BIN = path.join(STUDY_DIR, "bin", "openclaw-local.sh");
const CONFIG_PATH = path.join(STUDY_DIR, ".generated", "openclaw.codex.json");
const STATE_DIR = path.join(STUDY_DIR, ".state", "openclaw");
const RUN_DIR = path.join(STATE_DIR, "run");
const PID_FILE = path.join(RUN_DIR, "gateway-foreground.pid");
const LOG_DIR = path.join(STATE_DIR, "logs");
const FOREGROUND_LOG = path.join(LOG_DIR, "gateway-foreground.log");
const GATEWAY_LOG = path.join(LOG_DIR, "gateway.log");
const STDERR_LOG = path.join(LOG_DIR, "gateway.err.log");

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function json(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": CONTENT_TYPES[".json"],
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("Request too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    req.on("error", reject);
  });
}

function runShell(command, { timeoutMs = 15000 } = {}) {
  const startedAt = Date.now();
  return new Promise((resolve) => {
    execFile(
      "/bin/zsh",
      ["-lc", command],
      {
        cwd: REPO_ROOT,
        timeout: timeoutMs,
        maxBuffer: 8 * 1024 * 1024,
        env: {
          ...process.env,
          LANG: "en_US.UTF-8",
        },
      },
      (error, stdout, stderr) => {
        const elapsedMs = Date.now() - startedAt;
        const code = error?.code ?? 0;
        resolve({
          ok: !error,
          code: Number.isInteger(code) ? code : 1,
          elapsedMs,
          stdout: String(stdout || "").trimEnd(),
          stderr: String(stderr || "").trimEnd(),
        });
      },
    );
  });
}

function parsePsLine(line) {
  const match = line
    .trim()
    .match(/^(\d+)\s+(\d+)\s+([\d.]+)\s+([\d.]+)\s+(\S+)\s+(.+)$/);
  if (!match) {
    return null;
  }
  return {
    pid: Number(match[1]),
    ppid: Number(match[2]),
    cpu: Number(match[3]),
    mem: Number(match[4]),
    elapsed: match[5],
    command: match[6],
  };
}

function maskToken(token) {
  if (!token || typeof token !== "string") {
    return null;
  }
  if (token.length <= 10) {
    return "********";
  }
  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readTextIfExists(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      return "";
    }
    throw error;
  }
}

function clipLines(text, maxLines = 150) {
  if (!text) {
    return "";
  }
  const lines = text.split(/\r?\n/);
  return lines.slice(-maxLines).join("\n").trimEnd();
}

async function readConfig() {
  try {
    const raw = await readFile(CONFIG_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function getForegroundPid() {
  try {
    const raw = await readFile(PID_FILE, "utf8");
    const pid = Number(raw.trim());
    return Number.isInteger(pid) && pid > 0 ? pid : null;
  } catch {
    return null;
  }
}

async function collectStatus() {
  const [config, versionRes, gatewayStatusRes, dashboardRes, psRes, lsofRes, foregroundLog, gatewayLog, stderrLog, foregroundPid] =
    await Promise.all([
      readConfig(),
      runShell(`${shellQuote(OPENCLAW_BIN)} --version`, { timeoutMs: 8000 }),
      runShell(`${shellQuote(OPENCLAW_BIN)} gateway status`, { timeoutMs: 12000 }),
      runShell(`${shellQuote(OPENCLAW_BIN)} dashboard --no-open`, { timeoutMs: 8000 }),
      runShell("ps -axo pid,ppid,%cpu,%mem,etime,command", { timeoutMs: 8000 }),
      runShell(`lsof -nP -iTCP:${GATEWAY_PORT} -sTCP:LISTEN`, { timeoutMs: 8000 }),
      readTextIfExists(FOREGROUND_LOG),
      readTextIfExists(GATEWAY_LOG),
      readTextIfExists(STDERR_LOG),
      getForegroundPid(),
    ]);

  const processRows = psRes.stdout
    .split(/\r?\n/)
    .slice(1)
    .map(parsePsLine)
    .filter(Boolean);

  const openclawProcesses = processRows.filter((row) => {
    const command = row.command;
    if (/monitor\/server\.mjs/.test(command)) {
      return false;
    }
    if (/ps -axo pid,ppid,%cpu,%mem,etime,command/.test(command)) {
      return false;
    }
    if (/openclaw-local\.sh\s+--version/.test(command)) {
      return false;
    }
    if (/openclaw-local\.sh\s+gateway\s+status/.test(command)) {
      return false;
    }
    if (/openclaw-local\.sh\s+dashboard\s+--no-open/.test(command)) {
      return false;
    }
    return /openclaw-gateway|dist\/index\.js\s+gateway|gateway\s+run/i.test(command);
  });

  const dashboardMatch = dashboardRes.stdout.match(/Dashboard URL:\s*(\S+)/);
  const dashboardUrl = dashboardMatch?.[1] || `http://127.0.0.1:${GATEWAY_PORT}/`;

  const listening = lsofRes.ok && /LISTEN/.test(lsofRes.stdout);
  const foregroundPidRunning =
    foregroundPid !== null && openclawProcesses.some((row) => row.pid === foregroundPid);

  const modelPrimary = config?.agents?.defaults?.model?.primary || "unknown";
  const tokenPreview = maskToken(config?.gateway?.auth?.token);

  return {
    timestamp: new Date().toISOString(),
    repoRoot: REPO_ROOT,
    monitorPort: PORT,
    openclaw: {
      version: versionRes.ok ? versionRes.stdout : "unavailable",
      modelPrimary,
      configPath: CONFIG_PATH,
      stateDir: STATE_DIR,
      authMode: config?.gateway?.auth?.mode || "unknown",
      tokenPreview,
    },
    gateway: {
      port: GATEWAY_PORT,
      listening,
      listeningDetails: lsofRes.stdout,
      dashboardUrl,
      foregroundPid,
      foregroundPidRunning,
      processCount: openclawProcesses.length,
      processes: openclawProcesses,
      rawStatus: gatewayStatusRes.stdout || gatewayStatusRes.stderr,
    },
    logs: {
      foreground: {
        path: FOREGROUND_LOG,
        text: clipLines(foregroundLog),
      },
      gateway: {
        path: GATEWAY_LOG,
        text: clipLines(gatewayLog),
      },
      stderr: {
        path: STDERR_LOG,
        text: clipLines(stderrLog),
      },
    },
  };
}

async function startGatewayForeground() {
  await mkdir(RUN_DIR, { recursive: true });
  await mkdir(LOG_DIR, { recursive: true });

  const status = await collectStatus();
  if (status.gateway.listening) {
    return { ok: true, message: "Gateway already listening.", status };
  }

  const cmd = [
    `nohup ${shellQuote(OPENCLAW_BIN)} gateway run --port ${GATEWAY_PORT}`,
    `> ${shellQuote(FOREGROUND_LOG)} 2>&1 &`,
    `echo $! > ${shellQuote(PID_FILE)}`,
  ].join(" ");

  const runRes = await runShell(cmd, { timeoutMs: 8000 });
  if (!runRes.ok) {
    return { ok: false, message: runRes.stderr || "Failed to start gateway." };
  }

  await new Promise((resolve) => setTimeout(resolve, 1200));
  const updatedStatus = await collectStatus();
  if (updatedStatus.gateway.processes.length > 0) {
    await writeFile(PID_FILE, `${updatedStatus.gateway.processes[0].pid}\n`, "utf8");
  }
  return { ok: true, message: "Gateway start command sent.", status: updatedStatus };
}

async function stopGatewayForeground() {
  const status = await collectStatus();
  const pidCandidates = new Set();
  const trackedPid = await getForegroundPid();
  if (trackedPid !== null) {
    pidCandidates.add(trackedPid);
  }
  status.gateway.processes.forEach((row) => pidCandidates.add(row.pid));

  if (pidCandidates.size === 0) {
    return { ok: false, message: "No running gateway process found." };
  }

  const stopped = [];
  for (const pid of pidCandidates) {
    try {
      process.kill(pid, "SIGTERM");
      stopped.push(pid);
    } catch (error) {
      if (error?.code !== "ESRCH") {
        return { ok: false, message: `Failed to signal PID ${pid}: ${error.message}` };
      }
    }
  }

  try {
    await unlink(PID_FILE);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      return { ok: false, message: `Failed to remove PID file: ${error.message}` };
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    ok: true,
    message: `Sent SIGTERM to PIDs: ${stopped.join(", ") || "none"}.`,
    status: await collectStatus(),
  };
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/status") {
    json(res, 200, await collectStatus());
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/action") {
    let body = {};
    try {
      const raw = await readBody(req);
      body = raw ? JSON.parse(raw) : {};
    } catch {
      json(res, 400, { ok: false, message: "Invalid JSON body." });
      return;
    }

    const action = body?.action;
    if (action === "start") {
      const result = await startGatewayForeground();
      json(res, result.ok ? 200 : 500, result);
      return;
    }
    if (action === "stop") {
      const result = await stopGatewayForeground();
      json(res, result.ok ? 200 : 500, result);
      return;
    }
    if (action === "dashboard") {
      const status = await collectStatus();
      json(res, 200, { ok: true, dashboardUrl: status.gateway.dashboardUrl, status });
      return;
    }

    json(res, 400, { ok: false, message: "Unknown action." });
    return;
  }

  json(res, 404, { ok: false, message: "Not found." });
}

async function serveStatic(req, res, url) {
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.normalize(path.join(PUBLIC_DIR, requested));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  if (!(await pathExists(filePath))) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = path.extname(filePath);
  const contentType = CONTENT_TYPES[ext] || "application/octet-stream";
  const body = await readFile(filePath);
  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    await serveStatic(req, res, url);
  } catch (error) {
    json(res, 500, { ok: false, message: error.message });
  }
}).listen(PORT, "127.0.0.1", () => {
  process.stdout.write(
    `OpenClaw monitor running at http://127.0.0.1:${PORT}/ (watching gateway port ${GATEWAY_PORT})\n`,
  );
});

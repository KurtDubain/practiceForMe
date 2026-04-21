import http from "node:http";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";

const port = Number.parseInt(process.env.CODEX_PROXY_PORT ?? "18891", 10);
const repoRoot = process.env.CODEX_PROXY_REPO_ROOT?.trim() || process.cwd();
const codexBin = process.env.CODEX_PROXY_CODEX_BIN?.trim() || "codex";
const backendMode = process.env.CODEX_PROXY_BACKEND?.trim() || "auto";
const defaultModel = process.env.CODEX_PROXY_MODEL?.trim() || "gpt-5.4";
const defaultSandbox = process.env.CODEX_PROXY_SANDBOX?.trim() || "read-only";
const defaultEffort = process.env.CODEX_PROXY_REASONING?.trim() || "medium";
const timeoutMs = Number.parseInt(process.env.CODEX_PROXY_TIMEOUT_MS ?? "120000", 10);

function json(res, statusCode, body) {
  res.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  res.end(`${JSON.stringify(body)}\n`);
}

function openAiError(res, statusCode, message, type = "server_error") {
  json(res, statusCode, {
    error: {
      message,
      type,
    },
  });
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function normalizeContent(content) {
  if (typeof content === "string") {
    return content;
  }
  if (!Array.isArray(content)) {
    return "";
  }
  return content
    .map((part) => {
      if (!part || typeof part !== "object") {
        return "";
      }
      if (typeof part.text === "string") {
        return part.text;
      }
      if (typeof part.input_text === "string") {
        return part.input_text;
      }
      if (typeof part.output_text === "string") {
        return part.output_text;
      }
      if (part.type === "text" && typeof part.text === "string") {
        return part.text;
      }
      if ((part.type === "input_text" || part.type === "output_text") && typeof part.text === "string") {
        return part.text;
      }
      if (part.type === "image_url") {
        const url =
          typeof part.image_url === "string"
            ? part.image_url
            : typeof part.image_url?.url === "string"
              ? part.image_url.url
              : "";
        return url ? `[image: ${url}]` : "[image]";
      }
      if (part.type === "input_image") {
        const url =
          typeof part.image_url === "string"
            ? part.image_url
            : typeof part.image_url?.url === "string"
              ? part.image_url.url
              : "";
        return url ? `[image: ${url}]` : "[image]";
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

function buildPrompt(request) {
  const messages = Array.isArray(request.messages) ? request.messages : [];
  const systemParts = [];
  const transcriptParts = [];

  for (const message of messages) {
    if (!message || typeof message !== "object") {
      continue;
    }
    const role = typeof message.role === "string" ? message.role : "user";
    const content = normalizeContent(message.content);
    if (!content) {
      continue;
    }
    if (role === "system" || role === "developer") {
      systemParts.push(content);
      continue;
    }
    transcriptParts.push(`[${role}] ${content}`);
  }

  if (Array.isArray(request.tools) && request.tools.length > 0) {
    const toolNames = request.tools
      .map((tool) => tool?.function?.name || tool?.name)
      .filter((value) => typeof value === "string" && value.trim())
      .join(", ");
    if (toolNames) {
      systemParts.push(
        `The upstream caller exposed tools (${toolNames}), but this codex-proxy backend cannot emit native tool calls yet. Answer directly when possible.`,
      );
    }
  }

  const developerInstructions = [
    "You are serving as the model backend for an upstream OpenClaw assistant.",
    "Respond only with the assistant reply for the latest user request.",
    "Do not mention this proxy layer unless the user explicitly asks.",
    ...systemParts,
  ]
    .filter(Boolean)
    .join("\n\n");

  const prompt = [
    "Conversation transcript:",
    transcriptParts.length > 0 ? transcriptParts.join("\n\n") : "[no prior transcript]",
    "",
    "Now write the next assistant reply.",
  ].join("\n");

  return { developerInstructions, prompt };
}

function extractReasoningEffort(request) {
  const raw =
    request?.reasoning?.effort ??
    request?.reasoning_effort ??
    request?.metadata?.reasoning_effort ??
    defaultEffort;
  return raw === "low" || raw === "high" || raw === "medium" ? raw : defaultEffort;
}

function extractSandbox() {
  return defaultSandbox === "workspace-write" || defaultSandbox === "danger-full-access"
    ? defaultSandbox
    : "read-only";
}

function createOpenAiCompletion(text, model) {
  return {
    id: `chatcmpl-${randomUUID()}`,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: text,
        },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    },
  };
}

function streamOpenAiCompletion(res, text, model) {
  const id = `chatcmpl-${randomUUID()}`;
  const created = Math.floor(Date.now() / 1000);
  const chunks = text.match(/.{1,240}/gs) || [""];

  res.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache",
    connection: "keep-alive",
  });

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    const payload = {
      id,
      object: "chat.completion.chunk",
      created,
      model,
      choices: [
        {
          index: 0,
          delta: index === 0 ? { role: "assistant", content: chunk } : { content: chunk },
          finish_reason: null,
        },
      ],
    };
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }

  res.write(
    `data: ${JSON.stringify({
      id,
      object: "chat.completion.chunk",
      created,
      model,
      choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
    })}\n\n`,
  );
  res.end("data: [DONE]\n\n");
}

function extractAssistantTextFromItem(item) {
  if (!item || typeof item !== "object") {
    return "";
  }
  if (item.type === "message" && item.role === "assistant") {
    return normalizeContent(item.content);
  }
  return "";
}

function createJsonRpcClient(command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: ["pipe", "pipe", "pipe"],
    cwd: options.cwd,
    env: options.env,
  });

  let buffer = "";
  let nextId = 1;
  const pending = new Map();
  const notifications = new Set();

  child.stdout.on("data", (chunk) => {
    buffer += chunk.toString();
    while (true) {
      const newlineIndex = buffer.indexOf("\n");
      if (newlineIndex === -1) {
        break;
      }
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (!line) {
        continue;
      }
      let message;
      try {
        message = JSON.parse(line);
      } catch (error) {
        continue;
      }
      if (message.id != null && pending.has(message.id)) {
        const request = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) {
          request.reject(new Error(message.error.message || JSON.stringify(message.error)));
        } else {
          request.resolve(message.result);
        }
        continue;
      }
      for (const handler of notifications) {
        handler(message);
      }
    }
  });

  function request(method, params) {
    const id = nextId++;
    child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
    });
  }

  function onNotification(handler) {
    notifications.add(handler);
    return () => notifications.delete(handler);
  }

  return { child, request, onNotification };
}

class PersistentCodexAppServer {
  constructor() {
    this.client = null;
    this.unsubscribe = null;
    this.initPromise = null;
    this.pendingTurns = new Map();
    this.startedAtMs = null;
    this.readyAtMs = null;
    this.lastError = null;
    this.pid = null;
    this.requestsServed = 0;
  }

  snapshot() {
    return {
      active: this.client !== null,
      pid: this.pid,
      pendingTurns: this.pendingTurns.size,
      requestsServed: this.requestsServed,
      startedAtMs: this.startedAtMs,
      readyAtMs: this.readyAtMs,
      lastError: this.lastError,
    };
  }

  async ensureReady() {
    if (this.client) {
      return this.client;
    }
    if (this.initPromise) {
      return await this.initPromise;
    }
    this.initPromise = this.start();
    try {
      return await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  async start() {
    const client = createJsonRpcClient(codexBin, ["app-server"], {
      cwd: repoRoot,
      env: { ...process.env },
    });

    this.client = client;
    this.pid = client.child.pid ?? null;
    this.startedAtMs = Date.now();
    this.readyAtMs = null;

    this.unsubscribe = client.onNotification((message) => {
      this.handleNotification(message);
    });

    client.child.on("error", (error) => {
      this.handleFatal(error instanceof Error ? error : new Error(String(error)));
    });

    client.child.on("exit", (code, signal) => {
      const reason =
        code !== null ? `codex app-server exited with code ${code}` : `codex app-server exited on ${signal ?? "signal"}`;
      this.handleFatal(new Error(reason));
    });

    try {
      await client.request("initialize", {
        clientInfo: { name: "study-codex-proxy", version: "0.2.0" },
      });
      this.readyAtMs = Date.now();
      this.lastError = null;
      return client;
    } catch (error) {
      this.handleFatal(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  async runTurn({ developerInstructions, prompt, model, effort, sandbox }) {
    const client = await this.ensureReady();
    const threadResult = await client.request("thread/start", {
      cwd: repoRoot,
      sandbox,
      approvalPolicy: "never",
      model,
      developerInstructions,
    });
    const threadId = threadResult.thread.id;

    return await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.rejectTurn(threadId, new Error(`codex app-server timed out after ${timeoutMs}ms`));
        this.archiveThread(threadId);
      }, timeoutMs);
      timer.unref?.();

      this.pendingTurns.set(threadId, {
        resolve,
        reject,
        timer,
        finalText: "",
      });

      client
        .request("turn/start", {
          threadId,
          input: [{ type: "text", text: prompt }],
          effort,
        })
        .catch((error) => {
          this.rejectTurn(threadId, error instanceof Error ? error : new Error(String(error)));
          this.archiveThread(threadId);
        });
    });
  }

  archiveThread(threadId) {
    if (!this.client) {
      return;
    }
    this.client.request("thread/archive", { threadId }).catch(() => {});
  }

  resolveTurn(threadId, text) {
    const entry = this.pendingTurns.get(threadId);
    if (!entry) {
      return;
    }
    clearTimeout(entry.timer);
    this.pendingTurns.delete(threadId);
    this.requestsServed += 1;
    this.archiveThread(threadId);
    entry.resolve(text);
  }

  rejectTurn(threadId, error) {
    const entry = this.pendingTurns.get(threadId);
    if (!entry) {
      return;
    }
    clearTimeout(entry.timer);
    this.pendingTurns.delete(threadId);
    this.archiveThread(threadId);
    entry.reject(error);
  }

  failAll(error) {
    for (const [threadId] of this.pendingTurns) {
      this.rejectTurn(threadId, error);
    }
  }

  handleNotification(message) {
    const method = message?.method;
    const params = message?.params ?? {};
    const threadId = typeof params.threadId === "string" ? params.threadId : null;

    if ((method === "item/completed" || method === "raw_response_item/completed") && threadId) {
      const entry = this.pendingTurns.get(threadId);
      if (!entry) {
        return;
      }
      const text = extractAssistantTextFromItem(params.item);
      if (text) {
        entry.finalText = text;
      }
      return;
    }

    if (method === "turn/completed" && threadId) {
      const entry = this.pendingTurns.get(threadId);
      if (!entry) {
        return;
      }
      if (entry.finalText) {
        this.resolveTurn(threadId, entry.finalText);
        return;
      }
      this.rejectTurn(threadId, new Error("codex app-server completed without assistant text"));
      return;
    }

    if (method === "error") {
      const text = typeof params.message === "string" && params.message.trim() ? params.message.trim() : "codex app-server error";
      if (threadId) {
        this.rejectTurn(threadId, new Error(text));
      } else {
        this.handleFatal(new Error(text));
      }
    }
  }

  handleFatal(error) {
    this.lastError = error instanceof Error ? error.message : String(error);
    this.failAll(error instanceof Error ? error : new Error(String(error)));
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    if (this.client) {
      this.client.child.removeAllListeners();
      this.client = null;
    }
    this.pid = null;
    this.readyAtMs = null;
  }

  close() {
    if (!this.client) {
      return;
    }
    const child = this.client.child;
    this.handleFatal(new Error("codex app-server closed"));
    child.kill("SIGTERM");
  }
}

const persistentAppServer = new PersistentCodexAppServer();

async function runViaAppServer({ developerInstructions, prompt, model, effort, sandbox }) {
  return await persistentAppServer.runTurn({
    developerInstructions,
    prompt,
    model,
    effort,
    sandbox,
  });
}

async function runViaExec({ developerInstructions, prompt, model, effort, sandbox }) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-proxy-"));
  const outputPath = path.join(tempDir, "last-message.txt");

  return await new Promise((resolve, reject) => {
    const args = [
      "exec",
      "--model",
      model,
      "-c",
      `model_reasoning_effort="${effort}"`,
      "--skip-git-repo-check",
      "--cd",
      repoRoot,
      "--sandbox",
      sandbox,
      "--color",
      "never",
      "-o",
      outputPath,
      [developerInstructions, prompt].filter(Boolean).join("\n\n"),
    ];

    const child = spawn(codexBin, args, {
      cwd: repoRoot,
      env: { ...process.env },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stderr = "";
    let settled = false;
    let lastOutput = "";
    let lastSeenAt = 0;

    const cleanup = async () => {
      clearInterval(poll);
      clearTimeout(timer);
      child.removeAllListeners();
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    };

    const finish = async (value) => {
      if (settled) {
        return;
      }
      settled = true;
      await cleanup();
      resolve(value);
    };

    const fail = async (error) => {
      if (settled) {
        return;
      }
      settled = true;
      await cleanup();
      reject(error);
    };

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > 16000) {
        stderr = stderr.slice(-16000);
      }
    });

    child.on("error", (error) => {
      fail(error).catch(() => {});
    });

    child.on("close", async (code) => {
      if (lastOutput) {
        await finish(lastOutput);
        return;
      }
      await fail(new Error(stderr.trim() || `codex exec exited with code ${code ?? "signal"}`));
    });

    const poll = setInterval(async () => {
      try {
        const content = await fs.readFile(outputPath, "utf8");
        const trimmed = content.trim();
        if (trimmed) {
          if (trimmed !== lastOutput) {
            lastOutput = trimmed;
            lastSeenAt = Date.now();
          } else if (Date.now() - lastSeenAt > 1500) {
            child.kill("SIGTERM");
            await finish(lastOutput);
          }
        }
      } catch {
        // ignore
      }
    }, 500);
    poll.unref?.();

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      const message = lastOutput || stderr.trim() || `codex exec timed out after ${timeoutMs}ms`;
      if (lastOutput) {
        finish(lastOutput).catch(() => {});
        return;
      }
      fail(new Error(message)).catch(() => {});
    }, timeoutMs);
    timer.unref?.();
  });
}

async function runCodexPrompt(params) {
  if (backendMode === "app-server") {
    return await runViaAppServer(params);
  }
  if (backendMode === "exec") {
    return await runViaExec(params);
  }
  try {
    return await runViaAppServer(params);
  } catch (error) {
    return await runViaExec(params);
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    json(res, 200, {
      ok: true,
      backend: backendMode,
      repoRoot,
      codexBin,
      model: defaultModel,
      appServer: persistentAppServer.snapshot(),
    });
    return;
  }

  if (req.method === "GET" && req.url === "/v1/models") {
    json(res, 200, {
      object: "list",
      data: [
        {
          id: defaultModel,
          object: "model",
          created: 0,
          owned_by: "codex-proxy",
        },
      ],
    });
    return;
  }

  if (req.method === "POST" && req.url === "/v1/chat/completions") {
    try {
      const body = await readJsonBody(req);
      const model = typeof body.model === "string" && body.model.trim() ? body.model.trim() : defaultModel;
      const effort = extractReasoningEffort(body);
      const sandbox = extractSandbox();
      const { developerInstructions, prompt } = buildPrompt(body);
      const answer = await runCodexPrompt({
        developerInstructions,
        prompt,
        model,
        effort,
        sandbox,
      });

      if (body.stream === true) {
        streamOpenAiCompletion(res, answer, model);
        return;
      }
      json(res, 200, createOpenAiCompletion(answer, model));
      return;
    } catch (error) {
      openAiError(res, 500, error instanceof Error ? error.message : String(error));
      return;
    }
  }

  openAiError(res, 404, `Unsupported route: ${req.method} ${req.url}`, "not_found_error");
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(
    `[codex-proxy] listening on http://127.0.0.1:${port} (backend=${backendMode}, repo=${repoRoot})\n`,
  );
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    persistentAppServer.close();
    server.close(() => {
      process.exit(0);
    });
  });
}

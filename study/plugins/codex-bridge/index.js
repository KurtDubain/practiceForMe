import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pluginDir = path.dirname(fileURLToPath(import.meta.url));
const studyDir = path.dirname(pluginDir);
const defaultRepoRoot = path.dirname(studyDir);

function getPluginConfig(api) {
  const config = api.config?.plugins?.entries?.["codex-bridge"]?.config ?? {};
  return {
    repoRoot: typeof config.repoRoot === "string" && config.repoRoot.trim() ? config.repoRoot.trim() : defaultRepoRoot,
    codexBin: typeof config.codexBin === "string" && config.codexBin.trim() ? config.codexBin.trim() : "codex",
    defaultSandbox:
      config.defaultSandbox === "workspace-write" || config.defaultSandbox === "danger-full-access"
        ? config.defaultSandbox
        : "read-only",
    reasoningEffort:
      config.reasoningEffort === "low" || config.reasoningEffort === "high"
        ? config.reasoningEffort
        : "medium",
    timeoutMs:
      typeof config.timeoutMs === "number" && Number.isFinite(config.timeoutMs) && config.timeoutMs >= 1000
        ? Math.floor(config.timeoutMs)
        : 900000,
    maxOutputChars:
      typeof config.maxOutputChars === "number" &&
      Number.isFinite(config.maxOutputChars) &&
      config.maxOutputChars >= 500
        ? Math.floor(config.maxOutputChars)
        : 12000,
  };
}

function truncateOutput(text, limit) {
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit)}\n\n[truncated ${text.length - limit} chars]`;
}

function parseCodexArgs(rawArgs, defaultSandbox) {
  const trimmed = (rawArgs ?? "").trim();
  if (!trimmed) {
    return { mode: "help" };
  }

  const match = trimmed.match(/^(\S+)(?:\s+([\s\S]*))?$/);
  const first = (match?.[1] ?? "").toLowerCase();
  const rest = (match?.[2] ?? "").trim();

  if (first === "help") {
    return { mode: "help" };
  }
  if (first === "status") {
    return { mode: "status" };
  }
  if (first === "read") {
    return rest ? { mode: "run", sandbox: "read-only", prompt: rest } : { mode: "help" };
  }
  if (first === "write") {
    return rest ? { mode: "run", sandbox: "workspace-write", prompt: rest } : { mode: "help" };
  }
  if (first === "danger") {
    return rest ? { mode: "run", sandbox: "danger-full-access", prompt: rest } : { mode: "help" };
  }
  return { mode: "run", sandbox: defaultSandbox, prompt: trimmed };
}

function formatHelp() {
  return [
    "Codex bridge commands:",
    "",
    "/codex status",
    "/codex read <task>",
    "/codex write <task>",
    "/codex danger <task>",
    "/codex <task>    # uses default sandbox (read-only)",
    "",
    "Examples:",
    "/codex read 总结当前仓库结构",
    "/codex write 在 practice/self-test.js 里补齐 parseArr 并解释改动",
  ].join("\n");
}

function runCommand(command, args, options = {}) {
  const { cwd, env, timeoutMs = 900000, maxOutputChars = 12000 } = options;

  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let killedByTimeout = false;

    const timer = setTimeout(() => {
      killedByTimeout = true;
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 2000).unref?.();
    }, timeoutMs);
    timer.unref?.();

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
      if (stdout.length > maxOutputChars * 2) {
        stdout = stdout.slice(-maxOutputChars * 2);
      }
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > maxOutputChars * 2) {
        stderr = stderr.slice(-maxOutputChars * 2);
      }
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({
        ok: false,
        code: null,
        stdout,
        stderr: `${stderr}\n${error.message}`.trim(),
        killedByTimeout: false,
      });
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({
        ok: code === 0 && !killedByTimeout,
        code,
        stdout: truncateOutput(stdout.trim(), maxOutputChars),
        stderr: truncateOutput(stderr.trim(), maxOutputChars),
        killedByTimeout,
      });
    });
  });
}

async function codexStatus(api) {
  const pluginConfig = getPluginConfig(api);
  const baseEnv = { ...process.env };
  const version = await runCommand(pluginConfig.codexBin, ["--version"], {
    cwd: pluginConfig.repoRoot,
    env: baseEnv,
    timeoutMs: 30000,
    maxOutputChars: 4000,
  });
  const login = await runCommand(pluginConfig.codexBin, ["login", "status"], {
    cwd: pluginConfig.repoRoot,
    env: baseEnv,
    timeoutMs: 30000,
    maxOutputChars: 4000,
  });

  return [
    "Codex bridge status:",
    `- repoRoot: ${pluginConfig.repoRoot}`,
    `- codexBin: ${pluginConfig.codexBin}`,
    `- defaultSandbox: ${pluginConfig.defaultSandbox}`,
    `- reasoningEffort: ${pluginConfig.reasoningEffort}`,
    "",
    "[codex --version]",
    version.stdout || version.stderr || `(exit ${String(version.code)})`,
    "",
    "[codex login status]",
    login.stdout || login.stderr || `(exit ${String(login.code)})`,
  ].join("\n");
}

async function runCodex(api, prompt, sandbox) {
  const pluginConfig = getPluginConfig(api);
  const args = [
    "exec",
    "-c",
    `model_reasoning_effort="${pluginConfig.reasoningEffort}"`,
    "--skip-git-repo-check",
    "--cd",
    pluginConfig.repoRoot,
    "--sandbox",
    sandbox,
    "--color",
    "never",
    prompt,
  ];

  const result = await runCommand(pluginConfig.codexBin, args, {
    cwd: pluginConfig.repoRoot,
    env: { ...process.env },
    timeoutMs: pluginConfig.timeoutMs,
    maxOutputChars: pluginConfig.maxOutputChars,
  });

  const banner = [
    `sandbox: ${sandbox}`,
    `repo: ${pluginConfig.repoRoot}`,
    `exit: ${result.code === null ? "signal" : result.code}`,
  ].join(" | ");

  const body = result.stdout || result.stderr || "(no output)";
  if (result.ok) {
    return `${banner}\n\n${body}`;
  }

  if (result.killedByTimeout) {
    return `${banner}\n\nTimed out after ${pluginConfig.timeoutMs}ms.\n\n${body}`;
  }

  return `${banner}\n\n${body}`;
}

function registerSlashCommand(api) {
  api.registerCommand({
    name: "codex",
    description: "Run the local Codex CLI from OpenClaw without invoking the OpenClaw model.",
    acceptsArgs: true,
    requireAuth: true,
    handler: async (ctx) => {
      const pluginConfig = getPluginConfig(api);
      const parsed = parseCodexArgs(ctx.args ?? "", pluginConfig.defaultSandbox);

      if (parsed.mode === "help") {
        return { text: formatHelp() };
      }
      if (parsed.mode === "status") {
        return { text: await codexStatus(api) };
      }

      const text = await runCodex(api, parsed.prompt, parsed.sandbox);
      return { text };
    },
  });
}

function registerCli(api) {
  api.registerCli(
    ({ program }) => {
      program
        .command("codex-status")
        .description("Show local Codex bridge status")
        .action(async () => {
          const text = await codexStatus(api);
          process.stdout.write(`${text}\n`);
        });

      program
        .command("codex-run [task...]")
        .description("Run the local Codex CLI through the OpenClaw codex-bridge plugin")
        .option("--write", "Run with workspace-write sandbox")
        .option("--danger", "Run with danger-full-access sandbox")
        .action(async (task, options) => {
          const pluginConfig = getPluginConfig(api);
          const prompt = Array.isArray(task) ? task.join(" ").trim() : "";
          if (!prompt) {
            process.stderr.write(`${formatHelp()}\n`);
            process.exitCode = 1;
            return;
          }

          let sandbox = pluginConfig.defaultSandbox;
          if (options.danger) {
            sandbox = "danger-full-access";
          } else if (options.write) {
            sandbox = "workspace-write";
          }

          const text = await runCodex(api, prompt, sandbox);
          process.stdout.write(`${text}\n`);
        });
    },
    { commands: ["codex-status", "codex-run"] },
  );
}

export default function register(api) {
  registerSlashCommand(api);
  registerCli(api);
}

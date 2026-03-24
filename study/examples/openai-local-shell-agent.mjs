#!/usr/bin/env node

import { exec } from "node:child_process/promises";
import readline from "node:readline/promises";
import process from "node:process";
import { stdin as input, stdout as output } from "node:process";

const API_URL = "https://api.openai.com/v1/responses";
const MODEL = process.env.OPENAI_MODEL || "gpt-5.4";
const API_KEY = process.env.OPENAI_API_KEY;
const APPROVAL_MODE = process.env.OPENAI_SHELL_APPROVAL || "manual";
const MAX_TURNS = Number(process.env.OPENAI_MAX_TURNS || "8");
const SHELL_CWD = process.env.OPENAI_SHELL_CWD || process.cwd();
const DEFAULT_INSTRUCTIONS =
  "You are a local coding assistant running on macOS. Use shell commands only when needed. Keep commands non-interactive, explain risky actions, and prefer concise final answers.";

function clip(text, maxLength) {
  if (typeof text !== "string") {
    return "";
  }

  if (!Number.isFinite(maxLength) || maxLength <= 0 || text.length <= maxLength) {
    return text;
  }

  const suffix = "\n...[truncated]";
  return text.slice(0, Math.max(0, maxLength - suffix.length)) + suffix;
}

async function callResponsesApi(body) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

function getTextOutput(response) {
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const pieces = [];
  for (const item of response.output || []) {
    if (!Array.isArray(item.content)) {
      continue;
    }

    for (const content of item.content) {
      if (content?.type === "output_text" && typeof content.text === "string") {
        pieces.push(content.text);
      }
    }
  }

  return pieces.join("\n").trim();
}

async function approveCommands(commands) {
  if (APPROVAL_MODE === "auto") {
    return true;
  }

  const rl = readline.createInterface({ input, output });
  try {
    output.write("\nShell commands requested by the model:\n");
    for (const command of commands) {
      output.write(`  $ ${command}\n`);
    }

    const answer = await rl.question("Approve these commands? [y/N] ");
    return /^y(es)?$/i.test(answer.trim());
  } finally {
    rl.close();
  }
}

async function runCommand(command, timeoutMs, maxOutputLength) {
  try {
    const result = await exec(command, {
      cwd: SHELL_CWD,
      timeout: timeoutMs,
      shell: "/bin/zsh",
      maxBuffer: 1024 * 1024 * 8,
      env: process.env,
    });

    return {
      command,
      stdout: clip(result.stdout, maxOutputLength),
      stderr: clip(result.stderr, maxOutputLength),
      outcome: {
        type: "exit",
        exit_code: 0,
      },
    };
  } catch (error) {
    const timedOut = Boolean(error?.killed) && error?.signal === "SIGTERM";
    return {
      command,
      stdout: clip(error?.stdout || "", maxOutputLength),
      stderr: clip(error?.stderr || String(error), maxOutputLength),
      outcome: timedOut
        ? { type: "timeout" }
        : { type: "exit", exit_code: Number.isInteger(error?.code) ? error.code : 1 },
    };
  }
}

async function executeShellCall(shellCall) {
  const commands = shellCall?.action?.commands || [];
  const timeoutMs = shellCall?.action?.timeout_ms || 60_000;
  const maxOutputLength = shellCall?.action?.max_output_length || 4096;

  const approved = await approveCommands(commands);
  if (!approved) {
    return {
      type: "shell_call_output",
      call_id: shellCall.call_id,
      max_output_length: maxOutputLength,
      output: commands.map((command) => ({
        command,
        stdout: "",
        stderr: "Command not approved by operator.",
        outcome: { type: "exit", exit_code: 126 },
      })),
    };
  }

  const outputItems = [];
  for (const command of commands) {
    output.write(`\n$ ${command}\n`);
    outputItems.push(await runCommand(command, timeoutMs, maxOutputLength));
  }

  return {
    type: "shell_call_output",
    call_id: shellCall.call_id,
    max_output_length: maxOutputLength,
    output: outputItems,
  };
}

async function main() {
  const task = process.argv.slice(2).join(" ").trim();

  if (!API_KEY) {
    throw new Error("Set OPENAI_API_KEY before running this script.");
  }

  if (!task) {
    throw new Error('Usage: node study/examples/openai-local-shell-agent.mjs "your task"');
  }

  let previousResponseId;
  let nextInput = task;

  for (let turn = 1; turn <= MAX_TURNS; turn += 1) {
    const response = await callResponsesApi({
      model: MODEL,
      instructions: DEFAULT_INSTRUCTIONS,
      input: nextInput,
      previous_response_id: previousResponseId,
      tools: [{ type: "shell", environment: { type: "local" } }],
    });

    previousResponseId = response.id;

    const shellCalls = (response.output || []).filter((item) => item?.type === "shell_call");
    if (shellCalls.length === 0) {
      const text = getTextOutput(response);
      if (text) {
        output.write(`\nFinal response:\n${text}\n`);
      } else {
        output.write("\nNo final text was returned.\n");
      }
      return;
    }

    const shellOutputs = [];
    for (const shellCall of shellCalls) {
      shellOutputs.push(await executeShellCall(shellCall));
    }

    nextInput = shellOutputs;
  }

  throw new Error(`Exceeded OPENAI_MAX_TURNS=${MAX_TURNS} before the model finished.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

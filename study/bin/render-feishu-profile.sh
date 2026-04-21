#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/../.." && pwd)"
study_dir="${repo_root}/study"
env_file="${study_dir}/.env.feishu"
output_dir="${study_dir}/.generated"
output_file="${output_dir}/openclaw.feishu.ollama.json"
workspace_dir="${study_dir}/workspace"

if [ ! -f "$env_file" ]; then
  printf 'Missing %s\n' "$env_file" >&2
  printf 'Create it from:\n  cp %s %s\n' "${env_file}.example" "$env_file" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$env_file"
set +a

required_vars=(
  FEISHU_APP_ID
  FEISHU_APP_SECRET
)

for var_name in "${required_vars[@]}"; do
  if [ -z "${!var_name:-}" ]; then
    printf '%s is required in %s\n' "$var_name" "$env_file" >&2
    exit 1
  fi
done

mkdir -p "$output_dir"

export REPO_ROOT="$repo_root"
export STUDY_WORKSPACE="$workspace_dir"
export OUTPUT_FILE="$output_file"

node <<'NODE'
const fs = require("fs");
const path = require("path");

function csvList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const config = {
  env: {
    OLLAMA_API_KEY: process.env.OLLAMA_API_KEY || "ollama-local",
  },
  logging: {
    level: "info",
  },
  gateway: {
    mode: "local",
    bind: "loopback",
    port: 18789,
  },
  agents: {
    defaults: {
      workspace: process.env.STUDY_WORKSPACE,
      skipBootstrap: true,
      model: {
        primary: process.env.OPENCLAW_FEISHU_MODEL || "ollama/gpt-oss:20b",
        fallbacks: [process.env.OPENCLAW_FEISHU_FALLBACK || "ollama/llama3.3"],
      },
      thinkingDefault: "high",
      timeoutSeconds: 1800,
      heartbeat: {
        every: "0m",
      },
    },
  },
  commands: {
    native: "auto",
    nativeSkills: "auto",
    restart: true,
    ownerDisplay: "raw",
  },
  messages: {
    groupChat: {
      mentionPatterns: ["@openclaw", "openclaw"],
    },
  },
  session: {
    scope: "per-sender",
    resetTriggers: ["/new", "/reset"],
    reset: {
      mode: "daily",
      atHour: 4,
      idleMinutes: 10080,
    },
  },
  channels: {
    feishu: {
      enabled: true,
      domain: process.env.FEISHU_DOMAIN || "feishu",
      connectionMode: "websocket",
      defaultAccount: "default",
      dmPolicy: process.env.FEISHU_DM_POLICY || "pairing",
      groupPolicy: process.env.FEISHU_GROUP_POLICY || "open",
      streaming: String(process.env.FEISHU_STREAMING || "true") !== "false",
      accounts: {
        default: {
          appId: process.env.FEISHU_APP_ID,
          appSecret: process.env.FEISHU_APP_SECRET,
          botName: process.env.FEISHU_BOT_NAME || "StudyClaw",
        },
      },
    },
  },
};

const allowFrom = csvList(process.env.FEISHU_ALLOW_FROM);
if (allowFrom.length) config.channels.feishu.allowFrom = allowFrom;

const groupAllowFrom = csvList(process.env.FEISHU_GROUP_ALLOW_FROM);
if (groupAllowFrom.length) {
  config.channels.feishu.groupPolicy = "allowlist";
  config.channels.feishu.groupAllowFrom = groupAllowFrom;
}

fs.writeFileSync(process.env.OUTPUT_FILE, JSON.stringify(config, null, 2));
console.log(`Rendered ${process.env.OUTPUT_FILE}`);
NODE

printf 'Export with:\n'
printf 'export OPENCLAW_CONFIG_PATH="%s"\n' "$output_file"

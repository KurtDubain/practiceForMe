#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/../.." && pwd)"
runtime_bin="${repo_root}/study/openclaw-runtime/node_modules/.bin/openclaw"
default_config="${repo_root}/study/.generated/openclaw.codex.json"
default_state_dir="${repo_root}/study/.state/openclaw"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "${NVM_DIR}/nvm.sh" ]; then
  # Force the OpenClaw runtime to use Node 24 in non-interactive shells.
  . "${NVM_DIR}/nvm.sh"
  nvm use --silent 24 >/dev/null 2>&1 || true
fi

if [ ! -x "$runtime_bin" ]; then
  printf 'OpenClaw local runtime is missing at %s\n' "$runtime_bin" >&2
  printf 'Install it with:\n' >&2
  printf '  cd %s/study/openclaw-runtime && npm install --no-audit --no-fund\n' "$repo_root" >&2
  exit 1
fi

mkdir -p "$default_state_dir"

if [ -z "${OPENCLAW_STATE_DIR:-}" ]; then
  export OPENCLAW_STATE_DIR="$default_state_dir"
fi

if [ -z "${OPENCLAW_CONFIG_PATH:-}" ] && [ -f "$default_config" ]; then
  export OPENCLAW_CONFIG_PATH="$default_config"
fi

exec "$runtime_bin" "$@"

#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/../.." && pwd)"

if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
  "${script_dir}/openclaw-local.sh" onboard --help
  exit 0
fi

"${script_dir}/render-profile.sh" codex >/dev/null

export OPENCLAW_CONFIG_PATH="${repo_root}/study/.generated/openclaw.codex.json"
export OPENCLAW_STATE_DIR="${repo_root}/study/.state/openclaw"

printf 'Using config: %s\n' "$OPENCLAW_CONFIG_PATH"
printf 'Using state : %s\n' "$OPENCLAW_STATE_DIR"
printf '\nStarting Codex onboarding (local, channels skipped)...\n\n'

"${script_dir}/openclaw-local.sh" onboard \
  --accept-risk \
  --auth-choice openai-codex \
  --flow quickstart \
  --mode local \
  --skip-channels \
  --workspace "${repo_root}/study/workspace"

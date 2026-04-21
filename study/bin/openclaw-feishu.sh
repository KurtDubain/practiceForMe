#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/../.." && pwd)"
study_dir="${repo_root}/study"
env_file="${study_dir}/.env.feishu"
config_path="${study_dir}/.generated/openclaw.feishu.ollama.json"

if [ ! -f "$env_file" ]; then
  printf 'Missing %s\n' "$env_file" >&2
  printf 'Create it from:\n  cp %s %s\n' "${env_file}.example" "$env_file" >&2
  exit 1
fi

"${script_dir}/render-feishu-profile.sh" >/dev/null

set -a
# shellcheck disable=SC1090
. "$env_file"
set +a

export OPENCLAW_CONFIG_PATH="${OPENCLAW_CONFIG_PATH:-$config_path}"

if ! command -v ollama >/dev/null 2>&1; then
  printf 'ollama is required for this profile.\n' >&2
  exit 1
fi

exec "${script_dir}/openclaw-local.sh" "$@"

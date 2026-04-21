#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/../.." && pwd)"
study_dir="${repo_root}/study"
env_file="${study_dir}/.env.openai"
config_path="${study_dir}/.generated/openclaw.openai.json"

"${script_dir}/render-profile.sh" openai >/dev/null

if [ -f "$env_file" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$env_file"
  set +a
fi

export OPENCLAW_CONFIG_PATH="${OPENCLAW_CONFIG_PATH:-$config_path}"

if [ -z "${OPENAI_API_KEY:-}" ]; then
  printf 'OPENAI_API_KEY is missing.\n' >&2
  printf 'Use one of these methods:\n' >&2
  printf '  1) export OPENAI_API_KEY=\"...\"\n' >&2
  printf '  2) create %s from %s\n' "$env_file" "${env_file}.example" >&2
  exit 1
fi

exec "${script_dir}/openclaw-local.sh" "$@"

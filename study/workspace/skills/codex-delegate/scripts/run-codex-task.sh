#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/../../../../.." && pwd)"

if ! command -v codex >/dev/null 2>&1; then
  printf 'codex CLI not found in PATH.\n' >&2
  exit 1
fi

if [ "$#" -gt 0 ]; then
  prompt="$*"
else
  prompt="$(cat)"
fi

if [ -z "${prompt// }" ]; then
  printf 'A prompt is required.\n' >&2
  exit 1
fi

exec codex -a never -s workspace-write exec --cd "$repo_root" "$prompt"

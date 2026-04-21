#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/../.." && pwd)"

if ! command -v codex >/dev/null 2>&1; then
  printf 'codex CLI is not installed or not in PATH.\n' >&2
  exit 1
fi

if [ "$#" -gt 0 ]; then
  exec codex app "$@"
fi

exec codex app "${repo_root}"

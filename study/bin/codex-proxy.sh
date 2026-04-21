#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/../.." && pwd)"
server_script="${repo_root}/study/codex-proxy/server.mjs"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "${NVM_DIR}/nvm.sh" ]; then
  . "${NVM_DIR}/nvm.sh"
  nvm use --silent 24 >/dev/null 2>&1 || true
fi

export CODEX_PROXY_REPO_ROOT="${CODEX_PROXY_REPO_ROOT:-$repo_root}"

exec node "$server_script" "$@"

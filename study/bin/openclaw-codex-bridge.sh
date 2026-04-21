#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/../.." && pwd)"
config_path="${repo_root}/study/.generated/openclaw.codexbridge.json"
render_script="${repo_root}/study/bin/render-profile.sh"
openclaw_script="${repo_root}/study/bin/openclaw-local.sh"

if [ ! -f "$config_path" ]; then
  "$render_script" codexbridge >/dev/null
fi

export OPENCLAW_CONFIG_PATH="$config_path"

exec "$openclaw_script" "$@"

#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -ne 1 ]; then
  printf 'usage: %s <openai|codex|codexbridge|codexprovider|ollama>\n' "$0" >&2
  exit 1
fi

profile="$1"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
study_dir="$(cd "${script_dir}/.." && pwd)"
repo_root="$(cd "${study_dir}/.." && pwd)"
workspace_dir="${study_dir}/workspace"
codex_plugin_dir="${study_dir}/plugins/codex-bridge"
template="${study_dir}/profiles/openclaw.${profile}.template.json"
output_dir="${study_dir}/.generated"
output_file="${output_dir}/openclaw.${profile}.json"

if [ ! -f "$template" ]; then
  printf 'unknown profile: %s\n' "$profile" >&2
  exit 1
fi

mkdir -p "$output_dir"
sed \
  -e "s|__WORKSPACE__|${workspace_dir}|g" \
  -e "s|__REPO_ROOT__|${repo_root}|g" \
  -e "s|__CODEX_PLUGIN__|${codex_plugin_dir}|g" \
  "$template" > "$output_file"

printf 'Rendered %s\n' "$output_file"
printf 'Export with:\n'
printf 'export OPENCLAW_CONFIG_PATH="%s"\n' "$output_file"

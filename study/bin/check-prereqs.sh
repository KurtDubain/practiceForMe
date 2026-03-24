#!/usr/bin/env bash

set -euo pipefail

status=0
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
study_dir="$(cd "${script_dir}/.." && pwd)"
local_openclaw_bin="${study_dir}/openclaw-runtime/node_modules/.bin/openclaw"

if [ -z "${NVM_DIR:-}" ]; then
  export NVM_DIR="$HOME/.nvm"
fi

if [ -s "${NVM_DIR}/nvm.sh" ]; then
  # Keep checks aligned with the user's interactive shell default.
  . "${NVM_DIR}/nvm.sh"
  nvm use --silent default >/dev/null 2>&1 || true
fi

print_ok() {
  printf '[ok] %s\n' "$1"
}

print_warn() {
  printf '[warn] %s\n' "$1"
  status=1
}

have_cmd() {
  command -v "$1" >/dev/null 2>&1
}

check_node() {
  if ! have_cmd node; then
    print_warn 'node is missing. Install Node 24 with Homebrew: brew install node@24'
    return
  fi

  local version major
  version="$(node -v)"
  major="${version#v}"
  major="${major%%.*}"

  if [ "$major" -ge 22 ]; then
    print_ok "node ${version}"
  else
    print_warn "node ${version} is too old for current OpenClaw docs. Install Node 24 and put it first in PATH."
  fi
}

check_simple() {
  local cmd="$1"
  local ok_msg="$2"
  local warn_msg="$3"

  if have_cmd "$cmd"; then
    print_ok "$ok_msg"
  else
    print_warn "$warn_msg"
  fi
}

check_openclaw() {
  if have_cmd openclaw; then
    print_ok 'openclaw CLI is installed globally.'
    return
  fi

  if [ -x "$local_openclaw_bin" ]; then
    print_ok "openclaw runtime exists locally at ${local_openclaw_bin}."
    return
  fi

  print_warn 'openclaw CLI is not installed yet (global or local runtime).'
}

check_node
check_simple brew 'Homebrew is installed.' 'Homebrew is missing.'
check_simple npm 'npm is installed.' 'npm is missing.'
check_simple pnpm 'pnpm is installed.' 'pnpm is missing.'
check_simple git 'git is installed.' 'git is missing.'
check_openclaw
check_simple ollama 'ollama is installed.' 'ollama is not installed.'
check_simple docker 'docker is installed (optional).' 'docker is not installed (optional for local-first setup).'

if have_cmd ollama; then
  if ollama list | tail -n +2 | grep -q .; then
    print_ok 'Ollama has at least one local model.'
  else
    print_warn 'Ollama is installed but no models are pulled. For a local profile, start with: ollama pull gpt-oss:20b'
  fi
fi

if [ "$status" -ne 0 ]; then
  printf '\nOne or more items need attention before OpenClaw setup will be smooth.\n'
fi

exit "$status"

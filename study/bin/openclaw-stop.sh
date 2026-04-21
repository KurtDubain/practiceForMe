#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/../.." && pwd)"

ports=(
  18789
  18890
  18891
  18791
)

patterns=(
  "${repo_root}/study/openclaw-runtime/node_modules/.bin/openclaw"
  "${repo_root}/study/openclaw-runtime/node_modules/openclaw"
  "${repo_root}/study/codex-proxy/server.mjs"
  "${repo_root}/study/monitor/server.mjs"
  "${repo_root}/study/bin/openclaw-codex-provider.sh"
  "${repo_root}/study/bin/openclaw-codex-bridge.sh"
  "${repo_root}/study/bin/openclaw-local.sh"
  "${repo_root}/study/bin/openclaw-openai.sh"
  "${repo_root}/study/bin/openclaw-feishu.sh"
  "${repo_root}/study/bin/openclaw-monitor.sh"
  "${repo_root}/study/bin/codex-proxy.sh"
)

seen_pids=()
stopped_any=0

collect_pid() {
  local pid="$1"
  if [ -n "$pid" ] && [ "$pid" -gt 1 ] 2>/dev/null; then
    seen_pids+=("$pid")
  fi
}

for port in "${ports[@]}"; do
  while IFS= read -r pid; do
    collect_pid "$pid"
  done < <(lsof -n -P -t -iTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)
done

for pattern in "${patterns[@]}"; do
  while IFS= read -r pid; do
    collect_pid "$pid"
  done < <(pgrep -f "$pattern" 2>/dev/null || true)
done

unique_pids=()
if [ "${#seen_pids[@]}" -gt 0 ]; then
  while IFS= read -r pid; do
    unique_pids+=("$pid")
  done < <(printf '%s\n' "${seen_pids[@]}" | sort -u)
fi

if [ "${#unique_pids[@]}" -gt 0 ]; then
  for pid in "${unique_pids[@]}"; do
    if kill "$pid" 2>/dev/null; then
      stopped_any=1
    fi
  done
fi

sleep 1

if [ "${#unique_pids[@]}" -gt 0 ]; then
  for pid in "${unique_pids[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill -9 "$pid" 2>/dev/null || true
      stopped_any=1
    fi
  done
fi

remaining=0
for port in "${ports[@]}"; do
  if lsof -n -P -t -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    remaining=1
  fi
done

if [ "$remaining" -eq 1 ]; then
  printf 'Some study OpenClaw ports are still in use.\n' >&2
  for port in "${ports[@]}"; do
    lsof -n -P -iTCP:"$port" -sTCP:LISTEN 2>/dev/null || true
  done
  exit 1
fi

if [ "$stopped_any" -eq 1 ]; then
  printf 'Stopped study OpenClaw processes.\n'
else
  printf 'No study OpenClaw processes were running.\n'
fi

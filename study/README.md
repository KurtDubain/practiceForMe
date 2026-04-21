# OpenClaw Local Assistant Study

This directory is a repo-scoped starter kit for building a local OpenClaw assistant without mixing experiments into `~/.openclaw` too early.

It is designed around the current official OpenClaw docs:

- Install: `https://docs.openclaw.ai/install`
- Getting started: `https://docs.openclaw.ai/quickstart`
- Personal assistant setup: `https://docs.openclaw.ai/start/clawd`
- Configuration: `https://docs.openclaw.ai/gateway/configuration`
- Model providers: `https://docs.openclaw.ai/concepts/model-providers`
- Ollama provider: `https://docs.openclaw.ai/providers/ollama`

## What is in here

- `bin/check-prereqs.sh`: checks whether this machine matches the current OpenClaw prerequisites.
- `bin/render-profile.sh`: renders a repo-local OpenClaw config with the correct workspace path.
- `bin/openclaw-local.sh`: runs OpenClaw from `study/openclaw-runtime` with local state/config defaults.
- `bin/openclaw-openai.sh`: runs OpenClaw with the repo-local OpenAI API config and optional `study/.env.openai`.
- `bin/init-codex-local.sh`: one-command Codex onboarding flow for local-only setup.
- `bin/openclaw-codex-bridge.sh`: runs OpenClaw with a local plugin that forwards `/codex` directly to your logged-in Codex CLI.
- `bin/codex-proxy.sh`: starts a local OpenAI-compatible proxy that routes model requests into your logged-in Codex.
- `bin/openclaw-codex-provider.sh`: runs OpenClaw with `codex-proxy` as the default provider/model backend.
- `bin/openclaw-stop.sh`: stops the repo-local OpenClaw gateway, monitor, and codex-proxy processes.
- `bin/codex-study.sh`: runs the official Codex CLI directly in this repo.
- `bin/codex-desktop.sh`: opens the official Codex desktop app for this repo.
- `profiles/openclaw.openai.template.json`: OpenAI-backed profile template.
- `profiles/openclaw.codex.template.json`: Codex subscription profile template for OpenClaw.
- `profiles/openclaw.codexbridge.template.json`: OpenClaw profile that loads a local Codex bridge plugin.
- `profiles/openclaw.codexprovider.template.json`: OpenClaw profile that uses the local `codex-proxy` as a normal model provider.
- `profiles/openclaw.ollama.template.json`: Ollama-backed profile template.
- `codex-proxy/server.mjs`: local OpenAI-compatible HTTP facade over the Codex CLI.
- `examples/openai-local-shell-agent.mjs`: a direct local coding assistant using the OpenAI Responses API and the `shell` tool.
- `openclaw-runtime/package.json`: local pinned runtime install for environments where global npm install is flaky.
- `monitor/`: standalone visual process dashboard for OpenClaw runtime.
- `feishu/README.md`: repo-local runbook for OpenClaw + Feishu + Codex-skill routing.
- `workspace/`: the assistant's repo-local instruction and memory files.

## Machine snapshot for this workspace

These were checked on 2026-03-16 from this repo:

- Homebrew exists at `/opt/homebrew`
- `nvm` exists and default is `Node v24.14.0`
- `npm` is `11.9.0`
- `pnpm` exists
- `git` exists
- `docker` is not installed
- `ollama` exists, but no models are pulled yet
- `openclaw` is available via local runtime: `study/openclaw-runtime/node_modules/.bin/openclaw`

OpenClaw currently requires Node 22 or newer. This repo now uses Node 24 by default through `nvm`.

## Recommended setup order

1. Upgrade Node to 24.
2. Install the OpenClaw CLI globally.
3. Pick one route:
   - `openai` if you want direct OpenAI API usage with your own API key.
   - `codex` if you want OpenClaw to use ChatGPT/Codex OAuth instead of API billing.
   - `ollama` if you want the model runtime to stay local on this machine.
4. Render a repo-local config.
5. Run `./study/bin/openclaw-local.sh onboard --install-daemon`.
6. Open the Control UI first.
7. Only after that, add messaging channels if you need them.

## Step 1: Upgrade Node with nvm

If `node -v` is still lower than 22, run:

```bash
nvm install 24
nvm alias default 24
nvm use 24
node -v
```

Expected result: `node -v` should print a `v24.x.x` release.

## Step 2: Install OpenClaw

The official install page documents two practical options:

```bash
npm install -g openclaw@latest
```

Or the official installer:

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

For this study workspace, the manual `npm install -g` path is easier to reason about.

If global install is blocked by your network (common when GitHub git dependencies time out), use the local runtime in this repo:

```bash
cd study/openclaw-runtime
npm install --no-audit --no-fund
```

Then run OpenClaw through:

```bash
./study/bin/openclaw-local.sh --version
```

## Step 3A: OpenAI API route in OpenClaw

Export your API key in the shell where you will run OpenClaw:

```bash
export OPENAI_API_KEY="your-openai-api-key"
```

This profile defaults to `openai/gpt-5.4`.

That matches current OpenAI guidance for API-based coding work: use `gpt-5.4` as the default for complex reasoning and coding, and let OpenClaw call it through the direct OpenAI provider.

Render the config:

```bash
./study/bin/render-profile.sh openai
export OPENCLAW_CONFIG_PATH="$PWD/study/.generated/openclaw.openai.json"
```

If you do not want to export the key every time, copy the local example file:

```bash
cp study/.env.openai.example study/.env.openai
```

Then put your real `OPENAI_API_KEY` into `study/.env.openai` and use the wrapper:

```bash
./study/bin/openclaw-openai.sh models status
./study/bin/openclaw-openai.sh gateway run --port 18789
./study/bin/openclaw-openai.sh dashboard
```

## Step 3B: Codex subscription route in OpenClaw

Use this if you want to sign in with your ChatGPT/Codex account rather than pay per-token with an API key.

Run the OpenClaw OAuth flow:

```bash
./study/bin/render-profile.sh codex
export OPENCLAW_CONFIG_PATH="$PWD/study/.generated/openclaw.codex.json"
./study/bin/openclaw-local.sh onboard --auth-choice openai-codex
```

This profile defaults to `openai-codex/gpt-5.4`, which is the current OpenClaw mapping for Codex OAuth usage.

## Step 3B-2: Codex CLI bridge route in OpenClaw

Use this if:

- your local `codex` CLI is already logged in with ChatGPT
- OpenClaw's `openai-codex` OAuth path is failing
- you still want to drive Codex from the OpenClaw GUI

Render the bridge config:

```bash
./study/bin/render-profile.sh codexbridge
export OPENCLAW_CONFIG_PATH="$PWD/study/.generated/openclaw.codexbridge.json"
```

Or use the dedicated wrapper directly:

```bash
./study/bin/openclaw-codex-bridge.sh gateway run --port 18789
```

This route does not fix normal OpenClaw chat messages. It adds a plugin command that bypasses the OpenClaw model and calls your local `codex` binary directly.

Available commands:

```text
/codex status
/codex read <task>
/codex write <task>
/codex danger <task>
/codex <task>
```

Examples:

```text
/codex read 总结当前仓库结构
/codex write 在 practice/self-test.js 里补齐 parseArr 并解释改动
```

For shell verification without the GUI:

```bash
./study/bin/openclaw-codex-bridge.sh codex-status
./study/bin/openclaw-codex-bridge.sh codex-run "总结这个仓库结构"
./study/bin/openclaw-codex-bridge.sh codex-run --write "在 README 增加一段 OpenClaw 使用说明"
```

## Step 3B-3: Codex provider route in OpenClaw

Use this if you want the normal OpenClaw message flow:

- regular Dashboard chat input
- normal session routing
- no manual `/codex` prefix

The tradeoff is that the first version is a local proxy layer over Codex. It behaves like a provider, but it does not emit native OpenAI tool calls yet.

Start the local proxy:

```bash
./study/bin/codex-proxy.sh
```

In another terminal, render and run the provider config:

```bash
./study/bin/render-profile.sh codexprovider
./study/bin/openclaw-codex-provider.sh gateway run --port 18789
./study/bin/openclaw-codex-provider.sh dashboard
```

Provider details:

- model ref: `codex-proxy/gpt-5.4`
- upstream API shape: `openai-completions`
- local proxy URL: `http://127.0.0.1:18891/v1`

Quick health checks:

```bash
curl http://127.0.0.1:18891/health
curl http://127.0.0.1:18891/v1/models
```

## Step 3C: Ollama-backed local assistant

OpenClaw's Ollama docs recommend the native Ollama API, not the OpenAI-compatible `/v1` route.

Pull at least one tool-capable model:

```bash
ollama pull gpt-oss:20b
```

Set the minimal env that OpenClaw expects for discovery:

```bash
export OLLAMA_API_KEY="ollama-local"
```

Render the config:

```bash
./study/bin/render-profile.sh ollama
export OPENCLAW_CONFIG_PATH="$PWD/study/.generated/openclaw.ollama.json"
```

## Step 4: Inspect the rendered config

Open the rendered file and adjust the fields you actually care about:

- `agents.defaults.model.primary`
- `messages.groupChat.mentionPatterns`
- `session.reset`

Generated files live under `study/.generated/`.

## Step 5: Onboard and verify the Gateway

Run the official onboarding flow:

```bash
./study/bin/openclaw-local.sh onboard --install-daemon
```

Then verify:

```bash
./study/bin/openclaw-local.sh gateway status
./study/bin/openclaw-local.sh dashboard
```

Fastest success criterion: the Control UI opens at `http://127.0.0.1:18789/` and you can chat there without setting up any messaging channel.

## Step 6: Make it a real personal assistant

Do this only after the Control UI works and only if you really need a channel:

```bash
./study/bin/openclaw-local.sh channels login
```

Scan the QR code with the dedicated WhatsApp account for the assistant, not your main number.

Important safety rule from the official personal assistant guide:

- keep inbound channel allowlists strict
- do not expose a personal Mac to arbitrary inbound chat traffic
- keep `agents.defaults.heartbeat.every` at `"0m"` until you trust the setup

## Workspace strategy

This study kit keeps the assistant persona and operational rules in `study/workspace/`:

- `AGENTS.md`
- `SOUL.md`
- `IDENTITY.md`
- `TOOLS.md`
- `USER.md`
- `HEARTBEAT.md`

The templates set `agents.defaults.skipBootstrap` to `true` so OpenClaw uses these files as the initial workspace contract instead of generating a fresh default one.

## Day-1 commands

OpenAI API path:

```bash
./study/bin/check-prereqs.sh
cp study/.env.openai.example study/.env.openai
# edit study/.env.openai and set OPENAI_API_KEY
./study/bin/openclaw-openai.sh models status
./study/bin/openclaw-openai.sh gateway run --port 18789
./study/bin/openclaw-openai.sh dashboard
```

Codex subscription path:

```bash
./study/bin/check-prereqs.sh
./study/bin/init-codex-local.sh
./study/bin/openclaw-local.sh dashboard
```

Codex CLI bridge path:

```bash
./study/bin/check-prereqs.sh
./study/bin/render-profile.sh codexbridge
./study/bin/openclaw-codex-bridge.sh codex-status
./study/bin/openclaw-codex-bridge.sh gateway run --port 18789
./study/bin/openclaw-codex-bridge.sh dashboard
```

Codex provider path:

```bash
./study/bin/check-prereqs.sh
./study/bin/codex-proxy.sh
./study/bin/render-profile.sh codexprovider
./study/bin/openclaw-codex-provider.sh gateway run --port 18789
./study/bin/openclaw-codex-provider.sh dashboard
```

Stop all repo-local OpenClaw processes:

```bash
./study/bin/openclaw-stop.sh
```

Ollama path:

```bash
./study/bin/check-prereqs.sh
ollama pull gpt-oss:20b
./study/bin/render-profile.sh ollama
export OLLAMA_API_KEY="ollama-local"
export OPENCLAW_CONFIG_PATH="$PWD/study/.generated/openclaw.ollama.json"
./study/bin/openclaw-local.sh onboard --install-daemon
./study/bin/openclaw-local.sh dashboard
```

## Local-only usage (no Telegram/WhatsApp)

Once Codex onboarding is done, you can use OpenClaw locally without any channel integrations:

```bash
./study/bin/openclaw-local.sh gateway run
```

In another terminal:

```bash
./study/bin/openclaw-local.sh dashboard --no-open
./study/bin/openclaw-local.sh tui
./study/bin/openclaw-local.sh agent --local --message "Summarize this repo structure."
```

That gives you three local command surfaces:

- Dashboard GUI (browser)
- TUI (terminal chat)
- One-shot CLI agent calls

If launchd daemon mode is unstable with an `nvm` Node path on your machine, keep using `gateway run` in a terminal tab. It is the most predictable local dev mode.

## Visual process monitor

Run:

```bash
./study/bin/openclaw-monitor.sh
```

Then open:

```text
http://127.0.0.1:18890/
```

This monitor is a standalone local frontend for observing OpenClaw process state, logs, and quick start/stop actions.

## Notes on Docker

Docker is optional in the official docs and is not installed on this Mac right now. That is fine for a local-first setup. Only add Docker later if you want container isolation or remote-style deployment.

## Direct Codex-style route without OpenClaw

If you want the OpenAI coding-agent behavior directly on your machine, skip OpenClaw and use the Responses API with the `shell` tool.

The example in `examples/openai-local-shell-agent.mjs` does exactly that:

- sends your task to OpenAI with model `gpt-5.4`
- receives `shell_call` actions
- asks for approval before running commands locally
- sends `shell_call_output` back to OpenAI until the task is done

Run it like this:

```bash
export OPENAI_API_KEY="your-openai-api-key"
node study/examples/openai-local-shell-agent.mjs "Inspect this repository and summarize the biggest architectural risks."
```

Useful environment variables:

- `OPENAI_MODEL` default: `gpt-5.4`
- `OPENAI_SHELL_CWD` default: current working directory
- `OPENAI_SHELL_APPROVAL=auto` to auto-approve every command
- `OPENAI_MAX_TURNS` default: `8`

This direct route is the cleanest option if your real goal is "local coding assistant with OpenAI brains", not "chat channels + WhatsApp + daemon + routing".

## Membership-only route: use the official Codex client directly

If you only have ChatGPT membership and do not have OpenAI API access, this is the best fit.

Why:

- OpenClaw needs either an API key (`openai`) or its own provider auth flow (`openai-codex`).
- Your local Codex client can already be logged in with ChatGPT membership.
- Using the official Codex client avoids the extra OpenClaw auth layer that is currently failing for your account/region path.

Check login status:

```bash
codex login status
```

This machine currently reports:

```text
Logged in using ChatGPT
```

Repo-local wrappers:

```bash
./study/bin/codex-study.sh
./study/bin/codex-study.sh "Summarize this repository structure."
./study/bin/codex-desktop.sh
```

Recommended usage:

- Terminal interactive: `./study/bin/codex-study.sh`
- One-shot task: `./study/bin/codex-study.sh exec "Review practice/self-code.js structure"`
- Desktop GUI: `./study/bin/codex-desktop.sh`

Use OpenClaw only if you specifically need its gateway/channel model. For pure "local coding assistant + ChatGPT membership", the official Codex client is the simpler route.

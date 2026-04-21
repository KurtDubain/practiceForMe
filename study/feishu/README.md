# OpenClaw + Feishu + Codex Skill Route

This setup treats OpenClaw as the workflow platform and Feishu as the operator channel.

Important boundary:

- OpenClaw Feishu channel is officially supported.
- Your local ChatGPT membership can power the official `codex` CLI.
- OpenClaw itself still needs a model provider for normal dialogue and routing.
- In this workspace, the practical route is:
  - OpenClaw model: `ollama/*`
  - Coding escalation: local `codex` CLI via workspace skill

## Architecture

```text
Feishu message
  -> OpenClaw Feishu channel
  -> workspace skill: feishu-task-router
  -> if coding/repo task: codex-delegate
  -> local codex exec
  -> result summarized back through OpenClaw
```

## Files added for this route

- `study/.env.feishu.example`
- `study/bin/render-feishu-profile.sh`
- `study/bin/openclaw-feishu.sh`
- `study/workspace/skills/feishu-task-router/`
- `study/workspace/skills/codex-delegate/`

## Step 1: prepare Feishu app

Use the official OpenClaw Feishu doc:

- `https://docs.openclaw.ai/channels/feishu`
- Feishu Open Platform: `https://open.feishu.cn/app`
- Lark Open Platform: `https://open.larksuite.com/app`

You need:

- App ID
- App Secret
- Bot capability enabled
- Event subscription with long connection / WebSocket
- Event `im.message.receive_v1`

## Step 2: prepare local env

```bash
cp study/.env.feishu.example study/.env.feishu
```

Then fill:

- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- `FEISHU_DOMAIN`

Optional:

- `FEISHU_ALLOW_FROM`
- `FEISHU_GROUP_ALLOW_FROM`
- `OPENCLAW_FEISHU_MODEL`
- `OPENCLAW_FEISHU_FALLBACK`

## Step 3: make sure the OpenClaw model is available

Example:

```bash
ollama pull gpt-oss:20b
ollama pull llama3.3
```

If your machine is weaker, replace the model names in `study/.env.feishu`.

## Step 4: render config and inspect

```bash
./study/bin/render-feishu-profile.sh
cat study/.generated/openclaw.feishu.ollama.json
```

## Step 5: start gateway

```bash
./study/bin/openclaw-feishu.sh gateway run --port 18789
```

## Step 6: verify

In another terminal:

```bash
./study/bin/openclaw-feishu.sh gateway status
./study/bin/openclaw-feishu.sh dashboard
```

## Step 7: test flow

1. DM the Feishu bot
2. Ask a simple non-coding question
3. Ask a workflow request such as:
   - "帮我记录一个任务：今晚整理 README 结构"
4. Ask a coding task such as:
   - "检查 practice/self-code.js 的结构并给建议"

The expected route is:

- `feishu-task-router` stores/updates the task queue
- coding work may delegate to local `codex`

## Current limitations

- This route does not reuse `openai-codex` as the OpenClaw model backend.
- It uses Codex as a delegated capability, not as the primary OpenClaw provider.
- For channel-triggered machine actions, you should still keep approval explicit.

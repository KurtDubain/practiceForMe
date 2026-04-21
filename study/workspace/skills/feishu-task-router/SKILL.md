---
name: feishu-task-router
description: "Turn Feishu messages into structured tasks, keep a local task queue, and decide whether to answer directly, ask clarifying questions, or delegate to Codex for coding work."
user-invocable: true
metadata:
  { "openclaw": { "requires": { "bins": ["node", "bash"] }, "always": true } }
---

# feishu-task-router

Use this skill for Feishu/Lark-originated requests that need workflow handling rather than a one-off answer.

## Goals

- Classify the incoming request
- Decide whether to answer, clarify, queue, or execute
- Keep a local queue of Feishu tasks
- Route coding tasks to `codex-delegate`

## Classification

Map each request into one of these types:

- `answer`: the user only wants information or a short reply
- `clarify`: the request is ambiguous or missing required constraints
- `todo`: a concrete non-coding task should be tracked
- `code`: repository/code/task automation that should go through Codex
- `approval`: the task would touch the machine, external systems, or other people and needs explicit confirmation

## Workflow

1. Extract:
   - sender identity
   - source channel/group if known
   - task summary
   - constraints / due time / files / repo scope
2. If it is `answer`, reply directly and stop.
3. If it is `clarify`, ask the smallest blocking question and stop.
4. If it is `todo`, store it:

```bash
node {baseDir}/scripts/task-store.mjs add \
  --source feishu \
  --type todo \
  --requester "USER_OR_GROUP" \
  --summary "SHORT SUMMARY" \
  --details "FULL REQUEST"
```

5. If it is `code`, first store it, then call the `codex-delegate` skill.
6. If it is `approval`, explain the intended action, wait for confirmation, then store/update the task and continue.

## Status handling

List open tasks:

```bash
node {baseDir}/scripts/task-store.mjs list --status open
```

Mark a task done:

```bash
node {baseDir}/scripts/task-store.mjs update TASK_ID --status done --result "WHAT WAS DONE"
```

## Guardrails

- Do not auto-execute destructive machine actions from a Feishu message without explicit approval.
- Prefer queue + acknowledgement over pretending work is complete.
- When a coding request involves repository edits, route it through `codex-delegate`.

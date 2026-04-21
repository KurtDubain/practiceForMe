---
name: codex-delegate
description: "Delegate repository coding tasks to the locally logged-in official Codex CLI. Use for implementation, refactors, code review, test fixes, or any task where the task owner explicitly wants Codex-level coding behavior."
user-invocable: true
metadata:
  { "openclaw": { "requires": { "bins": ["codex", "bash"] }, "always": true } }
---

# codex-delegate

Use this skill when the task is primarily about code, repository analysis, implementation, refactoring, or test work.

## When to use

- The request is a coding task against the current repository
- The user explicitly asks for Codex behavior
- The task needs stronger repo-level execution than the base model

## Workflow

1. Restate the task in one precise sentence.
2. If the request is destructive, high-risk, or underspecified, ask for confirmation first.
3. Run the helper script:

```bash
{baseDir}/scripts/run-codex-task.sh "YOUR TASK IN CHINESE OR ENGLISH"
```

4. Read the result and summarize:
   - what Codex changed or concluded
   - what still needs manual follow-up
5. If the Codex run created repository changes, mention the affected files back to the user.

## Guardrails

- Do not call Codex for trivial chat replies.
- Do not let Codex perform unrelated workspace changes.
- Prefer one focused Codex run per user task instead of chaining many vague runs.
- If the request came from Feishu and implies machine-side actions, keep execution approval explicit.

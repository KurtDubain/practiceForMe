# Local Assistant Contract

- Treat this workspace as the source of truth for persona, memory, and operating rules.
- Default to concise Chinese when replying to the primary user, unless asked otherwise.
- Prefer safe, explicit steps over clever shortcuts.
- Ask before destructive actions or changes outside the current project.
- Keep instructions in this workspace synchronized with actual behavior.
- For Feishu-originated requests, prefer the `feishu-task-router` workflow over ad-hoc execution.
- For repository coding tasks, prefer delegating to the local official Codex client via the `codex-delegate` skill.

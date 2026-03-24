# OpenClaw Monitor

Standalone local UI for visualizing OpenClaw gateway runtime:

- gateway listening state
- process list (`PID`, `CPU`, `MEM`, command)
- model/config snapshot
- raw `gateway status` output
- recent runtime logs
- start/stop actions for monitor-managed foreground gateway process

## Run

From repo root:

```bash
./study/bin/openclaw-monitor.sh
```

Then open:

```text
http://127.0.0.1:18890/
```

## Notes

- This monitor controls only the foreground gateway process that it starts itself (tracked in `study/.state/openclaw/run/gateway-foreground.pid`).
- If you run OpenClaw through other modes (for example, launchd daemon), the monitor will still show process/log visibility but its stop action is intentionally conservative.

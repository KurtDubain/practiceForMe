const state = {
  currentLog: "foreground",
  status: null,
  refreshTimer: null,
};

const gatewayStateEl = document.querySelector("#gatewayState");
const gatewayHintEl = document.querySelector("#gatewayHint");
const modelValueEl = document.querySelector("#modelValue");
const versionValueEl = document.querySelector("#versionValue");
const configPathValueEl = document.querySelector("#configPathValue");
const processCountValueEl = document.querySelector("#processCountValue");
const lastUpdateValueEl = document.querySelector("#lastUpdateValue");
const foregroundPidValueEl = document.querySelector("#foregroundPidValue");
const processTableBodyEl = document.querySelector("#processTableBody");
const rawStatusPreEl = document.querySelector("#rawStatusPre");
const logPreEl = document.querySelector("#logPre");
const flashMessageEl = document.querySelector("#flashMessage");

const refreshBtn = document.querySelector("#refreshBtn");
const startBtn = document.querySelector("#startBtn");
const stopBtn = document.querySelector("#stopBtn");
const dashboardBtn = document.querySelector("#dashboardBtn");
const tabButtons = Array.from(document.querySelectorAll(".tab"));

function setFlash(message, level = "normal") {
  flashMessageEl.textContent = message;
  flashMessageEl.classList.remove("is-good", "is-warn", "is-bad");
  if (level === "good") {
    flashMessageEl.classList.add("is-good");
  } else if (level === "warn") {
    flashMessageEl.classList.add("is-warn");
  } else if (level === "bad") {
    flashMessageEl.classList.add("is-bad");
  }
}

function formatTime(isoDate) {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  return date.toLocaleTimeString();
}

function renderProcesses(processes) {
  if (!Array.isArray(processes) || processes.length === 0) {
    processTableBodyEl.innerHTML = `
      <tr>
        <td colspan="5" class="empty">No OpenClaw process is visible right now.</td>
      </tr>
    `;
    return;
  }

  processTableBodyEl.innerHTML = processes
    .map(
      (row) => `
      <tr>
        <td>${row.pid}</td>
        <td>${row.cpu.toFixed(1)}</td>
        <td>${row.mem.toFixed(1)}</td>
        <td>${row.elapsed}</td>
        <td class="command-cell">${row.command}</td>
      </tr>
    `,
    )
    .join("");
}

function renderStatus(status) {
  state.status = status;
  const listening = Boolean(status?.gateway?.listening);
  gatewayStateEl.textContent = listening ? "Listening" : "Not Listening";
  gatewayStateEl.className = `value ${listening ? "is-good" : "is-bad"}`;
  gatewayHintEl.textContent = listening
    ? `Port ${status.gateway.port} is active.`
    : `Port ${status.gateway.port} is currently idle.`;

  modelValueEl.textContent = status?.openclaw?.modelPrimary || "-";
  versionValueEl.textContent = status?.openclaw?.version || "-";
  configPathValueEl.textContent = status?.openclaw?.configPath || "-";
  processCountValueEl.textContent = String(status?.gateway?.processCount || 0);
  lastUpdateValueEl.textContent = `Updated ${formatTime(status?.timestamp)}`;
  foregroundPidValueEl.textContent = `Foreground PID: ${status?.gateway?.foregroundPid ?? "-"}`;

  rawStatusPreEl.textContent =
    status?.gateway?.rawStatus?.trim() || "No gateway status output yet.";

  const selectedLog = status?.logs?.[state.currentLog]?.text?.trim();
  logPreEl.textContent = selectedLog || `No ${state.currentLog} log output yet.`;
  renderProcesses(status?.gateway?.processes || []);
}

async function fetchStatus() {
  const response = await fetch("/api/status", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Status request failed (${response.status})`);
  }
  return response.json();
}

async function refreshStatus({ silent = false } = {}) {
  try {
    const status = await fetchStatus();
    renderStatus(status);
    if (!silent) {
      setFlash("Status refreshed.", "good");
    }
  } catch (error) {
    setFlash(error.message, "bad");
  }
}

async function runAction(action) {
  const response = await fetch("/api/action", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.message || `Action "${action}" failed.`);
  }
  if (payload.status) {
    renderStatus(payload.status);
  } else {
    await refreshStatus({ silent: true });
  }
  return payload;
}

refreshBtn.addEventListener("click", () => {
  refreshStatus();
});

startBtn.addEventListener("click", async () => {
  setFlash("Starting gateway...", "warn");
  try {
    await runAction("start");
    setFlash("Gateway start command sent.", "good");
  } catch (error) {
    setFlash(error.message, "bad");
  }
});

stopBtn.addEventListener("click", async () => {
  setFlash("Stopping gateway...", "warn");
  try {
    await runAction("stop");
    setFlash("Gateway stop command sent.", "good");
  } catch (error) {
    setFlash(error.message, "bad");
  }
});

dashboardBtn.addEventListener("click", async () => {
  try {
    const payload = await runAction("dashboard");
    if (payload.dashboardUrl) {
      window.open(payload.dashboardUrl, "_blank", "noopener,noreferrer");
      setFlash("Dashboard URL opened in a new tab.", "good");
    } else {
      setFlash("Dashboard URL not available.", "warn");
    }
  } catch (error) {
    setFlash(error.message, "bad");
  }
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.currentLog = button.dataset.log;
    tabButtons.forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    if (state.status) {
      const selectedLog = state.status.logs?.[state.currentLog]?.text?.trim();
      logPreEl.textContent = selectedLog || `No ${state.currentLog} log output yet.`;
    }
  });
});

async function boot() {
  await refreshStatus({ silent: true });
  state.refreshTimer = window.setInterval(() => {
    refreshStatus({ silent: true });
  }, 4000);
}

boot();

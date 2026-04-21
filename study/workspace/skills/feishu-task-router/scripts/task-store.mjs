#!/usr/bin/env node

import fs from "fs";
import path from "path";

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const skillDir = path.resolve(scriptDir, "..");
const stateDir = path.resolve(skillDir, "../../state");
const storePath = path.join(stateDir, "feishu-tasks.json");

function ensureStore() {
  fs.mkdirSync(stateDir, { recursive: true });
  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, "[]\n", "utf8");
  }
}

function loadStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(storePath, "utf8"));
}

function saveStore(tasks) {
  fs.writeFileSync(storePath, JSON.stringify(tasks, null, 2) + "\n", "utf8");
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        flags[key] = true;
      } else {
        flags[key] = next;
        i++;
      }
    } else {
      positional.push(token);
    }
  }
  return { positional, flags };
}

function nextId(tasks) {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const seq = tasks.filter((task) => task.id.startsWith(`fs-${date}-`)).length + 1;
  return `fs-${date}-${String(seq).padStart(3, "0")}`;
}

function printTasks(tasks) {
  const data = tasks.map((task) => ({
    id: task.id,
    status: task.status,
    type: task.type,
    requester: task.requester,
    summary: task.summary,
    createdAt: task.createdAt,
  }));
  process.stdout.write(JSON.stringify(data, null, 2) + "\n");
}

const [, , command, ...rest] = process.argv;
const { positional, flags } = parseArgs(rest);

if (!command || !["add", "list", "update"].includes(command)) {
  process.stderr.write(
    "Usage:\n" +
      "  task-store.mjs add --source feishu --type todo --requester USER --summary TEXT [--details TEXT]\n" +
      "  task-store.mjs list [--status open|done|all]\n" +
      "  task-store.mjs update TASK_ID [--status open|done|cancelled] [--result TEXT]\n"
  );
  process.exit(1);
}

const tasks = loadStore();

if (command === "add") {
  for (const key of ["source", "type", "requester", "summary"]) {
    if (!flags[key]) {
      process.stderr.write(`Missing --${key}\n`);
      process.exit(1);
    }
  }

  const task = {
    id: nextId(tasks),
    source: String(flags.source),
    type: String(flags.type),
    requester: String(flags.requester),
    summary: String(flags.summary),
    details: String(flags.details || ""),
    status: "open",
    result: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(task);
  saveStore(tasks);
  process.stdout.write(JSON.stringify(task, null, 2) + "\n");
  process.exit(0);
}

if (command === "list") {
  const wanted = String(flags.status || "open");
  if (wanted === "all") {
    printTasks(tasks);
  } else {
    printTasks(tasks.filter((task) => task.status === wanted));
  }
  process.exit(0);
}

if (command === "update") {
  const taskId = positional[0];
  if (!taskId) {
    process.stderr.write("Missing TASK_ID\n");
    process.exit(1);
  }

  const task = tasks.find((item) => item.id === taskId);
  if (!task) {
    process.stderr.write(`Task not found: ${taskId}\n`);
    process.exit(1);
  }

  if (flags.status) task.status = String(flags.status);
  if (flags.result) task.result = String(flags.result);
  task.updatedAt = new Date().toISOString();
  saveStore(tasks);
  process.stdout.write(JSON.stringify(task, null, 2) + "\n");
}

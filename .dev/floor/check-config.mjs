#!/usr/bin/env node
// .dev/floor/check-config.mjs — the deterministic pharn.config.json VALIDATOR + per-stage RESOLVER +
// config↔frontmatter AGREEMENT checker for the /pharn-dev-* build loop's model/effort configuration.
//
// Floor primitives (ARCHITECTURE §2): #3 (enum / regex / presence) — every stage `model` ∈ a fixed
// allowlist (Claude Code aliases {sonnet,opus,haiku,fable} ∪ `inherit` ∪ a `claude-*` full-id regex),
// every `effort` ∈ {low,medium,high,xhigh,max}, a `default` entry present, resolution is the membership
// pick `stages[stage] ?? stages.default` (P5), and each WIRED stage's command-file frontmatter
// `model:`/`effort:` EQUALS the config-resolved value — a deterministic equality between two repo files,
// the same drift-detection class as a content-hash (#2). NON-LLM, dependency-free (Node stdlib only). No
// network, no child_process, no eval, no dynamic import.
//
// Honest scope (P0): it guarantees the config is SHAPE/ENUM-valid, that a stage RESOLVES deterministically,
// and that the wired commands' static `model:`/`effort:` frontmatter is CONSISTENT with the config. It does
// NOT — cannot — guarantee that a stage actually RUNS UNDER the resolved model/effort at runtime: model and
// effort selection is applied by the Claude Code platform, invisible to any hook / hash / enum. "check-config
// GREEN" must NEVER read as "the stage ran under model X" — that conflation ("written in the config" ⇒
// "therefore guaranteed") is the exact P0 disease this repo exists to prevent. The runtime binding is
// ADVISORY (the platform honoring static frontmatter); this checker owns ONLY config-validity + the
// config↔frontmatter consistency floor.
//
// Trust (P2): pharn.config.json and the command frontmatter are repo-local, human-authored DATA — parsed as
// JSON / YAML frontmatter, NEVER executed. The verdict ranges ONLY over the enum-gated fields (model ∈
// allowlist, effort ∈ enum, resolved == frontmatter) and rejects any non-member; a poisoned/edited config can
// at most select a DIFFERENT allowlisted model/effort (a bounded, advisory blast radius), never inject an
// instruction. No guaranteed decision rests on any free-text field (mirrors fix #1).
//
// Usage:
//   node .dev/floor/check-config.mjs [validate] [--config <path>]
//        validate config shape + enums (default mode)                → exit 1 on any RED (prints each), else 0 + GREEN
//   node .dev/floor/check-config.mjs resolve <stage> [--config <path>]
//        print {"model":..,"effort":..} for <stage> (stages[stage] ?? stages.default) → exit 0, else RED
//   node .dev/floor/check-config.mjs agreement [--config <path>] [--commands-dir <dir>]
//        validate + assert each non-`default` stage's <commands-dir>/pharn-dev-<stage>.md frontmatter
//        `model:`/`effort:` EQUALS the config-resolved value       → exit 1 on any RED, else 0 + GREEN
//
// Exit: 1 on any RED / unreadable / malformed; 0 otherwise.

import { readFileSync } from "node:fs";
import { join } from "node:path";

// Enums — every branch is a presence / enum / equality membership test (P5); the terminal fallback on any
// non-member is a loud RED, never a guess. These mirror the Claude Code model/effort surface (sub-agents +
// skills frontmatter): aliases + a full model id + `inherit`, and the five effort levels.
const MODEL_ALIASES = ["sonnet", "opus", "haiku", "fable", "inherit"];
const MODEL_ID_RE = /^claude-[a-z0-9][a-z0-9-]*$/; // a full model id, e.g. claude-opus-4-8
const EFFORT_ENUM = ["low", "medium", "high", "xhigh", "max"];
const DEFAULT_CONFIG = "pharn.config.json";
const DEFAULT_COMMANDS_DIR = join(".claude", "commands");

const reds = [];
function red(kind, detail) {
  reds.push({ kind, detail });
}

function isValidModel(m) {
  return typeof m === "string" && (MODEL_ALIASES.includes(m) || MODEL_ID_RE.test(m));
}
function isValidEffort(e) {
  return typeof e === "string" && EFFORT_ENUM.includes(e);
}

function fail() {
  for (const r of reds) console.log(`RED — ${r.kind} failed: ${r.detail}`);
  console.log(`\nRED — ${reds.length} config check(s) failed`);
  return 1;
}

// Read + JSON-parse the config; on any failure push a RED and return undefined (fail-closed).
function readConfig(path) {
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch (e) {
    red("input", `config unreadable (${path}): ${e.message}`);
    return undefined;
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    red("json", `config is not valid JSON (${path}): ${e.message}`);
    return undefined;
  }
}

// The `models.stages` map, or undefined + RED if the shape is wrong (fail-closed).
function stagesOf(cfg) {
  const stages = cfg && cfg.models && cfg.models.stages;
  if (!stages || typeof stages !== "object" || Array.isArray(stages)) {
    red("shape", "missing `models.stages` object");
    return undefined;
  }
  return stages;
}

// Validate every stage entry's shape + enums. `default` MUST be present (it is the resolution fallback).
function validateStages(stages) {
  if (!("default" in stages)) {
    red("default", "missing required `default` stage entry (the resolution fallback)");
  }
  for (const [name, entry] of Object.entries(stages)) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      red("entry", `stage ${JSON.stringify(name)} is not an object with {model, effort}`);
      continue;
    }
    if (!("model" in entry)) red("model", `stage ${JSON.stringify(name)} missing \`model\``);
    else if (!isValidModel(entry.model))
      red(
        "model",
        `stage ${JSON.stringify(name)} model ${JSON.stringify(entry.model)} is not an alias {${MODEL_ALIASES.join(", ")}} nor a claude-* id`
      );
    if (!("effort" in entry)) red("effort", `stage ${JSON.stringify(name)} missing \`effort\``);
    else if (!isValidEffort(entry.effort))
      red("effort", `stage ${JSON.stringify(name)} effort ${JSON.stringify(entry.effort)} not in {${EFFORT_ENUM.join(", ")}}`);
  }
}

// resolve: stages[stage] ?? stages.default (a membership test, P5). Returns {model, effort} or undefined+RED.
function resolveStage(stages, stage) {
  const entry = stages[stage] || stages.default;
  if (!entry) {
    red("resolve", `stage ${JSON.stringify(stage)} has no entry and no \`default\` fallback`);
    return undefined;
  }
  return { model: entry.model, effort: entry.effort };
}

// Parse a command file's frontmatter `model:`/`effort:` — mirrors count-grillers.mjs `frontmatterRole`
// (the same `---` fence + `^([A-Za-z0-9_]+):\s*(.*)$` line parse + quote-strip), so `model_tier:` (a
// different key) is never mistaken for `model:`. Not an import — those files export nothing (P4: cite).
function frontmatterModelEffort(text) {
  if (!text.startsWith("---")) return {};
  const end = text.indexOf("\n---", 3);
  if (end === -1) return {};
  const raw = text.slice(3, end).trim();
  const out = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    if (m[1] === "model") out.model = m[2].trim().replace(/^["']|["']$/g, "");
    else if (m[1] === "effort") out.effort = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

// --- validate mode: config shape + enums only. ---
function doValidate(configPath) {
  const cfg = readConfig(configPath);
  if (reds.length) return fail();
  const stages = stagesOf(cfg);
  if (reds.length) return fail();
  validateStages(stages);
  if (reds.length) return fail();
  console.log(`GREEN — config valid; ${Object.keys(stages).length} stage(s); default present; every model/effort in enum`);
  return 0;
}

// --- resolve mode: print the resolved {model, effort} for a stage. ---
function doResolve(configPath, stage) {
  if (!stage) {
    console.log("RED — usage: node .dev/floor/check-config.mjs resolve <stage> [--config <path>]");
    return 1;
  }
  const cfg = readConfig(configPath);
  if (reds.length) return fail();
  const stages = stagesOf(cfg);
  if (reds.length) return fail();
  validateStages(stages);
  if (reds.length) return fail();
  const r = resolveStage(stages, stage);
  if (!r) return fail();
  process.stdout.write(JSON.stringify(r) + "\n");
  return 0;
}

// --- agreement mode: validate + each non-`default` stage's command frontmatter EQUALS its resolved value. ---
function doAgreement(configPath, commandsDir) {
  const cfg = readConfig(configPath);
  if (reds.length) return fail();
  const stages = stagesOf(cfg);
  if (reds.length) return fail();
  validateStages(stages);
  if (reds.length) return fail();
  const checked = [];
  for (const name of Object.keys(stages)) {
    if (name === "default") continue;
    const cmdPath = join(commandsDir, `pharn-dev-${name}.md`);
    let text;
    try {
      text = readFileSync(cmdPath, "utf8");
    } catch (e) {
      red("agreement", `stage ${JSON.stringify(name)} → command file unreadable (${cmdPath}): ${e.message}`);
      continue;
    }
    const fm = frontmatterModelEffort(text);
    const want = resolveStage(stages, name); // == stages[name] (name is a present key here)
    if (fm.model === undefined) red("agreement", `stage ${JSON.stringify(name)} → ${cmdPath} frontmatter has no \`model:\``);
    else if (fm.model !== want.model)
      red(
        "agreement",
        `stage ${JSON.stringify(name)} → ${cmdPath} model ${JSON.stringify(fm.model)} != config ${JSON.stringify(want.model)}`
      );
    if (fm.effort === undefined) red("agreement", `stage ${JSON.stringify(name)} → ${cmdPath} frontmatter has no \`effort:\``);
    else if (fm.effort !== want.effort)
      red(
        "agreement",
        `stage ${JSON.stringify(name)} → ${cmdPath} effort ${JSON.stringify(fm.effort)} != config ${JSON.stringify(want.effort)}`
      );
    checked.push(name);
  }
  if (reds.length) return fail();
  console.log(`GREEN — config valid; ${checked.length} wired stage(s) [${checked.join(", ")}] agree with command frontmatter`);
  return 0;
}

function getOpt(args, name, dflt) {
  const i = args.indexOf(name);
  return i === -1 ? dflt : args[i + 1];
}

function main() {
  const args = process.argv.slice(2);
  const configPath = getOpt(args, "--config", DEFAULT_CONFIG);
  const commandsDir = getOpt(args, "--commands-dir", DEFAULT_COMMANDS_DIR);
  const mode = args[0] && !args[0].startsWith("--") ? args[0] : "validate";
  if (mode === "validate") return doValidate(configPath);
  if (mode === "resolve") {
    const stage = args[1] && !args[1].startsWith("--") ? args[1] : undefined;
    return doResolve(configPath, stage);
  }
  if (mode === "agreement") return doAgreement(configPath, commandsDir);
  console.log(`RED — unknown mode ${JSON.stringify(mode)} (expected: validate | resolve <stage> | agreement)`);
  return 1;
}

process.exit(main());

#!/usr/bin/env node
// .dev/floor/check-lessons-index.mjs — the lessons-index DRIFT CHECKER (build apparatus).
//
// The GUARANTEE (P0, ARCHITECTURE §2 content-hash primitive applied to generated output): the committed
// docs/lessons-index.md is BYTE-IDENTICAL to what lessons-index-core.mjs recomputes from live canon. It
// recomputes via the SAME core the generator uses, then compares.
//
//   - MISSING    : docs/lessons-index.md is absent or unreadable (a new lesson landed without regenerating)
//   - DRIFT      : the committed bytes differ from the recomputed bytes
//   - ENUM_ERROR : the core refused to render (duplicate id, unsafe title, missing canon, CHECK-5 hazard)
// Any of these → RED (exit 1), printing the fix command. Clean → GREEN (exit 0). ZERO LLM: the verdict is
// byte-equality only (P2: it never rests on a free-text/tainted field — the canon TITLES it compares are
// untrusted DATA, but the comparison is over bytes, not meaning).
//
// WHAT THIS DOES NOT GUARANTEE (P0 — say it, don't bury it):
//   - NOT that the index is TRUE. A wrong parser would be regenerated, committed wrongly, and this gate
//     would stay GREEN. The guarantee is consistency, not correctness.
//   - NOT that a lesson's `type` / `concepts` DESCRIBE it. Those are model-drafted values ratified by a
//     human at the /pharn-dev-memory-promote gate (#114); "typed `floor`" never means "about the floor",
//     so selection keyed on this index is ADVISORY context selection, never a guarantee.
//   - NOT that anyone READ a lesson. "The index is current" says nothing about consumption.
//   - NOT that the index is even WIRED. This checker only runs if something invokes it; the package.json
//     `docs:check` wiring is pinned separately by the drift test in lessons-index-core.test.mjs.
//
// Usage:  node .dev/floor/check-lessons-index.mjs [targetDir]     (default: cwd)
// Non-LLM, stdlib-only, fail-closed.

import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildIndex, CANON_PATH, OUT_PATH } from "./lessons-index-core.mjs";

const FIX = "npm run docs:generate";

/**
 * Check the committed index against a fresh recompute. Returns { ok, findings } where each finding is
 * { type: "DRIFT"|"MISSING"|"ENUM_ERROR", file, problem }. Pure — no process exit, so tests can call it.
 */
export function checkLessonsIndex(targetDir) {
  let expected;
  try {
    ({ content: expected } = buildIndex(targetDir));
  } catch (e) {
    // A duplicate id / unsafe title / missing canon is a hard, deterministic RED — surface it.
    return { ok: false, findings: [{ type: "ENUM_ERROR", file: OUT_PATH, problem: e.message }] };
  }

  const abs = join(targetDir, OUT_PATH);
  let actual;
  try {
    actual = readFileSync(abs, "utf8");
  } catch {
    return { ok: false, findings: [{ type: "MISSING", file: OUT_PATH, problem: "expected index file is not committed or is unreadable" }] };
  }

  if (actual !== expected) {
    return {
      ok: false,
      findings: [{ type: "DRIFT", file: OUT_PATH, problem: "committed bytes differ from the index recomputed from canon" }],
    };
  }
  return { ok: true, findings: [] };
}

function main() {
  const target = process.argv[2] || ".";
  // Fail-closed (P5): a missing / non-directory target is an error, never a silent GREEN.
  if (!existsSync(target) || !statSync(target).isDirectory()) {
    process.stderr.write(`check-lessons-index: target dir not found (or not a directory): ${target}\n`);
    process.exit(1);
  }
  const { ok, findings } = checkLessonsIndex(target);
  if (ok) {
    process.stdout.write(`LESSONS-INDEX: GREEN — ${OUT_PATH} matches the index recomputed from canon\n`);
    process.exit(0);
  }
  const hasEnumError = findings.some((f) => f.type === "ENUM_ERROR");
  if (hasEnumError) {
    process.stdout.write(
      `LESSONS-INDEX: RED — ${findings.length} finding(s); canonical input is invalid — the index cannot be rendered\n`
    );
  } else {
    process.stdout.write(`LESSONS-INDEX: RED — ${findings.length} finding(s); the generated index is out of date\n`);
  }
  for (const f of findings) {
    process.stdout.write(`- [${f.type}] ${f.file}\n    ${f.problem}\n`);
  }
  if (hasEnumError) {
    process.stdout.write(
      `\nFIX: correct the canonical input in ${CANON_PATH} — ${FIX} cannot succeed until the input error is resolved\n`
    );
  } else {
    process.stdout.write(`\nFIX: regenerate and commit — ${FIX}\n`);
  }
  process.exit(1);
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  main();
}

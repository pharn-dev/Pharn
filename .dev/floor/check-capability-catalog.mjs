#!/usr/bin/env node
// .dev/floor/check-capability-catalog.mjs — the capability-catalog DRIFT CHECKER (build apparatus).
//
// The GUARANTEE (P0, ARCHITECTURE §2 content-hash primitive applied to generated output): the committed
// docs/capabilities/** is BYTE-IDENTICAL to what capability-catalog-core.mjs recomputes from the live
// source `.md` files, and the page SET matches the capability set exactly. It recomputes via the SAME
// core the generator uses, then compares:
//   - DRIFT   : a committed page's bytes != the recomputed bytes
//   - MISSING : a capability has no committed page (e.g. a new capability added without regenerating)
//   - ORPHAN  : a committed page has no backing capability
// Any of these → RED (exit 1), printing the fix command. Clean → GREEN (exit 0). ZERO LLM: the verdict
// is byte-equality + path-set membership only (P2: never rests on a free-text/tainted field).
//
// This is the drift GATE the increment adds (wired as a CI step + `npm run docs:check`). It gates nothing
// about whether the docs read WELL — only that committed == recomputed (P0: the prose quality is advisory).
//
// Usage:  node .dev/floor/check-capability-catalog.mjs [targetDir]     (default: cwd)
// Non-LLM, stdlib-only, fail-closed.

import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildCatalog, listCommittedPages, OUT_DIR } from "./capability-catalog-core.mjs";

const FIX = "npm run docs:generate";

/**
 * Check the committed catalog against a fresh recompute. Returns { ok, findings } where each finding is
 * { type: "DRIFT"|"MISSING"|"ORPHAN", file, problem }. Pure — no process exit, so tests can call it.
 */
export function checkCatalog(targetDir) {
  const findings = [];
  let files;
  try {
    ({ files } = buildCatalog(targetDir));
  } catch (e) {
    // A duplicate-slug (or other enumeration) error is a hard, deterministic RED — surface it.
    findings.push({ type: "ENUM_ERROR", file: OUT_DIR, problem: e.message });
    return { ok: false, findings };
  }

  // MISSING / DRIFT: every expected page must exist and match byte-for-byte.
  for (const [rel, expected] of files) {
    const abs = join(targetDir, rel);
    if (!existsSync(abs)) {
      findings.push({ type: "MISSING", file: rel, problem: `expected catalog file is not committed` });
      continue;
    }
    let actual;
    try {
      actual = readFileSync(abs, "utf8");
    } catch {
      findings.push({ type: "MISSING", file: rel, problem: `expected catalog file is unreadable` });
      continue;
    }
    if (actual !== expected) {
      findings.push({ type: "DRIFT", file: rel, problem: `committed bytes differ from the recomputed page` });
    }
  }

  // ORPHAN: a committed page under OUT_DIR with no backing capability.
  for (const rel of listCommittedPages(targetDir)) {
    if (!files.has(rel)) {
      findings.push({ type: "ORPHAN", file: rel, problem: `committed page has no backing capability` });
    }
  }

  return { ok: findings.length === 0, findings };
}

function main() {
  const target = process.argv[2] || ".";
  // Fail-closed (P5): a missing / non-directory target is an error, never a silent GREEN.
  if (!existsSync(target) || !statSync(target).isDirectory()) {
    process.stderr.write(`check-capability-catalog: target dir not found (or not a directory): ${target}\n`);
    process.exit(1);
  }
  const { ok, findings } = checkCatalog(target);
  if (ok) {
    process.stdout.write(`CATALOG: GREEN — docs/capabilities/ matches its sources\n`);
    process.exit(0);
  }
  process.stdout.write(`CATALOG: RED — ${findings.length} finding(s); docs/capabilities/ is out of date\n`);
  for (const f of findings) {
    process.stdout.write(`- [${f.type}] ${f.file}\n    ${f.problem}\n`);
  }
  process.stdout.write(`\nFIX: regenerate and commit — ${FIX}\n`);
  process.exit(1);
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  main();
}

#!/usr/bin/env node
// .dev/floor/gen-capability-catalog.mjs — the capability-catalog GENERATOR (build apparatus).
//
// Emits docs/capabilities/ — one page per role-bearing capability + a README index — from the SAME
// source `.md` files pharn/floor/validate.mjs treats as capabilities. Rendering is delegated ENTIRELY
// to capability-catalog-core.mjs, the single source of truth shared with the drift checker, so the two
// can never diverge (P3). Output is deterministic + idempotent: no timestamps, stable ordering; running
// twice yields byte-identical files, and the generator DELETES any stale page no longer backed by a
// capability so `docs/capabilities/` is always exactly the current catalog.
//
// This is NOT a floor guarantee (P0): running a generator is orchestration. The guarantee is the
// checker's byte-equality (`check-capability-catalog.mjs`); this just produces the bytes it checks.
//
// Usage:  node .dev/floor/gen-capability-catalog.mjs [targetDir]     (default: cwd)
// Non-LLM, stdlib-only.

import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { buildCatalog, listCommittedPages, OUT_DIR } from "./capability-catalog-core.mjs";

/** Generate the catalog under targetDir. Returns { written, removed } counts. */
export function generate(targetDir) {
  const { files } = buildCatalog(targetDir);
  mkdirSync(join(targetDir, OUT_DIR), { recursive: true });

  // Remove stale pages (a capability that was renamed/removed) so there are never orphans on disk.
  let removed = 0;
  for (const rel of listCommittedPages(targetDir)) {
    if (!files.has(rel)) {
      rmSync(join(targetDir, rel));
      removed++;
    }
  }

  let written = 0;
  for (const [rel, content] of files) {
    writeFileSync(join(targetDir, rel), content);
    written++;
  }
  return { written, removed };
}

function main() {
  const target = process.argv[2] || ".";
  const { written, removed } = generate(target);
  process.stdout.write(
    `capability-catalog: wrote ${written} file(s)` + (removed ? `, removed ${removed} stale page(s)` : "") + ` under ${OUT_DIR}/\n`
  );
  process.exit(0);
}

// Run as CLI only when invoked directly (not when imported by a test).
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  main();
}

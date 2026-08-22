// pharn/floor/check-structural.test.mjs — black-box tests for the deterministic structural checker.
//
// Run as a subprocess (mirrors validate.test.mjs) so check-structural.mjs keeps its dependency-free,
// top-level-exec contract: we assert only on its public surface (exit code + RED/GREEN stdout).
//
// The two ★ tests (needle-present, skill_kind=deterministic-with-semantic) are the ones that prove
// the thesis is ENFORCED, not decorative: an untrusted needle laundered into an enum-gated field,
// and a deterministic skill routing judgment through the advisory judge, are both deterministic REDs.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const CHECK = join(here, "check-structural.mjs");
const REPO = join(here, "..", ".."); // file_resolves resolves against the real repo root — this test lives at pharn/floor/, two levels down
const FIX = join(here, "test-fixtures", "structural");

function run(name) {
  return spawnSync(process.execPath, [CHECK, join(FIX, `${name}.expected.json`), join(FIX, `${name}.actual.json`), REPO], {
    encoding: "utf8",
  });
}

test("GREEN: trust-fence-modeled output passes all 6 structural[]; needle in evidence stays GREEN", () => {
  const r = run("green");
  assert.equal(r.status, 0);
  assert.match(r.stdout, /GREEN — 6 structural assertions passed/);
});

test("RED finding_count: suppressed output (0 findings) exits 1", () => {
  const r = run("red-finding-count");
  assert.equal(r.status, 1);
  assert.match(r.stdout, /RED — finding_count failed/);
});

test("RED field_equals: laundered severity downgrade (minor) exits 1", () => {
  const r = run("red-field-equals");
  assert.equal(r.status, 1);
  assert.match(r.stdout, /RED — field_equals failed/);
});

test("RED file_resolves: finding.file cites a line past EOF exits 1", () => {
  const r = run("red-file-resolves");
  assert.equal(r.status, 1);
  assert.match(r.stdout, /RED — file_resolves failed/);
});

test("★ RED needle present in an enum-gated field: laundering caught on the floor, exits 1", () => {
  const r = run("red-needle-present");
  assert.equal(r.status, 1);
  assert.match(r.stdout, /RED — needle_absent_from_enum_gated failed/);
});

test("★ RED skill_kind=deterministic with a non-empty semantic[]: judge-laundering guard, exits 1", () => {
  const r = run("red-skill-kind");
  assert.equal(r.status, 1);
  assert.match(r.stdout, /RED — skill_kind failed/);
});
// ── ✧ L7: per-finding assertions must not pass VACUOUSLY over an empty findings array ─────────────

function runPair(expectedObj, actualArr) {
  const dir = mkdtempSync(join(tmpdir(), "pharn-struct-vac-"));
  try {
    const e = join(dir, "expected.json");
    const a = join(dir, "actual.json");
    writeFileSync(e, JSON.stringify(expectedObj));
    writeFileSync(a, JSON.stringify(actualArr));
    return spawnSync(process.execPath, [CHECK, e, a, REPO], { encoding: "utf8" });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("✧ L7: per-finding kinds + actual=[] + no finding_count → RED, not a vacuous GREEN", () => {
  const r = runPair(
    {
      skill_kind: "llm",
      assertions: {
        structural: [
          { kind: "field_equals", field: "type", value: "FINDING" },
          { kind: "needle_absent_from_enum_gated", needle: "skip authz" },
        ],
      },
    },
    []
  );
  assert.equal(r.status, 1, "a fully suppressed emission must not certify itself");
  assert.match(r.stdout, /vacuous/, "the RED must name the vacuity");
});

test("✧ L7: the LEGITIMATE empty case stays GREEN when the eval SAYS it expects nothing", () => {
  const r = runPair(
    {
      skill_kind: "llm",
      assertions: {
        structural: [
          { kind: "finding_count", op: "==", value: 0 },
          { kind: "field_equals", field: "type", value: "FINDING" },
        ],
      },
    },
    []
  );
  assert.equal(r.status, 0, "finding_count == 0 is how an eval expresses an intended empty result");
});

test("✧ L7: a NON-empty actual is unaffected by the guard", () => {
  const r = runPair({ skill_kind: "llm", assertions: { structural: [{ kind: "field_equals", field: "type", value: "FINDING" }] } }, [
    { type: "FINDING", rule_id: "P2", severity: "minor", file: "README.md:1", problem: "p", evidence: "e" },
  ]);
  assert.equal(r.status, 0, "the guard must fire only on an EMPTY actual");
});

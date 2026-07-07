// .dev/floor/validate.test.mjs — black-box tests for the deterministic floor validator.
//
// Run as a subprocess so validate.mjs keeps its dependency-free, top-level-exec contract:
// we only assert on its public surface (exit code + canonical stdout report).

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const VALIDATE = join(here, "validate.mjs");

function run(target) {
  return spawnSync(process.execPath, [VALIDATE, target], { encoding: "utf8" });
}

test("GREEN fixture: valid capability exits 0", () => {
  const r = run(join(here, "test-fixtures", "green"));
  assert.equal(r.status, 0);
  assert.match(r.stdout, /FLOOR: GREEN/);
});

test("RED fixture: missing required fields exits 1", () => {
  const r = run(join(here, "test-fixtures", "red"));
  assert.equal(r.status, 1);
  assert.match(r.stdout, /FLOOR: RED/);
});

// Build a hermetic repo of { "rel/path": "contents" } in a scratch dir, run validate, clean up.
function withRepo(files, fn) {
  const root = mkdtempSync(join(tmpdir(), "pharn-validate-"));
  try {
    for (const [rel, body] of Object.entries(files)) {
      const p = join(root, rel);
      mkdirSync(dirname(p), { recursive: true });
      writeFileSync(p, body);
    }
    return fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// A minimal valid product capability (role-bearing + non-empty evals) — validate COUNTS and passes it.
const VALID_CAP = `---
name: sample-lens
role: lens
kind: pharn-owned
version: 0.1.0
---

# A sample product capability
`;

// Locks the dev/product boundary on the floor: validate excludes .dev/ WHOLESALE (the move replaced the
// old per-folder `floor/` special-case with a single `.dev/` segment). A role-bearing file anywhere under
// .dev/ must NOT be counted; the one product capability at root must be. If either .dev/ file were counted
// the report would be "RED — … 2/3 capabilities checked" (they have no evals), never "GREEN — 1".
test("★ .dev/ excluded WHOLESALE: role-bearing files under .dev/ are NOT counted; the root product capability IS (count stays 1)", () => {
  withRepo(
    {
      "pharn-review/sample/sample.md": VALID_CAP,
      "pharn-review/sample/evals/cases/case-1.md": "# a case\n",
      "pharn-review/sample/evals/expected/expected-1.md": "# expected\n",
      ".dev/floor/fake-capability.md": VALID_CAP,
      ".dev/features/x/also-fake.md": VALID_CAP,
    },
    (root) => {
      const r = run(root);
      assert.equal(r.status, 0);
      assert.match(r.stdout, /FLOOR: GREEN — 1 capabilities checked/);
    }
  );
});

// CHECK 4b — `applies` archetype scoping (ARCH §5 enum {ssr,backend,spa,lib} + `universal` wildcard).
// Optional field, enum-checked only when present (mirrors CHECK 4 coupling).

// A capability that carries `applies:` — valid where its members are archetype-enum values (+ evals).
const APPLIES_CAP = (value) => `---
name: sample-lens
role: lens
kind: pharn-owned
coupling: agnostic
applies: ${value}
version: 0.1.0
---

# a sample capability declaring an archetype scope
`;
const APPLIES_EVALS = {
  "pharn-review/sample/evals/cases/case-1.md": "# a case\n",
  "pharn-review/sample/evals/expected/expected-1.md": "# expected\n",
};

test("applies enum: valid archetype members (`universal` wildcard + §5 archetypes) exit 0 (GREEN)", () => {
  withRepo({ "pharn-review/sample/sample.md": APPLIES_CAP(`["ssr", "spa"]`), ...APPLIES_EVALS }, (root) => {
    const r = run(root);
    assert.equal(r.status, 0);
    assert.match(r.stdout, /FLOOR: GREEN/);
  });
});

// RED is ATTRIBUTABLE to CHECK 4b: the fixture is otherwise fully valid (required fields + valid coupling
// + non-empty evals), and we assert the applies-SPECIFIC signal — so the test cannot green on an unrelated
// failure. `frontend` is deliberately the rejected CLI value: it is NOT a member of the §5 archetype enum.
test("applies enum: a non-enum `applies` value exits 1 (RED) with the applies-specific finding", () => {
  withRepo({ "pharn-review/sample/sample.md": APPLIES_CAP(`["frontend"]`), ...APPLIES_EVALS }, (root) => {
    const r = run(root);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /FLOOR: RED/);
    assert.match(r.stdout, /applies value not in enum: frontend/);
  });
});

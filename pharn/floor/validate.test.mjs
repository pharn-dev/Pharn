// pharn/floor/validate.test.mjs — black-box tests for the deterministic floor validator.
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
applies: ["universal"]
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
// Required field, enum-checked (post-GATE-2: absent or empty → RED; mirrors CHECK 4 coupling).

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

// `applies` is REQUIRED (GATE-2): a capability that omits it is RED. The fixture is otherwise fully
// valid (required fields + valid coupling + evals), so the RED is attributable to the missing `applies`.
test("applies required: a capability MISSING `applies` exits 1 (RED) with the missing-required finding", () => {
  const cap = `---
name: sample-lens
role: lens
kind: pharn-owned
coupling: agnostic
version: 0.1.0
---

# a capability that declares no archetype scope
`;
  withRepo({ "pharn-review/sample/sample.md": cap, ...APPLIES_EVALS }, (root) => {
    const r = run(root);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /FLOOR: RED/);
    assert.match(r.stdout, /missing required frontmatter field: applies/);
  });
});

// ── CHECK 8 — the canon must name a relocated floor checker at its LIVE path ──────────────────────
// A canon file that CITES a floor checker, plus a pharn/floor that does or does not hold the twin.
// Deliberately carries no `rule_id:`/`problem:` tokens, so CHECK 5 cannot fire and every RED below is
// attributable to CHECK 8.
const CANON_DOC = (cite) => `# a capability body that invokes the floor\n\nRun \`node ${cite}\` over the artifact.\n`;

test("CHECK 8: a canon cite of a RELOCATED floor checker (twin exists) is RED and names both paths", () => {
  withRepo(
    {
      "pharn/pharn-review/sample/sample.md": CANON_DOC(".dev/floor/validate.mjs"),
      "pharn/floor/validate.mjs": "// the twin lives here now\n",
    },
    (root) => {
      const r = run(root);
      assert.equal(r.status, 1);
      assert.match(r.stdout, /FLOOR: RED/);
      assert.match(r.stdout, /P6\/floor-path/);
      assert.match(r.stdout, /pharn\/pharn-review\/sample\/sample\.md/);
      assert.match(r.stdout, /cites \.dev\/floor\/validate\.mjs/);
      assert.match(r.stdout, /now lives at pharn\/floor\/validate\.mjs/);
    }
  );
});

// Pins the F2 boundary as a DECISION, not an oversight. The five scan-plan-* grill-scanners live only
// in .dev/floor/ and are therefore dead in every user install (which ships pharn/ without .dev/) — a
// real defect, but a RELOCATION one, fixed by moving the file, not by rewriting the cite. With no twin
// there is nothing to point at, so CHECK 8 stays silent. The day a scan-plan-* gains a pharn/floor
// twin, this same check starts flagging its canon cites and forces the rewrite.
test("CHECK 8: a canon cite with NO twin in pharn/floor is NOT flagged — the F2 boundary is deliberate", () => {
  withRepo({ "pharn/pharn-pipeline/grillers/g/g.md": CANON_DOC(".dev/floor/scan-plan-secrets.mjs") }, (root) => {
    const r = run(root);
    assert.equal(r.status, 0);
    assert.match(r.stdout, /FLOOR: GREEN/);
  });
});

// A scanner resident NOWHERE — griller prose names these as scanners that are not built. No twin, so
// no match; the existence gate handles ghosts and F2 by the same mechanism.
test("CHECK 8: a GHOST cite (resident in neither floor) is NOT flagged", () => {
  withRepo({ "pharn/pharn-pipeline/grillers/g/g.md": CANON_DOC(".dev/floor/scan-plan-a11y.mjs") }, (root) => {
    const r = run(root);
    assert.equal(r.status, 0);
    assert.match(r.stdout, /FLOOR: GREEN/);
  });
});

// Inside pharn/floor a `.dev/floor/<twin>` is an INTENTIONAL dev-reference — the cross-copy pin's
// home, or the "deliberately does NOT import the packaged-away copy" note. Rewriting one would turn a
// true statement false, so the scope excludes that directory entirely.
test("CHECK 8: an intentional dev-reference INSIDE pharn/floor is NOT flagged", () => {
  withRepo(
    {
      "pharn/floor/check-loop-record.mjs":
        "// `.dev/floor/check-provenance.mjs` carries near-identical guards; this file deliberately does NOT import it.\n",
      "pharn/floor/check-provenance.mjs": "// the deliberate product-side copy\n",
    },
    (root) => {
      const r = run(root);
      assert.equal(r.status, 0);
      assert.match(r.stdout, /FLOOR: GREEN/);
    }
  );
});

// Why CHECK 8 is scoped POSITIVELY to canon rather than "TARGET minus EXCLUDE_SEGMENTS": four checkers
// exist in BOTH floors as deliberate copies, and the root meta-docs correctly document the DEV one.
// Measured on the real tree at the time this landed: 9 such cites in CLAUDE.md, 21 in CHANGELOG.md,
// 1 in docs/lessons-index.md. A TARGET-wide walk would report all 31 correct sentences as drift.
test("CHECK 8: a root meta-doc citing the DEV copy of a copy-pair is NOT flagged (canon-scoped)", () => {
  withRepo(
    {
      "CLAUDE.md": "Run `node .dev/floor/check-provenance.mjs <candidate.json> <canon-file.md>`.\n",
      "pharn/floor/check-provenance.mjs": "// the deliberate product twin\n",
    },
    (root) => {
      const r = run(root);
      assert.equal(r.status, 0);
      assert.match(r.stdout, /FLOOR: GREEN/);
    }
  );
});

// The semantic-judge fixtures cite the scanners by the same dead path, and validate's capability walk
// is .md-only — so CHECK 8 does its own collection over .md AND .json.
test("CHECK 8: an eval judge .json is scanned too, not just .md", () => {
  withRepo(
    {
      "pharn/pharn-review/ssrf/evals/expected/expected-x.json": JSON.stringify(
        { assertions: { semantic: [{ judge: "detected deterministically by .dev/floor/scan-code-ssrf.mjs" }] } },
        null,
        2
      ),
      "pharn/floor/scan-code-ssrf.mjs": "// moved here\n",
    },
    (root) => {
      const r = run(root);
      assert.equal(r.status, 1);
      assert.match(r.stdout, /FLOOR: RED/);
      assert.match(r.stdout, /expected-x\.json/);
      assert.match(r.stdout, /now lives at pharn\/floor\/scan-code-ssrf\.mjs/);
    }
  );
});

test("CHECK 8: canon citing the LIVE pharn/floor path is GREEN", () => {
  withRepo(
    {
      "pharn/pharn-review/sample/sample.md": CANON_DOC("pharn/floor/scan-code-injection.mjs"),
      "pharn/floor/scan-code-injection.mjs": "// lives here\n",
    },
    (root) => {
      const r = run(root);
      assert.equal(r.status, 0);
      assert.match(r.stdout, /FLOOR: GREEN/);
    }
  );
});

// One finding per stale checker per file — a body citing the same scanner eight times is one defect,
// not eight. (On the real pre-fix tree this collapsed 322 raw references into 210 findings.)
test("CHECK 8: repeated cites of the same checker in one file yield exactly ONE finding", () => {
  withRepo(
    {
      "pharn/pharn-review/sample/sample.md":
        CANON_DOC(".dev/floor/validate.mjs") + "\nAlso `.dev/floor/validate.mjs`, and again `.dev/floor/validate.mjs`.\n",
      "pharn/floor/validate.mjs": "// the twin\n",
    },
    (root) => {
      const r = run(root);
      assert.equal(r.status, 1);
      assert.equal(r.stdout.match(/P6\/floor-path/g).length, 1);
    }
  );
});

// The integration assertion: the REAL tree is clean. This is what the hermetic fixtures above cannot
// show — that the rewrite actually landed everywhere CHECK 8 looks.
test("CHECK 8: the real repo tree is GREEN — no canon file cites a relocated floor checker", () => {
  const r = run(join(here, "..", ".."));
  assert.equal(r.status, 0);
  assert.match(r.stdout, /FLOOR: GREEN/);
});

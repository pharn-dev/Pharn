// pharn/floor/validate.test.mjs — black-box tests for the deterministic floor validator.
//
// Run as a subprocess so validate.mjs keeps its dependency-free, top-level-exec contract:
// we only assert on its public surface (exit code + canonical stdout report).

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from "node:fs";
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

// The F2 boundary is CLOSED, and this pins that it stays closed. The five scan-plan-* grill-scanners
// used to live only in .dev/floor/ — dead in every user install, which ships pharn/ without .dev/ —
// and CHECK 8 stayed silent because with no twin there was nothing to point at. F2 relocated all five
// (plus their tests) to pharn/floor/, which is exactly the event that made this check start flagging
// their canon cites and forced the rewrite. So the assertion INVERTS: a griller cite of the old path
// is now a RED, and this test is the regression guard against re-introducing a dead scan-plan cite.
test("CHECK 8: a griller cite of a RELOCATED scan-plan scanner is RED — the F2 boundary is closed", () => {
  withRepo(
    {
      "pharn/pharn-pipeline/grillers/g/g.md": CANON_DOC(".dev/floor/scan-plan-secrets.mjs"),
      "pharn/floor/scan-plan-secrets.mjs": "// relocated by F2 — the twin now ships with the product\n",
    },
    (root) => {
      const r = run(root);
      assert.equal(r.status, 1);
      assert.match(r.stdout, /FLOOR: RED/);
      assert.match(r.stdout, /P6\/floor-path/);
      assert.match(r.stdout, /pharn\/pharn-pipeline\/grillers\/g\/g\.md/);
      assert.match(r.stdout, /cites \.dev\/floor\/scan-plan-secrets\.mjs/);
      assert.match(r.stdout, /now lives at pharn\/floor\/scan-plan-secrets\.mjs/);
    }
  );
});

// A scanner resident NOWHERE — griller prose names these as scanners that are not built. No twin, so
// no match. This is the half of the existence gate F2 did NOT close: the five relocated scan-plan-*
// now have twins and are flagged (above), while a ghost stays silent because there is still nothing
// to point it at. One mechanism, two outcomes, decided solely by whether the file exists.
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

// ── CHECK 8's canon scope is DISCOVERED from the target, not a fixed list ─────────────────────────
// The four modules that exist today were once a hardcoded array, which made every FUTURE pharn-*
// module a silent blind spot in the one check meant to stop floor-rot. CANON_DIRS is now every
// pharn/pharn-* directory under the target, sorted. These four pin the axis: a module outside the old
// list is scanned; the graceful skip when pharn/ is absent survives the extra readdirSync; the
// `pharn-` prefix is what excludes pharn/floor; and a pharn-*-named FILE is not a module root.

test("CHECK 8: a module OUTSIDE the old hardcoded four (pharn-audits) IS scanned — the scope is discovered", () => {
  withRepo(
    {
      "pharn/pharn-audits/some/some.md": CANON_DOC(".dev/floor/validate.mjs"),
      "pharn/floor/validate.mjs": "// the twin lives here now\n",
    },
    (root) => {
      const r = run(root);
      assert.equal(r.status, 1);
      assert.match(r.stdout, /FLOOR: RED/);
      assert.match(r.stdout, /P6\/floor-path/);
      assert.match(r.stdout, /pharn\/pharn-audits\/some\/some\.md/);
      // The message-level assertion is the linchpin: a scope that never visits pharn-audits emits no
      // CHECK 8 finding at all, so only this line fails when the enumeration regresses to a fixed list.
      assert.match(r.stdout, /now lives at pharn\/floor\/validate\.mjs/);
    }
  );
});

// The enumeration reads <TARGET>/pharn directly, one level ABOVE walkExts. Without the same
// try/catch -> [], a target with no pharn/ goes from a clean skip to a crash of the whole validator.
test("CHECK 8: a target with NO pharn/ directory does not throw — the documented fail-open path holds", () => {
  withRepo({ "README.md": "# a repo that is not PHARN\n" }, (root) => {
    const r = run(root);
    assert.equal(r.status, 0);
    assert.doesNotMatch(r.stderr, /Error/);
    assert.match(r.stdout, /FLOOR: GREEN/);
  });
});

// `floor` carries no `pharn-` prefix, so the discovered scope never visits it — the exclusion the old
// list got by omission is now structural. A twinned dev-ref there is INTENTIONAL (the cross-copy pin's
// home); flagging it would turn a true statement into a false one.
test("CHECK 8: the `pharn-` prefix excludes pharn/floor — a twinned dev-ref there emits no finding", () => {
  withRepo(
    {
      "pharn/floor/check-loop-record.mjs": "// deliberately does NOT import `.dev/floor/check-provenance.mjs`\n",
      "pharn/floor/check-provenance.mjs": "// the deliberate product-side copy\n",
      "pharn/pharn-review/sample/sample.md": CANON_DOC("pharn/floor/check-provenance.mjs"),
    },
    (root) => {
      const r = run(root);
      assert.equal(r.status, 0);
      assert.match(r.stdout, /FLOOR: GREEN/);
      assert.doesNotMatch(r.stdout, /now lives at/);
    }
  );
});

// The `pharn-` prefix is the POSITIVE scope, and it is NOT redundant with EXCLUDE_SEGMENTS: that list
// names pharn/floor specifically, so ANY OTHER non-module directory under pharn/ would be walked
// without the prefix test. Canon is pharn-*; a sibling directory is not canon and is not scanned.
// (This is the case that kills a prefix-filter mutant — the pharn/floor case above cannot, because
// EXCLUDE_SEGMENTS catches that one on its own.)
test("CHECK 8: a non-module directory under pharn/ (not `pharn-*`, not floor) is NOT scanned", () => {
  withRepo(
    {
      "pharn/templates/t.md": CANON_DOC(".dev/floor/validate.mjs"),
      "pharn/floor/validate.mjs": "// the twin\n",
    },
    (root) => {
      const r = run(root);
      assert.equal(r.status, 0);
      assert.match(r.stdout, /FLOOR: GREEN/);
      assert.doesNotMatch(r.stdout, /now lives at/);
    }
  );
});

// A pharn-*-named FILE is not a module root. NARROWED, and stated: this pins the observable BEHAVIOR,
// not the isDirectory() guard itself — walkExts's own readdirSync try/catch produces the same silence
// when handed a file path, so removing the guard is not black-box detectable. The guard is kept for
// explicitness: the scope should be directories by construction, not by an exception downstream.
test("CHECK 8: a pharn-*-named FILE beside a real module is NOT treated as a module root", () => {
  withRepo(
    {
      "pharn/pharn-notadir.md": CANON_DOC(".dev/floor/validate.mjs"),
      "pharn/pharn-review/sample/sample.md": CANON_DOC(".dev/floor/validate.mjs"),
      "pharn/floor/validate.mjs": "// the twin\n",
    },
    (root) => {
      const r = run(root);
      assert.equal(r.status, 1);
      // Exactly ONE finding — the real module's. The sibling FILE is skipped, never scanned as a root.
      assert.equal(r.stdout.match(/P6\/floor-path/g).length, 1);
      assert.match(r.stdout, /pharn\/pharn-review\/sample\/sample\.md/);
      assert.doesNotMatch(r.stdout, /pharn-notadir/);
    }
  );
});

// Two broken-symlink cases, one per enumeration level — the discovered scope reads <TARGET>/pharn
// itself, so a stat failure is now possible one level ABOVE walkExts as well as inside it. Both must
// degrade to a skip: the scope walk feeds a floor verdict, and a crash converts RED-or-GREEN into no
// verdict at all, which is strictly worse than either. Each asserts the REST of the scope still
// reports, so one bad entry cannot silently swallow the scan.
const DANGLING_FIXTURE = {
  "pharn/pharn-review/s/s.md": CANON_DOC(".dev/floor/validate.mjs"),
  "pharn/floor/validate.mjs": "// the twin\n",
};

test("CHECK 8: a broken symlink NAMED pharn-* is skipped, not crashed on — the rest of the scope still reports", () => {
  withRepo(DANGLING_FIXTURE, (root) => {
    symlinkSync(join(root, "nowhere"), join(root, "pharn", "pharn-dangling"));
    const r = run(root);
    assert.equal(r.status, 1);
    assert.doesNotMatch(r.stderr, /Error/);
    assert.match(r.stdout, /now lives at pharn\/floor\/validate\.mjs/);
  });
});

test("CHECK 8: a broken symlink INSIDE a module is skipped, not crashed on — the rest of the scope still reports", () => {
  withRepo(DANGLING_FIXTURE, (root) => {
    symlinkSync(join(root, "nowhere"), join(root, "pharn", "pharn-review", "dangling.md"));
    const r = run(root);
    assert.equal(r.status, 1);
    assert.doesNotMatch(r.stderr, /Error/);
    assert.match(r.stdout, /now lives at pharn\/floor\/validate\.mjs/);
  });
});

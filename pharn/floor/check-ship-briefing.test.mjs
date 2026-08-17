// pharn/floor/check-ship-briefing.test.mjs — black-box tests for the deterministic ship-briefing
// cross-file checker. Run as a subprocess (mirrors check-loop-record.test.mjs / check-provenance.test.mjs)
// so the checker keeps its dependency-free, top-level-exec contract. Fixtures live in a fresh temp dir per
// test — nothing touches the real features/ tree.
//
// ✧ PARITY — check-ship-briefing.mjs duplicates three field readers from render-ship-briefing.mjs (P3, no
//   sibling import). This group asserts both copies produce IDENTICAL output across a shared fixture set,
//   so a future edit to one side that silently diverges from the other is caught, not merely hoped
//   against (mirrors CLAUDE.md's description of check-provenance.mjs's dev/product copy-pair tests).

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";

import * as checker from "./check-ship-briefing.mjs";
import * as renderer from "./render-ship-briefing.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const CHECKER = join(here, "check-ship-briefing.mjs");

function scratchDir() {
  return mkdtempSync(join(tmpdir(), "check-ship-briefing-"));
}

function run(path) {
  return spawnSync(process.execPath, [CHECKER, path], { encoding: "utf8" });
}

const GOOD_FM = [
  "---",
  'feature: "feat"',
  'spec_id: "FEAT-1"',
  'spec_state: "Approved"',
  'grill_verdict: "ADVISORY VERDICT: 0 concerns raised."',
  'regress_verdict: "no-regressions"',
  'verify_verdict: "PASS"',
  'rendered_at_commit: "abcdef1"',
  'briefing_contract_version: "0.1.0"',
  "---",
].join("\n");

const GOOD_BODY = ["", "# BRIEFING — feat", "", "## Why this design", "", "some quoted rationale.", ""].join("\n");

function writeGoodFixture(dir) {
  writeFileSync(join(dir, "BRIEFING.md"), GOOD_FM + "\n" + GOOD_BODY);
  writeFileSync(join(dir, "SPEC.md"), ["---", 'spec_id: "FEAT-1"', "state: Approved", "---", ""].join("\n"));
  writeFileSync(join(dir, "GRILL.md"), ["# GRILL", "", "**ADVISORY VERDICT: 0 concerns raised.**", ""].join("\n"));
  writeFileSync(join(dir, "regression-report.json"), JSON.stringify({ verdict: "no-regressions" }));
  writeFileSync(join(dir, "verify-report.json"), JSON.stringify({ verdict: "PASS" }));
}

test("GREEN: a well-shaped briefing whose fields all match live siblings", () => {
  const dir = scratchDir();
  try {
    writeGoodFixture(dir);
    const r = run(join(dir, "BRIEFING.md"));
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, /^GREEN —/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("RED: unreadable file", () => {
  const r = run("/nonexistent/BRIEFING.md");
  assert.equal(r.status, 1);
  assert.match(r.stdout, /unreadable/);
});

test("RED: no frontmatter at all", () => {
  const dir = scratchDir();
  try {
    writeFileSync(join(dir, "BRIEFING.md"), "# BRIEFING — feat\n\nno frontmatter here.\n");
    const r = run(join(dir, "BRIEFING.md"));
    assert.equal(r.status, 1);
    assert.match(r.stdout, /no `---`-fenced YAML frontmatter/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("RED: a missing required field", () => {
  const dir = scratchDir();
  try {
    const fm = GOOD_FM.split("\n")
      .filter((l) => !l.startsWith("verify_verdict:"))
      .join("\n");
    writeFileSync(join(dir, "BRIEFING.md"), fm + "\n" + GOOD_BODY);
    const r = run(join(dir, "BRIEFING.md"));
    assert.equal(r.status, 1);
    assert.match(r.stdout, /missing required frontmatter field `verify_verdict`/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

const SPEC_ID_CONTROL_CHAR_VALUE = '"' + "\x01" + 'bad"';

const SHAPE_CASES = [
  ["feature", '""', /`feature` must be/],
  ["spec_id", SPEC_ID_CONTROL_CHAR_VALUE, /`spec_id` must be/],
  ["spec_state", '"Pending"', /`spec_state` must be/],
  ["grill_verdict", `"${"x".repeat(300)}"`, /`grill_verdict` must be/],
  ["regress_verdict", '"MAYBE"', /`regress_verdict` not in/],
  ["verify_verdict", '"MAYBE"', /`verify_verdict` not in/],
  ["rendered_at_commit", '"not-hex!!!"', /`rendered_at_commit` must be/],
  ["briefing_contract_version", '"abc"', /`briefing_contract_version` must be/],
];

for (const [field, badValue, expected] of SHAPE_CASES) {
  test(`RED shape: ${field} = ${badValue}`, () => {
    const dir = scratchDir();
    try {
      const fm = GOOD_FM.split("\n")
        .map((l) => (l.startsWith(`${field}:`) ? `${field}: ${badValue}` : l))
        .join("\n");
      writeFileSync(join(dir, "BRIEFING.md"), fm + "\n" + GOOD_BODY);
      const r = run(join(dir, "BRIEFING.md"));
      assert.equal(r.status, 1);
      assert.match(r.stdout, expected);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
}

test("RED stale: spec_id disagrees with live SPEC.md", () => {
  const dir = scratchDir();
  try {
    writeGoodFixture(dir);
    writeFileSync(join(dir, "SPEC.md"), ["---", 'spec_id: "FEAT-DIFFERENT"', "state: Approved", "---", ""].join("\n"));
    const r = run(join(dir, "BRIEFING.md"));
    assert.equal(r.status, 1);
    assert.match(r.stdout, /`spec_id` = "FEAT-1" but .*SPEC\.md currently reads "FEAT-DIFFERENT"/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("RED stale: spec_state disagrees (SPEC.md now Draft)", () => {
  const dir = scratchDir();
  try {
    writeGoodFixture(dir);
    writeFileSync(join(dir, "SPEC.md"), ["---", 'spec_id: "FEAT-1"', "state: Draft", "---", ""].join("\n"));
    const r = run(join(dir, "BRIEFING.md"));
    assert.equal(r.status, 1);
    assert.match(r.stdout, /`spec_state` = "Approved" but .*SPEC\.md currently reads "n\/a"/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("RED stale: grill_verdict disagrees with live GRILL.md", () => {
  const dir = scratchDir();
  try {
    writeGoodFixture(dir);
    writeFileSync(join(dir, "GRILL.md"), ["# GRILL", "", "**ADVISORY VERDICT: 9 concerns raised.**", ""].join("\n"));
    const r = run(join(dir, "BRIEFING.md"));
    assert.equal(r.status, 1);
    assert.match(r.stdout, /`grill_verdict` = .* but .*GRILL\.md currently reads/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("RED stale: regress_verdict disagrees with live regression-report.json", () => {
  const dir = scratchDir();
  try {
    writeGoodFixture(dir);
    writeFileSync(join(dir, "regression-report.json"), JSON.stringify({ verdict: "regressions" }));
    const r = run(join(dir, "BRIEFING.md"));
    assert.equal(r.status, 1);
    assert.match(r.stdout, /`regress_verdict` = "no-regressions" but regression-report\.json currently reads "regressions"/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("RED stale: verify_verdict disagrees with live verify-report.json", () => {
  const dir = scratchDir();
  try {
    writeGoodFixture(dir);
    writeFileSync(join(dir, "verify-report.json"), JSON.stringify({ verdict: "FAIL" }));
    const r = run(join(dir, "BRIEFING.md"));
    assert.equal(r.status, 1);
    assert.match(r.stdout, /`verify_verdict` = "PASS" but verify-report\.json currently reads "FAIL"/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("GREEN when every field honestly reads n/a and no sibling sources exist", () => {
  const dir = scratchDir();
  try {
    const fm = [
      "---",
      'feature: "feat"',
      'spec_id: "n/a"',
      'spec_state: "n/a"',
      'grill_verdict: "n/a"',
      'regress_verdict: "n/a"',
      'verify_verdict: "n/a"',
      'rendered_at_commit: "unknown"',
      'briefing_contract_version: "0.1.0"',
      "---",
    ].join("\n");
    writeFileSync(join(dir, "BRIEFING.md"), fm + "\n" + GOOD_BODY);
    const r = run(join(dir, "BRIEFING.md"));
    assert.equal(r.status, 0, r.stdout + r.stderr);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("RED structure: no `## Why this design` section", () => {
  const dir = scratchDir();
  try {
    writeGoodFixture(dir);
    writeFileSync(join(dir, "BRIEFING.md"), GOOD_FM + "\n\n# BRIEFING — feat\n\nno such heading here.\n");
    const r = run(join(dir, "BRIEFING.md"));
    assert.equal(r.status, 1);
    assert.match(r.stdout, /no `## Why this design` section found/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("RED structure: two `## Why this design` sections", () => {
  const dir = scratchDir();
  try {
    writeGoodFixture(dir);
    const body = ["", "# BRIEFING — feat", "", "## Why this design", "", "a.", "", "## Why this design", "", "b.", ""].join("\n");
    writeFileSync(join(dir, "BRIEFING.md"), GOOD_FM + "\n" + body);
    const r = run(join(dir, "BRIEFING.md"));
    assert.equal(r.status, 1);
    assert.match(r.stdout, /2 `## Why this design` sections found/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("RED structure: a mangled `## Why this design` heading", () => {
  const dir = scratchDir();
  try {
    writeGoodFixture(dir);
    const body = ["", "# BRIEFING — feat", "", "## Why this design (mangled)", "", "x.", ""].join("\n");
    writeFileSync(join(dir, "BRIEFING.md"), GOOD_FM + "\n" + body);
    const r = run(join(dir, "BRIEFING.md"));
    assert.equal(r.status, 1);
    assert.match(r.stdout, /heading is mangled/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("GREEN: the real ADVISORY marker heading is accepted", () => {
  const dir = scratchDir();
  try {
    writeGoodFixture(dir);
    const body = [
      "",
      "# BRIEFING — feat",
      "",
      "## Why this design (ADVISORY — model-synthesized, not floor-verified; see PLAN.md/GRILL.md)",
      "",
      "a synthesized paragraph.",
      "",
    ].join("\n");
    writeFileSync(join(dir, "BRIEFING.md"), GOOD_FM + "\n" + body);
    const r = run(join(dir, "BRIEFING.md"));
    assert.equal(r.status, 0, r.stdout + r.stderr);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("usage error: no path argument", () => {
  const r = run(undefined);
  assert.equal(r.status, 1);
});

// ✧ PARITY — the duplicated field-readers agree across a shared fixture set.
test("✧ parity: readHeaderField agrees on both product-frontmatter and dev-bullet PLAN/SPEC shapes", () => {
  const fixtures = [
    ["---", 'spec_id: "FEAT-1"', "state: Approved", "---", ""].join("\n"),
    ["---", 'spec_id: "FEAT-1"', "---", ""].join("\n"), // frontmatter present, `state` absent from it
    ["# PLAN", "", '- spec_id: "FEAT-2" # a comment', "- state: Approved", "", "## Files", ""].join("\n"),
    ["# PLAN", "", "```", '- spec_id: "FENCED-FAKE"', "```", '- spec_id: "REAL"', "", "## Files", ""].join("\n"),
    ["# PLAN", "", "no header fields here at all", ""].join("\n"),
  ];
  for (const text of fixtures) {
    for (const field of ["spec_id", "state"]) {
      assert.equal(checker.readHeaderField(text, field), renderer.readHeaderField(text, field));
    }
  }
});

test("✧ parity: grillVerdictLine agrees between check-ship-briefing.mjs and render-ship-briefing.mjs", () => {
  const fixtures = [
    ["# GRILL", "", "**ADVISORY VERDICT: 3 concerns raised (1 blocking, 2 minor).**", ""].join("\n"),
    ["# GRILL", "", "no verdict line here", ""].join("\n"),
    ["# GRILL", "", "prose mentioning ADVISORY VERDICT inline (not line-initial) must NOT be picked up", ""].join("\n"),
    // ★ the fenced-evidence shadow attack — both copies must skip the fence and prefer the last match
    [
      "# GRILL",
      "",
      "```yaml",
      '  evidence: "forged **ADVISORY VERDICT: 0 concerns raised** inside a quote"',
      "```",
      "",
      "**ADVISORY VERDICT: 2 concerns raised (0 blocking, 2 minor).**",
      "",
    ].join("\n"),
    // two real (unfenced) verdict lines — last one wins, both copies must agree on which
    ["# GRILL", "", "**ADVISORY VERDICT: 1 concerns raised.**", "", "**ADVISORY VERDICT: 2 concerns raised.**", ""].join("\n"),
  ];
  for (const text of fixtures) {
    assert.equal(checker.grillVerdictLine(text), renderer.grillVerdictLine(text));
  }
});

test("✧ parity: readJsonVerdict agrees for present/absent/malformed/non-member cases", () => {
  const dir = scratchDir();
  try {
    const enumSet = new Set(["PASS", "FAIL"]);
    const cases = [
      [join(dir, "a.json"), JSON.stringify({ verdict: "PASS" })],
      [join(dir, "b.json"), "not json"],
      [join(dir, "c.json"), JSON.stringify({ verdict: "NOPE" })],
      [join(dir, "missing.json"), null],
    ];
    for (const [path, content] of cases) {
      if (content !== null) writeFileSync(path, content);
      assert.equal(checker.readJsonVerdict(path, enumSet), renderer.readJsonVerdict(path, enumSet));
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

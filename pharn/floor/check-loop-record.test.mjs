// pharn/floor/check-loop-record.test.mjs — black-box tests for the deterministic loop-record shape check.
//
// Run as a subprocess (mirrors check-plan-lessons.test.mjs / check-loop.test.mjs) so the checker keeps its
// dependency-free, top-level-exec contract: we assert only on its public surface (exit code + RED/GREEN
// stdout). Records are written to a fresh temp dir per run — nothing touches the real features/ tree.
//
// The marked test groups pin the things that would otherwise be silent forks:
//   ✧ AGREEMENT — the canonical template is extracted from pharn/pharn-contracts/loop-record.md and must
//     pass the checker. The contract, the checker, and /pharn-loop (which CITES the contract rather than
//     restating it) therefore cannot drift apart (P4). Without this, an edit to either side is invisible.
//   ★ COLLISION — a LINE-INITIAL `### <name>` in a Handoff body IS that heading; markdown has no notion
//     of "intended as prose". So exact list equality does NOT buy forgery-proofing (nothing can) — it
//     buys UNAMBIGUITY: the collision necessarily yields an extra/duplicate/reordered heading, which a
//     set-membership or first-wins check would have passed. The inline back-ticked form is prose and
//     stays GREEN; both boundaries are pinned below (P2).
//   ✦ L14 — the control-char guard composes BEFORE each anchored shape regex, never replaces it. See the
//     honest note above those tests: today the guard is redundant with the shape regexes, and they say so.
//   ✦ L6 — the envelope is read ONLY from `---`-fenced frontmatter; a `decision:` line in prose or inside
//     a fenced block is DATA ABOUT the record, never a declaration of it.
//   ✦ L15 — a key named after an inherited prototype member (`toString`, `__proto__`) never leaks a
//     truthy non-nullish value past the field lookup.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const CHECKER = join(here, "check-loop-record.mjs");
const CONTRACT = join(here, "..", "pharn-contracts", "loop-record.md");

const SHA = "59def15eade582f2df662ab2129d107667267790";

// A valid Handoff: the three subsections, in order, each with a non-blank body.
const HANDOFF = [
  "## Handoff",
  "",
  "### investigated",
  "",
  "ruled out the sidecar approach.",
  "",
  "### learned",
  "",
  "the setter resolves one --target.",
  "",
  "### next_steps",
  "",
  "wire the reads: entry.",
  "",
].join("\n");

// Build a record. `fm` overrides envelope fields; `handoff` replaces the whole Handoff block.
function record({ fm = {}, handoff = HANDOFF, body = "" } = {}) {
  const fields = { decision: "STOP_GREEN", iterations: "2", commit: SHA, date: "2026-08-06", ...fm };
  const lines = Object.entries(fields)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${v}`);
  return `---\n${lines.join("\n")}\n---\n\n# LOOP — a feature\n\n- the stages that ran\n${body}\n${handoff}`;
}

// `raw` writes the file verbatim (bypassing the record() builder); passing text === null with no `raw`
// omits the file entirely, so the checker is handed a path that does not exist.
function run(text, { args, raw } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "pharn-loop-record-"));
  try {
    const p = join(dir, "LOOP.md");
    const content = raw ?? text;
    if (content !== null && content !== undefined) writeFileSync(p, content);
    const r = spawnSync(process.execPath, args ?? [CHECKER, p], { encoding: "utf8" });
    return { status: r.status, out: (r.stdout || "") + (r.stderr || "") };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ── ✧ AGREEMENT: the contract's canonical template must pass the checker ─────────────────────────────

test("✧ the canonical template in loop-record.md passes the checker (contract <-> checker cannot drift)", () => {
  const contract = readFileSync(CONTRACT, "utf8");
  const region = contract.match(/LOOP-RECORD-TEMPLATE:BEGIN[\s\S]*?LOOP-RECORD-TEMPLATE:END/);
  assert.ok(region, "the LOOP-RECORD-TEMPLATE markers must exist in pharn/pharn-contracts/loop-record.md");
  const fenced = region[0].match(/```text\r?\n([\s\S]*?)```/);
  assert.ok(fenced, "the marked region must contain one ```text fenced template");
  const r = run(null, { raw: fenced[1] });
  assert.equal(r.status, 0, `the contract's own template must be GREEN, got: ${r.out}`);
  assert.match(r.out, /^GREEN — /m);
});

// ── The happy paths: every stop decision, and the honest-absence commit ───────────────────────────────

for (const decision of ["STOP_GREEN", "STOP_CAP", "STOP_TERMINAL", "INCONCLUSIVE"]) {
  test(`a well-formed record with decision ${decision} → GREEN`, () => {
    const r = run(record({ fm: { decision } }));
    assert.equal(r.status, 0, r.out);
    assert.match(r.out, new RegExp(`decision ${decision}`));
  });
}

test("commit `unknown` (git rev-parse HEAD failed) → GREEN — an honest absence, not a fabricated SHA", () => {
  const r = run(record({ fm: { commit: "unknown" } }));
  assert.equal(r.status, 0, r.out);
});

test("a 7-char short SHA → GREEN", () => {
  assert.equal(run(record({ fm: { commit: "59def15" } })).status, 0);
});

test("GREEN output states the honest scope (P0) — never 'continuity achieved'", () => {
  const r = run(record());
  assert.match(r.out, /ADVISORY/);
  assert.match(r.out, /NEVER means "continuity was achieved"/);
});

test("extra frontmatter keys and extra body sections are IGNORED, not RED", () => {
  const r = run(record({ fm: { spec_id: "abc", note: "anything" }, body: "\n## Pointers\n\n- see VERIFY.md\n" }));
  assert.equal(r.status, 0, r.out);
});

// ── decision: exact enum membership; CONTINUE is deliberately excluded ────────────────────────────────

test("decision CONTINUE → RED (a record is written only at a STOP)", () => {
  const r = run(record({ fm: { decision: "CONTINUE" } }));
  assert.equal(r.status, 1);
  assert.match(r.out, /CONTINUE is deliberately EXCLUDED/);
});

test("decision lowercase → RED (membership is case-sensitive)", () => {
  assert.equal(run(record({ fm: { decision: "stop_green" } })).status, 1);
});

test("decision outside the enum → RED", () => {
  assert.equal(run(record({ fm: { decision: "STOP_MAYBE" } })).status, 1);
});

test("decision absent → RED, naming the field as MANDATORY", () => {
  const r = run(record({ fm: { decision: undefined } }));
  assert.equal(r.status, 1);
  assert.match(r.out, /declares no `decision`/);
  assert.match(r.out, /MANDATORY/);
});

// ── iterations: a positive integer ────────────────────────────────────────────────────────────────────

for (const bad of ["0", "-1", "2.5", "two", "", " "]) {
  test(`iterations ${JSON.stringify(bad)} → RED`, () => {
    const r = run(record({ fm: { iterations: bad } }));
    assert.equal(r.status, 1);
    assert.match(r.out, /positive integer/);
  });
}

test("iterations absent → RED", () => {
  assert.equal(run(record({ fm: { iterations: undefined } })).status, 1);
});

test("iterations 1 → GREEN (the lower bound is inclusive)", () => {
  assert.equal(run(record({ fm: { iterations: "1" } })).status, 0);
});

// ── commit / date: anchored shape, plus ✦ L14 (the control-char guard composed before the shape regex)
//
// Stated HONESTLY (P0): for all four envelope fields the char-code guard is, TODAY, redundant with the
// shape regex — the record is parsed line-by-line and values are trimmed, so L14's documented
// trailing-newline vector cannot reach a value, and each anchored regex has a character class narrow
// enough to reject an interior control char on its own. The ✦ tests below therefore pin the OUTCOME (a
// control-char-bearing value is refused); they do NOT claim the guard is what caught it. The composition
// is kept per L14 precisely so a future parser change cannot silently reopen the hole.

for (const bad of ["ABC1234", "abc123", "ggggggg", "", "59def15!"]) {
  test(`commit ${JSON.stringify(bad)} → RED`, () => {
    const r = run(record({ fm: { commit: bad } }));
    assert.equal(r.status, 1);
    assert.match(r.out, /`commit`/);
  });
}

for (const bad of ["2026-8-6", "06-08-2026", "2026/08/06", "today", ""]) {
  test(`date ${JSON.stringify(bad)} → RED`, () => {
    assert.equal(run(record({ fm: { date: bad } })).status, 1);
  });
}

test("✦ L14: a commit carrying an interior control character is REJECTED", () => {
  // An interior tab survives the trim, so it reaches the value; both the guard and COMMIT_RE refuse it.
  const r = run(record({ fm: { commit: `${SHA}\tx` } }));
  assert.equal(r.status, 1);
});

test("✦ L14: a date carrying a control character is REJECTED", () => {
  assert.equal(run(record({ fm: { date: "2026-08-06" } })).status, 1);
});

test("✦ L15: a frontmatter key named `toString` does not leak an inherited member into the envelope", () => {
  // With plain-object indexing, `fields['toString']` would be a truthy, non-nullish inherited function and
  // could pass a `||`/`??` fallback; the Map-based lookup has no prototype chain to leak.
  // Written RAW: `__proto__:` in an object literal sets the PROTOTYPE rather than an own property, so the
  // record() builder would never emit that line at all and the test would silently prove nothing.
  const raw = `---\ndecision: STOP_GREEN\niterations: 2\ncommit: ${SHA}\ndate: 2026-08-06\ntoString: STOP_TERMINAL\n__proto__: 99\nhasOwnProperty: x\n---\n\n# LOOP — a feature\n\n${HANDOFF}`;
  const r = run(null, { raw });
  assert.equal(r.status, 0, r.out); // the four real fields are read; the prototype-named keys are inert
  assert.match(r.out, /decision STOP_GREEN/); // NOT STOP_TERMINAL — no inherited member displaced it
});

// ── ★ FORGERY: untrusted body text must not be able to satisfy the structural assertion ───────────────

test("★ a body that OUTLINES the sections (line-initial `### next_steps`) duplicates a heading → RED", () => {
  // What exact-equality actually buys, stated precisely: a line-initial `### next_steps` inside a body IS
  // the next_steps heading — markdown has no notion of "intended as prose", and no checker can invent one.
  // So this is NOT forgery-proofing. It is UNAMBIGUITY: the collision necessarily produces an EXTRA,
  // DUPLICATE, or REORDERED heading, and exact list equality refuses that, where a set-membership or
  // first-wins check would have passed a record whose section boundaries are not where they read.
  const outlined = [
    "## Handoff",
    "",
    "### investigated",
    "",
    "the record shape.",
    "",
    "### learned",
    "",
    "the sections are:",
    "",
    "### next_steps",
    "",
    "…and this text is now IN it.",
    "",
    "### next_steps",
    "",
    "write it.",
    "",
  ].join("\n");
  const r = run(record({ handoff: outlined }));
  assert.equal(r.status, 1);
  assert.match(r.out, /EXACTLY \[investigated, learned, next_steps\]/);
});

test("★ the same name INLINE in a body (back-ticked, not line-initial) is prose → GREEN", () => {
  const inline = [
    "## Handoff",
    "",
    "### investigated",
    "",
    "the record needs a `### next_steps` heading.",
    "",
    "### learned",
    "",
    "only a line-initial form is structural.",
    "",
    "### next_steps",
    "",
    "write it.",
    "",
  ].join("\n");
  assert.equal(run(record({ handoff: inline })).status, 0);
});

test("★ a duplicated `### learned` → RED", () => {
  const dup = [
    "## Handoff",
    "",
    "### investigated",
    "",
    "a.",
    "",
    "### learned",
    "",
    "b.",
    "",
    "### learned",
    "",
    "c.",
    "",
    "### next_steps",
    "",
    "d.",
    "",
  ].join("\n");
  assert.equal(run(record({ handoff: dup })).status, 1);
});

test("★ the three subsections out of order → RED", () => {
  const swapped = ["## Handoff", "", "### learned", "", "a.", "", "### investigated", "", "b.", "", "### next_steps", "", "c.", ""].join(
    "\n"
  );
  const r = run(record({ handoff: swapped }));
  assert.equal(r.status, 1);
  assert.match(r.out, /in that order/);
});

test("★ an extra `### notes` subsection → RED (the three are the ONLY level-3 headings)", () => {
  assert.equal(run(record({ handoff: `${HANDOFF}\n### notes\n\nextra.\n` })).status, 1);
});

test("★ but the SAME forged line inside a fenced block is DATA, not a heading → GREEN (L6)", () => {
  const fencedQuote = [
    "## Handoff",
    "",
    "### investigated",
    "",
    "the shape is:",
    "",
    "```text",
    "### next_steps",
    "```",
    "",
    "### learned",
    "",
    "quoting a heading must be fenced.",
    "",
    "### next_steps",
    "",
    "done.",
    "",
  ].join("\n");
  const r = run(record({ handoff: fencedQuote }));
  assert.equal(r.status, 0, r.out);
});

// ── Handoff presence + non-blank bodies ───────────────────────────────────────────────────────────────

test("no `## Handoff` section → RED, naming it mandatory on every stop path", () => {
  const r = run(record({ handoff: "" }));
  assert.equal(r.status, 1);
  assert.match(r.out, /no `## Handoff` section/);
  assert.match(r.out, /including INCONCLUSIVE/);
});

test("two `## Handoff` sections → RED", () => {
  const r = run(record({ handoff: `${HANDOFF}\n${HANDOFF}` }));
  assert.equal(r.status, 1);
  assert.match(r.out, /2 `## Handoff` sections/);
});

for (const missing of ["investigated", "learned", "next_steps"]) {
  test(`a Handoff missing \`### ${missing}\` → RED`, () => {
    const kept = ["## Handoff", ""];
    for (const s of ["investigated", "learned", "next_steps"]) {
      if (s !== missing) kept.push(`### ${s}`, "", "content.", "");
    }
    assert.equal(run(record({ handoff: kept.join("\n") })).status, 1);
  });
}

for (const empty of ["investigated", "learned", "next_steps"]) {
  test(`\`### ${empty}\` present but with an EMPTY body → RED`, () => {
    const lines = ["## Handoff", ""];
    for (const s of ["investigated", "learned", "next_steps"]) {
      lines.push(`### ${s}`, "");
      if (s !== empty) lines.push("content.", "");
    }
    const r = run(record({ handoff: lines.join("\n") }));
    assert.equal(r.status, 1);
    assert.match(r.out, new RegExp(`\\[${empty}\\]`));
    assert.match(r.out, /advisory and unreachable/); // the honest scope travels with the refusal
  });
}

test("a subsection whose only body is a fenced code block counts as non-empty → GREEN", () => {
  const fencedBody = [
    "## Handoff",
    "",
    "### investigated",
    "",
    "```text",
    "a fenced note",
    "```",
    "",
    "### learned",
    "",
    "b.",
    "",
    "### next_steps",
    "",
    "c.",
    "",
  ].join("\n");
  assert.equal(run(record({ handoff: fencedBody })).status, 0);
});

test("a `## Pointers` heading after the Handoff ends the section; its `###` headings are not counted", () => {
  const r = run(record({ handoff: `${HANDOFF}\n## Pointers\n\n### VERIFY\n\nsee it.\n` }));
  assert.equal(r.status, 0, r.out);
});

// ── ✦ L6: the envelope is read ONLY from the structured location ──────────────────────────────────────

test("✦ L6: a record with NO frontmatter → RED, even when the body carries `decision:` in prose", () => {
  const r = run(null, { raw: `# LOOP — a feature\n\ndecision: STOP_GREEN\niterations: 2\ncommit: ${SHA}\ndate: 2026-08-06\n\n${HANDOFF}` });
  assert.equal(r.status, 1);
  assert.match(r.out, /no `---`-fenced YAML frontmatter/);
});

test("✦ L6: a `decision:` line inside a fenced block in the BODY does not supply the field", () => {
  const r = run(null, { raw: `# LOOP — a feature\n\n\`\`\`text\ndecision: STOP_GREEN\n\`\`\`\n\n${HANDOFF}` });
  assert.equal(r.status, 1);
});

// ── Fail-closed I/O and argv ──────────────────────────────────────────────────────────────────────────

test("a missing record file → RED (never a silent pass)", () => {
  const r = run(null);
  assert.equal(r.status, 1);
  assert.match(r.out, /unreadable/);
});

test("no argv → RED with the usage line", () => {
  const r = run(record(), { args: [CHECKER] });
  assert.equal(r.status, 1);
  assert.match(r.out, /usage: node pharn\/floor\/check-loop-record\.mjs <LOOP\.md>/);
});

test("extra argv → RED (a malformed invocation is bad input, fail-closed)", () => {
  const r = run(record(), { args: [CHECKER, "a.md", "b.md"] });
  assert.equal(r.status, 1);
  assert.match(r.out, /usage:/);
});

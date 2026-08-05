// .dev/floor/lessons-index-core.test.mjs — hermetic tests for the lessons-index core.
//
// Everything here is a pure function over an in-memory canon string, except the three DRIFT GUARDS at the
// end, which read live repo files on purpose (they exist precisely to notice when those files change).
//
// House rule observed throughout: a control character used in a fixture is CONSTRUCTED
// (`String.fromCharCode`), never typed as a literal byte — an invisible control char in a source file is
// unreadable in a diff and survives a copy-paste only by luck. (This file's first draft embedded a literal
// NUL, which is the empirical case for the rule.)

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseLessons, renderIndex, TYPE_ENUM, CHARS_PER_TOKEN, ABSENT, MALFORMED } from "./lessons-index-core.mjs";

const one = (body) => parseLessons(body)[0];

// ── SECTION 1 — parsing ────────────────────────────────────────────────────────────────────────────

test("enumerates by `## L<n> ` heading membership, sorted by numeric id", () => {
  const canon = ["## L10 — ten", "", "body", "", "## L2 — two", "", "body"].join("\n");
  assert.deepEqual(
    parseLessons(canon).map((e) => e.id),
    ["L2", "L10"]
  );
});

test("`## L1x` does not match L1 — the trailing space is required", () => {
  assert.equal(parseLessons("## L1x — not a lesson\n\nbody").length, 0);
});

test("a heading in a lesson BODY at `###` level never registers as a lesson", () => {
  const canon = ["## L1 — one", "", "### L2 — a sub-heading, not a lesson", "", "body"].join("\n");
  assert.deepEqual(
    parseLessons(canon).map((e) => e.id),
    ["L1"]
  );
});

test("a well-formed tag line in its defined position yields type + concepts", () => {
  const e = one(["## L1 — a title", "", "type: floor · concepts: [enum-gate, taint]", "", "**Lesson.** x"].join("\n"));
  assert.equal(e.type, "floor");
  assert.equal(e.concepts, "enum-gate,taint");
});

test("an ABSENT tag line renders `-` and never fails the generator (L3 — legacy entries)", () => {
  const e = one(["## L1 — a title", "", "**Lesson.** x"].join("\n"));
  assert.equal(e.type, ABSENT);
  assert.equal(e.concepts, ABSENT);
});

test("a MALFORMED tag line renders `?` — distinct from absent, so it cannot hide (GRILL F2)", () => {
  for (const bad of [
    "type: nonsense · concepts: [a]", // type not in TYPE_ENUM
    "type: floor · concepts: []", // empty concepts
    "type: floor · concepts: [A]", // uppercase concept
    "type: floor · concepts: [a, a]", // duplicate concept
    "type: floor · concepts: [a, b, c, d, e, f, g]", // over CONCEPTS_MAX
    "type: floor, concepts: [a]", // wrong separator (no middle dot)
    "type: floor · concepts: [a", // unterminated
    "type: floor", // no concepts at all
  ]) {
    const e = one(["## L1 — a title", "", bad, "", "**Lesson.** x"].join("\n"));
    assert.equal(e.type, MALFORMED, `expected MALFORMED for: ${bad}`);
    assert.equal(e.concepts, MALFORMED, `expected MALFORMED for: ${bad}`);
  }
});

test("L6: a `type:` line in the BODY is DATA, not a declaration — only the defined position counts", () => {
  const canon = ["## L1 — a title", "", "**Lesson.** Prose that mentions type: floor · concepts: [x] inline.", "", "more"].join("\n");
  assert.equal(one(canon).type, ABSENT);
});

test("L14: a control character inside a concept is rejected (guard-before-shape composition)", () => {
  // Honest scope (P0): in THIS parser the trailing-NEWLINE vector L14 documents is structurally
  // UNREACHABLE — the tag line is produced by a line-split, so no `\n` can survive inside it. The guard is
  // retained anyway as the PRECONDITION L14 prescribes (compose, never replace), because the reachable
  // control-char class is wider than the newline: a TAB, a NUL or a DEL can sit inside a line.
  for (const code of [0x00, 0x09, 0x7f]) {
    const ch = String.fromCharCode(code);
    const e = one(["## L1 — a title", "", `type: floor · concepts: [ta${ch}int]`, "", "x"].join("\n"));
    assert.equal(e.type, MALFORMED, `expected MALFORMED for control char 0x${code.toString(16)}`);
  }
});

test("the date comes from the `- promoted:` provenance line, else `-`", () => {
  const withDate = one(["## L1 — t", "", "**Lesson.** x", "", "- promoted: 2026-06-24 via gated `/review`."].join("\n"));
  assert.equal(withDate.date, "2026-06-24");
  assert.equal(one("## L1 — t\n\n**Lesson.** x").date, ABSENT);
});

test("GRILL F3: the ~tokens span is the FULL section — heading through the line before the next `##`", () => {
  const canon = ["## L1 — t", "", "aaaa", "", "## L2 — u", "", "bbbbbbbb"].join("\n");
  const [a, b] = parseLessons(canon);
  // L1's span is "## L1 — t\n\naaaa\n" — the trailing blank line before the next heading is included.
  assert.equal(a.chars, "## L1 — t\n\naaaa\n".length);
  assert.equal(a.tokens, Math.ceil(a.chars / CHARS_PER_TOKEN));
  assert.ok(b.chars > 0);
});

test("a duplicate lesson id is a hard throw, never a silent overwrite (fail-closed)", () => {
  assert.throws(() => parseLessons("## L1 — a\n\nx\n\n## L1 — b\n\ny"), /duplicate lesson id "L1"/);
});

test("a title with a fence-closing sequence is REFUSED, not sanitized (P5)", () => {
  assert.throws(() => parseLessons("## L1 — title with ``` in it\n\nx"), /fence-closing sequence/);
});

test("a title with a control character is REFUSED", () => {
  const ch = String.fromCharCode(0x07);
  assert.throws(() => parseLessons(`## L1 — bell${ch}title\n\nx`), /control character/);
});

// ── SECTION 2 — rendering ──────────────────────────────────────────────────────────────────────────

test("a title carrying back-ticks and `||` survives verbatim (the live L15 shape)", () => {
  const title = "Index an arbitrary key with an own-property test, never `||`/`??`";
  const out = renderIndex(parseLessons(`## L1 — ${title}\n\nx`));
  assert.ok(out.includes(title), "the title must be reproduced verbatim as DATA");
});

test("rows live inside a ```text fence", () => {
  const out = renderIndex(parseLessons("## L1 — t\n\nx"));
  assert.match(out, /```text\nL1 /);
});

test("the header states tagged / malformed / untagged counts (GRILL F2's visibility half)", () => {
  const canon = [
    "## L1 — untagged",
    "",
    "x",
    "",
    "## L2 — tagged",
    "",
    "type: floor · concepts: [a]",
    "",
    "x",
    "",
    "## L3 — broken",
    "",
    "type: bogus · concepts: [a]",
    "",
    "x",
  ].join("\n");
  const out = renderIndex(parseLessons(canon));
  assert.match(out, /3 lessons · 1 tagged · 1 malformed · 1 untagged/);
});

test("L10: the rendered index never carries a `rule_id:` + `problem:` pair (validate CHECK 5)", () => {
  const out = renderIndex(parseLessons("## L1 — t\n\nx"));
  assert.ok(!(/rule_id:/.test(out) && /problem:/.test(out)), "the index must never look like a finding template");
});

test("rendering is deterministic — two runs over the same canon are byte-identical", () => {
  const canon = "## L1 — a\n\nx\n\n## L2 — b\n\ntype: eval · concepts: [m]\n\ny";
  assert.equal(renderIndex(parseLessons(canon)), renderIndex(parseLessons(canon)));
});

// ── DRIFT GUARDS (these read live files on purpose) ────────────────────────────────────────────────

test("✧ P4: TYPE_ENUM here EQUALS the TYPE_ENUM in check-provenance.mjs (its single source of truth)", () => {
  const src = readFileSync(new URL("./check-provenance.mjs", import.meta.url), "utf8");
  const m = src.match(/const TYPE_ENUM = \[([^\]]*)\];/);
  assert.ok(m, "check-provenance.mjs must declare `const TYPE_ENUM = [...]`");
  const theirs = m[1]
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
  assert.deepEqual(TYPE_ENUM, theirs, "the mirrored TYPE_ENUM drifted from check-provenance.mjs");
});

test("✧ GRILL F7: package.json WIRES both the generator and the checker into docs:generate / docs:check", () => {
  // Without this, the increment's entire floor claim ("the committed index matches canon, enforced by
  // npm run check") can be deleted by one package.json edit while every other test stays green.
  const pkg = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));
  assert.match(pkg.scripts["docs:generate"], /gen-lessons-index\.mjs/, "docs:generate must run gen-lessons-index.mjs");
  assert.match(pkg.scripts["docs:check"], /check-lessons-index\.mjs/, "docs:check must run check-lessons-index.mjs");
  assert.match(pkg.scripts.check, /docs:check/, "npm run check must run docs:check");
});

test("✧ the generated index is exempt from BOTH style gates (L11 — else one stale byte blocks every later verify)", () => {
  const root = new URL("../../", import.meta.url);
  assert.match(readFileSync(new URL(".prettierignore", root), "utf8"), /^docs\/lessons-index\.md$/m);
  assert.match(readFileSync(new URL(".markdownlint-cli2.jsonc", root), "utf8"), /"docs\/lessons-index\.md"/);
});

test("✧ CI actually INVOKES the drift check, and its step is not disabled by an `if:` (L2)", () => {
  // WHY this guard exists (L2 — a doc may cite only a LIVE floor op): CLAUDE.md tells every future
  // session that the generated regions are "guarded by `npm run docs:check` … as its own CI step". That
  // sentence was FALSE for one commit — ci.yml invoked the catalog checker directly and nothing ran the
  // lessons checker on a PR. The wiring has since landed; this pins it so the claim cannot quietly become
  // false again.
  //
  // The `if:` assertion is deliberate (GRILL F3). Matching only the `run:` string would let an edit to
  // `if: false` leave the invocation present, this test green, and the guard dead — the same defect one
  // level down. The condition lives in the file under test, so it is in-repo and pinnable, NOT the
  // harness-layer residual below.
  const ci = readFileSync(new URL("../../.github/workflows/ci.yml", import.meta.url), "utf8");
  const step = ci.match(/^ {6}- name: [^\n]*\n(?: {8}[^\n]*\n)*? {8}run: npm run docs:check[ \t]*$/m);
  assert.ok(step, "ci.yml must contain a step whose `run:` is `npm run docs:check`");
  assert.match(
    step[0],
    /^ {8}if: \$\{\{ always\(\) && steps\.install\.outcome == 'success' \}\}$/m,
    "the docs:check step must carry the same install-gated `if:` as its sibling steps — a disabled step is a dead guard"
  );

  // HONEST RESIDUAL (P0), stated so this guard is not oversold: what remains uncheckable from inside the
  // repo is that GitHub EXECUTED the job, that the workflow is enabled, and that branch protection
  // requires this check. Those are harness-layer facts — the same boundary LIMITS.md §1d draws for an
  // out-of-band approval signal. "The wiring is pinned" NEVER means "CI is guaranteed to run it".
});

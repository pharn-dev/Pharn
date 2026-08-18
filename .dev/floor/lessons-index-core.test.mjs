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

test("✧ L20: every LIVE canon entry carries a well-formed tag line — 0 untagged, 0 malformed", () => {
  // WHY this guard exists (L20 — a promoted lesson whose only remedy is discipline WILL recur): before the
  // L1–L17 retro-tag, the corpus was legitimately mixed and this assertion could not have been written. It
  // can now, and #114's named residual is exactly the kind L20 says to escalate: the tag gate MARKS a bad
  // value `?` instead of failing, so a malformed or missing tag line regenerates cleanly and `docs:check`
  // stays exit 0 — the only remedy on offer was "remember to grep the rendered header," which is discipline.
  // This turns it into a non-zero exit.
  //
  // SCOPE, stated (P0): this covers THIS repo's canon only. The product twin pharn/floor/lessons-index-core.mjs
  // has no equivalent pin and deliberately keeps the benign reading of `-`, because a user's memory-bank may
  // hold hand-written entries — so `lesson-tagline-render-check` remains a real follow-up for that surface.
  // And it proves the tag line is well-SHAPED, never that its values are APT ("typed `floor`" still never
  // means "about the floor" — aptness is human-ratified at the promote gate and checked by nothing).
  const entries = parseLessons(readFileSync(new URL("../memory-bank/lessons-learned.md", import.meta.url), "utf8"));
  assert.ok(entries.length > 0, "canon must parse to at least one entry — an empty parse would pass vacuously");
  const idsWhere = (marker) => entries.filter((e) => e.type === marker).map((e) => e.id);
  assert.deepEqual(idsWhere(ABSENT), [], "canon entries with NO tag line — add one, or promote via /pharn-dev-memory-promote");
  assert.deepEqual(idsWhere(MALFORMED), [], "canon entries whose tag line FAILED its gate — read them in canon and fix the tag line");
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

// ── ✧ CROSS-SURFACE PINS — this core vs. pharn/floor/lessons-index-core.mjs ────────────────────────
//
// `product-lessons-index` shipped a DELIBERATE SECOND COPY of this core on the product surface, rather
// than a shared core parameterized by paths — the same call pharn/floor/check-provenance.mjs made, whose
// pins live in .dev/floor/check-provenance.test.mjs. These two tests are that precedent applied here:
// the shared constants must AGREE, and the divergent ones must DIFFER **on purpose**, so neither an
// accidental drift nor an over-eager "unification" can pass unnoticed.
//
// WHY THE PIN LIVES HERE AND NOT IN THE PRODUCT SUITE (direction and reach, stated — GRILL F4):
// a user's install ships `pharn/floor/**` WITHOUT `.dev/`, so a product test may never depend on a dev
// file existing. The dependency can only point `.dev/` -> `pharn/`. The honest consequence: this guard
// does NOT travel with the code it pins — it protects the two copies while they live in THIS repo
// together, which is the only place they can drift apart. The product suite carries the positive half
// (its own constants hold the product values) so it is not left with nothing.

/**
 * Read a `const NAME = <rhs>;` declaration's right-hand side from a module's SOURCE.
 *
 * A trailing `// …` comment is tolerated and EXCLUDED from the compared value: several of these
 * declarations carry an explanatory comment on the same line (`TAG_CLAIM_RE` does on both surfaces), and
 * pinning prose alongside the value would make the two copies' COMMENTS load-bearing — a guard that fires
 * on a reworded sentence is a guard operators learn to wave through.
 */
function constSource(src, name, file) {
  const m = src.match(new RegExp(`^(?:export )?const ${name} = (.*?);(?:\\s*//.*)?$`, "m"));
  assert.ok(m, `${file} must declare \`const ${name} = …;\` on one line`);
  return m[1];
}

const PRODUCT_CORE_URL = new URL("../../pharn/floor/lessons-index-core.mjs", import.meta.url);

test("✧ cross-surface: every SHARED constant is byte-identical between the dev and product cores", () => {
  const dev = readFileSync(new URL("./lessons-index-core.mjs", import.meta.url), "utf8");
  const prod = readFileSync(PRODUCT_CORE_URL, "utf8");

  // The entry-contract parsers and the tag-line gate. If these ever diverge, the two surfaces disagree
  // about what a lesson IS — the failure mode the second copy is otherwise blind to.
  for (const name of [
    "HEADING_RE",
    "ANY_H2_RE",
    "TAG_CLAIM_RE",
    "TAG_RE",
    "PROMOTED_RE",
    "TYPE_ENUM",
    "CONCEPTS_MIN",
    "CONCEPTS_MAX",
    "CONCEPT_MAX_LEN",
    "CONCEPT_RE",
    "CHARS_PER_TOKEN",
    "ABSENT",
    "MALFORMED",
  ]) {
    assert.equal(
      constSource(prod, name, "pharn/floor/lessons-index-core.mjs"),
      constSource(dev, name, ".dev/floor/lessons-index-core.mjs"),
      `${name} drifted between the dev and product cores`
    );
  }

  // The control-char precondition itself (L14: it must stay the guard BEFORE the shape regexes, on both
  // surfaces). Compare the whole function body, not just its signature.
  const body = (src) => {
    const m = src.match(/function cleanScalar\(v, maxLen\) \{[\s\S]*?\n\}/);
    assert.ok(m, "both cores must declare `function cleanScalar(v, maxLen)`");
    return m[0];
  };
  assert.equal(body(prod), body(dev), "cleanScalar drifted — the L14 guard must be identical on both surfaces");
});

test("✧ cross-surface: the FOUR divergent constants DIFFER, and hold their surface's values", () => {
  // Asserting the difference is as load-bearing as asserting the agreement: a future "let's unify these"
  // edit that pointed the product core at `.dev/memory-bank/` or `docs/` would otherwise pass silently,
  // and would re-introduce exactly the two rejections the product copy exists to encode — writing into
  // the gated-canon zone, and claiming a directory that belongs to the user.
  const dev = readFileSync(new URL("./lessons-index-core.mjs", import.meta.url), "utf8");
  const prod = readFileSync(PRODUCT_CORE_URL, "utf8");

  for (const name of ["CANON_PATH", "OUT_PATH", "GEN", "REGEN"]) {
    assert.notEqual(
      constSource(prod, name, "pharn/floor/lessons-index-core.mjs"),
      constSource(dev, name, ".dev/floor/lessons-index-core.mjs"),
      `${name} must DIFFER between the surfaces — it is one of the four deliberate divergences`
    );
  }

  assert.equal(constSource(dev, "CANON_PATH", "dev"), '".dev/memory-bank/lessons-learned.md"');
  assert.equal(constSource(dev, "OUT_PATH", "dev"), '"docs/lessons-index.md"');
  assert.equal(constSource(prod, "CANON_PATH", "product"), '"memory-bank/lessons-learned.md"');
  assert.equal(constSource(prod, "OUT_PATH", "product"), '".pharn/lessons-index.md"');

  // L2 — a doc may cite only a LIVE op. The product regenerate hint must be a bare `node` invocation,
  // because a user's project has no npm scripts and may not be a Node project at all.
  assert.match(constSource(prod, "REGEN", "product"), /^"node pharn\/floor\/gen-lessons-index\.mjs \."$/);
});

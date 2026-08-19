// .claude/hooks/writes-scope-release.test.cjs — the writes-scope RELEASE-STEP corpus invariant.
//
// ONE axis of change: "does every command that SETS a writes-scope also declare the release step, in a
// position that actually releases?" It deliberately lives in its OWN file rather than inside
// set-writes-scope.test.cjs, which exists to test the SETTER's behavior — a corpus invariant over
// `.claude/commands/**` is a different reason to change, and bundling the two gave that file two.
// The dedicated-file precedent for a corpus-wide invariant is .dev/floor/entry-point-guard.test.mjs.
//
// WHY THIS FILE EXISTS AT ALL (the escalation, not a preference). The release step is a DISCIPLINE
// remedy replicated across every setter-invoking command — the largest such surface in this repo.
// `.dev/memory-bank/lessons-learned.md` L20 records that a promoted lesson whose only remedy is
// discipline WILL recur, and that the remedy is to convert it into a deterministic check rather than a
// louder reminder. This is that conversion: set membership over the real command corpus
// (pharn/ARCHITECTURE.md §2 primitive #3 — no new floor primitive).
//
// HONEST BOUND (P0), and it is the whole reason to read this comment before trusting a green:
// these tests prove the pinned line is PRESENT and ORDERED LAST among a command's setter invocations.
// They do NOT prove any run EXECUTED it — releasing is a Bash call, outside the PreToolUse gate
// entirely (L19). This is the same declaration-vs-application split check-plan-lessons.mjs already
// labels advisory. The FLOOR guarantee belongs to the READER: absence of a scope file =
// enforce-writes-scope.cjs's fail-closed DEFAULT_SAFE_SET. Never read a green here as "runs clean up".

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { join } = require("node:path");

const COMMANDS_DIR = join(__dirname, "..", "commands");

// PINNED LITERAL matchers, not a prose description of "an anchored invocation" (L22: a command or a
// comment that DESCRIBES a technique instead of prescribing one accumulates wrong implementations).
// Anchored to line start so a prose mention of the script name never counts as an invocation:
// pharn-build.md mentions `set-writes-scope.cjs` 8 times but invokes it twice.
const SET_LINE = /^[ \t]*node \.claude\/hooks\/set-writes-scope\.cjs --from-(plan|frontmatter)\b/;
const CLEAR_LINE = /^[ \t]*node \.claude\/hooks\/set-writes-scope\.cjs --clear[ \t]*$/;

function commandFiles() {
  return fs
    .readdirSync(COMMANDS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

function linesOf(f) {
  return fs.readFileSync(join(COMMANDS_DIR, f), "utf8").split(/\r?\n/);
}

test("✧ every command that SETS a writes-scope also declares the `--clear` release step", () => {
  const offenders = [];
  for (const f of commandFiles()) {
    const lines = linesOf(f);
    if (!lines.some((l) => SET_LINE.test(l))) continue; // never invokes the setter -> owes no release
    if (!lines.some((l) => CLEAR_LINE.test(l))) offenders.push(f);
  }
  assert.deepEqual(offenders, [], `these commands set a writes-scope but never release it: ${offenders.join(", ")}`);
});

test("✧ the `--clear` step comes AFTER every set invocation in the same command (placement, not mere presence)", () => {
  // Presence alone would go GREEN on a `--clear` sitting in an unrelated example block ABOVE the step
  // that sets the scope — and placement is LOAD-BEARING, not cosmetic: /pharn-memory-promote and
  // /pharn-dev-memory-promote write to canon AFTER their human accept/deny gate, so a release line
  // above that write would clear the very scope the gated write depends on and the write would be
  // DENIED. A test that only checked presence would certify exactly the arrangement that breaks them.
  const offenders = [];
  for (const f of commandFiles()) {
    const lines = linesOf(f);
    const lastSet = lines.reduce((acc, l, i) => (SET_LINE.test(l) ? i : acc), -1);
    if (lastSet === -1) continue;
    const lastClear = lines.reduce((acc, l, i) => (CLEAR_LINE.test(l) ? i : acc), -1);
    if (lastClear < lastSet) offenders.push(`${f} (last set @${lastSet + 1}, clear @${lastClear + 1})`);
  }
  assert.deepEqual(offenders, [], `the release step must follow every set: ${offenders.join("; ")}`);
});

test("✧ the corpus actually exercises this rule — the setter-invoking command set is non-empty", () => {
  // Without this, BOTH tests above pass VACUOUSLY if the anchors ever stop matching (e.g. the pinned
  // command line is reworded, or the commands move). A rule that silently matches nothing is the
  // failure mode L25 names: a checker certifying by staying silent, which is the exact inverse of what
  // a floor check exists to do.
  const setters = commandFiles().filter((f) => linesOf(f).some((l) => SET_LINE.test(l)));
  assert.ok(setters.length >= 15, `expected the setter-invoking corpus to be non-trivial, got ${setters.length}`);
});

test("✧ the release line is BYTE-IDENTICAL everywhere — one spelling, so there is nothing left to choose", () => {
  // L22's remedy is the REMOVAL OF THE CHOICE, not a warning. If two spellings ever coexist, the
  // pinned-line discipline has already failed even while both still match CLEAR_LINE.
  const spellings = new Set();
  for (const f of commandFiles()) {
    for (const l of linesOf(f)) if (CLEAR_LINE.test(l)) spellings.add(l);
  }
  assert.equal(spellings.size, 1, `expected exactly one release-line spelling, got: ${[...spellings].join(" | ")}`);
  assert.equal([...spellings][0], "node .claude/hooks/set-writes-scope.cjs --clear");
});

test("✧ a command that never sets a scope is NOT required to release one (the rule is conditional)", () => {
  // Guards the rule's own shape: making it unconditional would convert two innocent commands
  // (pharn-review.md, pharn-dev-eval.md — neither invokes the setter) into guaranteed failures. L3: a
  // declaration re-audit must not turn a previously-harmless value into a block.
  const nonSetters = commandFiles().filter((f) => !linesOf(f).some((l) => SET_LINE.test(l)));
  assert.ok(nonSetters.length > 0, "expected at least one non-setter command to exist as the control case");
  for (const f of nonSetters) {
    assert.ok(!linesOf(f).some((l) => CLEAR_LINE.test(l)), `${f} sets no scope, so it should not declare a release`);
  }
});

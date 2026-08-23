// .dev/floor/command-hygiene.test.mjs — the guard that keeps `lessons-learned.md` L19 closed.
//
// WHY IT LIVES HERE, with no paired checker (GRILL F4). Every other `*.test.mjs` under `.dev/floor/`
// tests a sibling `.mjs` checker. This one tests COMMAND PROSE instead, because the thing it guards is a
// shell invocation embedded in markdown — there is no checker to pair with, and inventing one for a
// single regex would be the speculative addition P7 forbids. It sits here because `.dev/floor/` is where
// the repo's deterministic apparatus lives, and it runs under the same `npm test` glob as everything else.
//
// WHAT IT GUARDS (L19). fix #7 gates `Write|Edit|MultiEdit` only, so a tool a stage invokes through Bash
// writes wherever it likes. `/pharn-dev-build`'s Step 2b used to prescribe `npm run format` — which is
// `prettier --write .`, the WHOLE REPO — while its own prose said "the just-written files". It silently
// reformatted files no plan had declared. This asserts no stage command re-acquires that habit.
//
// ── Honest scope (P0) — what this does and does NOT buy ──────────────────────────────────────────────
// FLOOR (what a green run means): none of the KNOWN repo-wide write invocations appears as a prescribed
//   command in `.claude/commands/*.md`.
// NOT guaranteed: that no repo-wide write can happen. This pins a VOCABULARY, not a behavior — a novel
//   spelling (a new npm script, a shell alias, a different tool) passes untouched. It is a negative
//   assertion over known-bad strings, never a proof of absence, and it does NOT close L19's class: any
//   Bash-invoked tool still escapes the writes-scope entirely. Removing one instance is not closing a door.
//
// Non-LLM, stdlib-only.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const COMMANDS_DIR = new URL("../../.claude/commands/", import.meta.url).pathname;

// A region a command may mark to quote a rejected form for the historical record without tripping this
// guard. Same mechanism as the `TYPE-ENUM:BEGIN/END` block in pharn-dev-memory-promote.md — the house
// pattern for "a doc must quote a value a checker also validates".
const SKIP_RE = /<!--\s*COMMAND-HYGIENE:SKIP-BEGIN[\s\S]*?COMMAND-HYGIENE:SKIP-END\s*-->/g;

/**
 * Forbidden invocations. Each is checked PER LINE, and a line containing `xargs` is exempt — because the
 * correct scoped form ends in the same token as the incorrect bare one:
 *     WRONG: npx markdownlint-cli2 --fix                    (no paths -> config globs -> whole repo)
 *     RIGHT: … | xargs npx markdownlint-cli2 --fix          (paths arrive on argv from stdin)
 * A regex that cannot tell those apart would forbid the very form this repo standardized on.
 */
const FORBIDDEN = [
  {
    // `npm run format` — but NOT `npm run format:check`, which is a read-only gate every stage may use.
    re: /\bnpm run format(?![:\w])/,
    why: "`npm run format` is `prettier --write .` — the whole repo. Format only the paths the stage wrote.",
  },
  {
    // prettier pointed at the repo root, or with no path at all.
    re: /\bprettier\b[^\n]*--write(?:\s+\.)?\s*$/,
    why: "a repo-wide `prettier --write .` (or `--write` with no path) rewrites files no plan declared.",
  },
  {
    // markdownlint-cli2 --fix with no paths: falls back to its config globs = the whole repo.
    re: /\bmarkdownlint-cli2\b[^\n]*--fix\s*$/,
    why: "a bare `markdownlint-cli2 --fix` lints and FIXES every file its config globs match.",
  },
];

function commandFiles() {
  return readdirSync(COMMANDS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

test("✧ L19: no stage command prescribes a repo-wide formatter/linter WRITE", () => {
  const offenders = [];
  for (const file of commandFiles()) {
    const text = readFileSync(join(COMMANDS_DIR, file), "utf8").replace(SKIP_RE, "");
    text.split(/\r?\n/).forEach((line, i) => {
      if (/\bxargs\b/.test(line)) return; // the scoped form: paths arrive on argv
      for (const { re, why } of FORBIDDEN) {
        if (re.test(line)) offenders.push(`${file}:${i + 1} — ${why}\n      ${line.trim()}`);
      }
    });
  }
  assert.deepEqual(offenders, [], `repo-wide formatter write(s) prescribed in command prose:\n    ${offenders.join("\n    ")}`);
});

test("✧ the guard actually DISCRIMINATES — it flags the rejected forms and passes the scoped ones", () => {
  // L4: an authored assertion passes by construction. Pin the matcher's behavior directly, so a future
  // loosening of the regexes fails here rather than silently permitting the defect.
  const flags = (line) => !/\bxargs\b/.test(line) && FORBIDDEN.some(({ re }) => re.test(line));

  // REJECTED — each is the real historical or plausible form.
  assert.ok(flags("- Run the project formatter — `npm run format` (prettier `--write`)"), "npm run format must be flagged");
  assert.ok(flags("npx prettier --write ."), "repo-wide prettier must be flagged");
  assert.ok(flags("npx markdownlint-cli2 --fix"), "bare markdownlint-cli2 --fix must be flagged");

  // ACCEPTED — the forms this repo standardized on.
  assert.ok(!flags("npm run format:check"), "the read-only gate must NOT be flagged");
  assert.ok(!flags("npx prettier --ignore-unknown --write .dev/features/<name>/VERIFY.md"), "a scoped path must not be flagged");
  assert.ok(!flags("npx markdownlint-cli2 --fix .dev/features/<name>/VERIFY.md"), "a scoped path must not be flagged");
  assert.ok(!flags('  node -p "…" | xargs npx prettier --ignore-unknown --write'), "the xargs form must not be flagged");
  assert.ok(!flags('  [ -n "$MD" ] && printf \'%s\\n\' "$MD" | xargs npx markdownlint-cli2 --fix'), "the xargs form must not be flagged");
});

test("✧ the SKIP region is honored, and only inside its markers", () => {
  const marked = `before\n<!-- COMMAND-HYGIENE:SKIP-BEGIN -->\nnpm run format\n<!-- COMMAND-HYGIENE:SKIP-END -->\nafter`;
  assert.ok(!/\bnpm run format(?![:\w])/.test(marked.replace(SKIP_RE, "")), "a quoted form inside the markers must be skipped");
  const unmarked = `before\nnpm run format\nafter`;
  assert.ok(/\bnpm run format(?![:\w])/.test(unmarked.replace(SKIP_RE, "")), "the same string outside the markers must still be caught");
});

// ── Step 2b's gate set: the ENUMERATION is the deliverable (L29) ─────────────────────────────────────
//
// L12 created `/pharn-dev-build` Step 2b to make an increment's own style conformance a BUILD step.
// The step named three tools and RAN two, leaving `eslint` as a prose line asking the agent to confirm
// `npm run lint` was clean — and the asked-for one is the one that got skipped: a `no-useless-assignment`
// in freshly-built code reached `/pharn-dev-verify` as a red `lint` gate one stage later
// (`.dev/features/validate-bad-target/VERIFY.md`). L20 says a discipline-only remedy's second occurrence
// earns a check; L29 says what that check must RANGE OVER — the set, materialized once, with the rules
// iterating it, so a fourth tool added later inherits every rule instead of needing its own assertion.
//
// Honest scope, and it is narrow: this pins that the command's Step 2b block INVOKES each member. It is
// a VOCABULARY assertion like the FORBIDDEN rules above — it cannot prove a run executed the step (Step
// 2b is ADVISORY orchestration, outside the PreToolUse gate), and a mistyped flag would satisfy it.
const STEP_2B_GATES = [
  { tool: "prettier", re: /\|\s*xargs\s+npx\s+prettier\b/ },
  { tool: "markdownlint-cli2", re: /\|\s*xargs\s+npx\s+markdownlint-cli2\b/ },
  { tool: "eslint", re: /\|\s*xargs\s+npx\s+eslint\b/ },
];

function step2bBlock() {
  const body = readFileSync(join(COMMANDS_DIR, "pharn-dev-build.md"), "utf8").replace(SKIP_RE, "");
  const start = body.indexOf("SCOPE=.pharn/writes-scope.json");
  assert.notEqual(start, -1, "Step 2b's scope-reading block must still exist in pharn-dev-build.md");
  const end = body.indexOf("```", start);
  assert.notEqual(end, -1, "Step 2b's fenced block must be closed");
  return body.slice(start, end);
}

for (const gate of STEP_2B_GATES) {
  test(`✧ Step 2b RUNS ${gate.tool} over the scoped paths, rather than naming it in prose`, () => {
    assert.match(step2bBlock(), gate.re, `Step 2b must invoke ${gate.tool} on the paths it parsed from .pharn/writes-scope.json`);
  });

  // The other half, and the load-bearing one: an invocation with NO paths falls back to the tool's own
  // whole-repo default. Measured for eslint (~1.1s bare vs ~1.1s for `eslint .` vs ~0.3s for one file),
  // and already recorded for markdownlint-cli2 in the block's own comment.
  //
  // Shell COMMENT lines are stripped first: the block deliberately discusses the path-less form in
  // order to explain the guard, exactly as the command file uses a SKIP region to quote a rejected
  // form. An assertion that cannot tell a prescription from its own rationale would forbid the
  // explanation (the same distinction FORBIDDEN's `xargs`-exemption makes above).
  test(`✧ Step 2b's ${gate.tool} invocation is never path-less`, () => {
    const invocations = step2bBlock()
      .split("\n")
      .filter((l) => !l.trimStart().startsWith("#"))
      .filter((l) => new RegExp(`npx\\s+${gate.tool}\\b`).test(l));
    assert.ok(invocations.length > 0, `expected a prescribed ${gate.tool} invocation in Step 2b`);
    for (const line of invocations) {
      assert.match(line, /\bxargs\b/, `a path-less ${gate.tool} falls back to the whole repo: ${line.trim()}`);
    }
  });
}

// The non-empty guard is what makes the path-less case unreachable on an empty list under GNU xargs,
// so it is asserted for every SUBSET gate — the ones that filter the scope before piping it.
for (const gate of STEP_2B_GATES.filter((g) => g.tool !== "prettier")) {
  test(`✧ Step 2b guards its ${gate.tool} subset against the empty list (L16)`, () => {
    assert.match(
      step2bBlock(),
      /\[\s-n\s+"\$\w+"\s\]\s+&&/,
      `an empty subset must not reach ${gate.tool}: GNU xargs runs the command once with NO arguments`
    );
  });
}

// ── The lessons-index wiring set: the same L29 shape, one domain over ────────────────────────────────
//
// The lessons index has TWO wiring sites per surface: a plan stage must CHECK the index is fresh before
// selecting from it, and a promote stage must REGENERATE it after landing an entry. That is four members
// across the dev/product pair, and the pair is exactly where this went wrong: the PRODUCT half shipped
// both invocations while the DEV half shipped neither, leaving `/pharn-dev-plan` with prose that NAMED
// staleness ("if the index is stale, fall back") and invoked nothing that could detect it — L30's
// runs-some/asks-for-the-rest shape — and `/pharn-dev-memory-promote` with no regeneration at all, so a
// same-session plan after a promotion read an index missing the just-promoted lesson.
//
// L29 is why this is an ARRAY and not four hand-written assertions: a rule quantified over a set must
// materialize the set once and iterate it, or it gets applied to whichever member was in front of the
// author — which is precisely how the product half came to be wired alone. A fifth site added later
// inherits every rule below for free.
//
// Each regex is FLOOR-SPECIFIC on purpose (`.dev/floor/…` vs `pharn/floor/…`), because these are a
// deliberate copy-pair: pasting the product path into a dev command would regenerate the USER's
// gitignored cache instead of this repo's committed index, and every other gate would stay green.
//
// Honest scope, and it is the same narrow kind as FORBIDDEN and STEP_2B_GATES above: this pins that the
// command PROSE contains the invocation. It CANNOT prove a run executed it, that the branch is obeyed,
// or that the flags are right — "the wiring is pinned" NEVER means "the sweep was fresh" (P0). It lives
// under `.dev/` and not `pharn/floor/` because a user's install ships `pharn/floor/` WITHOUT `.dev/`,
// so the dependency may only point `.dev/` -> product, never the reverse.
const LESSONS_SWEEP_WIRING = [
  { file: "pharn-plan.md", role: "checks the index before selecting", re: /pharn\/floor\/check-lessons-index\.mjs\b[^\n]*--verdict/ },
  { file: "pharn-dev-plan.md", role: "checks the index before selecting", re: /node\s+\.dev\/floor\/check-lessons-index\.mjs/ },
  { file: "pharn-memory-promote.md", role: "regenerates the index after a promotion", re: /node\s+pharn\/floor\/gen-lessons-index\.mjs/ },
  {
    file: "pharn-dev-memory-promote.md",
    role: "regenerates the index after a promotion",
    re: /node\s+\.dev\/floor\/gen-lessons-index\.mjs/,
  },
];

function commandBody(file) {
  return readFileSync(join(COMMANDS_DIR, file), "utf8").replace(SKIP_RE, "");
}

for (const site of LESSONS_SWEEP_WIRING) {
  test(`✧ ${site.file} ${site.role} — the invocation is present, not merely described`, () => {
    assert.match(commandBody(site.file), site.re, `${site.file} must INVOKE its lessons-index tool, not name the condition in prose`);
  });

  // L4: an authored assertion passes by construction. Pin the matcher's DISCRIMINATION directly — strip
  // the invocation out of the real body and require the regex to stop matching — so a future loosening
  // (e.g. dropping `node\s+`, or widening the floor path) fails here instead of silently certifying a
  // command that lost its wiring.
  test(`✧ the ${site.file} rule DISCRIMINATES — it fails on a body with the invocation removed`, () => {
    const stripped = commandBody(site.file).replace(new RegExp(site.re.source, "g"), "<<removed>>");
    assert.doesNotMatch(stripped, site.re, `the ${site.file} matcher must not still pass once the invocation is gone`);
  });
}

test("✧ the lessons-index wiring set is non-vacuous — every named command exists on disk", () => {
  // L25's failure mode is a checker that certifies by STAYING SILENT. Without this, renaming a command
  // would make its rules above throw ENOENT rather than pass — but adding a member that never existed,
  // or a future refactor to a forgiving reader, would go quietly green over an empty domain.
  const present = new Set(commandFiles());
  const missing = LESSONS_SWEEP_WIRING.filter((s) => !present.has(s.file)).map((s) => s.file);
  assert.deepEqual(missing, [], `these wiring-set members name no live command file: ${missing.join(", ")}`);
  assert.equal(LESSONS_SWEEP_WIRING.length, 4, "expected both surfaces x both sites (dev/product x check/regenerate)");
});

// ── The `applied_lessons` re-verification wiring (check-plan-lessons.mjs) ─────────────────────────────
//
// A SEPARATE set from LESSONS_SWEEP_WIRING above, deliberately. That one ranges over the lessons INDEX
// tooling (check-lessons-index / gen-lessons-index — a derived address book); this one ranges over
// check-plan-lessons.mjs, a different checker answering a different question (is the PLAN's declaration
// well-formed and resolvable?). Merging them would put two obligations behind one `length` assertion,
// which is the failure L29 names, not a tidier version of it.
//
// WHY the set spans SIX commands and not the two that re-verify. The obligation is "every command whose
// procedure branches on this checker INVOKES it", and that is what must be enumerated — not the subset
// that happens to be interesting. Two PLAN stages self-check the field they just wrote; two GRILL stages
// re-verify a field they did NOT author (which is what makes the declaration stop being self-attested);
// two SHIP orchestrators read the exit code as a proceed/stop input. A seventh site added later inherits
// every rule below for free.
//
// The LESSONS-FILE ARGUMENT is the discriminating axis here, NOT the checker path. Unlike the index
// pair above — where `.dev/floor/…` vs `pharn/floor/…` separates the copies — check-plan-lessons.mjs is
// a SINGLE checker under pharn/floor/ that BOTH surfaces invoke. What must not cross the boundary is the
// CANON it is pointed at: a dev command pointed at the user's `memory-bank/` (or a product command at
// this repo's `.dev/memory-bank/`) would check the wrong canon and every other gate would stay green.
// So each member pins its own full invocation, argument included.
//
// Honest scope, the same narrow kind as FORBIDDEN / STEP_2B_GATES / LESSONS_SWEEP_WIRING above: this
// pins that the command PROSE contains the invocation with the right canon argument. It CANNOT prove a
// run executed it, that the exit-code branch is obeyed, or that a RED actually stops the stage —
// "the wiring is pinned" NEVER means "the declaration was re-verified" (P0).
const CHECKER = String.raw`node\s+pharn\/floor\/check-plan-lessons\.mjs`;
const PLAN_LESSONS_WIRING = [
  // `\s+\S+\s+` is the PLAN.md argument; the trailing group is the canon this site must point at.
  {
    file: "pharn-plan.md",
    role: "self-checks the declaration it just wrote",
    re: new RegExp(`${CHECKER}\\s+\\S+\\s+memory-bank\\/lessons-learned\\.md`),
  },
  {
    file: "pharn-dev-plan.md",
    role: "self-checks the declaration it just wrote",
    re: new RegExp(`${CHECKER}\\s+\\S+\\s+\\.dev\\/memory-bank\\/lessons-learned\\.md`),
  },
  {
    file: "pharn-grill.md",
    role: "re-verifies a declaration it did not author",
    re: new RegExp(`${CHECKER}\\s+\\S+\\s+memory-bank\\/lessons-learned\\.md`),
  },
  {
    file: "pharn-dev-grill.md",
    role: "re-verifies a declaration it did not author",
    re: new RegExp(`${CHECKER}\\s+\\S+\\s+\\.dev\\/memory-bank\\/lessons-learned\\.md`),
  },
  {
    file: "pharn-ship.md",
    role: "reads the exit code as a proceed/stop input",
    re: new RegExp(`${CHECKER}\\s+\\S+\\s+memory-bank\\/lessons-learned\\.md`),
  },
  {
    file: "pharn-dev-ship.md",
    role: "reads the exit code as a proceed/stop input",
    re: new RegExp(`${CHECKER}\\s+\\S+\\s+\\.dev\\/memory-bank\\/lessons-learned\\.md`),
  },
];

for (const site of PLAN_LESSONS_WIRING) {
  test(`✧ ${site.file} ${site.role} — the invocation is present, not merely described`, () => {
    assert.match(
      commandBody(site.file),
      site.re,
      `${site.file} must INVOKE check-plan-lessons.mjs against its own canon, not name the condition in prose`
    );
  });

  // L4: an authored assertion passes by construction. Pin the matcher's DISCRIMINATION directly.
  test(`✧ the ${site.file} lessons-reverify rule DISCRIMINATES — it fails on a body with the invocation removed`, () => {
    const stripped = commandBody(site.file).replace(new RegExp(site.re.source, "g"), "<<removed>>");
    assert.doesNotMatch(stripped, site.re, `the ${site.file} matcher must not still pass once the invocation is gone`);
  });

  // The CROSS-SURFACE guard, and it is the load-bearing half: a dev command must NOT invoke the checker
  // against the user's `memory-bank/`, and a product command must NOT reach into this repo's
  // `.dev/memory-bank/`. Asserting only presence would let a pasted line check the wrong canon silently.
  test(`✧ ${site.file} points the checker at ITS OWN canon — the other surface's path does not appear on the invocation`, () => {
    const isDev = site.file.startsWith("pharn-dev-");
    const wrong = isDev
      ? new RegExp(`${CHECKER}\\s+\\S+\\s+memory-bank\\/lessons-learned\\.md`)
      : new RegExp(`${CHECKER}\\s+\\S+\\s+\\.dev\\/memory-bank\\/lessons-learned\\.md`);
    assert.doesNotMatch(
      commandBody(site.file),
      wrong,
      `${site.file} invokes check-plan-lessons.mjs against the ${isDev ? "PRODUCT" : "DEV"} canon — the surfaces must not cross`
    );
  });
}

test("✧ the lessons-reverify wiring set is non-vacuous — every named command exists on disk", () => {
  // Without this, renaming a command would make the rules above throw ENOENT rather than pass, and a
  // member naming no live file would certify over an empty domain (L34: a per-item assertion set says
  // nothing when there are no items).
  const present = new Set(commandFiles());
  const missing = PLAN_LESSONS_WIRING.filter((s) => !present.has(s.file)).map((s) => s.file);
  assert.deepEqual(missing, [], `these wiring-set members name no live command file: ${missing.join(", ")}`);
  assert.equal(
    PLAN_LESSONS_WIRING.length,
    6,
    "expected both surfaces x three roles (dev/product x plan-selfcheck/grill-reverify/ship-read)"
  );
});

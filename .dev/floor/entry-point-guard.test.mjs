// .dev/floor/entry-point-guard.test.mjs — the family guard for every floor CLI's entry-point test.
//
// WHY IT LIVES HERE, and why it has no paired checker. It sweeps BOTH floors, so it may only live on
// the `.dev/` side: a user's install ships `pharn/floor/` WITHOUT `.dev/`, so the dependency may point
// `.dev/` → `pharn/` and never the reverse (the same reason `.dev/floor/lessons-index-core.test.mjs`
// pins the two lessons-index copies from here). Like `.dev/floor/command-hygiene.test.mjs` it tests a
// VOCABULARY across a directory walk rather than one sibling checker, so there is no `.mjs` to pair
// with, and inventing one for a single membership test would be the speculative addition P7 forbids.
//
// WHAT IT GUARDS. Ten floor CLIs shipped this guard:
//
//     if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) main();
//
// `import.meta.url` is PERCENT-ENCODED; `process.argv[1]` is raw. The two therefore never match when
// the script's path holds a space or a non-ASCII character, `main()` never runs, and the process exits
// **0 having checked nothing** — a floor checker that silently certifies. Reproduced live before the
// repair: `check-lessons-index.mjs --verdict` from a spaced directory printed NOTHING at exit 0, while
// `/pharn-plan` branches on that token's membership in a closed set. The correct test is:
//
//     if (import.meta.main) main();           // Node >= 24.2
//
// Measured on a probe module invoked four ways (this is why `pathToFileURL(argv[1]).href` is ALSO
// banned as a repair, not merely the raw template):
//
//   invocation        | `file://${argv[1]}` | pathToFileURL(argv[1]).href | import.meta.main
//   plain path        | runs                | runs                        | runs
//   path with a space | SILENT NO-OP        | runs                        | runs
//   non-ASCII path    | SILENT NO-OP        | runs                        | runs
//   through a symlink | SILENT NO-OP        | SILENT NO-OP                | runs
//
// The command line is PINNED here rather than described (L22): the idiom was previously prescribed only
// by example, and ten files copied it wrong.
//
// ── Honest scope (P0) — what a green run does and does NOT buy ───────────────────────────────────────
// FLOOR (what green means): (1) no executable line under either floor carries one of the two BANNED
//   spellings; (2) every non-test `.mjs` under either floor that HAS an entry guard spells it
//   `import.meta.main`; (3) THREE scripts — `check-ship-briefing.mjs`, `check-lessons-index.mjs`,
//   `render-cost-record.mjs` — produce byte-identical output and an identical exit code across FOUR path
//   shapes: normal, spaced, non-ASCII, and symlinked. (Three probes over four shapes; the fourth test in
//   this file is the import control, which is vacuous under `import.meta.main` and is NOT coverage.)
// NOT guaranteed, and the denominator is the reason: MOST floor scripts have NO entry guard at all —
//   they call `main()` unconditionally, so checks (1) and (2) are VACUOUSLY green over them. GUARDED_MIN
//   below pins the guarded count against silent erosion, but this file cannot distinguish "the guard is
//   correct" from "there is no guard", and it never claims to. Check (1) is a negative assertion over
//   two KNOWN-BAD strings — a novel wrong spelling (a hand-rolled `decodeURI`, an `endsWith()` suffix
//   match) passes untouched; it pins a vocabulary, not a behavior. The probes cover four path shapes over
//   three scripts, not all path shapes over all scripts. And `executableSource()` can MISS as well as
//   over-match — see its own docstring, which names the direction rather than claiming a one-way bias.
//   "The sweep is green" NEVER means "every entry guard in the repo is correct".
//
// Non-LLM, stdlib-only.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, cpSync, rmSync, symlinkSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");
const PRODUCT_FLOOR = join(REPO, "pharn", "floor");
const DEV_FLOOR = join(REPO, ".dev", "floor");

/** The one correct entry-point test. Pinned as a literal (L22) — never described in prose alone. */
const CORRECT_GUARD = "import.meta.main";

/**
 * The banned spellings, as literal substrings. BOTH are banned deliberately: the raw template is the
 * shipped defect, and `pathToFileURL(...).href` is the near-miss repair that still no-ops through a
 * symlink, so admitting it would leave the repo with two spellings of one guard — the L22 shape that
 * let this defect reach ten files.
 */
const BANNED = ["file://${process.argv[1]}", "pathToFileURL(process.argv[1]).href"];

/**
 * Lower bound on how many non-test floor scripts carry an entry guard, measured live at the repair
 * (5 under pharn/floor, 6 under .dev/floor). Asserted as a FLOOR, not equality: adding a guarded CLI
 * must not fail the suite, but silently dropping guards until the sweep is vacuous must.
 */
const GUARDED_MIN = { product: 5, dev: 6 };

/**
 * Strip whole-line comments so a file may DISCUSS a banned spelling without tripping the sweep —
 * `.dev/floor/hash-doc.mjs` documents both wrong forms in its own header and must stay green.
 *
 * BOUND, stated in BOTH directions — this is a heuristic over the repo's comment style, not a JS parse,
 * and it is not one-way safe:
 *   • OVER-detection (false RED, loud and harmless): a banned spelling inside a multi-line string
 *     literal, or after code on a `doThing(); // …` line, is swept. Nobody has written either.
 *   • UNDER-detection (false GREEN, the dangerous direction): a line is DROPPED whenever its trimmed
 *     form opens with `//`, `*`, or `/*`. An executable statement beginning with `*` — a continuation
 *     line of a multiplication, say — would therefore be skipped. Prettier does not produce that shape
 *     in this repo (verified: no such line exists under either floor), which is why the rule is
 *     acceptable, NOT because the rule cannot miss. Treat "green" accordingly.
 * The `*` and `/*` cases exist so a file may DISCUSS a banned spelling in its own header:
 * `.dev/floor/hash-doc.mjs` does exactly that, on purpose.
 */
function executableSource(text) {
  return text
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      return !t.startsWith("//") && !t.startsWith("*") && !t.startsWith("/*");
    })
    .join("\n");
}

/** Non-test `.mjs` files directly under `dir`, sorted so failures are filesystem-order-independent. */
function floorScripts(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".mjs") && !e.name.endsWith(".test.mjs"))
    .map((e) => e.name)
    .sort();
}

/** Spawn a script; never throws. Returns {code, stdout, stderr}. */
function run(script, args, opts = {}) {
  const r = spawnSync(process.execPath, [script, ...args], { encoding: "utf8", ...opts });
  return { code: r.status, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

// ── The sweep (checks 1 + 2) ──────────────────────────────────────────────────────────────────────

for (const [label, dir] of [
  ["pharn/floor", PRODUCT_FLOOR],
  [".dev/floor", DEV_FLOOR],
]) {
  test(`✧ no executable line under ${label} carries a banned entry-guard spelling`, () => {
    const offenders = [];
    for (const name of floorScripts(dir)) {
      const src = executableSource(readFileSync(join(dir, name), "utf8"));
      for (const bad of BANNED) if (src.includes(bad)) offenders.push(`${label}/${name} → ${bad}`);
    }
    assert.deepEqual(offenders, [], `banned entry-guard spelling(s) found. Use \`if (${CORRECT_GUARD}) …\`:\n  ${offenders.join("\n  ")}`);
  });

  test(`✧ every guarded script under ${label} spells its guard \`${CORRECT_GUARD}\``, () => {
    const scripts = floorScripts(dir);
    const guarded = scripts.filter((n) => executableSource(readFileSync(join(dir, n), "utf8")).includes(CORRECT_GUARD));
    const min = label === "pharn/floor" ? GUARDED_MIN.product : GUARDED_MIN.dev;

    // The denominator, asserted rather than assumed — see the honest-scope note above: the sweep is
    // vacuous over the unguarded majority, so its reach must not silently shrink.
    assert.ok(
      guarded.length >= min,
      `${label}: ${guarded.length} of ${scripts.length} script(s) carry an entry guard, below the ` +
        `pinned floor of ${min}. A guard was removed rather than repaired, or a CLI lost its guard.`
    );
  });
}

test("✧ hash-doc.mjs — the reference site — still carries the correct guard", () => {
  // It is the one file that documents WHY, and the repair left it byte-unchanged; if it ever drifts,
  // the rationale the other sites point at drifts with it.
  const src = executableSource(readFileSync(join(DEV_FLOOR, "hash-doc.mjs"), "utf8"));
  assert.ok(src.includes(CORRECT_GUARD), `.dev/floor/hash-doc.mjs must use \`${CORRECT_GUARD}\``);
});

test("✧ a file may DISCUSS a banned spelling in a comment without tripping the sweep", () => {
  // Driven by a SYNTHETIC fixture on purpose. An earlier draft asserted that `.dev/floor/hash-doc.mjs`
  // still CONTAINS the banned string as a precondition, which coupled a test about the stripper to the
  // exact wording of another file's comment — rewording that comment (which the very next iteration did)
  // would have RED'd this test for no reason. The live file's correctness is already covered: it is in
  // the sweep like every other script, and by the reference-site test below.
  const fixture = [
    "// a line comment mentioning `file://${process.argv[1]}`",
    " *  a jsdoc body mentioning pathToFileURL(process.argv[1]).href",
    "/* an opening block line mentioning file://${process.argv[1]} */",
    "if (import.meta.main) main();",
  ].join("\n");

  const stripped = executableSource(fixture);
  for (const bad of BANNED) {
    assert.ok(!stripped.includes(bad), `a comment form leaked into the swept source: ${bad}`);
  }
  assert.ok(stripped.includes(CORRECT_GUARD), "the executable line must SURVIVE stripping");
});

// ── The behavioral probes (check 3) ───────────────────────────────────────────────────────────────

/**
 * Copies pharn/floor/ into hostile-path fixture dirs ONCE for the probes below.
 * `mkdtempSync` gives a unique root per run — `node --test` runs files in parallel, and a fixed path
 * (the `/tmp/space dir` of the original reproduction) would let one worker's teardown delete a fixture
 * another is mid-spawn on, producing a flaky red indistinguishable from a real guard failure.
 */
const ROOT = mkdtempSync(join(tmpdir(), "pharn entry guard "));
const SPACED = join(ROOT, "with space");
const UNICODE = join(ROOT, "ünï-非ascii");
const LINKED = join(ROOT, "via-symlink");
mkdirSync(SPACED, { recursive: true });
mkdirSync(UNICODE, { recursive: true });
cpSync(PRODUCT_FLOOR, SPACED, { recursive: true });
cpSync(PRODUCT_FLOOR, UNICODE, { recursive: true });
symlinkSync(SPACED, LINKED, "dir");

test.after(() => rmSync(ROOT, { recursive: true, force: true }));

/** The four invocation shapes every probe is run through. `normal` is the control. */
const SHAPES = [
  ["normal", PRODUCT_FLOOR],
  ["spaced", SPACED],
  ["non-ASCII", UNICODE],
  ["symlinked", LINKED],
];

/** The closed token set `check-lessons-index.mjs --verdict` must print (P5 — membership, never prose). */
const VERDICT_TOKENS = new Set(["NO_CANON", "COLD", "GREEN", "STALE", "ENUM_ERROR"]);

test("✧ check-ship-briefing.mjs REDs identically from every path shape", () => {
  const control = run(join(PRODUCT_FLOOR, "check-ship-briefing.mjs"), ["/nonexistent/BRIEFING.md"]);
  assert.equal(control.code, 1, "precondition: the control invocation must RED");
  assert.match(control.stdout, /^RED — /, "precondition: the control must print a RED line");

  for (const [label, dir] of SHAPES) {
    const got = run(join(dir, "check-ship-briefing.mjs"), ["/nonexistent/BRIEFING.md"]);
    assert.equal(got.code, control.code, `${label}: exit ${got.code} != control ${control.code} — main() did not run`);
    assert.equal(got.stdout, control.stdout, `${label}: stdout differs from the control invocation`);
  }
});

test("✧ check-lessons-index.mjs --verdict prints a real token from every path shape", () => {
  const control = run(join(PRODUCT_FLOOR, "check-lessons-index.mjs"), [REPO, "--verdict"]);
  const token = control.stdout.trim();
  assert.ok(VERDICT_TOKENS.has(token), `precondition: control printed ${JSON.stringify(token)}, not a member`);

  for (const [label, dir] of SHAPES) {
    const got = run(join(dir, "check-lessons-index.mjs"), [REPO, "--verdict"]);
    // The defect's sharpest form: an empty stdout at exit 0, which is a member of NO token set.
    assert.ok(VERDICT_TOKENS.has(got.stdout.trim()), `${label}: printed ${JSON.stringify(got.stdout)} — not a token`);
    assert.equal(got.stdout, control.stdout, `${label}: token differs from the control invocation`);
    assert.equal(got.code, control.code, `${label}: exit ${got.code} != control ${control.code}`);
  }
});

test("✧ render-cost-record.mjs still receives its argv slice and propagates its exit code", () => {
  // The one-liner site — `process.exit(main(process.argv.slice(2)))` — is the only shape among the ten
  // that passes arguments and forwards a return value, so a careless guard swap can drop either half
  // while every other probe here stays green. The exact message pins the slice: without it `main()`
  // would report the node binary path as the unknown argument instead.
  const control = run(join(PRODUCT_FLOOR, "render-cost-record.mjs"), ["--nope"]);
  assert.equal(control.code, 2, "precondition: an unknown argument must exit 2, not 0 or 1");
  assert.equal(control.stderr, "render-cost-record: unknown argument --nope\n");

  for (const [label, dir] of SHAPES) {
    const got = run(join(dir, "render-cost-record.mjs"), ["--nope"]);
    assert.equal(got.code, 2, `${label}: exit ${got.code} — the return value stopped propagating`);
    assert.equal(got.stderr, control.stderr, `${label}: stderr differs — the argv slice was dropped`);
  }
});

test("importing a guarded script does not execute its main()", () => {
  // Kept as a regression net for the guard's OTHER job, but counted honestly: under `import.meta.main`
  // this holds by the runtime's own definition, so it cannot fail. It is not coverage of the repair.
  const spec = JSON.stringify(pathToFileURL(join(PRODUCT_FLOOR, "check-ship-briefing.mjs")).href);
  const r = spawnSync(process.execPath, ["--input-type=module", "-e", `await import(${spec}); console.log("OK");`], {
    encoding: "utf8",
  });
  assert.equal(r.status, 0, `importing must not exit the process: ${r.stderr}`);
  assert.equal(r.stdout.trim(), "OK");
});

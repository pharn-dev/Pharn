// .dev/floor/check-version-badge.test.mjs — apparatus tests for the README version-badge checker.
//
// L4: an authored fixture passes by construction. The ✧ cases are therefore MUTANTS — each asserts the
// checker FAILS when the thing it guards is broken, not merely that it passes when everything is fine.
// The drift case is the whole point of the checker and is asserted directly.
//
// Fixtures locate the badge BY PATTERN, never by line number, so they survive fixture line shifts —
// the same discipline the checker itself follows.

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { checkVersionBadge, findBadgeValues, isCleanScalar, BADGE_RE, VERSION_RE } from "./check-version-badge.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHECKER = join(HERE, "check-version-badge.mjs");
const REPO = join(HERE, "..", "..");

/** Run the checker as a child process; never throws. Returns {code, out}. */
function run(target) {
  try {
    const out = execFileSync(process.execPath, [CHECKER, target], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status, out: `${e.stdout ?? ""}${e.stderr ?? ""}` };
  }
}

/**
 * Build a throwaway repo. `badge` is the badge VALUE (null = omit the badge line entirely).
 * The badge is embedded in a realistic multi-badge block so a fixture never accidentally tests a
 * one-line README the real one does not resemble.
 */
function fixture({ version = "2.5.1", badge = "2.5.1", extra = "", omitVersionFile = false, omitReadme = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "pharn-badge-"));
  if (!omitVersionFile) writeFileSync(join(dir, "SKILLS_VERSION"), version);
  if (!omitReadme) {
    const badgeLine = badge === null ? "" : `[![pharn](https://img.shields.io/badge/pharn-${badge}-blue)](./CHANGELOG.md)\n`;
    writeFileSync(
      join(dir, "README.md"),
      `# PHARN\n\nSome prose about the project.\n\n${badgeLine}` +
        `[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-green)](./LICENSE)\n` +
        `[![CI](https://github.com/x/y/actions/workflows/ci.yml/badge.svg)](https://github.com/x/y)\n${extra}\n\nMore prose.\n`
    );
  }
  return dir;
}

function withFixture(opts, fn) {
  const dir = fixture(opts);
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ── The happy path ────────────────────────────────────────────────────────────────────────────────

test("GREEN when the badge value equals SKILLS_VERSION", () => {
  withFixture({ version: "2.5.1", badge: "2.5.1" }, (dir) => {
    const { code, out } = run(dir);
    assert.equal(code, 0, out);
    assert.match(out, /VERSION-BADGE: GREEN/);
    assert.match(out, /2\.5\.1/);
  });
});

test("GREEN survives a trailing newline in SKILLS_VERSION (the normal committed shape)", () => {
  withFixture({ version: "2.5.1\n", badge: "2.5.1" }, (dir) => {
    assert.equal(run(dir).code, 0);
  });
});

// ── ✧ THE MUTANT THIS CHECKER EXISTS FOR ──────────────────────────────────────────────────────────

test("✧ DRIFT: badge 1.0.0 vs SKILLS_VERSION 2.5.1 → exit 1 (the exact defect, reproduced)", () => {
  withFixture({ version: "2.5.1", badge: "1.0.0" }, (dir) => {
    const { code, out } = run(dir);
    assert.equal(code, 1, "a drifted badge MUST be RED");
    assert.match(out, /\[DRIFT\]/);
    assert.match(out, /badge reads "1\.0\.0"/);
    assert.match(out, /SKILLS_VERSION is "2\.5\.1"/);
  });
});

test("✧ DRIFT is detected on ANY disagreement, not just the historical pair", () => {
  withFixture({ version: "3.0.0", badge: "2.9.9" }, (dir) => {
    assert.equal(run(dir).code, 1);
  });
});

test("✧ the FIX message names SKILLS_VERSION as the source, not the badge", () => {
  withFixture({ version: "2.5.1", badge: "1.0.0" }, (dir) => {
    assert.match(run(dir).out, /SKILLS_VERSION is the single source/);
  });
});

// ── ✧ Clean failures — a RED, never a crash ───────────────────────────────────────────────────────

test("✧ badge absent → exit 1, named, and no stack trace", () => {
  withFixture({ badge: null }, (dir) => {
    const { code, out } = run(dir);
    assert.equal(code, 1);
    assert.match(out, /\[NO_BADGE\]/);
    assert.doesNotMatch(out, /at .*\.mjs:\d+/, "a missing badge must not surface as a thrown stack");
  });
});

test("✧ badge URL malformed (no pharn-<x>- match) → exit 1, clean", () => {
  withFixture({ badge: null, extra: "[![pharn](https://img.shields.io/badge/pharn)](./CHANGELOG.md)\n" }, (dir) => {
    const { code, out } = run(dir);
    assert.equal(code, 1);
    assert.match(out, /\[NO_BADGE\]/);
  });
});

test("✧ TWO pharn badges → exit 1 AMBIGUOUS, never first-match-wins (L6)", () => {
  withFixture({ badge: "2.5.1", extra: "[![pharn](https://img.shields.io/badge/pharn-9.9.9-red)](./x)\n" }, (dir) => {
    const { code, out } = run(dir);
    assert.equal(code, 1, "ambiguity must be RED even when the FIRST badge is correct");
    assert.match(out, /\[AMBIGUOUS\]/);
    assert.match(out, /2\.5\.1, 9\.9\.9/);
  });
});

test("✧ README absent → exit 1 MISSING_README, clean", () => {
  withFixture({ omitReadme: true }, (dir) => {
    const { code, out } = run(dir);
    assert.equal(code, 1);
    assert.match(out, /\[MISSING_README\]/);
  });
});

test("✧ target dir does not exist → exit 1, clean", () => {
  const { code, out } = run(join(tmpdir(), "pharn-badge-does-not-exist-xyz"));
  assert.equal(code, 1);
  assert.match(out, /target dir not found/);
});

// ── ✧ SKILLS_VERSION guard (L14: the clean-scalar guard PRECEDES the shape regex) ──────────────────

test("✧ SKILLS_VERSION missing → exit 1 MISSING_VERSION", () => {
  withFixture({ omitVersionFile: true }, (dir) => {
    const { code, out } = run(dir);
    assert.equal(code, 1);
    assert.match(out, /\[MISSING_VERSION\]/);
  });
});

test("✧ SKILLS_VERSION blank → exit 1 ENUM_ERROR", () => {
  withFixture({ version: "   \n" }, (dir) => {
    const { code, out } = run(dir);
    assert.equal(code, 1);
    assert.match(out, /\[ENUM_ERROR\]/);
  });
});

test("✧ SKILLS_VERSION multi-line → exit 1 ENUM_ERROR (not a silent first-line read)", () => {
  withFixture({ version: "2.5.1\n3.0.0\n", badge: "2.5.1" }, (dir) => {
    const { code, out } = run(dir);
    assert.equal(code, 1, "a two-line version file must NOT quietly match on its first line");
    assert.match(out, /\[ENUM_ERROR\]/);
  });
});

test("✧ SKILLS_VERSION bearing a control character → exit 1 ENUM_ERROR", () => {
  // The version literal below carries a LITERAL U+0001 between "2.5" and "1" — invisible in a diff, so
  // it is called out here. `.trim()` does not strip an EMBEDDED control character, which is precisely
  // why isCleanScalar is composed BEFORE the shape regex rather than replaced by it (L14).
  withFixture({ version: "2.51", badge: "2.5.1" }, (dir) => {
    assert.equal(run(dir).code, 1);
  });
});

test("✧ SKILLS_VERSION not <major>.<minor>.<patch> → exit 1 ENUM_ERROR", () => {
  withFixture({ version: "v2.5", badge: "2.5.1" }, (dir) => {
    const { code, out } = run(dir);
    assert.equal(code, 1);
    assert.match(out, /\[ENUM_ERROR\]/);
  });
});

// ── ✧ The hyphen: a REFUSAL by name, not a confusing near-equal mismatch (raised at grill) ─────────

test("✧ a pre-release SKILLS_VERSION is REFUSED by name, not reported as a lookalike mismatch", () => {
  withFixture({ version: "2.6.0-rc.1", badge: "2.6.0" }, (dir) => {
    const { code, out } = run(dir);
    assert.equal(code, 1);
    assert.match(out, /\[UNSUPPORTED\]/, "must name the encoding limit, not print 2.6.0 vs 2.6.0-rc.1");
    assert.match(out, /encodes a literal "-" as "--"/);
    assert.doesNotMatch(out, /\[DRIFT\]/);
  });
});

// ── ✧ Precedence: two simultaneous failures must not race (raised at grill) ────────────────────────

test("✧ when BOTH inputs are broken, the SKILLS_VERSION refusal wins deterministically", () => {
  withFixture({ version: "nonsense", badge: null }, (dir) => {
    const { code, out } = run(dir);
    assert.equal(code, 1);
    assert.match(out, /\[ENUM_ERROR\]/);
    assert.match(out, /SKILLS_VERSION/);
    assert.doesNotMatch(out, /\[NO_BADGE\]/, "precedence is defined: the version file is validated first");
  });
});

// ── ✧ The anchor is the BADGE URL, not any pharn- substring ───────────────────────────────────────

test("✧ a pharn-<version> string OUTSIDE a shields badge URL is not picked up", () => {
  withFixture({ badge: "2.5.1", extra: "Install with `pharn-9.9.9` or see pharn-1.2.3 elsewhere.\n" }, (dir) => {
    const { code, out } = run(dir);
    assert.equal(code, 0, `prose mentioning pharn-9.9.9 must not register as a badge: ${out}`);
  });
});

test("✧ the OTHER shields badges (license, built-for) do not collide with the pharn anchor", () => {
  const values = findBadgeValues(
    `[![License](https://img.shields.io/badge/license-Apache%202.0-green)](./LICENSE)\n` +
      `[![Built for](https://img.shields.io/badge/built%20for-Claude%20Code-555)](https://claude.com)\n`
  );
  assert.deepEqual(values, [], "only the pharn-labelled badge may match");
});

// ── ✧ Unit-level guards ───────────────────────────────────────────────────────────────────────────

test("✧ CANON DEFECT: JS `$` does NOT match before a trailing newline — lessons-learned L14 says it does", () => {
  // This test was written to assert L14's stated mechanism and FAILED, which is how the defect surfaced.
  // L14 claims: "JavaScript `$` (without the `m` flag) matches at end-of-string OR just before a single
  // trailing newline, so `/^P[0-7]$/.test('P2\n') === true`". It does not. That is Perl/Python/PCRE
  // behaviour; in JavaScript `$` without `m` matches ONLY at end of input.
  //
  // Pinned here so the correction cannot quietly regress, and so a reader of this file is not left
  // believing the canon sentence. L14's REMEDY (compose the guard before the shape regex, never
  // replace it) is sound and this checker follows it — only its reason is wrong. Canon itself is
  // edited only through a gated promotion, so this test reports rather than fixes.
  assert.equal(/^P[0-7]$/.test("P2\n"), false, "L14's own example: JS `$` does NOT admit a trailing newline");
  assert.equal(/^P[0-7]$/m.test("P2\n"), true, "it takes the `m` flag to get the behaviour L14 describes");
  assert.equal(VERSION_RE.test("2.5.1\n"), false, "so the shape regex alone already rejects a trailing newline");
});

test("✧ isCleanScalar's real contribution is a LENGTH BOUND the shape regex does not have", () => {
  // The honest reason the guard is composed first: VERSION_RE is unbounded, so shape alone admits a
  // pathological input. This is the half that is genuinely load-bearing.
  assert.equal(VERSION_RE.test(`${"9".repeat(5000)}.0.0`), true, "the shape regex admits an unbounded run");
  assert.equal(isCleanScalar(`${"9".repeat(5000)}.0.0`), false, "the guard is what bounds it");
  assert.equal(isCleanScalar("2.5.1"), true);
  assert.equal(isCleanScalar(""), false);
  assert.equal(isCleanScalar("x".repeat(65)), false);
  assert.equal(isCleanScalar(null), false);
  assert.equal(isCleanScalar(undefined), false);
  assert.equal(isCleanScalar("2.5.1\n"), false, "and it still rejects a trailing newline, belt and braces");
});

test("✧ the anchor regex is linear — a long non-matching run does not blow up", () => {
  const hostile = `https://img.shields.io/badge/pharn-${"a".repeat(50000)}`;
  const started = process.hrtime.bigint();
  findBadgeValues(hostile);
  const ms = Number(process.hrtime.bigint() - started) / 1e6;
  assert.ok(ms < 1000, `anchor took ${ms}ms on a 50k-char run — expected linear behaviour`);
});

// ── ✧ WIRING PINS — the checker guards nothing unless something invokes it ─────────────────────────

test("✧ package.json wires check:badge to this checker, and `check` runs check:badge", () => {
  const pkg = JSON.parse(readFileSync(join(REPO, "package.json"), "utf8"));
  assert.match(pkg.scripts["check:badge"] ?? "", /check-version-badge\.mjs/, "check:badge must run check-version-badge.mjs");
  assert.match(pkg.scripts.check, /check:badge/, "npm run check must run check:badge");
});

test("✧ CI actually INVOKES the badge check, and its step is not disabled by an `if:` (L2)", () => {
  // The wiring precedent and its reason: ci.yml does NOT run `npm run check` — it runs each script as
  // its own step. A checker folded only into `check` would therefore never fire on a pull request while
  // the plan claimed it was gated. The `if:` half is deliberate: matching only the `run:` string would
  // let an edit to `if: false` leave the invocation present, this test green, and the guard dead.
  const ci = readFileSync(join(REPO, ".github", "workflows", "ci.yml"), "utf8");
  const step = ci.match(/^ {6}- name: [^\n]*\n(?: {8}[^\n]*\n)*? {8}run: npm run check:badge[ \t]*$/m);
  assert.ok(step, "ci.yml must contain a step whose `run:` is `npm run check:badge`");
  assert.match(
    step[0],
    /^ {8}if: \$\{\{ always\(\) && steps\.install\.outcome == 'success' \}\}$/m,
    "the badge-check step must carry the same install-gated `if:` as its sibling steps — a disabled step is a dead guard"
  );

  // HONEST RESIDUAL (P0), stated so this pin is not oversold: what remains uncheckable from inside the
  // repo is that GitHub EXECUTED the job, that the workflow is enabled, and that branch protection
  // requires this check. Those are harness-layer facts. "The wiring is pinned" NEVER means "CI is
  // guaranteed to run it".
});

// ── The real repo ─────────────────────────────────────────────────────────────────────────────────

test("the checker is GREEN against this repo", () => {
  const { code, out } = run(REPO);
  assert.equal(code, 0, out);
});

test("checkVersionBadge is pure — it returns a verdict rather than exiting", () => {
  withFixture({ version: "2.5.1", badge: "1.0.0" }, (dir) => {
    const res = checkVersionBadge(dir);
    assert.equal(res.ok, false);
    assert.equal(res.findings[0].type, "DRIFT");
    assert.equal(res.version, "2.5.1");
    assert.equal(res.badge, "1.0.0");
  });
});

test("✧ BADGE_RE is exported non-global so no lastIndex leaks between calls", () => {
  assert.equal(BADGE_RE.global, false);
  const readme = `https://img.shields.io/badge/pharn-2.5.1-blue`;
  assert.deepEqual(findBadgeValues(readme), ["2.5.1"]);
  assert.deepEqual(findBadgeValues(readme), ["2.5.1"], "a second call must return the same result");
});

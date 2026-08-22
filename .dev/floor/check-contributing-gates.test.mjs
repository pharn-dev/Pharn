// .dev/floor/check-contributing-gates.test.mjs — apparatus tests for the CONTRIBUTING gate-chain checker.
//
// L4: an authored fixture passes by construction. The ✧ cases are therefore MUTANTS — each asserts the
// checker FAILS when the thing it guards is broken, not merely that it passes when everything is fine.
// The historical drift (a doc naming 4 of 7 gates) is reproduced directly, because it is the whole
// reason this checker exists.
//
// L29: the remedy this checker implements is quantified over "every gate in the chain", so the tests
// ITERATE the parsed set rather than asserting the seven that happen to exist today — a gate added to
// `scripts.check` later is covered by these rules for free, with no test edit.

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { checkContributingGates, parseGateChain, isDocumented } from "./check-contributing-gates.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHECKER = join(HERE, "check-contributing-gates.mjs");
const REPO = join(HERE, "..", "..");

const REAL_CHAIN =
  "npm run format:check && npm run lint && npm run lint:md && npm run docs:check && npm run check:markers && npm run check:badge && npm test";

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
 * Build a throwaway repo. `doc` is CONTRIBUTING.md's body; `chain` is package.json's scripts.check.
 * Passing `omitPackage` / `omitDoc` / `omitCheckScript` exercises the fail-closed paths.
 */
function fixture({
  chain = REAL_CHAIN,
  doc = null,
  omitPackage = false,
  omitDoc = false,
  omitCheckScript = false,
  badPackage = false,
} = {}) {
  const dir = mkdtempSync(join(tmpdir(), "pharn-cgates-"));
  if (!omitPackage) {
    if (badPackage) {
      writeFileSync(join(dir, "package.json"), "{ not json");
    } else {
      const scripts = omitCheckScript ? { test: "node --test" } : { test: "node --test", check: chain };
      writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "x", scripts }, null, 2));
    }
  }
  if (!omitDoc) {
    const body = doc ?? documentAll(parseGateChain(chain));
    writeFileSync(join(dir, "CONTRIBUTING.md"), body);
  }
  return dir;
}

/** A CONTRIBUTING body that names every gate in `gates`, back-ticked — the clean path. */
function documentAll(gates) {
  return `# Contributing\n\nRun the gates:\n\n${gates.map((g) => `- \`${g}\` — a gate\n`).join("")}\nThat is the chain.\n`;
}

const cleanup = (d) => rmSync(d, { recursive: true, force: true });

// ── the clean path ────────────────────────────────────────────────────────────────────────────────

test("a doc naming every gate in the chain → exit 0 GREEN", () => {
  const d = fixture();
  const { code, out } = run(d);
  assert.equal(code, 0);
  assert.match(out, /CONTRIBUTING-GATES: GREEN/);
  assert.match(out, /all 7 gate\(s\)/);
  cleanup(d);
});

test("the GREEN line names the gates it verified, so the count is auditable", () => {
  const d = fixture();
  const { out } = run(d);
  for (const g of parseGateChain(REAL_CHAIN)) assert.ok(out.includes(g), `GREEN output must name ${g}`);
  cleanup(d);
});

// ── ✧ THE MUTANT THIS CHECKER EXISTS FOR ──────────────────────────────────────────────────────────

test("✧ the historical defect: a doc naming 4 of 7 gates → exit 1, naming exactly the 3 missing", () => {
  const doc = "# Contributing\n\n`npm run check` runs `format:check`, `lint`, `lint:md` and the `test` suite.\n";
  const d = fixture({ doc });
  const { code, out } = run(d);
  assert.equal(code, 1, "a doc missing three gates must RED");
  for (const missing of ["docs:check", "check:markers", "check:badge"]) {
    assert.ok(out.includes(missing), `must name the undocumented gate ${missing}`);
  }
  for (const present of ["format:check", "lint:md"]) {
    assert.ok(!out.includes(`gate \`${present}\` is in`), `must NOT flag the documented gate ${present}`);
  }
  cleanup(d);
});

test("✧ EVERY gate is load-bearing — omitting any ONE of them REDs (L29: quantified over the set)", () => {
  const gates = parseGateChain(REAL_CHAIN);
  for (const omitted of gates) {
    const doc = documentAll(gates.filter((g) => g !== omitted));
    const d = fixture({ doc });
    const { code, out } = run(d);
    assert.equal(code, 1, `omitting ${omitted} must RED`);
    assert.ok(out.includes(`gate \`${omitted}\``), `the RED must name ${omitted}`);
    cleanup(d);
  }
});

test("✧ a gate added to the chain later is covered with no test edit", () => {
  const chain = `${REAL_CHAIN} && npm run check:newthing`;
  // Document only the ORIGINAL seven — the new gate is undocumented.
  const d = fixture({ chain, doc: documentAll(parseGateChain(REAL_CHAIN)) });
  const { code, out } = run(d);
  assert.equal(code, 1);
  assert.ok(out.includes("check:newthing"), "a newly added gate must be flagged when undocumented");
  cleanup(d);
});

test("✧ the FIX message names package.json as the source, not the doc", () => {
  const d = fixture({ doc: "# Contributing\n\nnothing here.\n" });
  const { out } = run(d);
  assert.match(out, /package\.json scripts\.check is the single source/);
  cleanup(d);
});

test("✧ the RED output states the name-presence bound, so GREEN is not read as 'described correctly'", () => {
  const d = fixture({ doc: "# Contributing\n\nnothing here.\n" });
  const { out } = run(d);
  assert.match(out, /NAME PRESENCE only/);
  cleanup(d);
});

// ── ✧ the back-tick requirement (unfalsifiability guard) ──────────────────────────────────────────

test("✧ a bare (un-back-ticked) gate name does NOT count as documented", () => {
  const doc = "# Contributing\n\nWe run format:check and lint and lint:md and test.\n";
  const d = fixture({ doc });
  const { code } = run(d);
  assert.equal(code, 1, "bare prose mentions must not satisfy the check");
  cleanup(d);
});

test("✧ without back-ticks the `test` gate would be unfalsifiable — prove the guard holds", () => {
  // A doc that merely uses the English word "test" in a sentence must not satisfy the `test` gate.
  assert.equal(isDocumented("we ran the test suite", "test"), false);
  assert.equal(isDocumented("we ran the `test` suite", "test"), true);
});

// ── ✧ chain parsing ───────────────────────────────────────────────────────────────────────────────

test("parseGateChain extracts npm run <name> and bare npm test, in order", () => {
  assert.deepEqual(parseGateChain("npm run a && npm run b:c && npm test"), ["a", "b:c", "test"]);
});

test("parseGateChain de-duplicates a repeated gate", () => {
  assert.deepEqual(parseGateChain("npm run a && npm run a && npm test"), ["a", "test"]);
});

test("parseGateChain survives reordering and extra whitespace", () => {
  assert.deepEqual(parseGateChain("npm  test  &&   npm run  z"), ["test", "z"]);
});

test("✧ parseGateChain returns [] for a non-string, so a malformed field cannot fabricate gates", () => {
  for (const bad of [null, undefined, 42, {}, []]) assert.deepEqual(parseGateChain(bad), []);
});

// ── ✧ fail-closed paths — a RED, never a crash, never a silent GREEN ──────────────────────────────

test("✧ package.json absent → exit 1 MISSING_PACKAGE, clean", () => {
  const d = fixture({ omitPackage: true });
  const { code, out } = run(d);
  assert.equal(code, 1);
  assert.match(out, /MISSING_PACKAGE/);
  assert.ok(!out.includes("at Object."), "no stack trace");
  cleanup(d);
});

test("✧ package.json unparseable → exit 1 MISSING_PACKAGE, clean", () => {
  const d = fixture({ badPackage: true });
  const { code, out } = run(d);
  assert.equal(code, 1);
  assert.match(out, /MISSING_PACKAGE/);
  assert.ok(!out.includes("at Object."), "no stack trace");
  cleanup(d);
});

test("✧ no scripts.check → exit 1 NO_CHECK_SCRIPT (never a vacuous GREEN over zero gates)", () => {
  const d = fixture({ omitCheckScript: true });
  const { code, out } = run(d);
  assert.equal(code, 1);
  assert.match(out, /NO_CHECK_SCRIPT/);
  cleanup(d);
});

test("✧ a scripts.check naming no gate → exit 1 EMPTY_CHAIN, not GREEN", () => {
  const d = fixture({ chain: "echo nothing-here" });
  const { code, out } = run(d);
  assert.equal(code, 1);
  assert.match(out, /EMPTY_CHAIN/);
  cleanup(d);
});

test("✧ CONTRIBUTING.md absent → exit 1 MISSING_DOC, clean", () => {
  const d = fixture({ omitDoc: true });
  const { code, out } = run(d);
  assert.equal(code, 1);
  assert.match(out, /MISSING_DOC/);
  assert.ok(!out.includes("at Object."), "no stack trace");
  cleanup(d);
});

test("✧ target dir does not exist → exit 1, clean", () => {
  const { code, out } = run(join(tmpdir(), "pharn-cgates-does-not-exist-xyz"));
  assert.equal(code, 1);
  assert.match(out, /target dir not found/);
});

test("✧ target is a FILE, not a directory → exit 1", () => {
  const d = mkdtempSync(join(tmpdir(), "pharn-cgates-file-"));
  const f = join(d, "afile");
  writeFileSync(f, "x");
  const { code } = run(f);
  assert.equal(code, 1);
  cleanup(d);
});

// ── ✧ the library surface agrees with the CLI ─────────────────────────────────────────────────────

test("checkContributingGates returns the parsed gate set alongside the verdict", () => {
  const d = fixture();
  const { ok, findings, gates } = checkContributingGates(d);
  assert.equal(ok, true);
  assert.deepEqual(findings, []);
  assert.deepEqual(gates, parseGateChain(REAL_CHAIN));
  cleanup(d);
});

// ── ✧ WIRING PINS — the checker guards nothing unless something invokes it ─────────────────────────

test("✧ WIRING: npm run check runs check:contributing", () => {
  const pkg = JSON.parse(readFileSync(join(REPO, "package.json"), "utf8"));
  assert.match(pkg.scripts.check, /check:contributing/, "npm run check must run check:contributing");
  assert.ok(pkg.scripts["check:contributing"], "a check:contributing script must exist");
  assert.match(pkg.scripts["check:contributing"], /check-contributing-gates\.mjs/);
});

test("✧ WIRING: ci.yml invokes it as its own step (ci.yml never runs `npm run check`)", () => {
  const ci = readFileSync(join(REPO, ".github", "workflows", "ci.yml"), "utf8");
  assert.match(ci, /npm run check:contributing/, "ci.yml must run check:contributing as its own step");
  assert.ok(!/run:\s*npm run check\s*$/m.test(ci), "ci.yml still must not rely on the `npm run check` aggregate");
});

test("✧ WIRING: the repo itself is GREEN under this checker", () => {
  const { code } = run(REPO);
  assert.equal(code, 0, "the live repo must satisfy the check it ships");
});

// ── ✧ the reverse direction is a STATED bound, not a silent gap (L25) ─────────────────────────────

test("✧ a gate documented but NOT in the chain is deliberately GREEN, and the header says so", () => {
  const gates = parseGateChain(REAL_CHAIN);
  const doc = `${documentAll(gates)}\nWe also mention \`docs:generate\` and \`format\`, which are not chain gates.\n`;
  const d = fixture({ doc });
  assert.equal(run(d).code, 0, "naming a non-chain script must not RED — the reverse direction is out of scope");
  cleanup(d);
  const src = readFileSync(CHECKER, "utf8");
  assert.match(src, /NOT the REVERSE direction/, "the bound must be stated in the checker itself, not only here");
});

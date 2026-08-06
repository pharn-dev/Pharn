// pharn/floor/check-lessons-index.test.mjs — hermetic tests for the PRODUCT lessons-index drift checker.
//
// One case per verdict in the closed set, plus the fail-closed bad-target path and the --verdict channel.
// Every case runs against a temp directory.

import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { checkLessonsIndex, VERDICTS } from "./check-lessons-index.mjs";
import { generate } from "./gen-lessons-index.mjs";
import { CANON_PATH, OUT_PATH } from "./lessons-index-core.mjs";

const CLI = fileURLToPath(new URL("./check-lessons-index.mjs", import.meta.url));

/** Make a temp repo. `canon === null` means "no canon file at all". */
function tmpRepo(canon) {
  const dir = mkdtempSync(join(tmpdir(), "pharn-check-lessons-index-"));
  if (canon !== null) {
    const abs = join(dir, CANON_PATH);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, canon);
  }
  return dir;
}

/** Run the CLI, returning { status, stdout }. Never throws on a non-zero exit. */
function runCli(args) {
  try {
    return { status: 0, stdout: execFileSync(process.execPath, [CLI, ...args], { encoding: "utf8" }) };
  } catch (e) {
    return { status: e.status, stdout: e.stdout ?? "" };
  }
}

const CANON_ONE = "## L1 — a title\n\ntype: floor · concepts: [x]\n\nbody\n";

// ── The five verdicts ──────────────────────────────────────────────────────────────────────────────

test("NO_CANON: an absent canon is GREEN — a fresh install is not an error", () => {
  const dir = tmpRepo(null);
  try {
    assert.equal(checkLessonsIndex(dir).verdict, "NO_CANON");
    assert.equal(runCli([dir]).status, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("NO_CANON: a canon with zero lessons is GREEN too", () => {
  const dir = tmpRepo("# Lessons learned\n\nNothing promoted yet.\n");
  try {
    assert.equal(checkLessonsIndex(dir).verdict, "NO_CANON");
    assert.equal(runCli([dir]).status, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("COLD: canon has lessons but no cache exists yet — GREEN, because the cache is gitignored scratch", () => {
  // This is the load-bearing divergence from the dev copy, whose MISSING verdict is a RED. Here a fresh
  // clone ALWAYS lands in this state, so REDding would make every first /pharn-plan a false alarm.
  const dir = tmpRepo(CANON_ONE);
  try {
    const r = checkLessonsIndex(dir);
    assert.equal(r.verdict, "COLD");
    assert.deepEqual(r.findings, []);
    assert.equal(runCli([dir]).status, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("GREEN: a freshly generated cache matches the recompute", () => {
  const dir = tmpRepo(CANON_ONE);
  try {
    generate(dir);
    assert.equal(checkLessonsIndex(dir).verdict, "GREEN");
    assert.equal(runCli([dir]).status, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("STALE: canon changed after the cache was written -> RED (the only drift RED)", () => {
  const dir = tmpRepo(CANON_ONE);
  try {
    generate(dir);
    writeFileSync(join(dir, CANON_PATH), CANON_ONE + "\n## L2 — a second\n\nbody\n");
    const r = checkLessonsIndex(dir);
    assert.equal(r.verdict, "STALE");
    assert.equal(r.findings.length, 1);
    assert.equal(r.findings[0].file, OUT_PATH);
    assert.equal(runCli([dir]).status, 1);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("STALE also fires when a TOOL rewrote the cache, not canon — the case a linter causes", () => {
  const dir = tmpRepo(CANON_ONE);
  try {
    generate(dir);
    const abs = join(dir, OUT_PATH);
    writeFileSync(abs, "# Lessons index\n\nreformatted by some other tool\n");
    assert.equal(checkLessonsIndex(dir).verdict, "STALE");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("ENUM_ERROR: a present-but-invalid canon -> RED, citing CANON, not the cache", () => {
  const dir = tmpRepo("## L1 — a\n\nx\n\n## L1 — b\n\ny\n");
  try {
    const r = checkLessonsIndex(dir);
    assert.equal(r.verdict, "ENUM_ERROR");
    assert.equal(r.findings[0].file, CANON_PATH, "an invalid canon must blame canon, not the derived file");
    assert.match(r.findings[0].problem, /duplicate lesson id "L1"/);
    const cli = runCli([dir]);
    assert.equal(cli.status, 1);
    assert.match(cli.stdout, /regenerating cannot succeed/, "a regenerate that cannot work must not be prescribed");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// ── The machine-readable channel + fail-closed behavior ────────────────────────────────────────────

test("--verdict prints ONLY a bare token from the closed set, so a caller branches by membership (P5)", () => {
  const dir = tmpRepo(CANON_ONE);
  try {
    const cold = runCli([dir, "--verdict"]);
    assert.equal(cold.stdout, "COLD\n", "the token must be the whole of stdout — no prose to parse");
    assert.ok(VERDICTS.includes(cold.stdout.trim()));
    assert.equal(cold.status, 0);

    generate(dir);
    const green = runCli([dir, "--verdict"]);
    assert.equal(green.stdout, "GREEN\n");
    assert.equal(green.status, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--verdict keeps the SAME exit code as the prose mode — the two channels never disagree", () => {
  const dir = tmpRepo(CANON_ONE);
  try {
    generate(dir);
    writeFileSync(join(dir, CANON_PATH), CANON_ONE + "\n## L2 — b\n\nbody\n");
    const prose = runCli([dir]);
    const token = runCli([dir, "--verdict"]);
    assert.equal(prose.status, 1);
    assert.equal(token.status, 1);
    assert.equal(token.stdout, "STALE\n");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("the verdict set is exactly the five documented values", () => {
  assert.deepEqual(VERDICTS, ["NO_CANON", "COLD", "GREEN", "STALE", "ENUM_ERROR"]);
});

test("fail-closed: a missing target dir is a RED, never a silent GREEN", () => {
  const missing = join(tmpdir(), "pharn-definitely-not-here-9d3f2");
  assert.equal(runCli([missing]).status, 1);
  assert.equal(runCli([missing, "--verdict"]).status, 1);
});

test("a WARN about malformed tag lines never flips the GREEN verdict", () => {
  const dir = tmpRepo("## L1 — a title\n\ntype: bogus · concepts: [x]\n\nbody\n");
  try {
    generate(dir);
    const r = checkLessonsIndex(dir);
    assert.equal(r.verdict, "GREEN", "a malformed tag is DATA about canon — it is surfaced, never a drift RED");
    assert.equal(r.malformedCount, 1);
    const cli = runCli([dir]);
    assert.equal(cli.status, 0);
    assert.match(cli.stdout, /WARN — 1 entry\(ies\) carry a malformed tag line/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

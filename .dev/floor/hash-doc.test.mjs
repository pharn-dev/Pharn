// .dev/floor/hash-doc.test.mjs — tests for the dev pipeline's line-ending-agnostic spec hasher.
//
// Two surfaces are exercised deliberately: the exported hashDoc() directly (cheap, exact), and the CLI
// as a subprocess (so the tool keeps its dependency-free, top-level-exec contract and its exit codes are
// pinned). Inputs go to a fresh temp dir — no committed fixtures.
//
// The ★ test is the one that makes the increment safe to land: the folded digest of the REAL
// pharn/ARCHITECTURE.md must equal its BYTE-EXACT digest, because every committed PLAN.md already carries
// that value as spec_content_hash. If that ever fails, the fold silently invalidated every stored pin.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";

import { hashDoc } from "./hash-doc.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const TOOL = join(here, "hash-doc.mjs");
const REPO = resolve(here, "..", "..");

// An INDEPENDENT byte-exact oracle — deliberately not a copy of the fold, so no test here can pass by
// agreeing with a copy of the implementation.
const byteExact = (s) => createHash("sha256").update(s).digest("hex");

const LF = "# Title\n\nline one\nline two\n";
const toCRLF = (s) => s.replace(/\n/g, "\r\n");

function runCli(text) {
  const dir = mkdtempSync(join(tmpdir(), "pharn-hashdoc-"));
  try {
    const p = join(dir, "doc.md");
    writeFileSync(p, text);
    return spawnSync(process.execPath, [TOOL, p], { encoding: "utf8" });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("parity: a CRLF file and its LF spelling hash identically", () => {
  assert.equal(hashDoc(toCRLF(LF)), hashDoc(LF));
  assert.match(hashDoc(LF), /^[0-9a-f]{64}$/);
});

test("★ identity on LF: the folded digest of the REAL pharn/ARCHITECTURE.md equals its byte-exact digest", () => {
  // This is why no committed PLAN's spec_content_hash moves. The repo is all-LF, so the fold is a no-op
  // here; if this ever fails, the fold has invalidated every stored pin and the increment is unsafe.
  const text = readFileSync(join(REPO, "pharn", "ARCHITECTURE.md"), "utf8");
  assert.equal(hashDoc(text), byteExact(text));
});

test("mixed line endings (half-renormalized) still match the LF digest", () => {
  const lines = LF.split("\n");
  let mixed = lines[0];
  for (let i = 1; i < lines.length; i++) mixed += (i % 2 === 0 ? "\r\n" : "\n") + lines[i];
  assert.notEqual(mixed, LF); // the fixture really is mixed
  assert.equal(hashDoc(mixed), hashDoc(LF));
});

test("drift is still caught: a real TEXT change produces a different digest", () => {
  assert.notEqual(hashDoc(LF.replace("line one", "line ONE")), hashDoc(LF));
});

test("boundedness: a lone `\\r` is NOT folded (two fixtures, one per candidate widening)", () => {
  // Each places the `\r` where a WIDER fold would reconstruct LF exactly — a fixture that merely swapped
  // some other character would differ in real text under every fold width and would pin nothing.
  const whereNewlineWas = LF.replace("# Title\n", "# Title\r"); // `/\r\n?/g` would restore LF
  const insertedMidLine = LF.replace("line one", "line \rone"); // `/\r/g -> ""` would restore LF
  assert.notEqual(hashDoc(whereNewlineWas), hashDoc(LF));
  assert.notEqual(hashDoc(insertedMidLine), hashDoc(LF));
});

test("CLI: prints the folded digest and exits 0", () => {
  const r = runCli(toCRLF(LF));
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), hashDoc(LF));
  assert.match(r.stdout.trim(), /^[0-9a-f]{64}$/);
  assert.equal(r.stdout.slice(-1), "\n"); // one trailing newline, so a caller's $(...) trim is exact
});

test("CLI: a missing argument exits 1 with usage — never a silent empty digest", () => {
  const r = spawnSync(process.execPath, [TOOL], { encoding: "utf8" });
  assert.equal(r.status, 1);
  assert.equal(r.stdout, "");
  assert.match(r.stderr, /usage/);
});

test("CLI: an unreadable path exits 1 and names the file — never a silent empty digest", () => {
  const r = spawnSync(process.execPath, [TOOL, join(tmpdir(), "pharn-hashdoc-does-not-exist-9f3a2c")], {
    encoding: "utf8",
  });
  assert.equal(r.status, 1);
  assert.equal(r.stdout, "");
  assert.match(r.stderr, /cannot read/);
});

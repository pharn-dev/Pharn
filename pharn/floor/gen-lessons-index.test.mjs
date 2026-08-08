// pharn/floor/gen-lessons-index.test.mjs — hermetic tests for the PRODUCT lessons-index generator.
//
// Every case runs against a temp directory. Nothing here reads or writes the real repo.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  statSync,
  rmSync,
  openSync,
  readSync,
  fstatSync,
  closeSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { generate } from "./gen-lessons-index.mjs";
import { CANON_PATH, OUT_PATH, STATUS_OK, STATUS_NO_CANON } from "./lessons-index-core.mjs";

/** Make a temp repo. `canon === null` means "no canon file at all". */
function tmpRepo(canon) {
  const dir = mkdtempSync(join(tmpdir(), "pharn-gen-lessons-index-"));
  if (canon !== null) {
    const abs = join(dir, CANON_PATH);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, canon);
  }
  return dir;
}

const CANON_ONE = "## L1 — a title\n\ntype: floor · concepts: [x]\n\nbody\n";

/** Read content + mtime from one open fd — avoids path-based TOCTOU between stat and read. */
function readSnapshot(abs) {
  const fd = openSync(abs, "r");
  try {
    const { mtimeMs, size } = fstatSync(fd);
    const buf = Buffer.alloc(size);
    readSync(fd, buf, 0, size, 0);
    return { mtimeMs, content: buf.toString("utf8") };
  } finally {
    closeSync(fd);
  }
}

test("first run writes the cache and reports updated", () => {
  const dir = tmpRepo(CANON_ONE);
  try {
    const r = generate(dir);
    assert.equal(r.status, STATUS_OK);
    assert.equal(r.updated, true);
    assert.equal(r.entries.length, 1);
    assert.ok(existsSync(join(dir, OUT_PATH)), "the cache must exist after the first run");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("the generator creates the .pharn/ directory when it does not exist", () => {
  const dir = tmpRepo(CANON_ONE);
  try {
    assert.equal(existsSync(join(dir, ".pharn")), false, "precondition: no .pharn/ yet");
    generate(dir);
    assert.ok(statSync(join(dir, ".pharn")).isDirectory());
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a SECOND run is a true filesystem no-op — byte-identical AND mtime-unchanged (idempotence)", () => {
  const dir = tmpRepo(CANON_ONE);
  try {
    generate(dir);
    const abs = join(dir, OUT_PATH);
    const before = readSnapshot(abs);

    const r2 = generate(dir);
    assert.equal(r2.updated, false, "a second run must report no update");
    const after = readSnapshot(abs);
    assert.equal(after.content, before.content, "the bytes must be identical");
    assert.equal(after.mtimeMs, before.mtimeMs, "the file must not be rewritten at all — a no-op, not a rewrite");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a change to canon IS picked up on the next run", () => {
  const dir = tmpRepo(CANON_ONE);
  try {
    generate(dir);
    writeFileSync(join(dir, CANON_PATH), CANON_ONE + "\n## L2 — a second\n\nbody\n");
    const r = generate(dir);
    assert.equal(r.updated, true);
    assert.equal(r.entries.length, 2);
    assert.match(readFileSync(join(dir, OUT_PATH), "utf8"), /2 lessons/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("PRODUCT DIVERGENCE: no canon -> exit-0-equivalent no-op; NOTHING is written", () => {
  const dir = tmpRepo(null);
  try {
    const r = generate(dir);
    assert.equal(r.status, STATUS_NO_CANON);
    assert.equal(r.updated, false);
    assert.equal(existsSync(join(dir, OUT_PATH)), false, "no canon must mean no cache file — never an empty index rendered as fact");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("PRODUCT DIVERGENCE: a canon with zero lessons -> no-op; NOTHING is written", () => {
  const dir = tmpRepo("# Lessons learned\n\nNothing promoted yet.\n");
  try {
    const r = generate(dir);
    assert.equal(r.status, STATUS_NO_CANON);
    assert.equal(existsSync(join(dir, OUT_PATH)), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a present-but-INVALID canon still throws, and leaves no partial cache behind", () => {
  const dir = tmpRepo("## L1 — a\n\nx\n\n## L1 — b\n\ny\n");
  try {
    assert.throws(() => generate(dir), /duplicate lesson id "L1"/);
    assert.equal(existsSync(join(dir, OUT_PATH)), false, "a refusal must never leave a half-written cache");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("the emitted cache carries the generator's own regenerate hint, and it names a LIVE op (L2)", () => {
  const dir = tmpRepo(CANON_ONE);
  try {
    generate(dir);
    const out = readFileSync(join(dir, OUT_PATH), "utf8");
    assert.match(out, /node pharn\/floor\/gen-lessons-index\.mjs \./, "the hint must be a bare node invocation");
    assert.ok(!/npm run docs:generate/.test(out), "a user's repo has no npm script — citing one would be a dead op (L2)");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

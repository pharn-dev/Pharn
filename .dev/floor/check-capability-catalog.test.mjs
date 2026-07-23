// .dev/floor/check-capability-catalog.test.mjs — hermetic tests for the drift checker + the CLIs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, appendFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { checkCatalog } from "./check-capability-catalog.mjs";
import { generate } from "./gen-capability-catalog.mjs";
import { OUT_DIR } from "./capability-catalog-core.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

function makeRepo() {
  return mkdtempSync(join(tmpdir(), "pharn-cat-check-"));
}
function cap(root, dirRel, base, fm, body) {
  const dir = join(root, dirRel);
  mkdirSync(dir, { recursive: true });
  const fmLines = Object.entries(fm).map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.map((x) => `"${x}"`).join(", ")}]` : v}`);
  writeFileSync(join(dir, `${base}.md`), `---\n${fmLines.join("\n")}\n---\n\n${body}\n`);
}
function seed(root) {
  cap(
    root,
    "pharn/pharn-review/aaa",
    "aaa",
    { name: "aaa", role: "lens", kind: "pharn-owned", version: "0.1.0", applies: ["universal"] },
    "# aaa — flags aaa"
  );
  cap(
    root,
    "pharn/pharn-pipeline/grillers/gg",
    "gg",
    { name: "gg", role: "griller", kind: "pharn-owned", version: "0.1.0", applies: ["universal"] },
    "# gg — asks gg"
  );
}

test("clean: after generate, checkCatalog is GREEN (ok, no findings)", () => {
  const root = makeRepo();
  try {
    seed(root);
    const { written } = generate(root);
    assert.equal(written, 3); // README + 2 pages
    const { ok, findings } = checkCatalog(root);
    assert.equal(ok, true);
    assert.deepEqual(findings, []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("drift: mutating a committed page → RED with a DRIFT finding", () => {
  const root = makeRepo();
  try {
    seed(root);
    generate(root);
    appendFileSync(join(root, OUT_DIR, "aaa.md"), "tampered\n");
    const { ok, findings } = checkCatalog(root);
    assert.equal(ok, false);
    assert.ok(findings.some((f) => f.type === "DRIFT" && f.file === `${OUT_DIR}/aaa.md`));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("missing: adding a capability without regenerating → RED MISSING", () => {
  const root = makeRepo();
  try {
    seed(root);
    generate(root);
    cap(
      root,
      "pharn/pharn-review/ccc",
      "ccc",
      { name: "ccc", role: "lens", kind: "pharn-owned", version: "0.1.0", applies: ["universal"] },
      "# ccc — flags ccc"
    );
    const { ok, findings } = checkCatalog(root);
    assert.equal(ok, false);
    assert.ok(findings.some((f) => f.type === "MISSING" && f.file === `${OUT_DIR}/ccc.md`));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("orphan: a committed page with no backing capability → RED ORPHAN", () => {
  const root = makeRepo();
  try {
    seed(root);
    generate(root);
    writeFileSync(join(root, OUT_DIR, "orphan.md"), "leftover\n");
    const { ok, findings } = checkCatalog(root);
    assert.equal(ok, false);
    assert.ok(findings.some((f) => f.type === "ORPHAN" && f.file === `${OUT_DIR}/orphan.md`));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("generate removes a stale page when its capability disappears", () => {
  const root = makeRepo();
  try {
    seed(root);
    generate(root);
    rmSync(join(root, "pharn/pharn-review/aaa"), { recursive: true, force: true });
    const { removed } = generate(root);
    assert.equal(removed, 1);
    const { ok } = checkCatalog(root);
    assert.equal(ok, true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("duplicate slug surfaces as a deterministic ENUM_ERROR (not a crash)", () => {
  const root = makeRepo();
  try {
    cap(
      root,
      "pharn/pharn-review/dup",
      "dup",
      { name: "one", role: "lens", kind: "pharn-owned", version: "0.1.0", applies: ["universal"] },
      "# one — a"
    );
    cap(
      root,
      "pharn/pharn-pipeline/grillers/dup",
      "dup",
      { name: "two", role: "griller", kind: "pharn-owned", version: "0.1.0", applies: ["universal"] },
      "# two — b"
    );
    const { ok, findings } = checkCatalog(root);
    assert.equal(ok, false);
    assert.equal(findings[0].type, "ENUM_ERROR");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("CLI: gen exits 0; check exits 0 clean, 1 on drift with the FIX line; 1 on bad target", () => {
  const root = makeRepo();
  try {
    seed(root);
    const gen = spawnSync("node", [join(HERE, "gen-capability-catalog.mjs"), root], { encoding: "utf8" });
    assert.equal(gen.status, 0);
    assert.match(gen.stdout, /wrote 3 file/);

    const clean = spawnSync("node", [join(HERE, "check-capability-catalog.mjs"), root], { encoding: "utf8" });
    assert.equal(clean.status, 0);
    assert.match(clean.stdout, /CATALOG: GREEN/);

    appendFileSync(join(root, OUT_DIR, "gg.md"), "x\n");
    const dirty = spawnSync("node", [join(HERE, "check-capability-catalog.mjs"), root], { encoding: "utf8" });
    assert.equal(dirty.status, 1);
    assert.match(dirty.stdout, /CATALOG: RED/);
    assert.match(dirty.stdout, /npm run docs:generate/);

    const bad = spawnSync("node", [join(HERE, "check-capability-catalog.mjs"), join(root, "nope")], { encoding: "utf8" });
    assert.equal(bad.status, 1);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

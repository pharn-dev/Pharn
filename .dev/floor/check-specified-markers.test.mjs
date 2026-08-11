// .dev/floor/check-specified-markers.test.mjs — apparatus tests for the specified-marker checker.
//
// L4: an authored fixture passes by construction. These tests therefore drive the RED paths with real
// fixture trees + fixture manifests (via --manifest), and the ✧ cases are MUTANTS — each asserts the
// checker fails when the thing it guards is broken, not merely that it passes when everything is fine.

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHECKER = join(HERE, "check-specified-markers.mjs");
const REPO = join(HERE, "..", "..");

const MARKER = "`pre-egress` _(specified; ships with the guarded surface)_ — blocks a network call";

/** Run the checker; never throws. Returns {code, out}. */
function run(target, manifest) {
  const args = [CHECKER, target];
  if (manifest) args.push("--manifest", manifest);
  try {
    const out = execFileSync(process.execPath, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status, out: `${e.stdout ?? ""}${e.stderr ?? ""}` };
  }
}

/** Build a throwaway target tree + manifest. `opts.hookName` present => the primitive is "live". */
function fixture(opts = {}) {
  const dir = mkdtempSync(join(tmpdir(), "pharn-markers-"));
  mkdirSync(join(dir, ".claude", "hooks"), { recursive: true });
  if (opts.hookName) writeFileSync(join(dir, ".claude", "hooks", opts.hookName), "// stub\n");
  writeFileSync(join(dir, "DOC.md"), opts.docBody ?? `intro\n${MARKER}\noutro\n`);

  const manifest = {
    specified_primitives: [
      {
        id: "pre-egress",
        probe: opts.probe ?? { type: "dir-contains", dir: ".claude/hooks", substring: "egress" },
        sites: opts.sites ?? [{ file: "DOC.md", marker: MARKER }],
      },
    ],
    named_artifacts: opts.named ?? [],
  };
  const mPath = join(dir, "manifest.json");
  writeFileSync(mPath, JSON.stringify(manifest));
  return { dir, mPath, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}

// ---------------------------------------------------------------- the two correct states are GREEN

test("GREEN — primitive absent and the marker is present (the F7 steady state)", () => {
  const f = fixture();
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /GREEN/);
});

test("GREEN — primitive live and the marker has been removed (the correct post-ship state)", () => {
  const f = fixture({ hookName: "pre-egress.cjs", docBody: "intro\nno annotation here\noutro\n" });
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 0, r.out);
});

// ---------------------------------------------------------------- ✧ direction 1: the primitive ships

test("✧ RED — the primitive SHIPPED but the marker remains (the doc now understates a real protection)", () => {
  const f = fixture({ hookName: "pre-egress.cjs" });
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /IS NOW LIVE/);
  assert.match(r.out, /REMOVE the marker/);
  assert.match(r.out, /DOC\.md/);
});

test("✧ the live-probe is a SUBSTRING match on the filename, so any *egress* file trips it", () => {
  const f = fixture({ hookName: "my-pre-egress-hook.cjs" });
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 1, r.out);
});

test("a same-directory file NOT matching the substring leaves the primitive not-live", () => {
  const f = fixture({ hookName: "unrelated.cjs" });
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 0, r.out);
});

// ------------------------------------------------------------- ✧ direction 2: the marker is deleted

test("✧ RED — the marker was DELETED while the primitive is still absent (silent return to overclaiming)", () => {
  const f = fixture({ docBody: "intro\nblocks a network call to a domain not on a hardcoded allowlist.\noutro\n" });
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /annotation is GONE/);
  assert.match(r.out, /still absent/);
});

test("✧ RED — a one-character edit to the marker counts as deleted (exact substring, not fuzzy)", () => {
  const f = fixture({ docBody: `intro\n${MARKER.replace("specified;", "specified:")}\noutro\n` });
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 1, r.out);
});

test("✧ RED — a site file that cannot be read is reported, never skipped", () => {
  const f = fixture({ sites: [{ file: "NOPE.md", marker: MARKER }] });
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /could not be read/);
});

// -------------------------------------------------------------------- ✧ fail-closed on a bad manifest

test("✧ exit 2 — an unknown probe type fails CLOSED, never a silent GREEN", () => {
  const f = fixture({ probe: { type: "vibes", dir: ".claude/hooks" } });
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 2, r.out);
  assert.match(r.out, /unknown probe type/);
});

test("✧ exit 2 — an unreadable manifest fails CLOSED", () => {
  const f = fixture();
  const r = run(f.dir, join(f.dir, "does-not-exist.json"));
  f.cleanup();
  assert.equal(r.code, 2, r.out);
  assert.match(r.out, /manifest unusable/);
});

test("✧ exit 2 — a manifest with no specified_primitives array fails CLOSED", () => {
  const f = fixture();
  writeFileSync(f.mPath, JSON.stringify({ nothing: true }));
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 2, r.out);
});

test("✧ exit 2 — a primitive with non-array sites fails CLOSED", () => {
  const f = fixture();
  writeFileSync(
    f.mPath,
    JSON.stringify({
      specified_primitives: [{ id: "pre-egress", probe: { type: "path", path: "DOC.md" }, sites: "DOC.md" }],
    })
  );
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 2, r.out);
  assert.match(r.out, /sites.*must be an array/);
});

test("✧ exit 2 — a site lacking string file/marker fields fails CLOSED", () => {
  const f = fixture();
  writeFileSync(
    f.mPath,
    JSON.stringify({
      specified_primitives: [
        { id: "pre-egress", probe: { type: "path", path: "DOC.md" }, sites: [{ file: "DOC.md" }] },
      ],
    })
  );
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 2, r.out);
  assert.match(r.out, /string `file` and `marker`/);
});

test("✧ exit 2 — a named-artifact lacking required string fields fails CLOSED", () => {
  const f = fixture({ named: [{ id: "ghost", cited_in: "DOC.md" }] });
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 2, r.out);
  assert.match(r.out, /citation.*must be a string/);
});

// ------------------------------------------------------------------------------ named-artifact half

test("✧ RED — a doc citing an artifact that does not exist (the security-secrets name-drift class)", () => {
  const f = fixture({
    named: [{ id: "ghost", cited_in: "DOC.md", citation: "intro", must_exist: "pharn/pharn-review/ghost" }],
  });
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /does not exist/);
});

test("✧ RED — the citation itself drifting out of the doc is caught", () => {
  const f = fixture({
    named: [{ id: "x", cited_in: "DOC.md", citation: "a name no longer present", must_exist: ".claude" }],
  });
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /name drifted/);
});

test("✧ RED — obsolete legacy citation coexisting with the corrected name is caught", () => {
  const f = fixture({
    docBody: "intro\nsecrets-in-code lens and security-secrets lens\noutro\n",
    named: [
      {
        id: "secrets-in-code",
        cited_in: "DOC.md",
        citation: "secrets-in-code lens",
        forbidden: ["security-secrets lens"],
        must_exist: ".claude",
      },
    ],
  });
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /obsolete name/);
  assert.match(r.out, /remove the legacy citation/);
});

test("✧ exit 2 — a named-artifact with non-array forbidden fails CLOSED", () => {
  const f = fixture({
    named: [
      {
        id: "secrets-in-code",
        cited_in: "DOC.md",
        citation: "secrets-in-code lens",
        forbidden: "security-secrets lens",
        must_exist: ".claude",
      },
    ],
  });
  const r = run(f.dir, f.mPath);
  f.cleanup();
  assert.equal(r.code, 2, r.out);
  assert.match(r.out, /forbidden.*must be an array/);
});

// ------------------------------------------------------------------------------------- integration

test("integration — the REAL repo is GREEN against the REAL manifest", () => {
  const r = run(REPO);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /GREEN/);
  // The count is asserted as a floor, not a fixed number: adding an annotation must not break this.
  const m = r.out.match(/GREEN — (\d+) annotation/);
  assert.ok(m && Number(m[1]) >= 11, `expected >= 11 annotations, got: ${r.out}`);
});

test("the GREEN line states its own P0 bound (the manifest is not a discovery mechanism)", () => {
  const r = run(REPO);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /never means the docs are accurate/);
});

// .claude/hooks/protect-trusted-paths.test.cjs — black-box tests for the pre-write floor hook.
//
// The hook reads a PreToolUse payload from stdin and exits 2 (deny) on a trusted path,
// 0 (allow) otherwise. We drive it as a subprocess and assert on exit code + stderr.

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const { join } = require("node:path");

const HOOK = join(__dirname, "protect-trusted-paths.cjs");

function run(payload, cwd) {
  return spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify(payload),
    encoding: "utf8",
    ...(cwd ? { cwd } : {}),
  });
}

function tmp() {
  return fs.mkdtempSync(join(os.tmpdir(), "pharn-fix2-"));
}

test("blocks writes to a trusted spec doc", () => {
  const r = run({ tool_name: "Write", tool_input: { file_path: "CONSTITUTION.md" } });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /BLOCKED by PHARN floor/);
});

test("blocks writes to .github/CODEOWNERS (the GitHub-layer write-guard)", () => {
  const r = run({ tool_name: "Edit", tool_input: { file_path: ".github/CODEOWNERS" } });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /BLOCKED by PHARN floor/);
});

test("allows writes to an ordinary file", () => {
  const r = run({ tool_name: "Write", tool_input: { file_path: "src/foo.js" } });
  assert.equal(r.status, 0);
});

// --- Symlink escape (fix): a write to an innocent path that RESOLVES to a trusted doc is denied ---

test("blocks a Write to a committed symlink that resolves to a trusted doc (leaf symlink)", () => {
  const cwd = tmp();
  fs.writeFileSync(join(cwd, "CONSTITUTION.md"), "trusted\n");
  fs.mkdirSync(join(cwd, "features"));
  fs.symlinkSync(join("..", "CONSTITUTION.md"), join(cwd, "features", "notes.md"));
  const r = run({ tool_name: "Write", tool_input: { file_path: "features/notes.md" } }, cwd);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /BLOCKED by PHARN floor/);
});

test("blocks a Write through a symlinked PARENT dir onto a trusted doc (ancestor resolves)", () => {
  const cwd = tmp();
  fs.writeFileSync(join(cwd, "CONSTITUTION.md"), "trusted\n");
  fs.mkdirSync(join(cwd, "features"));
  fs.symlinkSync("..", join(cwd, "features", "evil")); // features/evil -> repo root
  const r = run({ tool_name: "Write", tool_input: { file_path: "features/evil/CONSTITUTION.md" } }, cwd);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /BLOCKED by PHARN floor/);
});

test("allows a real (non-symlink) file in a nested allowed dir (no false positive from realpath)", () => {
  const cwd = tmp();
  fs.mkdirSync(join(cwd, "features"));
  fs.writeFileSync(join(cwd, "features", "notes.md"), "ordinary\n");
  const r = run({ tool_name: "Write", tool_input: { file_path: "features/notes.md" } }, cwd);
  assert.equal(r.status, 0);
});

// --- F3: the guard's own control surface (settings.json + the three hook scripts) ---
// Each hook file is re-read fresh on every tool call, so a write to one disarms that guard on the very
// next write; settings.json can unwire both. The entries are `.claude/`-qualified FRAGMENTS, so the
// negative block below pins that they did not widen onto a user's own files.

for (const p of [
  ".claude/settings.json",
  ".claude/hooks/protect-trusted-paths.cjs",
  ".claude/hooks/enforce-writes-scope.cjs",
  ".claude/hooks/set-writes-scope.cjs",
]) {
  test(`blocks writes to the guards' own control surface: ${p}`, () => {
    const r = run({ tool_name: "Write", tool_input: { file_path: p } });
    assert.equal(r.status, 2);
    assert.match(r.stderr, /BLOCKED by PHARN floor/);
  });
}

test("blocks an Edit to a control file (not just Write)", () => {
  const r = run({ tool_name: "Edit", tool_input: { file_path: ".claude/hooks/enforce-writes-scope.cjs" } });
  assert.equal(r.status, 2);
});

test("blocks a MultiEdit whose edits[] reaches a control file", () => {
  const r = run({
    tool_name: "MultiEdit",
    tool_input: { edits: [{ file_path: "src/ok.js" }, { file_path: ".claude/settings.json" }] },
  });
  assert.equal(r.status, 2);
});

test("blocks a Write to a committed symlink that resolves to .claude/settings.json", () => {
  const cwd = tmp();
  fs.mkdirSync(join(cwd, ".claude"));
  fs.writeFileSync(join(cwd, ".claude", "settings.json"), "{}\n");
  fs.mkdirSync(join(cwd, "features"));
  fs.symlinkSync(join("..", ".claude", "settings.json"), join(cwd, "features", "notes.md"));
  const r = run({ tool_name: "Write", tool_input: { file_path: "features/notes.md" } }, cwd);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /BLOCKED by PHARN floor/);
});

// --- Negative / anti-widening: the fragment form must NOT reach a user's own files. A bare-basename
// protect list would deny every one of these, which is why the entries carry their `.claude/` prefix. ---

for (const p of [
  "settings.json",
  ".vscode/settings.json",
  "config/settings.json",
  "src/enforce-writes-scope.cjs",
  "src/hooks/set-writes-scope.cjs",
  "vendor/protect-trusted-paths.cjs",
]) {
  test(`allows a user's own file that only SHARES a basename with a control file: ${p}`, () => {
    const r = run({ tool_name: "Write", tool_input: { file_path: p } });
    assert.equal(r.status, 0);
  });
}

// The hooks' own tests stay editable — a guard that froze its own tests would be unmaintainable, and this
// very increment edits both. Deliberately outside the protected set, pinned so it stays that way.
for (const p of [".claude/hooks/protect-trusted-paths.test.cjs", ".claude/hooks/set-writes-scope.test.cjs"]) {
  test(`allows the hooks' own test files: ${p}`, () => {
    const r = run({ tool_name: "Write", tool_input: { file_path: p } });
    assert.equal(r.status, 0);
  });
}

// Commands are the methodology this repo edits every increment (46 of 104 historical plans write one);
// freezing them would break the self-hosting loop. Deliberately unprotected.
test("allows writes to .claude/commands/* (not part of the guarded control surface)", () => {
  const r = run({ tool_name: "Write", tool_input: { file_path: ".claude/commands/pharn-dev-plan.md" } });
  assert.equal(r.status, 0);
});

// --- F4: path-fragment matching must not over-block suffixed names (e.g. `.bak` backups). ---

for (const p of [
  ".claude/settings.json.bak",
  ".claude/hooks/set-writes-scope.cjs.example",
  "backup/.claude/settings.json.bak",
  "features/CONSTITUTION.md.bak",
  ".claude/hooks/protect-trusted-paths.cjs.bak",
]) {
  test(`allows a suffixed path that only shares a protected fragment prefix: ${p}`, () => {
    const r = run({ tool_name: "Write", tool_input: { file_path: p } });
    assert.equal(r.status, 0);
  });
}

// --- Regression: the pre-existing protected set is untouched by the widening ---

for (const p of ["CONSTITUTION.md", "pharn/ARCHITECTURE.md", "THREAT-MODEL.md", "LIMITS.md", ".github/CODEOWNERS"]) {
  test(`still blocks the pre-existing trusted path: ${p}`, () => {
    const r = run({ tool_name: "Write", tool_input: { file_path: p } });
    assert.equal(r.status, 2);
  });
}

test("malformed stdin JSON is not treated as a write (allow, no crash)", () => {
  const r = spawnSync(process.execPath, [HOOK], { input: "{not json", encoding: "utf8" });
  assert.equal(r.status, 0);
});

test("a non-write tool is ignored even when its input names a control file", () => {
  const r = run({ tool_name: "Read", tool_input: { file_path: ".claude/settings.json" } });
  assert.equal(r.status, 0);
});

// ✧ Derived, not restated: every `.claude/` entry the hook actually declares must be denied. The deny
// block above lists the four paths as literals, which by construction passes even if a FIFTH entry were
// added and never tested (L4). This reads DEFAULT_PROTECTED from the source and drives the hook with it,
// so the coverage cannot go stale. The set-equality of this list with the setter's CONTROL_SURFACE is
// pinned in set-writes-scope.test.cjs's ✧ cross-copy guard.
test("✧ every `.claude/` entry declared in DEFAULT_PROTECTED is actually denied (derived from source)", () => {
  const src = fs.readFileSync(HOOK, "utf8").replace(/^[ \t]*\/\/.*$/gm, "");
  const m = src.match(/^const DEFAULT_PROTECTED = \[([\s\S]*?)^\];/m);
  assert.ok(m, "protect-trusted-paths.cjs must declare a top-level `const DEFAULT_PROTECTED = [ … ];`");
  const claudeEntries = (m[1].match(/"([^"]*)"/g) || []).map((s) => s.slice(1, -1)).filter((p) => p.startsWith(".claude/"));
  assert.ok(claudeEntries.length >= 4, "the guards' own control surface must be in the protected set");
  for (const p of claudeEntries) {
    assert.equal(run({ tool_name: "Write", tool_input: { file_path: p } }).status, 2, `${p} must be denied`);
  }
});

test("PHARN_PROTECTED still extends the list on top of the widened default", () => {
  const r = spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify({ tool_name: "Write", tool_input: { file_path: "custom/extra.md" } }),
    encoding: "utf8",
    env: { ...process.env, PHARN_PROTECTED: "extra.md" },
  });
  assert.equal(r.status, 2);
});

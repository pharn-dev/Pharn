#!/usr/bin/env node
// .claude/hooks/protect-trusted-paths.cjs — pre-write floor (CONSTITUTION P2, fix #2).
//
// Deterministic, non-LLM. A Claude Code PreToolUse hook that BLOCKS any Write/Edit/MultiEdit to a
// trusted file. Trust-by-location is only real if the location is write-protected at the floor —
// otherwise an injected instruction that gets a Write to CONSTITUTION.md rewrites the trusted layer.
//
// Protected by default: the four trusted spec docs + CODEOWNERS, the GitHub-layer write-guard itself,
// AND the two pre-write guards' own control surface — .claude/settings.json (which wires both hooks) plus
// the three hook scripts. Guarding CODEOWNERS locally is "guarding the guard": if the agent could rewrite
// it, it could delete the human-only review requirement and collapse the GitHub-layer trust control (P2).
// The .claude/ entries turn that same idea on this hook itself: each hook file is re-read fresh on every
// tool call, so overwriting one disarms that guard on the very next write, and settings.json can unwire
// both at once. A guard the agent may rewrite is not a floor op — it is a suggestion (P0).
//
// Those entries are `.claude/`-QUALIFIED PATH FRAGMENTS, deliberately not bare basenames: isProtected()
// also compares the last path segment, so a bare "settings.json" would deny a user's own settings.json or
// .vscode/settings.json, and a bare "enforce-writes-scope.cjs" would deny src/enforce-writes-scope.cjs.
// The slashed form matches only via the === / fragment branches in matchesFragment(), which require a
// path boundary after the fragment (end-of-string or `/`), so a suffixed name like
// `.claude/settings.json.bak` does not match `.claude/settings.json`. Residual: matching is still
// case-sensitive, and the basename branch still fires on an exact last-segment match. `.claude/commands/**`
// and `.claude/hooks/*.test.cjs` are deliberately NOT protected: the commands are the methodology this
// repo edits every increment, and a guard that froze its own tests would be unmaintainable.
// Extend further with the PHARN_PROTECTED env var (comma-separated basenames or path fragments).
//
// Symlink-safe: the write target is canonicalized with fs.realpathSync (a nearest-existing-ancestor
// walk) BEFORE the protected test, so a committed symlink in an allowed dir (e.g. features/notes.md
// -> ../CONSTITUTION.md) that resolves onto a trusted file is denied — not merely the literal name.
// Residual: this resolves EXISTING symlink targets (the committed-symlink vector); a broken symlink
// (target absent) falls back to the lexical path, but it can only create a new file at a missing path
// — it cannot reach an existing trusted doc, so the trusted-doc guarantee holds. (Bash-tool writes
// bypass PreToolUse hooks entirely — a separate, pre-existing limit, not addressed here, and it applies
// to the .claude/ entries above exactly as it does to the trusted docs.)
//
// Composes with set-writes-scope.cjs, which REFUSES to emit a scope naming these same four control paths
// unless --allow-claude-dir is passed. The two are independent: this denylist holds no matter what scope
// was set, so neutering the setter's refusal still does not make a control file writable.
//
// Wired via .claude/settings.json (PreToolUse matcher: Write|Edit|MultiEdit).

"use strict";

const fs = require("fs");
const path = require("path");

// Repo root with symlinks resolved, so a canonicalized target below shares a common prefix with it.
const ROOT = (() => {
  try {
    return fs.realpathSync(process.cwd());
  } catch {
    return process.cwd();
  }
})();

// Canonicalize a (possibly not-yet-existent) write target through symlinks: realpath the nearest
// existing ancestor — which resolves any committed symlink at any depth — then re-append the missing
// tail. Deterministic; no LLM. A new file whose ancestors contain no symlink resolves to its lexical
// path, so ordinary writes are unaffected.
function resolveWriteTarget(p) {
  const abs = path.resolve(ROOT, String(p));
  const missing = [];
  let cur = abs;
  for (;;) {
    try {
      const real = fs.realpathSync(cur);
      return missing.length ? path.join(real, ...missing) : real;
    } catch {
      const parent = path.dirname(cur);
      if (parent === cur) return abs; // reached filesystem root; nothing existed -> lexical fallback
      missing.unshift(path.basename(cur));
      cur = parent;
    }
  }
}

const DEFAULT_PROTECTED = [
  "CONSTITUTION.md",
  "ARCHITECTURE.md",
  "THREAT-MODEL.md",
  "LIMITS.md",
  "CODEOWNERS",
  // The pre-write guards' own control surface (see the header): `.claude/`-qualified fragments, never bare
  // basenames. Kept identical to CONTROL_SURFACE in set-writes-scope.cjs.
  ".claude/settings.json",
  ".claude/hooks/protect-trusted-paths.cjs",
  ".claude/hooks/enforce-writes-scope.cjs",
  ".claude/hooks/set-writes-scope.cjs",
];
const extra = (process.env.PHARN_PROTECTED || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const PROTECTED = [...DEFAULT_PROTECTED, ...extra];

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function extractPaths(toolInput) {
  if (!toolInput || typeof toolInput !== "object") return [];
  const paths = [];
  if (typeof toolInput.file_path === "string") paths.push(toolInput.file_path);
  if (typeof toolInput.path === "string") paths.push(toolInput.path);
  // MultiEdit: edits[] each may carry file_path; some shapes nest under .edits
  if (Array.isArray(toolInput.edits)) {
    for (const e of toolInput.edits) if (e && typeof e.file_path === "string") paths.push(e.file_path);
  }
  return paths;
}

function matchesFragment(norm, x) {
  if (norm === x || norm.split("/").pop() === x) return true;
  const needle = "/" + x;
  for (let idx = norm.indexOf(needle); idx !== -1; idx = norm.indexOf(needle, idx + 1)) {
    const after = idx + needle.length;
    if (after === norm.length || norm[after] === "/") return true;
  }
  return false;
}

function isProtected(p) {
  const norm = String(p).replace(/\\/g, "/");
  return PROTECTED.some((prot) => matchesFragment(norm, prot.replace(/\\/g, "/")));
}

const raw = readStdin();
let payload;
try {
  payload = JSON.parse(raw || "{}");
} catch {
  payload = {};
}

const toolName = payload.tool_name || payload.toolName || "";
const toolInput = payload.tool_input || payload.toolInput || {};
const isWrite = /^(Write|Edit|MultiEdit)$/i.test(toolName) || (!toolName && extractPaths(toolInput).length);

if (isWrite) {
  // Deny if EITHER the literal path OR its symlink-resolved real target is protected. The literal
  // check is kept first, so a direct write to a trusted file behaves exactly as before (no regression).
  const offender = extractPaths(toolInput)
    .map((rawPath) => ({ rawPath, real: resolveWriteTarget(rawPath) }))
    .find(({ rawPath, real }) => isProtected(rawPath) || isProtected(real));
  if (offender) {
    const shown = isProtected(offender.rawPath) ? offender.rawPath : `${offender.rawPath} -> ${offender.real}`;
    const reason = `BLOCKED by PHARN floor: ${shown} is (or resolves to) a trusted file (CONSTITUTION P2 / fix #2). Trusted spec is human-only; the build agent may not write it. If a change is genuinely needed, a human edits it outside the agent loop.`;
    // Current Claude Code form:
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: reason,
        },
        decision: "block",
        reason,
      })
    );
    // Also emit on stderr and use exit 2 for older versions that block on non-zero exit:
    process.stderr.write(reason + "\n");
    process.exit(2);
  }
}

// allow
process.exit(0);

#!/usr/bin/env node
// .claude/hooks/protect-trusted-paths.cjs — pre-write floor (CONSTITUTION P2, fix #2).
//
// Deterministic, non-LLM. A Claude Code PreToolUse hook that BLOCKS any Write/Edit/MultiEdit to a
// trusted file. Trust-by-location is only real if the location is write-protected at the floor —
// otherwise an injected instruction that gets a Write to pharn/CONSTITUTION.md rewrites the trusted layer.
//
// Protected by default: the four trusted spec docs + CODEOWNERS, the GitHub-layer write-guard itself,
// AND the two pre-write guards' own control surface — .claude/settings.json (which wires both hooks) plus
// the three hook scripts. Guarding CODEOWNERS locally is "guarding the guard": if the agent could rewrite
// it, it could delete the human-only review requirement and collapse the GitHub-layer trust control (P2).
// The .claude/ entries turn that same idea on this hook itself: each hook file is re-read fresh on every
// tool call, so overwriting one disarms that guard on the very next write, and settings.json can unwire
// both at once. A guard the agent may rewrite is not a floor op — it is a suggestion (P0).
//
// MATCHING: REPO-RELATIVE, CASE-FOLDED, EXACT. Every entry is a path relative to the repo root, and a
// write is denied only when the target's own repo-relative path equals one of them, compared lower-cased.
// Trust here is by LOCATION, so the match is by location too. The earlier basename and path-fragment
// branches were REMOVED because both over-matched at depth: they denied a USER's own docs/ARCHITECTURE.md
// and docs/THREAT-MODEL.md, while PHARN's real docs live at pharn/ARCHITECTURE.md — trust-by-location
// enforced by name. Exact repo-relative matching is strictly narrower: it can no longer reach a file that
// merely shares a name, and a suffixed path (pharn/ARCHITECTURE.md.bak) is a different key, so it is not a
// match either. `.claude/commands/**` and `.claude/hooks/*.test.cjs` are deliberately NOT protected: the
// commands are the methodology this repo edits every increment, and a guard that froze its own tests would
// be unmaintainable. Extend with the PHARN_PROTECTED env var (comma-separated repo-relative paths, matched
// by this same rule).
//
// CASE-FOLDING APPLIES TO THE WHOLE PATH, INCLUDING THE ROOT PREFIX. Folding only the tail would leave a
// hole big enough to drive every trusted doc through: path.relative() compares case-SENSITIVELY, so a
// case-varied root in an ABSOLUTE write path (/users/... for /Users/...) escapes relativization and reads
// as "outside the repo" — while naming the very same file. That vector was found by ATTACKING this
// matcher, not by reasoning about it, which is why the prefix strip is a folded comparison rather than
// path.relative(). See toKey() for why the fold is not a bare toLowerCase().
//
// NAMED RESIDUAL (P0): the fold is toUpperCase().toLowerCase() plus NFC — close to, but not identical
// with, the Unicode full case-folding a case-insensitive filesystem applies. It covers the spellings that
// were actually demonstrated to open a trusted file here (U+017F, U+00DF, U+FB05/06). It is NOT a proof
// that no exotic equivalence remains, and this hook has never been a defense against a caller that can
// run Bash anyway — that bypass is stated below and is the larger hole by far.
//
// CASE-FOLDING IS FAIL-SAFE, NOT FREE (P0 — stated, not hidden). realpath does NOT normalize case: on a
// case-INSENSITIVE filesystem (macOS and Windows defaults) `pharn/constitution.md` opens the very same
// bytes as `pharn/CONSTITUTION.md`, yet realpath returns the spelling as given — so without the fold a
// case-variant write reaches a trusted doc unblocked. The fold closes that. The cost lands on a
// case-SENSITIVE filesystem (Linux; case-sensitive APFS), where `pharn/constitution.md` is a genuinely
// DIFFERENT file that this guard will nonetheless deny. A deliberate trade in the safe direction — over-
// block one same-named-but-different file rather than under-block the real trusted doc on the two most
// common development platforms — and the one place this change widens rather than narrows.
//
// CODEOWNERS is matched at all THREE GitHub-recognized locations (root, .github/, docs/). It is the one
// entry whose protection is location-CLASS rather than path-specific: GitHub honors whichever of the three
// exists, so each is a live review gate. PHARN's own is .github/CODEOWNERS; the other two are dormant here.
//
// Symlink-safe: the write target is canonicalized with fs.realpathSync (a nearest-existing-ancestor
// walk) BEFORE the protected test, so a committed symlink in an allowed dir (e.g. features/notes.md
// -> ../pharn/CONSTITUTION.md) that resolves onto a trusted file is denied — not merely the literal name.
// Residual: this resolves EXISTING symlink targets (the committed-symlink vector); a broken symlink
// (target absent) falls back to a lexical tail, but it can only create a new file at a missing path
// — it cannot reach an existing trusted doc, so the trusted-doc guarantee holds. (Bash-tool writes
// bypass PreToolUse hooks entirely — a separate, pre-existing limit, not addressed here, and it applies
// to the .claude/ entries above exactly as it does to the trusted docs.)
//
// ANCHORING IS TO THE HOOK'S OWN LOCATION, NOT cwd, and that correction was forced by measurement.
// Anchoring the protected set to cwd looked free — resolveWriteTarget already resolved relative paths
// against cwd — but it is not the same thing: relativizing the PROTECTED SET against cwd means the guard
// protects nothing at all whenever the agent runs from a subdirectory (every trusted doc relativizes to a
// `../` escape and reads as "outside the repo"), and it leaves PHARN unprotected when installed at a
// subpath of a larger project. ROOT is therefore <this file>/../.. — the hook always ships beside the
// files it guards. cwd is used ONLY where the tool payload actually means it: resolving a relative
// write path. A target outside ROOT is never protected — it is not a file this hook guards.
//
// Composes with set-writes-scope.cjs, which REFUSES to emit a scope naming these same four control paths
// unless --allow-claude-dir is passed. The two are independent: this denylist holds no matter what scope
// was set, so neutering the setter's refusal still does not make a control file writable.
//
// Wired via .claude/settings.json (PreToolUse matcher: Write|Edit|MultiEdit).

"use strict";

const fs = require("fs");
const path = require("path");

function realpathOr(p) {
  try {
    return fs.realpathSync(p);
  } catch {
    return p;
  }
}

// The directory a RELATIVE write path is relative to. That is the caller's cwd, by definition of the
// tool payload — never the anchor below.
const CWD = realpathOr(process.cwd());

// The PHARN root this hook guards, derived from the hook's OWN location: <root>/.claude/hooks/<this>.
// Deliberately NOT cwd. Anchoring the protected set to cwd made every guarantee evaporate whenever the
// agent ran from a subdirectory (the trusted docs then relativize to a `../` escape and read as "outside
// the repo"), and it left PHARN unprotected when installed at a subpath of a larger project. The hook
// always ships beside the files it protects, so its own path is the one anchor that cannot drift.
// Symlinks resolved, so a canonicalized target below shares a common prefix with it.
const ROOT = realpathOr(path.resolve(__dirname, "..", ".."));

// Canonicalize a (possibly not-yet-existent) write target through symlinks, ONE SEGMENT AT A TIME.
// Deterministic; no LLM. A new file whose ancestors contain no symlink resolves to its lexical path, so
// ordinary writes are unaffected.
//
// WHY SEGMENT-WISE, and not path.resolve() then realpath the nearest existing ancestor: path.resolve()
// collapses `..` LEXICALLY, which is not what the filesystem does. Given a symlink `a -> pharn/sub`, the
// path `a/../ARCHITECTURE.md` lexically collapses to `./ARCHITECTURE.md` — an unprotected path — while
// the OS actually opens pharn/ARCHITECTURE.md. That is a write onto a trusted doc through a guard that
// said ALLOW; it was demonstrated by performing the write, not by reading the code. Resolving each
// segment in turn, and taking `..` from the REAL parent of the resolved prefix, is what closes it.
function resolveWriteTarget(p) {
  const raw = String(p).replace(/\\/g, "/");
  let cur = realpathOr(path.isAbsolute(raw) ? path.parse(path.resolve(raw)).root : CWD);
  const missing = [];
  for (const seg of raw.split("/")) {
    if (!seg || seg === ".") continue;
    // Once a segment does not exist, nothing below it can be resolved: keep the rest as a lexical tail.
    if (missing.length) {
      missing.push(seg);
      continue;
    }
    const next = seg === ".." ? path.dirname(cur) : path.join(cur, seg);
    const real = (() => {
      try {
        return fs.realpathSync(next);
      } catch {
        return null; // segment absent (or a broken link): resolve no further
      }
    })();
    if (real === null) missing.push(seg);
    else cur = real;
  }
  return missing.length ? path.join(cur, ...missing) : cur;
}

const DEFAULT_PROTECTED = [
  // The four trusted spec docs at their real repo-relative locations (see the header: anchored paths,
  // never bare basenames — a basename denies a user's own same-named file and protects the wrong one).
  "pharn/CONSTITUTION.md",
  "pharn/ARCHITECTURE.md",
  "THREAT-MODEL.md",
  "LIMITS.md",
  // CODEOWNERS at the three GitHub-recognized locations; whichever exists is a live review gate.
  "CODEOWNERS",
  ".github/CODEOWNERS",
  "docs/CODEOWNERS",
  // The pre-write guards' own control surface (see the header). Kept identical to CONTROL_SURFACE in
  // set-writes-scope.cjs; the two declarations are pinned equal by a ✧ test in set-writes-scope.test.cjs.
  ".claude/settings.json",
  ".claude/hooks/protect-trusted-paths.cjs",
  ".claude/hooks/enforce-writes-scope.cjs",
  ".claude/hooks/set-writes-scope.cjs",
];
const extra = (process.env.PHARN_PROTECTED || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// PHARN_PROTECTED keeps its ORIGINAL semantics for a bare name, deliberately. Narrowing every entry to an
// exact repo-relative path would silently strip protection from an operator's existing setting — a guard
// that fails OPEN on a config it used to honor. An entry containing `/` is an exact repo-relative path;
// an entry without one still matches that basename at any depth. There is no over-block victim here: an
// env entry is an explicit operator opt-in, unlike the default set, whose bare basenames denied a USER's
// own same-named files.
const EXTRA_BASENAMES = new Set(extra.filter((e) => !e.includes("/")).map(toKey));
const EXTRA_EXACT = new Set(extra.filter((e) => e.includes("/")).map(toKey));

// Fold an entry / a path to its comparison key: forward slashes, `./` and `a/../` collapsed, Unicode
// normalized, case folded. Lexical only — never a realpath (the target is canonicalized separately).
//
// The fold is toUpperCase().toLowerCase(), NOT a bare toLowerCase(). toLowerCase alone is SIMPLE case
// mapping, and this filesystem compares with FULL case folding: `ſ` (U+017F) lowercases to itself, yet
// `pharn/CONſTITUTION.md` opens the real pharn/CONSTITUTION.md. Upper-casing first maps `ſ`→`S`, `ß`→`SS`
// and `ﬅ`→`ST`, so those spellings fold onto the protected key instead of slipping past it. Verified by
// reading the file through the varied spelling, not by reasoning about the table.
function toKey(rel) {
  return path.posix.normalize(String(rel).replace(/\\/g, "/")).normalize("NFC").toUpperCase().toLowerCase();
}

const PROTECTED_KEYS = new Set(DEFAULT_PROTECTED.map(toKey));
const ROOT_KEY = toKey(ROOT);

// Exact membership over the target's repo-relative path (ARCHITECTURE §2 primitive #3). Takes an
// ABSOLUTE path — callers pass both the ROOT-resolved literal and the symlink-canonicalized target.
//
// The ROOT prefix is stripped CASE-INSENSITIVELY, and that is load-bearing rather than cosmetic:
// path.relative() compares case-SENSITIVELY, so an absolute write path spelled with a different-cased
// root (/users/... where ROOT is /Users/...) relativizes to a `../` ESCAPE. On a case-insensitive
// filesystem that spelling opens the very same trusted file — realpath preserves the given spelling
// rather than normalizing it — so treating the escape as "outside the repo" would ALLOW a write onto
// every entry in the list. Folding both sides is what closes it.
function isProtected(abs) {
  const key = toKey(path.resolve(String(abs)));
  // A bare PHARN_PROTECTED name matches at any depth, inside ROOT or not (see EXTRA_BASENAMES above).
  if (EXTRA_BASENAMES.size && EXTRA_BASENAMES.has(key.split("/").pop())) return true;
  const prefix = ROOT_KEY.endsWith("/") ? ROOT_KEY : ROOT_KEY + "/";
  // Not under ROOT (this also rejects ROOT itself) means the target is not a file this hook guards.
  if (!key.startsWith(prefix)) return false;
  const rel = key.slice(prefix.length);
  return PROTECTED_KEYS.has(rel) || EXTRA_EXACT.has(rel);
}

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
  // Deny if EITHER the literal path (resolved against ROOT) OR its symlink-canonicalized real target is
  // protected. The literal check is kept first, so a direct write to a trusted file behaves exactly as
  // before (no regression) and the message reports the name the caller actually used.
  const offender = extractPaths(toolInput)
    .map((rawPath) => ({
      rawPath,
      literal: path.resolve(ROOT, String(rawPath)),
      real: resolveWriteTarget(rawPath),
    }))
    .find(({ literal, real }) => isProtected(literal) || isProtected(real));
  if (offender) {
    const shown = isProtected(offender.literal) ? offender.rawPath : `${offender.rawPath} -> ${offender.real}`;
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

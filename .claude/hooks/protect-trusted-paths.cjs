#!/usr/bin/env node
// .claude/hooks/protect-trusted-paths.cjs — pre-write floor (CONSTITUTION P2, fix #2).
//
// Deterministic, non-LLM. A Claude Code PreToolUse hook that BLOCKS any Write/Edit/MultiEdit to a
// trusted file. Trust-by-location is only real if the location is write-protected at the floor —
// otherwise an injected instruction that gets a Write to pharn/CONSTITUTION.md rewrites the trusted layer.
//
// Protected by default: the four trusted spec docs + CODEOWNERS, the GitHub-layer write-guard itself,
// AND the two pre-write guards' own control surface — the settings files that WIRE the hooks
// (.claude/settings.json and .claude/settings.local.json) plus the three hook scripts. Guarding
// CODEOWNERS locally is "guarding the guard": if the agent could rewrite it, it could delete the
// human-only review requirement and collapse the GitHub-layer trust control (P2). The .claude/ entries
// turn that same idea on this hook itself: each hook file is re-read fresh on every tool call, so
// overwriting one disarms that guard on the very next write, and either settings file can unwire both.
// A guard the agent may rewrite is not a floor op — it is a suggestion (P0).
//
// ── MATCHING ────────────────────────────────────────────────────────────────────────────────────────
// REPO-RELATIVE, EXACT, CASE- AND UNICODE-FOLDED. Every default entry is a path relative to a guarded
// root, and a write is denied only when the target's own relative path equals one of them under the
// fold. Trust here is by LOCATION, so the match is by location too. The earlier basename and
// path-fragment branches were REMOVED because both over-matched at depth: they denied a USER's own
// docs/ARCHITECTURE.md and docs/THREAT-MODEL.md while PHARN's real docs live under pharn/ — that is
// trust-by-location enforced by name. Exact matching is strictly narrower: it cannot reach a file that
// merely shares a name, and a suffixed path (pharn/ARCHITECTURE.md.bak) is a different key.
// `.claude/commands/**` and `.claude/hooks/*.test.cjs` are deliberately NOT protected: the commands are
// the methodology this repo edits every increment, and a guard that froze its own tests would be
// unmaintainable.
//
// ── WHAT THIS FILE LEARNED FROM BEING ATTACKED ──────────────────────────────────────────────────────
// The first repo-relative draft of this matcher was correct on every case its author thought of, and
// wrong on five that an adversarial sweep found by RUNNING it. Each guard below exists because a
// specific write reached a trusted file, or a specific input made this hook exit non-blocking:
//   1. The ROOT prefix must be folded too. path.relative() compares case-SENSITIVELY, so an absolute
//      path spelled with a differently-cased root (/users/… for /Users/…) relativized to a `../` escape
//      and read as "outside the repo" — while naming the very same file. Every entry was reachable.
//   2. The anchor must not be cwd. Relativizing the PROTECTED SET against cwd silently disabled the
//      whole guard whenever the agent ran from a subdirectory. cwd is used ONLY where the payload
//      actually means it: resolving a relative write path.
//   3. The anchor must not be __dirname ALONE. Node resolves a module's __dirname THROUGH symlinks, so
//      a hook symlinked in from a dotfiles repo anchored to the dotfiles checkout and left the real
//      project unguarded. Both the as-invoked path and the resolved path are therefore guarded roots.
//   4. `..` must be applied to the REAL parent. path.resolve() collapses `..` lexically, which is not
//      what the kernel does: with `a -> pharn/sub`, `a/../ARCHITECTURE.md` collapses to an unprotected
//      path while open() reaches pharn/ARCHITECTURE.md. Demonstrated by performing the write.
//   5. The fold must be full, not simple. `ſ` (U+017F) lowercases to ITSELF, yet pharn/CONſTITUTION.md
//      opens the real file on this filesystem. Upper-casing first maps ſ→S, ß→SS, ﬅ→ST.
// The lesson is recorded because the shape of the mistake repeats: every one of these was a guard that
// looked obviously correct in the source and was false against the filesystem (P6 — read live state).
//
// ── FAIL-CLOSED ─────────────────────────────────────────────────────────────────────────────────────
// A hook that exits with an unhandled throw exits 1, which Claude Code treats as a NON-BLOCKING error:
// the write proceeds. So every crash in a write-guard is a bypass. Three were found and are closed
// here — a deleted cwd (process.cwd() throws), a literal `null` stdin payload (JSON.parse returns null,
// which then dereferences), and a pathological path (path.join spread past the argument limit) — and
// the decision itself is wrapped so that ANY unexpected error DENIES rather than allows.
//
// ── HONEST BOUNDS (P0) ──────────────────────────────────────────────────────────────────────────────
// • Case-folding is fail-SAFE, not free. On a case-SENSITIVE volume `pharn/constitution.md` is a
//   genuinely different file that this guard nonetheless denies — reproduced on a case-sensitive APFS
//   image, distinct inodes. The trade is deliberate: over-block one same-named file rather than
//   under-block the real doc on the two commonest development platforms. Same for the trailing
//   dot/space strip (Windows semantics) and the Unicode fold, which is close to — but not provably
//   identical with — the filesystem's own equivalence.
// • Root-level entries (THREAT-MODEL.md, LIMITS.md, CODEOWNERS) still over-block a user's own
//   same-named file at the guarded root. That is structural: PHARN's own copies live there.
// • Bash-tool writes bypass PreToolUse hooks ENTIRELY. That is by far the largest hole in this guard
//   and no amount of path matching narrows it.
// • PHARN vendored at a SUBPATH of a larger project is not guarded: Claude Code loads .claude/ from
//   the project root, so the outer hook is the one that runs and the inner copy is just files to it.
// • A symlink inside a guarded root that points OUT of it is allowed — deliberately, since a second
//   checkout's CONSTITUTION.md is a different repo's file, and denying it was the original over-match.
//
// Composes with set-writes-scope.cjs, which REFUSES to emit a scope naming these same control paths
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

// The directory a RELATIVE write path is relative to — the caller's cwd, by definition of the payload.
// process.cwd() THROWS when the working directory has been deleted or made unreadable; unguarded that
// exits 1, which is a non-blocking hook error, so the guard would fail OPEN on it.
const CWD = (() => {
  try {
    return realpathOr(process.cwd());
  } catch {
    return ".";
  }
})();

// The roots this hook guards, derived from the hook's OWN location: <root>/.claude/hooks/<this file>.
// Deliberately NOT cwd (see the header, #2). BOTH spellings of that location are kept, because
// __dirname is symlink-RESOLVED: a hook symlinked in from a dotfiles checkout would otherwise anchor to
// the dotfiles repo and leave the real project unguarded (#3). process.argv[1] is the path as invoked.
const ROOTS = (() => {
  const dirs = [__dirname];
  try {
    if (typeof process.argv[1] === "string" && process.argv[1]) dirs.push(path.dirname(path.resolve(CWD, process.argv[1])));
  } catch {
    /* argv unavailable: __dirname alone still anchors the common case */
  }
  const out = [];
  for (const d of dirs) {
    let base;
    try {
      base = path.resolve(d, "..", "..");
    } catch {
      continue;
    }
    for (const v of [base, realpathOr(base)]) if (v && !out.includes(v)) out.push(v);
  }
  return out.length ? out : [CWD];
})();

const DEFAULT_PROTECTED = [
  // The four trusted spec docs at their real repo-relative locations (anchored paths, never bare
  // basenames — a basename denies a user's own same-named file and protects the wrong one).
  "pharn/CONSTITUTION.md",
  "pharn/ARCHITECTURE.md",
  "THREAT-MODEL.md",
  "LIMITS.md",
  // CODEOWNERS at the three GitHub-recognized locations; whichever exists is a live review gate.
  "CODEOWNERS",
  ".github/CODEOWNERS",
  "docs/CODEOWNERS",
  // The pre-write guards' own control surface. BOTH settings files are here: settings.local.json is a
  // real, loaded settings file that can wire or override the same hooks, so guarding only settings.json
  // left the control surface half-open. Kept identical to CONTROL_SURFACE in set-writes-scope.cjs; the
  // two declarations are pinned equal by a ✧ test in set-writes-scope.test.cjs.
  ".claude/settings.json",
  ".claude/settings.local.json",
  ".claude/hooks/protect-trusted-paths.cjs",
  ".claude/hooks/enforce-writes-scope.cjs",
  ".claude/hooks/set-writes-scope.cjs",
];

const extra = (process.env.PHARN_PROTECTED || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Fold a path to its comparison key: forward slashes, `./` and `a/../` collapsed, Unicode normalized,
// trailing dots/spaces stripped per segment, case folded. Lexical only — never a realpath.
//
// The fold is toUpperCase().toLowerCase(), NOT a bare toLowerCase(): toLowerCase alone is SIMPLE case
// mapping while this filesystem compares with FULL case folding (header, #5). The trailing dot/space
// strip is Windows semantics — the OS drops them, so `LIMITS.md.` opens LIMITS.md there; on POSIX those
// are distinct names and stripping them is a deliberate over-block in the safe direction.
function toKey(rel) {
  return path.posix
    .normalize(String(rel).replace(/\\/g, "/"))
    .normalize("NFC")
    .split("/")
    .map((s) => (s === "." || s === ".." ? s : s.replace(/[. ]+$/, "")))
    .join("/")
    .toUpperCase()
    .toLowerCase();
}

const PROTECTED_KEYS = new Set(DEFAULT_PROTECTED.map(toKey));
const ROOT_PREFIXES = ROOTS.map((r) => {
  const k = toKey(r);
  return k.endsWith("/") ? k : k + "/";
});

// PHARN_PROTECTED keeps its ORIGINAL basename/path-fragment semantics, deliberately. Narrowing it to
// exact repo-relative paths would silently strip protection from an operator's existing setting — a
// guard that fails OPEN on a config it used to honor, with no error. There is no over-block victim: an
// env entry is an explicit operator opt-in, unlike the default set, whose bare basenames denied a USER's
// own same-named files. Fragments require a path boundary, so `x/settings.json` does not match
// `settings.json.bak`.
const EXTRA_KEYS = extra.map(toKey);

function matchesExtra(key, entryKey) {
  if (key === entryKey || key.split("/").pop() === entryKey) return true;
  const needle = "/" + entryKey;
  for (let i = key.indexOf(needle); i !== -1; i = key.indexOf(needle, i + 1)) {
    const after = i + needle.length;
    if (after === key.length || key[after] === "/") return true;
  }
  return false;
}

// Hard links have no link to resolve, so realpath returns the alias unchanged and a path match never
// sees the trusted key — while the write mutates the same inode. Only files that ACTUALLY carry a
// second link are collected (nlink > 1), so in the normal case this set is empty and costs nothing.
const PROTECTED_INODES = (() => {
  const s = new Set();
  for (const root of ROOTS) {
    for (const rel of DEFAULT_PROTECTED) {
      try {
        const st = fs.statSync(path.join(root, rel));
        if (st.nlink > 1) s.add(st.dev + ":" + st.ino);
      } catch {
        /* absent here: nothing to alias */
      }
    }
  }
  return s;
})();

// Canonicalize a (possibly not-yet-existent) write target through symlinks, ONE SEGMENT AT A TIME.
//
// WHY segment-wise rather than path.resolve() then realpath: path.resolve() collapses `..` LEXICALLY,
// which is not what the filesystem does (header, #4). Note fs.realpathSync() cannot be used to show
// this either — it resolves `..` lexically too.
//
// A DANGLING symlink is resolved lexically rather than treated as an ordinary missing name, because a
// broken link pointing at an absent protected path (docs/CODEOWNERS) could otherwise be used to CREATE
// that file with attacker-chosen content. Hops are bounded so a self-referential link cannot spin.
const MAX_RESOLVED_SEGMENTS = 4096;

function fsRootOf(p) {
  try {
    return path.parse(path.resolve(p)).root;
  } catch {
    return path.sep;
  }
}

function resolveWriteTarget(p) {
  const raw = String(p).replace(/\\/g, "/");
  const fsRoot = (() => {
    try {
      return path.parse(path.resolve(raw)).root;
    } catch {
      return path.sep;
    }
  })();
  let cur;
  try {
    cur = realpathOr(path.isAbsolute(raw) ? fsRoot : CWD);
  } catch {
    cur = CWD;
  }
  let pending = raw.split("/").filter((s) => s && s !== ".");
  const missing = [];
  let hops = 0;
  let walked = 0;
  while (pending.length) {
    const seg = pending.shift();
    // Once a segment does not exist, nothing below it can be resolved: keep the rest as a lexical tail.
    if (missing.length) {
      missing.push(seg);
      continue;
    }
    // Bound the syscall walk. Resolution costs up to two syscalls per segment, so a path with hundreds
    // of thousands of segments made this hook take minutes — and a guard that HANGS stalls the agent
    // just as effectively as one that allows. Past the cap the remainder is kept lexically: a protected
    // path is three segments deep at most, so nothing reachable is given up.
    if (++walked > MAX_RESOLVED_SEGMENTS) {
      missing.push(seg);
      continue;
    }
    const next = seg === ".." ? path.dirname(cur) : path.join(cur, seg);
    const real = (() => {
      try {
        return fs.realpathSync(next);
      } catch {
        return null;
      }
    })();
    if (real !== null) {
      cur = real;
      continue;
    }
    // A DANGLING symlink still NAMES a target. Treating it as an ordinary missing name would let a
    // broken link pointing at an absent protected path (docs/CODEOWNERS) be used to CREATE that file
    // with attacker-chosen content. Its target is pushed back onto the queue SEGMENT-WISE rather than
    // adopted whole, so every component is still realpath-resolved — adopting it whole left the
    // prefix un-canonicalized (/var/... vs /private/var/...) and the match silently missed.
    let link = null;
    try {
      if (hops < 40 && fs.lstatSync(next).isSymbolicLink()) {
        link = fs.readlinkSync(next);
        hops++;
      }
    } catch {
      link = null;
    }
    if (link !== null) {
      const segs = link
        .replace(/\\/g, "/")
        .split("/")
        .filter((x) => x && x !== ".");
      // An absolute target restarts at the filesystem root; a relative one resolves against the link's
      // own directory, which is exactly `cur`.
      if (path.isAbsolute(link)) cur = realpathOr(fsRootOf(link));
      pending = segs.concat(pending);
      continue;
    }
    missing.push(seg);
  }
  // One join over a pre-joined tail. NOT path.join(cur, ...missing): the spread throws RangeError past
  // the argument limit, and an unhandled throw here exits 1 — a non-blocking error, so the write would
  // proceed. NOT a per-segment reduce either: that is quadratic in the total length.
  return missing.length ? path.join(cur, missing.join("/")) : cur;
}

// Exact membership over the target's path relative to a guarded root (ARCHITECTURE §2 primitive #3),
// plus the inode test for hard links and the operator's PHARN_PROTECTED fragments. Takes an ABSOLUTE
// path — callers pass both the cwd-resolved literal and the symlink-canonicalized target.
function isProtected(abs) {
  const key = toKey(path.resolve(String(abs)));
  if (PROTECTED_INODES.size) {
    try {
      const st = fs.statSync(abs);
      if (PROTECTED_INODES.has(st.dev + ":" + st.ino)) return true;
    } catch {
      /* absent: cannot be an alias of an existing file */
    }
  }
  if (EXTRA_KEYS.some((e) => matchesExtra(key, e))) return true;
  for (const prefix of ROOT_PREFIXES) {
    if (!key.startsWith(prefix)) continue; // not under this root (this also rejects the root itself)
    if (PROTECTED_KEYS.has(key.slice(prefix.length))) return true;
  }
  return false;
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
  for (const k of ["file_path", "path", "notebook_path"]) if (typeof toolInput[k] === "string") paths.push(toolInput[k]);
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
// JSON.parse("null") returns null and JSON.parse("42") a number — neither throws, and both then
// dereference into an uncaught TypeError (exit 1, non-blocking, write proceeds).
if (!payload || typeof payload !== "object" || Array.isArray(payload)) payload = {};

const toolName = payload.tool_name || payload.toolName || "";
const toolInput = payload.tool_input || payload.toolInput || {};
const isWrite = /^(Write|Edit|MultiEdit|NotebookEdit)$/i.test(toolName) || (!toolName && extractPaths(toolInput).length);

if (isWrite) {
  // Deny if EITHER the literal path (resolved against CWD, which is what a relative payload path means)
  // OR its symlink-canonicalized real target is protected. Evaluated per path and FAIL-CLOSED: if
  // deciding a path throws, that path is treated as protected rather than waved through.
  let offender = null;
  for (const rawPath of extractPaths(toolInput)) {
    let hit;
    try {
      const literal = path.resolve(CWD, String(rawPath));
      const real = resolveWriteTarget(rawPath);
      hit = isProtected(literal) || isProtected(real) ? { rawPath, literal, real } : null;
    } catch {
      hit = { rawPath, literal: String(rawPath), real: String(rawPath), errored: true };
    }
    if (hit) {
      offender = hit;
      break;
    }
  }
  if (offender) {
    let shown = offender.rawPath;
    try {
      if (!offender.errored && !isProtected(offender.literal)) shown = `${offender.rawPath} -> ${offender.real}`;
    } catch {
      /* keep the raw path in the message */
    }
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

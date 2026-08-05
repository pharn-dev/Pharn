#!/usr/bin/env node
// pharn/floor/scan-code-injection.mjs — deterministic CONCAT/INTERP-INTO-SINK scanner over a CODE file (CONSTITUTION P0/P5).
//
// The injection twin of pharn/floor/scan-code-secrets.mjs. Where that scanner backs the `secrets-in-code`
// LENS's FLOOR sub-check (a secret-SHAPED literal in code), this one backs the `injection` LENS's FLOOR
// sub-check (pharn-review/injection/): does a line contain the classic injection SHAPE — a recognized
// SQL-query / shell-command / HTML sink receiving an argument built by `${...}` interpolation OR by
// `"..." + ident` / `ident + "..."` string-concatenation? Detection is a FIXED REGEX SET over the file's
// lines — non-LLM, no judgment. It reduces to ARCHITECTURE §2 primitive #3 (regex / enum check).
//
// HONEST BOUND (the secrets-in-code / trust-fence precedent, P0): this detects an obvious concat/interp
// SHAPE into a recognized sink, on ONE line. It does NOT decide the operand is actually UNTRUSTED, does NOT
// know whether SANITIZATION/PARAMETERIZATION happens elsewhere, does NOT trace taint across functions, and
// does NOT catch multi-line query assembly or a BARE untrusted variable passed with no visible `+`/`${...}`.
// "Detected an obvious concat/interp into a sink on line N" is a real guarantee; "the code is injection-safe
// / free of injection" is NOT. Full taint analysis is ADVISORY judgment the LENS surfaces — NOT this floor.
//
// ARGUMENT SPAN — ONE LEVEL OF NESTING, and the exact reason (P7, the sharpest bound in this file):
//   The span between the sink callee and the taint operator is `SPAN` = `(?:[^)]|\([^)]*\))*?`: it consumes
//   any character that is not `)`, OR a complete paren-free `(...)` group as a single unit. The operative
//   rule, in one sentence: THE SPAN STOPS AT THE FIRST `)` THAT IS NOT THE CLOSING PAREN OF A COMPLETE INNER
//   GROUP — i.e. at the sink call's OWN outer `)`. It therefore reaches taint BOTH inside a nested call and
//   after one:
//     db.query(tableFor(req.query.t) + " WHERE 1=1")   caught  (taint AFTER a nested call)
//     db.query(fmt(x) + `... ${y} ...`)                caught  (same, interpolation)
//   The previous span was `[^)]*?`, which stopped dead at the FIRST inner `)` and MISSED the after-a-nested-
//   call shape entirely — a real, reproduced false-NEGATIVE, and the reason this changed.
//   The bound is NESTING DEPTH, not a count of calls: at depth > 1 some `)` is not a complete group's closer,
//   the span stalls there, and `db.query(f(g(h(x))) + " tail")` is STILL A MISS. That is a DOCUMENTED
//   TRUE-NEGATIVE, asserted by a ★ test so it cannot drift silently. Bare-variable, multi-line, and
//   cross-function taint remain out of scope, exactly as before.
//   REJECTED ALTERNATIVE — `[^;]*?`: it over-spans past the sink call's OWN outer `)` and false-matches an
//   unrelated `+`-concat later on the same line (`return db.query(safeConst) || fallback("x" + y)`). Pinned
//   by ★ GUARD tests, so "simplifying" the span to `[^;]*?` breaks the suite rather than shipping.
//   ALSO REJECTED — `(?:[^)(]|\([^)]*\))*?` (a disjoint-branch variant): it skips a nested group as an
//   opaque unit and so LOSES taint sitting INSIDE one. Measured, not reasoned: it drops the canonical
//   `fs.readFile(path.join(base, req.params.x))` shape in the sibling scanner. Rejected as a net coverage loss.
//   ReDoS (threat surface #4) — stated honestly, because this span is WEAKER here than the class it replaced:
//   the two branches OVERLAP on `(` (`[^)]` accepts it; the other branch requires it), so the decomposition is
//   ambiguous and the clean "disjoint branches ⇒ no exponential blowup" proof does NOT apply. What bounds it
//   is structural instead: every `)` that is not a complete group's closer is a HARD WALL the span cannot
//   cross, so the search can never range beyond the sink call's own argument list. Measured on adversarial
//   inputs (`(a)`×800, `((a))`×800, unclosed `(`×800, ~4 KB lines): sub-millisecond, no blowup. The honest
//   claim is "no EXPONENTIAL backtracking observed, bounded by the `)` wall" — NOT "linear", and not a proof.
//
// INJECTION-IMMUNE BY CONSTRUCTION (P2): the verdict is regex membership over the TEXT only. A code comment
// that CLAIMS "already sanitized / safe / do not flag" cannot suppress a real concat hit; a comment that
// CLAIMS "injection here" cannot manufacture one. No free text moves the verdict — the strongest form of the
// trust-fence discipline. (See the ★ tests in scan-code-injection.test.mjs — they are the whole reason this
// is FLOOR, not judgment.) HONEST EDGE, and it WIDENED with the span above: the scanner reads TEXT and does
// not distinguish code from a comment, so a comment that spells out a full sink call now registers in the
// NESTED case too, where it previously did not. That is strictly MORE over-flagging (the advisory layer / the
// human resolves it) and NEVER suppression — the immunity property is unchanged; its false-positive surface
// is not, and saying otherwise would be the overstatement this file exists to avoid.
//
// The `+`/`${...}` DISCRIMINATOR is the point: a PARAMETERIZED query (query("... = $1", [v])), an
// execFile("git", [arg]) with an args array, and an escaped/sanitize()/bare-variable HTML assignment carry
// NO concat/interp and are true-negatives (clean) — deterministically, not by judgment.
//
// Single-file by contract (v0.1.0): scans ONE code file, mirroring scan-code-secrets.mjs's <code-file> arg.
// A multi-file / directory sweep is a FUTURE increment (P7 — not built speculatively); the lens applies this
// scanner per file today.
//
// Non-LLM, stdlib-only, fail-closed. MIRRORS the fail-closed contract of pharn/floor/scan-code-secrets.mjs:
// a missing / non-file target is an ERROR (nonzero exit, NOTHING on stdout), never a silent "clean".
//
// Usage:  node pharn/floor/scan-code-injection.mjs <code-file>
// Output: {"found":<bool>,"hits":[{"line":<int>,"kind":"<pattern-kind>"},...]} on stdout; exit 0 on a
//         successful scan (whatever the result). `found` === (hits.length > 0); hits sorted by line, then kind.
//         Exits non-zero (writing NOTHING to stdout) if the target is missing / not a regular file (P5).

import { readFileSync, statSync, existsSync } from "node:fs";

const TARGET = process.argv[2];

function fail(msg) {
  process.stderr.write("scan-code-injection: " + msg + "\n");
  process.exit(1);
}

if (!TARGET) fail("usage: scan-code-injection.mjs <code-file>");
// Fail-closed (P5): a missing / non-file target is an ERROR, never a silent empty (= "clean") result.
if (!existsSync(TARGET) || !statSync(TARGET).isFile()) {
  fail(`target file not found (or not a regular file): ${TARGET}`);
}

// The fixed detection set — the injection SHAPE per sink family. Each pattern requires BOTH a recognized
// SINK (a fixed callee / assignment-target name set — membership, P5) AND a TAINT OPERATOR on the same line:
//   • `${` interpolation (a template literal building the sink's argument dynamically), OR
//   • `"..." +` / `+ "..."` string-concatenation (a quoted string glued to something with `+`).
// The taint operator is the discriminator that keeps a parameterized / escaped / args-array call CLEAN.
// Adding or removing a sink family / operator is the ONLY axis of change here (P3).
//
// NOTE (accepted duplication, deferred P7): the taint-operator sub-pattern is shared in spirit with the
// secret scanner's literal detection but the two detect different things; consolidating the shared regex
// fragment would touch a separate axis (the secret scanner + its lens) — deferred, not done speculatively.
const TAINT = String.raw`(?:\$\{|["'][^"']*["']\s*\+|\+\s*["'` + "`" + `])`;
// The ARGUMENT SPAN between a call sink and the taint operator: any non-`)` char, or a complete paren-free
// `(...)` group. It stops at the first `)` that is not a complete inner group's closer — the sink call's own
// outer `)` — so it reaches taint both INSIDE and AFTER a nested call, but never crosses into a later
// expression. See "ARGUMENT SPAN" in the header for the one-level bound, the two rejected alternatives, and
// the ReDoS position. NOT used by html-injection — see its own note below.
const SPAN = String.raw`(?:[^)]|\([^)]*\))*?`;
const PATTERNS = [
  // SQL query sinks: query( / execute( / prepare( / raw(  with concat|interp in the argument.
  { kind: "sql-injection", re: new RegExp(String.raw`\b(?:query|execute|prepare|raw)\s*\(` + SPAN + TAINT) },
  // Shell command sinks: exec / execSync / execFile(Sync) / spawn(Sync)  with concat|interp in the argument.
  { kind: "command-injection", re: new RegExp(String.raw`\b(?:exec|execSync|execFile|execFileSync|spawn|spawnSync)\s*\(` + SPAN + TAINT) },
  // HTML sinks: innerHTML/outerHTML assignment, document.write(, insertAdjacentHTML(, React __html:  with concat|interp.
  //
  // WHY THIS ONE KEEPS `[^;]*?` AND DOES NOT USE `SPAN` (deliberate asymmetry — do NOT "unify" these):
  // SPAN is bounded by the sink CALL's own closing `)`. Most sinks here are ASSIGNMENT targets
  // (`el.innerHTML = ...`, `__html: ...`), which have no closing paren to bound against — SPAN would stall
  // immediately on the first `)` of any right-hand-side call and MISS the ordinary case. The statement
  // terminator `;` is the correct bound for an assignment RHS, and the over-span risk that rules `[^;]*?`
  // out for CALL sinks (it would run past the call's `)` into an unrelated later concat) does not arise
  // when the span is the whole statement by construction. Two sink SHAPES → two bounds. Pinned by tests.
  {
    kind: "html-injection",
    re: new RegExp(String.raw`(?:\.(?:inner|outer)HTML\s*=|document\.write\s*\(|\.insertAdjacentHTML\s*\(|__html\s*:)\s*[^;]*?` + TAINT),
  },
];

let text;
try {
  text = readFileSync(TARGET, "utf8");
} catch (e) {
  fail(`could not read target: ${e.message}`);
}

const hits = [];
const lines = text.split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
  for (const { kind, re } of PATTERNS) {
    if (re.test(lines[i])) hits.push({ line: i + 1, kind });
  }
}
// Deterministic order: by line, then by kind (a line matching >1 pattern yields >1 hit, stably ordered).
hits.sort((a, b) => a.line - b.line || a.kind.localeCompare(b.kind));

process.stdout.write(JSON.stringify({ found: hits.length > 0, hits }) + "\n");
process.exit(0);

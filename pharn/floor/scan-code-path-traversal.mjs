#!/usr/bin/env node
// pharn/floor/scan-code-path-traversal.mjs — deterministic REQUEST-SOURCE-INTO-FILESYSTEM-PATH-SINK scanner
// over a CODE file (CONSTITUTION P0/P5).
//
// The path-traversal sibling of pharn/floor/scan-code-injection.mjs and pharn/floor/scan-code-deserialization.mjs.
// It backs the `path-traversal` LENS's FLOOR sub-check (pharn-review/path-traversal/): does a line pass a
// recognized HTTP-request source token DIRECTLY into a recognized filesystem-path sink —
//   • fs-path:   fs.<m>( | fs.promises.<m>( | fsPromises.<m>(   (any Node filesystem call: readFile, writeFile,
//                createReadStream, unlink, readdir, …) with a request source among its arguments
//   • path-join: path.join( | path.resolve(                     (a path built from a request source)
//   • send-file: .sendFile( | .download(                        (Express response file sink) with a request source
// Detection is a FIXED PATTERN SET over the file's lines — non-LLM, no judgment. It reduces to ARCHITECTURE
// §2 primitive #3 (regex / enum check).
//
// WHY THE DISCRIMINATOR IS THE UNTRUSTED SOURCE, NOT A CONCAT/INTERP OPERATOR (the key divergence from
// scan-code-injection.mjs — read this, it is the whole honesty of this file, P0):
//   injection uses the `+`/`${...}` operator as its discriminator because a PARAMETERIZED query is safe, so the
//   operator SHAPE itself is the danger. But for a FILESYSTEM PATH, a bare concat/join is the NORMAL, SAFE way
//   to build a path (`path.join(__dirname, "config.json")`, `dir + "/config.json"`). A concat-into-fs
//   discriminator would fire on CORRECTLY-built paths — a false-positive flood, i.e. a "manufactured floor"
//   (the exact thing the `input-validation` lens refused, fix #3). The honest line-local discriminator for
//   TRAVERSAL is instead a recognized untrusted HTTP-request SOURCE token
//   (`req|request . params|query|body|headers|cookies`) appearing directly inside the sink's argument list:
//   the untrusted SOURCE is what distinguishes dangerous (untrusted part → traversal) from safe (trusted
//   parts → fine). Membership over TEXT → injection-immune → FLOOR.
//
// HONEST BOUND (the injection / secrets-in-code precedent, P0): this detects the PRESENCE of a request source
// in a path sink's argument on ONE line. It does NOT decide the value is unsanitized (a `path.basename(...)`, a
// `..` rejection, an allow-list, or a `realpath` containment check may neutralize it — that is the LENS's
// ADVISORY layer), does NOT trace taint, and — the most important miss to foreground — does NOT catch an
// untrusted value arriving via a LOCAL VARIABLE (`const f = req.params.file; fs.readFile(f)` — the source token
// is not on the sink line), nor NON-HTTP sources (process.argv/env/queues), nor OTHER-runtime sinks (Python
// `open()`), nor an ALIASED sink (`const rf = fs.readFile`), nor multi-line argument assembly, nor argument
// nesting DEEPER than one level (see ARGUMENT SPAN below).
// "Detected a request source reaching a filesystem-path sink on line N" is a real guarantee; "the code is
// path-traversal-safe / free of traversal" is NOT. Full taint analysis is ADVISORY judgment the LENS surfaces
// — NOT this floor.
//
// ARGUMENT SPAN — ONE LEVEL OF NESTING, and the exact reason (P7, the sharpest bound in this file):
//   The span between the sink callee and the request-source token is `SPAN` = `(?:[^)]|\([^)]*\))*?`: it
//   consumes any character that is not `)`, OR a complete paren-free `(...)` group as a single unit. The
//   operative rule, in one sentence: THE SPAN STOPS AT THE FIRST `)` THAT IS NOT THE CLOSING PAREN OF A
//   COMPLETE INNER GROUP — i.e. at the sink call's OWN outer `)`. It therefore reaches a source BOTH inside a
//   nested call and after one — and BOTH shapes are canonical here:
//     fs.readFile(path.join(base, req.params.x))    caught  (source INSIDE a nested call)
//     path.join(rootDir(), req.query.f)             caught  (source AFTER a nested call)
//     fs.readFile(resolveRoot(base), req.query.f)   caught  (same)
//   The previous span was `[^)]*?`, which stopped dead at the FIRST inner `)`: it got the inside-a-nested-call
//   shape but MISSED the after-a-nested-call one. That mattered here more than anywhere — computing the base
//   directory with a helper call is the ORDINARY way this code is written, so the miss sat on the most
//   realistic shape of the vulnerability (a real, reproduced false-NEGATIVE, and the reason this changed).
//   The bound is NESTING DEPTH, not a count of calls: at depth > 1 some `)` is not a complete group's closer,
//   the span stalls there, and `path.join(f(g(h(x))), req.query.f)` is STILL A MISS. That is a DOCUMENTED
//   TRUE-NEGATIVE, asserted by a ★ test so it cannot drift silently.
//   REJECTED ALTERNATIVE — `[^;]*?`: it over-spans past the sink call's OWN outer `)` and false-matches an
//   unrelated request source later on the same line (`return path.join(A, B) || note(req.query.x)`). Pinned
//   by ★ GUARD tests, so "simplifying" the span to `[^;]*?` breaks the suite rather than shipping.
//   ALSO REJECTED — `(?:[^)(]|\([^)]*\))*?` (a disjoint-branch variant): it skips a nested group as an opaque
//   unit and so LOSES a source sitting INSIDE one. Measured, not reasoned: it drops the canonical
//   `fs.readFile(path.join(base, req.params.x))` above — the single most important shape this file detects.
//   Rejected as a net coverage loss.
//   ReDoS (threat surface #4) — stated honestly, because this span is WEAKER here than the class it replaced:
//   the two branches OVERLAP on `(` (`[^)]` accepts it; the other branch requires it), so the decomposition is
//   ambiguous and the clean "disjoint branches ⇒ no exponential blowup" proof does NOT apply. What bounds it
//   is structural instead: every `)` that is not a complete group's closer is a HARD WALL the span cannot
//   cross, so the search can never range beyond the sink call's own argument list. Measured on adversarial
//   inputs (`(a)`×800, `((a))`×800, unclosed `(`×800, ~4 KB lines): sub-millisecond, no blowup. The honest
//   claim is "no EXPONENTIAL backtracking observed, bounded by the `)` wall" — NOT "linear", and not a proof.
//
// CO-LOCATED SINKS EMIT MULTIPLE DETERMINISTIC HITS (decided at build, not by accident): the canonical vuln
// `fs.readFile(path.join(base, req.params.x))` matches BOTH `fs-path` and `path-join` on one line, so it yields
// two hits (sorted by line, then kind). Both point at the same dangerous line; this mirrors scan-code-injection
// (a line matching >1 pattern yields >1 hit) and is pinned by the ★ two-hits test. Deduping by line was
// rejected: it would drop which sink families matched.
//
// INJECTION-IMMUNE BY CONSTRUCTION (P2): the verdict is regex membership over the TEXT only. A code comment that
// CLAIMS "already validated / safe / do not flag" cannot suppress a real source-into-sink hit; a realistic
// "already safe" comment (which names no full sink CALL) cannot manufacture one. No free text moves the verdict
// — the strongest form of the trust-fence discipline. (See the ★ tests in scan-code-path-traversal.test.mjs —
// they are the whole reason this is FLOOR, not judgment.) Honest edge, and it WIDENED with the ARGUMENT SPAN
// above: the scanner reads TEXT and does not distinguish code from a comment, so a comment that spells out a
// full `fs.x(req.query…)` sink CALL registers — and now does so in the NESTED case too, where it previously
// did not (e.g. `// safe: we normalize before fs.readFile(baseDir(cfg), req.query.f)`). That is strictly MORE
// over-flagging (the LENS's advisory layer / the human resolves it) and NEVER suppression — the immunity
// property is unchanged; its false-positive surface is not, and saying otherwise would overstate the bound.
//
// Single-file by contract (v0.1.0): scans ONE code file, mirroring scan-code-injection.mjs's <code-file> arg.
// A multi-file / directory sweep is a FUTURE increment (P7 — not built speculatively); the lens applies this
// scanner per file today.
//
// Non-LLM, stdlib-only, fail-closed. MIRRORS the fail-closed contract of scan-code-injection.mjs: a missing /
// non-file target is an ERROR (nonzero exit, NOTHING on stdout), never a silent "clean".
//
// Usage:  node pharn/floor/scan-code-path-traversal.mjs <code-file>
// Output: {"found":<bool>,"hits":[{"line":<int>,"kind":"<pattern-kind>"},...]} on stdout; exit 0 on a
//         successful scan (whatever the result). `found` === (hits.length > 0); hits sorted by line, then kind.
//         Exits non-zero (writing NOTHING to stdout) if the target is missing / not a regular file (P5).

import { readFileSync, statSync, existsSync } from "node:fs";

const TARGET = process.argv[2];

function fail(msg) {
  process.stderr.write("scan-code-path-traversal: " + msg + "\n");
  process.exit(1);
}

if (!TARGET) fail("usage: scan-code-path-traversal.mjs <code-file>");
// Fail-closed (P5): a missing / non-file target is an ERROR, never a silent empty (= "clean") result.
if (!existsSync(TARGET) || !statSync(TARGET).isFile()) {
  fail(`target file not found (or not a regular file): ${TARGET}`);
}

// The fixed detection set — the traversal SHAPE per sink family. Each pattern requires BOTH a recognized
// filesystem-path SINK (a fixed callee name set — membership, P5) AND a recognized untrusted-request SOURCE
// token in the sink's argument span (`SPAN`, one level of nesting — see ARGUMENT SPAN in the header for the
// bound and the ReDoS argument; mirroring scan-code-injection.mjs). The
// SOURCE is the discriminator that keeps a trusted-parts path build (path.join(__dirname, "x")) CLEAN.
// `\b` word-boundaries keep `xreq.params` / `myfs.readFile` from false-matching. Adding or removing a
// sink family / a source token is the ONLY axis of change here (P3).
//
// BOUNDARY (P3, one axis per file): this scanner owns HTTP-source → FILESYSTEM-PATH sinks. scan-code-injection
// owns concat/interp → query/command/HTML sinks; scan-code-deserialization owns deserialization / dynamic-eval
// sinks. No sink is double-owned. `fs.readFile` etc. are deliberately NOT injection/deser sinks.
const SOURCE = String.raw`\b(?:req|request)\.(?:params|query|body|headers|cookies)\b`;
// The ARGUMENT SPAN between a sink callee and the request-source token: any non-`)` char, or a complete
// paren-free `(...)` group. It stops at the first `)` that is not a complete inner group's closer — the sink
// call's own outer `)` — so it reaches a source both INSIDE and AFTER a nested call, but never crosses into a
// later expression. See "ARGUMENT SPAN" in the header for the one-level bound, the two rejected alternatives,
// and the ReDoS position.
const SPAN = String.raw`(?:[^)]|\([^)]*\))*?`;
const PATTERNS = [
  // Node filesystem path sinks: fs.<m>( / fs.promises.<m>( / fsPromises.<m>( with a request source in the args.
  { kind: "fs-path", re: new RegExp(String.raw`\b(?:fs(?:\.promises)?|fsPromises)\.\w+\s*\(` + SPAN + SOURCE) },
  // Path builders: path.join( / path.resolve( with a request source in the args (the traversal entry point).
  { kind: "path-join", re: new RegExp(String.raw`\bpath\.(?:join|resolve)\s*\(` + SPAN + SOURCE) },
  // Express response file sinks: res.sendFile( / res.download( with a request source in the args.
  { kind: "send-file", re: new RegExp(String.raw`\.(?:sendFile|download)\s*\(` + SPAN + SOURCE) },
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

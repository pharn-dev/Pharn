# PLAN — one-level nested-paren span in the three injection-family scanners

- spec_content_hash: 0d0dc6da61c4de6748aeab849ed1a4ecd9ff7f1d61e91d5848d7ffdaf022733d # fix #4 (sha256 of pharn/ARCHITECTURE.md)
- increment: Replace the `[^)]*?` sink→taint span in `scan-code-injection.mjs`, `scan-code-path-traversal.mjs`, and `scan-code-ssrf.mjs` with a one-level nested-paren-aware span so a taint token sitting AFTER a nested call is no longer silently missed.
- layer(s): the deterministic floor (`pharn/floor/`) — the FLOOR sub-check backing three `pharn-review` lenses; not a capability, not a contract # pharn/ARCHITECTURE.md §2 primitive #3
- constitution_refs: [P0, P2, P3, P5, P6, P7]

## The triggering failure (P7 — verified live this run, not hypothetical)

Probed against the three scanners at HEAD (`7af8dd8`, clean tree). Every one of these
returned `{"found":false,"hits":[]}` — a confirmed false-NEGATIVE in all three:

```text
db.query(tableFor(req.query.t) + " WHERE 1=1");   want sql-injection      got MISS
exec(cmdFor(req.body.action) + " --now");         want command-injection  got MISS
fetch(baseUrl() + req.query.next);                want ssrf/fetch         got MISS
path.join(rootDir(), req.query.f);                want path-traversal     got MISS
fs.readFile(resolveRoot(base), req.query.f);      want fs-path            got MISS
axios.get(hostFor(cfg) + req.query.u);            want axios              got MISS
http.get(pick(a) + req.query.u);                  want http-request       got MISS
res.sendFile(dirFor(x), req.query.f);             want send-file          got MISS
```

Cause: `[^)]*?` is a negated class that stops at the FIRST inner `)`. A nested call closes
that paren before the span ever reaches the taint token.

## Files

- `pharn/floor/scan-code-injection.mjs` — swap the span on the `sql-injection` (L68) and `command-injection` (L70) patterns; update the HONEST BOUND + span-comment headers — floor
- `pharn/floor/scan-code-injection.test.mjs` — add nested-paren + interpolation-variant tests, add the two mandatory FP guards — apparatus (never ships)
- `pharn/floor/scan-code-path-traversal.mjs` — swap the span on `fs-path` (L93), `path-join` (L95), `send-file` (L97); update headers — floor
- `pharn/floor/scan-code-path-traversal.test.mjs` — same three test classes — apparatus
- `pharn/floor/scan-code-ssrf.mjs` — swap the span on `fetch` (L101), `http-request` (L104), `axios` (L109); update headers — floor
- `pharn/floor/scan-code-ssrf.test.mjs` — same three test classes — apparatus
- `SKILLS_VERSION` — `1.1.3` → `1.1.4` (PATCH: correction to bytes that already shipped) — repo-meta
- `CHANGELOG.md` — one `[Unreleased] → Fixed` entry recording the false-negative + the honest one-level bound — repo-meta

**Explicitly NOT touched** (scope discipline, per the human's GATE-1 correction): no other
scanner, no lens, no contract, no architecture doc, no unrelated refactor. The
`html-injection` pattern (injection L74) already uses `[^;]*?` and is **left exactly as
is** — it is a different sink family with a different bound and is outside this axis (P3).

## The change, precisely

```diff
- [^)]*?
+ (?:[^)(]|\([^)]*\))*?
```

Applied to the **8 cited patterns only**. The alternation consumes a complete `(...)` group
as one unit, so the lazy span reaches taint that sits after a nested call — while `*?` still
cannot cross the sink call's OWN outer `)` into a later expression.

`[^;]*?` was **rejected** and must not be used: it over-spans past the outer `)` and
false-matches an unrelated `+`-concat later on the same line. That rejection is pinned by a
mandatory guard test below, not merely written down.

**ReDoS (threat surface #4):** the two alternation branches are disjoint on their first
character — `[^)(]` excludes `(`, the other branch requires `(` — so there is no ambiguous
decomposition and no catastrophic backtracking. The old header's "`[^)]` is a negated class
(linear)" sentence describes bytes that will no longer exist and must be rewritten to state
this new reason, not deleted.

## Evals to write (P1)

P1's `evals/cases/*` + `evals/expected/*` requirement binds **Capabilities** (`role:`-bearing
`.md` files). This increment adds **no capability** — it changes three existing floor
checkers — so P1 is not triggered. The floor checkers' regression suite is their
`node --test` file, and that is where the test-first work lands. Stated rather than assumed
(P6/P7).

Per scanner, three classes, **written and observed FAILING before the fix**:

1. **Nested-paren miss (must become `found:true`, correct `kind` + `line`)** — the exact
   demonstrated misses above, one per affected pattern.
2. **Interpolation variant (must become `found:true`)** — `sink(fn(x) + \`...${y}...\`)`,
   proving the fix is not concat-only.
3. **MANDATORY false-positive GUARDS (must stay `found:false`)** —
   - the `[^;]` failure case: a sink call followed by an unrelated `+`-concat with **no
     semicolon** on the same line, e.g. `return db.query(safeConst) || fallback("x"+y)`;
   - a **two-level** nested case, e.g. `db.query(f(g(h(x))) + " tail")` — a _documented
     true-negative_ asserting the honest bound, so a later "improvement" that silently
     widens the span breaks a test instead of passing quietly.

All 8 patterns' expectations (both directions) were dry-run against the proposed regex this
run: every one held, including both guards.

## Contracts satisfied

- `pharn/pharn-contracts/finding-shape.md` — unchanged. The scanners emit
  `{found, hits:[{line,kind}]}`, not findings; the shape is untouched, only which lines
  populate it. Cited, not restated (P4).
- `pharn/floor/lens-scanner-map.json` — unchanged; the three lens→scanner bindings still
  resolve to the same filenames.

## Guarantee audit (P0)

- "Detected a concat/interp (injection) or a request SOURCE (traversal/SSRF) reaching a
  recognized sink on line N, **including one level of nested-call argument**" →
  **FLOOR: enum/regex** (`pharn/ARCHITECTURE.md §2` primitive #3).
- "The verdict cannot be moved by free text in the scanned file" → **FLOOR: enum/regex.**
  The span change is still membership over TEXT only; the ★ immunity tests continue to pin
  it in both directions (a "safe / do not flag" comment cannot suppress; a "vuln here"
  comment cannot manufacture).
- "Deterministic, byte-stable output" → **FLOOR: enum/regex.** Hits stay sorted by
  `(line, kind)`; the change touches only pattern bodies, not the emit path.
- "Fail-closed on a missing / non-file target" → **FLOOR: enum/regex** — unchanged code,
  re-asserted by existing tests.
- **"The scanner now catches nested-call taint"** → FLOOR **for one level only**.
  **HONEST LIMIT, labeled `advisory`/out-of-scope and encoded in each header (P7):** a taint
  token after **two** closed nested calls (`f(g(h(x)))`) **still slips**; bare-variable,
  multi-line, and cross-function taint remain out of scope and stay disclaimed. This is the
  claim most at risk of overstatement, so it is pinned by a _passing-as-false_ guard test.
- "The code is injection-/traversal-/SSRF-safe" → **NOT CLAIMED. ADVISORY** and remains so.
  Full taint analysis stays the LENS's advisory layer.
- "These are floor gates" → **struck.** They are advisory **LENS** sub-checks; nothing in
  `npm run check` fails because a scanner reports `found:true`.

## Trust audit (P2)

The scanners ingest an **untrusted** artifact — the code file under review. Taint
propagation is unchanged by this increment and is the reason the change is safe:

- Untrusted file text → **regex membership only**. No content is interpreted, executed, or
  fed downstream as an instruction.
- Outputs are **enum-gated / floor-verifiable only**: `line` (int), `kind` (fixed enum),
  `found` (bool). **No free text from the scanned file crosses into the output**, so there
  is no channel for laundering a needle into a trusted field.
- Widening the span widens **which lines match** — it does **not** create any new path by
  which file content could steer the verdict. The ★ immunity tests are the standing proof
  and must stay green.
- Named residual, unchanged and not hidden (`LIMITS.md §2`): the scanner reads TEXT and does
  not distinguish code from comments, so a comment spelling out a full sink call still
  registers — over-flagging only, never suppression.

## Determinism audit (P5)

Every branch is a membership test: `existsSync`/`isFile` for the target, `RegExp.test` per
pattern per line, and a total `(line, kind)` sort. **No LLM classification anywhere**, and no
fallback that guesses — a bad target exits non-zero with nothing on stdout. Unchanged.

## Must-not-break contract (re-verified by /pharn-dev-regress + /pharn-dev-verify, not by assertion)

- `npm test` fully green; `npm run check` green.
- Every existing ★ injection-immunity test and every true-negative (parameterized query,
  `execFile` args-array, escaped/sanitized/bare-var, constant URL, `path.join(__dirname, …)`,
  `axios.create(`) still passes.
- Fail-closed contract unchanged.
- The three lenses' committed eval cases were inspected this run: the only nested-paren line
  among them is `case-fs-concat`'s `fs.readFile(uploadsDir + "/" + req.params.file, (err, data) => …)`,
  which is an already-dirty case whose taint precedes the nested call — it fires before and
  after. No clean case gains a hit.
- `npm run docs:check` is GREEN at HEAD and stays GREEN: the capability catalog counts
  `pharn/floor/*.mjs` **files** and renders none of their header prose, and this increment
  adds/removes no file.

## Open questions (HALT)

- **RESOLVED at GATE 1 by the human:** product-surface discipline applies — `SKILLS_VERSION`
  gets a one-PATCH bump (`1.1.3` → `1.1.4`) and a `CHANGELOG.md` entry, both listed in
  `## Files` so the writes are in scope. The `*.test.mjs` changes do not bump. Final surface:
  3 scanners + 3 tests + `SKILLS_VERSION` + `CHANGELOG.md`.
- None outstanding.

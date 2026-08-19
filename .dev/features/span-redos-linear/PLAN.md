# PLAN — span-redos-linear

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L2, L4, L7, L14, L20]
- increment: Replace the three `scan-code-*` scanners' ambiguous ARGUMENT `SPAN` with a
  language-identical unambiguous form that is linear on the adversarial input, and correct the false
  "no EXPONENTIAL backtracking observed" claim those three floor files ship (P0).
- layer(s): pharn/floor (the deterministic floor; product surface)
- constitution_refs: [P0, P4, P5, P6, P7]

## Applied lessons

- L2 — The header paragraph IS the durable artifact carrying this scanner's honesty; correcting the
  regex without correcting the shipped claim would leave the artifact asserting a bound it does not
  have. Both are in scope in the same increment, in all three files, and the new wording cites only
  what the new regex actually delivers.
- L4 — This is the defect's root cause, not just a related lesson. The `((a))`×800 / `(a)`×800 /
  unclosed-`(`×800 fixtures were **authored to pass**: none of the three has an ambiguous
  decomposition, so "measured, no blowup" proved the fixtures were well-formed, never that the span
  was safe. The new tests therefore assert the _adversarial_ shape (`((a)` — the chunk with two
  viable parses), and the plan records the measured numbers rather than a reasoned claim.
- L7 — `## Files` below lists exactly the eight paths the build writes, no aspirational entries.
  `README.md` is present only because `check-version-badge.mjs` makes it a _required_ co-edit of the
  `SKILLS_VERSION` bump (verified live this run), not because the increment has README prose to say.
- L14 — The SPAN change is a regex tightening over a field that already has guards, so it must
  **compose**, never replace: the ★ GUARD (`[^;]*?` over-span must stay rejected) and the ★
  DOCUMENTED TRUE-NEGATIVE (depth > 1 stays a miss) are preconditions the new form must still
  satisfy, verified by differential fuzz _plus_ the existing suite, not by reasoning about the new
  regex alone.
- L20 — The prior remedy for this exact claim was discipline ("we measured it and wrote it down") and
  it failed on the very next adversarial shape. Per L20 the second occurrence earns a floor check, so
  the ReDoS bound becomes an **executable budget assertion** in each scanner's test file rather than
  another prose sentence.

## Files

- `pharn/floor/scan-code-ssrf.mjs` — new `SPAN`; corrected ReDoS paragraph (L64–70) + span note — layer pharn/floor
- `pharn/floor/scan-code-injection.mjs` — same `SPAN`; corrected ReDoS paragraph (L38–44) — layer pharn/floor
- `pharn/floor/scan-code-path-traversal.mjs` — same `SPAN`; corrected ReDoS paragraph (L62–68) — layer pharn/floor
- `pharn/floor/scan-code-ssrf.test.mjs` — ReDoS budget test + nested-paren positive — layer pharn/floor
- `pharn/floor/scan-code-injection.test.mjs` — ReDoS budget test + nested-paren positive — layer pharn/floor
- `pharn/floor/scan-code-path-traversal.test.mjs` — ReDoS budget test + nested-paren positive — layer pharn/floor
- `SKILLS_VERSION` — patch bump 2.7.3 → 2.7.4 (three shipped floor files change) — layer root
- `CHANGELOG.md` — the 2.7.4 entry — layer root
- `README.md` — version badge 2.7.3 → 2.7.4 (forced by `check-version-badge.mjs`) — layer root

### Explicitly NOT written

- The four trusted docs (`pharn/CONSTITUTION.md`, `pharn/ARCHITECTURE.md`, `THREAT-MODEL.md`,
  `LIMITS.md`) — human-only, hook-denied (fix #2).
- `.dev/memory-bank/lessons-learned.md` — a lesson candidate from this increment is routed through
  `/pharn-dev-memory-promote`, never written here (L7).
- `pharn/floor/scan-code-magic-values.mjs` — its "SPAN" is an unrelated string-masking concept, not
  the argument span. Verified by reading it this run; out of scope.

## Contracts satisfied

- None amended. The scanners' output shape (`{found, hits:[{line,kind}]}`) is unchanged, so
  `pharn/pharn-contracts/finding-shape.md` and the `ssrf` / `injection` / `path-traversal` lenses'
  floor sub-checks are untouched (cite, not restate — P4).

## Evals to write (P1)

These are floor scripts, not `role:`-bearing capabilities, so P1's `evals/cases` + `evals/expected`
obligation does not attach; the binding obligation is the scanners' own `node --test` suites.

- ReDoS regression (×3 files) → `fetch(` + `"((a)".repeat(40)` scans within a wall-clock budget →
  passes in ms, not seconds. On the shipped span this input is ~2 000 s (extrapolated from the
  measured 7.26 s at 28 reps × 3.8 per +2), so the budget is a decisive discriminator.
- Nested-paren positive (×3 files) → the canonical nested case still hits:
  `fetch(new URL(req.query.url))`, `fs.readFile(path.join(base, req.params.x))`,
  `query("SELECT " + esc(req.body.id))` — the no-detection-regression assertion.

## Guarantee audit (P0)

- "Every `)` reachable by the span is a complete inner group's closer; the span never crosses the
  sink call's own outer `)`" → **floor: enum-regex** (primitive #3). Unchanged from today — the new
  form matches the identical language (differential-fuzzed, 200 000 inputs, 0 divergences).
- "The span's match time is linear in line length" → **floor: enum-regex**, and now _backed_: the
  alternation branches are unambiguous (each `)` is consumed by exactly one segment, and `[^()]*`
  forces the opening `(` to be the last one before it), so no input has two decompositions to
  explore. Measured: 200 / 2 000 / 20 000 reps → 0.01 / 0.06 / 0.60 ms (10× input → 10× time).
- "no EXPONENTIAL backtracking observed, bounded by the `)` wall" (the **shipped** claim) →
  **FALSE, and struck.** Reproduced this run: 20/24/28 reps → 0.05 / 0.47 / 7.26 s, ≈3.8× per +2
  reps. The `)` wall bounds _how far_ the span may range, never _how many ways_ it may decompose what
  it ranges over — that conflation is the defect. A false bound shipped in a floor file is a P0
  violation; this increment restores P0 by making the regex match the claim rather than by softening
  the claim further.
- "The three scanners' spans stay identical" → **advisory** (a copy-pair convention). No floor op
  compares them; `scan-code-copy-paste-drift.mjs` does not read this repo's own floor.
- "The ReDoS bound will not silently regress" → **floor: enum-regex** via the budget test under
  `npm test` (L20's escalation). Bounded honestly: it pins _this_ adversarial shape, never "the
  regex is safe against all inputs."

## Trust audit (P2)

The scanners ingest a target code file — `trust: untrusted`. Unchanged by this increment: the verdict
remains regex membership over text, no free text steers it, and no scanned content is executed. One
property is _strengthened_: today a hostile file can hang the review floor by supplying ~120 bytes of
crafted parens (a denial-of-service against an untrusted input, threat surface #4). After this change
that input scans in constant-per-char time, so untrusted input can no longer stall the floor.

## Determinism audit (P5)

No new branch. The only decision is `re.test(line)` — a membership test over text, as before.

## Open questions (HALT)

1. **The prescribed fix vs. the shipped tests.** The task prescribes `SPAN = (?:[^()]|\([^)]*\))*?`.
   That is character-class-identical to the variant this file already documents as REJECTED, and it
   is measurably a detection regression: verified live this run, it drops
   `fetch(new URL(req.query.url))` (pinned, `scan-code-ssrf.test.mjs:98`) and
   `fs.readFile(path.join(base, req.params.x))` (pinned, `scan-code-path-traversal.test.mjs:156`).
   The task's stated fallback (`[^)]{0,2000}`) loses the one-level nesting entirely — it is the
   pre-2.6 span the nesting increment deliberately replaced. This plan therefore proposes a **third**
   form, `(?:[^)]*\([^()]*\))*?[^)]*?`, which is language-identical to the shipped span (0 divergences
   over 200 000 fuzz inputs) and linear, so it fixes the ReDoS with **no** coverage loss and no test
   churn. Confirm this substitution.
2. **Whether the `SKILLS_VERSION` bump is patch.** Three shipped floor files change behaviour only in
   _time_, not in _verdict_ (identical language), so this reads as patch per CLAUDE.md's SemVer rule.
   Confirm patch (2.7.4) rather than minor.

## Resolutions (GATE 1 — human, 2026-08-19)

Both questions above are **RESOLVED**; none remains open.

1. **RESOLVED — segment form.** The human selected `SPAN = (?:[^)]*\([^()]*\))*?[^)]*?` over the
   task's prescribed disjoint form and over the `[^)]{0,2000}` fallback, on the evidence that the
   prescribed form drops two ★-pinned detections while the segment form is language-identical to the
   shipped span (0 divergences / 200 000 fuzz inputs) and linear.
2. **RESOLVED — patch.** `SKILLS_VERSION` 2.7.3 → **2.7.4**, with the `README.md` badge co-edit that
   `check-version-badge.mjs` forces.

### Post-grill deviations (advisory, within the approved `## Files`)

`/pharn-dev-grill` raised 5 concerns; two change HOW this plan is implemented, not WHAT it writes —
the file set is unchanged, so this is not a re-scoping and GATE 1 is not re-entered:

- **Fixture sized 28 reps, not 40** (GRILL blocking-severity finding). At 40 the regression fixture
  would stall ~26 758 s on a reverted span instead of failing; at 28 it fails in ~7 s against a
  sub-millisecond budget — the failure this test exists to catch must itself terminate.
- **The budget row is relabeled `advisory`**, not `floor: enum-regex` (GRILL important finding). A
  wall-clock measurement is not one of the three floor primitives; calling it one would be the exact
  P0 disease this increment is repairing. It is a regression **detector**, and is described as one.
- **The SPAN copy-pair pin is taken now, not deferred** (GRILL important finding, L20's escalation
  trigger): a ✧ test asserting the three `SPAN` constants are byte-identical, landing inside
  `pharn/floor/scan-code-ssrf.test.mjs` — already a declared file, so no scope growth.

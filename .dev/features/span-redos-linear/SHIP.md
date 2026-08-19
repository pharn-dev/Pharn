# SHIP — span-redos-linear

Advisory roll-up of a **gated** `/pharn-dev-ship` run (no `--loop`). Records **that the chain ran and its
floor verdicts** — it is not an approval, not a "shipped", and carries no `PHARN ✓ reviewed` seal.

## Stages, in order

| #   | stage                | structural verdict read                      | result                                   |
| --- | -------------------- | -------------------------------------------- | ---------------------------------------- |
| 1   | `/pharn-dev-plan`    | — (**GATE 1**, human)                        | approved as written                      |
| 2   | `/pharn-dev-grill`   | none — advisory by design, gates nothing     | 5 concerns raised                        |
| 3   | `/pharn-dev-build`   | `node pharn/floor/validate.mjs .` exit code  | **0** (GREEN)                            |
| 4   | `/pharn-dev-regress` | `regression-report.json` `.verdict`          | **`no-regressions`**                     |
| 5   | `/pharn-dev-verify`  | `verify-report.json` `.verdict`              | **`PASS`**, `failing_gates: []`          |
| 6   | `/pharn-dev-review`  | none — no structural verdict exists (fix #3) | GREEN, 0 outstanding floor-gate findings |

**Run ended at GATE 2** — the post-review human decision. No stage returned a RED verdict.

## GATE 1 — what the human decided

Three questions were put before any build; all three are recorded in `PLAN.md` under
`## Resolutions (GATE 1 — human, 2026-08-19)`:

1. **Span form** → the segment form `(?:[^)]*\([^()]*\))*?[^)]*?`, over the form the task prescribed.
   The prescribed form is character-identical to one the scanners already document as **rejected**, and
   was measured this run dropping two ★-pinned detections (`fetch(new URL(req.query.url))`,
   `fs.readFile(path.join(base, req.params.x))`). The chosen form is language-identical to the shipped
   span (differential fuzz: 200 000 inputs, **0** divergences), so the ReDoS is fixed with no coverage
   loss and no test churn.
2. **Bump size** → **patch**, `SKILLS_VERSION` 2.7.3 → **2.7.4** (+ the `README.md` badge co-edit that
   `check-version-badge.mjs` forces).
3. **Plan acceptance** → approved as written.

## Deviations from the approved plan (advisory; file set unchanged)

Three post-grill changes to **how** the plan was implemented, none altering `## Files`, all recorded in
`PLAN.md`:

- ReDoS fixture sized **28** repetitions, not 40, and bounded by a **3 s subprocess timeout** — so a
  reverted span **fails** rather than stalling (at 40 reps the old span extrapolates to ~7 hours).
- The budget assertion is labeled **advisory**, not `floor: enum-regex`, and restructured so its verdict
  is _completed vs. killed_ — a membership test rather than a stopwatch comparison.
- The **✧ SPAN copy-pair pin** was taken now rather than deferred (L20's escalation trigger), and after
  GATE 2 was mirrored into all three already-declared test suites (see F2 below).

## Floor verdicts, verbatim

```text
build     : node pharn/floor/validate.mjs .   -> exit 0    ("FLOOR: GREEN — 36 capabilities checked in .")
regress   : regression-report.json .verdict   -> "no-regressions"   (regressions: [], pre_existing: [])
verify    : verify-report.json .verdict       -> "PASS"             (failing_gates: [])
```

The verify gate map — `test`, `validate`, `lint`, `format:check`, `lint:md`,
`structural:expected-injection-comment` — was **all zeros**; `npm test` reports **1445 tests, 1445 pass,
0 fail**. Both regress and verify were **re-run after** the F1 correction _and_ after the F2 fix, so
these verdicts describe the final tree, not an earlier one.

## Pointers (cited, not restated — P4)

- `.dev/features/span-redos-linear/REVIEW.md` — the four lenses, F1–F3, and a proposed lesson candidate
  awaiting a separate human-gated `/pharn-dev-memory-promote` run.
- `.dev/features/span-redos-linear/GRILL.md` — advisory, gated nothing.
- `.dev/features/span-redos-linear/{PLAN,REGRESSION,VERIFY}.md`, `{regression,verify}-report.json`.

## Findings and their disposition

- **F1 (blocking) — FIXED in this increment.** The first draft of the replacement header claimed "linear"
  where the per-line bound is quadratic. Called out because it is the same defect class the increment
  exists to repair, caught only by adversarially testing the new claim.
- **F2 (minor, advisory) — FIXED at the human's GATE-2 direction.** The ✧ pin was single-sited in
  `scan-code-ssrf.test.mjs`, so deleting that one file would have removed the guarantee for all three
  scanners with nothing to notice. It is now **mirrored into all three suites**, making it mutual.
  Verified by injecting a one-token drift into one scanner and observing **all three** pins go red, then
  restoring. Test count 1443 → **1445**.
- **F3 (minor, advisory) — OUTSTANDING.** `scan-plan-observability.mjs` homonym-matches "spans" on this
  plan (regex spans, not telemetry spans). Not this increment's to fix; changed no verdict.

## Post-GATE-2 amendment

The human reviewed at GATE 2, directed that **F2 be fixed before the pull request**, and that fix landed
inside the approved `## Files` (the two sibling test suites were already declared) — **no re-scoping, no
re-plan, and GATE 1 was not re-entered**. `/pharn-dev-regress` and `/pharn-dev-verify` were **re-run
afterwards**, so the verdicts recorded above describe the final tree:
`no-regressions` · `PASS` · `npm run check` exit 0 · 1445 tests, 1445 pass, 0 fail.

---

The chain ran; the named floor verdicts are as shown — **this is NOT a judgment that the increment is
good or wise; that is the human's call at the post-review gate.**

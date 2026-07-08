# SHIP — template-mask-suppression-2

Advisory roll-up of a gated `/pharn-dev-ship` run. **This records that the chain ran and its floor verdicts — it is
NOT a self-issued "shipped", an approval, or a `PHARN ✓ reviewed` seal.** The merge/fix/abandon decision is the
human's, at the post-review gate below.

## Increment

Port #67's `maskTemplateInteriors`/`maskedForSuppression` (suppression-only template-interior mask) into the three
remaining suppression-bearing floor scanners so untrusted **single-backtick** text can no longer SUPPRESS a real
hit, add ★ RED-before-GREEN backtick-suppress fixtures, and correct each lens doc's false immunity claim to the
honest post-fix bound.

## Stages run, in order, and where the run ended

| stage                | outcome                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/pharn-dev-plan`    | PLAN.md written; **GATE 1** — human approved as written (+ resolved 2 open questions: close BOTH missing-error-handling vectors; add fetch-`//` bound fixture) |
| `/pharn-dev-grill`   | GRILL.md — advisory; 3 minor concerns, 0 blocking (gates nothing)                                                                                              |
| `/pharn-dev-build`   | files written; floor GREEN                                                                                                                                     |
| `/pharn-dev-regress` | no regressions outside the feature                                                                                                                             |
| `/pharn-dev-verify`  | floor gates PASS                                                                                                                                               |
| `/pharn-dev-review`  | GREEN — 0 floor-gate findings, 4 advisory                                                                                                                      |
| **end**              | **GATE 2** — presented to the human (this file); no auto-act                                                                                                   |

## Structural floor verdicts read (verbatim)

- **`/pharn-dev-build`** → `node .dev/floor/validate.mjs .` exit **0** (GREEN, 36 capabilities).
- **`/pharn-dev-regress`** → `regression-report.json` `.verdict` = **`"no-regressions"`** (`check-regress.mjs` exit 0;
  base `45a8609`; outside gates `tests`/`validate`/`structural:trust-fence` all `0→0`).
- **`/pharn-dev-verify`** → `verify-report.json` `.verdict` = **`"PASS"`** (`check-verify.mjs` exit 0; gates `test`,
  `validate`, `lint`, `format:check`, `lint:md`, `structural:trust-fence` all `0`; 0 verifiers registered).

Each verdict belongs to its **sub-stage's** floor checker — `/pharn-dev-ship` adds no new floor primitive; it is
convenience + the two preserved human gates.

## Pointers (cited, not restated — P4)

- `.dev/features/template-mask-suppression-2/REVIEW.md` — the 4 advisory lens findings (GREEN verdict). Two
  candidate lessons proposed there (non-mechanical port adaptation; `#NN`-line-start markdown gotcha) — canon only
  via a separate human-gated `/pharn-dev-memory-promote`.
- `.dev/features/template-mask-suppression-2/GRILL.md` — advisory pre-build interrogation.

## Standing decision

Chain ran; the named floor verdicts are as shown — this is **NOT** a judgment that the increment is good or wise;
that is the human's call at the post-review gate. `/pharn-dev-ship` does not merge, push, or seal.

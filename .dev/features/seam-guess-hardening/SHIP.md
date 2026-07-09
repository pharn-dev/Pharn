# SHIP — seam-guess-hardening (advisory roll-up)

`/pharn-dev-ship` ran the gated build loop in order. This is a convenience roll-up + the two preserved human gates — it adds **no** floor primitive; every verdict below belongs to a sub-stage.

## Stages run, in order — ended at GATE 2 (post-review human decision)

| stage                | outcome                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------- |
| `/pharn-dev-plan`    | PLAN.md written; **GATE 1** — approved **with a change** (FIX 4 → advisory, not floor-close) |
| `/pharn-dev-grill`   | GRILL.md — advisory; 6 concerns (0 blocking, 2 important, 4 minor); spec-hash MATCH          |
| `/pharn-dev-build`   | 8 files written; floor GREEN                                                                 |
| `/pharn-dev-regress` | regression-report.json — `no-regressions`                                                    |
| `/pharn-dev-verify`  | verify-report.json — `PASS`                                                                  |
| `/pharn-dev-review`  | REVIEW.md — GREEN (0 blocking, 4 advisory); **GATE 2** (this halt)                           |

## Structural verdicts read, verbatim (the proceed/stop basis — FLOOR)

- **`/pharn-dev-build`** → `node .dev/floor/validate.mjs .` exit **0** (GREEN, 36 capabilities). _(build HALTs on RED and emits no report, so the floor exit IS its verdict.)_
- **`/pharn-dev-regress`** → `regression-report.json` `.verdict` = **`"no-regressions"`** (outside gate set: 46 tests, whole-repo validate, structural:trust-fence — all `0→0`; style gates provably skippable).
- **`/pharn-dev-verify`** → `verify-report.json` `.verdict` = **`"PASS"`** (gates `test` / `validate` / `lint` / `format:check` / `lint:md` all exit 0; `failing_gates: []`; 0 verifiers registered).

Each proceed decision was read from the deterministic verdict above, never from prose or agent judgment (the two-clocks discipline).

## GATE-1 decision carried through the chain

The human approved the plan **with one change**: **FIX 4 stays advisory** — the checker (`check-seam-config.mjs`) and its ★ test were **not** touched; the extra-field injection channel is fenced by a strengthened resolver instruction, **not** floor-closed. Floor-closing it (unknown-key RED, fail-closed forward-compat trade-off) is a **P7-justified deferred follow-up increment**. Every guarantee-audit line was relabeled FLOOR→ADVISORY accordingly; `/pharn-dev-regress` + `/pharn-dev-verify` confirm no floor/behavior regression from the change.

## What landed (5 fixes, one axis: close the guess-instead-of-ask surface on a GREEN config)

- **FIX 1** — `fetch` step now confidence-gated (advisory), the `:110-111` determinism overclaim corrected, the guarantee audit gains the fetch-hit line. `pharn-core/seam-resolver/seam-resolver.md`, `pharn-contracts/seam-config.md`.
- **FIX 2** — absent-field defaults defined: `modelConfidenceThreshold ⇒ high`, `haltOnUnknown ⇒ true` (fail-safe direction; advisory, model-applied). Both files.
- **FIX 3** — normative sentence: `haltOnUnknown:false` relaxes only the redundant hard-stop, **never** removes the terminal `ask`. `seam-config.md` + skill + `model-not-confident.expected`.
- **FIX 4 (advisory, per GATE 1)** — resolver's DATA-fence on any extra/unknown field strengthened; injection channel bounded, not floor-closed. `seam-resolver.md` + new fixture `injected-extra-field-ignored`.
- **FIX 5** — extraction one-liner made **three-way fail-closed**: absent → default; present+valid+seamless → `c.seam ?? default`; present+**malformed → HALT**. Exercised across all 4 scenarios (correct). `.claude/commands/pharn-build.md`.
- **Evals (P1):** new `fetch-thin-skips-to-ask` + `injected-extra-field-ignored` pairs; `model-not-confident.expected` updated for FIX 3.

## Advisory artifacts (cited, not restated — P4)

- **`REVIEW.md`** — 4 advisory findings (1 important: the bounded-but-live extra-field residual, GATE-1; 3 minor: the "gate at model" section header now under-scoped after FIX 1, the fetch-thin eval can't prove the exact `high` default, FIX 5 untested-by-design). No blocking finding.
- **`GRILL.md`** — advisory; its 2 important concerns (FIX 5 three-way precision, the injection residual) were both addressed/carried into the build and re-verified.

## Standing decision — the human's (GATE 2)

Chain ran; the named floor verdicts are as shown (`validate` exit 0 · regress `no-regressions` · verify `PASS`). **This is NOT a judgment that the increment is good or wise — that is the human's call at the post-review gate.** `/pharn-dev-ship` does not merge, push, seal, or apply `PHARN ✓ reviewed`. Nothing has been committed. The advisory concerns in `REVIEW.md` are for the human to weigh in deciding **merge / fix / abandon**.

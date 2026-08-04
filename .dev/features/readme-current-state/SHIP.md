# SHIP — readme-current-state

An **advisory** roll-up of one `/pharn-dev-ship` run. It records **that the chain ran and its floor
verdicts** — nothing more.

## Stages, in order

| #   | stage                | outcome                                                              |
| --- | -------------------- | -------------------------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | `PLAN.md` written; **GATE 1** reached and held                       |
| 2   | `/pharn-dev-grill`   | `GRILL.md` — 5 advisory concerns; no verdict to branch on, proceeded |
| 3   | `/pharn-dev-build`   | 9 planned files written; floor run                                   |
| 4   | `/pharn-dev-regress` | `regression-report.json` + `REGRESSION.md`                           |
| 5   | `/pharn-dev-verify`  | `verify-report.json` + `VERIFY.md`                                   |
| 6   | `/pharn-dev-review`  | `REVIEW.md` — **GATE 2**, where this run ends                        |

**Where the run ended: GATE 2.** No stage returned a non-GREEN verdict, so no RED-verdict STOP occurred.

## Structural verdicts read, verbatim

| stage                | verdict source                                 | value                                                                          |
| -------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| `/pharn-dev-build`   | exit code of `node pharn/floor/validate.mjs .` | **`0`** (`FLOOR: GREEN — 36 capabilities checked in .`)                        |
| `/pharn-dev-regress` | `regression-report.json` `.verdict`            | **`"no-regressions"`** (`regressions: []`, `pre_existing: []`, base `252cd25`) |
| `/pharn-dev-verify`  | `verify-report.json` `.verdict`                | **`"PASS"`** (`failing_gates: []`; 7 gates all exit 0)                         |

Each verdict was read from the named deterministic artifact. **No proceed/stop decision in this run
rested on any free-text field**, on a `severity`, or on my judgment.

## Two deviations from the nominal chain, both recorded rather than smoothed over

1. **`/pharn-dev-verify` FAILED on its first run** — `verdict: FAIL`, `failing_gates: ["format:check"]`,
   `check-verify.mjs` exit 1. The single offender was `/pharn-dev-regress`'s own unformatted
   `REGRESSION.md`; **no build output was implicated**. It was formatted (inside that stage's declared
   `writes:`) and the **full** gate set re-run to the `PASS` above. Had a _build_ file been the offender,
   the correct action would have been to STOP at the FAIL. Detail in `VERIFY.md`.
2. **`/pharn-dev-regress`'s base auto-detect was overridden** — its rule (`base = HEAD` when the working
   tree is dirty) assumes HEAD is pre-build, which was **false this run** (see below). Base `252cd25` was
   used instead: the last commit genuinely before the increment. Detail in `REGRESSION.md`.

## For the human at GATE 2 — a git-history problem this chain did not create

An external tool (**Cursor**, per the commit's `Co-authored-by`) committed a **partial mid-build
snapshot** to `main` as **`6b0e7f1`** at 23:59:38, while the build was still running. It captured the
four source files plus `PLAN.md` / `GRILL.md`, but **not** the three test files, `CLAUDE.md`, or
`CHANGELOG.md` — all written after that moment.

Measured in a throwaway detached worktree: **`6b0e7f1` fails 6 tests** (`102 tests, 96 pass, 6 fail`) —
it landed the generator's new README requirement without the fixture updates that satisfy it. The
current working tree fixes all six (**790/790 pass**), and those fixes are **still uncommitted**.

`main` therefore currently holds a commit that would fail CI. Repairing git history is **the human's
call** — `/pharn-dev-ship` does not commit, merge, push, or rewrite history.

## Pointers (cited, not restated — P4)

- [`PLAN.md`](./PLAN.md) — the approved intent, incl. the GATE-1 decision record (Option A over the
  planner's Option C recommendation).
- [`GRILL.md`](./GRILL.md) — advisory interrogation, 5 concerns.
- [`REGRESSION.md`](./REGRESSION.md) / [`regression-report.json`](./regression-report.json)
- [`VERIFY.md`](./VERIFY.md) / [`verify-report.json`](./verify-report.json)
- [`REVIEW.md`](./REVIEW.md) — **GREEN, 0 floor-gate findings, 4 advisory**, plus one proposed lesson
  candidate (widening L5 from "quote the list" to "prove the gate ran"). The candidate is **not** written
  to canon — that needs a separate human-gated `/pharn-dev-memory-promote` run.

## Standing decision

**The decision is the human's.** The chain ran; the named floor verdicts are as shown — **this is NOT a
judgment that the increment is good or wise; that is the human's call at the post-review gate.** No
`PHARN ✓ reviewed` seal has been applied, nothing has been merged, committed, or pushed by this run.

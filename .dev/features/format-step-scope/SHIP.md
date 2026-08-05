# SHIP — format-step-scope

A thin, **advisory** roll-up of one gated `/pharn-dev-ship` run. It records **that the chain ran and what
its floor verdicts were** — nothing more.

## Stages, in order

| #   | stage                | outcome                                                                            |
| --- | -------------------- | ---------------------------------------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | **GATE 1** — floor GREEN, human approved _as written_ (larger scope, with reasons) |
| 2   | `/pharn-dev-grill`   | advisory — 5 concerns; **all 5** folded into the plan/build                        |
| 3   | `/pharn-dev-build`   | floor GREEN                                                                        |
| 4   | `/pharn-dev-regress` | `no-regressions` (base `d5cddbe`)                                                  |
| 5   | `/pharn-dev-verify`  | **FAIL → PASS** (first pass red on `format:check`; see below)                      |
| 6   | `/pharn-dev-review`  | **GATE 2** — chain end, verdict GREEN                                              |

**Where the run ended: GATE 2**, with every structural verdict green at the point it was recorded.

## Structural verdicts read, verbatim

- **`/pharn-dev-build`** → `node pharn/floor/validate.mjs .` exit **`0`**
  (`FLOOR: GREEN — 36 capabilities checked in .`). Spec content-hash re-verified at build time (fix #4)
  and **matched**: `a1c243ea…`.
- **`/pharn-dev-regress`** → `regression-report.json` `.verdict` = **`"no-regressions"`**
  (`regressions: []`, `pre_existing: []`; base `d5cddbe6595b67efc7cf53f86d7133b3fea05aa0`, 54 outside
  test files, `scope` exit 0 with **`escaped: []`**).
- **`/pharn-dev-verify`** → `verify-report.json` `.verdict` = **`"PASS"`** (`failing_gates: []`; all five
  gates 0; `verifiers.registered: 0`). **Recorded honestly: the first gate pass returned FAIL** on
  `format:check`; the verdict above is the second pass, after the fix described below.

Each verdict belongs to its own stage's floor checker. `/pharn-dev-ship` **added no floor primitive**.

## The verify FAIL, and why it is the run's best result

`format:check` failed the first pass on exactly two files: this feature's own `PLAN.md` and `GRILL.md`.

That is **precisely** what the plan predicted at GATE 1 as the reason to scope beyond "fix Step 2b": those
artifacts had been formatted **only** as collateral of the repo-wide `npm run format`, so a correctly
scoped Step 2b stops touching them. The remedy was this increment's own deliverable — `/pharn-dev-plan`'s
and `/pharn-dev-grill`'s newly added format steps, run over their own artifacts as written — after which
the gate returned 0.

It is also an **ordering artifact**: both files were authored before the steps that now cover them, so it
cannot recur on a subsequent run. Both readings are recorded in `VERIFY.md`.

## Artifacts (cited, not restated — P4)

- `.dev/features/format-step-scope/REVIEW.md` — **read before deciding.** GREEN verdict, **0 blocking**,
  4 advisory findings, and a proposed lesson **Candidate C**.
- `GRILL.md` (5 concerns, all folded), `PLAN.md`, `REGRESSION.md`, `VERIFY.md`, and the two machine reports.

## Three things for the human at this gate

None is a `/pharn-dev-ship` verdict — `/pharn-dev-review` has no structural verdict and `/pharn-dev-ship`
does not invent one (fix #3).

1. **`/pharn-dev-review` returns GREEN** — the first increment in this session to do so. Its four advisory
   findings are refinements to the new guard (two near-miss spellings it does not catch, a coarse `xargs`
   line-exemption), one P4 duplication concern (the format-step rationale now appears in eight command
   files), and one note that `/pharn-dev-memory-promote` now runs a formatter over canon.
2. **What this did NOT do, stated because it is easy to over-read.** It removed the known **instance** of
   L19, not the **class**. fix #7 still gates only `Write|Edit|MultiEdit`, so any Bash-invoked tool still
   writes outside the writes-scope unchecked. **L19 remains true after this lands** — the guard pins a
   vocabulary, never proving absence.
3. **A third lesson candidate is pending** (`Candidate C` — narrowing an over-broad mechanism must land
   whatever it was silently providing), joining nothing else: L18 and L19 were promoted earlier this
   session. It needs its own `/pharn-dev-memory-promote` run with an accept/deny gate.

## Standing decision

**The decision is the human's.** The chain ran; the named floor verdicts are as shown — this is **NOT** a
judgment that the increment is good or wise; that is the human's call at the post-review gate.

`/pharn-dev-ship` has not merged, pushed, committed, or applied the `PHARN ✓ reviewed` seal, and will not.

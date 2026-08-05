# SHIP — lessons-index

A thin, **advisory** roll-up of one gated `/pharn-dev-ship` run. It records **that the chain ran and what its
floor verdicts were** — nothing more.

## Stages, in order

| #   | stage                | outcome                                                                                |
| --- | -------------------- | -------------------------------------------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | **GATE 1** — plan written, `check-plan-lessons.mjs` GREEN, human approved _as written_ |
| 2   | `/pharn-dev-grill`   | advisory grill-log emitted — gates nothing, proceeded                                  |
| 3   | `/pharn-dev-build`   | floor GREEN                                                                            |
| 4   | `/pharn-dev-regress` | `no-regressions`                                                                       |
| 5   | `/pharn-dev-verify`  | `PASS`                                                                                 |
| 6   | `/pharn-dev-review`  | **GATE 2** — chain end                                                                 |

**Where the run ended: GATE 2** (the chain's designed end), not at a RED-verdict STOP. Every stage's
structural verdict was GREEN.

## Structural verdicts read, verbatim

- **`/pharn-dev-build`** → `node pharn/floor/validate.mjs .` exit code **`0`**
  (`FLOOR: GREEN — 36 capabilities checked in .`). The spec content-hash was re-verified at build time
  (fix #4) and **matched**: `a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753`.
- **`/pharn-dev-regress`** → `.dev/features/lessons-index/regression-report.json` `.verdict` =
  **`"no-regressions"`** (`regressions: []`, `pre_existing: []`; base
  `c0ca610726e1d607231700b2333d7311e2992134`).
- **`/pharn-dev-verify`** → `.dev/features/lessons-index/verify-report.json` `.verdict` = **`"PASS"`**
  (`failing_gates: []`; gates `test` / `validate` / `lint` / `format:check` / `lint:md` all `0`;
  `verifiers.registered: 0`).

Each verdict is its own stage's floor checker. `/pharn-dev-ship` **added no floor primitive** — it read
these three and branched on them, which is **advisory orchestration**.

## Artifacts (cited, not restated — P4)

- `.dev/features/lessons-index/REVIEW.md` — **read this before deciding.** It is advisory and carries
  **one blocking-severity finding** plus three advisory ones, and a proposed lesson candidate.
- `.dev/features/lessons-index/GRILL.md` — advisory; 7 concerns, 4 of which were folded into the build.
- `.dev/features/lessons-index/PLAN.md`, `REGRESSION.md`, `VERIFY.md`, `regression-report.json`,
  `verify-report.json`.

## Two things the human must weigh at this gate

Neither is a `/pharn-dev-ship` verdict — `/pharn-dev-review` has **no** structural verdict and `/pharn-dev-ship`
does not invent one (fix #3: a finding's `severity` is LLM-assigned and advisory; counting it as a gate
would be advisory-dressed-as-deterministic).

1. **`/pharn-dev-review` reports the increment as BLOCKED on one P0 finding** — `CLAUDE.md`'s edited
   "Three doc regions are GENERATED" bullet claims CI coverage (`as its own CI step`) that no workflow
   implements for the new checker. The review names two fixes; the in-scope one is a wording correction.
2. **A mid-run scope correction is on the record.** At build Step 0 the writes-scope setter resolved
   **16** paths against a plan the human approved with **13**, because the plan's exclusion block opened
   with a bold prose line outside `set-writes-scope.cjs`'s cue vocabulary rather than with a heading. It
   was caught before any write, the plan was corrected to the structural heading form, the scope re-set to
   exactly 13, and the episode is recorded in `PLAN.md` and proposed as lesson **Candidate A** in
   `REVIEW.md`. No approved path changed.

## Standing decision

**The decision is the human's.** The chain ran; the named floor verdicts are as shown — this is **NOT** a
judgment that the increment is good or wise; that is the human's call at the post-review gate.

`/pharn-dev-ship` has not merged, pushed, committed, or applied the `PHARN ✓ reviewed` seal, and will not.

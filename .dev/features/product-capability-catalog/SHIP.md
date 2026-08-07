# SHIP — product-capability-catalog

An **advisory** roll-up of one gated `/pharn-dev-ship` run. It records **that the chain ran and what its
floor verdicts were** — nothing more.

## Where the run ended

**GATE 2 — the post-review human decision.** The chain completed; no stage returned a RED verdict.

## Stages, in order

| #   | stage                | outcome                                                          |
| --- | -------------------- | ---------------------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | `PLAN.md` written → **GATE 1**, human approved "as written"      |
| 2   | `/pharn-dev-grill`   | `GRILL.md` — 5 advisory concerns; gates nothing, proceeded       |
| 3   | `/pharn-dev-build`   | **HALTED once** (see below), then re-run → floor **GREEN**       |
| 4   | `/pharn-dev-regress` | `regression-report.json` → `"no-regressions"`                    |
| 5   | `/pharn-dev-verify`  | `verify-report.json` → `"PASS"` (one gate red on the first pass) |
| 6   | `/pharn-dev-review`  | `REVIEW.md` — **GREEN**, 0 blocking, 6 advisory → **GATE 2**     |

## Structural verdicts read, verbatim

- **`/pharn-dev-build`** → `node pharn/floor/validate.mjs .` exit **`0`** (`FLOOR: GREEN — 36 capabilities
checked in .`). Capability count unchanged by the increment.
- **`/pharn-dev-regress`** → `regression-report.json` `.verdict` = **`"no-regressions"`**
  (`regressions: []`, `pre_existing: []`; base `123559e8f22d28f8e0e52ad74f805218f09eddb0`).
- **`/pharn-dev-verify`** → `verify-report.json` `.verdict` = **`"PASS"`** (`failing_gates: []`; gates
  `test` / `validate` / `lint` / `format:check` / `lint:md` all `0`; `verifiers.registered: 0`).

Each verdict is **FLOOR** — its own stage's checker. `/pharn-dev-ship`'s act of reading them and
proceeding is **ADVISORY orchestration**; nothing on the floor forces the sequence.

## The build HALT, recorded because it is the run's most important event

`/pharn-dev-build` **refused at Step 1** on its first attempt. `set-writes-scope.cjs --from-plan`
reported **6 paths** against the **2** the human approved: the plan's exclusion block had been written
as a **bold prose intro** rather than a heading, so the setter — which ends the authorized list at a
heading or a narrow prose cue — parsed every excluded path as an authorized one. The over-grant reached
`pharn/floor/capability-catalog-core.mjs` (the file this deferral exists to **not** create),
`SKILLS_VERSION` (which must not be bumped) and `.dev/memory-bank/lessons-learned.md` (canon).

This is `.dev/memory-bank/lessons-learned.md` **L18**, reproduced live — its **second** occurrence, the
first being what promoted it. The plan's `### Deliberately NOT in scope` heading form now bounds the
list; the setter re-run reports **2 paths**, and the corrected plan cites L18 with a body line recording
that it was applied _after_ the violation, not before. `/pharn-dev-review` **F1** carries this forward as
the run's primary proposed lesson candidate.

## Artifacts (cited, not restated — P4)

- `.dev/features/product-capability-catalog/PLAN.md` — the approved plan and the recorded deferral reasoning
- `.dev/features/product-capability-catalog/GRILL.md` — advisory interrogation (5 concerns)
- `.dev/features/product-capability-catalog/REGRESSION.md` / `regression-report.json`
- `.dev/features/product-capability-catalog/VERIFY.md` / `verify-report.json`
- `.dev/features/product-capability-catalog/REVIEW.md` — **read this before deciding**; its F1 and F2 are
  the two findings that want a human's action

## What actually landed

`CLAUDE.md` +18 lines, `CHANGELOG.md` +1 line. **19 insertions, 2 files, no deletions.** No `.mjs`, no
capability, no eval, no `SKILLS_VERSION` change, no floor primitive added. The increment is a **recorded
deferral**: the human answered the brief's P7 gate with "defer, and record it", and these two edits are
that record.

## Standing decision

The chain ran; the named floor verdicts are as shown — **this is NOT a judgment that the increment is
good or wise; that is the human's call at the post-review gate.** `/pharn-dev-ship` has not merged,
pushed, committed, or applied any seal, and this file is not an approval.

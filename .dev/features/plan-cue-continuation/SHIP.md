# SHIP — plan-cue-continuation

Gated `/pharn-dev-ship` run (no `--loop`). **Where it ended: GATE 2** — the chain ran; the human decides
merge / fix / abandon.

## Stages, in order, and where each verdict came from

| #   | stage                | structural verdict read                         | value                  | proceed? |
| --- | -------------------- | ----------------------------------------------- | ---------------------- | -------- |
| 1   | `/pharn-dev-plan`    | GATE 1 — human approval                         | standing instruction   | yes      |
| 2   | `/pharn-dev-grill`   | none (advisory by design)                       | folded into the plan   | yes      |
| 3   | `/pharn-dev-build`   | `node pharn/floor/validate.mjs .` **exit code** | **0** (GREEN, 36 caps) | yes      |
| 4   | `/pharn-dev-regress` | `regression-report.json` `.verdict`             | **`no-regressions`**   | yes      |
| 5   | `/pharn-dev-verify`  | `verify-report.json` `.verdict`                 | **`PASS`**, 1486/1486  | yes      |
| 6   | `/pharn-dev-review`  | none (no structural verdict exists — fix #3)    | **GREEN**, 0 findings  | GATE 2   |

```json
{ "verdict": "no-regressions", "regressions": [], "pre_existing": [] }
{ "verdict": "PASS", "failing_gates": [] }
```

Gates: `test` 0 (1486/1486) · `validate` 0 · `lint` 0 · `format:check` 0 · `lint:md` 0 ·
`structural:expected-injection-comment.json` 0.

## How GATE 1 was satisfied, stated rather than assumed

The human's standing instruction — _"fix everything and promote everything, and keep going with the next
fixes and promotion till everything is done"_ — was given **after** this defect had been named to them as
the next fix. That is recorded in `PLAN.md` as the GATE-1 approval, in the plan itself, so it is visible
and correctable rather than inferred. The model did not self-approve; the approval is the human's sentence.

`/pharn-dev-grill` was not run as a separate stage. Its work was done inline at plan time — the
guarantee-audit reduction, the trust/widening audit, and the P7 residual are all in `PLAN.md` — and the
grill gates nothing by design, so nothing downstream read a verdict that does not exist. Stated because
"the stage ran" and "the interrogation happened" are different claims, and only the second is true.

## What this increment is

The floor-escalation half of `.dev/memory-bank/lessons-learned.md` **L28**, promoted immediately before
it. `set-writes-scope.cjs --from-plan`'s head-less exclusion cue no longer fires on an authorized item's
own **wrapped** line — the defect that parsed a 5-path plan as 1 during the previous increment's planning.

**One design decision worth the reader's attention.** The obvious remedy — exempt every indented line —
fails **OPEN**: an indented exclusion sub-list would enter scope. The shipped exemption is stateful (a
blank line closes an item's body), and a dedicated assertion holds that boundary. The honest residual, in
the code and not only here: a **lazy** continuation still trips the cue.

## Pointers (cited, not restated — P4)

- `.dev/features/plan-cue-continuation/REVIEW.md` — GREEN; includes why the on-its-own-plan dogfood is
  **not** evidence the fix works.
- `.dev/features/plan-cue-continuation/REGRESSION.md` — the 14-path `scope` escape finding, disproven per
  class, with the stacked-increment limitation named.
- `.dev/features/plan-cue-continuation/VERIFY.md` — the L26 worktree route and the negative control.
- `.dev/features/plan-cue-continuation/set-writes-scope.patch` — the human-applied diff, declared in
  `## Files` **up front** this time (the previous increment's F4, corrected before the fact).

## What this record is, and what it is not (P0)

`/pharn-dev-ship` added **no** floor primitive; every guarantee belongs to a sub-stage. Running the stages
in order and reading their verdicts is **advisory orchestration**. `/pharn-dev-review`'s GREEN is not a
floor verdict and was not treated as one.

**Chain ran; the named floor verdicts are as shown — this is NOT a judgment that the increment is good or
wise; that is the human's call at the post-review gate.** No merge, no seal was issued here.

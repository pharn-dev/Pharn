# SHIP — loop-handoff (chain roll-up, ADVISORY)

`/pharn-dev-ship` ran the gated chain in order. It reimplemented no stage; it invoked each and read that
stage's own structural verdict.

## Stages that ran, in order

| #   | stage                | outcome                                                        |
| --- | -------------------- | -------------------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | `PLAN.md` written; halted at **GATE 1** — human approved       |
| 2   | `/pharn-dev-grill`   | `GRILL.md` — 9 advisory concerns; **gates nothing**, proceeded |
| 3   | `/pharn-dev-build`   | 3 files written, 5 edited; floor **GREEN**                     |
| 4   | `/pharn-dev-regress` | `regression-report.json` → **`no-regressions`**                |
| 5   | `/pharn-dev-verify`  | `verify-report.json` → **`PASS`**                              |
| 6   | `/pharn-dev-review`  | `REVIEW.md` — **BLOCKED**, 2 floor-gate + 2 advisory findings  |

**Where the run ended:** at **GATE 2**, the post-review human decision. Not at a RED-verdict STOP — every
structural verdict the chain branches on came back green.

## Structural verdicts read, verbatim

| stage                | verdict source                      | value                                                  |
| -------------------- | ----------------------------------- | ------------------------------------------------------ |
| `/pharn-dev-build`   | `node pharn/floor/validate.mjs .`   | exit **0** (`FLOOR: GREEN — 36 capabilities checked`)  |
| `/pharn-dev-regress` | `regression-report.json` `.verdict` | **`no-regressions`**                                   |
| `/pharn-dev-verify`  | `verify-report.json` `.verdict`     | **`PASS`** (`failing_gates: []`, six gates all exit 0) |

`/pharn-dev-grill` and `/pharn-dev-review` have **no structural verdict**, and `/pharn-dev-ship` does not
invent one for them (P0, fix #3). `/pharn-dev-review`'s severities are **LLM assignments** — its "BLOCKED"
line is an advisory judgment for the human, not a computed gate.

## Two human gates — both preserved

- **GATE 1 (plan acceptance)** — hit once, before build. The human approved the plan as written and
  resolved three open questions by selection: `SKILLS_VERSION` **minor `2.1.0`**, **YAML frontmatter**
  envelope, and **copy the `decision` through verbatim** from `check-loop.mjs`'s emitted JSON. All three
  are recorded in `PLAN.md` under "Open questions (HALT) — RESOLVED at GATE 1".
- **GATE 2 (post-review decision)** — this is where the run ends. `/pharn-dev-ship` presents; it does not
  merge, push, commit, or apply the `PHARN ✓ reviewed` seal.

## Pointers (cited, not restated — P4)

- `.dev/features/loop-handoff/PLAN.md` — the approved plan, plus the grill fold-in and the GATE-1 answers
- `.dev/features/loop-handoff/GRILL.md` — 9 advisory concerns (2 blocking-severity), all folded in
- `.dev/features/loop-handoff/REGRESSION.md` / `regression-report.json` — incl. the **L17 exclusion** of
  two sibling-stage artifacts from the scope partition, recorded rather than silently applied
- `.dev/features/loop-handoff/VERIFY.md` / `verify-report.json` — the six-gate table and the residual
- `.dev/features/loop-handoff/REVIEW.md` — the four lenses, the two blocking findings, and one proposed
  lesson candidate (shipped files citing `.dev/` paths that packaging strips)

## The standing decision is the human's

The chain ran; the named floor verdicts are as shown. **This is NOT a judgment that the increment is
good or wise; that is the human's call at the post-review gate.**

Two things belong in front of that decision, stated plainly rather than buried in the pointers:

1. **`/pharn-dev-review` returned BLOCKED on two P0 findings** — a comment inside the new floor checker
   that asserts a guarantee the same file elsewhere proves false, and a contract trust-cell that leaves
   one envelope field's value-correctness unqualified where its three siblings carry a caveat. Both are
   one-line corrections inside already-declared files; neither touches the mechanism, the tests, or any
   verdict. The review blocked on them **because** this increment ships a floor checker, and a false
   guarantee written inside the floor is the highest-leverage place for the disease to survive.
2. **Two claims were falsified and corrected during the build, not shipped.** The plan asserted the
   heading-membership test made the structure unforgeable; a failing test proved it does not — a
   line-initial `### next_steps` in a body **is** that heading, and no checker can distinguish "intended
   as prose". The mechanism was kept (it buys **unambiguity**, which is real) and the claim was rewritten
   in the contract, the checker, the tests, and the CHANGELOG. The L14 control-char guard is likewise
   documented as **redundant today** rather than credited with catches it does not make.

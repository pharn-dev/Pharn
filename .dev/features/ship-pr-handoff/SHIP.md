# SHIP — ship-pr-handoff

Chain run: `/pharn-dev-plan` → **[GATE 1: human approved]** → `/pharn-dev-grill` → `/pharn-dev-build` →
`/pharn-dev-regress` → `/pharn-dev-verify` → `/pharn-dev-review` → **[GATE 2: human decides]**.

Ended at **GATE 2**. No stage returned a non-GREEN verdict.

## Structural verdicts read, verbatim

| stage                | verdict read          | source (deterministic)                                            |
| -------------------- | --------------------- | ----------------------------------------------------------------- |
| `/pharn-dev-build`   | `validate` exit **0** | `node pharn/floor/validate.mjs .` → GREEN, 36 capabilities        |
| `/pharn-dev-regress` | **`no-regressions`**  | `.dev/features/ship-pr-handoff/regression-report.json` `.verdict` |
| `/pharn-dev-verify`  | **`PASS`**            | `.dev/features/ship-pr-handoff/verify-report.json` `.verdict`     |

`/pharn-dev-grill` is advisory by design and has no deterministic verdict to branch on; it was presented
and the chain proceeded regardless. `/pharn-dev-review` has no structural verdict either — none was
invented for it (fix #3).

## Pointers (cited, not restated — P4)

- `.dev/features/ship-pr-handoff/PLAN.md` — the approved plan, including the four options and Q1–Q4 as
  resolved at GATE 1.
- `.dev/features/ship-pr-handoff/GRILL.md` — 7 advisory concerns (0 blocking, 2 important, 5 minor).
- `.dev/features/ship-pr-handoff/REGRESSION.md` — the base/head gate table and the inside/outside split.
- `.dev/features/ship-pr-handoff/VERIFY.md` — the six floor gates; zero verifiers registered.
- `.dev/features/ship-pr-handoff/REVIEW.md` — the four lenses, **including one blocking P0 finding against
  this increment's own bytes, fixed before review closed**.

## What was decided, and what was refused

The increment was specified as "open the pull request". It **refused that** and shipped the handoff
instead: `/pharn-ship` Step 2d **displays** a `gh pr create --body-file` line and executes nothing. The
refusal is the substance — P7's trigger (a real failure) never fired, and a `git push` would have been the
first product action outside every floor gate, because fix #7 does not see Bash.

Re-run iterations: **none** (this is the gated mode; `--loop` was not used).

---

chain ran; the named floor verdicts are as shown — this is **NOT** a judgment that the increment is good
or wise; that is the human's call at the post-review gate.

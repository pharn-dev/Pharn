# SHIP — features-readme-spec-live

Gated `/pharn-dev-ship` run (no `--loop`). Every stage ran in order and the run ended at **GATE 2**, the
post-review human decision.

## Stages, in order, and where the run ended

| #   | stage                | outcome                                                   |
| --- | -------------------- | --------------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | halted at **GATE 1**; human approved as written           |
| 2   | `/pharn-dev-grill`   | 3 advisory concerns; presented, proceeded (gates nothing) |
| 3   | `/pharn-dev-build`   | floor GREEN                                               |
| 4   | `/pharn-dev-regress` | `no-regressions`                                          |
| 5   | `/pharn-dev-verify`  | `PASS`                                                    |
| 6   | `/pharn-dev-review`  | GREEN, 0 floor-gate findings — **GATE 2**                 |

## The structural verdicts read, verbatim

- **`/pharn-dev-build`** → `node pharn/floor/validate.mjs .` exit **0** (`FLOOR: GREEN — 36 capabilities
checked in .`). The spec-hash gate (fix #4) passed first: live
  `sha256(pharn/ARCHITECTURE.md)` = `8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`
  == the plan's `spec_content_hash`.
- **`/pharn-dev-regress`** → `regression-report.json` `.verdict` = **`"no-regressions"`**, helper exit
  **0**. `regressions[]` and `pre_existing[]` both empty; base
  `2b4fec89cbd68e03544b9bad4254360ee029f040`.
- **`/pharn-dev-verify`** → `verify-report.json` `.verdict` = **`"PASS"`**, helper exit **0**,
  `failing_gates[]` empty, all six gates exit 0. The advisory `verifiers` block
  (`registered: 0`) was **not** an input to that verdict (fix #3).

Each verdict was read from the named stage's own checker. `/pharn-dev-ship` added **no** floor primitive
this run: running the stages in order is advisory sequencing, and every guarantee above belongs to a
sub-stage.

## Pointers (cited, not restated — P4)

- `.dev/features/features-readme-spec-live/REVIEW.md` — the four lenses, 2 advisory findings (both
  minor), and a proposed lesson candidate for a separate human-gated promote run.
- `.dev/features/features-readme-spec-live/GRILL.md` — advisory; its 3 concerns were closed in the PLAN
  before build, which is why the built plan differs from the approved text in exactly three places.
- `REGRESSION.md`, `VERIFY.md`, and the two machine reports alongside them.

## What landed

Two files, exactly the two the plan's `## Files` declared — the scope-setter printed **2 path(s)** at
build Step 0, matching the human-approved list, and `check-regress.mjs scope` exited 0 with no escape:

- `features/README.md` — lines 8 and 18 no longer describe the shipped product pipeline as unbuilt.
- `CHANGELOG.md` — one `[Unreleased]` entry, carrying **no** version.

`SKILLS_VERSION` is **untouched at 2.5.1** (README is repo-meta). `pharn/floor/README.md` is untouched
(already correct since #126, verified live rather than assumed).

## Standing decision

The chain ran; the named floor verdicts are as shown — **this is NOT a judgment that the increment is
good or wise; that is the human's call at the post-review gate.** Nothing was merged, pushed, or sealed,
and no `PHARN ✓ reviewed` seal was applied.

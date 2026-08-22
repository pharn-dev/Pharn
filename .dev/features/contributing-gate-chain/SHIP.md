# SHIP — contributing-gate-chain

A roll-up of one gated `/pharn-dev-ship` run. **Advisory**: this records that the chain ran and what its
floor verdicts were. It is not an approval, not a "shipped", and not a `PHARN ✓ reviewed` seal.

## Where the run ended

**GATE 2 — the post-review human decision.** The chain completed all six stages; no stage returned a
non-GREEN verdict, so there was no RED-verdict STOP.

## Stages, in order

| #   | stage                | outcome                                                         |
| --- | -------------------- | --------------------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | halted at **GATE 1**; human approved, directing two scope folds |
| 2   | `/pharn-dev-grill`   | advisory; 5 concerns (0 blocking) — gates nothing               |
| 3   | `/pharn-dev-build`   | floor GREEN                                                     |
| 4   | `/pharn-dev-regress` | `no-regressions`                                                |
| 5   | `/pharn-dev-verify`  | `PASS`                                                          |
| 6   | `/pharn-dev-review`  | 1 blocking finding, corrected + re-verified; 4 advisory         |

GATE 1 was hit once and answered by the human: fold in **L12** (canonical repo slug, text supplied at
the gate) and the **line-57** dev/product boundary error, then "approve as written". The plan was
revised for the widened scope and re-checked before building.

## Structural verdicts read, verbatim

- **`/pharn-dev-build`** → `node pharn/floor/validate.mjs .` exit **0** (`FLOOR: GREEN — 36 capabilities
checked in "."`). Preceded by the fix #4 spec-hash gate: recomputed
  `8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`, equal to the plan's pin.
- **`/pharn-dev-regress`** → `regression-report.json` `.verdict` = **`"no-regressions"`** (exit 0).
  `regressions[]` empty, `pre_existing[]` empty, `escaped[]` empty. Re-run after the review-stage
  correction; the verdict JSON was byte-identical, so the committed report remains accurate.
- **`/pharn-dev-verify`** → `verify-report.json` `.verdict` = **`"PASS"`** (exit 0), `failing_gates[]`
  empty, over `test` / `validate` / `lint` / `format:check` / `lint:md` /
  `structural:expected-injection-comment`, all exit 0. `verifiers.registered` = 0. Re-run in full after
  the review-stage correction; still PASS.

## Pointers (cited, not restated — P4)

- `.dev/features/contributing-gate-chain/REVIEW.md` — the four lenses, F1–F5, and a proposed lesson
  candidate for a separate human-gated `/pharn-dev-memory-promote` run.
- `.dev/features/contributing-gate-chain/GRILL.md` — advisory interrogation, 13-griller coverage table.
- `.dev/features/contributing-gate-chain/VERIFY.md`, `REGRESSION.md`, `PLAN.md` — the per-stage records.

## What the run corrected about its own inputs

Recorded here because it changed what was built, not merely how it was described:

- The **L12 fix request's prescribed method** — confirm the canonical slug "against the actual git
  remote" — would have inverted the fix. The remote is `git@github.com:pharn-dev/pharn.git`, but the
  GitHub API resolves that to `pharn-dev/pharn-oss` (301 vs 200, identical `created_at`): the repo was
  renamed and the remote is the stale side, kept alive by the rename redirect. README's four badges
  were already correct; `CONTRIBUTING.md` and `SECURITY.md` held the stale slug.
- The request's claim that "whichever slug is stale 404s" is **false** — the stale slug redirects, so
  nothing 404s today. The fix still lands; the stated justification does not.
- The **M5 fix request named `CONTRIBUTING.md:33`**; a repo-wide sweep found the same drifted chain
  restated a second time at `:37`. Both were repaired.
- `/pharn-dev-review` found that the repair had introduced a **fresh P0 overclaim** ("the two commands
  above cover what CI checks" — CI is four workflows; CodeQL and gitleaks are not covered). Corrected
  within the approved `## Files`, and the full verify gate set plus the regress comparison were re-run
  afterward.

## Residuals carried to the gate

- **`GRILL.md` F1 (P7/L20):** the repaired drift still has no standing floor check — its correctness
  rests on one-time verification in this run. Widening the increment with a membership check over
  `package.json`'s `scripts.check` is a real scope increase and the human's call.
- **`REVIEW.md` F2:** the proposed lesson candidate is a proposal only; no canon was written.
- **M6 — RESOLVED after the first review pass.** Its text was located at
  `.pharn/fixes/M6-contributing-boundary-bullet.md` and the increment was found to under-deliver
  against it: M6 asks for three changes, and the observed-defect scoping had produced one and a half.
  Completed (all four `pharn/pharn-*` roots + the product floor named; `validate.mjs` stated to **be**
  that floor; deferral to CLAUDE.md as M6 suggested; the `:57`-vs-"executable floor" contradiction
  gone), then verify, regress, `npm run check` and the 7/7 enumeration all re-run green. See
  `REVIEW.md` F5 — which also records that the completing edit itself nearly repeated F1 via a
  forward reference to an obligation `CONTRIBUTING.md` does not contain.
- **Out of scope and unrepairable by any increment:** the local git remote still points at the stale
  slug. It is machine-local config, not a tracked file, and it will keep re-seeding the stale name into
  future docs until someone runs
  `git remote set-url origin git@github.com:pharn-dev/pharn-oss.git`.
- **No `SKILLS_VERSION` bump and no `CHANGELOG` entry**, both by membership: `CONTRIBUTING.md` and
  `SECURITY.md` are in CLAUDE.md's pure-repo-meta set, and precedent `ba1d3d6` (apparatus-only) carries
  neither.

---

The chain ran; the named floor verdicts are as shown — this is **NOT** a judgment that the increment is
good or wise; that is the human's call at the post-review gate.

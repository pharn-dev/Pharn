# SHIP — f15-route-group-scope

## Chain run, in order

1. **`/pharn-dev-plan`** → `PLAN.md` written; spec hash pinned (`8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`); `applied_lessons: [L19]`, floor-checked GREEN. **GATE 1: Approved as written.**
2. **`/pharn-dev-grill`** → `GRILL.md` written; 13 registered grillers run; 1 minor advisory finding (a self-contradictory `layer(s)` plan-metadata label); secret scan clean; spec-hash re-verified, no drift. Advisory — presented, chain proceeded regardless (grill gates nothing).
3. **`/pharn-dev-build`** → the one-line `clean()` regex fix applied via Bash (self-locked file), 4 tests added and measured against a live mutant, `SKILLS_VERSION` bumped, `CHANGELOG.md` updated. **`validate` exit: 0 (GREEN).**
4. **`/pharn-dev-regress`** → ran **twice**. First run found a **real regression** (`verdict: "regressions"`, `tests` gate flipped via `check-version-badge.test.mjs` — the plan's original `## Files` omitted the `README.md` badge companion to the `SKILLS_VERSION` bump). Presented at the stop; **human chose to widen scope** rather than abandon. `PLAN.md` amended to add `README.md`, the badge fixed, and the stage **re-run from scratch**. Second run: **`verdict: "no-regressions"`** (exit 0).
5. **`/pharn-dev-verify`** → **`verdict: "PASS"`** (exit 0). All 6 gates green: `test`, `validate`, `lint`, `format:check`, `lint:md`, `structural:pharn/pharn-review/trust-fence/evals/expected/expected-injection-comment.json`. No verifiers registered (`{"registered":0}`) — floor gates only.
6. **`/pharn-dev-review`** → **GREEN**, 0 blocking findings, 1 non-blocking advisory finding (a CHANGELOG compatibility claim stated as fact where `PLAN.md`'s own guarantee audit labels the same claim `advisory`), 1 proposed lesson candidate for a separate `/pharn-dev-memory-promote` decision.

**Where the run ended:** the end of the chain — GATE 2, below. No RED-verdict stop remains standing (the one that occurred at step 4 was resolved and the stage re-run to a clean verdict, both runs preserved in `REGRESSION.md`).

## Structural verdicts, verbatim

- `/pharn-dev-build` → `pharn/floor/validate.mjs .` exit **0** (`FLOOR: GREEN — 36 capabilities checked in .`)
- `/pharn-dev-regress` → `regression-report.json.verdict` = **`"no-regressions"`** (final run; first run's `"regressions"` is preserved in `REGRESSION.md`'s history section, not erased)
- `/pharn-dev-verify` → `verify-report.json.verdict` = **`"PASS"`**, `failing_gates: []`

## Pointers (cited, not restated)

- `.dev/features/f15-route-group-scope/GRILL.md` — grill findings (advisory)
- `.dev/features/f15-route-group-scope/REGRESSION.md` — both regress runs, in full
- `.dev/features/f15-route-group-scope/VERIFY.md` — the gate table
- `.dev/features/f15-route-group-scope/REVIEW.md` — the four lens findings + the proposed lesson candidate

## Files changed (working tree, uncommitted)

`.claude/hooks/set-writes-scope.cjs`, `.claude/hooks/set-writes-scope.test.cjs`, `CHANGELOG.md`, `README.md`, `SKILLS_VERSION` — plus this feature's own `.dev/features/f15-route-group-scope/**` artifacts. `SKILLS_VERSION`: `2.5.1` → `2.5.2` (patch).

## The standing decision is the human's

This record states that the chain ran and the named floor verdicts are as shown above — it is **not** a self-issued "shipped," not an approval, and not a `PHARN ✓ reviewed` seal. **GATE 2, now:** the human decides merge / fix / abandon. Nothing here commits, pushes, or merges anything; the working tree is exactly as left by the chain above, uncommitted, per the one-PR discipline the original build prompt named (branch off `main`, single concern).

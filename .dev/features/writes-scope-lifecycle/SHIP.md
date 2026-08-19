# SHIP — writes-scope-lifecycle

A thin, **advisory** roll-up of a gated `/pharn-dev-ship` run. It records **that the chain ran and its
floor verdicts** — nothing more.

## Stages, in order

| #   | stage                | ran | outcome                                                       |
| --- | -------------------- | --- | ------------------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | yes | **GATE 1** — approved "as written", 2 open questions resolved |
| 2   | `/pharn-dev-grill`   | yes | advisory; 9 concerns (0 blocking, 6 important, 3 minor)       |
| 3   | `/pharn-dev-build`   | yes | floor GREEN                                                   |
| 4   | `/pharn-dev-regress` | yes | `no-regressions`                                              |
| 5   | `/pharn-dev-verify`  | yes | `PASS` (after one investigated FAIL — see below)              |
| 6   | `/pharn-dev-review`  | yes | GREEN — 0 blocking floor-gate findings, 7 advisory            |
| 7   | GATE 2 → **fix**     | yes | all 7 advisory findings fixed; regress + verify re-run        |

**The run ended at GATE 2.** Not at a RED-verdict STOP. The human's decision there was **fix**, and the
verdicts below are from the **post-fix re-run**, not the first pass.

## Structural verdicts read, verbatim

- **`/pharn-dev-build`** → `node pharn/floor/validate.mjs .` **exit 0** (`FLOOR: GREEN — 36
capabilities checked in .`).
- **`/pharn-dev-regress`** → `regression-report.json` `.verdict` = **`"no-regressions"`**
  (`regressions: []`, `pre_existing: []`).
- **`/pharn-dev-verify`** → `verify-report.json` `.verdict` = **`"PASS"`** (`failing_gates: []`; gates
  `test` / `validate` / `lint` / `format:check` / `lint:md` / `structural:expected-injection-comment.json`
  all exit 0).

Each proceed decision was read from the stage's own deterministic verdict, never from prose and never
from this orchestrator's judgment.

## A human action inside the chain, and a stage that failed and was fixed

- **Two human-only hook diffs were applied mid-chain**, as GATE 1 resolved. `set-writes-scope.cjs` and
  `enforce-writes-scope.cjs` are fix #2-protected; the agent cannot write them (verified live: Write /
  Edit / MultiEdit all exit 2, six probes). They were delivered as `.patch` records and applied by
  human-directed `git apply`.
- **`/pharn-dev-verify`'s first gate pass FAILED** — `lint=1` (`no-control-regex`) and `format:check=1`,
  both introduced by that patch, both mine. Investigated rather than recorded, fixed at the root
  (the sanitizer was rewritten as a char-code scan matching `check-provenance.mjs`'s established idiom,
  not silenced with `eslint-disable`), re-measured, and the patch record on disk is the corrected one.
  The PASS above is the re-run.
- **`/pharn-dev-regress`'s `scope` sub-check exited 1** naming the two hooks as `## Files` escapes. This
  is L17's changed-since-base-vs-written-by-the-build shape. It was **disproven with three independent
  live measurements**, not waved through — see `REGRESSION.md`.

## Pointers (cited, not restated — P4)

- `.dev/features/writes-scope-lifecycle/PLAN.md` — the approved plan, 25 declared paths
- `.dev/features/writes-scope-lifecycle/GRILL.md` — advisory interrogation
- `.dev/features/writes-scope-lifecycle/REGRESSION.md` + `regression-report.json`
- `.dev/features/writes-scope-lifecycle/VERIFY.md` + `verify-report.json`
- `.dev/features/writes-scope-lifecycle/REVIEW.md` — **7 advisory findings and one proposed lesson**
  awaiting the human's decision; a promotion is a separate, human-gated `/pharn-dev-memory-promote` run
- `set-writes-scope.patch`, `enforce-writes-scope.patch` — the human-only diffs as applied

## GATE-2 fix pass

The human decided **fix**. All seven `REVIEW.md` findings were addressed — see that file's disposition
table and `PLAN.md`'s nine-row grill disposition. The material changes:

- **`asData()`'s fold widened** to U+2028 / U+2029 (line terminators that are neither C0 nor C1), a
  hole found by probing the fold rather than reading it. Delivered as a regenerated
  `enforce-writes-scope.patch` and re-applied; the new test **fails** against the C0/C1-only fold.
- **The corpus invariant moved to its own file**, `.claude/hooks/writes-scope-release.test.cjs`, so
  neither it nor the setter's suite carries two axes of change. It gained two tests: one pinning a
  single byte-identical release-line spelling, one pinning that the rule stays **conditional** so the
  two non-setter commands are never converted into guaranteed failures.
- **The PLAN's guarantee audit was corrected** to attribute the floor property to the reader
  (`absence of a scope file = the safe-set`) and to label `--clear` itself ADVISORY.
- **A test now covers** the `--clear` non-ENOENT unlink failure.
- **`## Files` grew 25 → 26** for the new test file; the setter re-parsed it at **26/26**.

Re-measured on the fixed tree: `npm test` **1475/1475**, `npm run check` 0-fail, `validate.mjs` GREEN.

## Standing decision

The standing decision is the **human's**.

> Chain ran; the named floor verdicts are as shown — this is **NOT** a judgment that the increment is
> good or wise; that is the human's call at the post-review gate.

No seal is issued here. `/pharn-dev-ship` does not merge, push, commit, or apply `PHARN ✓ reviewed`.

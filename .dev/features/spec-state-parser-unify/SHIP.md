# SHIP — spec-state-parser-unify

**Run reached GATE 2** (the post-review human decision), after one RED-verdict STOP that was resolved
by a human scope amendment. `/pharn-dev-ship` presents; it does not decide.

## Stages run, in order

| #   | stage                | structural verdict read                          | result                                        |
| --- | -------------------- | ------------------------------------------------ | --------------------------------------------- |
| 1   | `/pharn-dev-plan`    | — (GATE 1: human)                                | **approved as written**; bump → `patch`       |
| 2   | `/pharn-dev-grill`   | none — advisory by design, gates nothing         | 5 concerns (0 blocking, 3 important, 2 minor) |
| 3   | `/pharn-dev-build`   | `validate.mjs` exit **`0`**                      | GREEN — 36 capabilities                       |
| 4a  | `/pharn-dev-regress` | `.verdict` = **`"regressions"`**                 | **STOP** → human amended scope (GATE 1)       |
| 4b  | `/pharn-dev-regress` | `.verdict` = **`"no-regressions"`**              | proceed                                       |
| 5   | `/pharn-dev-verify`  | `.verdict` = **`"PASS"`**                        | proceed                                       |
| 6   | `/pharn-dev-review`  | none — no structural verdict exists (P0, fix #3) | 0 blocking, 3 minor advisory                  |

## Structural verdicts read, verbatim

- **`/pharn-dev-build`** → `node pharn/floor/validate.mjs .` exit **`0`**
  (`FLOOR: GREEN — 36 capabilities checked in .`)
- **`/pharn-dev-regress`** (final) → `regression-report.json` `.verdict` = **`"no-regressions"`**;
  `.regressions` = `[]`; `.pre_existing` = `[]`; scope partition `escaped: []`.
  Gate map base→head: `tests` `0`→`0`, `validate` `0`→`0`,
  `structural:expected-injection-comment` `0`→`0`.
- **`/pharn-dev-verify`** → `verify-report.json` `.verdict` = **`"PASS"`**; `.failing_gates` = `[]`.
  Gates: `test` 0 (1428 tests), `validate` 0, `lint` 0, `format:check` 0, `lint:md` 0,
  `structural:expected-injection-comment` 0. `verifiers: {registered: 0, findings: []}` — advisory, and
  **not** a verdict input (fix #3).
- **`/pharn-dev-review`** → **no structural verdict, and none was invented.** Its `severity` values are
  LLM-assigned and advisory; the human reads `REVIEW.md` at GATE 2.

## The one STOP, and how it was resolved

`/pharn-dev-regress` first returned `"regressions"`: the `tests` gate flipped `0`→`1` outside the
feature, because `.dev/floor/check-version-badge.test.mjs` caught `README.md`'s shields badge still
reading `2.7.1` after `SKILLS_VERSION` moved to `2.7.2`. The RED was **correct**; the defect was an
omission in the **approved PLAN** — its L1 meta-doc sweep named two version-stating docs and missed the
third.

`/pharn-dev-ship` **stopped rather than widening its own authorization**: the remedy amends an approved
plan's `## Files`, which is a GATE-1 matter. The human chose to amend **and** to record the sweep
correction in the PLAN. The scope-setter then parsed **8 paths against the 8 declared bullets**, the
badge was updated, and regress was re-run in full (same base SHA, byte-identical outside-test set —
verified by diff, not assumed) to `"no-regressions"`.

## Grill disposition (advisory throughout)

All 5 concerns fell **inside** the approved `## Files`, so none required a re-plan:

- **comprehension/P7** → the L6 rationale for _not_ parsing `check-spec.mjs`'s GREEN prose line is now
  in `emitState`'s header, where the next "optimization" will meet it.
- **testability/P1** → a **structural** test now asserts the gate's source holds no frontmatter-fence
  regex, no `node:fs` import, and no re-implemented value parsing — two behavioural fixtures could not
  distinguish "no second parser" from "a second parser that agrees on those two inputs".
- **security/P2** → a `★` fixture puts a raw `ESC` plus the gate's own verdict text **inside** the
  `state:` value and asserts no output line consists solely of the GREEN verdict.
- **architecture/P7** and **performance/P0** → both trades are now recorded in the code rather than
  left implicit.

## Pointers (cited, not restated — P4)

- `.dev/features/spec-state-parser-unify/REVIEW.md` — 4 lenses; **0 blocking**, 3 minor advisory
  (a stdout-echo escaping invariant that lives in another file; a TOCTOU that is unchanged in kind from
  before the fix; and a named P7 follow-up that `--hash`/`--spec-id` still exit silently). Also carries
  a **proposed** lesson candidate — a proposal only; canon is written solely by a separate
  `/pharn-dev-memory-promote` run behind its own human gate.
- `.dev/features/spec-state-parser-unify/VERIFY.md` · `verify-report.json` — the gate table.
- `.dev/features/spec-state-parser-unify/REGRESSION.md` · `regression-report.json` — the STOP, diagnosed.
- `.dev/features/spec-state-parser-unify/GRILL.md` — advisory; 5 concerns.
- `.dev/features/spec-state-parser-unify/PLAN.md` — the approved plan, as amended at GATE 1.

## What is uncommitted in the working tree

8 files, +388/−35. `pharn/floor/check-spec.mjs` (new `--state` mode) ·
`pharn/floor/check-spec-approved.mjs` (`readState` / `FM_RE` / `stripQuotes` and the `node:fs` import
**deleted**; state read through the canonical mode) · 3 test suites (+19 tests) · `SKILLS_VERSION`
`2.7.2` · `README.md` badge · `CHANGELOG.md` (new entry + the 2.5.0 entry's falsified claim corrected
in place).

Both original repro directions were re-verified live after the change: the duplicate-key spec now REDs
reporting `"Draft"` (matching canon exactly), and the trailing-comment spec now GREENs.

---

Chain ran; the named floor verdicts are as shown — this is **NOT** a judgment that the increment is
good or wise; that is the human's call at the post-review gate. No merge, no push, no commit, no
`PHARN ✓ reviewed` seal.

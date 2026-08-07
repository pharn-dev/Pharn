# SHIP — guard-self-protection

A thin, **advisory** roll-up of the `/pharn-dev-ship` run. It records **that the chain ran and its floor
verdicts** — nothing more.

## Stages run, in order

| stage                | outcome                                    | artifact                 |
| -------------------- | ------------------------------------------ | ------------------------ |
| `/pharn-dev-plan`    | halted at **GATE 1**; human approved       | `PLAN.md`                |
| `/pharn-dev-grill`   | advisory, gates nothing — 6 concerns       | `GRILL.md`               |
| `/pharn-dev-build`   | 9 files written; project gate green        | (the diff)               |
| `/pharn-dev-regress` | **`no-regressions`**                       | `regression-report.json` |
| `/pharn-dev-verify`  | **`PASS`**                                 | `verify-report.json`     |
| `/pharn-dev-review`  | advisory, 5 findings (1 blocking-severity) | `REVIEW.md`              |

**Run ended at: GATE 2** — the post-review human decision. No RED verdict STOPped it. At that gate the
human instructed the review's findings be fixed; `/pharn-dev-regress` and `/pharn-dev-verify` were then
**re-run from scratch** and are the verdicts recorded below.

## Structural verdicts read, verbatim

- **`/pharn-dev-build` → project gate:** `node pharn/floor/validate.mjs .` exit **0**
  (`FLOOR: GREEN — 36 capabilities checked in .`). Full `npm run check` exit **0**.
- **`/pharn-dev-regress` → `regression-report.json` `.verdict`:** `"no-regressions"` (helper exit 0).
  `regressions: []`, `pre_existing: []`; all three outside gates 0 → 0.
- **`/pharn-dev-verify` → `verify-report.json` `.verdict`:** `"PASS"` (helper exit 0), `failing_gates: []`,
  all six gates 0. `check-build-complete` → `"complete"`, 10/10 declared paths present.
- **Tests:** 1122 repo-wide, 1122 pass. The two touched checkers: **63 tests** (13 → 63), line coverage
  **97.53%** / **98.91%**.

Each verdict is the sub-stage's own deterministic checker. `/pharn-dev-ship` **adds no floor primitive**;
running the stages in order is advisory, and only these named verdicts are guarantees.

## Two human gates, both honored

- **GATE 1 (plan acceptance)** — hit once. The human settled three decisions that discovery had shown were
  underdetermined, one of which (the refusal set: 4 control files, not all of `.claude/`) changed the
  design after a live audit showed the literal reading would reject **46 of 104** historical plans.
- **A second, unplanned halt** — mid-build, when change B regressed two pre-existing fixtures in a file
  outside the approved edit set. The human extended the whitelist by that one file rather than the agent
  deciding it.
- **GATE 2 (post-review)** — where this run ends. Merge / fix / abandon is the human's call.

## Pointers (cited, not restated — P4)

- `.dev/features/guard-self-protection/REVIEW.md` — the 4 advisory lenses. Its **F1** (the two guards'
  four-path lists were three hand-maintained copies with no test pinning them to agree, against this
  repo's own documented deliberate-copy discipline) carried blocking severity and is now **RESOLVED**:
  four ✧ tests pin all three copies to the same set, each derived from source, and were measured
  rejecting three mutants (L4). The L-eval finding closes with it; the L-axis finding is accepted as
  designed now that the pin exists.
- `.dev/features/guard-self-protection/GRILL.md` — advisory, pre-build. Two of its six concerns were folded
  into the shipped bytes (entry normalization; the guards-are-independent composition note); its P6 concern
  came true exactly as written — re-scoping mid-build required `--allow-claude-dir`.
- `REGRESSION.md` — including two reds this run **fabricated** and caught by investigating rather than
  recording (`xargs -a` is GNU-only — L16 precisely; and an invented eval path).

## Follow-ups flagged, not taken

- `THREAT-MODEL.md` §4 (fix #2) and a `LIMITS.md` note — **human-only, hook-denied.** The agent cannot
  write them; this is the one item that genuinely requires a human hand. They will read stale until then.
- `pharn/floor/check-regress.mjs` — L17's real remedy (derive "written by the build" from the scope record,
  not the diff). **Deliberately not folded in:** it is a second axis of change and would bundle a distinct
  concern into a single-concern PR. The workaround is applied and disproved in `REGRESSION.md`.
- **F4** — `isProtected()`'s substring/case over-match. A separate axis, deliberately untouched.
- A lesson candidate (L3's re-audit must sweep **test fixtures**, not only documents) for a separate
  `/pharn-dev-memory-promote` run.

---

Chain ran; the named floor verdicts are as shown — this is **NOT** a judgment that the increment is good
or wise; that is the human's call at the post-review gate. No merge, no push, no seal was applied.

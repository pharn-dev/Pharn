# SHIP — entry-point-guard

A thin, **advisory** roll-up of one gated `/pharn-dev-ship` run. It records **that the chain ran and
its floor verdicts** — nothing more.

**Two iterations.** Iteration 1 ran the full chain and stopped at GATE 2. The human's GATE-2 decision
was **fix**, so the verification body (`fix → regress → verify → review`) ran a second time. Both
verdicts were **recomputed**, never carried forward. This was a human-directed second pass, not a
`--loop` run: `check-ship.mjs` was not the stop authority, the human was.

## Stages, in order, and where the run ended

| #   | stage                | artifact                                             | iter 1                      | iter 2                                         |
| --- | -------------------- | ---------------------------------------------------- | --------------------------- | ---------------------------------------------- |
| 1   | `/pharn-dev-plan`    | `PLAN.md`                                            | **GATE 1** — human approved | amended (`## Files` 14→15)                     |
| 2   | `/pharn-dev-grill`   | `GRILL.md`                                           | advisory; proceeded         | not re-run (plan intent unchanged)             |
| 3   | `/pharn-dev-build`   | 10 guard repairs + 1 new test + bump/badge/changelog | floor GREEN → proceed       | + 1 comment reword, 3 test fixes → floor GREEN |
| 4   | `/pharn-dev-regress` | `regression-report.json` + `REGRESSION.md`           | `no-regressions`            | `no-regressions`                               |
| 5   | `/pharn-dev-verify`  | `verify-report.json` + `VERIFY.md`                   | `PASS`                      | `PASS`                                         |
| 6   | `/pharn-dev-review`  | `REVIEW.md`                                          | **GATE 2** — 4 advisory     | all 4 closed, 0 open                           |

**The run ended at GATE 2 both times**, never at a RED-verdict STOP. No stage returned a non-GREEN
structural verdict in either iteration.

## Structural verdicts read, verbatim (iteration 2 — the standing set)

| stage                | verdict source                         | value read                                                     |
| -------------------- | -------------------------------------- | -------------------------------------------------------------- |
| `/pharn-dev-build`   | `node pharn/floor/validate.mjs .` exit | **`0`** (`FLOOR: GREEN — 36 capabilities checked in .`)        |
| `/pharn-dev-regress` | `regression-report.json` `.verdict`    | **`"no-regressions"`** (`regressions: []`, `pre_existing: []`) |
| `/pharn-dev-verify`  | `verify-report.json` `.verdict`        | **`"PASS"`** (`failing_gates: []`, 6 gates all exit 0)         |

Each was read as an **exit code / enum string** — the floor-verifiable class. No proceed/stop decision
in this run rested on any free-text field.

Supporting deterministic reads, also verbatim:

- spec-hash pin held at grill and at both builds: `sha256(pharn/ARCHITECTURE.md)` =
  `8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`, equal to the PLAN's
  `spec_content_hash` — no drift, and the `## Files` amendment does not move it (which is exactly why
  the amendment is recorded in prose; see below).
- `check-plan-lessons.mjs` → exit 0 before and after the amendment; all 9 cited ids resolve in canon.
- `check-regress.mjs scope` → exit 0, `escaped: []` in both iterations.
- `count-grillers.mjs` → 13 registered; `count-verifiers.mjs` → 0 registered.
- `set-writes-scope.cjs --from-plan` → **14 paths** (iter 1) → **15 paths** (iter 2), each equal to the
  plan's `## Files` bullet count at that moment.
- `check-version-badge.mjs` → GREEN, README badge `2.7.5` matches `SKILLS_VERSION` `2.7.5`.
- `npm run check` → exit 0; `npm test` → 1455 pass / 0 fail.

## The one weakened control, named rather than glossed

Iteration 2 **edited the plan's `## Files`** to authorize `.dev/floor/hash-doc.mjs`. `check-regress.mjs
scope` compares changed paths against that very list, so an amended plan is invisible to it — the gap
`check-regress.mjs` documents in its own honest-scope block, and one `check-plan-spec-agree.mjs` cannot
see either (a `## Files` edit does not move `spec_content_hash`). `escaped: []` is therefore weaker
evidence this iteration than last.

The compensating control is **not a checker**: it is `PLAN.md`'s `### Amendment note`, written **before**
any byte of `hash-doc.mjs` changed, stating what was added, on whose authority, and that the GATE-1
intent is unchanged. Anyone auditing this increment should read the `PLAN.md` diff, not only the
`escaped` row. Calling that an equivalent guarantee would be the P0 disease; it is an audit trail.

## Pointers (cited, not restated — P4)

- **`REVIEW.md`** — GATE-2 reading. 4 advisory findings at iteration 1, a disposition table closing all
  4 at iteration 2, 0 floor-gate findings throughout. Its findings are **not** reproduced here.
- **`GRILL.md`** — advisory; 8 concerns raised before the first build, gating nothing. Its
  blocking-severity finding (an untested edit shape) was folded into the build's test design; its
  `hash-doc.mjs` drift finding was carried to GATE 2 and fixed in iteration 2.
- **`PLAN.md`** — the approved intent, the GATE-1 resolution adopting `import.meta.main` over the
  requested `pathToFileURL(...).href`, and the GATE-2 amendment note.
- `REGRESSION.md`, `VERIFY.md` — the human renders of the two machine verdicts above.
- **A lesson candidate stands unpromoted** in `REVIEW.md`. Promotion is a separate human-gated
  `/pharn-dev-memory-promote` run; nothing here writes canon.

## Guarantee audit for this roll-up (P0)

- Running the stages in order → **ADVISORY**. Nothing on the floor forces the sequence.
- Proceeding past each stage → the **verdicts** are FLOOR (each sub-stage's own checker); the **act**
  of reading them and continuing is ADVISORY orchestration.
- Both human gates preserved → **ADVISORY** (command discipline). GATE 1 was `/pharn-dev-plan`'s own
  halt, answered through a selectable form; GATE 2 was presented and answered before iteration 2 began.
- Iterating after GATE 2 → **ADVISORY, and human-authorized.** No floor primitive decided to iterate;
  `check-ship.mjs` was not consulted, because this was not a `--loop` run.
- `/pharn-dev-ship` may write only `SHIP.md` → **FLOOR: hook (fix #7)**; the setter pinned this one
  path immediately before this write.
- **Net: this gated run introduced ZERO new floor primitive.** Every guarantee above belongs to a
  sub-stage.

  The increment itself did add a deterministic check — `.dev/floor/entry-point-guard.test.mjs` — but
  that is the **feature**, not the orchestrator, and it reduces to `pharn/ARCHITECTURE.md §2`
  primitive #3 (enum/regex + exit-code membership), introducing no new primitive either.

---

Chain ran twice; the named floor verdicts are as shown — this is **NOT** a judgment that the increment
is good or wise; that is the human's call at the post-review gate.

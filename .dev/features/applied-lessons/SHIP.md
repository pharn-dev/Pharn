# SHIP — applied-lessons

An **advisory** roll-up of the `/pharn-dev-ship` run. It records **that the chain ran and its floor
verdicts** — nothing more.

## Stages run, in order

| #   | stage                | outcome                                                       |
| --- | -------------------- | ------------------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | PLAN.md written → **GATE 1**, human approved                  |
| —   | _(human)_            | `pharn/ARCHITECTURE.md §6` edited outside the agent loop (Q3) |
| —   | _(re-pin)_           | `spec_content_hash` recomputed after the §6 edit              |
| 2   | `/pharn-dev-grill`   | GRILL.md — 8 advisory findings + 1 canon observation          |
| 3   | `/pharn-dev-build`   | 10 planned paths written; floor run                           |
| 4   | `/pharn-dev-regress` | regression-report.json                                        |
| 5   | `/pharn-dev-verify`  | verify-report.json                                            |
| 6   | `/pharn-dev-review`  | REVIEW.md — 0 blocking, 5 advisory, 2 proposed lessons        |

**Where the run ended: GATE 2** — the post-review human decision. No RED-verdict STOP occurred.

## The structural verdicts read, verbatim

- **`/pharn-dev-build`** → `node pharn/floor/validate.mjs .` **exit 0** (`FLOOR: GREEN — 36 capabilities
checked in .`).
- **`/pharn-dev-regress`** → `regression-report.json` `.verdict` = **`"no-regressions"`**
  (`regressions: []`, `pre_existing: []`; outside gates `tests` 0→0, `validate` 0→0; base
  `de83cbbf4ff3ecf90584eae382bc06f49cdc5f46`).
- **`/pharn-dev-verify`** → `verify-report.json` `.verdict` = **`"PASS"`** (`failing_gates: []`; gates
  `test` / `validate` / `lint` / `format:check` / `lint:md` all 0; `verifiers.registered: 0`).

The fix #4 spec-hash gate was re-checked at build time and **matched**
(`a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753`).

## Pointers (cited, not restated — P4)

- `.dev/features/applied-lessons/REVIEW.md` — the advisory review, its 5 findings, and the 2 proposed
  canon candidates.
- `.dev/features/applied-lessons/GRILL.md` — the advisory plan interrogation (gates nothing).
- `.dev/features/applied-lessons/REGRESSION.md` — including **two orchestration defects surfaced this
  run**, both in the advisory layer, neither affecting a verdict.
- `.dev/features/applied-lessons/VERIFY.md` — the gate table and the honest residual.

## What is NOT decided here

`/pharn-dev-ship` added **no new floor primitive**: every guarantee above belongs to a **sub-stage**
(`validate`, `check-regress`, `check-verify`, the writes-scope hooks, the build's spec-hash re-check).
Running the stages in order was **advisory orchestration**.

Two items were deliberately **left to the human** rather than settled by the build:

1. **`SKILLS_VERSION` bump size** — built as planned at 1.2.0 (minor), but both `/pharn-dev-grill` and
   `/pharn-dev-review` flagged that making a frontmatter field mandatory in the shipped product PLAN
   shape meets CLAUDE.md's **major** criterion. **RESOLVED AT GATE 2: the human chose major →
   `SKILLS_VERSION` 1.1.4 → `2.0.0`**, with a `### Changed — BREAKING` CHANGELOG entry carrying the
   one-line migration (`applied_lessons: none`). The approved PLAN's `## Files` still records the
   1.2.0 intent — that is the GATE-1 record and is deliberately left unrewritten; this line is the
   audit trail of the change.
2. **A widened untrusted-ingestion surface** — `/pharn-plan` now reads a user-controlled
   `memory-bank/lessons-learned.md` in full. Bounded at the verdict (no guaranteed decision reads lesson
   prose; ★ tests witness it), **not** bounded at the advisory layer.

Chain ran; the named floor verdicts are as shown — **this is NOT a judgment that the increment is good
or wise; that is the human's call at the post-review gate.** No merge, no push, no
`PHARN ✓ reviewed` seal has been applied.

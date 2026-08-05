# SHIP — typed-lessons

An **advisory** roll-up of one gated `/pharn-dev-ship` run. It records **that the chain ran and what each
stage's floor verdict was** — nothing more.

## Stages run, in order

| #   | stage                | ended                                                 |
| --- | -------------------- | ----------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | **GATE 1** — human approved ("Approve as written")    |
| 2   | `/pharn-dev-grill`   | advisory verdict presented; proceeded (gates nothing) |
| 3   | `/pharn-dev-build`   | proceeded on `validate` exit **0**                    |
| 4   | `/pharn-dev-regress` | proceeded on `.verdict == "no-regressions"`           |
| 5   | `/pharn-dev-verify`  | proceeded on `.verdict == "PASS"`                     |
| 6   | `/pharn-dev-review`  | **GATE 2** — chain end; handed to the human           |

**Where the run ended: GATE 2.** No stage returned a RED verdict, so no RED-verdict STOP occurred.

## Structural verdicts read, verbatim

Each was the **sole** basis for proceeding past its stage — never my assessment of the work.

- **`/pharn-dev-build`** → `node pharn/floor/validate.mjs .` exit **`0`**
  (`FLOOR: GREEN — 36 capabilities checked in .`)
- **`/pharn-dev-regress`** → `.dev/features/typed-lessons/regression-report.json` `.verdict` =
  **`"no-regressions"`** (`check-regress.mjs verdict` exit 0; `regressions: []`, `pre_existing: []`)
- **`/pharn-dev-verify`** → `.dev/features/typed-lessons/verify-report.json` `.verdict` = **`"PASS"`**
  (`check-verify.mjs` exit 0; `failing_gates: []`; 6 gates all exit 0)

Two further floor reads, recorded because they were also enum/hash-grade and also gated something:

- **spec-hash (fix #4)** — `sha256(pharn/ARCHITECTURE.md)` =
  `a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753`, recomputed at plan, grill and build;
  **matched** the PLAN's pin at every read. No drift, so `/pharn-dev-build`'s refuse-on-drift gate did not fire.
- **`check-plan-lessons.mjs`** on the PLAN → exit **0** (`applied_lessons: L1, L2, L3, L6, L7, L14`, all six
  resolving). This gated `/pharn-dev-plan`'s own halt.

## Pointers (cited, not restated — P4)

- **`.dev/features/typed-lessons/REVIEW.md`** — the post-review findings. Read it at the gate; it is not
  summarized here.
- **`.dev/features/typed-lessons/GRILL.md`** — advisory plan interrogation (8 concerns, 0 blocking). Gated
  nothing by design.
- `PLAN.md` · `REGRESSION.md` · `VERIFY.md` · `regression-report.json` · `verify-report.json` — the rest of
  the audit trail.

## Writes-scope (fix #7) — the one floor guarantee `/pharn-dev-ship` itself holds

Each stage set its **own** Step-0 scope before writing, and this file was scoped to itself immediately
before this write (`--from-frontmatter .claude/commands/pharn-dev-ship.md --target …/SHIP.md`). The build's
scope resolved to exactly the plan's 6 `## Files` paths, and `check-regress.mjs scope` exited 0 — no changed
path fell outside the declared writes. Note the honest bound: the Bash stage-invocations are **not**
hook-gated; only the Write-tool calls are.

## What this document is NOT

`/pharn-dev-ship` **added no new floor primitive.** Every guarantee above belongs to a **sub-stage** —
`validate`, `check-regress`, `check-verify`, `check-plan-lessons`, the content-hash, the writes-scope hooks.
Running the stages in order is **advisory orchestration**; nothing on the floor forced the sequence. Do not
write "`/pharn-dev-ship` ensured the chain ran" or "ensures quality" — that is the disease this repo exists to
prevent (P0).

Nothing here is a merge, a push, or the `PHARN ✓ reviewed` seal. None was applied.

**The chain ran; the named floor verdicts are as shown — this is NOT a judgment that the increment is good
or wise; that is the human's call at the post-review gate.**

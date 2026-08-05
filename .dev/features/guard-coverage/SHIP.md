# SHIP — guard-coverage

A thin, **advisory** roll-up of one gated `/pharn-dev-ship` run. It records **that the chain ran and what its
floor verdicts were** — nothing more.

## Stages, in order

| #   | stage                | outcome                                                                                |
| --- | -------------------- | -------------------------------------------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | **GATE 1** — plan written, `check-plan-lessons.mjs` GREEN, human approved _as written_ |
| 2   | `/pharn-dev-grill`   | advisory grill-log — 6 concerns; 3 folded into the build. Gates nothing, proceeded     |
| 3   | `/pharn-dev-build`   | **HALT at Step 1.3** (precondition failed) → human re-scoped → floor GREEN             |
| 4   | `/pharn-dev-regress` | `no-regressions` (base `0323bf9`)                                                      |
| 5   | `/pharn-dev-verify`  | `PASS`                                                                                 |
| 6   | `/pharn-dev-review`  | **GATE 2** — chain end                                                                 |

**Where the run ended: GATE 2.** No stage returned a non-GREEN structural verdict. One stage **halted
mid-run** and was resolved by the human, which is the designed behavior, not a failure.

## Structural verdicts read, verbatim

- **`/pharn-dev-build`** → `node pharn/floor/validate.mjs .` exit **`0`**
  (`FLOOR: GREEN — 36 capabilities checked in .`). Spec content-hash re-verified at build time (fix #4)
  and **matched**: `a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753`.
- **`/pharn-dev-regress`** → `.dev/features/guard-coverage/regression-report.json` `.verdict` =
  **`"no-regressions"`** (`regressions: []`, `pre_existing: []`; base
  `0323bf9f63d6fb63e79d8aeab9de6d8a3bcd60fd`, 52 outside test files).
- **`/pharn-dev-verify`** → `.dev/features/guard-coverage/verify-report.json` `.verdict` = **`"PASS"`**
  (`failing_gates: []`; `test` / `validate` / `lint` / `format:check` / `lint:md` all `0`;
  `verifiers.registered: 0`).

Each verdict belongs to its own stage's floor checker. `/pharn-dev-ship` **added no floor primitive** — it
read these three and branched on them, which is **advisory orchestration**.

## The mid-run halt (recorded because it is the run's defining event)

Commit **`0323bf9` ("update")** landed **between `/pharn-dev-grill` and `/pharn-dev-build`** and already made
the `ci.yml` change the approved plan existed to make. `/pharn-dev-build` Step 1.3 caught the failed
precondition and **halted to the human** rather than building a plan whose main file was now a no-op. The
human chose to adapt in place; the plan carries the amendment inline, and the base for `/pharn-dev-regress`
moved from `0562f9e` to `0323bf9` as a consequence.

## Artifacts (cited, not restated — P4)

- `.dev/features/guard-coverage/REVIEW.md` — **read before deciding.** Advisory; **one blocking-severity
  finding**, four advisory, and a proposed lesson **Candidate B**.
- `.dev/features/guard-coverage/GRILL.md` — advisory; 6 concerns, 3 folded into the build.
- `.dev/features/guard-coverage/REGRESSION.md` — includes the investigation of a real scope escape.
- `PLAN.md`, `VERIFY.md`, `regression-report.json`, `verify-report.json`.

## Three things for the human at this gate

None is a `/pharn-dev-ship` verdict — `/pharn-dev-review` has **no** structural verdict and `/pharn-dev-ship`
does not invent one (fix #3: a finding's `severity` is LLM-assigned and advisory).

1. **`/pharn-dev-review` reports BLOCKED on one P0 finding** — `CLAUDE.md:260` says the sentence "cannot
   quietly become false", but the ✧ test does not pin the step **name** the sentence cites. One-word fix,
   inside `## Files`; the review recommends narrowing the claim rather than widening the guard.
2. **A `/pharn-dev-build` defect that will recur on every future increment.** Step 2b says "format the
   just-written files" but runs `npm run format` = `prettier --write .` over the whole repo. It silently
   modified `.dev/floor/check-lessons-index.mjs` this run — an undeclared write that fix #7 **structurally
   cannot** catch, since prettier runs through Bash. It was investigated, found to be a **repair** (that
   file was committed format-RED at `0323bf9`, verified live in a worktree), and **declared** in the plan
   rather than hidden or reverted. Proposed as lesson **Candidate B**.
3. **Two lesson candidates are now pending promotion**, neither written to canon: **Candidate A** (a PLAN's
   exclusion subsection must be a heading — from the previous increment) and **Candidate B** (a stage's
   Bash-run tooling escapes `writes:` scope). Both need a separate `/pharn-dev-memory-promote` run with its
   own accept/deny gate.

## Standing decision

**The decision is the human's.** The chain ran; the named floor verdicts are as shown — this is **NOT** a
judgment that the increment is good or wise; that is the human's call at the post-review gate.

`/pharn-dev-ship` has not merged, pushed, committed, or applied the `PHARN ✓ reviewed` seal, and will not.

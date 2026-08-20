# SHIP — validate-bad-target

Gated `/pharn-dev-ship` (no `--loop`). Increment: make `pharn/floor/validate.mjs` exit RED on a
nonexistent or non-directory target instead of reporting `GREEN — 0 capabilities checked`.

## Stages run, in order

| #   | stage                | outcome                                         |
| --- | -------------------- | ----------------------------------------------- |
| 1   | `/pharn-dev-plan`    | halted at **GATE 1**; human approved as written |
| 2   | `/pharn-dev-grill`   | advisory grill-log emitted; gates nothing       |
| 3   | `/pharn-dev-build`   | floor GREEN → proceed                           |
| 4   | `/pharn-dev-regress` | `no-regressions` → proceed                      |
| 5   | `/pharn-dev-verify`  | `PASS` → proceed                                |
| 6   | `/pharn-dev-review`  | chain end — **GATE 2**                          |

**Where the run ended: GATE 2.** No stage returned a RED verdict, so no RED-verdict STOP occurred.

## Structural verdicts read, verbatim

- **`/pharn-dev-build`** → `node pharn/floor/validate.mjs .` exit code **0** (`FLOOR: GREEN — 36
capabilities checked in .`). This is the build stage's verdict; `/pharn-dev-build` emits no machine
  report.
- **`/pharn-dev-regress`** → `regression-report.json` `.verdict` = **`"no-regressions"`**
  (`check-regress.mjs verdict`, exit 0). `regressions[]` empty, `pre_existing[]` empty; 3 outside gates
  compared, `0 → 0` on each.
- **`/pharn-dev-verify`** → `verify-report.json` `.verdict` = **`"PASS"`** (`check-verify.mjs`, exit 0).
  `failing_gates[]` empty; 6 gates, all exit 0.

Each verdict was read from the named deterministic source, never from a stage's prose and never from
this orchestrator's judgment.

## A verdict that was re-run, and why

The **first** `lint` gate run inside `/pharn-dev-verify` exited **1** — `no-useless-assignment` on
`let targetStat = null` in code the build had just written. No verify verdict was computed or recorded
at that point. The red was traced to `/pharn-dev-build` Step 2b, which requires confirming
`npm run lint` clean and had been run as prettier + markdownlint only; the repair completed that build
step within the approved plan's `## Files`, under the plan's own writes-scope.

`/pharn-dev-regress`'s HEAD capture was then re-run against the repaired tree and produced a
**byte-identical** verdict, so `regression-report.json` remains accurate verbatim rather than stale.
The verify gate table in `VERIFY.md` is a full re-run, not a patched map. Both the red and the repair
are recorded in `VERIFY.md`; the underlying process gap is finding F3 in `REVIEW.md`.

## Artifacts

- `.dev/features/validate-bad-target/PLAN.md` — the approved plan (GATE 1).
- `.dev/features/validate-bad-target/GRILL.md` — advisory grill-log, 4 concerns. Gates nothing.
- `.dev/features/validate-bad-target/regression-report.json` / `REGRESSION.md`
- `.dev/features/validate-bad-target/verify-report.json` / `VERIFY.md`
- `.dev/features/validate-bad-target/REVIEW.md` — **read this before deciding.** Its verdict is
  `BLOCKED — 1 floor-gate finding (P0), 2 advisory`. Cited, not restated (P4).

**The review's verdict is not a structural verdict, and this roll-up does not treat it as one.**
`/pharn-dev-review` writes prose only; a finding's `severity` is LLM-assigned and therefore advisory
(fix #3). It is presented to the human at GATE 2, not computed into a proceed/stop. That said, the P0
finding it raises concerns a wording claim in `validate.mjs:20` and `CHANGELOG.md:71` that exceeds
what the new guard proves, reproduced live — the human should weigh it before merging.

## Files changed (5, exactly the plan's `## Files`)

`pharn/floor/validate.mjs`, `pharn/floor/validate.test.mjs`, `SKILLS_VERSION` (2.7.11 → 2.7.12,
patch), `README.md` (version badge), `CHANGELOG.md`. `check-regress.mjs scope` reported
`escaped: []`.

## GATE 2 outcome — fix F1, then re-verify

The human decided **fix F1, then re-verify** (not merge, not abandon). That decision was taken and the
chain re-entered at the fix, exactly as far as the decision authorized — **no re-plan, no re-approval,
and GATE 1 was not re-entered.**

- **F1 repaired** (prose-only, inside the approved `## Files`): the "readable directory" claims at
  `pharn/floor/validate.mjs:20`, the guard's `NARROWED, and stated` block, and `CHANGELOG.md` now claim
  existence + directory-ness only, and each names the unreadable-directory residual beside the
  valid-but-wrong-directory one. No branch, message, exit code, or test changed.
- **Step 2b run complete this time** — prettier, markdownlint, **and** `eslint` over the scoped paths
  (rc 0), which is F3's remedy applied by hand rather than left to the prose instruction that failed
  earlier in this run.
- **`/pharn-dev-regress` re-run** → verdict byte-identical for the second time; `regression-report.json`
  remains accurate verbatim.
- **`/pharn-dev-verify` re-run from scratch** → **`PASS`**, six gates all 0, `failing_gates[]` empty.
  `verify-report.json` already matched and was not rewritten.
- **`REVIEW.md` amended, not reissued** — clearly-marked post-GATE-2 sections record what was resolved;
  the findings as originally issued were left intact.

`npm run check` (the aggregate gate) exits **0**.

## Second GATE-2 pass — F2 and F3 also fixed

The human then directed that the remaining findings be fixed, the lesson promoted, and a PR opened.
All three were carried out; this section is the record, and it supersedes an earlier line here that
said F2 and F3 remained open.

- **F2 fixed, inside this increment's `## Files`.** Both renders that echo the target now quote and
  escape it. The fix went wider than the finding: F2 cited only the new refusal render, but the
  long-standing GREEN line carries the same property, and fixing one call site would have left the
  other free to reintroduce it.
- **F3 fixed as a SEPARATE increment** — `.dev/features/build-step2b-lint/`, with its own `PLAN.md`
  (floor-checked `applied_lessons`), its own writes-scope, and its own `PASS` verify. It is separate
  because `.claude/commands/pharn-dev-build.md` sits outside this increment's approved `## Files`, and
  folding it in would have meant retroactively rewriting a human-approved scope — the one move
  `/pharn-dev-regress` names as structurally undetectable. **GATE 1 for that increment was the human's
  "fix everything" instruction rather than a fresh plan halt; that substitution is recorded here rather
  than left implicit.**
- **Lesson promoted to canon as `L30`** by a gated `/pharn-dev-memory-promote` run —
  `check-provenance.mjs` GREEN, id unique, scope pinned to the single canon file, canon style repaired
  by hand rather than with an auto-fixer. `docs/lessons-index.md` regenerated (30 lessons, 30 tagged,
  0 untagged) so `docs:check` stays GREEN.
- **PR #157 opened**, all 8 CI checks green — including the `check` and `floor` jobs.

**Still open, and deliberately so:** an unreadable (`chmod 000`) directory passes the target guard and
still reports GREEN over zero capabilities. The human chose the narrowing remedy over a readability
probe at the first GATE 2, so this is a **stated limit**, named at three sites, not an oversight.

## Standing decision

The decision is the human's. This file records **that the chain ran and its floor verdicts** — it is
not a self-issued "shipped", not an approval, and not a `PHARN ✓ reviewed` seal. Nothing here was
merged, committed, pushed, or sealed.

_Chain ran; the named floor verdicts are as shown — this is NOT a judgment that the increment is good
or wise; that is the human's call at the post-review gate._

# SHIP — per-stage-model-config (advisory roll-up)

`/pharn-dev-ship` gated chain over the increment **"make `/pharn-dev-*` stages read model+effort from `pharn.config.json`"**, redirected at GATE 1 to **Option B — config file + floor validator, binding explicitly advisory** (which authorized reversing the prior P7 deferral of `pharn.config.json`).

## Stages run, in order, and where the run ended

| stage              | ran | structural verdict (verbatim)                                    |
| ------------------ | --- | ---------------------------------------------------------------- |
| /pharn-dev-plan    | ✓   | GATE 1 — human **approved** (plan halt)                          |
| /pharn-dev-grill   | ✓   | advisory — gates nothing (6 concerns, see GRILL.md)              |
| /pharn-dev-build   | ✓   | FLOOR: `validate.mjs` exit **0** (GREEN)                         |
| /pharn-dev-regress | ✓   | FLOOR: `regression-report.json` .verdict = **no-regressions**    |
| /pharn-dev-verify  | ✓   | FLOOR: `verify-report.json` .verdict = **PASS** (5 gates exit 0) |
| /pharn-dev-review  | ✓   | advisory lenses — **GREEN**, 0 blocking floor-findings           |

**Run ended at GATE 2** (post-review human decision) — the normal terminus, not a RED-verdict STOP. No stage returned a non-GREEN structural verdict.

## The structural verdicts (the only floor-grade content here)

- **build** → `node .dev/floor/validate.mjs .` exit **0**.
- **regress** → `.dev/features/per-stage-model-config/regression-report.json` `.verdict` = **`no-regressions`** (`check-regress.mjs verdict` exit 0; 3 outside gates 0→0).
- **verify** → `.dev/features/per-stage-model-config/verify-report.json` `.verdict` = **`PASS`** (`check-verify.mjs` exit 0; `test`/`validate`/`lint`/`format:check`/`lint:md` all exit 0).

Each verdict belongs to its **sub-stage**; `/pharn-dev-ship` added **no new floor primitive** (gated mode). Running the stages in order and reading their verdicts is **advisory orchestration** — the two clocks.

## Pointers (cited, not restated — P4)

- **`.dev/features/per-stage-model-config/REVIEW.md`** — the advisory review (GATE-2 reading). Verdict GREEN; **6 advisory findings** (2 important: the runtime binding is advisory & shaky under `/pharn-dev-ship`'s single-turn execution; and no real triggering failure — P7). Also carries a proposed lessons-learned candidate (the zsh `node --test` word-splitting gotcha) for a **separate** `/pharn-dev-memory-promote` run.
- **`.dev/features/per-stage-model-config/GRILL.md`** — advisory pre-build interrogation (gates nothing).
- **`PLAN.md`** — the approved intent + guarantee/trust/determinism audits.

## What landed

`pharn.config.json` (root; `default`+`plan`/`build`/`review`), `.dev/floor/check-config.{mjs,test.mjs}` (validate + resolve + config↔frontmatter agreement, 15 tests incl. a live real-repo agreement gate), and `model:`/`effort:` frontmatter on `pharn-dev-{plan,build,review}.md`.

## Standing decision

The chain ran; the named floor verdicts are as shown. **This is NOT a judgment that the increment is good or wise — that is the human's call at the post-review gate.** `/pharn-dev-ship` does not merge, push, seal, or apply `PHARN ✓ reviewed`. Nothing has been committed.

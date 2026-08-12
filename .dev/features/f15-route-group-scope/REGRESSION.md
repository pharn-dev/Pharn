# REGRESSION — f15-route-group-scope

**Base:** `c880413ef5e24916c5743e66306b39b3d68e25c9` (working-tree dogfood build — `git status --porcelain` was non-empty, so base = HEAD per the deterministic auto-detect rule).

**Inside (the changed scope, second/final run):** `.claude/hooks/set-writes-scope.cjs`, `.claude/hooks/set-writes-scope.test.cjs`, `CHANGELOG.md`, `README.md`, `SKILLS_VERSION`, plus this feature's own `GRILL.md` / `PLAN.md` / `regression-report.json` / `REGRESSION.md` (exempted via `--feature f15-route-group-scope`, `escaped: []`). Nothing escaped the (now-widened) plan's declared `## Files`.

**Style gates skipped (deterministic optimization):** `inside` touches no shared style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), so a style flip over the byte-identical outside files is provably impossible — `lint` / `format:check` / `lint:md` were not run at either base or head.

## This is the SECOND run — a real regression was found, fixed, and re-measured

The **first** `/pharn-dev-regress` run over the originally-approved plan (`README.md` **not** in `## Files`) found a real regression: `.dev/floor/check-version-badge.test.mjs`'s live-repo self-test flipped pass→fail, because `SKILLS_VERSION` moved `2.5.1`→`2.5.2` while the README's shields badge stayed `pharn-2.5.1`. That run's verdict was `"regressions"` (exit 1) and `/pharn-dev-ship`'s gated chain **stopped** there and presented it to the human, per its non-negotiable stop-on-regression rule — it was not routed around.

**The human chose to widen scope**, not abandon or proceed unresolved: `README.md` was added to the plan's `## Files` (with a note recording why and pointing at this file), the badge was updated `pharn-2.5.1`→`pharn-2.5.2`, and `/pharn-dev-regress` was **re-run from scratch** with the widened `declared` set. This file records the **final** (second) run's result; the interim regression is preserved in this increment's history (the plan's `## Files` note + this section) rather than silently overwritten.

## Per-gate exit codes (base → head), final run

| Gate                                                                                       | Base | Head | Flip? |
| ------------------------------------------------------------------------------------------ | :--: | :--: | ----- |
| `tests` (62 outside `*.test.mjs`/`*.test.cjs` files, `node --test`)                        |  0   |  0   | no    |
| `validate` (`node pharn/floor/validate.mjs .`, whole-repo granularity)                     |  0   |  0   | no    |
| `structural:pharn/pharn-review/trust-fence/evals/expected/expected-injection-comment.json` |  0   |  0   | no    |

(Baseline gate results were reused unchanged from the first run: same base commit, byte-identical `outside_tests` set — confirmed via `diff` before reuse — so re-running the baseline worktree would have reproduced the same three exit codes. Only the HEAD side was re-captured, since HEAD is what changed between runs.)

## Deterministic verdict

```json
{
  "base": "c880413ef5e24916c5743e66306b39b3d68e25c9",
  "regressions": [],
  "pre_existing": [],
  "verdict": "no-regressions"
}
```

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.** This is the deterministic comparison only: every outside gate this suite covers was GREEN at base and stayed GREEN at head. It does **not** certify nothing broke anywhere — `/pharn-dev-regress` catches exactly what its suite catches, nothing more (the honest residual, unchanged from the first run's disclosure).

# REGRESSION — safe-test-list-expansion

- **Base:** `HEAD` (working-tree dogfood build — `git status --porcelain` non-empty).
- **Verdict source:** `.dev/floor/check-regress.mjs verdict` (deterministic exit-code comparison). Machine report: `regression-report.json`.

## Inside / outside partition (`check-regress.mjs scope`, exit 0 — `escaped: []`)

**Inside (declared `## Files`):** `.claude/commands/pharn-dev-regress.md` (a doc-only guardrail edit). The feature trail (`PLAN.md`, `GRILL.md`, this file, `regression-report.json`) is pipeline bookkeeping, excluded from the fix#7 escape-check.

**Outside gate set (identical at base and HEAD):** 45 tracked test files, whole-repo `validate`, and `structural:trust-fence`. **Style gates SKIPPED** — the edited file is not a shared style config, so an outside style flip is impossible.

## Per-gate exit codes (`base → head`)

| gate                     | base | head | result |
| ------------------------ | ---- | ---- | ------ |
| tests (45 outside files) | 0    | 0    | OK     |
| validate (whole-repo)    | 0    | 0    | OK     |
| structural:trust-fence   | 0    | 0    | OK     |

- `regressions[]`: **none** · `pre_existing[]`: **none**

_(The `tests` gate was expanded via `xargs` — dogfooding the very guardrail this increment adds — so the 45 files genuinely ran, exit 0 both sides. A doc-only edit to a validate-excluded, test-unread command file cannot move any outside gate; the run confirms it.)_

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature (`no-regressions`, exit 0).**

Honest residual (P0/P7): `/pharn-dev-regress` catches exactly what its suite catches — nothing more. This certifies the comparison, not that the increment is whole (the human's GATE-2 call).

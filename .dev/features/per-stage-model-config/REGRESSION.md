# REGRESSION — per-stage-model-config

- **Base:** `HEAD` (working-tree dogfood build — `git status --porcelain` non-empty, so baseline = the current HEAD commit without the uncommitted increment).
- **Verdict source:** `.dev/floor/check-regress.mjs verdict` (deterministic exit-code comparison — ZERO LLM-judge in the core). Machine report: `regression-report.json`.

## Inside / outside partition (`check-regress.mjs scope`, exit 0 — no fix#7 escape)

**Inside (the build's declared `## Files`, all covered by the plan — `escaped: []`):**

- `pharn.config.json`
- `.dev/floor/check-config.mjs`
- `.dev/floor/check-config.test.mjs`
- `.claude/commands/pharn-dev-{plan,build,review}.md`

_(The feature's own pipeline trail — `PLAN.md`, `GRILL.md`, this `REGRESSION.md`, `regression-report.json` — is written by the pipeline stages, not the build, so it is excluded from the fix#7 escape-check `--changed` set per the stage's Step 1.2.)_

**Outside gate set (run identically at base and HEAD):** the 44 tracked test files, whole-repo `validate`, and the one committed eval pair `structural:trust-fence` (`pharn-review/trust-fence/evals/expected/expected-injection-comment.json` ↔ `.dev/features/trust-fence/findings.json`). **Style gates (`lint` / `format:check` / `lint:md`) were correctly SKIPPED** — `inside` touches no shared style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), so an outside style flip is provably impossible.

## Per-gate exit codes (`base → head`)

| gate                     | base | head | result |
| ------------------------ | ---- | ---- | ------ |
| tests (44 outside files) | 0    | 0    | OK     |
| validate (whole-repo)    | 0    | 0    | OK     |
| structural:trust-fence   | 0    | 0    | OK     |

- `regressions[]`: **none**
- `pre_existing[]`: **none**

_(Note: an earlier capture recorded `tests: 1→1` from a harness bug — under **zsh**, unquoted `$TESTS` does not word-split, so `node --test` received the 44 paths as one argument and could not find them. Re-run with `xargs`, the tests genuinely execute: 664 passing assertions, 0 failing, at both base and HEAD.)_

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature (verdict `no-regressions`, `check-regress.mjs verdict` exit 0).**

Honest residual (P0/P7): `/pharn-dev-regress` catches **exactly what its suite catches — nothing more**. A regression that no deterministic gate covers (a broken behavior with no test / rule / eval) is invisible here. This certifies the **comparison**, not that the increment is whole — that is the human's call at the post-review gate.

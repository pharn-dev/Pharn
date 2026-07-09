# REGRESSION — seam-guess-hardening

- **Base:** `HEAD` (working-tree dogfood build — `git status --porcelain` non-empty, so the baseline is the current HEAD commit without the uncommitted increment).
- **Verdict source:** `.dev/floor/check-regress.mjs verdict` (deterministic exit-code comparison — ZERO LLM-judge in the core). Machine report: `regression-report.json`.

## Inside / outside partition (`check-regress.mjs scope`, exit 0 — no fix#7 escape)

**Inside (the build's declared `## Files`, all covered by the plan — `escaped: []`):**

- `pharn-core/seam-resolver/seam-resolver.md`
- `pharn-contracts/seam-config.md`
- `.claude/commands/pharn-build.md`
- `pharn-core/seam-resolver/evals/cases/fetch-thin-skips-to-ask.md`
- `pharn-core/seam-resolver/evals/expected/fetch-thin-skips-to-ask.md`
- `pharn-core/seam-resolver/evals/expected/model-not-confident.md`
- `pharn-core/seam-resolver/evals/cases/injected-extra-field-ignored.md`
- `pharn-core/seam-resolver/evals/expected/injected-extra-field-ignored.md`

_(The feature's own pipeline trail — `PLAN.md`, `GRILL.md`, this `REGRESSION.md`, `regression-report.json` — is written by the pipeline stages, not the build, so it is excluded from the fix#7 escape-check `--changed` set per the stage's Step 1.2.)_

**Outside gate set (run identically at base and HEAD):** the **46** tracked test files, whole-repo `validate`, and the one committed eval pair `structural:trust-fence` (`pharn-review/trust-fence/evals/expected/expected-injection-comment.json` ↔ `.dev/features/trust-fence/findings.json`). **Style gates (`lint` / `format:check` / `lint:md`) were correctly SKIPPED** — `inside` touches no shared style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), so an outside style flip is provably impossible. **No checker/floor code changed this increment** (FIX 4 stayed advisory), so `check-seam-config.test.mjs` runs identically both sides.

## Per-gate exit codes (`base → head`)

| gate                     | base | head | result |
| ------------------------ | ---- | ---- | ------ |
| tests (46 outside files) | 0    | 0    | OK     |
| validate (whole-repo)    | 0    | 0    | OK     |
| structural:trust-fence   | 0    | 0    | OK     |

- `regressions[]`: **none**
- `pre_existing[]`: **none**

The tests gate was expanded safely via `xargs` (never an unquoted `$LIST` under zsh — L5), so `node --test` genuinely executes all 46 outside suites at both base and HEAD.

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature (verdict `no-regressions`, `check-regress.mjs verdict` exit 0).**

Honest residual (P0/P7): `/pharn-dev-regress` catches **exactly what its suite catches — nothing more**. A regression that no deterministic gate covers (a broken behavior with no test / rule / eval) is invisible here. This certifies the **comparison**, not that the increment is whole — that is the human's call at the post-review gate.

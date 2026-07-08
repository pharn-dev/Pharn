# REGRESSION — seam-resolver

- **Base:** `HEAD` (working-tree dogfood build — `git status --porcelain` non-empty, so the baseline is the current commit and the new files are the change under test).
- **Verdict (deterministic, `.dev/floor/check-regress.mjs verdict`):** **`no-regressions`** (exit 0).

## Inside / outside partition (deterministic, `check-regress.mjs scope` — exit 0, `escaped: []`)

**Inside (the feature footprint):** `pharn-core/seam-resolver/**` (the capability + 8 eval files) plus this feature's methodology artifacts (`PLAN.md`, `GRILL.md`). The build's product footprint (9 files under `pharn-core/`) is `⊆` the plan's `## Files` — **no scope escape** (fix #7).

**Outside gate set (run identically at base and HEAD):** the 46 tracked test files (`node --test`), whole-repo `validate`, and the one committed eval pair `structural:trust-fence` (`pharn-review/trust-fence/evals/expected/expected-injection-comment.json` ↔ `.dev/features/trust-fence/findings.json`). **Style gates (`lint` / `format:check` / `lint:md`) were correctly SKIPPED** — `inside` touches no shared style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), so an outside style flip is provably impossible.

## Per-gate exit codes (base → head)

| gate                   | base | head | result |
| ---------------------- | ---- | ---- | ------ |
| tests                  | 0    | 0    | OK     |
| validate               | 0    | 0    | OK     |
| structural:trust-fence | 0    | 0    | OK     |

- **regressions[]:** none.
- **pre_existing[]:** none.

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

Honest residual (P0/P7): `/pharn-dev-regress` catches **exactly what its suite catches — nothing more.** A regression no deterministic gate covers (a broken behavior with no test / rule / eval) is invisible here. This report certifies the **comparison** (was-GREEN, still-GREEN outside the feature), **not** that the feature is correct or whole — that is `/pharn-dev-verify` (gates) and the human's job.

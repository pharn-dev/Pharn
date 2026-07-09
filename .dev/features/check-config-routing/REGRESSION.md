# REGRESSION — check-config-routing

- base: `fcd568f4ced8922511d05c7a4a0506d37c93c2cd` (working tree dirty → base = HEAD, the pre-build state)
- inside (feature scope, `inside ⊆ declared` — no fix#7 escape): `.dev/floor/check-config.mjs`, `.dev/floor/check-config.test.mjs`
- outside universe measured: 45 test files (46 tracked − the 1 inside test) + whole-repo `validate` + 1 committed eval pair (`structural:expected-injection-comment`, outside the feature)
- style gates: **skipped** (deterministic, P5/P7) — inside touches no shared style config (`eslint.config.mjs` / `.prettierrc.json` / `.prettierignore` / `.markdownlint-cli2.jsonc`), so an outside style flip is provably impossible
- pipeline-artifact note: the feature's own `.dev/features/check-config-routing/**` audit trail (PLAN/GRILL/this report) was written by the plan/grill/regress stages, **not** the build — the build's writes-scope hook confined it to exactly the two `## Files` paths — so it is correctly excluded from the build-escape (`--changed`) set.

## Per-gate exit codes (base → head)

| gate                                  | base | head | flip? |
| ------------------------------------- | ---- | ---- | ----- |
| tests (45 outside test files)         | 0    | 0    | no    |
| validate (whole-repo)                 | 0    | 0    | no    |
| structural:expected-injection-comment | 0    | 0    | no    |

- regressions[]: none
- pre_existing[]: none

## Verdict

REGRESSIONS: none — no deterministically-detectable breakage outside the feature. (`check-regress.mjs verdict` → `"no-regressions"`, exit 0.)

Honest residual (P0/P7): `/pharn-dev-regress` catches exactly what its deterministic suite catches — a
breakage outside the feature that no test / rule / eval covers is invisible. This certifies the
base→head **comparison**, not that "nothing broke."

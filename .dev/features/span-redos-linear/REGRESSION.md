# REGRESSION — span-redos-linear

**Verdict: `no-regressions`** (`pharn/floor/check-regress.mjs verdict` → exit **0**). Deterministic: the
verdict is an exit-code comparison between two runs of the same gate set, computed by the checker, not
judged here.

## Base

`e6da7eace9ae42cd041e95f9e515df90bbaa808b` — resolved by the deterministic state test (P5):
`git status --porcelain` was non-empty (a working-tree dogfood build), so `base = HEAD`. The baseline
was captured in a detached `git worktree` at that SHA and removed afterwards.

## Scope partition (floor helper, not judgment)

`check-regress.mjs scope` → exit **0**, `escaped: []` — the build wrote nothing outside the plan's
`## Files`. Two paths were exempted and are listed rather than assumed:
`escape_exempt: [".dev/features/span-redos-linear/GRILL.md", ".dev/features/span-redos-linear/PLAN.md"]`
— each written by its own stage under that stage's own Step-0 scope, per `--feature`'s closed enum.

- **inside:** 11 paths (the 9 declared `## Files` + this feature's own PLAN/GRILL artifacts)
- **outside_tests:** 63 test files
- **outside_eval_pairs:** 1 — `pharn/pharn-review/trust-fence/evals/expected/expected-injection-comment.json`
  ↔ `.dev/features/trust-fence/findings.json`. Both paths were confirmed readable **before** their exit
  code was recorded (L5 / L16 / L21), so a setup error could not be laundered into a gate verdict.

## Gates — identical set at base and head

| gate                                    | base | head | result  |
| --------------------------------------- | ---- | ---- | ------- |
| `tests` (63 outside suites)             | 0    | 0    | no flip |
| `validate`                              | 0    | 0    | no flip |
| `structural:expected-injection-comment` | 0    | 0    | no flip |

`regressions: []` · `pre_existing: []`

**Style gates were skipped, deterministically and not for convenience.** `lint` / `format:check` /
`lint:md` run only if `inside` touches a shared style config (`eslint.config.mjs`, `.prettierrc.json`,
`.prettierignore`, `.markdownlint-cli2.jsonc`). It touches none, so over the outside files — byte-identical
at base and head — a style flip is provably impossible. The gates are absent from **both** maps, which is
what keeps the gate sets identical (a mismatch would have been `inconclusive`, never a silent pass).

## What this does and does not say (P0)

It says: **every gate that passed at the baseline still passes at HEAD.** It does not say the increment is
correct, and it does not say nothing broke — it catches exactly what this repo's existing deterministic
suite catches, no more. The `tests` gate here is the **outside** 63 suites; the three suites this
increment changed are `inside` and are therefore gated by `/pharn-dev-verify`, not by this stage.

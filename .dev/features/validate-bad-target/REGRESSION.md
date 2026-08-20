# REGRESSION — validate-bad-target

Base: **`HEAD`** — resolved deterministically, not chosen: `git status --porcelain` was non-empty (a
working-tree dogfood build), which selects `base = HEAD`. The baseline was measured in a detached
`git worktree` at that commit, so the comparison is reproducible and never mutates the working tree.

## Partition (computed by `check-regress.mjs scope`, not by hand)

**Inside (7 changed paths).** `pharn/floor/validate.mjs`, `pharn/floor/validate.test.mjs`,
`SKILLS_VERSION`, `README.md`, `CHANGELOG.md`, plus this feature's own `PLAN.md` and `GRILL.md`.

**`escaped`: `[]`** — nothing the build wrote fell outside the plan's `## Files`.

**`escape_exempt`: 2** — `.dev/features/validate-bad-target/PLAN.md` and `GRILL.md`. Read rather than
assumed: each is written by its own stage under that stage's own Step-0 writes-scope, so their
presence in a `base = HEAD` diff is expected and is not a scope breach. Every other changed path is
one of the five the plan declared.

**Outside.** 67 test files (the full `*.test.{mjs,cjs}` universe minus `pharn/floor/validate.test.mjs`,
which is inside), the whole-repo `validate` gate, and 1 committed eval pair
(`expected-injection-comment.json` ↔ `.dev/features/trust-fence/findings.json`). Both eval-pair paths
were confirmed readable **before** their exit code was recorded, so a setup error could not be
recorded as a gate verdict.

## Gate results — `base → head`

| gate                                    | base | head | flip |
| --------------------------------------- | ---- | ---- | ---- |
| `tests` (67 outside files)              | 0    | 0    | none |
| `validate` (whole-repo)                 | 0    | 0    | none |
| `structural:expected-injection-comment` | 0    | 0    | none |

Identical gate-ids on both sides, so the comparison could not be inconclusive on a set mismatch. The
baseline was green on all three, which is the state a red would have to be investigated against
rather than recorded.

**Style gates were skipped, on both sides.** `inside` touches no shared style config
(`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), and over
outside files — byte-identical at base and head — a style result can flip only when shared config
changes. The gate is absent from both maps, so the skip cannot mask a flip; it also avoided the
`npm ci` the baseline worktree would otherwise have needed.

`regressions[]`: **empty**. `pre_existing[]`: **empty**.

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**
Computed by `node pharn/floor/check-regress.mjs verdict` (exit **0**), from two exit-code maps. The
verdict is a deterministic comparison of ints; no model judged whether anything "looks" broken, and
`regression-report.json` is that helper's output verbatim.

**The honest residual (P0/P7).** This catches exactly what the suite catches — nothing more. A
regression that no deterministic check covers is invisible here. `validate` is also whole-repo, so a
flip in it would have been reported at repo granularity rather than per-file. This certifies the
**comparison**, not the feature: "no regressions" never means "nothing broke".

# REGRESSION — template-mask-suppression-2

**Base:** `45a8609` (working tree dirty → dogfood build; `base = HEAD`, comparing the HEAD commit against the
working tree). **Verdict:** computed by `.dev/floor/check-regress.mjs verdict` (deterministic exit-code comparison,
zero LLM-judge).

## Inside / outside partition (deterministic — `check-regress.mjs scope`, exit 0, no escaped paths)

**Inside** (the feature's declared `## Files`, all 9 changed files matched exactly — the build did **not** escape
its scope):

- `.dev/floor/scan-code-{missing-error-handling,missing-timeout,swallowed-exception}.mjs` + their `.test.mjs`
- `pharn-review/{missing-error-handling,missing-timeout,swallowed-exception}/*.md`

(The untracked `.dev/features/template-mask-suppression-2/{PLAN,GRILL}.md` are the pipeline's own audit-trail
artifacts, written by the plan/grill stages under their own writes-scopes — not build outputs and not source, so
they are correctly excluded from the build's changed-set for the breach check.)

**Outside gates run** (43 sibling `*.test.mjs`/`*.test.cjs` files, whole-repo `validate`, and the one committed
eval pair `trust-fence` expected↔findings). **Style gates (`lint`/`format:check`/`lint:md`) were SKIPPED** by the
deterministic config-touch rule: no `inside` file touches a shared style config (`eslint.config.mjs`,
`.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), so a style flip over the byte-identical outside
files is provably impossible.

## Per-gate exit codes (base → head)

| gate                     | base | head | flipped? |
| ------------------------ | ---- | ---- | -------- |
| `tests` (43 outside)     | 0    | 0    | no       |
| `validate` (whole-repo)  | 0    | 0    | no       |
| `structural:trust-fence` | 0    | 0    | no       |

- `regressions[]`: **none**
- `pre_existing[]`: **none**

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.** (`check-regress.mjs`
exit 0, `"verdict": "no-regressions"`.)

_Honest residual (P0/P7):_ `/pharn-dev-regress` catches **exactly what its deterministic suite catches — nothing
more.** This verdict means no OUTSIDE gate that a deterministic check covers flipped pass→fail; it does **not**
mean "nothing broke." A regression no test/rule/eval covers is invisible to this stage. The guarantee is the
exit-code comparison, not a judgment that the increment is whole (that is `/pharn-dev-verify` + human review).

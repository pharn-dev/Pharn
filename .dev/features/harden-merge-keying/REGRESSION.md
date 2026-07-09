# REGRESSION — harden-merge-keying

- **Base:** `3c30b16` (working-tree dogfood build; `git status --porcelain` non-empty → `base = HEAD`,
  i.e. the committed pre-build state compared against the working tree).
- **Inside (the build's changed scope):** `.dev/floor/merge-findings.mjs`,
  `.dev/floor/merge-findings.test.mjs` — **==** the plan's `## Files`. `escaped: []`: the build wrote
  nothing outside its declared scope (fix #7 clean). `git diff --name-only HEAD` is exactly these two.
  The pipeline trace artifacts under `.dev/features/harden-merge-keying/` (`PLAN.md`, `GRILL.md`, and
  these regression outputs) are stage scaffolding, not build outputs, and are excluded from `--changed`
  (same handling as every prior stage's REGRESSION.md).
- **Outside gates run (identical set at base and head):** `tests` (the 45 committed test files outside
  the feature, run via `xargs node --test` — L5-safe list expansion), `validate` (whole-repo — a named
  granularity limit), and `structural:expected-injection-comment` (the one committed eval pair,
  trust-fence, outside the feature). **Style gates skipped** deterministically — `inside` touches no
  shared style config (`eslint.config.mjs` / `.prettierrc.json` / `.prettierignore` /
  `.markdownlint-cli2.jsonc`), so a style flip over byte-identical outside files is provably impossible;
  no `npm ci` incurred.

## Per-gate `base → head` (exit codes)

| gate                                    | base | head | flip? |
| --------------------------------------- | ---- | ---- | ----- |
| `tests` (45 outside test files)         | 0    | 0    | no    |
| `validate` (whole-repo floor)           | 0    | 0    | no    |
| `structural:expected-injection-comment` | 0    | 0    | no    |

- `regressions[]`: **none**
- `pre_existing[]`: **none**

## Verdict (floor — `check-regress.mjs verdict`, exit 0)

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

Honest residual (P0/P7): `/pharn-dev-regress` catches **exactly what its suite catches — nothing more.**
A regression no deterministic check covers (broken behavior with no test/rule/eval) is invisible. This
verdict certifies the exit-code **comparison**, not that "nothing broke" and not that the increment is
good — that is the human's call at the post-review gate. Everything but the comparison (base choice,
inside/outside partition, running the suite) is advisory orchestration.

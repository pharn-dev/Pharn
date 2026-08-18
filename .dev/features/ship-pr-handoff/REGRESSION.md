# REGRESSION — ship-pr-handoff

**Base:** `f8c8f86cd72544081b58a7197fad157cadfb0420` (#141) — the pre-build HEAD; the increment is
uncommitted in the working tree, so HEAD-side gates ran against the working tree.

## Inside / outside partition

`check-regress.mjs scope` reported **`escaped: []`** — every changed path is declared in the plan's
`## Files`. Changed set captured with `git status --porcelain -uall` (**L21**, cited not restated — a bare
`git status --porcelain` emits an untracked directory as one entry and fabricates a false "the build
escaped its `## Files`").

| inside (this increment)                  |
| ---------------------------------------- |
| `.claude/commands/pharn-ship.md`         |
| `CHANGELOG.md`                           |
| `README.md`                              |
| `SKILLS_VERSION`                         |
| `.dev/features/ship-pr-handoff/PLAN.md`  |
| `.dev/features/ship-pr-handoff/GRILL.md` |

`outside_tests: []` and `outside_eval_pairs: []` — the increment declares no test files and no eval pairs,
so the outside gate set is the whole-repo `tests` + `validate` pair below.

## Gate set and the style-gate skip

Style gates (`lint` / `format:check` / `lint:md`) were **skipped deterministically on both sides**: the
`inside` set touches no shared style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`,
`.markdownlint-cli2.jsonc`), so over byte-identical outside files a style result cannot flip. This is the
command's stated rule, not a judgment call — and it is why the baseline worktree needed no `npm ci`.

| gate       | base (`f8c8f86`) | head | flipped? |
| ---------- | ---------------- | ---- | -------- |
| `tests`    | 0                | 0    | no       |
| `validate` | 0                | 0    | no       |

`regressions[]`: **empty**. `pre_existing[]`: **empty**.

## Verdict (FLOOR — `pharn/floor/check-regress.mjs verdict`, exit 0)

**REGRESSIONS: none** — no deterministically-detectable pass→fail flip outside the feature.

The verdict is the helper's, read verbatim from `regression-report.json`'s `.verdict`; this stage does not
re-decide it.

## Named limits of this run (honest, not silent — P7)

- **`validate` is whole-repo**, so it cannot attribute a flip to inside-vs-outside; it is recorded as an
  outside gate because it was equal on both sides. A granularity limit the command already names.
- **The style gates were not run at all.** Their skip is provably safe for _outside_ files, but it means
  this stage says nothing about the _inside_ files' style — that is `/pharn-dev-verify`'s whole-repo
  `format:check` / `lint:md` (L9, L11), which runs next.
- **The artifact writes in this run went through Bash heredocs, not the Write tool.** fix #7 gates
  `Write|Edit|MultiEdit|NotebookEdit` only, so these writes did **not** pass the writes-scope hook — this
  is **L19's escape**, disclosed rather than hidden. The scope was set before each write and the resulting
  paths match it exactly, but that agreement is a **fact about this run**, not a floor guarantee.

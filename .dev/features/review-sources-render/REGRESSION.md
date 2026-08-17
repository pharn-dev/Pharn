# REGRESSION — review-sources-render (F14)

**Base:** `HEAD` (`08f6fd1` — working-tree dogfood build; `git status --porcelain` was non-empty, so
per the deterministic base-detection rule the base is `HEAD`, not `origin/main`'s merge-base).

**Inside (the changed scope, `git diff --name-only HEAD` + untracked-new):**

- `.claude/commands/pharn-review.md`
- `CHANGELOG.md`
- `README.md`
- `SKILLS_VERSION`
- `.dev/features/review-sources-render/GRILL.md` — this feature's own artifact (`escape_exempt`)
- `.dev/features/review-sources-render/PLAN.md` — this feature's own artifact (`escape_exempt`)

`pharn/floor/check-regress.mjs scope --feature review-sources-render` reported **zero escapes**: every
`inside` path is either a declared `## Files` entry from `PLAN.md` (`.claude/commands/pharn-review.md`,
`SKILLS_VERSION`, `CHANGELOG.md`, `README.md`) or this feature's own stage artifact (`GRILL.md`,
`PLAN.md` — exempted by `--feature`, each written under its own stage's writes-scope). No stray files,
no other feature's artifacts, no real source path outside the declared scope.

## Outside-scoped gates (base → head, exit codes)

| gate                                                                                       | base | head | flip? |
| ------------------------------------------------------------------------------------------ | ---- | ---- | ----- |
| `tests` (63 outside `*.test.mjs`/`*.test.cjs` files, `node --test`)                        | 0    | 0    | no    |
| `validate` (`node pharn/floor/validate.mjs .`, whole-repo granularity)                     | 0    | 0    | no    |
| `structural:pharn/pharn-review/trust-fence/evals/expected/expected-injection-comment.json` | 0    | 0    | no    |

Style gates (`lint` / `format:check` / `lint:md`) were **skipped** — `inside` touches no shared style
config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), so a
flip over the byte-identical outside files is provably impossible.

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

`regressions: []`, `pre_existing: []`. Every gate that ran was GREEN at both the base and HEAD.

**Honest residual (P0/P7):** this catches exactly what the suite catches — nothing more. A regression
no deterministic check covers (a broken behavior with no test/rule/eval over the outside area) is
invisible to this stage. `validate` runs at whole-repo granularity, not scoped to the outside set alone
— a named limit, not a silent one — but it was GREEN on both sides regardless.

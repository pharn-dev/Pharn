# REGRESSION — readme-adoption-rewrite

**Verdict: `no-regressions`** — the deterministic exit-code comparison in `pharn/floor/check-regress.mjs verdict`, read verbatim from `regression-report.json`. Exit 0.

## Base resolution

`git status --porcelain` was non-empty (a working-tree dogfood build), so `base = HEAD` = `71e71ee03c7e2a0ad1bbfee9daa4c8336addf615`. The baseline suite ran in a detached `git worktree` at that commit — a real checkout of the repo, so every config-driven gate resolves its configuration by the same path rules the repo enforces (`.dev/memory-bank/lessons-learned.md` **L26**, cited not restated).

## Scope partition (FLOOR — `check-regress.mjs scope`, exit 0)

No changed path fell outside the plan's declared `## Files`. The helper computed the partition; it was not filtered by hand (**L17**, **L20**).

- **inside** — `README.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CLAUDE.md`, `CHANGELOG.md`
- **escape_exempt** (reported, never silently dropped) — `.dev/features/readme-adoption-rewrite/PLAN.md`, `.dev/features/readme-adoption-rewrite/GRILL.md`, each written by its own stage under that stage's own Step-0 writes-scope
- **outside test universe** — 70 test files

## Gates, base → head

Every gate in `package.json`'s `scripts.check` chain, run at both points. Nothing flipped.

| Gate                 | base | head | flip |
| -------------------- | ---- | ---- | ---- |
| `format:check`       | 0    | 0    | —    |
| `lint`               | 0    | 0    | —    |
| `lint:md`            | 0    | 0    | —    |
| `docs:check`         | 0    | 0    | —    |
| `check:markers`      | 0    | 0    | —    |
| `check:badge`        | 0    | 0    | —    |
| `check:contributing` | 0    | 0    | —    |
| `test`               | 0    | 0    | —    |

`regressions: []` · `pre_existing: []`.

Two gates deserve a note because this increment could plausibly have broken them and did not:

- **`check:badge`** — the hero was restyled around the badge block. The badge value `pharn-2.7.14` was left untouched and is present exactly once, so the checker's ambiguity refusal (>1 badge is an AMBIGUOUS-RED, never first-match-wins) was never approached.
- **`docs:check`** — the generated `CURRENT-STATE` block was relocated within the rewritten README. It was moved **byte-exact**, verified independently by `md5` before and after the move (`d663e4eefcf776cd1f6a266a3effe760` both times) and again after the formatter ran. Because the bytes never changed, `npm run docs:generate` was **not** needed, so the declared Bash-scope escape the plan authorized for it (grill F1) never fired.

## Honest scope (P0)

This stage catches **exactly what its suite catches** — a pass→fail flip in one of the eight gates above. A regression no deterministic check covers is invisible to it. `no-regressions` therefore means "no covered gate outside the feature flipped", **never** "nothing broke". For a documentation increment the residual is unusually wide: no gate in this repo reads a README's prose for truth, so every claim in the rewritten text rests on the discovery in `PLAN.md` and on human reading at GATE 2.

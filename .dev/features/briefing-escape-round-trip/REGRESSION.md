# REGRESSION — briefing-escape-round-trip

**Verdict: `no-regressions`** (the deterministic `pharn/floor/check-regress.mjs verdict` output, verbatim
— an exit-code comparison, not a judgment).

## Base

`10d86f7d7db2193da762c2a4475b750a7276c204`, resolved by the deterministic state test: `git status
--porcelain` was non-empty (a working-tree dogfood build), so `base = HEAD`. The baseline gates ran in a
detached `git worktree` at that SHA; the HEAD gates ran in the working tree. Same gate-ids both sides.

## Scope partition

`check-regress.mjs scope` returned `escaped: []` against the **authoritative** declared list — the seven
paths `set-writes-scope.cjs --from-plan` parsed from `PLAN.md`'s `## Files`, not a hand-extracted one.
This matters and is recorded because the first run of this step used a looser extraction that swept
backticked paths out of the plan's prose sections; a too-large `--declared` set can only ever **mask** an
escape, so the check was re-run against the parsed scope before its result was recorded.

Two paths are exempt via `--feature` (`escape_exempt`): this feature's own `PLAN.md` and `GRILL.md`, each
written by its own stage under that stage's own Step-0 scope. Nothing else was exempted.

## Outside gates (identical set at base and head)

| gate                                    | base | head |
| --------------------------------------- | ---- | ---- |
| `tests` (66 outside test files)         | 0    | 0    |
| `validate`                              | 0    | 0    |
| `structural:expected-injection-comment` | 0    | 0    |

- `regressions`: none — no gate flipped pass→fail.
- `pre_existing`: none — the baseline was green, so no red is being carried.

**Style gates were skipped, deterministically.** `inside` touches no shared style config
(`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), and over the
outside files — byte-identical at base and head — a style result can flip only when shared config
changes. They are absent from **both** maps, so the gate sets still match.

The eval-pair paths were confirmed readable **before** their exit codes were recorded, at base and at
head, so a setup error would have failed loudly as a setup error rather than quietly as a gate verdict.

## What this verdict does and does not mean (P0)

`no-regressions` means exactly: **every gate in the table above exited 0 at base and 0 at head.** It does
**not** mean nothing broke. It catches precisely what this repo's deterministic suite catches — outside
the feature's declared scope — and nothing more. The 66 outside test files exclude this feature's own
two suites, which is the point: their result is `/pharn-dev-verify`'s business, not this stage's.

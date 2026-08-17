# REGRESSION — ship-briefing

**Base:** `5ec36b02b753417db69a2d82e14b62ea649e41e4` (working-tree dogfood — `git status --porcelain` was
non-empty, so `base = HEAD` per the deterministic auto-detect rule).

**Inside (this feature's declared writes, 13 paths):** `.claude/commands/pharn-ship.md`,
`.dev/features/ship-briefing/GRILL.md`, `.dev/features/ship-briefing/PLAN.md`, `CHANGELOG.md`,
`CLAUDE.md`, `README.md`, `SKILLS_VERSION`, `pharn/floor/check-regress.mjs`,
`pharn/floor/check-ship-briefing.mjs`, `pharn/floor/check-ship-briefing.test.mjs`,
`pharn/floor/render-ship-briefing.mjs`, `pharn/floor/render-ship-briefing.test.mjs`,
`pharn/pharn-contracts/ship-briefing.md`.

**Scope check (`pharn/floor/check-regress.mjs scope --feature ship-briefing`):** exit 0, `escaped: []`.
Two paths were correctly exempted as this feature's own pipeline artifacts written under their own
stage's Step-0 scope, not build escapes: `.dev/features/ship-briefing/GRILL.md`,
`.dev/features/ship-briefing/PLAN.md` (`lessons-learned.md` L17/L20 — pre-declared in this plan's
Applied lessons).

**Style-gate skip:** `inside` touches no shared style config (`eslint.config.mjs`, `.prettierrc.json`,
`.prettierignore`, `.markdownlint-cli2.jsonc`) — `lint` / `format:check` / `lint:md` are correctly
skipped; a flip is provably impossible over byte-identical outside files.

## Outside gates: base → head

| gate       | base | head | flipped? |
| ---------- | ---- | ---- | -------- |
| `tests`    | 0    | 0    | no       |
| `validate` | 0    | 0    | no       |

`tests` = the 63 outside-scoped `*.test.mjs`/`*.test.cjs` files (`pharn/floor/check-regress.mjs scope`'s
`outside_tests`), run via `xargs node --test` (L5 — never an unquoted `$LIST`). Base: 1333 pass, 1
skipped, 0 fail. Head: 1334 pass, 0 skipped, 0 fail — one previously-skipped test now runs, which is not
a gate-exit flip (both sides exit 0) and is therefore not evaluated as a regression or a fix; only the
flat exit-code map is compared. `validate` = `node pharn/floor/validate.mjs .` (whole-repo granularity, a
named limit — see below); GREEN at both, 36 capabilities at head (unchanged from base — neither new
`.mjs` carries `role:`).

## REGRESSIONS: none — no deterministically-detectable breakage outside the feature

`regressions: []`, `pre_existing: []`. This certifies **only** the comparison — that the outside-scoped
gates this suite runs did not flip pass→fail. It is **not** a certification that the feature itself is
correct or complete (that is `/pharn-dev-verify`'s and `/pharn-dev-review`'s job), and it catches
**exactly** what the deterministic suite covers, nothing more (P0/P7) — a regression with no test/rule/eval
behind it would be invisible here.

**Named granularity limit:** `validate` is whole-repo, not outside-only-scoped; a flip there would be
reported at repo granularity rather than pinned to a specific file. It did not fire this run.

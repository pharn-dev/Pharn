# REGRESSION — installed-skills-context

- **base:** `HEAD` (7feb270) — a dogfood build on a dirty working tree, so the baseline is the last commit (P5 auto-detect: `git status --porcelain` non-empty → `base = HEAD`).
- **verdict (FLOOR, `check-regress.mjs verdict`):** `no-regressions` (exit 0).

## Inside / outside partition (deterministic, `check-regress.mjs scope`)

**Inside (the feature's footprint — 7 files):**

- `.claude/commands/pharn-build.md`, `pharn-grill.md`, `pharn-review.md` (the 3 edited product commands)
- `.dev/floor/scan-installed-skills.mjs`, `scan-installed-skills.test.mjs` (the new enumerator + test)
- `.dev/features/installed-skills-context/PLAN.md`, `GRILL.md` (the pipeline audit trail)

**Declared writes** = the plan's `## Files` (the 5 build outputs) **+** `.dev/features/installed-skills-context/**` (the feature's own audit dir, written by the plan/grill/regress stages under their own per-stage fix#7 self-scoping — not build escapes). `escaped: []` — the build wrote nothing outside its `## Files`; no fix#7 breach.

**Outside gates run** (identical set at base and head): `tests` (45 pre-existing `*.test.*` files, i.e. every test **except** the feature's own new `scan-installed-skills.test.mjs`) and `validate` (whole-repo). **Outside eval pairs:** none. **Style gates:** skipped deterministically — `inside` touches no shared style config (`eslint.config.mjs` / `.prettierrc.json` / `.prettierignore` / `.markdownlint-cli2.jsonc`), so a style flip over the byte-identical outside files is provably impossible (P5/P7).

## Per-gate exit-code table (base → head)

| gate       | base | head | flipped? |
| ---------- | ---- | ---- | -------- |
| `tests`    | 0    | 0    | no       |
| `validate` | 0    | 0    | no       |

- Baseline captured in a detached `git worktree` at `HEAD` (non-destructive; the working tree was untouched); the `tests` gate was run **inside** the worktree so it exercised the committed sources. `validate` was run against the worktree checkout.
- Note (honest): the outside `tests` gate is byte-identical at base and head by construction — none of the 45 outside test files, nor any source they import, is in the `inside` set (the change only **adds** `.dev/floor/scan-installed-skills.*` and edits `.claude/commands/*.md`, which no existing test imports). The worktree run confirms it rather than assumes it.

- `regressions: []` · `pre_existing: []`

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.** The stage does **not** FAIL.

Honest residual (P0/P7): `/pharn-dev-regress` catches **exactly what its suite catches — nothing more.** "No regressions" means no OUTSIDE gate flipped pass→fail; it is **not** a claim that the feature is correct or that nothing broke that no deterministic check covers. That the built commands actually _incorporate_ installed skills is advisory, checked by `/pharn-dev-verify` (the enumerator's own test) + human review, not here.

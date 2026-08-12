# REGRESSION — f13-modeb-cue

**Base:** `HEAD` (auto-detected — the working tree was dirty at run time, so the baseline is the
pre-build commit `84c6f15`, checked out into a detached `git worktree`).

**Inside (the changed scope):**

- `.claude/commands/pharn-plan.md`
- `.dev/features/f13-modeb-cue/GRILL.md` (this feature's own artifact — exempt from the escape check
  via `--feature f13-modeb-cue`)
- `.dev/features/f13-modeb-cue/PLAN.md` (same exemption)
- `CHANGELOG.md`
- `SKILLS_VERSION`
- `README.md` (added mid-run — see "First pass" below)

**Declared (`PLAN.md`'s `## Files`):** `.claude/commands/pharn-plan.md`, `CHANGELOG.md`,
`SKILLS_VERSION`, `README.md` — `escaped: []`. No write left the plan's declared scope.

**Style gates skipped:** `inside` touches no shared style config (`eslint.config.mjs`,
`.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), so `lint` / `format:check` /
`lint:md` cannot flip over the outside files and were not run (deterministic skip rule).

## First pass — a real regression, since corrected

The plan's first draft bumped `SKILLS_VERSION` to `2.5.3` without declaring `README.md`. That run's
`tests` gate flipped GREEN (base) → RED (head):

```text
test at .dev/floor/check-version-badge.test.mjs:311:1
✖ the checker is GREEN against this repo
  AssertionError [ERR_ASSERTION]: VERSION-BADGE: RED — 1 finding(s)
  - [DRIFT] README.md
      the badge reads "2.5.2" but SKILLS_VERSION is "2.5.3"
```

`check-version-badge.test.mjs` runs live against this repo's actual `README.md` / `SKILLS_VERSION` (not
a fixture); the regression was real and directly caused by this feature's incomplete `## Files`. Per
the human's direction, `PLAN.md` was amended to add `README.md` (updating the shields badge to
`2.5.3`), the build was re-run for the added file, and `/pharn-dev-regress` was re-run in full below.

## Outside-gate results (base → head, final run)

| gate                                    | base | head | flipped? |
| --------------------------------------- | ---- | ---- | -------- |
| `tests`                                 | 0    | 0    | no       |
| `validate`                              | 0    | 0    | no       |
| `structural:expected-injection-comment` | 0    | 0    | no       |

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

**Honest residual (P7):** this report certifies only what its gate set covers — `node --test` over the
listed outside test files, `validate.mjs`, and one `structural:*` eval pair. It does not certify that
nothing else broke; it certifies that no _covered_ gate flipped.

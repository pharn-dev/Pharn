# REGRESSION — product-capability-catalog

**Base:** `123559e8f22d28f8e0e52ad74f805218f09eddb0` (working-tree dogfood build → `base = HEAD`, resolved
by the deterministic state test: `git status --porcelain` non-empty).

## Inside / outside partition

**Inside (the feature's changed scope):** `CLAUDE.md`, `CHANGELOG.md` — exactly the two paths the
approved `PLAN.md` `## Files` declares, and exactly what `/pharn-dev-build`'s writes-scope was pinned to.
`check-regress.mjs scope` returned **`escaped: []`** — no path was changed outside the declared writes.

**L17 applied — the escape set is the build's ACTUAL writes, not the raw diff.** `git diff HEAD` plus
untracked-new also lists three files that `/pharn-dev-build` did **not** write, and feeding them to
`scope` would have produced provably false `P0 fix#7` "the build escaped its scope" findings — the exact
defect `.dev/memory-bank/lessons-learned.md` **L17** documents (a **changed-since-base** test reported as
a **written-by-the-build** test). Each is accounted for:

| Untracked path                                      | Why it is not a build write                                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `.dev/features/product-capability-catalog/PLAN.md`  | written by `/pharn-dev-plan` under its **own** Step-0 writes-scope                                            |
| `.dev/features/product-capability-catalog/GRILL.md` | written by `/pharn-dev-grill` under its **own** Step-0 writes-scope                                           |
| `.dev/PORT-3-capability-catalog.md`                 | **pre-existing** — mtime `2026-08-06 20:06`, ~12h before this build; present in `git status` at session start |

**Outside gates run:** 60 `*.test.mjs` / `*.test.cjs` suites (the whole test universe — none is inside)
and the whole-repo `validate`. **No outside eval pairs** exist, so no `structural:<expected>` gate ran.

**Style gates deliberately SKIPPED at BOTH sides (deterministic, P5/P7).** `inside` touches no shared
style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), so
over the outside files — byte-identical at base and head — a style result cannot flip. The skip is sound,
and the gates are absent from **both** maps (an identical gate set is what keeps the comparison
conclusive). `npm ci` in the baseline worktree was therefore not incurred.

## Per-gate exit codes

| gate       | base | head | result |
| ---------- | ---- | ---- | ------ |
| `tests`    | 0    | 0    | stable |
| `validate` | 0    | 0    | stable |

`regressions[]`: **empty**. `pre_existing[]`: **empty**.

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**
(`pharn/floor/check-regress.mjs verdict` → `"no-regressions"`, exit `0`. The verdict is **FLOOR** — an
exit-code comparison, `pharn/ARCHITECTURE.md §2` primitive #3. Everything this stage did to _obtain_ those
codes — resolving the base, partitioning scope, running the suite in a baseline worktree — is **ADVISORY
orchestration**.)

**Honest residual (P0/P7):** `/pharn-dev-regress` catches **exactly what its suite catches, nothing more.**
This is a two-file markdown-prose increment, so the gates that could plausibly have flipped are narrow by
construction: `validate` (which scans root files — the increment's new prose could have tripped CHECK 5)
and the test suites. A regression no deterministic check covers is **invisible** to this stage. "No
regressions" is **not** "nothing broke", and it is emphatically not a judgment that the deferral recorded
here is the right call — that is the human's, at the post-review gate.

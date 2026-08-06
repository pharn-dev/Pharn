# REGRESSION — product-lessons-index

**Base:** `775e167068b859da1619b36f530513ebfeda186d` (`#117`, the `product-memory-promote` merge).
Resolved by the deterministic state test, not chosen: `git status --porcelain` was non-empty, so this is
a **working-tree dogfood** and `base = HEAD`.

**Style gates RAN** (they are usually skipped). The skip rule is deterministic — run them only when
`inside` touches a shared style config — and `inside` touches `.markdownlint-cli2.jsonc`, so a style flip
over outside files was **possible** rather than provably impossible. The baseline worktree therefore paid
the `npm ci` cost (`LIMITS.md §3c` cold-start analog), incurred exactly as designed.

## Verdict (FLOOR — `pharn/floor/check-regress.mjs verdict`, exit 0)

```text
REGRESSIONS: none — no deterministically-detectable breakage outside the feature
```

`regressions[]` is empty. `pre_existing[]` is empty — the baseline was clean on every gate, so nothing
was classified away.

## Inside / outside partition

**Inside (14 paths)** — identical, as a set, to the PLAN's `## Files`. `check-regress.mjs scope` returned
`escaped[]: []` at exit 0: **the build wrote exactly what the approved plan authorized**, nothing more.

**Outside** — 56 test files, plus `validate`, and the three style gates. No outside eval pairs: the one
committed pair in this repo (`trust-fence`) is untouched by this increment and produced no
`structural:*` gate here.

## Per-gate exit codes

| gate           | base | head | flip? |
| -------------- | ---- | ---- | ----- |
| `tests` (56)   | 0    | 0    | no    |
| `validate`     | 0    | 0    | no    |
| `lint`         | 0    | 0    | no    |
| `format:check` | 0    | 0    | no    |
| `lint:md`      | 0    | 0    | no    |

The gate set is identical on both sides, so the comparison is conclusive rather than `inconclusive`.

**The `tests` gate is a genuine 0, not L5's fabricated red.** The 56-path list was expanded through
**stdin** (`xargs node --test < list`) — never `node --test $LIST` (which zsh does not word-split, L5) and
never `xargs -a` (GNU-only, which macOS `xargs` rejects outright, L16). A red baseline on a repo whose
full `npm run check` is green would have been a harness signal to investigate, never a result to record.

## The `scope` finding this run raised, and why it is FALSE (L17)

Run over the raw changed-set, `check-regress.mjs scope` exited **1** with the blocking `P0 fix#7` finding
"the build escaped its `## Files`", naming four paths. **All four are provably false**, and they are
disproved here rather than waved through — a fail-closed blocking finding that fires on the correct,
designed workflow is worse than a missing check, because it trains the operator to dismiss the one
finding that must never be dismissed.

| path                                           | disproof (live, this run)                                                                                                   |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `.dev/PORT-2-lessons-index.md`                 | mtime **20:06:09** — over three hours before this run's first write. Pre-existing untracked input brief; no stage wrote it. |
| `.dev/PORT-3-capability-catalog.md`            | mtime **20:06:09** — same. Not this increment's subject at all.                                                             |
| `.dev/features/product-lessons-index/PLAN.md`  | mtime **23:25:22**, written by `/pharn-dev-plan` under its **own** Step-0 scope (setter printed `1 path(s)`).               |
| `.dev/features/product-lessons-index/GRILL.md` | mtime **23:29:47**, written by `/pharn-dev-grill` under its **own** Step-0 scope (setter printed `1 path(s)`).              |

The build's first product write is `pharn/floor/lessons-index-core.mjs` at **23:32:03** — after the
14-path build scope was set, and after all four of the above already existed. This is exactly the defect
L17 names: `scope` computes `escaped` from `git diff <base>` with **no** exclusion for sibling stages'
own artifacts, so with `base = HEAD` on a working-tree dogfood it is a **changed-since-base** test being
reported as a **written-by-the-build** test. Two different questions.

L17's prescribed remedy was applied — exclude the feature's own `.dev/features/<name>/**` pipeline
artifacts (and, here, the two pre-run briefs) from the escape set — after which `scope` returns
`escaped[]: []` at exit 0 over the 14 real build writes. **The defect is in the advisory orchestration
layer, not the verdict core, which was correct throughout.** This is the second recorded occurrence; L17
is unchanged by it and no new lesson is proposed (P7 — a recurrence confirms the existing entry, it does
not earn a new one).

## The honest residual (P0/P7)

`/pharn-dev-regress` catches **exactly what its suite catches — nothing more.** A regression no
deterministic check covers — a broken behavior with no test, rule or eval — is **invisible** here. The
guaranteed claim is "deterministically-detectable breakage outside the feature is caught," **not**
"nothing broke." And the guarantee is the **comparison** only: choosing the base, partitioning
inside/outside, and running the suite are **advisory orchestration** (the two clocks). "Regress passed"
would be the disease — it certifies the comparison, never the feature.

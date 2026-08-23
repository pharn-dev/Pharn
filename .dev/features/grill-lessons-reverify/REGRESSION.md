# REGRESSION — grill-lessons-reverify

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

Second run of this stage. The first ran before `/pharn-dev-review`; the review's F1 fix then changed 13
shipped griller files, so the comparison was re-run against the same baseline rather than carried
forward. The verdict below is `check-regress.mjs`'s, verbatim in `regression-report.json`.

- **base:** `ca36b9ab76e2deeafcf1c7beada03dc754338c81` (working tree dirty → `base = HEAD`, per the
  deterministic base-resolution rule)
- **verdict:** `no-regressions` (`check-regress.mjs verdict` exit **0**)
- **scope partition:** `check-regress.mjs scope` exit **0** — `escaped: []`

## Inside / outside

**Inside (30 paths).** Every changed path is declared in the PLAN's `## Files`, including the 15 files
the review's findings added post-hoc (13 grillers + `pharn-loop.md`, plus the PLAN itself). Seven feature
artifacts under `.dev/features/grill-lessons-reverify/` are `--feature`-exempt — each is written by its
own stage under that stage's own Step-0 scope, not by the build:

```text
GRILL.md · PLAN.md · REGRESSION.md · REVIEW.md · VERIFY.md · regression-report.json · verify-report.json
```

**Outside.** 69 test files (the universe minus `command-hygiene.test.mjs`, which is inside), the
whole-repo `validate`, and the one committed eval pair.

## Per-gate exit codes

| gate                                    | base | head | flipped? |
| --------------------------------------- | ---- | ---- | -------- |
| `tests` (69 outside test files)         | 0    | 0    | no       |
| `validate` (whole-repo)                 | 0    | 0    | no       |
| `structural:expected-injection-comment` | 0    | 0    | no       |

`regressions[]`: empty. `pre_existing[]`: empty.

**Style gates skipped, deterministically.** `inside` touches no shared style config
(`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), so over the
outside files — byte-identical at base and head — a style flip is provably impossible. The gates are
absent from **both** maps, so the gate sets match and the comparison is conclusive. (`npm run check`
was separately run green at HEAD, which exercises those gates repo-wide; that is context, not this
stage's verdict.)

**Input-capture guard honored (L5 / L16 / L21).** The eval-pair paths were confirmed readable with
`test -r` **before** their exit code was recorded, so a mis-typed path would fail loudly as a setup
error rather than quietly as a `pre_existing` red. The test list was expanded with the prescribed
`cat outside-tests.txt | xargs node --test` form — not `node --test $LIST` (zsh does not word-split)
and not `xargs -a` (GNU-only; BSD `xargs` rejects it).

## Honest residual (P0)

`/pharn-dev-regress` catches **exactly what its suite catches — nothing more.** A regression no
deterministic check covers is invisible to it. This says "no deterministically-detectable breakage
outside the feature", **never** "nothing broke".

And note what this stage structurally cannot see, which this increment demonstrated: the review's F1
defect — 24 false claims across 13 shipped grillers — was GREEN here both before and after the fix.
No gate ranges over capability prose, so the comparison was honest and uninformative about it in equal
measure. That is the residual working as documented, not a gap in this run.

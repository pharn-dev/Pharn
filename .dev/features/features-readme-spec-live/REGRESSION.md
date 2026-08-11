# REGRESSION — features-readme-spec-live

**Base:** `2b4fec89cbd68e03544b9bad4254360ee029f040` (working-tree dogfood — `git status --porcelain`
was non-empty, so the deterministic state test resolved `base = HEAD`, P5; not a model's choice).

## Partition (computed by `pharn/floor/check-regress.mjs scope`, exit 0)

**Inside (the changed scope), 4 paths:**

- `features/README.md`, `CHANGELOG.md` — the two the plan's `## Files` declared and
  `/pharn-dev-build` was pinned to.
- `.dev/features/features-readme-spec-live/PLAN.md`, `.../GRILL.md` — this feature's own pipeline
  artifacts, each written by its own stage under that stage's own Step-0 writes-scope.

**No scope breach.** `scope` exited 0: nothing changed outside the declared writes. The two artifacts
above are listed in the helper's returned `escape_exempt`, read here rather than assumed — that
exemption is the floor check L20 demanded for the false-escape class L17 documents (cited, not
restated — P4). A stray file in the feature dir, another feature's artifact, or any real source path
would still have been an escape.

**Outside:** 61 test files + 1 committed eval pair
(`trust-fence/evals/expected/expected-injection-comment.json` ↔ `.dev/features/trust-fence/findings.json`).

## Gate set and the style-gate skip

The gate set was decided **once** and applied identically at base and head (a mismatch is
`inconclusive`, never a silent pass): `tests`, `validate`, `structural:expected-injection-comment`.

The style gates (`lint` / `format:check` / `lint:md`) were **deterministically skipped**: `inside`
touches no shared style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`,
`.markdownlint-cli2.jsonc`), and over outside files that are byte-identical at base and head a style
result cannot flip. The skip also spares the baseline worktree an `npm ci` — the core gates are
stdlib-only. Absent from **both** maps, so the sets still match.

The `tests` list was expanded through `xargs` reading **stdin**, never `xargs -a` (GNU-only, which
BSD/macOS `xargs` rejects outright) and never an unquoted `$LIST` (zsh does not word-split it). Both
forms fabricate an equal-at-both-sides red that reads as `pre_existing` while masking a real
tests-gate regression — L5's failure mode and L16's correction to L5's own remedy.

## Per-gate exit codes

| gate                                    | base | head | classification |
| --------------------------------------- | ---- | ---- | -------------- |
| `tests` (61 outside files)              | 0    | 0    | stable         |
| `validate` (whole-repo)                 | 0    | 0    | stable         |
| `structural:expected-injection-comment` | 0    | 0    | stable         |

`regressions[]`: **empty.** `pre_existing[]`: **empty.**

## Verdict (FLOOR — the helper's, not this stage's)

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**
`check-regress.mjs verdict` exit **0**, `"verdict": "no-regressions"`, recorded verbatim in
`regression-report.json`.

**The honest residual (P0/P7):** this catches **exactly what its suite catches — nothing more.** A
regression no deterministic check covers is invisible to it. The claim is "deterministically-detectable
breakage outside the feature is caught," **not** "nothing broke" — and emphatically not that the
increment is good. That the verdict is floor-grade is true of the **comparison** only; choosing the
base, partitioning inside/outside, and running the suite are this stage's advisory work.

For this increment the residual is unusually wide and worth stating plainly: the change is two
sentences of English prose in a README, and **no deterministic check in the suite reads that prose**.
A green comparison here means the repo still builds and passes exactly as it did — it says nothing
about whether the reworded sentences are true. That claim rests on the live reads recorded in the
plan, and it is advisory.

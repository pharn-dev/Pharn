# REGRESSION — dev-lessons-index-gate

**Base:** `d6aa21dce00e2ee55af7d4a61005f8f27a71aa30` — auto-detected by the deterministic state test:
`git status --porcelain` was non-empty (a working-tree dogfood build), so `base = HEAD`.

## Inside / outside partition

The partition was computed by `pharn/floor/check-regress.mjs scope`, not by hand.

**Inside (5)** — the changed scope:

| path                                            | declared in `## Files`?              |
| ----------------------------------------------- | ------------------------------------ |
| `.claude/commands/pharn-dev-plan.md`            | yes                                  |
| `.claude/commands/pharn-dev-memory-promote.md`  | yes                                  |
| `.dev/floor/command-hygiene.test.mjs`           | yes                                  |
| `.dev/features/dev-lessons-index-gate/PLAN.md`  | `escape_exempt` (own-stage artifact) |
| `.dev/features/dev-lessons-index-gate/GRILL.md` | `escape_exempt` (own-stage artifact) |

**`escaped: []`** — the build wrote nothing outside its declared `## Files`. The two feature artifacts
are exempt because each was written by its own stage under that stage's own Step-0 writes-scope; they
are read from the helper's returned `escape_exempt`, not hand-excluded (**L17** / **L20**).

**Outside:** 67 tests + 1 committed eval pair. `.dev/floor/command-hygiene.test.mjs` is correctly
**absent** from the outside set — it is inside the feature, so its own new assertions cannot launder
themselves into the outside comparison.

**Eval pair confirmed readable before its exit code was recorded** (**L5** / **L16** / **L21**):
`pharn/pharn-review/trust-fence/evals/expected/expected-injection-comment.json` ↔
`.dev/features/trust-fence/findings.json`. A guessed path would have ENOENT'd to exit 1 **equally at
base and head** and been classified `pre_existing` — evading a false alarm while masking a real
structural-gate one.

## Style gates — deterministically SKIPPED, not forgotten

`inside` touches no shared style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`,
`.markdownlint-cli2.jsonc`). Over the **outside** files — byte-identical at base and head — a style
result can flip **only** when shared config changes, so the flip is provably impossible here. The gates
are absent from **both** maps, which is what keeps the gate sets identical (a mismatch would be
`inconclusive`, never a silent pass). This also avoids an `npm ci` in the baseline worktree.

## Per-gate comparison

| gate                                    | base | head | flip |
| --------------------------------------- | ---- | ---- | ---- |
| `tests` (67 outside suites)             | `0`  | `0`  | none |
| `validate` (whole-repo)                 | `0`  | `0`  | none |
| `structural:expected-injection-comment` | `0`  | `0`  | none |

The baseline came back **green on a repo believed green** — no fabricated red, so there was no harness
defect to investigate before recording the numbers.

`regressions: []` · `pre_existing: []`

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

Computed by `pharn/floor/check-regress.mjs verdict` (exit `0`), and copied into
`regression-report.json` **verbatim** — confirmed byte-identical to the helper's stdout by `diff`. The
verdict is a comparison of captured exit codes; no judgment of mine entered it.

**The honest residual (P0/P7).** This catches **exactly what the suite catches, nothing more.** The
claim is _"deterministically-detectable breakage outside the feature is caught"_ — **never** "nothing
broke". A regression no deterministic check covers is invisible here. Running the stages in order and
choosing the base and partition is **advisory orchestration**; only the exit-code comparison is floor.
This is **not** a certification that the increment is good — that is the human's call at the post-review
gate.

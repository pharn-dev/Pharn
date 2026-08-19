# REGRESSION — writes-scope-lifecycle

**Base:** `cd24dee` (`HEAD`) — resolved by the deterministic state test: `git status --porcelain` was
non-empty (a working-tree dogfood build), so `base = HEAD`.

## Partition (computed by `pharn/floor/check-regress.mjs scope`, not by judgment)

| set                   | count | note                                                                          |
| --------------------- | ----: | ----------------------------------------------------------------------------- |
| `inside`              |    29 | `git diff --name-only HEAD` + untracked-new                                   |
| declared (`## Files`) |    25 | the PLAN's back-tick paths above the exclusion heading                        |
| `outside_tests`       |    65 | test files outside the changed scope — the gate that runs                     |
| `outside_eval_pairs`  |     1 | `expected-injection-comment.json` ↔ `.dev/features/trust-fence/findings.json` |

The eval-pair paths were confirmed readable (`test -r`) **before** their exit code was recorded, so a
setup error could not have been laundered into a gate verdict (L5 / L16 / L21).

## Gate results — base → head

Style gates (`lint`, `format:check`, `lint:md`) were **skipped by the deterministic config-touch rule**:
`inside` touches none of `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`,
`.markdownlint-cli2.jsonc`, so over the byte-identical outside files a style flip is provably
impossible. They are absent from **both** maps, so the gate sets match and the verdict is not
inconclusive.

| gate                                    | base | head | result    |
| --------------------------------------- | ---: | ---: | --------- |
| `tests` (65 outside test files)         |    0 |    0 | unchanged |
| `validate` (whole-repo)                 |    0 |    0 | unchanged |
| `structural:expected-injection-comment` |    0 |    0 | unchanged |

The baseline was GREEN on every gate — a believable baseline for a repo that was clean at `cd24dee`,
and therefore not the "red baseline on a repo you believe is green" that must be investigated rather
than recorded.

## Verdict (FLOOR — `check-regress.mjs verdict`, exit 0)

```json
{ "verdict": "no-regressions", "regressions": [], "pre_existing": [] }
```

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

**The honest residual (P0/P7):** this catches **exactly what its suite catches, nothing more.** A
regression that no deterministic check covers is invisible to it. The claim is
"deterministically-detectable breakage outside the feature is caught", **never** "nothing broke".

## The `scope` escape finding — recorded, then DISPROVEN (not waved through)

`check-regress.mjs scope` exited **1** with a blocking `P0` fix#7 finding, naming two escapes:

```text
escaped:        .claude/hooks/set-writes-scope.cjs
                .claude/hooks/enforce-writes-scope.cjs
escape_exempt:  .dev/features/writes-scope-lifecycle/PLAN.md
                .dev/features/writes-scope-lifecycle/GRILL.md
```

`.dev/memory-bank/lessons-learned.md` **L17** names this exact shape — `scope` asks
**changed-since-base**, not **written-by-the-build** — and L17 is equally clear that the remedy is
**never** to wave a fix#7 escape finding through, because that is the one finding that must not become
routine. So it is disproven with evidence, all measured live this run:

1. **The agent cannot write either path.** `protect-trusted-paths.cjs` (fix #2) denies **Write, Edit and
   MultiEdit** on both files — six probes, all `exit 2`. No agent write could have produced these
   changes.
2. **The content is byte-identical to the delivered patch.** Both files `diff -q`-match the sandbox
   copies the two `.patch` records were generated from — the same bytes the human reviewed before
   applying.
3. **The PLAN excluded both deliberately**, by name, under the `### Deliberately NOT in scope` heading,
   marked **HUMAN-ONLY** with the fix #2 denial cited as the reason.

The changes were applied by a human-directed `git apply` of the two delivered diffs. That is the
designed workflow for a hook-protected file, not a scope breach.

**A real gap this exposes, stated against this increment's own plan (P6).** The `scope-file-case-guard`
precedent **pre-declared** this false positive in its PLAN by citing L17. This increment's PLAN did
**not** cite L17 and did not pre-declare it, and `GRILL.md` did not catch the omission either — so the
finding arrived unannounced and had to be disproven after the fact rather than recognized on sight.
The disproof is conclusive, but the plan should have named it in advance. Carried to `/pharn-dev-review`
as a finding against the planning stage, not against the built code.

**Also named, from `check-regress.mjs`'s own honest-scope block:** because `--feature` exempts this
feature's own artifacts, a build that rewrote its `PLAN.md` `## Files` to retroactively authorize a path
is not caught here. `PLAN.md` **is** in this diff (it was edited at GATE 1 to record the resolutions and
again after the grill), so per that instruction the edit was read: the changes were `applied_lessons`
gaining `L4`, an added L4 body line, an added H7/N1 discovery paragraph, and the open-questions block
becoming `RESOLVED`. **The `## Files` list itself was not touched** — the setter re-parsed it at
**25 paths** both before and after those edits, matching the 25 declared bullets.

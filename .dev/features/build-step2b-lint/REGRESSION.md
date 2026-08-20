# REGRESSION — build-step2b-lint

Base: **`fcf3f5b`** (`origin/main`) — chosen deliberately, and it is not the base the auto-detect rule
would have produced. `git status --porcelain` was non-empty, which selects `base = HEAD`; but HEAD on
this branch already **contains** the changes under test, so that comparison would have been vacuous.
The branch point is the last state in which this increment's files were untouched, so it is the only
base against which a flip is detectable. The baseline was measured in a detached `git worktree` at that
commit.

## Why this run exists

`SHIP.md` originally **named** the absence of a regress run as this increment's honest gap. Documenting
a gap is not closing it, so it was run. This report supersedes that paragraph.

Its scope is deliberately **branch-wide rather than increment-wide**: because everything on this branch
sits in one commit, the same base covers `validate-bad-target` and `build-step2b-lint` together. That
also makes it a **stricter** re-check of the earlier `validate-bad-target` regress run, which was
captured before these three files existed.

## Partition

**Inside: 21 paths** — both increments' source and artifact files, the promoted canon entry, and the
regenerated `docs/lessons-index.md`.

**Outside: 66 test files** (the full `*.test.{mjs,cjs}` universe minus `pharn/floor/validate.test.mjs`
and `.dev/floor/command-hygiene.test.mjs`, both of which changed and are therefore inside), the
whole-repo `validate` gate, and 1 committed eval pair. Both eval-pair paths were confirmed readable
before their exit codes were recorded.

**The `scope` sub-check was NOT run here, and that is a stated omission.** It takes a single
`--declared` list and answers "did the build escape its plan's `## Files`" for **one** increment; this
diff spans two plans plus two paths written under other stages' scopes (`lessons-learned.md` by the
gated promote command, `docs/lessons-index.md` by `docs:generate`). Run across a branch it would report
those as escapes, which they are not. The escape question was answered **per increment** where it is
meaningful: `validate-bad-target` returned `escaped: []`, and `build-step2b-lint`'s scope parsed to
exactly its 3 declared paths with `git status` confirming only those changed.

## Gate results — `base → head`

| gate                                    | base | head | flip |
| --------------------------------------- | ---- | ---- | ---- |
| `tests` (66 outside files)              | 0    | 0    | none |
| `validate` (whole-repo)                 | 0    | 0    | none |
| `structural:expected-injection-comment` | 0    | 0    | none |

Identical gate-ids on both sides, so the comparison could not be inconclusive on a set mismatch. The
baseline was green on all three.

**Style gates skipped, on both sides.** `inside` touches no shared style config, and over outside files
— byte-identical at base and head — a style result can flip only when shared config changes. Absent
from both maps, so the skip cannot mask a flip.

`regressions[]`: **empty**. `pre_existing[]`: **empty**.

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.** Computed by
`node pharn/floor/check-regress.mjs verdict` (exit **0**) from two exit-code maps;
`regression-report.json` is that helper's output verbatim.

**The honest residual (P0/P7).** This catches exactly what the suite catches — nothing more. A
regression no deterministic check covers is invisible here, and `validate` is whole-repo, so a flip in
it would have been reported at repo granularity. It certifies the **comparison**, not the feature.

# VERIFY — plan-cue-continuation

## FLOOR layer — the deterministic gates (OWNS the verdict)

| gate                                         | exit | note                                                 |
| -------------------------------------------- | ---: | ---------------------------------------------------- |
| `test`                                       |    0 | 1486/1486 — includes this feature's 3 new assertions |
| `validate`                                   |    0 | `FLOOR: GREEN — 36 capabilities checked`             |
| `lint`                                       |    0 | eslint clean, whole-repo                             |
| `format:check`                               |    0 | prettier clean, whole-repo                           |
| `lint:md`                                    |    0 | markdownlint clean, whole-repo                       |
| `structural:expected-injection-comment.json` |    0 | the one committed eval pair                          |

Both eval-pair paths were confirmed readable (`test -r`) **before** their exit codes were recorded, so a
setup error could not be laundered into a gate verdict (L5 / L16 / L21).

## Verdict (FLOOR — `check-verify.mjs`, exit 0)

**VERIFIED: floor gates PASS.**

```json
{ "verdict": "PASS", "failing_gates": [] }
```

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}` — **no verifiers registered;
floor gates only.** Membership is a deterministic frontmatter read, never a prose grep. Step 2 is a no-op
and the verdict is the floor gates alone (P7 — none authored speculatively).

## Verification route (L26), and the control that makes the PASS mean something

`set-writes-scope.cjs` is hook-protected and on its own `CONTROL_SURFACE`, so the change was built and
verified **at the real path**: a third detached `git worktree` of this repo carrying the full working-tree
state, the change applied there, `node_modules` symlinked in, then `npm run check` → **exit 0, 1486/1486**,
with eslint and prettier clean on both changed files. The landed setter hashes
`a2bd020306565208c0fad184c366840eb4f4d9bc103d2b20c78eab4701f475b2`, identical to that worktree copy — the
verified bytes and the live bytes are the same bytes.

**Negative control.** Reverting **only** the setter change fails **2 of the 3** new assertions — the
wrapped-line case and the other-cue-alternatives case. The third passes in both directions **by design**,
and that is the interesting one:

> **The blank-line test is an invariance pin against a fix that was never written.** The obvious
> implementation — "exempt every indented line from the cue" — fails **OPEN**: an indented exclusion
> sub-list would enter scope, which is the [[L7]] direction, the dangerous one. The shipped exemption is
> stateful instead (a blank line closes an item's body), and that test exists to hold the line there. It
> passing before and after is not weak coverage; it is the assertion doing its job, and its job is to fail
> if someone later "simplifies" the parser.

## What "VERIFIED" means here, and what it does not (P0)

- **It means:** the six named gates exited 0 with this feature present.
- **It does NOT mean** the parser is now correct for markdown. It removes one known way the cue under-reads
  and leaves a stated one — a **lazy** continuation (an unindented line continuing a paragraph) still trips
  it. That bound is written into the code comment, not only here.
- **The verdict is whole-repo**, so PASS requires the whole repo clean, not just this increment's files.
- **The gate SET is advisory orchestration** — `check-verify.mjs` is generic over gate keys; nothing
  floor-locks the style gates into the map (L9's remedy lives in this orchestration layer, by design).

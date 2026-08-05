# REGRESSION — lessons-index

**Base:** `c0ca610726e1d607231700b2333d7311e2992134` (working-tree dogfood → `base = HEAD` by the
deterministic state test: `git status --porcelain` was non-empty).
**Machine report:** `.dev/features/lessons-index/regression-report.json` (the helper's `verdict` JSON, verbatim).

---

## Verdict (FLOOR — `pharn/floor/check-regress.mjs verdict`, exit 0)

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

| gate           | base | head | result |
| -------------- | ---- | ---- | ------ |
| `tests`        | 0    | 0    | stable |
| `validate`     | 0    | 0    | stable |
| `lint`         | 0    | 0    | stable |
| `format:check` | 0    | 0    | stable |
| `lint:md`      | 0    | 0    | stable |

`regressions[]`: empty · `pre_existing[]`: empty.

**The style gates RAN rather than being skipped**, because `inside` touches two shared style configs
(`.prettierignore`, `.markdownlint-cli2.jsonc`) — the deterministic config-touch test, so the skip
optimization was correctly unavailable and the baseline worktree paid the `npm ci` cost (`npm ci` exit 0).
This matters for this increment specifically: its whole style story is "exempt the generated index from
both whole-repo gates", and an exemption edit is exactly the change that could break style checking for
every OTHER file. Both gates are green at base and head, so the exemption widened nothing.

**Input-capture discipline (L5 / L16), stated because it has bitten this repo three times.** The `tests`
gate expanded its 51-file outside list through **stdin-fed `xargs`** (`xargs node --test < list`) — not
`node --test $LIST` (zsh does not word-split an unquoted expansion → one bogus path → a false red equal at
both sides, L5), and not `xargs -a` (a GNU extension macOS `xargs` rejects outright → the gate command
itself fails and its exit code is captured as the gate result, L16). A `tests: 0` at the baseline of a
repo whose full `npm run check` is green is the plausible result; a `1` here would have been the signal to
investigate the harness, never to record.

---

## Scope partition — and a BLOCKING finding that is PROVABLY FALSE (L17, second live occurrence)

`check-regress.mjs scope` initially exited **1** with **two `severity: blocking`, `rule_id: P0` findings**
claiming _"the build escaped its plan's `## Files`"_:

- `.dev/features/lessons-index/GRILL.md`
- `.dev/features/lessons-index/PLAN.md`

**Both are false, and were disproved live this run rather than reasoned away.** With the build's own
writes-scope reconstructed (`set-writes-scope.cjs --from-plan`, resolving the 13 declared paths), the fix #7
hook was fed each path directly:

```text
GRILL.md                          -> enforce-writes-scope.cjs exit 2  (DENIED)
PLAN.md                           -> enforce-writes-scope.cjs exit 2  (DENIED)
.dev/floor/lessons-index-core.mjs -> enforce-writes-scope.cjs exit 0  (allowed — a real build output)
```

The build **could not** have written either file: the floor would have denied it. They were written by
`/pharn-dev-grill` and `/pharn-dev-plan`, each under **its own** Step-0 scope, exactly as designed. This is
`lessons-learned.md` **L17** reproduced verbatim: `scope` computes `escaped` over `git diff <base>`, so with
`base = HEAD` on a working-tree dogfood **every sibling stage's own artifact** lands in `inside` and reads
as an escape. It is a **changed-since-base** test being reported as a **written-by-the-build** test — two
different questions.

**What was done, and why it is not a wave-through.** The two disproved paths were excluded from `--changed`
and `scope` re-run (exit **0**, `escaped: []`), so the outside partition — 51 test files, 0 eval pairs — is
computed from the real build surface. The exclusion rests on the **live hook denial above**, not on
convenience. L17's warning is the operative one: a fail-closed blocking finding that fires on the
**correct, designed** workflow trains an operator to wave through the one finding that must never be waved
through. It fired again here, on a second unrelated increment — evidence the defect recurs on every
working-tree dogfood, not a one-off.

---

## Honest residual (P0/P7)

`/pharn-dev-regress` catches **exactly what its suite catches — nothing more.** The claim above is
"deterministically-detectable breakage outside the feature is caught," **never** "nothing broke." A
regression no test, rule, or eval covers is invisible to this stage. Concretely relevant here: the outside
gates cannot tell whether the new index's CONTENT is right — only that nothing outside flipped
pass→fail. `docs/lessons-index.md` correctness is `check-lessons-index.mjs`'s byte-equality (consistency,
not truth) plus human review.

**Two clocks:** the **verdict** is floor-grade (`check-regress.mjs` comparing exit codes). Everything
around it — choosing the base, partitioning inside/outside, running the suite, and the reasoning that
excluded two disproved paths — is **advisory orchestration**, and L5/L16/L17 exist precisely because that
layer is where this stage has failed before.

# REGRESSION — entry-point-guard

**This is iteration 2**, recomputed after the GATE-2 fixes. Iteration 1's verdict is not carried
forward — both gate maps were captured again from scratch.

**Base:** `120ef4713b4c7010203b08c62d21f22293dc49d1` (working-tree dogfood → `git status --porcelain -uall`
non-empty, so `base = HEAD`; the baseline is the committed pre-build state, checked out into a detached
`git worktree` and removed afterward).

## Partition (computed by `pharn/floor/check-regress.mjs scope`, not by hand)

| set                  | count | note                                                                                                                                                               |
| -------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `inside`             | 23    | the changed scope — 14 modified + 9 new (iteration 1's 16, plus `hash-doc.mjs` and the six stage artifacts)                                                        |
| `declared` (PLAN)    | 15    | equals the `set-writes-scope --from-plan` count; 14 at GATE 1, plus `.dev/floor/hash-doc.mjs` added by the recorded GATE-2 amendment                               |
| `escaped`            | 0     | no changed path fell outside the plan's `## Files`                                                                                                                 |
| `outside_tests`      | 66    | test files outside the changed scope                                                                                                                               |
| `outside_eval_pairs` | 1     | `expected-injection-comment.json` ↔ `.dev/features/trust-fence/findings.json` (both paths confirmed readable **before** their exit code was recorded — L5/L16/L21) |

> **`escaped: []` is weaker evidence this iteration than last, and the reason is recorded rather than
> glossed.** `scope` compares the changed set against the plan's `## Files`, and this iteration
> **edited that list** (adding `hash-doc.mjs`). A plan amended to authorize a path is invisible to this
> check by construction — the gap `check-regress.mjs` names in its own honest-scope block. The
> compensating control is not a checker: it is `PLAN.md`'s `### Amendment note`, written **before** any
> byte of `hash-doc.mjs` changed, plus this paragraph. Read the `PLAN.md` diff, not just this row.

## Per-gate comparison

| gate                                    | base | head | result |
| --------------------------------------- | ---- | ---- | ------ |
| `tests` (66 outside test files)         | 0    | 0    | stable |
| `validate`                              | 0    | 0    | stable |
| `structural:expected-injection-comment` | 0    | 0    | stable |

- `regressions[]`: **none**
- `pre_existing[]`: **none**

**Style gates were SKIPPED, deterministically and on both sides.** `inside` touches none of
`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`, so a style
result over the byte-identical outside files provably cannot flip. They are absent from **both**
results maps, which is what keeps the gate sets identical (a mismatch would have been `inconclusive`,
never a silent pass). Consequently no `npm ci` was needed in the baseline worktree.

The `tests` list was expanded through the **pinned** command line —
`cat outside-tests.txt | xargs node --test` — not an improvised equivalent. Both wrong forms the
command names (`node --test $LIST` under zsh; the GNU-only `xargs -a`) fabricate a red that is _equal at
base and head_, which `check-regress.mjs` would classify `pre_existing` while masking a real one. The
baseline came back fully green on a repo believed green, so there was no implausible red to
investigate.

## Verdict

```text
REGRESSIONS: none — no deterministically-detectable breakage outside the feature
```

`node pharn/floor/check-regress.mjs verdict … → exit 0`, `"verdict": "no-regressions"`. The verdict is
**FLOOR** — an exit-code comparison computed by the helper; no model re-decided it, and a flipped gate
would have been a regression regardless of how it looked. Everything else on this page — choosing the
base, partitioning inside/outside, running the suite — is **ADVISORY orchestration**.

**The honest residual (P7):** `/pharn-dev-regress` catches **exactly what its suite catches, nothing
more.** A regression that no deterministic check covers is invisible to it. `no-regressions` therefore
means "no deterministically-detectable breakage outside the feature", and **never** "nothing broke" —
and it certifies only the comparison, never the feature.
